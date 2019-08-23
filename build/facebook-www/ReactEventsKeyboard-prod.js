/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 * @preventMunge
 * @preserve-invariant-messages
 */

"use strict";
var React = require("react"),
  normalizeKey = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  },
  translateToKey = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  };
function createKeyboardEvent(event, context, type, target) {
  var nativeEvent = event.nativeEvent;
  event = nativeEvent.location;
  var metaKey = nativeEvent.metaKey,
    repeat = nativeEvent.repeat,
    shiftKey = nativeEvent.shiftKey,
    JSCompiler_temp_const = nativeEvent.altKey,
    JSCompiler_temp_const$jscomp$0 = nativeEvent.ctrlKey,
    JSCompiler_temp_const$jscomp$1 = nativeEvent.isComposing;
  a: {
    var nativeKey = nativeEvent.key;
    if (
      nativeKey &&
      ((nativeKey = normalizeKey[nativeKey] || nativeKey),
      "Unidentified" !== nativeKey)
    ) {
      nativeEvent = nativeKey;
      break a;
    }
    nativeEvent = translateToKey[nativeEvent.keyCode] || "Unidentified";
  }
  return {
    altKey: JSCompiler_temp_const,
    ctrlKey: JSCompiler_temp_const$jscomp$0,
    isComposing: JSCompiler_temp_const$jscomp$1,
    key: nativeEvent,
    location: event,
    metaKey: metaKey,
    repeat: repeat,
    shiftKey: shiftKey,
    target: target,
    timeStamp: context.getTimeStamp(),
    type: type
  };
}
var KeyboardResponder = React.unstable_createResponder("Keyboard", {
  targetEventTypes: ["keydown", "keyup"],
  onEvent: function(event, context, props) {
    var responderTarget = event.responderTarget,
      type = event.type;
    props.disabled ||
      ("keydown" === type
        ? ((props = props.onKeyDown),
          "function" === typeof props &&
            ((event = createKeyboardEvent(
              event,
              context,
              "keydown",
              responderTarget
            )),
            context.dispatchEvent(event, props, 0)))
        : "keyup" === type &&
          ((props = props.onKeyUp),
          "function" === typeof props &&
            ((event = createKeyboardEvent(
              event,
              context,
              "keyup",
              responderTarget
            )),
            context.dispatchEvent(event, props, 0))));
  }
});
module.exports = {
  KeyboardResponder: KeyboardResponder,
  useKeyboard: function(props) {
    return React.unstable_useResponder(KeyboardResponder, props);
  }
};
