import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand(
        'ai.openWebview',
        () => {

            const panel = vscode.window.createWebviewPanel(
                'aiPanel',
                'AI Assistant',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.file(path.join(context.extensionPath, 'media'))
                    ]
                }
            );

            panel.webview.html = getWebviewContent(panel, context);

            panel.webview.onDidReceiveMessage(async (message) => {

                if (message.command === "askAI") {

                    const prompt = message.text;

                    // TEMP response (replace later with OpenAI / Python call)
                    const response = `AI Response for: ${prompt}`;

                    // Send response back to UI
                    panel.webview.postMessage({
                        command: "aiResponse",
                        text: response
                    });

                }

            });
        }
    );

    context.subscriptions.push(disposable);
}


function getWebviewContent(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
): string {

    const htmlPath = path.join(context.extensionPath, 'media', 'webview.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', 'webview.js'))
    );

    const styleUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', 'webview.css'))
    );

    html = html
        .replace('{{scriptUri}}', scriptUri.toString())
        .replace('{{styleUri}}', styleUri.toString());

    return html;
}