[![Codacy Badge](https://app.codacy.com/project/badge/Grade/de4f5f35d20642d0b84d60d5eae941d9)](https://www.codacy.com/gh/sisoe24/execute-in-iterm2/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sisoe24/execute-in-iterm2&amp;utm_campaign=Badge_Grade)
[![DeepSource](https://deepsource.io/gh/sisoe24/execute-in-iterm2.svg/?label=active+issues&show_trend=true&token=_61Aj0xbCTjjbxPEod668-Ay)](https://deepsource.io/gh/sisoe24/execute-in-iterm2/?ref=repository-badge)

[![Download](https://img.shields.io/badge/Marketplace-Download-blue)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2)
[![Version](https://img.shields.io/visual-studio-marketplace/v/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2&ssr=false#version-history)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2)
[![Last Update](https://img.shields.io/visual-studio-marketplace/last-updated/virgilsisoe.execute-in-iterm2)](https://marketplace.visualstudio.com/items?itemName=virgilsisoe.execute-in-iterm2)

# 1. Execute in iTerm2 README

Execute commands inside [iTerm2](https://iterm2.com/index.html) based on file extension or input dialog from Visual Studio Code.

- [1. Execute in iTerm2 README](#1-execute-in-iterm2-readme)
  - [1.1. Requirements](#11-requirements)
  - [1.2. Features](#12-features)
  - [1.3. Terminal commands & placeholders](#13-terminal-commands--placeholders)
    - [1.3.1. Placeholders](#131-placeholders)
  - [1.4. Available Extension Commands](#14-available-extension-commands)
  - [1.5. Extension Settings](#15-extension-settings)
    - [1.5.1. `executeInITerm2.pythonPath`](#151-executeiniterm2pythonpath)
    - [1.5.2.  `executeInITerm2.fileCommands`](#152--executeiniterm2filecommands)
  - [1.6. Known Issues](#16-known-issues)
  - [1.7. TODO](#17-todo)

Demo

| File Command                                                                                              | Input Command                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ![File Command](https://raw.githubusercontent.com/sisoe24/execute-in-iterm2/main/images/file_command.gif) | ![Input Command](https://raw.githubusercontent.com/sisoe24/execute-in-iterm2/main/images/input_command.gif) |
|                                                                                                           |

## 1.1. Requirements

The extension setting: [iTerm2: Python Path](#151-executeiniterm2pythonpath) must contain a valid Python interpreter with the `iterm2` and `pyobjc` modules.

- If you don't have it already installed, from iTerm2 application, you should to **Scripts > Manage > Install Python Runtime** and let iTerm2 install the python interpreter which you can use for the path. The interpreter can be found in `~/Library/ApplicationSupport/iTerm2/iterm2env/versions/*/bin/python3`.
- Alternatively you can create your own environment and install `iterm2` module from `pip`. This should take care of `pyobjc` as well since it is a dependency.

>For more information refer to the [official documentation](https://iterm2.com/python-api/tutorial/running.html).

## 1.2. Features

- Send commands to iTerm2 based on current file extension.
- Send commands to iTerm2 from input dialog.
- Launch the application if is not active and create a "vscode" tab for the sending commands.

## 1.3. Terminal commands & placeholders

The extension offers to ability to create a command based on a file extension.

The commands are going to represent what you would write inside the terminal. Some default commands for common files are already provided but you can define more in the form of: `"file_extension": "command"`. See more: [iTerm2: File Commands](#152-executeiniterm2filecommands).

> **Note:** The examples bellow will include some [placeholders](#131-placeholders) that are part of the extension.

A simple example:

```json
{
    "py": "python ${filePath}"
}
```

More complex commands can be created:

```json
{
    "cpp": "cd ${dir} && g++-9 ${fileName} -o ${fileNameNoExt}.cxx && ./${fileNameNoExt}.cxx"
}
```

Is also possible to create commands for non programming languages:

```json
{
    "log": "tail -f ${filePath}"
}
```

### 1.3.1. Placeholders

Some convenient placeholders are provided when writing commands:

- `${dir}`: The directory of the current active file.
- `${filePath}`: The full path of the current active file.
- `${fileName}`: The filename of the current active file.
- `${fileNameNoExt}`: The filename with no extension of the current active file.

> NOTE: Placeholders will not work when sending a command via the input box.

## 1.4. Available Extension Commands

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing in one of the following Command Name:

| Command Name                    | Command ID                              | Description                     |
| ------------------------------- | --------------------------------------- | ------------------------------- |
| `iTerm2: Execute file command`  | `execute-in-iterm2.executeFileCommand`  | Send command based on file type |
| `iTerm2: Execute input command` | `execute-in-iterm2.executeInputCommand` | Send command from input dialog  |

By default the extension does not provide any shortcut, but every command can be assigned to one. (see [Key Bindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings) for more information)

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

`iTerm2: Execute file command` can be access also via a button in the Editor Toolbar.

## 1.5. Extension Settings

### 1.5.1. `executeInITerm2.pythonPath`

Path of the Python interpreter that has access to the `iterm2` module. More info on [Requirements](#11-requirements).

### 1.5.2.  `executeInITerm2.fileCommands`

A json object with `key: string` (`"file_extension": "command"`) value pair to create commands. Note: extensions should not have the dot `.` include.

Defaults commands included:

```json
"executeInITerm2.fileCommands": {
    "py": "python ${filePath}",
    "lua": "lua ${filePath}",
    "pl": "perl ${filePath}",
    "cpp": "cd ${dir} && g++ ${filePath} -o out && ./out",
    "sh": "sh ${filePath}",
    "zsh": "zsh ${filePath}",
    "js": "node ${filePath}",
    "ts": "ts-node ${filePath}",
    "php": "php ${filePath}",
    "log": "tail -f ${filePath}"
}
```

> If you language is not present, feel free to submit a request or make a PR.

## 1.6. Known Issues

- Currently the button in the editor toolbar is always present. This is because, technically, every file could potentially be used in a command.
- Constantly changing iTerm2 active window, will cause the extension to create multiple tabs.
- Visual Studio Code should retake focus after iTerm2 executes the command, but sometime it does and sometime it doesn't.

## 1.7. TODO

- [ ] Create a tabs based on the filename.
- [ ] More complex command matching pattern to allow different commands for the same file extension.
- [ ] Expose more of the iTerm2 Python API to Visual Studio Code like tab/window manipulation, etc.
- [ ] Tests.
