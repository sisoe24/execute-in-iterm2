import * as vscode from "vscode";
import {
    executeFileCommand,
    executeInputCommand,
    resetTabsId,
    executeOpenCommand,
} from "./send_to_iterm";

import * as utils from "./utils";

/**
 * Register the extensions of the files commands.
 *
 * This will create a list of extensions which can be used in a `when-clause-context`
 * for enabling/disabling the button in the editor toolbar.
 *
 * Basically: If `resourceExtname` is in the list of the file commands extensions,
 * then show the button, otherwise do not.
 */
function registerExtensions() {
    const fileExtensions = [];
    for (const fileExt of Object.keys(utils.extensionConfig("fileCommands") as {})) {
        fileExtensions.push(`.${fileExt}`);
    }
    // https://code.visualstudio.com/api/references/when-clause-contexts#in-conditional-operator
    vscode.commands.executeCommand("setContext", "ext.supportedFiles", fileExtensions);
}

export function activate(context: vscode.ExtensionContext): void {
    resetTabsId();
    registerExtensions();

    context.subscriptions.push(
        vscode.commands.registerCommand("execute-in-iterm2.openDirectory", (uri: vscode.Uri) => {
            executeOpenCommand(uri);
        })
    );

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
