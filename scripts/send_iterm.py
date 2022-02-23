"""Send command to iTerm2 active tab."""
import os
import sys
import shlex

import AppKit
import iterm2

FILE, *ARGS = sys.argv

TAB_ID_FILENAME = os.path.join(os.path.dirname(FILE), 'tab_id')


def _launch_Iterm(_id):  # type: (dict) -> None
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


_launch_Iterm({"bundle": "com.googlecode.iterm2", "app_name": "iTerm"})


async def get_tab_id():  # type: () -> str
    """Get iTerm2 tab id.

    If not file is found then do nothing.

    Returns:
        str: the tab id numeric string.
    """
    try:
        with open(TAB_ID_FILENAME, 'r') as f:
            return f.read()
    except FileNotFoundError:
        pass


async def write_tab_id(_id):  # type(str) -> None
    """Write iTerm2 tab id."""
    with open(TAB_ID_FILENAME, 'w') as f:
        f.write(_id)


async def main(connection):
    """Start connection to iTerm2 application.

    Connect to the iTerm2 application. If no window is present will create one
    and create a tab to be reused when sending the commands from vscode.

    Args:
        connection (_type_): _description_
    """
    # NOTE: a lot of code deals with the tab id, which is to reused a tab when
    # sending commands and not create a new one each time. But I want to find a
    # different solution, like finding the tab title.

    app = await iterm2.async_get_app(connection)
    await app.async_activate()

    window = app.current_terminal_window

    if not window:
        window = await iterm2.Window.async_create(connection)

    tabs_id = [tab.tab_id for tab in window.tabs]
    tab_id = await get_tab_id()

    # If tab id is not in current tabs then a new tab needs to be created
    # otherwise use the existing tab.
    if tab_id not in tabs_id:
        await window.async_create_tab()
        await window.current_tab.async_set_title('vscode')

        new_tab_id = window.current_tab.tab_id
        tabs_id.append(new_tab_id)
        await write_tab_id(new_tab_id)

        tab_id = new_tab_id

    tab_index = tabs_id.index(tab_id)

    vscode_tab = window.tabs[tab_index]
    current_tab = vscode_tab.current_session

    terminal_cmd = ARGS.pop(0)
    str_args = shlex.join(ARGS)

    await current_tab.async_activate()
    await current_tab.async_send_text(f"{terminal_cmd} {str_args}\n")

    # XXX: This should focus back, but sometimes it doesn't?
    _launch_app("Visual Studio Code")

iterm2.run_until_complete(main, True)
