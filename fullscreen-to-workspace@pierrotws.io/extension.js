/*
 * Copyright (C) 2024 Pierre Sauvage
 *
 * This file is part of fullscreen-to-workspace.
 *
 * fullscreen-to-workspace free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * fullscreen-to-workspace distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with fullscreen-to-workspace. If not, see <http://www.gnu.org/licenses/>.
 */

import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

import Meta from "gi://Meta";

export default class FullscreenToWorkspaceExtension extends Extension {
  onMaximized(window) {
    if (window.get_maximized() === Meta.MaximizeFlags.BOTH) {
      this._moveWindowIfNeeded(window);
    }
  }

  onFullscreen(window) {
    if (window.is_fullscreen()) {
      this._moveWindowIfNeeded(window);
    }
  }

  _moveWindowIfNeeded(window) {
    let manager = global.workspace_manager;
    // Get the current workspace
    let workspaceIndex = manager.get_active_workspace_index();
    let numWorkspaces = manager.n_workspaces;

    for (let index = workspaceIndex; index < numWorkspaces; index++) {
      let workspace = manager.get_workspace_by_index(index);
      // Get the list of all windows in the current workspace
      let windows = workspace.list_windows();
      //if workspace empty, move window to workspace
      if (windows.length === 0) {
        //todo: move to that window and return
        this._moveToWorkspace(window, workspace);
        return;
      }
      //if there is only this window in that workspace then do nothing
      else if (windows.length === 1 && windows[0] === window) {
        return;
      }
    }
    //If here, need to create another workspace
    manager.append_new_workspace(false, global.get_current_time());
    // Move the window to the new workspace
    let newWorkspace = manager.get_workspace_by_index(numWorkspaces);
    this._moveToWorkspace(window, newWorkspace);
  }

  _moveToWorkspace(window, workspace) {
    //move window to workspace
    window.change_workspace(workspace);
    //activate workspace now
    workspace.activate(global.get_current_time());
  }

  enable() {
    const settings = this.getSettings();
    const okMaximize = settings.get_boolean("on-maximize");
    const okFullscreen = settings.get_boolean("on-fullscreen");
    // Listen for window maximization
    const self = this;

    if (okMaximize) {
      this._onMaximizeListener = global.window_manager.connect(
        "size-changed",
        (wm, actor) => {
          let window = actor.get_meta_window();
          self.onMaximized(window);
        },
      );
    }

    if (okFullscreen) {
      // Listen for the "fullscreen" state change
      this._onFullscreenListener = global.window_manager.connect(
        "map",
        (wm, actor) => {
          let window = actor.get_meta_window();
          // Add a signal handler to detect state changes (fullscreen)
          window.connect("notify::fullscreen", () => {
            self.onFullscreen(window);
          });
        },
      );
    }
  }

  disable() {
    //this._settings = null;
    // Disconnect the event listener
    if (onMaximizeListener) {
      global.window_manager.disconnect(onMaximizeListener);
      this._onMaximizeListener = null;
    }
    if (onFullscreenListener) {
      global.window_manager.disconnect(onFullscreenListener);
      this._onFullscreenListener = null;
    }
  }
}
