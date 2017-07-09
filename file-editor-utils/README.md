# 文件编辑工具
[github source](https://github.com/treert/vscode-plugins/tree/master/file-editor-utils)

## 1. 添加文件开头注释
```
/*header
    > File Name: $file_name
    > Create Time: $datetime
    > Athor: $user_name
    > -----
    > Last Modified: $datetime
    > Modified By: $user_name
    > -----
*/
```
使用:
1. `Ctrl+Shift+P`,搜索`Insert Header Comment`
2. 快捷键:`ctrl+alt+H ctrl+alt+H`

特点或限制：
1. 模板对所有的语言一样，除了块注释符
2. 文件保存时，自动更新或插入注释【条件是block_comment里配置了对于的语言】

配置：
1. template_create 创建注释 字符串数组
2. template_modify 修改注释 字符串数组
3. block_comment= `[language_*]["/*","*/"]` 块注释开头结尾，vscode没有提供获取语言配置的接口，蛋疼。
4. date_format=`yyyy-mm-dd 星期几 HH时MM分ss秒`
    - 使用`dateformat`模块，格式参考之
    - 特别的：`星期几`替换`星期[日一二三四五六]`
5. auto_insert_when_save 是否在保存时自动添加，默认是false。
6. user_name 用户名，默认使用`username`取到的名字。

模版变量`$name`：
1. file_name
2. user_name
3. datetime

## 坑
1. 我做错了什么，为什么别人的没有事，一定是这个vscode的错
    1. 插件商店直接搜索安装，提示找不到命令。最终发现在插件目录执行`npm install`，然后就好了~~
2. 其他
    1. 开发时不要使用`cnpm install`，安装了些软连接文件夹，复制到插件目录，不生效。马丹，改了不少文件名。
       可以设置npm使用淘宝链接`npm config -g set registry https://registry.npm.taobao.org/`。

## dependencies

This extension uses the following npm packages:
* [`username`](https://github.com/sindresorhus/username) to get the default author name.


