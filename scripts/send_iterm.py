"""Send command to iTerm2 active tab."""
import os
import sys
import json
import shlex

import AppKit
import iterm2

FILE, *ARGS = sys.argv

TAB_ID_FILENAME = os.path.join(os.path.dirname(FILE), 'tabs_id.json')


def _launch_iterm(_id):  # type: (dict) -> None
    """Launch Iterm2 if is not running already.

    Args:
        _id (dict): a dict with the key `bundle` for the application bundle
        identifier, and a key `app_name` for the application name.
    """
    if not AppKit.NSRunningApplication.runningApplicationsWithBundleIdentifier_(_id['bundle']):
        _launch_app(_id['app_name'])


def _launch_app(app_name):  # type: (str) -> None
    """Launch or focus application.

    Args:
        app_name (str): the application name to launch or focus
    """
    AppKit.NSWorkspace.sharedWorkspace().launchApplication_(app_name)


_launch_iterm({"bundle": "com.googlecode.iterm2", "app_name": "iTerm"})


async def get_tab_id():  # type: () -> dict
    """Get the tabs id json file.

    Returns:
        dict: the json data or an empty dict if file is not found.
    """
    try:
        with open(TAB_ID_FILENAME, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


async def write_tab_id(obj):  # type(str) -> None
    """Write iTerm2 tab id into the json file."""
    with open(TAB_ID_FILENAME, 'w') as f:
        json.dump(obj, f, indent=4)


async def main(connection):
    """Start connection to iTerm2 application.

    Connect to the iTerm2 application. If no window is present will create one
    and create a tab to be reused when sending the commands from vscode.

    Args:
        connection (_type_): _description_
    """
    app = await iterm2.async_get_app(connection)
    await app.async_activate()

    window = app.current_terminal_window
    if not window:
        window = await iterm2.Window.async_create(connection)

    iterm_tabs_id = [tab.tab_id for tab in window.tabs]

    terminal_cmd = ARGS.pop(0)
    filename = os.path.basename(terminal_cmd)

    files_tabs = await get_tab_id()
    file_tab = files_tabs.get(filename)

    # If tab id is not in current tabs, then a new tab needs to be created
    # otherwise use the existing tab.
    if file_tab not in iterm_tabs_id:
        await window.async_create_tab()
        await window.current_tab.async_set_title(filename)

        iterm_new_tab_id = window.current_tab.tab_id
        iterm_tabs_id.append(iterm_new_tab_id)

        files_tabs.update({filename:  iterm_new_tab_id})
        await write_tab_id(files_tabs)

        file_tab = iterm_new_tab_id

    tab_index = iterm_tabs_id.index(file_tab)

    vscode_tab = window.tabs[tab_index]
    current_tab = vscode_tab.current_session

    str_args = shlex.join(ARGS)

    await current_tab.async_activate()
    await current_tab.async_send_text(f"{terminal_cmd} {str_args}\n")

    # XXX: This should focus back, but sometimes it doesn't?
    _launch_app("Visual Studio Code")

iterm2.run_until_complete(main, True)
