[![Codacy Badge](https://app.codacy.com/project/badge/Grade/de4f5f35d20642d0b84d60d5eae941d9)](https://www.codacy.com/gh/sisoe24/execute-in-iterm2/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sisoe24/execute-in-iterm2&amp;utm_campaign=Badge_Grade)
[![DeepSource](https://deepsource.io/gh/sisoe24/execute-in-iterm2.svg/?label=active+issues&show_trend=true&token=_61Aj0xbCTjjbxPEod668-Ay)](https://deepsource.io/gh/sisoe24/execute-in-iterm2/?ref=repository-badge)

[![vscode-marketplace](https://img.shields.io/badge/vscode-marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2)
[![vscode-version](https://img.shields.io/visual-studio-marketplace/v/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2&ssr=false#version-history)
[![vscode-installs](https://img.shields.io/visual-studio-marketplace/i/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2)
[![vscode-ratings](https://img.shields.io/visual-studio-marketplace/r/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2&ssr=false#review-details)
[![vscode-last-update](https://img.shields.io/visual-studio-marketplace/last-updated/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2)

[![openvsx-marketplace](https://img.shields.io/badge/openvsx-marketplace-C160EF)](https://open-vsx.org/extension/virgilsisoe/execute-in-iterm2)
[![openvsx-version](https://img.shields.io/open-vsx/v/virgilsisoe/execute-in-iterm2?label=version)](https://open-vsx.org/extension/virgilsisoe/execute-in-iterm2/changes)
[![openvsx-downloads](https://img.shields.io/open-vsx/dt/virgilsisoe/execute-in-iterm2)](https://open-vsx.org/extension/virgilsisoe/execute-in-iterm2)
[![openvsx-rating](https://img.shields.io/open-vsx/rating/virgilsisoe/execute-in-iterm2)](https://open-vsx.org/extension/virgilsisoe/execute-in-iterm2/reviews)

# 1. Execute in iTerm2 README

Execute commands inside [iTerm2](https://iterm2.com/index.html) based on the file extension or input dialog from Visual Studio Code.

- [1. Execute in iTerm2 README](#1-execute-in-iterm2-readme)
  - [1.1. Requirements](#11-requirements)
  - [1.2. Features](#12-features)
  - [1.3. Usage](#13-usage)
  - [1.4. Execute file command \& placeholders](#14-execute-file-command--placeholders)
    - [1.4.1. Placeholders](#141-placeholders)
  - [1.5. Available Extension Commands](#15-available-extension-commands)
  - [1.6. Extension Settings](#16-extension-settings)
  - [1.7. Known Issues](#17-known-issues)
  - [1.8. TODO](#18-todo)
  - [1.9. Demo](#19-demo)

![File Command](/images/file_command2.gif)

## 1.1. Requirements

The extension setting *iTerm2: Python Path* must contain a valid Python interpreter with the `iterm2` and `pyobjc` modules.

- If you don't have it already installed, from iTerm2 application, go to: **Scripts > Manage > Install Python Runtime** and let iTerm2 install the python interpreter which can be found in `~/Library/ApplicationSupport/iTerm2/iterm2env/versions/*/bin/python3`.
- Alternatively, you can create your environment and install the `iterm2` module from `pip`. Installing the package should also take care of `pyobjc` since it is a dependency.

> More information on the official documentation: <https://iterm2.com/python-api/tutorial/running.html>

## 1.2. Features

- Send commands to iTerm2 based on the current file extension.
- Send commands to iTerm2 from the input dialog.
- New iTerm2 window context menu option in the Explorer files.

## 1.3. Usage

- With an active file, use one of the commands provided from the Command Palette or use the button in the editor toolbar in the top right of the window:

![screenshort](/images/screenshot.jpg)

>Note: The button is available only for the file extensions which already have a command declared.

## 1.4. Execute file command & placeholders

The extension offers to ability to create a command based on the file extension.
Basically, for this file extension, execute this command, with the command representing what you would write in the terminal.

Some default commands are available, but you can also define your own or modify the existing ones. (more on [extension settings](#16-extension-settings))

> **Note:** The examples below will include some [placeholders](#141-placeholders) which are part of the extension.

A simple command

```json
{
    "py": "python ${filePath}"
}
```

A more complex command

```json
{
    "cpp": "cd ${dir} && g++-9 ${fileName} -o ${fileNameNoExt}.cxx && ./${fileNameNoExt}.cxx"
}
```

It is also possible to create commands for non-programming languages:

```json
{
    "log": "tail -f ${filePath}"
}
```

### 1.4.1. Placeholders

Some convenient placeholders are available for writing commands:

- `${dir}`: The directory of the currently active file.
- `${filePath}`: The full path of the currently active file.
- `${fileName}`: The filename of the currently active file.
- `${fileNameNoExt}`: The filename with no extension of the currently active file.

> NOTE: Placeholders will not work when sending a command via the input box.

## 1.5. Available Extension Commands

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing in one of the following Command Name:

By default, the extension does not provide any shortcut. But you can assign each command to one.(see [Key Bindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings) for more information).
| Command Name                    | Command ID                              | Description                                                       |
| ------------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| `iTerm2: Execute file command`  | `execute-in-iterm2.executeFileCommand`  | Send command based on file type                                   |
| `iTerm2: Execute input command` | `execute-in-iterm2.executeInputCommand` | Send command from input dialog                                    |
|                                 | `execute-in-iterm2.openDirectory`       | Open iTerm2 window in the selected directory via the context menu |

- `iTerm2: Execute file command` can be access also via a button in the Editor Toolbar.

Example `keybindings.json`:

```json
[
  {
    "key":"alt+shift+i",
    "command":"execute-in-iterm2.executeInputCommand",
  },
  {
    "key":"alt+shift+t",
    "command":"execute-in-iterm2.executeFileCommand",
    "when": "editorTextFocus"
  }
]
```

## 1.6. Extension Settings

- `executeInITerm2.pythonPath`

  Path of the Python interpreter which has access to `iterm2` module. More info on [Requirements](#11-requirements).

- `executeInITerm2.fileCommands`

  A json object with `key: string` - `"file_extension": "command"` value pair, to create commands. Note: extensions should not have the dot `.` include.

  Defaults commands included:

  ```json
  "executeInITerm2.fileCommands": {
      "py": "python ${filePath}",
      "lua": "lua ${filePath}",
      "pl": "perl ${filePath}",
      "cpp": "cd ${dir} && g++ ${fileName} -o out && ./out",
      "sh": "sh ${filePath}",
      "zsh": "zsh ${filePath}",
      "js": "node ${filePath}",
      "ts": "ts-node ${filePath}",
      "php": "php ${filePath}",
      "log": "tail -f ${filePath}"
  }
  ```

  > If you language is not present, feel free to submit a request or make a PR.

## 1.7. Known Issues

- The Explorer context menu command might fail the first time if your shell has many scripts to load/source.
- Reloading Visual Studio Code will cause the id tab to reset, so a new one will get created instead of using the existing one.
- Changing the iTerm2 active window will cause the extension to create a new tab for the new window.
- It does not work when the iTerm2 window is minimized (`CMD + M`).
- Visual Studio Code should retake focus after iTerm2 executes the command, but sometimes it does, sometimes it doesn't.

## 1.8. TODO

- [ ] More complex matching patterns to allow different commands for the same file extension.
- [ ] Expose more of the iTerm2 Python API to Visual Studio Code like tab/window manipulation, etc.
- [ ] Tests.

## 1.9. Demo

Input command

![Input Command](/images/input_command.gif)