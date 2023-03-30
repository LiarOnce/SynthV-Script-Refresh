const {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    CompletionItemKind,
    TextDocumentSyncKind
} = require("vscode-languageserver");
const { TextDocument } = require("vscode-languageserver-textdocument");

// 初始化连接对象
let connection = createConnection(ProposedFeatures.all);
let documents = new TextDocuments(TextDocument);

connection.onInitialize((params) => {
    connection.window.showInformationMessage("hello Synthesizer V");
    const result = {
        capabilities: {
            hoverProvider: true,
            textDocumentSync: TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
            },
            signatureHelpProvider: {
                triggerCharacters: ["("],
            }
        },
    };
    return result;
});

connection.onDidChangeWatchedFiles((_change) => {
    // Monitored files have change in VSCode
    connection.console.log("hello");
});
// 初始化代码提示列表
connection.onCompletion((_textDocumentPosition) => {
    return [
        {
            label: "JavaScript",
            kind: CompletionItemKind.Text,
            data: 1,
        },
        {
            label: "Lua",
            kind: CompletionItemKind.Text,
            data: 2,
        },
    ];
});
// 当选中某个代码提示的选项时提示详情信息
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = "JavaScript details";
        item.documentation = "JavaScript documentation1";
    } else if (item.data === 2) {
        item.detail = "Lua details";
        item.documentation = "Lua documentation1";
    }
    return item;
});
connection.onHover((item) => {
    return item.resolve({
        contents: ["Hover demo"]
    })
})
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// 监听连接
connection.listen();
