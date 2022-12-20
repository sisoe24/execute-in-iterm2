import * as path from "path";
import * as vscode from "vscode";
import { exec } from "child_process";
import { writeFileSync } from "fs";

import * as utils from "./utils";

const scriptsPath = path.resolve(__dirname, "../scripts");
const sendScript = path.join(scriptsPath, "send_iterm.py");

/**
 * Reset tabs id every time vscode reloads.
 *
 * This is to keep clean the file of old files.
 */
export function resetTabsId() {
    writeFileSync(path.join(scriptsPath, "tabs_id.json"), "{}");
}

/**
 * Get the file command.
 *
 * Get the file command specified in the settings based on the current active
 * file extension.
 *
 * @param fileExt the current active file extension.
 * @returns the command or null if no command is found.
 */
function getFileCommand(fileExt: string): string | null {
    const command = utils.extensionConfig("fileCommands") as { [key: string]: string };
    if (Object.prototype.hasOwnProperty.call(command, fileExt)) {
        return command[fileExt];
    }
    return null;
}

/**
 * Replace placeholders inside the terminal command.
 *
 * User can construct the command with various placeholders, that must be converted
 * before sending it to iTerm2. If no placeholders are found, the command is returned
 * intact, so wrong placeholders will be kept.
 *
 * @param terminalCmd the terminal command to parse for placeholders
 * @param filePath the file path of the active text edit file.
 * @returns the terminal command.
 */
function replacePlaceholders(terminalCmd: string, filePath: string): string {
    const fileName = path.basename(filePath);
    const placeholders: { [key: string]: string } = {
        "${dir}": path.dirname(filePath),
        "${filePath}": filePath,
        "${fileName}": fileName,
        "${fileNameNoExt}": fileName.replace(/\.\w+$/, ""),
    };

    const placeholderMatch = terminalCmd.match(/\$\{(dir|filePath|fileName|fileNameNoExt)\b\}/g);
    if (!placeholderMatch) {
        return terminalCmd;
    }

    placeholderMatch.forEach((placeholder) => {
        terminalCmd = terminalCmd.replace(placeholder, placeholders[placeholder]);
    });

    return terminalCmd;
}

/**
 * Send command to iTerm2.
 *
 * Send the command to iTerm2 to be executed. If errors happens when sending the
 * command, an error dialog will be shown to user. Also if settings
 * `executeInITerm2.pythonPath` is not set, method will  stop and return null.
 *
 * @param terminalCmd the terminal command to send.
 * @returns null if it did not sent the code, true if succeeded.
 */
export function executeInIterm(terminalCmd: string): boolean | null {
    const python = utils.extensionConfig("pythonPath") as string;
    if (!python) {
        vscode.window.showErrorMessage("Setting `Execute In ITerm2: Python Path` was not set.");
        return null;
    }

    exec(`"${python}" ${sendScript} "${terminalCmd}"`, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(error.message);
            return null;
        }
        if (stderr) {
            vscode.window.showErrorMessage(stderr);
            return null;
        }
        // XXX: can use stdout for something?
    });
    return true;
}

/**
 * Execute a file command.
 *
 * Execute the file command based on configuration settings and file extension.
 * If current active file has no command assign to it, then will return `null`
 * and display an error message. Otherwise will proceed replacing the
 * placeholders and send the command to iTerm2.
 *
 * @returns true if succeeded or null if was terminated before sending to iTerm2.
 */
export function executeFileCommand(): boolean | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return null;
    }

    const filename = editor.document.fileName;
    const fileExt = path.extname(filename).replace(".", "");

    const terminalCmd = getFileCommand(fileExt);
    if (!terminalCmd) {
        vscode.window.showErrorMessage(
            `Terminal command for file extension "${fileExt}" was not defined.`
        );
        return null;
    }

    return executeInIterm(replacePlaceholders(terminalCmd, filename));
}

/**
 * Execute the input command.
 *
 * Show a input dialog box to user and send the received text as a command to
 * iTerm2.
 *
 * **Note**: No placeholders are converted in this method.
 */
export async function executeInputCommand(): Promise<boolean | null> {
    const terminalCmd = await vscode.window.showInputBox();
    if (terminalCmd) {
        return executeInIterm(terminalCmd);
    }
    return false;
}
