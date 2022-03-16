import * as vscode from "vscode";
import { executeFileCommand, executeInputCommand, resetTabsId } from "./send_to_iterm";

export function activate(context: vscode.ExtensionContext): void {
    resetTabsId();

    context.subscriptions.push(
        vscode.commands.registerCommand("execute-in-iterm2.executeFileCommand", () => {
            executeFileCommand();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("execute-in-iterm2.executeInputCommand", () => {
            executeInputCommand();
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
