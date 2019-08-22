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
  hasPointerEvents =
    "undefined" !== typeof window && void 0 !== window.PointerEvent,
  isMac =
    "undefined" !== typeof window && null != window.navigator
      ? /^Mac/.test(window.navigator.platform)
      : !1,
  DEFAULT_PRESS_RETENTION_OFFSET = { bottom: 20, top: 20, left: 20, right: 20 },
  rootEventTypes = hasPointerEvents
    ? "pointerup pointermove pointercancel click keyup scroll".split(" ")
    : "click keyup scroll mousemove touchmove touchcancel dragstart mouseup_active touchend".split(
        " "
      );
function isFunction(obj) {
  return "function" === typeof obj;
}
function dispatchEvent(event, listener, context, state, name, eventPriority) {
  var target = state.pressTarget,
    pointerType = state.pointerType,
    touchEvent = state.touchEvent;
  state =
    (null != event && !0 === event.nativeEvent.defaultPrevented) ||
    ("press" === name && state.shouldPreventClick);
  var timeStamp = context.getTimeStamp(),
    buttons = 1,
    clientX = null,
    clientY = null,
    pageX = null,
    pageY = null,
    screenX = null,
    screenY = null,
    altKey = !1,
    ctrlKey = !1,
    metaKey = !1,
    shiftKey = !1;
  event &&
    ((event = event.nativeEvent),
    (altKey = event.altKey),
    (ctrlKey = event.ctrlKey),
    (metaKey = event.metaKey),
    (shiftKey = event.shiftKey),
    (touchEvent = touchEvent || event)) &&
    ((buttons = touchEvent.buttons),
    (clientX = touchEvent.clientX),
    (clientY = touchEvent.clientY),
    (pageX = touchEvent.pageX),
    (pageY = touchEvent.pageY),
    (screenX = touchEvent.screenX),
    (screenY = touchEvent.screenY));
  context.dispatchEvent(
    {
      altKey: altKey,
      buttons: buttons,
      clientX: clientX,
      clientY: clientY,
      ctrlKey: ctrlKey,
      defaultPrevented: state,
      metaKey: metaKey,
      pageX: pageX,
      pageY: pageY,
      pointerType: pointerType,
      screenX: screenX,
      screenY: screenY,
      shiftKey: shiftKey,
      target: target,
      timeStamp: timeStamp,
      type: name,
      x: clientX,
      y: clientY
    },
    listener,
    eventPriority
  );
}
function dispatchPressStartEvents(event, context, props, state) {
  state.isPressed = !0;
  if (!state.isActivePressStart) {
    state.isActivePressStart = !0;
    var nativeEvent = event.nativeEvent,
      _ref = state.touchEvent || nativeEvent;
    nativeEvent = _ref.clientX;
    var y = _ref.clientY;
    _ref = state.isActivePressed;
    state.isActivePressed = !0;
    void 0 !== nativeEvent &&
      void 0 !== y &&
      (state.activationPosition = { x: nativeEvent, y: y });
    nativeEvent = props.onPressStart;
    isFunction(nativeEvent) &&
      dispatchEvent(event, nativeEvent, context, state, "pressstart", 0);
    _ref ||
      ((event = props.onPressChange),
      isFunction(event) &&
        context.dispatchEvent(state.isActivePressed, event, 0));
  }
}
function dispatchPressEndEvents(event, context, props, state) {
  state.isActivePressStart = !1;
  state.isPressed = !1;
  if (state.isActivePressed) {
    state.isActivePressed = !1;
    var onPressEnd = props.onPressEnd;
    isFunction(onPressEnd) &&
      dispatchEvent(event, onPressEnd, context, state, "pressend", 0);
    event = props.onPressChange;
    isFunction(event) && context.dispatchEvent(state.isActivePressed, event, 0);
  }
  state.responderRegionOnDeactivation = null;
}
function isValidKeyboardEvent(nativeEvent) {
  var key = nativeEvent.key,
    target = nativeEvent.target;
  nativeEvent = target.tagName;
  target = target.isContentEditable;
  return (
    ("Enter" === key || " " === key || "Spacebar" === key) &&
    "INPUT" !== nativeEvent &&
    "TEXTAREA" !== nativeEvent &&
    !0 !== target
  );
}
function calculateResponderRegion(context, target, props) {
  context = context.objectAssign(
    {},
    DEFAULT_PRESS_RETENTION_OFFSET,
    props.pressRetentionOffset
  );
  var _target$getBoundingCl = target.getBoundingClientRect();
  target = _target$getBoundingCl.left;
  props = _target$getBoundingCl.right;
  var bottom = _target$getBoundingCl.bottom;
  _target$getBoundingCl = _target$getBoundingCl.top;
  context &&
    (null != context.bottom && (bottom += context.bottom),
    null != context.left && (target -= context.left),
    null != context.right && (props += context.right),
    null != context.top && (_target$getBoundingCl -= context.top));
  return {
    bottom: bottom,
    top: _target$getBoundingCl,
    left: target,
    right: props
  };
}
function removeRootEventTypes(context, state) {
  state.addedRootEvents &&
    ((state.addedRootEvents = !1),
    context.removeRootEventTypes(rootEventTypes));
}
function getTouchById(nativeEvent, pointerId) {
  nativeEvent = nativeEvent.changedTouches;
  for (var i = 0; i < nativeEvent.length; i++) {
    var touch = nativeEvent[i];
    if (touch.identifier === pointerId) return touch;
  }
  return null;
}
function updateIsPressWithinResponderRegion(
  nativeEventOrTouchEvent,
  context,
  props,
  state
) {
  null == state.responderRegionOnDeactivation &&
    (state.responderRegionOnDeactivation = calculateResponderRegion(
      context,
      state.pressTarget,
      props
    ));
  context = state.responderRegionOnActivation;
  props = state.responderRegionOnDeactivation;
  if (null != context) {
    var left = context.left;
    var top = context.top;
    var right = context.right;
    var bottom = context.bottom;
    null != props &&
      ((left = Math.min(left, props.left)),
      (top = Math.min(top, props.top)),
      (right = Math.max(right, props.right)),
      (bottom = Math.max(bottom, props.bottom)));
  }
  context = nativeEventOrTouchEvent.clientX;
  nativeEventOrTouchEvent = nativeEventOrTouchEvent.clientY;
  state.isPressWithinResponderRegion =
    null != left &&
    null != right &&
    null != top &&
    null != bottom &&
    null !== context &&
    null !== nativeEventOrTouchEvent &&
    context >= left &&
    context <= right &&
    nativeEventOrTouchEvent >= top &&
    nativeEventOrTouchEvent <= bottom;
}
var PressResponder = React.unstable_createResponder("Press", {
  targetEventTypes: hasPointerEvents
    ? ["keydown_active", "pointerdown_active", "click_active"]
    : ["keydown_active", "touchstart", "mousedown", "click_active"],
  getInitialState: function() {
    return {
      activationPosition: null,
      addedRootEvents: !1,
      isActivePressed: !1,
      isActivePressStart: !1,
      isPressed: !1,
      isPressWithinResponderRegion: !0,
      pointerType: "",
      pressTarget: null,
      responderRegionOnActivation: null,
      responderRegionOnDeactivation: null,
      ignoreEmulatedMouseEvents: !1,
      activePointerId: null,
      shouldPreventClick: !1,
      touchEvent: null
    };
  },
  onEvent: function(event, context, props, state) {
    var pointerId = event.pointerId,
      pointerType = event.pointerType,
      type = event.type;
    if (props.disabled)
      removeRootEventTypes(context, state),
        dispatchPressEndEvents(event, context, props, state),
        (state.ignoreEmulatedMouseEvents = !1);
    else {
      var nativeEvent = event.nativeEvent,
        isPressed = state.isPressed;
      !0 === props.stopPropagation && nativeEvent.stopPropagation();
      switch (type) {
        case "pointerdown":
        case "keydown":
        case "mousedown":
        case "touchstart":
          if (isPressed)
            isValidKeyboardEvent(nativeEvent) &&
              " " === nativeEvent.key &&
              nativeEvent.preventDefault();
          else {
            var isTouchEvent = "touchstart" === type,
              isPointerEvent = "pointerdown" === type,
              isKeyboardEvent = "keyboard" === pointerType;
            isPressed = "mouse" === pointerType;
            if ("mousedown" !== type || !state.ignoreEmulatedMouseEvents) {
              state.shouldPreventClick = !1;
              if (isTouchEvent) state.ignoreEmulatedMouseEvents = !0;
              else if (isKeyboardEvent)
                if (isValidKeyboardEvent(nativeEvent)) {
                  type = nativeEvent.altKey;
                  isKeyboardEvent = nativeEvent.ctrlKey;
                  var metaKey = nativeEvent.metaKey,
                    shiftKey = nativeEvent.shiftKey;
                  " " === nativeEvent.key
                    ? nativeEvent.preventDefault()
                    : !1 === props.preventDefault ||
                      shiftKey ||
                      metaKey ||
                      isKeyboardEvent ||
                      type ||
                      (state.shouldPreventClick = !0);
                } else break;
              state.pointerType = pointerType;
              pointerType = state.pressTarget = event.responderTarget;
              if (isPointerEvent) state.activePointerId = pointerId;
              else if (isTouchEvent) {
                pointerId = nativeEvent.targetTouches;
                pointerId = 0 < pointerId.length ? pointerId[0] : null;
                if (null === pointerId) break;
                state.touchEvent = pointerId;
                state.activePointerId = pointerId.identifier;
              }
              2 === nativeEvent.buttons ||
                4 < nativeEvent.buttons ||
                (isMac && isPressed && nativeEvent.ctrlKey) ||
                (null !== pointerType &&
                  9 !== pointerType.nodeType &&
                  (state.responderRegionOnActivation = calculateResponderRegion(
                    context,
                    pointerType,
                    props
                  )),
                (state.responderRegionOnDeactivation = null),
                (state.isPressWithinResponderRegion = !0),
                dispatchPressStartEvents(event, context, props, state),
                state.addedRootEvents ||
                  ((state.addedRootEvents = !0),
                  context.addRootEventTypes(rootEventTypes)));
            }
          }
          break;
        case "click":
          state.shouldPreventClick && nativeEvent.preventDefault();
      }
    }
  },
  onRootEvent: function(event, context, props, state) {
    var pointerId = event.pointerId,
      pointerType = event.pointerType,
      target = event.target,
      type = event.type,
      nativeEvent = event.nativeEvent,
      isPressed = state.isPressed,
      activePointerId = state.activePointerId,
      previousPointerType = state.pointerType;
    !0 === props.stopPropagation && nativeEvent.stopPropagation();
    switch (type) {
      case "pointermove":
      case "mousemove":
      case "touchmove":
        if (previousPointerType !== pointerType) break;
        if ("pointermove" === type && activePointerId !== pointerId) break;
        else if ("touchmove" === type) {
          var touchEvent = getTouchById(nativeEvent, activePointerId);
          if (null === touchEvent) break;
          state.touchEvent = touchEvent;
        }
        var pressTarget = state.pressTarget;
        null !== pressTarget &&
          null !== pressTarget &&
          9 !== pressTarget.nodeType &&
          ("mouse" === pointerType &&
          context.isTargetWithinNode(target, pressTarget)
            ? (state.isPressWithinResponderRegion = !0)
            : updateIsPressWithinResponderRegion(
                touchEvent || nativeEvent,
                context,
                props,
                state
              ));
        state.isPressWithinResponderRegion
          ? isPressed
            ? ((props = props.onPressMove),
              isFunction(props) &&
                dispatchEvent(event, props, context, state, "pressmove", 1))
            : dispatchPressStartEvents(event, context, props, state)
          : dispatchPressEndEvents(event, context, props, state);
        break;
      case "pointerup":
      case "keyup":
      case "mouseup":
      case "touchend":
        if (isPressed) {
          if (
            ((isPressed = nativeEvent.buttons),
            (touchEvent = !1),
            "pointerup" !== type || activePointerId === pointerId)
          ) {
            if ("touchend" === type) {
              pressTarget = getTouchById(nativeEvent, activePointerId);
              if (null === pressTarget) break;
              target = state.touchEvent = pressTarget;
              target = context
                .getActiveDocument()
                .elementFromPoint(target.clientX, target.clientY);
            } else if ("keyup" === type) {
              if (!isValidKeyboardEvent(nativeEvent)) break;
              touchEvent = !0;
              removeRootEventTypes(context, state);
            } else 4 === isPressed && removeRootEventTypes(context, state);
            context.isTargetWithinResponder(target) &&
              context.isTargetWithinHostComponent(target, "a") &&
              ((pointerId = nativeEvent.altKey),
              (type = nativeEvent.ctrlKey),
              (activePointerId = nativeEvent.metaKey),
              (previousPointerType = nativeEvent.shiftKey),
              !1 === props.preventDefault ||
                previousPointerType ||
                activePointerId ||
                type ||
                pointerId ||
                (state.shouldPreventClick = !0));
            pointerId = state.pressTarget;
            dispatchPressEndEvents(event, context, props, state);
            type = props.onPress;
            null !== pointerId &&
              isFunction(type) &&
              (touchEvent ||
                null === pointerId ||
                null === pointerId ||
                9 === pointerId.nodeType ||
                ("mouse" === pointerType &&
                context.isTargetWithinNode(target, pointerId)
                  ? (state.isPressWithinResponderRegion = !0)
                  : updateIsPressWithinResponderRegion(
                      pressTarget || nativeEvent,
                      context,
                      props,
                      state
                    )),
              state.isPressWithinResponderRegion &&
                4 !== isPressed &&
                dispatchEvent(event, type, context, state, "press", 0));
            state.touchEvent = null;
          }
        } else "mouseup" === type && (state.ignoreEmulatedMouseEvents = !1);
        break;
      case "click":
        "keyboard" !== previousPointerType &&
          removeRootEventTypes(context, state);
        break;
      case "scroll":
        if ("mouse" === previousPointerType) break;
        pointerType = state.pressTarget;
        nativeEvent = nativeEvent.target;
        target = context.getActiveDocument();
        null === pointerType ||
          (nativeEvent !== target &&
            !context.isTargetWithinNode(pointerType, nativeEvent)) ||
          ((state.touchEvent = null),
          state.isPressed &&
            ((state.ignoreEmulatedMouseEvents = !1),
            dispatchPressEndEvents(event, context, props, state)),
          removeRootEventTypes(context, state));
        break;
      case "pointercancel":
      case "touchcancel":
      case "dragstart":
        (state.touchEvent = null),
          state.isPressed &&
            ((state.ignoreEmulatedMouseEvents = !1),
            dispatchPressEndEvents(event, context, props, state)),
          removeRootEventTypes(context, state);
    }
  },
  onUnmount: function(context, props, state) {
    state.isPressed &&
      (removeRootEventTypes(context, state),
      dispatchPressEndEvents(null, context, props, state));
  }
});
module.exports = {
  PressResponder: PressResponder,
  usePressResponder: function(props) {
    return React.unstable_useResponder(PressResponder, props);
  }
};
