"use strict";
import * as vscode from "vscode";
import * as utils from "./utils";
var sys_username = "$username";

export function activate(context: vscode.ExtensionContext) {
    // 到底做错了什么，为啥商店安装的要单独执行npm install 命令才有用。
    var getusername = require("username");
    //sys_username = getusername.sync();
    getusername().then(username => {
        console.log("you account name is " + username);
        sys_username = username;
    });

    utils.registerCommand(context,"onemore.fileEditor.insertFileHeaderComment",() => {
        insertFileHeaderComment(false);
    })
    vscode.workspace.onWillSaveTextDocument(event => {
        let _workspace = vscode.workspace;
        var conf = _workspace.getConfiguration("onemore.fileHeaderComment");
        var auto_save = conf.get("auto_insert_when_save",false) as boolean;
        if(auto_save)
        {
            insertFileHeaderComment(true);
        }
    })
}

// wtf can not debug
// > https://github.com/Gigabyte-Giant/vscode-file-header-comment-helper
function insertFileHeaderComment(trigger_by_auto_save:boolean) {
    let _workspace = vscode.workspace;
    let _window    = vscode.window;
    let _editor    = _window.activeTextEditor;
    let _root      = _workspace.rootPath;

    if (_root == undefined && _editor == undefined) {
        return;
    }

    var conf = _workspace.getConfiguration("onemore.fileHeaderComment");

    var block_comment = conf.get("block_comment",{}) as Object;
    var comment_begin = "/*";
    var comment_end = "*/";
    var languageId = _editor.document.languageId;
    if(block_comment[languageId] == undefined)
    {
        if(trigger_by_auto_save)
        {
            return;
        }
        console.error("fileEditor: miss block comment for "+languageId);
        // BlockCommentConfMiss(languageId)
        // return;
    }
    else
    {
        comment_begin = block_comment[languageId][0];
        comment_end = block_comment[languageId][1];
    }

    var flag = conf.get("flag","header") as string;
    var template_create = conf.get("template_create",[]) as Array<String>;
    var template_modify = conf.get("template_modify",[]) as Array<String>;
    var user_name = conf.get("user_name","") as string;
    var date_format = conf.get("date_format","yyyy-mm-dd 星期几 HH时MM分ss秒") as string;
    if(user_name.length == 0)
    {
        user_name = sys_username;
    }
    var file_name = _editor.document.fileName.replace(/\\/g,'/');
    file_name = file_name.substring(file_name.lastIndexOf("/")+1,file_name.length);
    var datetime = utils.getNowDateStr(date_format);

    var replace_arr = [
        ["$user_name",user_name],
        ["$file_name",file_name],
        ["$datetime",datetime],
    ];

    var replace_func = function(content:string):string
    {
        replace_arr.forEach(element => {
            while(content.includes(element[0]))
            {
                content = content.replace(element[0],element[1]);
            }
            //content = string.replace() 也是醉了
        });
        return content;
    };

    var check_comment_begin = function():boolean
    {
        // check flag
        comment_begin += flag;
        var content_header = _editor.document.getText(
            new vscode.Range(
                new vscode.Position(0,0),
                new vscode.Position(0,comment_begin.length)
            ));
        //console.log("txt:" + content_header);
        var use_modify = content_header.startsWith(comment_begin);
        return use_modify;
    }

    var add_create_comment = function()
    {
        var comment_all = comment_begin+"\n" + template_create.join("\n") + "\n" + comment_end + "\n";
        comment_all = replace_func(comment_all);
        _editor.edit((edit) => {
            edit.insert(new vscode.Position(0, 0), comment_all);
        });
    }

    var find_comment_end_line = function():number
    {
        var all_lines = Math.min(_editor.document.lineCount
            , template_create.length + template_modify.length + 3);
        var end_line = template_create.length + 1;
        for(; end_line < all_lines; end_line++)
        {
            var line_txt = _editor.document.lineAt(end_line).text;
            var end_column = line_txt.indexOf(comment_end);
            if(end_column >= 0)
            {
                return end_line;
            }
        }
        return -1;
    }
    
    if(check_comment_begin() == false)
    {
        add_create_comment();
    }
    else
    {
        // keep create comment, add or update modify comment
        var comment_end_line = find_comment_end_line();
        var create_lines = template_create.length + 1;
        if(comment_end_line >= create_lines)
        {
            var start_pos = new vscode.Position(create_lines,0);
            var end_pos = new vscode.Position(comment_end_line+1,0);
            var range = new vscode.Range(start_pos, end_pos);
            
            var comment = template_modify.join("\n") + "\n" + comment_end + "\n";
            comment = replace_func(comment);

            _editor.edit((edit) => {
                edit.replace(range, comment);
            });
        }
        else if (trigger_by_auto_save)
        {
            return;
        }
        else
        {
            add_create_comment();
        }
    }

    //vscode.commands.executeCommand("workbench.action.files.save");
}

function BlockCommentConfMiss(language:string) {
        var openGlobalSettingsItem: vscode.MessageItem = {
            "title": "Open Global Settings"
        };
        var openWorkspaceSettingsItem: vscode.MessageItem = {
            "title": "Open Workspace Settings"
        };
        
        vscode.window.showErrorMessage(
            ("Unable to locate block-comment for " +
            language + "."),
            openGlobalSettingsItem, openWorkspaceSettingsItem
        ).then((selectedItem: vscode.MessageItem) => {
            if (selectedItem === openGlobalSettingsItem) {
                vscode.commands.executeCommand(
                    "workbench.action.openGlobalSettings"
                );
            } else if (selectedItem === openWorkspaceSettingsItem) {
                vscode.commands.executeCommand(
                    "workbench.action.openWorkspaceSettings"
                );
            }
        });
}