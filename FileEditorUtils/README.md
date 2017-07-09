# 文件编辑工具
[github](https://github.com/Gigabyte-Giant/vscode-file-header-comment-helper)

## 1. 添加文件开头注释
```
/*header
    > File Name: $file_name
    > Create Time: $datetime
    > Athor: $user_name
    > -----
    > Last Modified: 2017-07-07 星期五 17时27分27秒
    > Modified By: $user_name
    > -----
*/
```
配置：
1. template_create 创建注释 字符串数组
2. template_modify 修改注释 字符串数组
3. block_comment= `[language]["/*","*/"]` 块注释开头结尾，默认尝试获取vscode的配置
3. 其他
    1. date_format=`yyyy-mm-dd 星期几 HH时MM分ss秒`
        - 使用`dateformat`模块，格式参考之
        - 特别的：`星期几`替换`星期[日一二三四五六]`

模版变量`$name`：
1. file_name
2. user_name 可以配置
3. datetime