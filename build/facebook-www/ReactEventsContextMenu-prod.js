"use strict";

var React = require("react");

var DiscreteEvent = 0;

var hasPointerEvents =
  typeof window !== "undefined" && window.PointerEvent != null;

function dispatchContextMenuEvent(event, context, props, state) {
  var nativeEvent = event.nativeEvent;
  var target = event.target;
  var timeStamp = context.getTimeStamp();
  var pointerType = state.pointerType;
  var gestureState = {
    altKey: nativeEvent.altKey,
    buttons: nativeEvent.buttons != null ? nativeEvent.buttons : 0,
    ctrlKey: nativeEvent.ctrlKey,
    metaKey: nativeEvent.metaKey,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    pointerType: pointerType,
    shiftKey: nativeEvent.shiftKey,
    target: target,
    timeStamp: timeStamp,
    type: "contextmenu",
    x: nativeEvent.clientX,
    y: nativeEvent.clientY
  };
  context.dispatchEvent(gestureState, props.onContextMenu, DiscreteEvent);
}

var contextMenuImpl = {
  targetEventTypes: hasPointerEvents
    ? ["contextmenu_active", "pointerdown"]
    : ["contextmenu_active", "touchstart", "mousedown"],
  getInitialState: function() {
    return {
      pointerType: ""
    };
  },
  onEvent: function(event, context, props, state) {
    var nativeEvent = event.nativeEvent;
    var pointerType = event.pointerType;
    var type = event.type;

    if (props.disabled) {
      return;
    }

    if (type === "contextmenu") {
      var onContextMenu = props.onContextMenu;
      var preventDefault = props.preventDefault;

      if (preventDefault !== false && !nativeEvent.defaultPrevented) {
        nativeEvent.preventDefault();
      }

      if (typeof onContextMenu === "function") {
        dispatchContextMenuEvent(event, context, props, state);
      }

      state.pointerType = "";
    } else {
      state.pointerType = pointerType;
    }
  }
};
var ContextMenuResponder = React.unstable_createResponder(
  "ContextMenu",
  contextMenuImpl
);
function useContextMenuResponder(props) {
  return React.unstable_useResponder(ContextMenuResponder, props);
}

var ContextMenu = {
  ContextMenuResponder: ContextMenuResponder,
  useContextMenuResponder: useContextMenuResponder
};

var contextMenu = ContextMenu;

module.exports = contextMenu;
