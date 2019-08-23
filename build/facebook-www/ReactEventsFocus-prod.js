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
  isGlobalFocusVisible = !0,
  isMac =
    "undefined" !== typeof window && null != window.navigator
      ? /^Mac/.test(window.navigator.platform)
      : !1,
  targetEventTypes = ["focus", "blur"],
  rootEventTypes =
    "undefined" !== typeof window && null != window.PointerEvent
      ? ["keydown", "keyup", "pointermove", "pointerdown", "pointerup"]
      : "keydown keyup mousedown touchmove touchstart touchend".split(" ");
function isFunction(obj) {
  return "function" === typeof obj;
}
function handleRootPointerEvent(event, context, state, callback) {
  event = event.type;
  isGlobalFocusVisible = !1;
  state = state.focusTarget;
  null === state ||
    !context.isTargetWithinResponderScope(state) ||
    ("mousedown" !== event &&
      "touchstart" !== event &&
      "pointerdown" !== event) ||
    callback(!1);
}
function handleRootEvent(event, context, state, callback) {
  switch (event.type) {
    case "pointermove":
    case "pointerdown":
    case "pointerup":
      state.pointerType = event.nativeEvent.pointerType;
      handleRootPointerEvent(event, context, state, callback);
      break;
    case "keydown":
    case "keyup":
      var focusTarget = state.focusTarget,
        _ref = event.nativeEvent;
      event = _ref.key;
      var metaKey = _ref.metaKey,
        altKey = _ref.altKey;
      _ref = _ref.ctrlKey;
      ("Enter" !== event &&
        " " !== event &&
        ("Tab" !== event || metaKey || (!isMac && altKey) || _ref)) ||
        ((state.pointerType = "keyboard"),
        (isGlobalFocusVisible = !0),
        null !== focusTarget &&
          context.isTargetWithinResponderScope(focusTarget) &&
          callback(!0));
      break;
    case "touchmove":
    case "touchstart":
    case "touchend":
      state.pointerType = "touch";
      state.isEmulatingMouseEvents = !0;
      handleRootPointerEvent(event, context, state, callback);
      break;
    case "mousedown":
      state.isEmulatingMouseEvents
        ? (state.isEmulatingMouseEvents = !1)
        : ((state.pointerType = "mouse"),
          handleRootPointerEvent(event, context, state, callback));
  }
}
function dispatchBlurEvents(context, props, state) {
  var pointerType = state.pointerType,
    target = state.focusTarget,
    onBlur = props.onBlur;
  isFunction(onBlur) &&
    ((pointerType = {
      target: target,
      type: "blur",
      pointerType: pointerType,
      timeStamp: context.getTimeStamp()
    }),
    context.dispatchEvent(pointerType, onBlur, 0));
  onBlur = props.onFocusChange;
  isFunction(onBlur) && context.dispatchEvent(!1, onBlur, 0);
  state.isFocusVisible && dispatchFocusVisibleChangeEvent(context, props, !1);
}
function dispatchFocusVisibleChangeEvent(context, props, value) {
  props = props.onFocusVisibleChange;
  isFunction(props) && context.dispatchEvent(value, props, 0);
}
var FocusResponder = React.unstable_createResponder("Focus", {
  targetEventTypes: targetEventTypes,
  rootEventTypes: rootEventTypes,
  getInitialState: function() {
    return {
      focusTarget: null,
      isEmulatingMouseEvents: !1,
      isFocused: !1,
      isFocusVisible: !1,
      pointerType: ""
    };
  },
  onEvent: function(event, context, props, state) {
    var type = event.type,
      target = event.target;
    if (props.disabled)
      state.isFocused &&
        (dispatchBlurEvents(context, props, state),
        (state.isFocused = !1),
        (state.focusTarget = null));
    else
      switch (type) {
        case "focus":
          state.focusTarget = event.responderTarget;
          state.isFocused ||
            state.focusTarget !== target ||
            ((state.isFocused = !0),
            (state.isFocusVisible = isGlobalFocusVisible),
            (type = state.pointerType),
            (target = state.focusTarget),
            (event = props.onFocus),
            isFunction(event) &&
              ((type = {
                target: target,
                type: "focus",
                pointerType: type,
                timeStamp: context.getTimeStamp()
              }),
              context.dispatchEvent(type, event, 0)),
            (event = props.onFocusChange),
            isFunction(event) && context.dispatchEvent(!0, event, 0),
            state.isFocusVisible &&
              dispatchFocusVisibleChangeEvent(context, props, !0));
          state.isEmulatingMouseEvents = !1;
          break;
        case "blur":
          state.isFocused &&
            (dispatchBlurEvents(context, props, state),
            (state.isFocusVisible = isGlobalFocusVisible),
            (state.isFocused = !1)),
            null == event.nativeEvent.relatedTarget && (state.pointerType = ""),
            (state.isEmulatingMouseEvents = !1);
      }
  },
  onRootEvent: function(event, context, props, state) {
    handleRootEvent(event, context, state, function(isFocusVisible) {
      state.isFocused &&
        state.isFocusVisible !== isFocusVisible &&
        ((state.isFocusVisible = isFocusVisible),
        dispatchFocusVisibleChangeEvent(context, props, isFocusVisible));
    });
  },
  onUnmount: function(context, props, state) {
    state.isFocused && dispatchBlurEvents(context, props, state);
  }
});
function dispatchFocusWithinChangeEvent(context, props, state, value) {
  var onFocusWithinChange = props.onFocusWithinChange;
  isFunction(onFocusWithinChange) &&
    context.dispatchEvent(value, onFocusWithinChange, 0);
  state.isFocusVisible &&
    ((props = props.onFocusWithinVisibleChange),
    isFunction(props) && context.dispatchEvent(value, props, 0));
}
var FocusWithinResponder = React.unstable_createResponder("FocusWithin", {
    targetEventTypes: targetEventTypes,
    rootEventTypes: rootEventTypes,
    getInitialState: function() {
      return {
        focusTarget: null,
        isEmulatingMouseEvents: !1,
        isFocused: !1,
        isFocusVisible: !1,
        pointerType: ""
      };
    },
    onEvent: function(event, context, props, state) {
      var type = event.type,
        relatedTarget = event.nativeEvent.relatedTarget;
      if (props.disabled)
        state.isFocused &&
          (dispatchFocusWithinChangeEvent(context, props, state, !1),
          (state.isFocused = !1),
          (state.focusTarget = null));
      else
        switch (type) {
          case "focus":
            state.focusTarget = event.responderTarget;
            state.isFocused ||
              ((state.isFocused = !0),
              (state.isFocusVisible = isGlobalFocusVisible),
              dispatchFocusWithinChangeEvent(context, props, state, !0));
            !state.isFocusVisible &&
              isGlobalFocusVisible &&
              ((state.isFocusVisible = isGlobalFocusVisible),
              (event = props.onFocusWithinVisibleChange),
              isFunction(event) && context.dispatchEvent(!0, event, 0));
            break;
          case "blur":
            state.isFocused &&
              !context.isTargetWithinResponder(relatedTarget) &&
              (dispatchFocusWithinChangeEvent(context, props, state, !1),
              (state.isFocused = !1));
        }
    },
    onRootEvent: function(event, context, props, state) {
      handleRootEvent(event, context, state, function(isFocusVisible) {
        if (state.isFocused && state.isFocusVisible !== isFocusVisible) {
          state.isFocusVisible = isFocusVisible;
          var onFocusWithinVisibleChange = props.onFocusWithinVisibleChange;
          isFunction(onFocusWithinVisibleChange) &&
            context.dispatchEvent(
              isFocusVisible,
              onFocusWithinVisibleChange,
              0
            );
        }
      });
    },
    onUnmount: function(context, props, state) {
      state.isFocused &&
        dispatchFocusWithinChangeEvent(context, props, state, !1);
    }
  }),
  Focus = {
    FocusResponder: FocusResponder,
    useFocusResponder: function(props) {
      return React.unstable_useResponder(FocusResponder, props);
    },
    FocusWithinResponder: FocusWithinResponder,
    useFocusWithinResponder: function(props) {
      return React.unstable_useResponder(FocusWithinResponder, props);
    }
  };
module.exports = (Focus && Focus["default"]) || Focus;
