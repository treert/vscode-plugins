"use strict";
import * as vscode from "vscode";
import * as utils from "./utils";
var dateFormat = require('dateformat');
// const moment = require("moment");
// require("moment/min/locales.min");
var username = require("username");

let window = vscode.window;
let configPrefix: String = "fileHeaderCommentHelper";

export function activate(context: vscode.ExtensionContext) {
    utils.registerCommand(context,"onemore.hello.hello",hello)
    utils.registerCommand(context,"onemore.hello.insertDateTime",insertDateTime)
}

function hello() {
    vscode.window.showInformationMessage('Hello '+username.sync());
}

function getWeek(day) {
    const weekDays = "日一二三四五六";
    return weekDays[day]
}

function insertDateTime() {
  const editor = window.activeTextEditor;
  const selections = editor.selections;
  const now = new Date();
  const week_day = now.getDay();
  let text = dateFormat(now, "yyyy-mm-dd 星期"+getWeek(week_day)+" HH时MM分ss秒");

//   moment.locale("zh-cn");
//   text = moment().format('LLLL');

  editor.edit((editBuilder) => {
    selections.forEach((selection) => {
      editBuilder.replace(selection, '');
      editBuilder.insert(selection.active, text);
    });
  });
}