import {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    CompletionItemKind,
    TextDocumentSyncKind,
    InitializeParams,
    InitializeResult,
    TextDocumentPositionParams,
    CompletionItem,
    HoverParams,
    Hover,
    SignatureHelpParams,
    SignatureHelp
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

// 初始化连接对象
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
    connection.window.showInformationMessage("hello Synthesizer V");
    const result: InitializeResult = {
        capabilities: {
            hoverProvider: true,
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // completionProvider: {
            //     resolveProvider: true,
            // },
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
connection.onSignatureHelp(
    (params: SignatureHelpParams): Promise<SignatureHelp> => {
        return Promise.resolve({
            signatures: [
                {
                    label: "JavaScript",
                    documentation: "Javascript documentation"
                }
            ],
            activeSignature: 0,
            activeParameter: 0
        })
    }
)
connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
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
    }
);
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
connection.onHover((params: HoverParams): Promise<Hover> => {
    return Promise.resolve({
        contents: ["Hover demo"]
    })
})
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// 监听连接
connection.listen();
