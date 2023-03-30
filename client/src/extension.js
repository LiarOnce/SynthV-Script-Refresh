const path = require("path");
const { workspace } = require("vscode");
const {
    TransportKind,
    LanguageClient
} = require("vscode-languageclient");
let client;

console.log('client')
function activate(context) {
    let serverModule = context.asAbsolutePath(path.join('server', 'src', 'server.js'));
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    let serverOptions = {
        // 运行时参数
        run: {
            module: serverModule,
            transport: TransportKind.ipc
        },
        // 调试时参数
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };
    let clientOptions = {
        documentSelector: [
            // 为 JS 和 Lua 注册语言服务器
            { scheme: 'file', language: 'js' },
            { scheme: 'file', language: 'lua' }
        ],
        synchronize: {
            // 在“.clientrc文件”的文件更改通知服务器，如果不想校验这个代码可以在这里配置
            // fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    // 创建客户端
    client = new LanguageClient('languageServerExample', 'Language Server Example', serverOptions, clientOptions);
    // 启动
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;