// @ts-check

import { CompositeDisposable } from "atom"
import { DataTipManager } from "./datatip-manager"
import { DatatipService } from "atom-ide-base"

/**
 * [subscriptions description]
 */
let subscriptions: CompositeDisposable
/**
 * [datatipManager description]
 */
let datatipManager: DataTipManager

/**
 * called by Atom when activating an extension
 */
export async function activate() {
  // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
  subscriptions = new CompositeDisposable()
  if (!datatipManager) datatipManager = new DataTipManager()
  subscriptions.add(datatipManager)

  install_deps().then(() => {
    datatipManager.initialize()
  })
}

async function install_deps() {
  // install package-deps if not loaded
  if (!atom.packages.isPackageLoaded("busy-signal")) {
    // Dynamic import https://mariusschulz.com/blog/dynamic-import-expressions-in-typescript
    await import("atom-package-deps").then((atom_package_deps) => {
      atom_package_deps.install("atom-ide-datatip")
    })
  }
}

/**
 * called by Atom when deactivating an extension
 */
export function deactivate() {
  if (subscriptions) {
    subscriptions.dispose()
  }
}

/**
 * called by IDE extensions to retrieve the Datatip service for registration
 * @return { DatatipService } the current DataTipManager instance
 */
export function provideDatatipService() {
  return datatipManager!.datatipService
}

export const config = {
  showDataTipOnCursorMove: {
    title: 'Show datatip automatically on "cursor" stay',
    description:
      "If set to true, the data tip is shown as soon as you move your cursor stays on a word. Otherwise you will have to activate it via keypress.",
    type: "boolean",
    default: true,
  },
  showDataTipOnMouseMove: {
    title: 'Show datatip automatically on "mouse" hover',
    description: "If set to true, the data tip is shown as soon as mouse hovers on a word.",
    type: "boolean",
    default: false,
  },
  hoverTime: {
    title: "Hover/Stay Time",
    description:
      "The time that the mouse/cursor should hover/stay to show a datatip. Also specifies the time that the datatip is still shown when the mouse/cursor moves [ms].",
    type: "number",
    default: 80,
  },
  glowOnHover: {
    title: "Glow on hover",
    description: "Should the datatip glow when you hover on it?",
    type: "boolean",
    default: true,
  },
}
