"use strict";
import * as vscode from "vscode";
var dateFormat = require('dateformat');

export function registerCommand(context: vscode.ExtensionContext, name: string, func: (...args: any[]) => any) {
    let command = vscode.commands.registerCommand(
        name,
        func
    );
    context.subscriptions.push(command);
}

export function getNowDateStr(format:string) {
    const now = new Date();
    const week_day = now.getDay();
    const weekDays = "日一二三四五六";
    format = format.replace("星期几","星期"+weekDays[week_day]);
    let text = dateFormat(now, format);
    return text;
}