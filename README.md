# vscode-plugins
write some vs code plugins

## 工具使用说明
1. npm镜像加速：`npm config set registry https://registry.npm.taobao.org`
2. yo工具安装：`npm install -g yo generator-code`
    - 使用`yo code`
3. 发布工具安装：`npm install -g vsce`
    - 记住token，`vsce login <publisher.name.seem.can.be.anything>`
    - 发布到商店
        - `vsce publish [-p <token>]`，版本号由配置`package.json`决定
        - `vsce publish minor`，第二位版本号加一。1.0.0 => 1.1.0
        - `vsce publish 2.0.1`
    - 本地打包成`.vsix`，`vsce package`
        - 安装`code --install-extension <myextension>.vsix`
    - 取消发布：`vsce unpublish <publisher name>.<extention name>`
4. 其他
    1. 扩展路径
        - Windows `%USERPROFILE%\.vscode\extensions`
        - macOS `~/.vscode/extensions`
        - Linux `~/.vscode/extensions`
    2. 文档，可以在帮助里直接点文档，会跳转的网页上