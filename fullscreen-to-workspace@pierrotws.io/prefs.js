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

/**
 * Preferences for the extension which will be available in the "gnome-shell-extension-prefs"
 *  tool.
 * In the preferences, you can add new images to the list and remove old ones.
 * @see <a href="https://live.gnome.org/GnomeShell/Extensions#Extension_Preferences">Doc</a>
 */

import Adw from "gi://Adw";
import Gio from "gi://Gio";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class CaravelExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();
    let page = new Adw.PreferencesPage({
      title: "Fullscreen To Workspace Settings",
    });
    window.add(page);
    const group = new Adw.PreferencesGroup({
      title: _("Behavior"),
      description: _("Configure fullscreen and maximize behavior"),
    });
    page.add(group);
    // Create a new preferences row
    const fullscreen = new Adw.SwitchRow({
      title: _("On Fullscreen"),
      subtitle: _("Set workspace on fullscreen"),
    });
    group.add(fullscreen);
    settings.bind(
      "on-fullscreen",
      fullscreen,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    // Create a new preferences row
    const maximize = new Adw.SwitchRow({
      title: _("On Maximize"),
      subtitle: _("Set workspace on maximize"),
    });
    group.add(maximize);
    settings.bind(
      "on-maximize",
      fullscreen,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );
  }
}
