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
  Transform = require("art/core/transform"),
  Mode = require("art/modes/current"),
  Scheduler = require("scheduler");
var FastNoSideEffects = require("art/modes/fast-noSideEffects");
function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i],
          key;
        for (key in source)
          Object.prototype.hasOwnProperty.call(source, key) &&
            (target[key] = source[key]);
      }
      return target;
    };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
function _assertThisInitialized(self) {
  if (void 0 === self)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return self;
}
function ReactErrorProd(error) {
  for (
    var code = error.message,
      url = "https://reactjs.org/docs/error-decoder.html?invariant=" + code,
      i = 1;
    i < arguments.length;
    i++
  )
    url += "&args[]=" + encodeURIComponent(arguments[i]);
  error.message =
    "Minified React error #" +
    code +
    "; visit " +
    url +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ";
  return error;
}
require("warning");
var ReactSharedInternals =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
ReactSharedInternals.hasOwnProperty("ReactCurrentDispatcher") ||
  (ReactSharedInternals.ReactCurrentDispatcher = { current: null });
ReactSharedInternals.hasOwnProperty("ReactCurrentBatchConfig") ||
  (ReactSharedInternals.ReactCurrentBatchConfig = { suspense: null });
var hasSymbol = "function" === typeof Symbol && Symbol.for,
  REACT_ELEMENT_TYPE$1 = hasSymbol ? Symbol.for("react.element") : 60103,
  REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106,
  REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107,
  REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108,
  REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114,
  REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109,
  REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110,
  REACT_CONCURRENT_MODE_TYPE = hasSymbol
    ? Symbol.for("react.concurrent_mode")
    : 60111,
  REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112,
  REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113,
  REACT_SUSPENSE_LIST_TYPE = hasSymbol
    ? Symbol.for("react.suspense_list")
    : 60120,
  REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115,
  REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
hasSymbol && Symbol.for("react.fundamental");
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118,
  MAYBE_ITERATOR_SYMBOL = "function" === typeof Symbol && Symbol.iterator;
function getIteratorFn(maybeIterable) {
  if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
  maybeIterable =
    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
    maybeIterable["@@iterator"];
  return "function" === typeof maybeIterable ? maybeIterable : null;
}
function initializeLazyComponentType(lazyComponent) {
  if (-1 === lazyComponent._status) {
    lazyComponent._status = 0;
    var ctor = lazyComponent._ctor;
    ctor = ctor();
    lazyComponent._result = ctor;
    ctor.then(
      function(moduleObject) {
        0 === lazyComponent._status &&
          ((moduleObject = moduleObject.default),
          (lazyComponent._status = 1),
          (lazyComponent._result = moduleObject));
      },
      function(error) {
        0 === lazyComponent._status &&
          ((lazyComponent._status = 2), (lazyComponent._result = error));
      }
    );
  }
}
function getComponentName(type) {
  if (null == type) return null;
  if ("function" === typeof type) return type.displayName || type.name || null;
  if ("string" === typeof type) return type;
  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return "Fragment";
    case REACT_PORTAL_TYPE:
      return "Portal";
    case REACT_PROFILER_TYPE:
      return "Profiler";
    case REACT_STRICT_MODE_TYPE:
      return "StrictMode";
    case REACT_SUSPENSE_TYPE:
      return "Suspense";
    case REACT_SUSPENSE_LIST_TYPE:
      return "SuspenseList";
  }
  if ("object" === typeof type)
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return "Context.Consumer";
      case REACT_PROVIDER_TYPE:
        return "Context.Provider";
      case REACT_FORWARD_REF_TYPE:
        var innerType = type.render;
        innerType = innerType.displayName || innerType.name || "";
        return (
          type.displayName ||
          ("" !== innerType ? "ForwardRef(" + innerType + ")" : "ForwardRef")
        );
      case REACT_MEMO_TYPE:
        return getComponentName(type.type);
      case REACT_LAZY_TYPE:
        if ((type = 1 === type._status ? type._result : null))
          return getComponentName(type);
    }
  return null;
}
var _require = require("ReactFeatureFlags"),
  disableLegacyContext = _require.disableLegacyContext,
  disableSchedulerTimeoutBasedOnReactExpirationTime =
    _require.disableSchedulerTimeoutBasedOnReactExpirationTime;
function isFiberMountedImpl(fiber) {
  var node = fiber;
  if (fiber.alternate) for (; node.return; ) node = node.return;
  else {
    fiber = node;
    do {
      node = fiber;
      if (0 !== (node.effectTag & 1026)) return 1;
      fiber = node.return;
    } while (fiber);
  }
  return 3 === node.tag ? 2 : 3;
}
function assertIsMounted(fiber) {
  if (2 !== isFiberMountedImpl(fiber)) throw ReactErrorProd(Error(188));
}
function findCurrentFiberUsingSlowPath(fiber) {
  var alternate = fiber.alternate;
  if (!alternate) {
    alternate = isFiberMountedImpl(fiber);
    if (3 === alternate) throw ReactErrorProd(Error(188));
    return 1 === alternate ? null : fiber;
  }
  for (var a = fiber, b = alternate; ; ) {
    var parentA = a.return;
    if (null === parentA) break;
    var parentB = parentA.alternate;
    if (null === parentB) {
      b = parentA.return;
      if (null !== b) {
        a = b;
        continue;
      }
      break;
    }
    if (parentA.child === parentB.child) {
      for (parentB = parentA.child; parentB; ) {
        if (parentB === a) return assertIsMounted(parentA), fiber;
        if (parentB === b) return assertIsMounted(parentA), alternate;
        parentB = parentB.sibling;
      }
      throw ReactErrorProd(Error(188));
    }
    if (a.return !== b.return) (a = parentA), (b = parentB);
    else {
      for (var didFindChild = !1, _child = parentA.child; _child; ) {
        if (_child === a) {
          didFindChild = !0;
          a = parentA;
          b = parentB;
          break;
        }
        if (_child === b) {
          didFindChild = !0;
          b = parentA;
          a = parentB;
          break;
        }
        _child = _child.sibling;
      }
      if (!didFindChild) {
        for (_child = parentB.child; _child; ) {
          if (_child === a) {
            didFindChild = !0;
            a = parentB;
            b = parentA;
            break;
          }
          if (_child === b) {
            didFindChild = !0;
            b = parentB;
            a = parentA;
            break;
          }
          _child = _child.sibling;
        }
        if (!didFindChild) throw ReactErrorProd(Error(189));
      }
    }
    if (a.alternate !== b) throw ReactErrorProd(Error(190));
  }
  if (3 !== a.tag) throw ReactErrorProd(Error(188));
  return a.stateNode.current === a ? fiber : alternate;
}
function findCurrentHostFiber(parent) {
  parent = findCurrentFiberUsingSlowPath(parent);
  if (!parent) return null;
  for (var node = parent; ; ) {
    if (5 === node.tag || 6 === node.tag) return node;
    if (node.child) (node.child.return = node), (node = node.child);
    else {
      if (node === parent) break;
      for (; !node.sibling; ) {
        if (!node.return || node.return === parent) return null;
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
  return null;
}
var TYPES = {
    CLIPPING_RECTANGLE: "ClippingRectangle",
    GROUP: "Group",
    SHAPE: "Shape",
    TEXT: "Text"
  },
  EVENT_TYPES = {
    onClick: "click",
    onMouseMove: "mousemove",
    onMouseOver: "mouseover",
    onMouseOut: "mouseout",
    onMouseUp: "mouseup",
    onMouseDown: "mousedown"
  };
function childrenAsString(children) {
  return children
    ? "string" === typeof children
      ? children
      : children.length
        ? children.join("")
        : ""
    : "";
}
function shim$1() {
  throw ReactErrorProd(Error(305));
}
var pooledTransform = new Transform(),
  NO_CONTEXT = {},
  UPDATE_SIGNAL = {};
function createEventHandler(instance) {
  return function(event) {
    var listener = instance._listeners[event.type];
    listener &&
      ("function" === typeof listener
        ? listener.call(instance, event)
        : listener.handleEvent && listener.handleEvent(event));
  };
}
function destroyEventListeners(instance) {
  if (instance._subscriptions)
    for (var type in instance._subscriptions) instance._subscriptions[type]();
  instance._subscriptions = null;
  instance._listeners = null;
}
function applyClippingRectangleProps(instance, props) {
  applyNodeProps(
    instance,
    props,
    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}
  );
  instance.width = props.width;
  instance.height = props.height;
}
function applyGroupProps(instance, props) {
  applyNodeProps(
    instance,
    props,
    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}
  );
  instance.width = props.width;
  instance.height = props.height;
}
function applyNodeProps(instance, props) {
  var prevProps =
    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
  var scaleX =
    null != props.scaleX ? props.scaleX : null != props.scale ? props.scale : 1;
  var scaleY =
    null != props.scaleY ? props.scaleY : null != props.scale ? props.scale : 1;
  pooledTransform
    .transformTo(1, 0, 0, 1, 0, 0)
    .move(props.x || 0, props.y || 0)
    .rotate(props.rotation || 0, props.originX, props.originY)
    .scale(scaleX, scaleY, props.originX, props.originY);
  null != props.transform && pooledTransform.transform(props.transform);
  (instance.xx === pooledTransform.xx &&
    instance.yx === pooledTransform.yx &&
    instance.xy === pooledTransform.xy &&
    instance.yy === pooledTransform.yy &&
    instance.x === pooledTransform.x &&
    instance.y === pooledTransform.y) ||
    instance.transformTo(pooledTransform);
  (props.cursor === prevProps.cursor && props.title === prevProps.title) ||
    instance.indicate(props.cursor, props.title);
  instance.blend &&
    props.opacity !== prevProps.opacity &&
    instance.blend(null == props.opacity ? 1 : props.opacity);
  props.visible !== prevProps.visible &&
    (null == props.visible || props.visible
      ? instance.show()
      : instance.hide());
  for (var type in EVENT_TYPES)
    (prevProps = instance),
      (scaleX = EVENT_TYPES[type]),
      (scaleY = props[type]),
      prevProps._listeners ||
        ((prevProps._listeners = {}), (prevProps._subscriptions = {})),
      (prevProps._listeners[scaleX] = scaleY)
        ? prevProps._subscriptions[scaleX] ||
          (prevProps._subscriptions[scaleX] = prevProps.subscribe(
            scaleX,
            createEventHandler(prevProps),
            prevProps
          ))
        : prevProps._subscriptions[scaleX] &&
          (prevProps._subscriptions[scaleX](),
          delete prevProps._subscriptions[scaleX]);
}
function applyRenderableNodeProps(instance, props) {
  var prevProps =
    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
  applyNodeProps(instance, props, prevProps);
  prevProps.fill !== props.fill &&
    (props.fill && props.fill.applyFill
      ? props.fill.applyFill(instance)
      : instance.fill(props.fill));
  (prevProps.stroke === props.stroke &&
    prevProps.strokeWidth === props.strokeWidth &&
    prevProps.strokeCap === props.strokeCap &&
    prevProps.strokeJoin === props.strokeJoin &&
    prevProps.strokeDash === props.strokeDash) ||
    instance.stroke(
      props.stroke,
      props.strokeWidth,
      props.strokeCap,
      props.strokeJoin,
      props.strokeDash
    );
}
function applyShapeProps(instance, props) {
  var prevProps =
    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
  applyRenderableNodeProps(instance, props, prevProps);
  var path = props.d || childrenAsString(props.children),
    prevDelta = instance._prevDelta;
  if (
    path !== instance._prevPath ||
    path.delta !== prevDelta ||
    prevProps.height !== props.height ||
    prevProps.width !== props.width
  )
    instance.draw(path, props.width, props.height),
      (instance._prevDelta = path.delta),
      (instance._prevPath = path);
}
function applyTextProps(instance, props) {
  var prevProps =
    2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
  applyRenderableNodeProps(instance, props, prevProps);
  var string = props.children,
    JSCompiler_temp;
  if (!(JSCompiler_temp = instance._currentString !== string)) {
    JSCompiler_temp = props.font;
    var newFont = prevProps.font;
    JSCompiler_temp =
      JSCompiler_temp === newFont
        ? !0
        : "string" === typeof newFont || "string" === typeof JSCompiler_temp
          ? !1
          : newFont.fontSize === JSCompiler_temp.fontSize &&
            newFont.fontStyle === JSCompiler_temp.fontStyle &&
            newFont.fontVariant === JSCompiler_temp.fontVariant &&
            newFont.fontWeight === JSCompiler_temp.fontWeight &&
            newFont.fontFamily === JSCompiler_temp.fontFamily;
    JSCompiler_temp = !JSCompiler_temp;
  }
  if (
    JSCompiler_temp ||
    props.alignment !== prevProps.alignment ||
    props.path !== prevProps.path
  )
    instance.draw(string, props.font, props.alignment, props.path),
      (instance._currentString = string);
}
var scheduleTimeout = setTimeout,
  cancelTimeout = clearTimeout;
function shouldSetTextContent(type, props) {
  return (
    "string" === typeof props.children || "number" === typeof props.children
  );
}
function unmountResponderInstance() {
  throw Error("Not yet implemented.");
}
var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
function getStackByFiberInDevAndProd(workInProgress) {
  var info = "";
  do {
    a: switch (workInProgress.tag) {
      case 3:
      case 4:
      case 6:
      case 7:
      case 10:
      case 9:
        var JSCompiler_inline_result = "";
        break a;
      default:
        var owner = workInProgress._debugOwner,
          source = workInProgress._debugSource,
          name = getComponentName(workInProgress.type);
        JSCompiler_inline_result = null;
        owner && (JSCompiler_inline_result = getComponentName(owner.type));
        owner = name;
        name = "";
        source
          ? (name =
              " (at " +
              source.fileName.replace(BEFORE_SLASH_RE, "") +
              ":" +
              source.lineNumber +
              ")")
          : JSCompiler_inline_result &&
            (name = " (created by " + JSCompiler_inline_result + ")");
        JSCompiler_inline_result = "\n    in " + (owner || "Unknown") + name;
    }
    info += JSCompiler_inline_result;
    workInProgress = workInProgress.return;
  } while (workInProgress);
  return info;
}
new Set();
var valueStack = [],
  index = -1;
function pop(cursor) {
  0 > index ||
    ((cursor.current = valueStack[index]), (valueStack[index] = null), index--);
}
function push(cursor, value) {
  index++;
  valueStack[index] = cursor.current;
  cursor.current = value;
}
var emptyContextObject = {},
  contextStackCursor = { current: emptyContextObject },
  didPerformWorkStackCursor = { current: !1 },
  previousContext = emptyContextObject;
function getUnmaskedContext(
  workInProgress,
  Component,
  didPushOwnContextIfProvider
) {
  return disableLegacyContext
    ? emptyContextObject
    : didPushOwnContextIfProvider && isContextProvider(Component)
      ? previousContext
      : contextStackCursor.current;
}
function getMaskedContext(workInProgress, unmaskedContext) {
  if (disableLegacyContext) return emptyContextObject;
  var contextTypes = workInProgress.type.contextTypes;
  if (!contextTypes) return emptyContextObject;
  var instance = workInProgress.stateNode;
  if (
    instance &&
    instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext
  )
    return instance.__reactInternalMemoizedMaskedChildContext;
  var context = {},
    key;
  for (key in contextTypes) context[key] = unmaskedContext[key];
  instance &&
    !disableLegacyContext &&
    ((workInProgress = workInProgress.stateNode),
    (workInProgress.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext),
    (workInProgress.__reactInternalMemoizedMaskedChildContext = context));
  return context;
}
function isContextProvider(type) {
  if (disableLegacyContext) return !1;
  type = type.childContextTypes;
  return null !== type && void 0 !== type;
}
function popContext(fiber) {
  disableLegacyContext ||
    (pop(didPerformWorkStackCursor, fiber), pop(contextStackCursor, fiber));
}
function popTopLevelContextObject(fiber) {
  disableLegacyContext ||
    (pop(didPerformWorkStackCursor, fiber), pop(contextStackCursor, fiber));
}
function pushTopLevelContextObject(fiber, context, didChange) {
  if (!disableLegacyContext) {
    if (contextStackCursor.current !== emptyContextObject)
      throw ReactErrorProd(Error(168));
    push(contextStackCursor, context, fiber);
    push(didPerformWorkStackCursor, didChange, fiber);
  }
}
function processChildContext(fiber, type, parentContext) {
  if (disableLegacyContext) return parentContext;
  var instance = fiber.stateNode;
  fiber = type.childContextTypes;
  if ("function" !== typeof instance.getChildContext) return parentContext;
  instance = instance.getChildContext();
  for (var contextKey in instance)
    if (!(contextKey in fiber))
      throw ReactErrorProd(
        Error(108),
        getComponentName(type) || "Unknown",
        contextKey
      );
  return Object.assign({}, parentContext, {}, instance);
}
function pushContextProvider(workInProgress) {
  if (disableLegacyContext) return !1;
  var instance = workInProgress.stateNode;
  instance =
    (instance && instance.__reactInternalMemoizedMergedChildContext) ||
    emptyContextObject;
  previousContext = contextStackCursor.current;
  push(contextStackCursor, instance, workInProgress);
  push(
    didPerformWorkStackCursor,
    didPerformWorkStackCursor.current,
    workInProgress
  );
  return !0;
}
function invalidateContextProvider(workInProgress, type, didChange) {
  if (!disableLegacyContext) {
    var instance = workInProgress.stateNode;
    if (!instance) throw ReactErrorProd(Error(169));
    didChange
      ? ((type = processChildContext(workInProgress, type, previousContext)),
        (instance.__reactInternalMemoizedMergedChildContext = type),
        pop(didPerformWorkStackCursor, workInProgress),
        pop(contextStackCursor, workInProgress),
        push(contextStackCursor, type, workInProgress))
      : pop(didPerformWorkStackCursor, workInProgress);
    push(didPerformWorkStackCursor, didChange, workInProgress);
  }
}
var Scheduler_runWithPriority = Scheduler.unstable_runWithPriority,
  Scheduler_scheduleCallback = Scheduler.unstable_scheduleCallback,
  Scheduler_cancelCallback = Scheduler.unstable_cancelCallback,
  Scheduler_shouldYield = Scheduler.unstable_shouldYield,
  Scheduler_requestPaint = Scheduler.unstable_requestPaint,
  Scheduler_now = Scheduler.unstable_now,
  Scheduler_getCurrentPriorityLevel =
    Scheduler.unstable_getCurrentPriorityLevel,
  Scheduler_ImmediatePriority = Scheduler.unstable_ImmediatePriority,
  Scheduler_UserBlockingPriority = Scheduler.unstable_UserBlockingPriority,
  Scheduler_NormalPriority = Scheduler.unstable_NormalPriority,
  Scheduler_LowPriority = Scheduler.unstable_LowPriority,
  Scheduler_IdlePriority = Scheduler.unstable_IdlePriority,
  fakeCallbackNode = {},
  requestPaint =
    void 0 !== Scheduler_requestPaint ? Scheduler_requestPaint : function() {},
  syncQueue = null,
  immediateQueueCallbackNode = null,
  isFlushingSyncQueue = !1,
  initialTimeMs = Scheduler_now(),
  now =
    1e4 > initialTimeMs
      ? Scheduler_now
      : function() {
          return Scheduler_now() - initialTimeMs;
        };
function getCurrentPriorityLevel() {
  switch (Scheduler_getCurrentPriorityLevel()) {
    case Scheduler_ImmediatePriority:
      return 99;
    case Scheduler_UserBlockingPriority:
      return 98;
    case Scheduler_NormalPriority:
      return 97;
    case Scheduler_LowPriority:
      return 96;
    case Scheduler_IdlePriority:
      return 95;
    default:
      throw ReactErrorProd(Error(332));
  }
}
function reactPriorityToSchedulerPriority(reactPriorityLevel) {
  switch (reactPriorityLevel) {
    case 99:
      return Scheduler_ImmediatePriority;
    case 98:
      return Scheduler_UserBlockingPriority;
    case 97:
      return Scheduler_NormalPriority;
    case 96:
      return Scheduler_LowPriority;
    case 95:
      return Scheduler_IdlePriority;
    default:
      throw ReactErrorProd(Error(332));
  }
}
function runWithPriority(reactPriorityLevel, fn) {
  reactPriorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_runWithPriority(reactPriorityLevel, fn);
}
function scheduleCallback(reactPriorityLevel, callback, options) {
  reactPriorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_scheduleCallback(reactPriorityLevel, callback, options);
}
function scheduleSyncCallback(callback) {
  null === syncQueue
    ? ((syncQueue = [callback]),
      (immediateQueueCallbackNode = Scheduler_scheduleCallback(
        Scheduler_ImmediatePriority,
        flushSyncCallbackQueueImpl
      )))
    : syncQueue.push(callback);
  return fakeCallbackNode;
}
function flushSyncCallbackQueue() {
  if (null !== immediateQueueCallbackNode) {
    var node = immediateQueueCallbackNode;
    immediateQueueCallbackNode = null;
    Scheduler_cancelCallback(node);
  }
  flushSyncCallbackQueueImpl();
}
function flushSyncCallbackQueueImpl() {
  if (!isFlushingSyncQueue && null !== syncQueue) {
    isFlushingSyncQueue = !0;
    var i = 0;
    try {
      var queue = syncQueue;
      runWithPriority(99, function() {
        for (; i < queue.length; i++) {
          var callback = queue[i];
          do callback = callback(!0);
          while (null !== callback);
        }
      });
      syncQueue = null;
    } catch (error) {
      throw (null !== syncQueue && (syncQueue = syncQueue.slice(i + 1)),
      Scheduler_scheduleCallback(
        Scheduler_ImmediatePriority,
        flushSyncCallbackQueue
      ),
      error);
    } finally {
      isFlushingSyncQueue = !1;
    }
  }
}
function inferPriorityFromExpirationTime(currentTime, expirationTime) {
  if (1073741823 === expirationTime) return 99;
  if (1 === expirationTime) return 95;
  currentTime =
    10 * (1073741821 - expirationTime) - 10 * (1073741821 - currentTime);
  return 0 >= currentTime
    ? 99
    : 250 >= currentTime
      ? 98
      : 5250 >= currentTime
        ? 97
        : 95;
}
function is(x, y) {
  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function shallowEqual(objA, objB) {
  if (is(objA, objB)) return !0;
  if (
    "object" !== typeof objA ||
    null === objA ||
    "object" !== typeof objB ||
    null === objB
  )
    return !1;
  var keysA = Object.keys(objA),
    keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return !1;
  for (keysB = 0; keysB < keysA.length; keysB++)
    if (
      !hasOwnProperty.call(objB, keysA[keysB]) ||
      !is(objA[keysA[keysB]], objB[keysA[keysB]])
    )
      return !1;
  return !0;
}
require("lowPriorityWarning");
function resolveDefaultProps(Component, baseProps) {
  if (Component && Component.defaultProps) {
    baseProps = Object.assign({}, baseProps);
    Component = Component.defaultProps;
    for (var propName in Component)
      void 0 === baseProps[propName] &&
        (baseProps[propName] = Component[propName]);
  }
  return baseProps;
}
var valueCursor = { current: null },
  currentlyRenderingFiber = null,
  lastContextDependency = null,
  lastContextWithAllBitsObserved = null;
function resetContextDependencies() {
  lastContextWithAllBitsObserved = lastContextDependency = currentlyRenderingFiber = null;
}
function pushProvider(providerFiber, nextValue) {
  var context = providerFiber.type._context;
  push(valueCursor, context._currentValue2, providerFiber);
  context._currentValue2 = nextValue;
}
function popProvider(providerFiber) {
  var currentValue = valueCursor.current;
  pop(valueCursor, providerFiber);
  providerFiber.type._context._currentValue2 = currentValue;
}
function scheduleWorkOnParentPath(parent, renderExpirationTime) {
  for (; null !== parent; ) {
    var alternate = parent.alternate;
    if (parent.childExpirationTime < renderExpirationTime)
      (parent.childExpirationTime = renderExpirationTime),
        null !== alternate &&
          alternate.childExpirationTime < renderExpirationTime &&
          (alternate.childExpirationTime = renderExpirationTime);
    else if (
      null !== alternate &&
      alternate.childExpirationTime < renderExpirationTime
    )
      alternate.childExpirationTime = renderExpirationTime;
    else break;
    parent = parent.return;
  }
}
function prepareToReadContext(workInProgress, renderExpirationTime) {
  currentlyRenderingFiber = workInProgress;
  lastContextWithAllBitsObserved = lastContextDependency = null;
  workInProgress = workInProgress.dependencies;
  null !== workInProgress &&
    null !== workInProgress.firstContext &&
    (workInProgress.expirationTime >= renderExpirationTime &&
      (didReceiveUpdate = !0),
    (workInProgress.firstContext = null));
}
function readContext(context, observedBits) {
  if (
    lastContextWithAllBitsObserved !== context &&
    !1 !== observedBits &&
    0 !== observedBits
  ) {
    if ("number" !== typeof observedBits || 1073741823 === observedBits)
      (lastContextWithAllBitsObserved = context), (observedBits = 1073741823);
    observedBits = { context: context, observedBits: observedBits, next: null };
    if (null === lastContextDependency) {
      if (null === currentlyRenderingFiber) throw ReactErrorProd(Error(308));
      lastContextDependency = observedBits;
      currentlyRenderingFiber.dependencies = {
        expirationTime: 0,
        firstContext: observedBits,
        responders: null
      };
    } else lastContextDependency = lastContextDependency.next = observedBits;
  }
  return context._currentValue2;
}
var hasForceUpdate = !1;
function createUpdateQueue(baseState) {
  return {
    baseState: baseState,
    firstUpdate: null,
    lastUpdate: null,
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null
  };
}
function cloneUpdateQueue(currentQueue) {
  return {
    baseState: currentQueue.baseState,
    firstUpdate: currentQueue.firstUpdate,
    lastUpdate: currentQueue.lastUpdate,
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null
  };
}
function createUpdate(expirationTime, suspenseConfig) {
  return {
    expirationTime: expirationTime,
    suspenseConfig: suspenseConfig,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
    nextEffect: null
  };
}
function appendUpdateToQueue(queue, update) {
  null === queue.lastUpdate
    ? (queue.firstUpdate = queue.lastUpdate = update)
    : ((queue.lastUpdate.next = update), (queue.lastUpdate = update));
}
function enqueueUpdate(fiber, update) {
  var alternate = fiber.alternate;
  if (null === alternate) {
    var queue1 = fiber.updateQueue;
    var queue2 = null;
    null === queue1 &&
      (queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState));
  } else
    (queue1 = fiber.updateQueue),
      (queue2 = alternate.updateQueue),
      null === queue1
        ? null === queue2
          ? ((queue1 = fiber.updateQueue = createUpdateQueue(
              fiber.memoizedState
            )),
            (queue2 = alternate.updateQueue = createUpdateQueue(
              alternate.memoizedState
            )))
          : (queue1 = fiber.updateQueue = cloneUpdateQueue(queue2))
        : null === queue2 &&
          (queue2 = alternate.updateQueue = cloneUpdateQueue(queue1));
  null === queue2 || queue1 === queue2
    ? appendUpdateToQueue(queue1, update)
    : null === queue1.lastUpdate || null === queue2.lastUpdate
      ? (appendUpdateToQueue(queue1, update),
        appendUpdateToQueue(queue2, update))
      : (appendUpdateToQueue(queue1, update), (queue2.lastUpdate = update));
}
function enqueueCapturedUpdate(workInProgress, update) {
  var workInProgressQueue = workInProgress.updateQueue;
  workInProgressQueue =
    null === workInProgressQueue
      ? (workInProgress.updateQueue = createUpdateQueue(
          workInProgress.memoizedState
        ))
      : ensureWorkInProgressQueueIsAClone(workInProgress, workInProgressQueue);
  null === workInProgressQueue.lastCapturedUpdate
    ? (workInProgressQueue.firstCapturedUpdate = workInProgressQueue.lastCapturedUpdate = update)
    : ((workInProgressQueue.lastCapturedUpdate.next = update),
      (workInProgressQueue.lastCapturedUpdate = update));
}
function ensureWorkInProgressQueueIsAClone(workInProgress, queue) {
  var current = workInProgress.alternate;
  null !== current &&
    queue === current.updateQueue &&
    (queue = workInProgress.updateQueue = cloneUpdateQueue(queue));
  return queue;
}
function getStateFromUpdate(
  workInProgress,
  queue,
  update,
  prevState,
  nextProps,
  instance
) {
  switch (update.tag) {
    case 1:
      return (
        (workInProgress = update.payload),
        "function" === typeof workInProgress
          ? workInProgress.call(instance, prevState, nextProps)
          : workInProgress
      );
    case 3:
      workInProgress.effectTag = (workInProgress.effectTag & -4097) | 64;
    case 0:
      workInProgress = update.payload;
      nextProps =
        "function" === typeof workInProgress
          ? workInProgress.call(instance, prevState, nextProps)
          : workInProgress;
      if (null === nextProps || void 0 === nextProps) break;
      return Object.assign({}, prevState, nextProps);
    case 2:
      hasForceUpdate = !0;
  }
  return prevState;
}
function processUpdateQueue(
  workInProgress,
  queue,
  props,
  instance,
  renderExpirationTime
) {
  hasForceUpdate = !1;
  queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);
  for (
    var newBaseState = queue.baseState,
      newFirstUpdate = null,
      newExpirationTime = 0,
      update = queue.firstUpdate,
      resultState = newBaseState;
    null !== update;

  ) {
    var updateExpirationTime = update.expirationTime;
    updateExpirationTime < renderExpirationTime
      ? (null === newFirstUpdate &&
          ((newFirstUpdate = update), (newBaseState = resultState)),
        newExpirationTime < updateExpirationTime &&
          (newExpirationTime = updateExpirationTime))
      : (markRenderEventTimeAndConfig(
          updateExpirationTime,
          update.suspenseConfig
        ),
        (resultState = getStateFromUpdate(
          workInProgress,
          queue,
          update,
          resultState,
          props,
          instance
        )),
        null !== update.callback &&
          ((workInProgress.effectTag |= 32),
          (update.nextEffect = null),
          null === queue.lastEffect
            ? (queue.firstEffect = queue.lastEffect = update)
            : ((queue.lastEffect.nextEffect = update),
              (queue.lastEffect = update))));
    update = update.next;
  }
  updateExpirationTime = null;
  for (update = queue.firstCapturedUpdate; null !== update; ) {
    var _updateExpirationTime = update.expirationTime;
    _updateExpirationTime < renderExpirationTime
      ? (null === updateExpirationTime &&
          ((updateExpirationTime = update),
          null === newFirstUpdate && (newBaseState = resultState)),
        newExpirationTime < _updateExpirationTime &&
          (newExpirationTime = _updateExpirationTime))
      : ((resultState = getStateFromUpdate(
          workInProgress,
          queue,
          update,
          resultState,
          props,
          instance
        )),
        null !== update.callback &&
          ((workInProgress.effectTag |= 32),
          (update.nextEffect = null),
          null === queue.lastCapturedEffect
            ? (queue.firstCapturedEffect = queue.lastCapturedEffect = update)
            : ((queue.lastCapturedEffect.nextEffect = update),
              (queue.lastCapturedEffect = update))));
    update = update.next;
  }
  null === newFirstUpdate && (queue.lastUpdate = null);
  null === updateExpirationTime
    ? (queue.lastCapturedUpdate = null)
    : (workInProgress.effectTag |= 32);
  null === newFirstUpdate &&
    null === updateExpirationTime &&
    (newBaseState = resultState);
  queue.baseState = newBaseState;
  queue.firstUpdate = newFirstUpdate;
  queue.firstCapturedUpdate = updateExpirationTime;
  workInProgress.expirationTime = newExpirationTime;
  workInProgress.memoizedState = resultState;
}
function commitUpdateQueue(finishedWork, finishedQueue, instance) {
  null !== finishedQueue.firstCapturedUpdate &&
    (null !== finishedQueue.lastUpdate &&
      ((finishedQueue.lastUpdate.next = finishedQueue.firstCapturedUpdate),
      (finishedQueue.lastUpdate = finishedQueue.lastCapturedUpdate)),
    (finishedQueue.firstCapturedUpdate = finishedQueue.lastCapturedUpdate = null));
  commitUpdateEffects(finishedQueue.firstEffect, instance);
  finishedQueue.firstEffect = finishedQueue.lastEffect = null;
  commitUpdateEffects(finishedQueue.firstCapturedEffect, instance);
  finishedQueue.firstCapturedEffect = finishedQueue.lastCapturedEffect = null;
}
function commitUpdateEffects(effect, instance) {
  for (; null !== effect; ) {
    var callback = effect.callback;
    if (null !== callback) {
      effect.callback = null;
      var context = instance;
      if ("function" !== typeof callback)
        throw ReactErrorProd(Error(191), callback);
      callback.call(context);
    }
    effect = effect.nextEffect;
  }
}
var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig,
  emptyRefsObject = new React.Component().refs;
function applyDerivedStateFromProps(
  workInProgress,
  ctor,
  getDerivedStateFromProps,
  nextProps
) {
  ctor = workInProgress.memoizedState;
  getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
  getDerivedStateFromProps =
    null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps
      ? ctor
      : Object.assign({}, ctor, getDerivedStateFromProps);
  workInProgress.memoizedState = getDerivedStateFromProps;
  nextProps = workInProgress.updateQueue;
  null !== nextProps &&
    0 === workInProgress.expirationTime &&
    (nextProps.baseState = getDerivedStateFromProps);
}
var classComponentUpdater = {
  isMounted: function(component) {
    return (component = component._reactInternalFiber)
      ? 2 === isFiberMountedImpl(component)
      : !1;
  },
  enqueueSetState: function(inst, payload, callback) {
    inst = inst._reactInternalFiber;
    var currentTime = requestCurrentTime(),
      suspenseConfig = ReactCurrentBatchConfig.suspense;
    currentTime = computeExpirationForFiber(currentTime, inst, suspenseConfig);
    suspenseConfig = createUpdate(currentTime, suspenseConfig);
    suspenseConfig.payload = payload;
    void 0 !== callback &&
      null !== callback &&
      (suspenseConfig.callback = callback);
    enqueueUpdate(inst, suspenseConfig);
    scheduleUpdateOnFiber(inst, currentTime);
  },
  enqueueReplaceState: function(inst, payload, callback) {
    inst = inst._reactInternalFiber;
    var currentTime = requestCurrentTime(),
      suspenseConfig = ReactCurrentBatchConfig.suspense;
    currentTime = computeExpirationForFiber(currentTime, inst, suspenseConfig);
    suspenseConfig = createUpdate(currentTime, suspenseConfig);
    suspenseConfig.tag = 1;
    suspenseConfig.payload = payload;
    void 0 !== callback &&
      null !== callback &&
      (suspenseConfig.callback = callback);
    enqueueUpdate(inst, suspenseConfig);
    scheduleUpdateOnFiber(inst, currentTime);
  },
  enqueueForceUpdate: function(inst, callback) {
    inst = inst._reactInternalFiber;
    var currentTime = requestCurrentTime(),
      suspenseConfig = ReactCurrentBatchConfig.suspense;
    currentTime = computeExpirationForFiber(currentTime, inst, suspenseConfig);
    suspenseConfig = createUpdate(currentTime, suspenseConfig);
    suspenseConfig.tag = 2;
    void 0 !== callback &&
      null !== callback &&
      (suspenseConfig.callback = callback);
    enqueueUpdate(inst, suspenseConfig);
    scheduleUpdateOnFiber(inst, currentTime);
  }
};
function checkShouldComponentUpdate(
  workInProgress,
  ctor,
  oldProps,
  newProps,
  oldState,
  newState,
  nextContext
) {
  workInProgress = workInProgress.stateNode;
  return "function" === typeof workInProgress.shouldComponentUpdate
    ? workInProgress.shouldComponentUpdate(newProps, newState, nextContext)
    : ctor.prototype && ctor.prototype.isPureReactComponent
      ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
      : !0;
}
function constructClassInstance(workInProgress, ctor, props) {
  var isLegacyContextConsumer = !1,
    unmaskedContext = emptyContextObject,
    context = emptyContextObject,
    contextType = ctor.contextType;
  "object" === typeof contextType && null !== contextType
    ? (context = readContext(contextType))
    : disableLegacyContext ||
      ((unmaskedContext = getUnmaskedContext(workInProgress, ctor, !0)),
      (context = ctor.contextTypes),
      (context = (isLegacyContextConsumer =
        null !== context && void 0 !== context)
        ? getMaskedContext(workInProgress, unmaskedContext)
        : emptyContextObject));
  ctor = new ctor(props, context);
  workInProgress.memoizedState =
    null !== ctor.state && void 0 !== ctor.state ? ctor.state : null;
  ctor.updater = classComponentUpdater;
  workInProgress.stateNode = ctor;
  ctor._reactInternalFiber = workInProgress;
  isLegacyContextConsumer &&
    !disableLegacyContext &&
    ((workInProgress = workInProgress.stateNode),
    (workInProgress.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext),
    (workInProgress.__reactInternalMemoizedMaskedChildContext = context));
  return ctor;
}
function callComponentWillReceiveProps(
  workInProgress,
  instance,
  newProps,
  nextContext
) {
  workInProgress = instance.state;
  "function" === typeof instance.componentWillReceiveProps &&
    instance.componentWillReceiveProps(newProps, nextContext);
  "function" === typeof instance.UNSAFE_componentWillReceiveProps &&
    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  instance.state !== workInProgress &&
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
}
function mountClassInstance(
  workInProgress,
  ctor,
  newProps,
  renderExpirationTime
) {
  var instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;
  var contextType = ctor.contextType;
  "object" === typeof contextType && null !== contextType
    ? (instance.context = readContext(contextType))
    : disableLegacyContext
      ? (instance.context = emptyContextObject)
      : ((contextType = getUnmaskedContext(workInProgress, ctor, !0)),
        (instance.context = getMaskedContext(workInProgress, contextType)));
  contextType = workInProgress.updateQueue;
  null !== contextType &&
    (processUpdateQueue(
      workInProgress,
      contextType,
      newProps,
      instance,
      renderExpirationTime
    ),
    (instance.state = workInProgress.memoizedState));
  contextType = ctor.getDerivedStateFromProps;
  "function" === typeof contextType &&
    (applyDerivedStateFromProps(workInProgress, ctor, contextType, newProps),
    (instance.state = workInProgress.memoizedState));
  "function" === typeof ctor.getDerivedStateFromProps ||
    "function" === typeof instance.getSnapshotBeforeUpdate ||
    ("function" !== typeof instance.UNSAFE_componentWillMount &&
      "function" !== typeof instance.componentWillMount) ||
    ((ctor = instance.state),
    "function" === typeof instance.componentWillMount &&
      instance.componentWillMount(),
    "function" === typeof instance.UNSAFE_componentWillMount &&
      instance.UNSAFE_componentWillMount(),
    ctor !== instance.state &&
      classComponentUpdater.enqueueReplaceState(instance, instance.state, null),
    (contextType = workInProgress.updateQueue),
    null !== contextType &&
      (processUpdateQueue(
        workInProgress,
        contextType,
        newProps,
        instance,
        renderExpirationTime
      ),
      (instance.state = workInProgress.memoizedState)));
  "function" === typeof instance.componentDidMount &&
    (workInProgress.effectTag |= 4);
}
var isArray = Array.isArray;
function coerceRef(returnFiber, current$$1, element) {
  returnFiber = element.ref;
  if (
    null !== returnFiber &&
    "function" !== typeof returnFiber &&
    "object" !== typeof returnFiber
  ) {
    if (element._owner) {
      element = element._owner;
      if (element) {
        if (1 !== element.tag) throw ReactErrorProd(Error(309));
        var inst = element.stateNode;
      }
      if (!inst) throw ReactErrorProd(Error(147), returnFiber);
      var stringRef = "" + returnFiber;
      if (
        null !== current$$1 &&
        null !== current$$1.ref &&
        "function" === typeof current$$1.ref &&
        current$$1.ref._stringRef === stringRef
      )
        return current$$1.ref;
      current$$1 = function(value) {
        var refs = inst.refs;
        refs === emptyRefsObject && (refs = inst.refs = {});
        null === value ? delete refs[stringRef] : (refs[stringRef] = value);
      };
      current$$1._stringRef = stringRef;
      return current$$1;
    }
    if ("string" !== typeof returnFiber) throw ReactErrorProd(Error(284));
    if (!element._owner) throw ReactErrorProd(Error(290), returnFiber);
  }
  return returnFiber;
}
function throwOnInvalidObjectType(returnFiber, newChild) {
  if ("textarea" !== returnFiber.type)
    throw ReactErrorProd(
      Error(31),
      "[object Object]" === Object.prototype.toString.call(newChild)
        ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
        : newChild,
      ""
    );
}
function ChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (shouldTrackSideEffects) {
      var last = returnFiber.lastEffect;
      null !== last
        ? ((last.nextEffect = childToDelete),
          (returnFiber.lastEffect = childToDelete))
        : (returnFiber.firstEffect = returnFiber.lastEffect = childToDelete);
      childToDelete.nextEffect = null;
      childToDelete.effectTag = 8;
    }
  }
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) return null;
    for (; null !== currentFirstChild; )
      deleteChild(returnFiber, currentFirstChild),
        (currentFirstChild = currentFirstChild.sibling);
    return null;
  }
  function mapRemainingChildren(returnFiber, currentFirstChild) {
    for (returnFiber = new Map(); null !== currentFirstChild; )
      null !== currentFirstChild.key
        ? returnFiber.set(currentFirstChild.key, currentFirstChild)
        : returnFiber.set(currentFirstChild.index, currentFirstChild),
        (currentFirstChild = currentFirstChild.sibling);
    return returnFiber;
  }
  function useFiber(fiber, pendingProps, expirationTime) {
    fiber = createWorkInProgress(fiber, pendingProps, expirationTime);
    fiber.index = 0;
    fiber.sibling = null;
    return fiber;
  }
  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) return lastPlacedIndex;
    newIndex = newFiber.alternate;
    if (null !== newIndex)
      return (
        (newIndex = newIndex.index),
        newIndex < lastPlacedIndex
          ? ((newFiber.effectTag = 2), lastPlacedIndex)
          : newIndex
      );
    newFiber.effectTag = 2;
    return lastPlacedIndex;
  }
  function placeSingleChild(newFiber) {
    shouldTrackSideEffects &&
      null === newFiber.alternate &&
      (newFiber.effectTag = 2);
    return newFiber;
  }
  function updateTextNode(
    returnFiber,
    current$$1,
    textContent,
    expirationTime
  ) {
    if (null === current$$1 || 6 !== current$$1.tag)
      return (
        (current$$1 = createFiberFromText(
          textContent,
          returnFiber.mode,
          expirationTime
        )),
        (current$$1.return = returnFiber),
        current$$1
      );
    current$$1 = useFiber(current$$1, textContent, expirationTime);
    current$$1.return = returnFiber;
    return current$$1;
  }
  function updateElement(returnFiber, current$$1, element, expirationTime) {
    if (null !== current$$1 && current$$1.elementType === element.type)
      return (
        (expirationTime = useFiber(current$$1, element.props, expirationTime)),
        (expirationTime.ref = coerceRef(returnFiber, current$$1, element)),
        (expirationTime.return = returnFiber),
        expirationTime
      );
    expirationTime = createFiberFromTypeAndProps(
      element.type,
      element.key,
      element.props,
      null,
      returnFiber.mode,
      expirationTime
    );
    expirationTime.ref = coerceRef(returnFiber, current$$1, element);
    expirationTime.return = returnFiber;
    return expirationTime;
  }
  function updatePortal(returnFiber, current$$1, portal, expirationTime) {
    if (
      null === current$$1 ||
      4 !== current$$1.tag ||
      current$$1.stateNode.containerInfo !== portal.containerInfo ||
      current$$1.stateNode.implementation !== portal.implementation
    )
      return (
        (current$$1 = createFiberFromPortal(
          portal,
          returnFiber.mode,
          expirationTime
        )),
        (current$$1.return = returnFiber),
        current$$1
      );
    current$$1 = useFiber(current$$1, portal.children || [], expirationTime);
    current$$1.return = returnFiber;
    return current$$1;
  }
  function updateFragment(
    returnFiber,
    current$$1,
    fragment,
    expirationTime,
    key
  ) {
    if (null === current$$1 || 7 !== current$$1.tag)
      return (
        (current$$1 = createFiberFromFragment(
          fragment,
          returnFiber.mode,
          expirationTime,
          key
        )),
        (current$$1.return = returnFiber),
        current$$1
      );
    current$$1 = useFiber(current$$1, fragment, expirationTime);
    current$$1.return = returnFiber;
    return current$$1;
  }
  function createChild(returnFiber, newChild, expirationTime) {
    if ("string" === typeof newChild || "number" === typeof newChild)
      return (
        (newChild = createFiberFromText(
          "" + newChild,
          returnFiber.mode,
          expirationTime
        )),
        (newChild.return = returnFiber),
        newChild
      );
    if ("object" === typeof newChild && null !== newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE$1:
          return (
            (expirationTime = createFiberFromTypeAndProps(
              newChild.type,
              newChild.key,
              newChild.props,
              null,
              returnFiber.mode,
              expirationTime
            )),
            (expirationTime.ref = coerceRef(returnFiber, null, newChild)),
            (expirationTime.return = returnFiber),
            expirationTime
          );
        case REACT_PORTAL_TYPE:
          return (
            (newChild = createFiberFromPortal(
              newChild,
              returnFiber.mode,
              expirationTime
            )),
            (newChild.return = returnFiber),
            newChild
          );
      }
      if (isArray(newChild) || getIteratorFn(newChild))
        return (
          (newChild = createFiberFromFragment(
            newChild,
            returnFiber.mode,
            expirationTime,
            null
          )),
          (newChild.return = returnFiber),
          newChild
        );
      throwOnInvalidObjectType(returnFiber, newChild);
    }
    return null;
  }
  function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
    var key = null !== oldFiber ? oldFiber.key : null;
    if ("string" === typeof newChild || "number" === typeof newChild)
      return null !== key
        ? null
        : updateTextNode(returnFiber, oldFiber, "" + newChild, expirationTime);
    if ("object" === typeof newChild && null !== newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE$1:
          return newChild.key === key
            ? newChild.type === REACT_FRAGMENT_TYPE
              ? updateFragment(
                  returnFiber,
                  oldFiber,
                  newChild.props.children,
                  expirationTime,
                  key
                )
              : updateElement(returnFiber, oldFiber, newChild, expirationTime)
            : null;
        case REACT_PORTAL_TYPE:
          return newChild.key === key
            ? updatePortal(returnFiber, oldFiber, newChild, expirationTime)
            : null;
      }
      if (isArray(newChild) || getIteratorFn(newChild))
        return null !== key
          ? null
          : updateFragment(
              returnFiber,
              oldFiber,
              newChild,
              expirationTime,
              null
            );
      throwOnInvalidObjectType(returnFiber, newChild);
    }
    return null;
  }
  function updateFromMap(
    existingChildren,
    returnFiber,
    newIdx,
    newChild,
    expirationTime
  ) {
    if ("string" === typeof newChild || "number" === typeof newChild)
      return (
        (existingChildren = existingChildren.get(newIdx) || null),
        updateTextNode(
          returnFiber,
          existingChildren,
          "" + newChild,
          expirationTime
        )
      );
    if ("object" === typeof newChild && null !== newChild) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE$1:
          return (
            (existingChildren =
              existingChildren.get(
                null === newChild.key ? newIdx : newChild.key
              ) || null),
            newChild.type === REACT_FRAGMENT_TYPE
              ? updateFragment(
                  returnFiber,
                  existingChildren,
                  newChild.props.children,
                  expirationTime,
                  newChild.key
                )
              : updateElement(
                  returnFiber,
                  existingChildren,
                  newChild,
                  expirationTime
                )
          );
        case REACT_PORTAL_TYPE:
          return (
            (existingChildren =
              existingChildren.get(
                null === newChild.key ? newIdx : newChild.key
              ) || null),
            updatePortal(
              returnFiber,
              existingChildren,
              newChild,
              expirationTime
            )
          );
      }
      if (isArray(newChild) || getIteratorFn(newChild))
        return (
          (existingChildren = existingChildren.get(newIdx) || null),
          updateFragment(
            returnFiber,
            existingChildren,
            newChild,
            expirationTime,
            null
          )
        );
      throwOnInvalidObjectType(returnFiber, newChild);
    }
    return null;
  }
  function reconcileChildrenArray(
    returnFiber,
    currentFirstChild,
    newChildren,
    expirationTime
  ) {
    for (
      var resultingFirstChild = null,
        previousNewFiber = null,
        oldFiber = currentFirstChild,
        newIdx = (currentFirstChild = 0),
        nextOldFiber = null;
      null !== oldFiber && newIdx < newChildren.length;
      newIdx++
    ) {
      oldFiber.index > newIdx
        ? ((nextOldFiber = oldFiber), (oldFiber = null))
        : (nextOldFiber = oldFiber.sibling);
      var newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        expirationTime
      );
      if (null === newFiber) {
        null === oldFiber && (oldFiber = nextOldFiber);
        break;
      }
      shouldTrackSideEffects &&
        oldFiber &&
        null === newFiber.alternate &&
        deleteChild(returnFiber, oldFiber);
      currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
      null === previousNewFiber
        ? (resultingFirstChild = newFiber)
        : (previousNewFiber.sibling = newFiber);
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    if (newIdx === newChildren.length)
      return (
        deleteRemainingChildren(returnFiber, oldFiber), resultingFirstChild
      );
    if (null === oldFiber) {
      for (; newIdx < newChildren.length; newIdx++)
        (oldFiber = createChild(
          returnFiber,
          newChildren[newIdx],
          expirationTime
        )),
          null !== oldFiber &&
            ((currentFirstChild = placeChild(
              oldFiber,
              currentFirstChild,
              newIdx
            )),
            null === previousNewFiber
              ? (resultingFirstChild = oldFiber)
              : (previousNewFiber.sibling = oldFiber),
            (previousNewFiber = oldFiber));
      return resultingFirstChild;
    }
    for (
      oldFiber = mapRemainingChildren(returnFiber, oldFiber);
      newIdx < newChildren.length;
      newIdx++
    )
      (nextOldFiber = updateFromMap(
        oldFiber,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        expirationTime
      )),
        null !== nextOldFiber &&
          (shouldTrackSideEffects &&
            null !== nextOldFiber.alternate &&
            oldFiber.delete(
              null === nextOldFiber.key ? newIdx : nextOldFiber.key
            ),
          (currentFirstChild = placeChild(
            nextOldFiber,
            currentFirstChild,
            newIdx
          )),
          null === previousNewFiber
            ? (resultingFirstChild = nextOldFiber)
            : (previousNewFiber.sibling = nextOldFiber),
          (previousNewFiber = nextOldFiber));
    shouldTrackSideEffects &&
      oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
    return resultingFirstChild;
  }
  function reconcileChildrenIterator(
    returnFiber,
    currentFirstChild,
    newChildrenIterable,
    expirationTime
  ) {
    var iteratorFn = getIteratorFn(newChildrenIterable);
    if ("function" !== typeof iteratorFn) throw ReactErrorProd(Error(150));
    newChildrenIterable = iteratorFn.call(newChildrenIterable);
    if (null == newChildrenIterable) throw ReactErrorProd(Error(151));
    for (
      var previousNewFiber = (iteratorFn = null),
        oldFiber = currentFirstChild,
        newIdx = (currentFirstChild = 0),
        nextOldFiber = null,
        step = newChildrenIterable.next();
      null !== oldFiber && !step.done;
      newIdx++, step = newChildrenIterable.next()
    ) {
      oldFiber.index > newIdx
        ? ((nextOldFiber = oldFiber), (oldFiber = null))
        : (nextOldFiber = oldFiber.sibling);
      var newFiber = updateSlot(
        returnFiber,
        oldFiber,
        step.value,
        expirationTime
      );
      if (null === newFiber) {
        null === oldFiber && (oldFiber = nextOldFiber);
        break;
      }
      shouldTrackSideEffects &&
        oldFiber &&
        null === newFiber.alternate &&
        deleteChild(returnFiber, oldFiber);
      currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
      null === previousNewFiber
        ? (iteratorFn = newFiber)
        : (previousNewFiber.sibling = newFiber);
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    if (step.done)
      return deleteRemainingChildren(returnFiber, oldFiber), iteratorFn;
    if (null === oldFiber) {
      for (; !step.done; newIdx++, step = newChildrenIterable.next())
        (step = createChild(returnFiber, step.value, expirationTime)),
          null !== step &&
            ((currentFirstChild = placeChild(step, currentFirstChild, newIdx)),
            null === previousNewFiber
              ? (iteratorFn = step)
              : (previousNewFiber.sibling = step),
            (previousNewFiber = step));
      return iteratorFn;
    }
    for (
      oldFiber = mapRemainingChildren(returnFiber, oldFiber);
      !step.done;
      newIdx++, step = newChildrenIterable.next()
    )
      (step = updateFromMap(
        oldFiber,
        returnFiber,
        newIdx,
        step.value,
        expirationTime
      )),
        null !== step &&
          (shouldTrackSideEffects &&
            null !== step.alternate &&
            oldFiber.delete(null === step.key ? newIdx : step.key),
          (currentFirstChild = placeChild(step, currentFirstChild, newIdx)),
          null === previousNewFiber
            ? (iteratorFn = step)
            : (previousNewFiber.sibling = step),
          (previousNewFiber = step));
    shouldTrackSideEffects &&
      oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
    return iteratorFn;
  }
  return function(returnFiber, currentFirstChild, newChild, expirationTime) {
    var isUnkeyedTopLevelFragment =
      "object" === typeof newChild &&
      null !== newChild &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      null === newChild.key;
    isUnkeyedTopLevelFragment && (newChild = newChild.props.children);
    var isObject = "object" === typeof newChild && null !== newChild;
    if (isObject)
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE$1:
          a: {
            isObject = newChild.key;
            for (
              isUnkeyedTopLevelFragment = currentFirstChild;
              null !== isUnkeyedTopLevelFragment;

            ) {
              if (isUnkeyedTopLevelFragment.key === isObject) {
                if (
                  7 === isUnkeyedTopLevelFragment.tag
                    ? newChild.type === REACT_FRAGMENT_TYPE
                    : isUnkeyedTopLevelFragment.elementType === newChild.type
                ) {
                  deleteRemainingChildren(
                    returnFiber,
                    isUnkeyedTopLevelFragment.sibling
                  );
                  currentFirstChild = useFiber(
                    isUnkeyedTopLevelFragment,
                    newChild.type === REACT_FRAGMENT_TYPE
                      ? newChild.props.children
                      : newChild.props,
                    expirationTime
                  );
                  currentFirstChild.ref = coerceRef(
                    returnFiber,
                    isUnkeyedTopLevelFragment,
                    newChild
                  );
                  currentFirstChild.return = returnFiber;
                  returnFiber = currentFirstChild;
                  break a;
                }
                deleteRemainingChildren(returnFiber, isUnkeyedTopLevelFragment);
                break;
              } else deleteChild(returnFiber, isUnkeyedTopLevelFragment);
              isUnkeyedTopLevelFragment = isUnkeyedTopLevelFragment.sibling;
            }
            newChild.type === REACT_FRAGMENT_TYPE
              ? ((currentFirstChild = createFiberFromFragment(
                  newChild.props.children,
                  returnFiber.mode,
                  expirationTime,
                  newChild.key
                )),
                (currentFirstChild.return = returnFiber),
                (returnFiber = currentFirstChild))
              : ((expirationTime = createFiberFromTypeAndProps(
                  newChild.type,
                  newChild.key,
                  newChild.props,
                  null,
                  returnFiber.mode,
                  expirationTime
                )),
                (expirationTime.ref = coerceRef(
                  returnFiber,
                  currentFirstChild,
                  newChild
                )),
                (expirationTime.return = returnFiber),
                (returnFiber = expirationTime));
          }
          return placeSingleChild(returnFiber);
        case REACT_PORTAL_TYPE:
          a: {
            for (
              isUnkeyedTopLevelFragment = newChild.key;
              null !== currentFirstChild;

            ) {
              if (currentFirstChild.key === isUnkeyedTopLevelFragment) {
                if (
                  4 === currentFirstChild.tag &&
                  currentFirstChild.stateNode.containerInfo ===
                    newChild.containerInfo &&
                  currentFirstChild.stateNode.implementation ===
                    newChild.implementation
                ) {
                  deleteRemainingChildren(
                    returnFiber,
                    currentFirstChild.sibling
                  );
                  currentFirstChild = useFiber(
                    currentFirstChild,
                    newChild.children || [],
                    expirationTime
                  );
                  currentFirstChild.return = returnFiber;
                  returnFiber = currentFirstChild;
                  break a;
                }
                deleteRemainingChildren(returnFiber, currentFirstChild);
                break;
              } else deleteChild(returnFiber, currentFirstChild);
              currentFirstChild = currentFirstChild.sibling;
            }
            currentFirstChild = createFiberFromPortal(
              newChild,
              returnFiber.mode,
              expirationTime
            );
            currentFirstChild.return = returnFiber;
            returnFiber = currentFirstChild;
          }
          return placeSingleChild(returnFiber);
      }
    if ("string" === typeof newChild || "number" === typeof newChild)
      return (
        (newChild = "" + newChild),
        null !== currentFirstChild && 6 === currentFirstChild.tag
          ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling),
            (currentFirstChild = useFiber(
              currentFirstChild,
              newChild,
              expirationTime
            )),
            (currentFirstChild.return = returnFiber),
            (returnFiber = currentFirstChild))
          : (deleteRemainingChildren(returnFiber, currentFirstChild),
            (currentFirstChild = createFiberFromText(
              newChild,
              returnFiber.mode,
              expirationTime
            )),
            (currentFirstChild.return = returnFiber),
            (returnFiber = currentFirstChild)),
        placeSingleChild(returnFiber)
      );
    if (isArray(newChild))
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime
      );
    if (getIteratorFn(newChild))
      return reconcileChildrenIterator(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime
      );
    isObject && throwOnInvalidObjectType(returnFiber, newChild);
    if ("undefined" === typeof newChild && !isUnkeyedTopLevelFragment)
      switch (returnFiber.tag) {
        case 1:
        case 0:
          throw ((returnFiber = returnFiber.type),
          ReactErrorProd(
            Error(152),
            returnFiber.displayName || returnFiber.name || "Component"
          ));
      }
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  };
}
var reconcileChildFibers = ChildReconciler(!0),
  mountChildFibers = ChildReconciler(!1),
  NO_CONTEXT$1 = {},
  contextStackCursor$1 = { current: NO_CONTEXT$1 },
  contextFiberStackCursor = { current: NO_CONTEXT$1 },
  rootInstanceStackCursor = { current: NO_CONTEXT$1 };
function requiredContext(c) {
  if (c === NO_CONTEXT$1) throw ReactErrorProd(Error(174));
  return c;
}
function pushHostContainer(fiber, nextRootInstance) {
  push(rootInstanceStackCursor, nextRootInstance, fiber);
  push(contextFiberStackCursor, fiber, fiber);
  push(contextStackCursor$1, NO_CONTEXT$1, fiber);
  pop(contextStackCursor$1, fiber);
  push(contextStackCursor$1, NO_CONTEXT, fiber);
}
function popHostContainer(fiber) {
  pop(contextStackCursor$1, fiber);
  pop(contextFiberStackCursor, fiber);
  pop(rootInstanceStackCursor, fiber);
}
function pushHostContext(fiber) {
  requiredContext(rootInstanceStackCursor.current);
  requiredContext(contextStackCursor$1.current) !== NO_CONTEXT &&
    (push(contextFiberStackCursor, fiber, fiber),
    push(contextStackCursor$1, NO_CONTEXT, fiber));
}
function popHostContext(fiber) {
  contextFiberStackCursor.current === fiber &&
    (pop(contextStackCursor$1, fiber), pop(contextFiberStackCursor, fiber));
}
var suspenseStackCursor = { current: 0 };
function findFirstSuspended(row) {
  for (var node = row; null !== node; ) {
    if (13 === node.tag) {
      var state = node.memoizedState;
      if (
        null !== state &&
        ((state = state.dehydrated),
        null === state || shim$1(state) || shim$1(state))
      )
        return node;
    } else if (19 === node.tag && void 0 !== node.memoizedProps.revealOrder) {
      if (0 !== (node.effectTag & 64)) return node;
    } else if (null !== node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === row) break;
    for (; null === node.sibling; ) {
      if (null === node.return || node.return === row) return null;
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
  return null;
}
var isArray$2 = Array.isArray;
function updateEventListener(
  listener,
  fiber,
  visistedResponders,
  respondersMap
) {
  if (listener) {
    var responder = listener.responder;
    var props = listener.props;
  }
  if (!responder || responder.$$typeof !== REACT_RESPONDER_TYPE)
    throw ReactErrorProd(Error(339));
  listener = props;
  if (!visistedResponders.has(responder)) {
    visistedResponders.add(responder);
    visistedResponders = respondersMap.get(responder);
    if (void 0 === visistedResponders)
      throw ((fiber = responder.getInitialState),
      null !== fiber && fiber(listener),
      Error("Not yet implemented."));
    visistedResponders.props = listener;
    visistedResponders.fiber = fiber;
  }
}
function updateEventListeners(listeners, instance, fiber) {
  var visistedResponders = new Set(),
    dependencies = fiber.dependencies;
  if (null != listeners) {
    null === dependencies &&
      (dependencies = fiber.dependencies = {
        expirationTime: 0,
        firstContext: null,
        responders: new Map()
      });
    var respondersMap = dependencies.responders;
    null === respondersMap && (respondersMap = new Map());
    if (isArray$2(listeners))
      for (var i = 0, length = listeners.length; i < length; i++)
        updateEventListener(
          listeners[i],
          fiber,
          visistedResponders,
          respondersMap,
          instance
        );
    else
      updateEventListener(
        listeners,
        fiber,
        visistedResponders,
        respondersMap,
        instance
      );
  }
  if (
    null !== dependencies &&
    ((listeners = dependencies.responders), null !== listeners)
  )
    for (
      instance = Array.from(listeners.keys()),
        fiber = 0,
        dependencies = instance.length;
      fiber < dependencies;
      fiber++
    )
      (respondersMap = instance[fiber]),
        visistedResponders.has(respondersMap) ||
          ((i = listeners.get(respondersMap)),
          unmountResponderInstance(i),
          listeners.delete(respondersMap));
}
function createResponderListener(responder, props) {
  return { responder: responder, props: props };
}
var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher,
  renderExpirationTime$1 = 0,
  currentlyRenderingFiber$1 = null,
  currentHook = null,
  nextCurrentHook = null,
  firstWorkInProgressHook = null,
  workInProgressHook = null,
  nextWorkInProgressHook = null,
  remainingExpirationTime = 0,
  componentUpdateQueue = null,
  sideEffectTag = 0,
  didScheduleRenderPhaseUpdate = !1,
  renderPhaseUpdates = null,
  numberOfReRenders = 0;
function throwInvalidHookError() {
  throw ReactErrorProd(Error(321));
}
function areHookInputsEqual(nextDeps, prevDeps) {
  if (null === prevDeps) return !1;
  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
    if (!is(nextDeps[i], prevDeps[i])) return !1;
  return !0;
}
function renderWithHooks(
  current,
  workInProgress,
  Component,
  props,
  refOrContext,
  nextRenderExpirationTime
) {
  renderExpirationTime$1 = nextRenderExpirationTime;
  currentlyRenderingFiber$1 = workInProgress;
  nextCurrentHook = null !== current ? current.memoizedState : null;
  ReactCurrentDispatcher$1.current =
    null === nextCurrentHook ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
  workInProgress = Component(props, refOrContext);
  if (didScheduleRenderPhaseUpdate) {
    do
      (didScheduleRenderPhaseUpdate = !1),
        (numberOfReRenders += 1),
        (nextCurrentHook = null !== current ? current.memoizedState : null),
        (nextWorkInProgressHook = firstWorkInProgressHook),
        (componentUpdateQueue = workInProgressHook = currentHook = null),
        (ReactCurrentDispatcher$1.current = HooksDispatcherOnUpdate),
        (workInProgress = Component(props, refOrContext));
    while (didScheduleRenderPhaseUpdate);
    renderPhaseUpdates = null;
    numberOfReRenders = 0;
  }
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  current = currentlyRenderingFiber$1;
  current.memoizedState = firstWorkInProgressHook;
  current.expirationTime = remainingExpirationTime;
  current.updateQueue = componentUpdateQueue;
  current.effectTag |= sideEffectTag;
  current = null !== currentHook && null !== currentHook.next;
  renderExpirationTime$1 = 0;
  nextWorkInProgressHook = workInProgressHook = firstWorkInProgressHook = nextCurrentHook = currentHook = currentlyRenderingFiber$1 = null;
  remainingExpirationTime = 0;
  componentUpdateQueue = null;
  sideEffectTag = 0;
  if (current) throw ReactErrorProd(Error(300));
  return workInProgress;
}
function resetHooks() {
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  renderExpirationTime$1 = 0;
  nextWorkInProgressHook = workInProgressHook = firstWorkInProgressHook = nextCurrentHook = currentHook = currentlyRenderingFiber$1 = null;
  remainingExpirationTime = 0;
  componentUpdateQueue = null;
  sideEffectTag = 0;
  didScheduleRenderPhaseUpdate = !1;
  renderPhaseUpdates = null;
  numberOfReRenders = 0;
}
function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    queue: null,
    baseUpdate: null,
    next: null
  };
  null === workInProgressHook
    ? (firstWorkInProgressHook = workInProgressHook = hook)
    : (workInProgressHook = workInProgressHook.next = hook);
  return workInProgressHook;
}
function updateWorkInProgressHook() {
  if (null !== nextWorkInProgressHook)
    (workInProgressHook = nextWorkInProgressHook),
      (nextWorkInProgressHook = workInProgressHook.next),
      (currentHook = nextCurrentHook),
      (nextCurrentHook = null !== currentHook ? currentHook.next : null);
  else {
    if (null === nextCurrentHook) throw ReactErrorProd(Error(310));
    currentHook = nextCurrentHook;
    var newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      queue: currentHook.queue,
      baseUpdate: currentHook.baseUpdate,
      next: null
    };
    workInProgressHook =
      null === workInProgressHook
        ? (firstWorkInProgressHook = newHook)
        : (workInProgressHook.next = newHook);
    nextCurrentHook = currentHook.next;
  }
  return workInProgressHook;
}
function basicStateReducer(state, action) {
  return "function" === typeof action ? action(state) : action;
}
function updateReducer(reducer) {
  var hook = updateWorkInProgressHook(),
    queue = hook.queue;
  if (null === queue) throw ReactErrorProd(Error(311));
  queue.lastRenderedReducer = reducer;
  if (0 < numberOfReRenders) {
    var _dispatch = queue.dispatch;
    if (null !== renderPhaseUpdates) {
      var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
      if (void 0 !== firstRenderPhaseUpdate) {
        renderPhaseUpdates.delete(queue);
        var newState = hook.memoizedState;
        do
          (newState = reducer(newState, firstRenderPhaseUpdate.action)),
            (firstRenderPhaseUpdate = firstRenderPhaseUpdate.next);
        while (null !== firstRenderPhaseUpdate);
        is(newState, hook.memoizedState) || (didReceiveUpdate = !0);
        hook.memoizedState = newState;
        hook.baseUpdate === queue.last && (hook.baseState = newState);
        queue.lastRenderedState = newState;
        return [newState, _dispatch];
      }
    }
    return [hook.memoizedState, _dispatch];
  }
  _dispatch = queue.last;
  var baseUpdate = hook.baseUpdate;
  newState = hook.baseState;
  null !== baseUpdate
    ? (null !== _dispatch && (_dispatch.next = null),
      (_dispatch = baseUpdate.next))
    : (_dispatch = null !== _dispatch ? _dispatch.next : null);
  if (null !== _dispatch) {
    var newBaseUpdate = (firstRenderPhaseUpdate = null),
      _update = _dispatch,
      didSkip = !1;
    do {
      var updateExpirationTime = _update.expirationTime;
      updateExpirationTime < renderExpirationTime$1
        ? (didSkip ||
            ((didSkip = !0),
            (newBaseUpdate = baseUpdate),
            (firstRenderPhaseUpdate = newState)),
          updateExpirationTime > remainingExpirationTime &&
            (remainingExpirationTime = updateExpirationTime))
        : (markRenderEventTimeAndConfig(
            updateExpirationTime,
            _update.suspenseConfig
          ),
          (newState =
            _update.eagerReducer === reducer
              ? _update.eagerState
              : reducer(newState, _update.action)));
      baseUpdate = _update;
      _update = _update.next;
    } while (null !== _update && _update !== _dispatch);
    didSkip ||
      ((newBaseUpdate = baseUpdate), (firstRenderPhaseUpdate = newState));
    is(newState, hook.memoizedState) || (didReceiveUpdate = !0);
    hook.memoizedState = newState;
    hook.baseUpdate = newBaseUpdate;
    hook.baseState = firstRenderPhaseUpdate;
    queue.lastRenderedState = newState;
  }
  return [hook.memoizedState, queue.dispatch];
}
function pushEffect(tag, create, destroy, deps) {
  tag = { tag: tag, create: create, destroy: destroy, deps: deps, next: null };
  null === componentUpdateQueue
    ? ((componentUpdateQueue = { lastEffect: null }),
      (componentUpdateQueue.lastEffect = tag.next = tag))
    : ((create = componentUpdateQueue.lastEffect),
      null === create
        ? (componentUpdateQueue.lastEffect = tag.next = tag)
        : ((destroy = create.next),
          (create.next = tag),
          (tag.next = destroy),
          (componentUpdateQueue.lastEffect = tag)));
  return tag;
}
function mountEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
  var hook = mountWorkInProgressHook();
  sideEffectTag |= fiberEffectTag;
  hook.memoizedState = pushEffect(
    hookEffectTag,
    create,
    void 0,
    void 0 === deps ? null : deps
  );
}
function updateEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
  var hook = updateWorkInProgressHook();
  deps = void 0 === deps ? null : deps;
  var destroy = void 0;
  if (null !== currentHook) {
    var prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (null !== deps && areHookInputsEqual(deps, prevEffect.deps)) {
      pushEffect(0, create, destroy, deps);
      return;
    }
  }
  sideEffectTag |= fiberEffectTag;
  hook.memoizedState = pushEffect(hookEffectTag, create, destroy, deps);
}
function imperativeHandleEffect(create, ref) {
  if ("function" === typeof ref)
    return (
      (create = create()),
      ref(create),
      function() {
        ref(null);
      }
    );
  if (null !== ref && void 0 !== ref)
    return (
      (create = create()),
      (ref.current = create),
      function() {
        ref.current = null;
      }
    );
}
function mountDebugValue() {}
function dispatchAction(fiber, queue, action) {
  if (!(25 > numberOfReRenders)) throw ReactErrorProd(Error(301));
  var alternate = fiber.alternate;
  if (
    fiber === currentlyRenderingFiber$1 ||
    (null !== alternate && alternate === currentlyRenderingFiber$1)
  )
    if (
      ((didScheduleRenderPhaseUpdate = !0),
      (fiber = {
        expirationTime: renderExpirationTime$1,
        suspenseConfig: null,
        action: action,
        eagerReducer: null,
        eagerState: null,
        next: null
      }),
      null === renderPhaseUpdates && (renderPhaseUpdates = new Map()),
      (action = renderPhaseUpdates.get(queue)),
      void 0 === action)
    )
      renderPhaseUpdates.set(queue, fiber);
    else {
      for (queue = action; null !== queue.next; ) queue = queue.next;
      queue.next = fiber;
    }
  else {
    var currentTime = requestCurrentTime(),
      suspenseConfig = ReactCurrentBatchConfig.suspense;
    currentTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
    suspenseConfig = {
      expirationTime: currentTime,
      suspenseConfig: suspenseConfig,
      action: action,
      eagerReducer: null,
      eagerState: null,
      next: null
    };
    var last = queue.last;
    if (null === last) suspenseConfig.next = suspenseConfig;
    else {
      var first = last.next;
      null !== first && (suspenseConfig.next = first);
      last.next = suspenseConfig;
    }
    queue.last = suspenseConfig;
    if (
      0 === fiber.expirationTime &&
      (null === alternate || 0 === alternate.expirationTime) &&
      ((alternate = queue.lastRenderedReducer), null !== alternate)
    )
      try {
        var currentState = queue.lastRenderedState,
          eagerState = alternate(currentState, action);
        suspenseConfig.eagerReducer = alternate;
        suspenseConfig.eagerState = eagerState;
        if (is(eagerState, currentState)) return;
      } catch (error) {
      } finally {
      }
    scheduleUpdateOnFiber(fiber, currentTime);
  }
}
var ContextOnlyDispatcher = {
    readContext: readContext,
    useCallback: throwInvalidHookError,
    useContext: throwInvalidHookError,
    useEffect: throwInvalidHookError,
    useImperativeHandle: throwInvalidHookError,
    useLayoutEffect: throwInvalidHookError,
    useMemo: throwInvalidHookError,
    useReducer: throwInvalidHookError,
    useRef: throwInvalidHookError,
    useState: throwInvalidHookError,
    useDebugValue: throwInvalidHookError,
    useResponder: throwInvalidHookError
  },
  HooksDispatcherOnMount = {
    readContext: readContext,
    useCallback: function(callback, deps) {
      mountWorkInProgressHook().memoizedState = [
        callback,
        void 0 === deps ? null : deps
      ];
      return callback;
    },
    useContext: readContext,
    useEffect: function(create, deps) {
      return mountEffectImpl(516, 192, create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
      return mountEffectImpl(
        4,
        36,
        imperativeHandleEffect.bind(null, create, ref),
        deps
      );
    },
    useLayoutEffect: function(create, deps) {
      return mountEffectImpl(4, 36, create, deps);
    },
    useMemo: function(nextCreate, deps) {
      var hook = mountWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      nextCreate = nextCreate();
      hook.memoizedState = [nextCreate, deps];
      return nextCreate;
    },
    useReducer: function(reducer, initialArg, init) {
      var hook = mountWorkInProgressHook();
      initialArg = void 0 !== init ? init(initialArg) : initialArg;
      hook.memoizedState = hook.baseState = initialArg;
      reducer = hook.queue = {
        last: null,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialArg
      };
      reducer = reducer.dispatch = dispatchAction.bind(
        null,
        currentlyRenderingFiber$1,
        reducer
      );
      return [hook.memoizedState, reducer];
    },
    useRef: function(initialValue) {
      var hook = mountWorkInProgressHook();
      initialValue = { current: initialValue };
      return (hook.memoizedState = initialValue);
    },
    useState: function(initialState) {
      var hook = mountWorkInProgressHook();
      "function" === typeof initialState && (initialState = initialState());
      hook.memoizedState = hook.baseState = initialState;
      initialState = hook.queue = {
        last: null,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
      };
      initialState = initialState.dispatch = dispatchAction.bind(
        null,
        currentlyRenderingFiber$1,
        initialState
      );
      return [hook.memoizedState, initialState];
    },
    useDebugValue: mountDebugValue,
    useResponder: createResponderListener
  },
  HooksDispatcherOnUpdate = {
    readContext: readContext,
    useCallback: function(callback, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var prevState = hook.memoizedState;
      if (
        null !== prevState &&
        null !== deps &&
        areHookInputsEqual(deps, prevState[1])
      )
        return prevState[0];
      hook.memoizedState = [callback, deps];
      return callback;
    },
    useContext: readContext,
    useEffect: function(create, deps) {
      return updateEffectImpl(516, 192, create, deps);
    },
    useImperativeHandle: function(ref, create, deps) {
      deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
      return updateEffectImpl(
        4,
        36,
        imperativeHandleEffect.bind(null, create, ref),
        deps
      );
    },
    useLayoutEffect: function(create, deps) {
      return updateEffectImpl(4, 36, create, deps);
    },
    useMemo: function(nextCreate, deps) {
      var hook = updateWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var prevState = hook.memoizedState;
      if (
        null !== prevState &&
        null !== deps &&
        areHookInputsEqual(deps, prevState[1])
      )
        return prevState[0];
      nextCreate = nextCreate();
      hook.memoizedState = [nextCreate, deps];
      return nextCreate;
    },
    useReducer: updateReducer,
    useRef: function() {
      return updateWorkInProgressHook().memoizedState;
    },
    useState: function(initialState) {
      return updateReducer(basicStateReducer, initialState);
    },
    useDebugValue: mountDebugValue,
    useResponder: createResponderListener
  },
  hydrationParentFiber = null,
  nextHydratableInstance = null,
  isHydrating = !1;
function tryHydrate(fiber$jscomp$0, nextInstance) {
  switch (fiber$jscomp$0.tag) {
    case 5:
      return (
        (nextInstance = shim$1(
          nextInstance,
          fiber$jscomp$0.type,
          fiber$jscomp$0.pendingProps
        )),
        null !== nextInstance
          ? ((fiber$jscomp$0.stateNode = nextInstance), !0)
          : !1
      );
    case 6:
      return (
        (nextInstance = shim$1(nextInstance, fiber$jscomp$0.pendingProps)),
        null !== nextInstance
          ? ((fiber$jscomp$0.stateNode = nextInstance), !0)
          : !1
      );
    case 13:
      nextInstance = shim$1(nextInstance);
      if (null !== nextInstance) {
        fiber$jscomp$0.memoizedState = {
          dehydrated: nextInstance,
          retryTime: 1
        };
        var fiber = createFiber(18, null, null, 0);
        fiber.stateNode = nextInstance;
        fiber.return = fiber$jscomp$0;
        fiber$jscomp$0.child = fiber;
        return !0;
      }
      return !1;
    default:
      return !1;
  }
}
function tryToClaimNextHydratableInstance(fiber$jscomp$0) {
  if (isHydrating) {
    var nextInstance = nextHydratableInstance;
    if (nextInstance) {
      var firstAttemptedInstance = nextInstance;
      if (!tryHydrate(fiber$jscomp$0, nextInstance)) {
        nextInstance = shim$1(firstAttemptedInstance);
        if (!nextInstance || !tryHydrate(fiber$jscomp$0, nextInstance)) {
          fiber$jscomp$0.effectTag |= 2;
          isHydrating = !1;
          hydrationParentFiber = fiber$jscomp$0;
          return;
        }
        var returnFiber = hydrationParentFiber,
          fiber = createFiber(5, null, null, 0);
        fiber.elementType = "DELETED";
        fiber.type = "DELETED";
        fiber.stateNode = firstAttemptedInstance;
        fiber.return = returnFiber;
        fiber.effectTag = 8;
        null !== returnFiber.lastEffect
          ? ((returnFiber.lastEffect.nextEffect = fiber),
            (returnFiber.lastEffect = fiber))
          : (returnFiber.firstEffect = returnFiber.lastEffect = fiber);
      }
      hydrationParentFiber = fiber$jscomp$0;
      nextHydratableInstance = shim$1(nextInstance);
    } else
      (fiber$jscomp$0.effectTag |= 2),
        (isHydrating = !1),
        (hydrationParentFiber = fiber$jscomp$0);
  }
}
var ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner,
  didReceiveUpdate = !1;
function reconcileChildren(
  current$$1,
  workInProgress,
  nextChildren,
  renderExpirationTime
) {
  workInProgress.child =
    null === current$$1
      ? mountChildFibers(
          workInProgress,
          null,
          nextChildren,
          renderExpirationTime
        )
      : reconcileChildFibers(
          workInProgress,
          current$$1.child,
          nextChildren,
          renderExpirationTime
        );
}
function updateForwardRef(
  current$$1,
  workInProgress,
  Component,
  nextProps,
  renderExpirationTime
) {
  Component = Component.render;
  var ref = workInProgress.ref;
  prepareToReadContext(workInProgress, renderExpirationTime);
  nextProps = renderWithHooks(
    current$$1,
    workInProgress,
    Component,
    nextProps,
    ref,
    renderExpirationTime
  );
  if (null !== current$$1 && !didReceiveUpdate)
    return (
      (workInProgress.updateQueue = current$$1.updateQueue),
      (workInProgress.effectTag &= -517),
      current$$1.expirationTime <= renderExpirationTime &&
        (current$$1.expirationTime = 0),
      bailoutOnAlreadyFinishedWork(
        current$$1,
        workInProgress,
        renderExpirationTime
      )
    );
  workInProgress.effectTag |= 1;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextProps,
    renderExpirationTime
  );
  return workInProgress.child;
}
function updateMemoComponent(
  current$$1,
  workInProgress,
  Component,
  nextProps,
  updateExpirationTime,
  renderExpirationTime
) {
  if (null === current$$1) {
    var type = Component.type;
    if (
      "function" === typeof type &&
      !shouldConstruct(type) &&
      void 0 === type.defaultProps &&
      null === Component.compare &&
      void 0 === Component.defaultProps
    )
      return (
        (workInProgress.tag = 15),
        (workInProgress.type = type),
        updateSimpleMemoComponent(
          current$$1,
          workInProgress,
          type,
          nextProps,
          updateExpirationTime,
          renderExpirationTime
        )
      );
    current$$1 = createFiberFromTypeAndProps(
      Component.type,
      null,
      nextProps,
      null,
      workInProgress.mode,
      renderExpirationTime
    );
    current$$1.ref = workInProgress.ref;
    current$$1.return = workInProgress;
    return (workInProgress.child = current$$1);
  }
  type = current$$1.child;
  if (
    updateExpirationTime < renderExpirationTime &&
    ((updateExpirationTime = type.memoizedProps),
    (Component = Component.compare),
    (Component = null !== Component ? Component : shallowEqual),
    Component(updateExpirationTime, nextProps) &&
      current$$1.ref === workInProgress.ref)
  )
    return bailoutOnAlreadyFinishedWork(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  workInProgress.effectTag |= 1;
  current$$1 = createWorkInProgress(type, nextProps, renderExpirationTime);
  current$$1.ref = workInProgress.ref;
  current$$1.return = workInProgress;
  return (workInProgress.child = current$$1);
}
function updateSimpleMemoComponent(
  current$$1,
  workInProgress,
  Component,
  nextProps,
  updateExpirationTime,
  renderExpirationTime
) {
  return null !== current$$1 &&
    shallowEqual(current$$1.memoizedProps, nextProps) &&
    current$$1.ref === workInProgress.ref &&
    ((didReceiveUpdate = !1), updateExpirationTime < renderExpirationTime)
    ? bailoutOnAlreadyFinishedWork(
        current$$1,
        workInProgress,
        renderExpirationTime
      )
    : updateFunctionComponent(
        current$$1,
        workInProgress,
        Component,
        nextProps,
        renderExpirationTime
      );
}
function markRef(current$$1, workInProgress) {
  var ref = workInProgress.ref;
  if (
    (null === current$$1 && null !== ref) ||
    (null !== current$$1 && current$$1.ref !== ref)
  )
    workInProgress.effectTag |= 128;
}
function updateFunctionComponent(
  current$$1,
  workInProgress,
  Component,
  nextProps,
  renderExpirationTime
) {
  if (!disableLegacyContext) {
    var context = getUnmaskedContext(workInProgress, Component, !0);
    context = getMaskedContext(workInProgress, context);
  }
  prepareToReadContext(workInProgress, renderExpirationTime);
  Component = renderWithHooks(
    current$$1,
    workInProgress,
    Component,
    nextProps,
    context,
    renderExpirationTime
  );
  if (null !== current$$1 && !didReceiveUpdate)
    return (
      (workInProgress.updateQueue = current$$1.updateQueue),
      (workInProgress.effectTag &= -517),
      current$$1.expirationTime <= renderExpirationTime &&
        (current$$1.expirationTime = 0),
      bailoutOnAlreadyFinishedWork(
        current$$1,
        workInProgress,
        renderExpirationTime
      )
    );
  workInProgress.effectTag |= 1;
  reconcileChildren(
    current$$1,
    workInProgress,
    Component,
    renderExpirationTime
  );
  return workInProgress.child;
}
function updateClassComponent(
  current$$1,
  workInProgress,
  Component,
  nextProps,
  renderExpirationTime
) {
  if (isContextProvider(Component)) {
    var hasContext = !0;
    pushContextProvider(workInProgress);
  } else hasContext = !1;
  prepareToReadContext(workInProgress, renderExpirationTime);
  if (null === workInProgress.stateNode)
    null !== current$$1 &&
      ((current$$1.alternate = null),
      (workInProgress.alternate = null),
      (workInProgress.effectTag |= 2)),
      constructClassInstance(
        workInProgress,
        Component,
        nextProps,
        renderExpirationTime
      ),
      mountClassInstance(
        workInProgress,
        Component,
        nextProps,
        renderExpirationTime
      ),
      (nextProps = !0);
  else if (null === current$$1) {
    var instance = workInProgress.stateNode,
      oldProps = workInProgress.memoizedProps;
    instance.props = oldProps;
    var oldContext = instance.context,
      contextType = Component.contextType,
      nextContext = emptyContextObject;
    "object" === typeof contextType && null !== contextType
      ? (nextContext = readContext(contextType))
      : disableLegacyContext ||
        ((nextContext = getUnmaskedContext(workInProgress, Component, !0)),
        (nextContext = getMaskedContext(workInProgress, nextContext)));
    var getDerivedStateFromProps = Component.getDerivedStateFromProps;
    (contextType =
      "function" === typeof getDerivedStateFromProps ||
      "function" === typeof instance.getSnapshotBeforeUpdate) ||
      ("function" !== typeof instance.UNSAFE_componentWillReceiveProps &&
        "function" !== typeof instance.componentWillReceiveProps) ||
      ((oldProps !== nextProps || oldContext !== nextContext) &&
        callComponentWillReceiveProps(
          workInProgress,
          instance,
          nextProps,
          nextContext
        ));
    hasForceUpdate = !1;
    var oldState = workInProgress.memoizedState;
    oldContext = instance.state = oldState;
    var updateQueue = workInProgress.updateQueue;
    null !== updateQueue &&
      (processUpdateQueue(
        workInProgress,
        updateQueue,
        nextProps,
        instance,
        renderExpirationTime
      ),
      (oldContext = workInProgress.memoizedState));
    oldProps !== nextProps ||
    oldState !== oldContext ||
    (disableLegacyContext ? 0 : didPerformWorkStackCursor.current) ||
    hasForceUpdate
      ? ("function" === typeof getDerivedStateFromProps &&
          (applyDerivedStateFromProps(
            workInProgress,
            Component,
            getDerivedStateFromProps,
            nextProps
          ),
          (oldContext = workInProgress.memoizedState)),
        (oldProps =
          hasForceUpdate ||
          checkShouldComponentUpdate(
            workInProgress,
            Component,
            oldProps,
            nextProps,
            oldState,
            oldContext,
            nextContext
          ))
          ? (contextType ||
              ("function" !== typeof instance.UNSAFE_componentWillMount &&
                "function" !== typeof instance.componentWillMount) ||
              ("function" === typeof instance.componentWillMount &&
                instance.componentWillMount(),
              "function" === typeof instance.UNSAFE_componentWillMount &&
                instance.UNSAFE_componentWillMount()),
            "function" === typeof instance.componentDidMount &&
              (workInProgress.effectTag |= 4))
          : ("function" === typeof instance.componentDidMount &&
              (workInProgress.effectTag |= 4),
            (workInProgress.memoizedProps = nextProps),
            (workInProgress.memoizedState = oldContext)),
        (instance.props = nextProps),
        (instance.state = oldContext),
        (instance.context = nextContext),
        (nextProps = oldProps))
      : ("function" === typeof instance.componentDidMount &&
          (workInProgress.effectTag |= 4),
        (nextProps = !1));
  } else
    (instance = workInProgress.stateNode),
      (oldProps = workInProgress.memoizedProps),
      (instance.props =
        workInProgress.type === workInProgress.elementType
          ? oldProps
          : resolveDefaultProps(workInProgress.type, oldProps)),
      (oldContext = instance.context),
      (contextType = Component.contextType),
      (nextContext = emptyContextObject),
      "object" === typeof contextType && null !== contextType
        ? (nextContext = readContext(contextType))
        : disableLegacyContext ||
          ((nextContext = getUnmaskedContext(workInProgress, Component, !0)),
          (nextContext = getMaskedContext(workInProgress, nextContext))),
      (getDerivedStateFromProps = Component.getDerivedStateFromProps),
      (contextType =
        "function" === typeof getDerivedStateFromProps ||
        "function" === typeof instance.getSnapshotBeforeUpdate) ||
        ("function" !== typeof instance.UNSAFE_componentWillReceiveProps &&
          "function" !== typeof instance.componentWillReceiveProps) ||
        ((oldProps !== nextProps || oldContext !== nextContext) &&
          callComponentWillReceiveProps(
            workInProgress,
            instance,
            nextProps,
            nextContext
          )),
      (hasForceUpdate = !1),
      (oldContext = workInProgress.memoizedState),
      (oldState = instance.state = oldContext),
      (updateQueue = workInProgress.updateQueue),
      null !== updateQueue &&
        (processUpdateQueue(
          workInProgress,
          updateQueue,
          nextProps,
          instance,
          renderExpirationTime
        ),
        (oldState = workInProgress.memoizedState)),
      oldProps !== nextProps ||
      oldContext !== oldState ||
      (disableLegacyContext ? 0 : didPerformWorkStackCursor.current) ||
      hasForceUpdate
        ? ("function" === typeof getDerivedStateFromProps &&
            (applyDerivedStateFromProps(
              workInProgress,
              Component,
              getDerivedStateFromProps,
              nextProps
            ),
            (oldState = workInProgress.memoizedState)),
          (getDerivedStateFromProps =
            hasForceUpdate ||
            checkShouldComponentUpdate(
              workInProgress,
              Component,
              oldProps,
              nextProps,
              oldContext,
              oldState,
              nextContext
            ))
            ? (contextType ||
                ("function" !== typeof instance.UNSAFE_componentWillUpdate &&
                  "function" !== typeof instance.componentWillUpdate) ||
                ("function" === typeof instance.componentWillUpdate &&
                  instance.componentWillUpdate(
                    nextProps,
                    oldState,
                    nextContext
                  ),
                "function" === typeof instance.UNSAFE_componentWillUpdate &&
                  instance.UNSAFE_componentWillUpdate(
                    nextProps,
                    oldState,
                    nextContext
                  )),
              "function" === typeof instance.componentDidUpdate &&
                (workInProgress.effectTag |= 4),
              "function" === typeof instance.getSnapshotBeforeUpdate &&
                (workInProgress.effectTag |= 256))
            : ("function" !== typeof instance.componentDidUpdate ||
                (oldProps === current$$1.memoizedProps &&
                  oldContext === current$$1.memoizedState) ||
                (workInProgress.effectTag |= 4),
              "function" !== typeof instance.getSnapshotBeforeUpdate ||
                (oldProps === current$$1.memoizedProps &&
                  oldContext === current$$1.memoizedState) ||
                (workInProgress.effectTag |= 256),
              (workInProgress.memoizedProps = nextProps),
              (workInProgress.memoizedState = oldState)),
          (instance.props = nextProps),
          (instance.state = oldState),
          (instance.context = nextContext),
          (nextProps = getDerivedStateFromProps))
        : ("function" !== typeof instance.componentDidUpdate ||
            (oldProps === current$$1.memoizedProps &&
              oldContext === current$$1.memoizedState) ||
            (workInProgress.effectTag |= 4),
          "function" !== typeof instance.getSnapshotBeforeUpdate ||
            (oldProps === current$$1.memoizedProps &&
              oldContext === current$$1.memoizedState) ||
            (workInProgress.effectTag |= 256),
          (nextProps = !1));
  return finishClassComponent(
    current$$1,
    workInProgress,
    Component,
    nextProps,
    hasContext,
    renderExpirationTime
  );
}
function finishClassComponent(
  current$$1,
  workInProgress,
  Component,
  shouldUpdate,
  hasContext,
  renderExpirationTime
) {
  markRef(current$$1, workInProgress);
  var didCaptureError = 0 !== (workInProgress.effectTag & 64);
  if (!shouldUpdate && !didCaptureError)
    return (
      hasContext && invalidateContextProvider(workInProgress, Component, !1),
      bailoutOnAlreadyFinishedWork(
        current$$1,
        workInProgress,
        renderExpirationTime
      )
    );
  shouldUpdate = workInProgress.stateNode;
  ReactCurrentOwner$2.current = workInProgress;
  var nextChildren =
    didCaptureError && "function" !== typeof Component.getDerivedStateFromError
      ? null
      : shouldUpdate.render();
  workInProgress.effectTag |= 1;
  null !== current$$1 && didCaptureError
    ? ((workInProgress.child = reconcileChildFibers(
        workInProgress,
        current$$1.child,
        null,
        renderExpirationTime
      )),
      (workInProgress.child = reconcileChildFibers(
        workInProgress,
        null,
        nextChildren,
        renderExpirationTime
      )))
    : reconcileChildren(
        current$$1,
        workInProgress,
        nextChildren,
        renderExpirationTime
      );
  workInProgress.memoizedState = shouldUpdate.state;
  hasContext && invalidateContextProvider(workInProgress, Component, !0);
  return workInProgress.child;
}
function pushHostRootContext(workInProgress) {
  var root = workInProgress.stateNode;
  root.pendingContext
    ? pushTopLevelContextObject(
        workInProgress,
        root.pendingContext,
        root.pendingContext !== root.context
      )
    : root.context &&
      pushTopLevelContextObject(workInProgress, root.context, !1);
  pushHostContainer(workInProgress, root.containerInfo);
}
var SUSPENDED_MARKER = { dehydrated: null, retryTime: 1 };
function updateSuspenseComponent(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  var mode = workInProgress.mode,
    nextProps = workInProgress.pendingProps,
    suspenseContext = suspenseStackCursor.current,
    nextDidTimeout = !1,
    didSuspend = 0 !== (workInProgress.effectTag & 64),
    JSCompiler_temp;
  (JSCompiler_temp = didSuspend) ||
    (JSCompiler_temp =
      0 !== (suspenseContext & 2) &&
      (null === current$$1 || null !== current$$1.memoizedState));
  JSCompiler_temp
    ? ((nextDidTimeout = !0), (workInProgress.effectTag &= -65))
    : (null !== current$$1 && null === current$$1.memoizedState) ||
      void 0 === nextProps.fallback ||
      !0 === nextProps.unstable_avoidThisFallback ||
      (suspenseContext |= 1);
  push(suspenseStackCursor, suspenseContext & 1, workInProgress);
  if (null === current$$1) {
    if (
      void 0 !== nextProps.fallback &&
      (tryToClaimNextHydratableInstance(workInProgress),
      (current$$1 = workInProgress.memoizedState),
      null !== current$$1 &&
        ((current$$1 = current$$1.dehydrated), null !== current$$1))
    )
      return (
        0 === (workInProgress.mode & 2)
          ? (workInProgress.expirationTime = 1073741823)
          : shim$1(current$$1)
            ? ((renderExpirationTime = requestCurrentTime()),
              (workInProgress.expirationTime =
                1073741821 -
                25 *
                  ((((1073741821 - renderExpirationTime + 500) / 25) | 0) + 1)))
            : (workInProgress.expirationTime = 1),
        null
      );
    if (nextDidTimeout) {
      nextDidTimeout = nextProps.fallback;
      nextProps = createFiberFromFragment(null, mode, 0, null);
      nextProps.return = workInProgress;
      if (0 === (workInProgress.mode & 2))
        for (
          current$$1 =
            null !== workInProgress.memoizedState
              ? workInProgress.child.child
              : workInProgress.child,
            nextProps.child = current$$1;
          null !== current$$1;

        )
          (current$$1.return = nextProps), (current$$1 = current$$1.sibling);
      renderExpirationTime = createFiberFromFragment(
        nextDidTimeout,
        mode,
        renderExpirationTime,
        null
      );
      renderExpirationTime.return = workInProgress;
      nextProps.sibling = renderExpirationTime;
      workInProgress.memoizedState = SUSPENDED_MARKER;
      workInProgress.child = nextProps;
      return renderExpirationTime;
    }
    mode = nextProps.children;
    workInProgress.memoizedState = null;
    return (workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      mode,
      renderExpirationTime
    ));
  }
  suspenseContext = current$$1.memoizedState;
  if (null !== suspenseContext) {
    JSCompiler_temp = suspenseContext.dehydrated;
    if (null !== JSCompiler_temp) {
      if (didSuspend) {
        if (null !== workInProgress.memoizedState)
          return (
            (workInProgress.child = current$$1.child),
            (workInProgress.effectTag |= 64),
            null
          );
        nextDidTimeout = nextProps.fallback;
        nextProps = createFiberFromFragment(null, mode, 0, null);
        nextProps.return = workInProgress;
        nextProps.child = null;
        if (0 === (workInProgress.mode & 2))
          for (
            current$$1 = nextProps.child = workInProgress.child;
            null !== current$$1;

          )
            (current$$1.return = nextProps), (current$$1 = current$$1.sibling);
        else
          reconcileChildFibers(
            workInProgress,
            current$$1.child,
            null,
            renderExpirationTime
          );
        renderExpirationTime = createFiberFromFragment(
          nextDidTimeout,
          mode,
          renderExpirationTime,
          null
        );
        renderExpirationTime.return = workInProgress;
        nextProps.sibling = renderExpirationTime;
        renderExpirationTime.effectTag |= 2;
        nextProps.childExpirationTime = 0;
        workInProgress.memoizedState = SUSPENDED_MARKER;
        workInProgress.child = nextProps;
        return renderExpirationTime;
      }
      if (0 === (workInProgress.mode & 2))
        workInProgress = retrySuspenseComponentWithoutHydrating(
          current$$1,
          workInProgress,
          renderExpirationTime
        );
      else if (shim$1(JSCompiler_temp))
        workInProgress = retrySuspenseComponentWithoutHydrating(
          current$$1,
          workInProgress,
          renderExpirationTime
        );
      else if (
        ((mode = current$$1.childExpirationTime >= renderExpirationTime),
        didReceiveUpdate || mode)
      )
        1073741823 > renderExpirationTime &&
          suspenseContext.retryTime <= renderExpirationTime &&
          ((mode = renderExpirationTime + 1),
          (suspenseContext.retryTime = mode),
          scheduleUpdateOnFiber(current$$1, mode)),
          renderDidSuspendDelayIfPossible(),
          (workInProgress = retrySuspenseComponentWithoutHydrating(
            current$$1,
            workInProgress,
            renderExpirationTime
          ));
      else if (shim$1(JSCompiler_temp))
        (workInProgress.effectTag |= 64),
          (workInProgress.child = current$$1.child),
          shim$1(
            JSCompiler_temp,
            retryDehydratedSuspenseBoundary.bind(null, current$$1)
          ),
          (workInProgress = null);
      else {
        for (
          mode = renderExpirationTime = mountChildFibers(
            workInProgress,
            null,
            workInProgress.pendingProps.children,
            renderExpirationTime
          );
          mode;

        )
          (mode.effectTag |= 1024), (mode = mode.sibling);
        workInProgress.child = renderExpirationTime;
        workInProgress = workInProgress.child;
      }
      return workInProgress;
    }
    current$$1 = current$$1.child;
    mode = current$$1.sibling;
    if (nextDidTimeout) {
      nextProps = nextProps.fallback;
      renderExpirationTime = createWorkInProgress(
        current$$1,
        current$$1.pendingProps,
        0
      );
      renderExpirationTime.return = workInProgress;
      if (
        0 === (workInProgress.mode & 2) &&
        ((nextDidTimeout =
          null !== workInProgress.memoizedState
            ? workInProgress.child.child
            : workInProgress.child),
        nextDidTimeout !== current$$1.child)
      )
        for (
          renderExpirationTime.child = nextDidTimeout;
          null !== nextDidTimeout;

        )
          (nextDidTimeout.return = renderExpirationTime),
            (nextDidTimeout = nextDidTimeout.sibling);
      mode = createWorkInProgress(mode, nextProps, mode.expirationTime);
      mode.return = workInProgress;
      renderExpirationTime.sibling = mode;
      renderExpirationTime.childExpirationTime = 0;
      workInProgress.memoizedState = SUSPENDED_MARKER;
      workInProgress.child = renderExpirationTime;
      return mode;
    }
    renderExpirationTime = reconcileChildFibers(
      workInProgress,
      current$$1.child,
      nextProps.children,
      renderExpirationTime
    );
    workInProgress.memoizedState = null;
    return (workInProgress.child = renderExpirationTime);
  }
  current$$1 = current$$1.child;
  if (nextDidTimeout) {
    nextDidTimeout = nextProps.fallback;
    nextProps = createFiberFromFragment(null, mode, 0, null);
    nextProps.return = workInProgress;
    nextProps.child = current$$1;
    null !== current$$1 && (current$$1.return = nextProps);
    if (0 === (workInProgress.mode & 2))
      for (
        current$$1 =
          null !== workInProgress.memoizedState
            ? workInProgress.child.child
            : workInProgress.child,
          nextProps.child = current$$1;
        null !== current$$1;

      )
        (current$$1.return = nextProps), (current$$1 = current$$1.sibling);
    renderExpirationTime = createFiberFromFragment(
      nextDidTimeout,
      mode,
      renderExpirationTime,
      null
    );
    renderExpirationTime.return = workInProgress;
    nextProps.sibling = renderExpirationTime;
    renderExpirationTime.effectTag |= 2;
    nextProps.childExpirationTime = 0;
    workInProgress.memoizedState = SUSPENDED_MARKER;
    workInProgress.child = nextProps;
    return renderExpirationTime;
  }
  workInProgress.memoizedState = null;
  return (workInProgress.child = reconcileChildFibers(
    workInProgress,
    current$$1,
    nextProps.children,
    renderExpirationTime
  ));
}
function retrySuspenseComponentWithoutHydrating(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  workInProgress.memoizedState = null;
  reconcileChildren(
    current$$1,
    workInProgress,
    workInProgress.pendingProps.children,
    renderExpirationTime
  );
  return workInProgress.child;
}
function initSuspenseListRenderState(
  workInProgress,
  isBackwards,
  tail,
  lastContentRow,
  tailMode
) {
  var renderState = workInProgress.memoizedState;
  null === renderState
    ? (workInProgress.memoizedState = {
        isBackwards: isBackwards,
        rendering: null,
        last: lastContentRow,
        tail: tail,
        tailExpiration: 0,
        tailMode: tailMode
      })
    : ((renderState.isBackwards = isBackwards),
      (renderState.rendering = null),
      (renderState.last = lastContentRow),
      (renderState.tail = tail),
      (renderState.tailExpiration = 0),
      (renderState.tailMode = tailMode));
}
function updateSuspenseListComponent(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  var nextProps = workInProgress.pendingProps,
    revealOrder = nextProps.revealOrder,
    tailMode = nextProps.tail;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextProps.children,
    renderExpirationTime
  );
  nextProps = suspenseStackCursor.current;
  if (0 !== (nextProps & 2))
    (nextProps = (nextProps & 1) | 2), (workInProgress.effectTag |= 64);
  else {
    if (null !== current$$1 && 0 !== (current$$1.effectTag & 64))
      a: for (current$$1 = workInProgress.child; null !== current$$1; ) {
        if (13 === current$$1.tag) {
          if (null !== current$$1.memoizedState) {
            current$$1.expirationTime < renderExpirationTime &&
              (current$$1.expirationTime = renderExpirationTime);
            var alternate = current$$1.alternate;
            null !== alternate &&
              alternate.expirationTime < renderExpirationTime &&
              (alternate.expirationTime = renderExpirationTime);
            scheduleWorkOnParentPath(current$$1.return, renderExpirationTime);
          }
        } else if (null !== current$$1.child) {
          current$$1.child.return = current$$1;
          current$$1 = current$$1.child;
          continue;
        }
        if (current$$1 === workInProgress) break a;
        for (; null === current$$1.sibling; ) {
          if (
            null === current$$1.return ||
            current$$1.return === workInProgress
          )
            break a;
          current$$1 = current$$1.return;
        }
        current$$1.sibling.return = current$$1.return;
        current$$1 = current$$1.sibling;
      }
    nextProps &= 1;
  }
  push(suspenseStackCursor, nextProps, workInProgress);
  if (0 === (workInProgress.mode & 2)) workInProgress.memoizedState = null;
  else
    switch (revealOrder) {
      case "forwards":
        renderExpirationTime = workInProgress.child;
        for (revealOrder = null; null !== renderExpirationTime; )
          (nextProps = renderExpirationTime.alternate),
            null !== nextProps &&
              null === findFirstSuspended(nextProps) &&
              (revealOrder = renderExpirationTime),
            (renderExpirationTime = renderExpirationTime.sibling);
        renderExpirationTime = revealOrder;
        null === renderExpirationTime
          ? ((revealOrder = workInProgress.child),
            (workInProgress.child = null))
          : ((revealOrder = renderExpirationTime.sibling),
            (renderExpirationTime.sibling = null));
        initSuspenseListRenderState(
          workInProgress,
          !1,
          revealOrder,
          renderExpirationTime,
          tailMode
        );
        break;
      case "backwards":
        renderExpirationTime = null;
        revealOrder = workInProgress.child;
        for (workInProgress.child = null; null !== revealOrder; ) {
          nextProps = revealOrder.alternate;
          if (null !== nextProps && null === findFirstSuspended(nextProps)) {
            workInProgress.child = revealOrder;
            break;
          }
          nextProps = revealOrder.sibling;
          revealOrder.sibling = renderExpirationTime;
          renderExpirationTime = revealOrder;
          revealOrder = nextProps;
        }
        initSuspenseListRenderState(
          workInProgress,
          !0,
          renderExpirationTime,
          null,
          tailMode
        );
        break;
      case "together":
        initSuspenseListRenderState(workInProgress, !1, null, null, void 0);
        break;
      default:
        workInProgress.memoizedState = null;
    }
  return workInProgress.child;
}
function bailoutOnAlreadyFinishedWork(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  null !== current$$1 &&
    (workInProgress.dependencies = current$$1.dependencies);
  if (workInProgress.childExpirationTime < renderExpirationTime) return null;
  if (null !== current$$1 && workInProgress.child !== current$$1.child)
    throw ReactErrorProd(Error(153));
  if (null !== workInProgress.child) {
    current$$1 = workInProgress.child;
    renderExpirationTime = createWorkInProgress(
      current$$1,
      current$$1.pendingProps,
      current$$1.expirationTime
    );
    workInProgress.child = renderExpirationTime;
    for (
      renderExpirationTime.return = workInProgress;
      null !== current$$1.sibling;

    )
      (current$$1 = current$$1.sibling),
        (renderExpirationTime = renderExpirationTime.sibling = createWorkInProgress(
          current$$1,
          current$$1.pendingProps,
          current$$1.expirationTime
        )),
        (renderExpirationTime.return = workInProgress);
    renderExpirationTime.sibling = null;
  }
  return workInProgress.child;
}
var appendAllChildren,
  updateHostContainer,
  updateHostComponent$1,
  updateHostText$1;
appendAllChildren = function(parent, workInProgress) {
  for (var node = workInProgress.child; null !== node; ) {
    if (5 === node.tag || 6 === node.tag) {
      var parentInstance = parent,
        child = node.stateNode;
      if ("string" === typeof child) throw ReactErrorProd(Error(216));
      child.inject(parentInstance);
    } else if (4 !== node.tag && null !== node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === workInProgress) break;
    for (; null === node.sibling; ) {
      if (null === node.return || node.return === workInProgress) return;
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
};
updateHostContainer = function() {};
updateHostComponent$1 = function(current, workInProgress, type, newProps) {
  current.memoizedProps !== newProps &&
    (requiredContext(contextStackCursor$1.current),
    (workInProgress.updateQueue = UPDATE_SIGNAL)) &&
    (workInProgress.effectTag |= 4);
};
updateHostText$1 = function(current, workInProgress, oldText, newText) {
  oldText !== newText && (workInProgress.effectTag |= 4);
};
function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
  switch (renderState.tailMode) {
    case "hidden":
      hasRenderedATailFallback = renderState.tail;
      for (var lastTailNode = null; null !== hasRenderedATailFallback; )
        null !== hasRenderedATailFallback.alternate &&
          (lastTailNode = hasRenderedATailFallback),
          (hasRenderedATailFallback = hasRenderedATailFallback.sibling);
      null === lastTailNode
        ? (renderState.tail = null)
        : (lastTailNode.sibling = null);
      break;
    case "collapsed":
      lastTailNode = renderState.tail;
      for (var _lastTailNode = null; null !== lastTailNode; )
        null !== lastTailNode.alternate && (_lastTailNode = lastTailNode),
          (lastTailNode = lastTailNode.sibling);
      null === _lastTailNode
        ? hasRenderedATailFallback || null === renderState.tail
          ? (renderState.tail = null)
          : (renderState.tail.sibling = null)
        : (_lastTailNode.sibling = null);
  }
}
function unwindWork(workInProgress) {
  switch (workInProgress.tag) {
    case 1:
      isContextProvider(workInProgress.type) && popContext(workInProgress);
      var effectTag = workInProgress.effectTag;
      return effectTag & 4096
        ? ((workInProgress.effectTag = (effectTag & -4097) | 64),
          workInProgress)
        : null;
    case 3:
      popHostContainer(workInProgress);
      popTopLevelContextObject(workInProgress);
      effectTag = workInProgress.effectTag;
      if (0 !== (effectTag & 64)) throw ReactErrorProd(Error(285));
      workInProgress.effectTag = (effectTag & -4097) | 64;
      return workInProgress;
    case 5:
      return popHostContext(workInProgress), null;
    case 13:
      pop(suspenseStackCursor, workInProgress);
      effectTag = workInProgress.memoizedState;
      if (
        null !== effectTag &&
        null !== effectTag.dehydrated &&
        null === workInProgress.alternate
      )
        throw ReactErrorProd(Error(340));
      effectTag = workInProgress.effectTag;
      return effectTag & 4096
        ? ((workInProgress.effectTag = (effectTag & -4097) | 64),
          workInProgress)
        : null;
    case 19:
      return pop(suspenseStackCursor, workInProgress), null;
    case 4:
      return popHostContainer(workInProgress), null;
    case 10:
      return popProvider(workInProgress), null;
    default:
      return null;
  }
}
function createCapturedValue(value, source) {
  return {
    value: value,
    source: source,
    stack: getStackByFiberInDevAndProd(source)
  };
}
if ("function" !== typeof require("ReactFbErrorUtils").invokeGuardedCallback)
  throw ReactErrorProd(Error(255));
var ReactFiberErrorDialogWWW = require("ReactFiberErrorDialog");
if ("function" !== typeof ReactFiberErrorDialogWWW.showErrorDialog)
  throw ReactErrorProd(Error(320));
function logCapturedError(capturedError) {
  !1 !== ReactFiberErrorDialogWWW.showErrorDialog(capturedError) &&
    console.error(capturedError.error);
}
var PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set;
function logError(boundary, errorInfo) {
  var source = errorInfo.source,
    stack = errorInfo.stack;
  null === stack &&
    null !== source &&
    (stack = getStackByFiberInDevAndProd(source));
  errorInfo = {
    componentName: null !== source ? getComponentName(source.type) : null,
    componentStack: null !== stack ? stack : "",
    error: errorInfo.value,
    errorBoundary: null,
    errorBoundaryName: null,
    errorBoundaryFound: !1,
    willRetry: !1
  };
  null !== boundary &&
    1 === boundary.tag &&
    ((errorInfo.errorBoundary = boundary.stateNode),
    (errorInfo.errorBoundaryName = getComponentName(boundary.type)),
    (errorInfo.errorBoundaryFound = !0),
    (errorInfo.willRetry = !0));
  try {
    logCapturedError(errorInfo);
  } catch (e) {
    setTimeout(function() {
      throw e;
    });
  }
}
function safelyCallComponentWillUnmount(current$$1, instance) {
  try {
    (instance.props = current$$1.memoizedProps),
      (instance.state = current$$1.memoizedState),
      instance.componentWillUnmount();
  } catch (unmountError) {
    captureCommitPhaseError(current$$1, unmountError);
  }
}
function safelyDetachRef(current$$1) {
  var ref = current$$1.ref;
  if (null !== ref)
    if ("function" === typeof ref)
      try {
        ref(null);
      } catch (refError) {
        captureCommitPhaseError(current$$1, refError);
      }
    else ref.current = null;
}
function commitHookEffectList(unmountTag, mountTag, finishedWork) {
  finishedWork = finishedWork.updateQueue;
  finishedWork = null !== finishedWork ? finishedWork.lastEffect : null;
  if (null !== finishedWork) {
    var effect = (finishedWork = finishedWork.next);
    do {
      if (0 !== (effect.tag & unmountTag)) {
        var destroy = effect.destroy;
        effect.destroy = void 0;
        void 0 !== destroy && destroy();
      }
      0 !== (effect.tag & mountTag) &&
        ((destroy = effect.create), (effect.destroy = destroy()));
      effect = effect.next;
    } while (effect !== finishedWork);
  }
}
function commitUnmount(finishedRoot, current$$1$jscomp$0, renderPriorityLevel) {
  "function" === typeof onCommitFiberUnmount &&
    onCommitFiberUnmount(current$$1$jscomp$0);
  switch (current$$1$jscomp$0.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      finishedRoot = current$$1$jscomp$0.updateQueue;
      if (
        null !== finishedRoot &&
        ((finishedRoot = finishedRoot.lastEffect), null !== finishedRoot)
      ) {
        var firstEffect = finishedRoot.next;
        runWithPriority(
          97 < renderPriorityLevel ? 97 : renderPriorityLevel,
          function() {
            var effect = firstEffect;
            do {
              var destroy = effect.destroy;
              if (void 0 !== destroy) {
                var current$$1 = current$$1$jscomp$0;
                try {
                  destroy();
                } catch (error) {
                  captureCommitPhaseError(current$$1, error);
                }
              }
              effect = effect.next;
            } while (effect !== firstEffect);
          }
        );
      }
      break;
    case 1:
      safelyDetachRef(current$$1$jscomp$0);
      renderPriorityLevel = current$$1$jscomp$0.stateNode;
      "function" === typeof renderPriorityLevel.componentWillUnmount &&
        safelyCallComponentWillUnmount(
          current$$1$jscomp$0,
          renderPriorityLevel
        );
      break;
    case 5:
      renderPriorityLevel = current$$1$jscomp$0.dependencies;
      if (
        null !== renderPriorityLevel &&
        ((finishedRoot = renderPriorityLevel.responders), null !== finishedRoot)
      ) {
        finishedRoot = Array.from(finishedRoot.values());
        for (var i = 0, length = finishedRoot.length; i < length; i++)
          unmountResponderInstance(finishedRoot[i]);
        renderPriorityLevel.responders = null;
      }
      safelyDetachRef(current$$1$jscomp$0);
      break;
    case 4:
      unmountHostComponents(
        finishedRoot,
        current$$1$jscomp$0,
        renderPriorityLevel
      );
      break;
    case 18:
      (renderPriorityLevel = finishedRoot.hydrationCallbacks),
        null !== renderPriorityLevel &&
          (renderPriorityLevel = renderPriorityLevel.onDeleted) &&
          renderPriorityLevel(current$$1$jscomp$0.stateNode);
  }
}
function isHostParent(fiber) {
  return 5 === fiber.tag || 3 === fiber.tag || 4 === fiber.tag;
}
function commitPlacement(finishedWork) {
  a: {
    for (var parent = finishedWork.return; null !== parent; ) {
      if (isHostParent(parent)) {
        var parentFiber = parent;
        break a;
      }
      parent = parent.return;
    }
    throw ReactErrorProd(Error(160));
  }
  parent = parentFiber.stateNode;
  switch (parentFiber.tag) {
    case 5:
      var isContainer = !1;
      break;
    case 3:
      parent = parent.containerInfo;
      isContainer = !0;
      break;
    case 4:
      parent = parent.containerInfo;
      isContainer = !0;
      break;
    default:
      throw ReactErrorProd(Error(161));
  }
  parentFiber.effectTag & 16 && (parentFiber.effectTag &= -17);
  a: b: for (parentFiber = finishedWork; ; ) {
    for (; null === parentFiber.sibling; ) {
      if (null === parentFiber.return || isHostParent(parentFiber.return)) {
        parentFiber = null;
        break a;
      }
      parentFiber = parentFiber.return;
    }
    parentFiber.sibling.return = parentFiber.return;
    for (
      parentFiber = parentFiber.sibling;
      5 !== parentFiber.tag && 6 !== parentFiber.tag && 18 !== parentFiber.tag;

    ) {
      if (parentFiber.effectTag & 2) continue b;
      if (null === parentFiber.child || 4 === parentFiber.tag) continue b;
      else
        (parentFiber.child.return = parentFiber),
          (parentFiber = parentFiber.child);
    }
    if (!(parentFiber.effectTag & 2)) {
      parentFiber = parentFiber.stateNode;
      break a;
    }
  }
  for (var node = finishedWork; ; ) {
    var isHost = 5 === node.tag || 6 === node.tag;
    if (isHost)
      if (
        ((isHost = isHost ? node.stateNode : node.stateNode.instance),
        parentFiber)
      )
        if (isContainer) {
          var beforeChild = parentFiber;
          if (isHost === beforeChild) throw ReactErrorProd(Error(218));
          isHost.injectBefore(beforeChild);
        } else {
          beforeChild = parentFiber;
          if (isHost === beforeChild) throw ReactErrorProd(Error(218));
          isHost.injectBefore(beforeChild);
        }
      else
        (beforeChild = parent),
          isHost.parentNode === beforeChild && isHost.eject(),
          isHost.inject(beforeChild);
    else if (4 !== node.tag && null !== node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === finishedWork) break;
    for (; null === node.sibling; ) {
      if (null === node.return || node.return === finishedWork) return;
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
function unmountHostComponents(
  finishedRoot$jscomp$0,
  current$$1,
  renderPriorityLevel$jscomp$0
) {
  for (
    var node = current$$1,
      currentParentIsValid = !1,
      currentParent,
      currentParentIsContainer;
    ;

  ) {
    if (!currentParentIsValid) {
      currentParentIsValid = node.return;
      a: for (;;) {
        if (null === currentParentIsValid) throw ReactErrorProd(Error(160));
        currentParent = currentParentIsValid.stateNode;
        switch (currentParentIsValid.tag) {
          case 5:
            currentParentIsContainer = !1;
            break a;
          case 3:
            currentParent = currentParent.containerInfo;
            currentParentIsContainer = !0;
            break a;
          case 4:
            currentParent = currentParent.containerInfo;
            currentParentIsContainer = !0;
            break a;
        }
        currentParentIsValid = currentParentIsValid.return;
      }
      currentParentIsValid = !0;
    }
    if (5 === node.tag || 6 === node.tag) {
      a: for (
        var finishedRoot = finishedRoot$jscomp$0,
          root = node,
          renderPriorityLevel = renderPriorityLevel$jscomp$0,
          node$jscomp$0 = root;
        ;

      )
        if (
          (commitUnmount(finishedRoot, node$jscomp$0, renderPriorityLevel),
          null !== node$jscomp$0.child && 4 !== node$jscomp$0.tag)
        )
          (node$jscomp$0.child.return = node$jscomp$0),
            (node$jscomp$0 = node$jscomp$0.child);
        else {
          if (node$jscomp$0 === root) break;
          for (; null === node$jscomp$0.sibling; ) {
            if (null === node$jscomp$0.return || node$jscomp$0.return === root)
              break a;
            node$jscomp$0 = node$jscomp$0.return;
          }
          node$jscomp$0.sibling.return = node$jscomp$0.return;
          node$jscomp$0 = node$jscomp$0.sibling;
        }
      (finishedRoot = node.stateNode),
        destroyEventListeners(finishedRoot),
        finishedRoot.eject();
    } else if (18 === node.tag)
      (finishedRoot = finishedRoot$jscomp$0.hydrationCallbacks),
        null !== finishedRoot &&
          (finishedRoot = finishedRoot.onDeleted) &&
          finishedRoot(node.stateNode),
        shim$1(currentParent, node.stateNode);
    else if (4 === node.tag) {
      if (null !== node.child) {
        currentParent = node.stateNode.containerInfo;
        currentParentIsContainer = !0;
        node.child.return = node;
        node = node.child;
        continue;
      }
    } else if (
      (commitUnmount(finishedRoot$jscomp$0, node, renderPriorityLevel$jscomp$0),
      null !== node.child)
    ) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === current$$1) break;
    for (; null === node.sibling; ) {
      if (null === node.return || node.return === current$$1) return;
      node = node.return;
      4 === node.tag && (currentParentIsValid = !1);
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
function commitWork(current$$1, finishedWork) {
  switch (finishedWork.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      commitHookEffectList(4, 8, finishedWork);
      break;
    case 1:
      break;
    case 5:
      var instance = finishedWork.stateNode;
      if (null != instance) {
        var newProps = finishedWork.memoizedProps;
        current$$1 = null !== current$$1 ? current$$1.memoizedProps : newProps;
        var updatePayload = finishedWork.updateQueue;
        finishedWork.updateQueue = null;
        null !== updatePayload &&
          instance._applyProps(instance, newProps, current$$1);
        newProps = newProps.listeners;
        current$$1.listeners !== newProps &&
          updateEventListeners(newProps, instance, finishedWork);
      }
      break;
    case 6:
      if (null === finishedWork.stateNode) throw ReactErrorProd(Error(162));
      break;
    case 3:
      break;
    case 12:
      break;
    case 13:
      instance = finishedWork.memoizedState;
      newProps = finishedWork;
      null === instance
        ? (current$$1 = !1)
        : ((current$$1 = !0),
          (newProps = finishedWork.child),
          (globalMostRecentFallbackTime = now()));
      if (null !== newProps)
        a: for (updatePayload = newProps; ; ) {
          if (5 === updatePayload.tag) {
            var instance$jscomp$0 = updatePayload.stateNode;
            current$$1
              ? instance$jscomp$0.hide()
              : ((instance$jscomp$0 = updatePayload.memoizedProps),
                (null == instance$jscomp$0.visible ||
                  instance$jscomp$0.visible) &&
                  updatePayload.stateNode.show());
          } else if (6 !== updatePayload.tag)
            if (
              13 === updatePayload.tag &&
              null !== updatePayload.memoizedState &&
              null === updatePayload.memoizedState.dehydrated
            ) {
              instance$jscomp$0 = updatePayload.child.sibling;
              instance$jscomp$0.return = updatePayload;
              updatePayload = instance$jscomp$0;
              continue;
            } else if (null !== updatePayload.child) {
              updatePayload.child.return = updatePayload;
              updatePayload = updatePayload.child;
              continue;
            }
          if (updatePayload === newProps) break a;
          for (; null === updatePayload.sibling; ) {
            if (
              null === updatePayload.return ||
              updatePayload.return === newProps
            )
              break a;
            updatePayload = updatePayload.return;
          }
          updatePayload.sibling.return = updatePayload.return;
          updatePayload = updatePayload.sibling;
        }
      null !== instance &&
        ((instance = finishedWork.memoizedProps.suspenseCallback),
        "function" === typeof instance &&
          ((newProps = finishedWork.updateQueue),
          null !== newProps && instance(new Set(newProps))));
      attachSuspenseRetryListeners(finishedWork);
      break;
    case 19:
      attachSuspenseRetryListeners(finishedWork);
      break;
    case 17:
      break;
    case 20:
      break;
    default:
      throw ReactErrorProd(Error(163));
  }
}
function attachSuspenseRetryListeners(finishedWork) {
  var thenables = finishedWork.updateQueue;
  if (null !== thenables) {
    finishedWork.updateQueue = null;
    var retryCache = finishedWork.stateNode;
    null === retryCache &&
      (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
    thenables.forEach(function(thenable) {
      var retry = resolveRetryThenable.bind(null, finishedWork, thenable);
      retryCache.has(thenable) ||
        (retryCache.add(thenable), thenable.then(retry, retry));
    });
  }
}
var PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map;
function createRootErrorUpdate(fiber, errorInfo, expirationTime) {
  expirationTime = createUpdate(expirationTime, null);
  expirationTime.tag = 3;
  expirationTime.payload = { element: null };
  var error = errorInfo.value;
  expirationTime.callback = function() {
    hasUncaughtError || ((hasUncaughtError = !0), (firstUncaughtError = error));
    logError(fiber, errorInfo);
  };
  return expirationTime;
}
function createClassErrorUpdate(fiber, errorInfo, expirationTime) {
  expirationTime = createUpdate(expirationTime, null);
  expirationTime.tag = 3;
  var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
  if ("function" === typeof getDerivedStateFromError) {
    var error = errorInfo.value;
    expirationTime.payload = function() {
      logError(fiber, errorInfo);
      return getDerivedStateFromError(error);
    };
  }
  var inst = fiber.stateNode;
  null !== inst &&
    "function" === typeof inst.componentDidCatch &&
    (expirationTime.callback = function() {
      "function" !== typeof getDerivedStateFromError &&
        (null === legacyErrorBoundariesThatAlreadyFailed
          ? (legacyErrorBoundariesThatAlreadyFailed = new Set([this]))
          : legacyErrorBoundariesThatAlreadyFailed.add(this),
        logError(fiber, errorInfo));
      var stack = errorInfo.stack;
      this.componentDidCatch(errorInfo.value, {
        componentStack: null !== stack ? stack : ""
      });
    });
  return expirationTime;
}
var ceil = Math.ceil,
  ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher,
  ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner,
  NoContext = 0,
  LegacyUnbatchedContext = 8,
  RenderContext = 16,
  CommitContext = 32,
  RootIncomplete = 0,
  RootErrored = 1,
  RootSuspended = 2,
  RootSuspendedWithDelay = 3,
  RootCompleted = 4,
  executionContext = NoContext,
  workInProgressRoot = null,
  workInProgress = null,
  renderExpirationTime = 0,
  workInProgressRootExitStatus = RootIncomplete,
  workInProgressRootLatestProcessedExpirationTime = 1073741823,
  workInProgressRootLatestSuspenseTimeout = 1073741823,
  workInProgressRootCanSuspendUsingConfig = null,
  workInProgressRootHasPendingPing = !1,
  globalMostRecentFallbackTime = 0,
  FALLBACK_THROTTLE_MS = 500,
  nextEffect = null,
  hasUncaughtError = !1,
  firstUncaughtError = null,
  legacyErrorBoundariesThatAlreadyFailed = null,
  rootDoesHavePassiveEffects = !1,
  rootWithPendingPassiveEffects = null,
  pendingPassiveEffectsRenderPriority = 90,
  pendingPassiveEffectsExpirationTime = 0,
  rootsWithPendingDiscreteUpdates = null,
  nestedUpdateCount = 0,
  rootWithNestedUpdates = null,
  currentEventTime = 0;
function requestCurrentTime() {
  return (executionContext & (RenderContext | CommitContext)) !== NoContext
    ? 1073741821 - ((now() / 10) | 0)
    : 0 !== currentEventTime
      ? currentEventTime
      : (currentEventTime = 1073741821 - ((now() / 10) | 0));
}
function computeExpirationForFiber(currentTime, fiber, suspenseConfig) {
  fiber = fiber.mode;
  if (0 === (fiber & 2)) return 1073741823;
  var priorityLevel = getCurrentPriorityLevel();
  if (0 === (fiber & 4)) return 99 === priorityLevel ? 1073741823 : 1073741822;
  if ((executionContext & RenderContext) !== NoContext)
    return renderExpirationTime;
  if (null !== suspenseConfig)
    currentTime =
      1073741821 -
      25 *
        ((((1073741821 -
          currentTime +
          (suspenseConfig.timeoutMs | 0 || 5e3) / 10) /
          25) |
          0) +
          1);
  else
    switch (priorityLevel) {
      case 99:
        currentTime = 1073741823;
        break;
      case 98:
        currentTime =
          1073741821 - 10 * ((((1073741821 - currentTime + 15) / 10) | 0) + 1);
        break;
      case 97:
      case 96:
        currentTime =
          1073741821 - 25 * ((((1073741821 - currentTime + 500) / 25) | 0) + 1);
        break;
      case 95:
        currentTime = 1;
        break;
      default:
        throw ReactErrorProd(Error(326));
    }
  null !== workInProgressRoot &&
    currentTime === renderExpirationTime &&
    --currentTime;
  return currentTime;
}
function scheduleUpdateOnFiber(fiber, expirationTime) {
  if (50 < nestedUpdateCount)
    throw ((nestedUpdateCount = 0),
    (rootWithNestedUpdates = null),
    ReactErrorProd(Error(185)));
  fiber = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (null !== fiber) {
    fiber.pingTime = 0;
    var priorityLevel = getCurrentPriorityLevel();
    if (1073741823 === expirationTime)
      if (
        (executionContext & LegacyUnbatchedContext) !== NoContext &&
        (executionContext & (RenderContext | CommitContext)) === NoContext
      )
        for (
          var callback = renderRoot(fiber, 1073741823, !0);
          null !== callback;

        )
          callback = callback(!0);
      else
        scheduleCallbackForRoot(fiber, 99, 1073741823),
          executionContext === NoContext && flushSyncCallbackQueue();
    else scheduleCallbackForRoot(fiber, priorityLevel, expirationTime);
    (executionContext & 4) === NoContext ||
      (98 !== priorityLevel && 99 !== priorityLevel) ||
      (null === rootsWithPendingDiscreteUpdates
        ? (rootsWithPendingDiscreteUpdates = new Map([[fiber, expirationTime]]))
        : ((priorityLevel = rootsWithPendingDiscreteUpdates.get(fiber)),
          (void 0 === priorityLevel || priorityLevel > expirationTime) &&
            rootsWithPendingDiscreteUpdates.set(fiber, expirationTime)));
  }
}
function markUpdateTimeFromFiberToRoot(fiber, expirationTime) {
  fiber.expirationTime < expirationTime &&
    (fiber.expirationTime = expirationTime);
  var alternate = fiber.alternate;
  null !== alternate &&
    alternate.expirationTime < expirationTime &&
    (alternate.expirationTime = expirationTime);
  var node = fiber.return,
    root = null;
  if (null === node && 3 === fiber.tag) root = fiber.stateNode;
  else
    for (; null !== node; ) {
      alternate = node.alternate;
      node.childExpirationTime < expirationTime &&
        (node.childExpirationTime = expirationTime);
      null !== alternate &&
        alternate.childExpirationTime < expirationTime &&
        (alternate.childExpirationTime = expirationTime);
      if (null === node.return && 3 === node.tag) {
        root = node.stateNode;
        break;
      }
      node = node.return;
    }
  null !== root &&
    (expirationTime > root.firstPendingTime &&
      (root.firstPendingTime = expirationTime),
    (fiber = root.lastPendingTime),
    0 === fiber || expirationTime < fiber) &&
    (root.lastPendingTime = expirationTime);
  return root;
}
function scheduleCallbackForRoot(root, priorityLevel, expirationTime) {
  if (root.callbackExpirationTime < expirationTime) {
    var existingCallbackNode = root.callbackNode;
    null !== existingCallbackNode &&
      existingCallbackNode !== fakeCallbackNode &&
      Scheduler_cancelCallback(existingCallbackNode);
    root.callbackExpirationTime = expirationTime;
    1073741823 === expirationTime
      ? (root.callbackNode = scheduleSyncCallback(
          runRootCallback.bind(
            null,
            root,
            renderRoot.bind(null, root, expirationTime)
          )
        ))
      : ((existingCallbackNode = null),
        disableSchedulerTimeoutBasedOnReactExpirationTime ||
          1 === expirationTime ||
          (existingCallbackNode = {
            timeout: 10 * (1073741821 - expirationTime) - now()
          }),
        (root.callbackNode = scheduleCallback(
          priorityLevel,
          runRootCallback.bind(
            null,
            root,
            renderRoot.bind(null, root, expirationTime)
          ),
          existingCallbackNode
        )));
  }
}
function runRootCallback(root, callback, isSync) {
  var prevCallbackNode = root.callbackNode,
    continuation = null;
  try {
    return (
      (continuation = callback(isSync)),
      null !== continuation
        ? runRootCallback.bind(null, root, continuation)
        : null
    );
  } finally {
    null === continuation &&
      prevCallbackNode === root.callbackNode &&
      ((root.callbackNode = null), (root.callbackExpirationTime = 0));
  }
}
function resolveLocksOnRoot(root, expirationTime) {
  var firstBatch = root.firstBatch;
  return null !== firstBatch &&
    firstBatch._defer &&
    firstBatch._expirationTime >= expirationTime
    ? (scheduleCallback(97, function() {
        firstBatch._onComplete();
        return null;
      }),
      !0)
    : !1;
}
function prepareFreshStack(root, expirationTime) {
  root.finishedWork = null;
  root.finishedExpirationTime = 0;
  var timeoutHandle = root.timeoutHandle;
  -1 !== timeoutHandle &&
    ((root.timeoutHandle = -1), cancelTimeout(timeoutHandle));
  if (null !== workInProgress)
    for (timeoutHandle = workInProgress.return; null !== timeoutHandle; ) {
      var interruptedWork = timeoutHandle;
      switch (interruptedWork.tag) {
        case 1:
          var childContextTypes = interruptedWork.type.childContextTypes;
          null !== childContextTypes &&
            void 0 !== childContextTypes &&
            popContext(interruptedWork);
          break;
        case 3:
          popHostContainer(interruptedWork);
          popTopLevelContextObject(interruptedWork);
          break;
        case 5:
          popHostContext(interruptedWork);
          break;
        case 4:
          popHostContainer(interruptedWork);
          break;
        case 13:
          pop(suspenseStackCursor, interruptedWork);
          break;
        case 19:
          pop(suspenseStackCursor, interruptedWork);
          break;
        case 10:
          popProvider(interruptedWork);
      }
      timeoutHandle = timeoutHandle.return;
    }
  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null, expirationTime);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootLatestSuspenseTimeout = workInProgressRootLatestProcessedExpirationTime = 1073741823;
  workInProgressRootCanSuspendUsingConfig = null;
  workInProgressRootHasPendingPing = !1;
}
function renderRoot(root$jscomp$0, expirationTime, isSync) {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext)
    throw ReactErrorProd(Error(327));
  if (root$jscomp$0.firstPendingTime < expirationTime) return null;
  if (isSync && root$jscomp$0.finishedExpirationTime === expirationTime)
    return commitRoot.bind(null, root$jscomp$0);
  flushPassiveEffects();
  if (
    root$jscomp$0 !== workInProgressRoot ||
    expirationTime !== renderExpirationTime
  )
    prepareFreshStack(root$jscomp$0, expirationTime);
  else if (workInProgressRootExitStatus === RootSuspendedWithDelay)
    if (workInProgressRootHasPendingPing)
      prepareFreshStack(root$jscomp$0, expirationTime);
    else {
      var lastPendingTime = root$jscomp$0.lastPendingTime;
      if (lastPendingTime < expirationTime)
        return renderRoot.bind(null, root$jscomp$0, lastPendingTime);
    }
  if (null !== workInProgress) {
    lastPendingTime = executionContext;
    executionContext |= RenderContext;
    var prevDispatcher = ReactCurrentDispatcher.current;
    null === prevDispatcher && (prevDispatcher = ContextOnlyDispatcher);
    ReactCurrentDispatcher.current = ContextOnlyDispatcher;
    if (isSync) {
      if (1073741823 !== expirationTime) {
        var currentTime = requestCurrentTime();
        if (currentTime < expirationTime)
          return (
            (executionContext = lastPendingTime),
            resetContextDependencies(),
            (ReactCurrentDispatcher.current = prevDispatcher),
            renderRoot.bind(null, root$jscomp$0, currentTime)
          );
      }
    } else currentEventTime = 0;
    do
      try {
        if (isSync)
          for (; null !== workInProgress; )
            workInProgress = performUnitOfWork(workInProgress);
        else
          for (; null !== workInProgress && !Scheduler_shouldYield(); )
            workInProgress = performUnitOfWork(workInProgress);
        break;
      } catch (thrownValue) {
        resetContextDependencies();
        resetHooks();
        currentTime = workInProgress;
        if (null === currentTime || null === currentTime.return)
          throw (prepareFreshStack(root$jscomp$0, expirationTime),
          (executionContext = lastPendingTime),
          thrownValue);
        a: {
          var root = root$jscomp$0,
            returnFiber = currentTime.return,
            sourceFiber = currentTime,
            value = thrownValue,
            renderExpirationTime$jscomp$0 = renderExpirationTime;
          sourceFiber.effectTag |= 2048;
          sourceFiber.firstEffect = sourceFiber.lastEffect = null;
          if (
            null !== value &&
            "object" === typeof value &&
            "function" === typeof value.then
          ) {
            var thenable = value,
              hasInvisibleParentBoundary =
                0 !== (suspenseStackCursor.current & 1);
            value = returnFiber;
            do {
              var JSCompiler_temp;
              if ((JSCompiler_temp = 13 === value.tag))
                (JSCompiler_temp = value.memoizedState),
                  null !== JSCompiler_temp
                    ? (JSCompiler_temp =
                        null !== JSCompiler_temp.dehydrated ? !0 : !1)
                    : ((JSCompiler_temp = value.memoizedProps),
                      (JSCompiler_temp =
                        void 0 === JSCompiler_temp.fallback
                          ? !1
                          : !0 !== JSCompiler_temp.unstable_avoidThisFallback
                            ? !0
                            : hasInvisibleParentBoundary
                              ? !1
                              : !0));
              if (JSCompiler_temp) {
                returnFiber = value.updateQueue;
                null === returnFiber
                  ? ((returnFiber = new Set()),
                    returnFiber.add(thenable),
                    (value.updateQueue = returnFiber))
                  : returnFiber.add(thenable);
                if (0 === (value.mode & 2)) {
                  value.effectTag |= 64;
                  sourceFiber.effectTag &= -2981;
                  1 === sourceFiber.tag &&
                    (null === sourceFiber.alternate
                      ? (sourceFiber.tag = 17)
                      : ((renderExpirationTime$jscomp$0 = createUpdate(
                          1073741823,
                          null
                        )),
                        (renderExpirationTime$jscomp$0.tag = 2),
                        enqueueUpdate(
                          sourceFiber,
                          renderExpirationTime$jscomp$0
                        )));
                  sourceFiber.expirationTime = 1073741823;
                  break a;
                }
                sourceFiber = root;
                root = renderExpirationTime$jscomp$0;
                hasInvisibleParentBoundary = sourceFiber.pingCache;
                null === hasInvisibleParentBoundary
                  ? ((hasInvisibleParentBoundary = sourceFiber.pingCache = new PossiblyWeakMap()),
                    (returnFiber = new Set()),
                    hasInvisibleParentBoundary.set(thenable, returnFiber))
                  : ((returnFiber = hasInvisibleParentBoundary.get(thenable)),
                    void 0 === returnFiber &&
                      ((returnFiber = new Set()),
                      hasInvisibleParentBoundary.set(thenable, returnFiber)));
                returnFiber.has(root) ||
                  (returnFiber.add(root),
                  (sourceFiber = pingSuspendedRoot.bind(
                    null,
                    sourceFiber,
                    thenable,
                    root
                  )),
                  thenable.then(sourceFiber, sourceFiber));
                value.effectTag |= 4096;
                value.expirationTime = renderExpirationTime$jscomp$0;
                break a;
              }
              value = value.return;
            } while (null !== value);
            value = Error(
              (getComponentName(sourceFiber.type) || "A React component") +
                " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display." +
                getStackByFiberInDevAndProd(sourceFiber)
            );
          }
          workInProgressRootExitStatus !== RootCompleted &&
            (workInProgressRootExitStatus = RootErrored);
          value = createCapturedValue(value, sourceFiber);
          sourceFiber = returnFiber;
          do {
            switch (sourceFiber.tag) {
              case 3:
                sourceFiber.effectTag |= 4096;
                sourceFiber.expirationTime = renderExpirationTime$jscomp$0;
                renderExpirationTime$jscomp$0 = createRootErrorUpdate(
                  sourceFiber,
                  value,
                  renderExpirationTime$jscomp$0
                );
                enqueueCapturedUpdate(
                  sourceFiber,
                  renderExpirationTime$jscomp$0
                );
                break a;
              case 1:
                if (
                  ((thenable = value),
                  (root = sourceFiber.type),
                  (returnFiber = sourceFiber.stateNode),
                  0 === (sourceFiber.effectTag & 64) &&
                    ("function" === typeof root.getDerivedStateFromError ||
                      (null !== returnFiber &&
                        "function" === typeof returnFiber.componentDidCatch &&
                        (null === legacyErrorBoundariesThatAlreadyFailed ||
                          !legacyErrorBoundariesThatAlreadyFailed.has(
                            returnFiber
                          )))))
                ) {
                  sourceFiber.effectTag |= 4096;
                  sourceFiber.expirationTime = renderExpirationTime$jscomp$0;
                  renderExpirationTime$jscomp$0 = createClassErrorUpdate(
                    sourceFiber,
                    thenable,
                    renderExpirationTime$jscomp$0
                  );
                  enqueueCapturedUpdate(
                    sourceFiber,
                    renderExpirationTime$jscomp$0
                  );
                  break a;
                }
            }
            sourceFiber = sourceFiber.return;
          } while (null !== sourceFiber);
        }
        workInProgress = completeUnitOfWork(currentTime);
      }
    while (1);
    executionContext = lastPendingTime;
    resetContextDependencies();
    ReactCurrentDispatcher.current = prevDispatcher;
    if (null !== workInProgress)
      return renderRoot.bind(null, root$jscomp$0, expirationTime);
  }
  root$jscomp$0.finishedWork = root$jscomp$0.current.alternate;
  root$jscomp$0.finishedExpirationTime = expirationTime;
  if (resolveLocksOnRoot(root$jscomp$0, expirationTime)) return null;
  workInProgressRoot = null;
  switch (workInProgressRootExitStatus) {
    case RootIncomplete:
      throw ReactErrorProd(Error(328));
    case RootErrored:
      return (
        (lastPendingTime = root$jscomp$0.lastPendingTime),
        lastPendingTime < expirationTime
          ? renderRoot.bind(null, root$jscomp$0, lastPendingTime)
          : isSync
            ? commitRoot.bind(null, root$jscomp$0)
            : (prepareFreshStack(root$jscomp$0, expirationTime),
              scheduleSyncCallback(
                renderRoot.bind(null, root$jscomp$0, expirationTime)
              ),
              null)
      );
    case RootSuspended:
      if (
        1073741823 === workInProgressRootLatestProcessedExpirationTime &&
        !isSync &&
        ((isSync = globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now()),
        10 < isSync)
      ) {
        if (workInProgressRootHasPendingPing)
          return (
            prepareFreshStack(root$jscomp$0, expirationTime),
            renderRoot.bind(null, root$jscomp$0, expirationTime)
          );
        lastPendingTime = root$jscomp$0.lastPendingTime;
        if (lastPendingTime < expirationTime)
          return renderRoot.bind(null, root$jscomp$0, lastPendingTime);
        root$jscomp$0.timeoutHandle = scheduleTimeout(
          commitRoot.bind(null, root$jscomp$0),
          isSync
        );
        return null;
      }
      return commitRoot.bind(null, root$jscomp$0);
    case RootSuspendedWithDelay:
      if (!isSync) {
        if (workInProgressRootHasPendingPing)
          return (
            prepareFreshStack(root$jscomp$0, expirationTime),
            renderRoot.bind(null, root$jscomp$0, expirationTime)
          );
        isSync = root$jscomp$0.lastPendingTime;
        if (isSync < expirationTime)
          return renderRoot.bind(null, root$jscomp$0, isSync);
        1073741823 !== workInProgressRootLatestSuspenseTimeout
          ? (isSync =
              10 * (1073741821 - workInProgressRootLatestSuspenseTimeout) -
              now())
          : 1073741823 === workInProgressRootLatestProcessedExpirationTime
            ? (isSync = 0)
            : ((isSync =
                10 *
                  (1073741821 -
                    workInProgressRootLatestProcessedExpirationTime) -
                5e3),
              (lastPendingTime = now()),
              (expirationTime =
                10 * (1073741821 - expirationTime) - lastPendingTime),
              (isSync = lastPendingTime - isSync),
              0 > isSync && (isSync = 0),
              (isSync =
                (120 > isSync
                  ? 120
                  : 480 > isSync
                    ? 480
                    : 1080 > isSync
                      ? 1080
                      : 1920 > isSync
                        ? 1920
                        : 3e3 > isSync
                          ? 3e3
                          : 4320 > isSync
                            ? 4320
                            : 1960 * ceil(isSync / 1960)) - isSync),
              expirationTime < isSync && (isSync = expirationTime));
        if (10 < isSync)
          return (
            (root$jscomp$0.timeoutHandle = scheduleTimeout(
              commitRoot.bind(null, root$jscomp$0),
              isSync
            )),
            null
          );
      }
      return commitRoot.bind(null, root$jscomp$0);
    case RootCompleted:
      return !isSync &&
        1073741823 !== workInProgressRootLatestProcessedExpirationTime &&
        null !== workInProgressRootCanSuspendUsingConfig &&
        ((lastPendingTime = workInProgressRootLatestProcessedExpirationTime),
        (prevDispatcher = workInProgressRootCanSuspendUsingConfig),
        (expirationTime = prevDispatcher.busyMinDurationMs | 0),
        0 >= expirationTime
          ? (expirationTime = 0)
          : ((isSync = prevDispatcher.busyDelayMs | 0),
            (lastPendingTime =
              now() -
              (10 * (1073741821 - lastPendingTime) -
                (prevDispatcher.timeoutMs | 0 || 5e3))),
            (expirationTime =
              lastPendingTime <= isSync
                ? 0
                : isSync + expirationTime - lastPendingTime)),
        10 < expirationTime)
        ? ((root$jscomp$0.timeoutHandle = scheduleTimeout(
            commitRoot.bind(null, root$jscomp$0),
            expirationTime
          )),
          null)
        : commitRoot.bind(null, root$jscomp$0);
    default:
      throw ReactErrorProd(Error(329));
  }
}
function markRenderEventTimeAndConfig(expirationTime, suspenseConfig) {
  expirationTime < workInProgressRootLatestProcessedExpirationTime &&
    1 < expirationTime &&
    (workInProgressRootLatestProcessedExpirationTime = expirationTime);
  null !== suspenseConfig &&
    expirationTime < workInProgressRootLatestSuspenseTimeout &&
    1 < expirationTime &&
    ((workInProgressRootLatestSuspenseTimeout = expirationTime),
    (workInProgressRootCanSuspendUsingConfig = suspenseConfig));
}
function renderDidSuspendDelayIfPossible() {
  if (
    workInProgressRootExitStatus === RootIncomplete ||
    workInProgressRootExitStatus === RootSuspended
  )
    workInProgressRootExitStatus = RootSuspendedWithDelay;
}
function performUnitOfWork(unitOfWork) {
  var next = beginWork$$1(
    unitOfWork.alternate,
    unitOfWork,
    renderExpirationTime
  );
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  null === next && (next = completeUnitOfWork(unitOfWork));
  ReactCurrentOwner$1.current = null;
  return next;
}
function completeUnitOfWork(unitOfWork) {
  workInProgress = unitOfWork;
  do {
    var current$$1 = workInProgress.alternate;
    unitOfWork = workInProgress.return;
    if (0 === (workInProgress.effectTag & 2048)) {
      a: {
        var current = current$$1;
        current$$1 = workInProgress;
        var renderExpirationTime$jscomp$0 = renderExpirationTime,
          newProps = current$$1.pendingProps;
        switch (current$$1.tag) {
          case 2:
            break;
          case 16:
            break;
          case 15:
          case 0:
            break;
          case 1:
            isContextProvider(current$$1.type) && popContext(current$$1);
            break;
          case 3:
            popHostContainer(current$$1);
            popTopLevelContextObject(current$$1);
            current = current$$1.stateNode;
            current.pendingContext &&
              ((current.context = current.pendingContext),
              (current.pendingContext = null));
            updateHostContainer(current$$1);
            break;
          case 5:
            popHostContext(current$$1);
            var rootContainerInstance = requiredContext(
              rootInstanceStackCursor.current
            );
            renderExpirationTime$jscomp$0 = current$$1.type;
            if (null !== current && null != current$$1.stateNode)
              updateHostComponent$1(
                current,
                current$$1,
                renderExpirationTime$jscomp$0,
                newProps,
                rootContainerInstance
              ),
                current.memoizedProps.listeners !== newProps.listeners &&
                  (current$$1.effectTag |= 4),
                current.ref !== current$$1.ref && (current$$1.effectTag |= 128);
            else if (newProps) {
              requiredContext(contextStackCursor$1.current);
              current = void 0;
              rootContainerInstance = newProps;
              switch (renderExpirationTime$jscomp$0) {
                case TYPES.CLIPPING_RECTANGLE:
                  current = Mode.ClippingRectangle();
                  current._applyProps = applyClippingRectangleProps;
                  break;
                case TYPES.GROUP:
                  current = Mode.Group();
                  current._applyProps = applyGroupProps;
                  break;
                case TYPES.SHAPE:
                  current = Mode.Shape();
                  current._applyProps = applyShapeProps;
                  break;
                case TYPES.TEXT:
                  (current = Mode.Text(
                    rootContainerInstance.children,
                    rootContainerInstance.font,
                    rootContainerInstance.alignment,
                    rootContainerInstance.path
                  )),
                    (current._applyProps = applyTextProps);
              }
              if (!current)
                throw ReactErrorProd(Error(217), renderExpirationTime$jscomp$0);
              current._applyProps(current, rootContainerInstance);
              appendAllChildren(current, current$$1, !1, !1);
              renderExpirationTime$jscomp$0 = newProps.listeners;
              null != renderExpirationTime$jscomp$0 &&
                updateEventListeners(
                  renderExpirationTime$jscomp$0,
                  current,
                  current$$1
                );
              current$$1.stateNode = current;
              null !== current$$1.ref && (current$$1.effectTag |= 128);
            } else if (null === current$$1.stateNode)
              throw ReactErrorProd(Error(166));
            break;
          case 6:
            if (current && null != current$$1.stateNode)
              updateHostText$1(
                current,
                current$$1,
                current.memoizedProps,
                newProps
              );
            else {
              if ("string" !== typeof newProps && null === current$$1.stateNode)
                throw ReactErrorProd(Error(166));
              requiredContext(rootInstanceStackCursor.current);
              requiredContext(contextStackCursor$1.current);
              current$$1.stateNode = newProps;
            }
            break;
          case 11:
            break;
          case 13:
            pop(suspenseStackCursor, current$$1);
            newProps = current$$1.memoizedState;
            if (null !== newProps && null !== newProps.dehydrated) {
              if (null === current) throw ReactErrorProd(Error(318));
              0 === (current$$1.effectTag & 64) &&
                (current$$1.memoizedState = null);
              current$$1.effectTag |= 4;
              break;
            }
            if (0 !== (current$$1.effectTag & 64)) {
              current$$1.expirationTime = renderExpirationTime$jscomp$0;
              break a;
            }
            renderExpirationTime$jscomp$0 = null !== newProps;
            newProps = !1;
            if (
              null !== current &&
              ((rootContainerInstance = current.memoizedState),
              (newProps = null !== rootContainerInstance),
              !renderExpirationTime$jscomp$0 &&
                null !== rootContainerInstance &&
                ((rootContainerInstance = current.child.sibling),
                null !== rootContainerInstance))
            ) {
              var first = current$$1.firstEffect;
              null !== first
                ? ((current$$1.firstEffect = rootContainerInstance),
                  (rootContainerInstance.nextEffect = first))
                : ((current$$1.firstEffect = current$$1.lastEffect = rootContainerInstance),
                  (rootContainerInstance.nextEffect = null));
              rootContainerInstance.effectTag = 8;
            }
            renderExpirationTime$jscomp$0 &&
              !newProps &&
              0 !== (current$$1.mode & 2) &&
              ((null === current &&
                !0 !== current$$1.memoizedProps.unstable_avoidThisFallback) ||
              0 !== (suspenseStackCursor.current & 1)
                ? workInProgressRootExitStatus === RootIncomplete &&
                  (workInProgressRootExitStatus = RootSuspended)
                : renderDidSuspendDelayIfPossible());
            if (renderExpirationTime$jscomp$0 || newProps)
              current$$1.effectTag |= 4;
            null !== current$$1.updateQueue &&
              null != current$$1.memoizedProps.suspenseCallback &&
              (current$$1.effectTag |= 4);
            break;
          case 7:
            break;
          case 8:
            break;
          case 12:
            break;
          case 4:
            popHostContainer(current$$1);
            updateHostContainer(current$$1);
            break;
          case 10:
            popProvider(current$$1);
            break;
          case 9:
            break;
          case 14:
            break;
          case 17:
            isContextProvider(current$$1.type) && popContext(current$$1);
            break;
          case 19:
            pop(suspenseStackCursor, current$$1);
            newProps = current$$1.memoizedState;
            if (null === newProps) break;
            rootContainerInstance = 0 !== (current$$1.effectTag & 64);
            first = newProps.rendering;
            if (null === first)
              if (rootContainerInstance) cutOffTailIfNeeded(newProps, !1);
              else {
                if (
                  workInProgressRootExitStatus !== RootIncomplete ||
                  (null !== current && 0 !== (current.effectTag & 64))
                )
                  for (current = current$$1.child; null !== current; ) {
                    first = findFirstSuspended(current);
                    if (null !== first) {
                      current$$1.effectTag |= 64;
                      cutOffTailIfNeeded(newProps, !1);
                      current = first.updateQueue;
                      null !== current &&
                        ((current$$1.updateQueue = current),
                        (current$$1.effectTag |= 4));
                      current$$1.firstEffect = current$$1.lastEffect = null;
                      current = renderExpirationTime$jscomp$0;
                      for (
                        renderExpirationTime$jscomp$0 = current$$1.child;
                        null !== renderExpirationTime$jscomp$0;

                      )
                        (newProps = renderExpirationTime$jscomp$0),
                          (rootContainerInstance = current),
                          (newProps.effectTag &= 2),
                          (newProps.nextEffect = null),
                          (newProps.firstEffect = null),
                          (newProps.lastEffect = null),
                          (first = newProps.alternate),
                          null === first
                            ? ((newProps.childExpirationTime = 0),
                              (newProps.expirationTime = rootContainerInstance),
                              (newProps.child = null),
                              (newProps.memoizedProps = null),
                              (newProps.memoizedState = null),
                              (newProps.updateQueue = null),
                              (newProps.dependencies = null))
                            : ((newProps.childExpirationTime =
                                first.childExpirationTime),
                              (newProps.expirationTime = first.expirationTime),
                              (newProps.child = first.child),
                              (newProps.memoizedProps = first.memoizedProps),
                              (newProps.memoizedState = first.memoizedState),
                              (newProps.updateQueue = first.updateQueue),
                              (rootContainerInstance = first.dependencies),
                              (newProps.dependencies =
                                null === rootContainerInstance
                                  ? null
                                  : {
                                      expirationTime:
                                        rootContainerInstance.expirationTime,
                                      firstContext:
                                        rootContainerInstance.firstContext,
                                      responders:
                                        rootContainerInstance.responders
                                    })),
                          (renderExpirationTime$jscomp$0 =
                            renderExpirationTime$jscomp$0.sibling);
                      push(
                        suspenseStackCursor,
                        (suspenseStackCursor.current & 1) | 2,
                        current$$1
                      );
                      current$$1 = current$$1.child;
                      break a;
                    }
                    current = current.sibling;
                  }
              }
            else {
              if (!rootContainerInstance)
                if (((current = findFirstSuspended(first)), null !== current)) {
                  if (
                    ((current$$1.effectTag |= 64),
                    (rootContainerInstance = !0),
                    cutOffTailIfNeeded(newProps, !0),
                    null === newProps.tail && "hidden" === newProps.tailMode)
                  ) {
                    current = current.updateQueue;
                    null !== current &&
                      ((current$$1.updateQueue = current),
                      (current$$1.effectTag |= 4));
                    current$$1 = current$$1.lastEffect = newProps.lastEffect;
                    null !== current$$1 && (current$$1.nextEffect = null);
                    break;
                  }
                } else
                  now() > newProps.tailExpiration &&
                    1 < renderExpirationTime$jscomp$0 &&
                    ((current$$1.effectTag |= 64),
                    (rootContainerInstance = !0),
                    cutOffTailIfNeeded(newProps, !1),
                    (current$$1.expirationTime = current$$1.childExpirationTime =
                      renderExpirationTime$jscomp$0 - 1));
              newProps.isBackwards
                ? ((first.sibling = current$$1.child),
                  (current$$1.child = first))
                : ((current = newProps.last),
                  null !== current
                    ? (current.sibling = first)
                    : (current$$1.child = first),
                  (newProps.last = first));
            }
            if (null !== newProps.tail) {
              0 === newProps.tailExpiration &&
                (newProps.tailExpiration = now() + 500);
              current = newProps.tail;
              newProps.rendering = current;
              newProps.tail = current.sibling;
              newProps.lastEffect = current$$1.lastEffect;
              current.sibling = null;
              renderExpirationTime$jscomp$0 = suspenseStackCursor.current;
              renderExpirationTime$jscomp$0 = rootContainerInstance
                ? (renderExpirationTime$jscomp$0 & 1) | 2
                : renderExpirationTime$jscomp$0 & 1;
              push(
                suspenseStackCursor,
                renderExpirationTime$jscomp$0,
                current$$1
              );
              current$$1 = current;
              break a;
            }
            break;
          case 20:
            break;
          default:
            throw ReactErrorProd(Error(156));
        }
        current$$1 = null;
      }
      current = workInProgress;
      if (1 === renderExpirationTime || 1 !== current.childExpirationTime) {
        renderExpirationTime$jscomp$0 = 0;
        for (newProps = current.child; null !== newProps; )
          (rootContainerInstance = newProps.expirationTime),
            (first = newProps.childExpirationTime),
            rootContainerInstance > renderExpirationTime$jscomp$0 &&
              (renderExpirationTime$jscomp$0 = rootContainerInstance),
            first > renderExpirationTime$jscomp$0 &&
              (renderExpirationTime$jscomp$0 = first),
            (newProps = newProps.sibling);
        current.childExpirationTime = renderExpirationTime$jscomp$0;
      }
      if (null !== current$$1) return current$$1;
      null !== unitOfWork &&
        0 === (unitOfWork.effectTag & 2048) &&
        (null === unitOfWork.firstEffect &&
          (unitOfWork.firstEffect = workInProgress.firstEffect),
        null !== workInProgress.lastEffect &&
          (null !== unitOfWork.lastEffect &&
            (unitOfWork.lastEffect.nextEffect = workInProgress.firstEffect),
          (unitOfWork.lastEffect = workInProgress.lastEffect)),
        1 < workInProgress.effectTag &&
          (null !== unitOfWork.lastEffect
            ? (unitOfWork.lastEffect.nextEffect = workInProgress)
            : (unitOfWork.firstEffect = workInProgress),
          (unitOfWork.lastEffect = workInProgress)));
    } else {
      current$$1 = unwindWork(workInProgress, renderExpirationTime);
      if (null !== current$$1)
        return (current$$1.effectTag &= 2047), current$$1;
      null !== unitOfWork &&
        ((unitOfWork.firstEffect = unitOfWork.lastEffect = null),
        (unitOfWork.effectTag |= 2048));
    }
    current$$1 = workInProgress.sibling;
    if (null !== current$$1) return current$$1;
    workInProgress = unitOfWork;
  } while (null !== workInProgress);
  workInProgressRootExitStatus === RootIncomplete &&
    (workInProgressRootExitStatus = RootCompleted);
  return null;
}
function commitRoot(root) {
  var renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(99, commitRootImpl.bind(null, root, renderPriorityLevel));
  null !== rootWithPendingPassiveEffects &&
    scheduleCallback(97, function() {
      flushPassiveEffects();
      return null;
    });
  return null;
}
function commitRootImpl(root, renderPriorityLevel) {
  flushPassiveEffects();
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext)
    throw ReactErrorProd(Error(327));
  var finishedWork = root.finishedWork,
    expirationTime = root.finishedExpirationTime;
  if (null === finishedWork) return null;
  root.finishedWork = null;
  root.finishedExpirationTime = 0;
  if (finishedWork === root.current) throw ReactErrorProd(Error(177));
  root.callbackNode = null;
  root.callbackExpirationTime = 0;
  var updateExpirationTimeBeforeCommit = finishedWork.expirationTime,
    childExpirationTimeBeforeCommit = finishedWork.childExpirationTime;
  updateExpirationTimeBeforeCommit =
    childExpirationTimeBeforeCommit > updateExpirationTimeBeforeCommit
      ? childExpirationTimeBeforeCommit
      : updateExpirationTimeBeforeCommit;
  root.firstPendingTime = updateExpirationTimeBeforeCommit;
  updateExpirationTimeBeforeCommit < root.lastPendingTime &&
    (root.lastPendingTime = updateExpirationTimeBeforeCommit);
  root === workInProgressRoot &&
    ((workInProgress = workInProgressRoot = null), (renderExpirationTime = 0));
  1 < finishedWork.effectTag
    ? null !== finishedWork.lastEffect
      ? ((finishedWork.lastEffect.nextEffect = finishedWork),
        (updateExpirationTimeBeforeCommit = finishedWork.firstEffect))
      : (updateExpirationTimeBeforeCommit = finishedWork)
    : (updateExpirationTimeBeforeCommit = finishedWork.firstEffect);
  if (null !== updateExpirationTimeBeforeCommit) {
    childExpirationTimeBeforeCommit = executionContext;
    executionContext |= CommitContext;
    ReactCurrentOwner$1.current = null;
    nextEffect = updateExpirationTimeBeforeCommit;
    do
      try {
        for (; null !== nextEffect; ) {
          if (0 !== (nextEffect.effectTag & 256)) {
            var current$$1 = nextEffect.alternate,
              finishedWork$jscomp$0 = nextEffect;
            switch (finishedWork$jscomp$0.tag) {
              case 0:
              case 11:
              case 15:
                commitHookEffectList(2, 0, finishedWork$jscomp$0);
                break;
              case 1:
                if (
                  finishedWork$jscomp$0.effectTag & 256 &&
                  null !== current$$1
                ) {
                  var prevProps = current$$1.memoizedProps,
                    prevState = current$$1.memoizedState,
                    instance = finishedWork$jscomp$0.stateNode,
                    snapshot = instance.getSnapshotBeforeUpdate(
                      finishedWork$jscomp$0.elementType ===
                      finishedWork$jscomp$0.type
                        ? prevProps
                        : resolveDefaultProps(
                            finishedWork$jscomp$0.type,
                            prevProps
                          ),
                      prevState
                    );
                  instance.__reactInternalSnapshotBeforeUpdate = snapshot;
                }
                break;
              case 3:
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw ReactErrorProd(Error(163));
            }
          }
          nextEffect = nextEffect.nextEffect;
        }
      } catch (error) {
        if (null === nextEffect) throw ReactErrorProd(Error(330));
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    while (null !== nextEffect);
    nextEffect = updateExpirationTimeBeforeCommit;
    do
      try {
        for (
          current$$1 = root, prevProps = renderPriorityLevel;
          null !== nextEffect;

        ) {
          var effectTag = nextEffect.effectTag;
          if (effectTag & 128) {
            var current$$1$jscomp$0 = nextEffect.alternate;
            if (null !== current$$1$jscomp$0) {
              var currentRef = current$$1$jscomp$0.ref;
              null !== currentRef &&
                ("function" === typeof currentRef
                  ? currentRef(null)
                  : (currentRef.current = null));
            }
          }
          switch (effectTag & 1038) {
            case 2:
              commitPlacement(nextEffect);
              nextEffect.effectTag &= -3;
              break;
            case 6:
              commitPlacement(nextEffect);
              nextEffect.effectTag &= -3;
              commitWork(nextEffect.alternate, nextEffect);
              break;
            case 1024:
              nextEffect.effectTag &= -1025;
              break;
            case 1028:
              nextEffect.effectTag &= -1025;
              commitWork(nextEffect.alternate, nextEffect);
              break;
            case 4:
              commitWork(nextEffect.alternate, nextEffect);
              break;
            case 8:
              prevState = nextEffect;
              unmountHostComponents(current$$1, prevState, prevProps);
              prevState.return = null;
              prevState.child = null;
              prevState.memoizedState = null;
              prevState.updateQueue = null;
              prevState.dependencies = null;
              var alternate = prevState.alternate;
              null !== alternate &&
                ((alternate.return = null),
                (alternate.child = null),
                (alternate.memoizedState = null),
                (alternate.updateQueue = null),
                (alternate.dependencies = null));
          }
          nextEffect = nextEffect.nextEffect;
        }
      } catch (error) {
        if (null === nextEffect) throw ReactErrorProd(Error(330));
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    while (null !== nextEffect);
    root.current = finishedWork;
    nextEffect = updateExpirationTimeBeforeCommit;
    do
      try {
        for (
          effectTag = root, current$$1$jscomp$0 = expirationTime;
          null !== nextEffect;

        ) {
          var effectTag$jscomp$0 = nextEffect.effectTag;
          if (effectTag$jscomp$0 & 36) {
            current$$1 = effectTag;
            var current$$1$jscomp$1 = nextEffect.alternate;
            currentRef = nextEffect;
            alternate = current$$1$jscomp$0;
            switch (currentRef.tag) {
              case 0:
              case 11:
              case 15:
                commitHookEffectList(16, 32, currentRef);
                break;
              case 1:
                var instance$jscomp$0 = currentRef.stateNode;
                if (currentRef.effectTag & 4)
                  if (null === current$$1$jscomp$1)
                    instance$jscomp$0.componentDidMount();
                  else {
                    var prevProps$jscomp$0 =
                      currentRef.elementType === currentRef.type
                        ? current$$1$jscomp$1.memoizedProps
                        : resolveDefaultProps(
                            currentRef.type,
                            current$$1$jscomp$1.memoizedProps
                          );
                    instance$jscomp$0.componentDidUpdate(
                      prevProps$jscomp$0,
                      current$$1$jscomp$1.memoizedState,
                      instance$jscomp$0.__reactInternalSnapshotBeforeUpdate
                    );
                  }
                var updateQueue = currentRef.updateQueue;
                null !== updateQueue &&
                  commitUpdateQueue(
                    currentRef,
                    updateQueue,
                    instance$jscomp$0,
                    alternate
                  );
                break;
              case 3:
                var _updateQueue = currentRef.updateQueue;
                if (null !== _updateQueue) {
                  current$$1 = null;
                  if (null !== currentRef.child)
                    switch (currentRef.child.tag) {
                      case 5:
                        current$$1 = currentRef.child.stateNode;
                        break;
                      case 1:
                        current$$1 = currentRef.child.stateNode;
                    }
                  commitUpdateQueue(
                    currentRef,
                    _updateQueue,
                    current$$1,
                    alternate
                  );
                }
                break;
              case 5:
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                var hydrationCallbacks = current$$1.hydrationCallbacks;
                if (null !== hydrationCallbacks) {
                  var onHydrated = hydrationCallbacks.onHydrated;
                  if (onHydrated && null === currentRef.memoizedState) {
                    var current$$1$jscomp$2 = currentRef.alternate;
                    if (null !== current$$1$jscomp$2) {
                      var prevState$jscomp$0 =
                        current$$1$jscomp$2.memoizedState;
                      null !== prevState$jscomp$0 &&
                        null !== prevState$jscomp$0.dehydrated &&
                        onHydrated(prevState$jscomp$0.dehydrated);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 20:
                break;
              default:
                throw ReactErrorProd(Error(163));
            }
          }
          if (effectTag$jscomp$0 & 128) {
            var ref = nextEffect.ref;
            if (null !== ref) {
              var instance$jscomp$1 = nextEffect.stateNode;
              switch (nextEffect.tag) {
                case 5:
                  var instanceToUse = instance$jscomp$1;
                  break;
                default:
                  instanceToUse = instance$jscomp$1;
              }
              "function" === typeof ref
                ? ref(instanceToUse)
                : (ref.current = instanceToUse);
            }
          }
          effectTag$jscomp$0 & 512 && (rootDoesHavePassiveEffects = !0);
          nextEffect = nextEffect.nextEffect;
        }
      } catch (error) {
        if (null === nextEffect) throw ReactErrorProd(Error(330));
        captureCommitPhaseError(nextEffect, error);
        nextEffect = nextEffect.nextEffect;
      }
    while (null !== nextEffect);
    nextEffect = null;
    requestPaint();
    executionContext = childExpirationTimeBeforeCommit;
  } else root.current = finishedWork;
  if (rootDoesHavePassiveEffects)
    (rootDoesHavePassiveEffects = !1),
      (rootWithPendingPassiveEffects = root),
      (pendingPassiveEffectsExpirationTime = expirationTime),
      (pendingPassiveEffectsRenderPriority = renderPriorityLevel);
  else
    for (nextEffect = updateExpirationTimeBeforeCommit; null !== nextEffect; )
      (renderPriorityLevel = nextEffect.nextEffect),
        (nextEffect.nextEffect = null),
        (nextEffect = renderPriorityLevel);
  renderPriorityLevel = root.firstPendingTime;
  0 !== renderPriorityLevel
    ? ((effectTag$jscomp$0 = requestCurrentTime()),
      (effectTag$jscomp$0 = inferPriorityFromExpirationTime(
        effectTag$jscomp$0,
        renderPriorityLevel
      )),
      scheduleCallbackForRoot(root, effectTag$jscomp$0, renderPriorityLevel))
    : (legacyErrorBoundariesThatAlreadyFailed = null);
  "function" === typeof onCommitFiberRoot &&
    onCommitFiberRoot(finishedWork.stateNode, expirationTime);
  1073741823 === renderPriorityLevel
    ? root === rootWithNestedUpdates
      ? nestedUpdateCount++
      : ((nestedUpdateCount = 0), (rootWithNestedUpdates = root))
    : (nestedUpdateCount = 0);
  if (hasUncaughtError)
    throw ((hasUncaughtError = !1),
    (root = firstUncaughtError),
    (firstUncaughtError = null),
    root);
  if ((executionContext & LegacyUnbatchedContext) !== NoContext) return null;
  flushSyncCallbackQueue();
  return null;
}
function flushPassiveEffects() {
  if (null === rootWithPendingPassiveEffects) return !1;
  var root = rootWithPendingPassiveEffects,
    expirationTime = pendingPassiveEffectsExpirationTime,
    renderPriorityLevel = pendingPassiveEffectsRenderPriority;
  rootWithPendingPassiveEffects = null;
  pendingPassiveEffectsExpirationTime = 0;
  pendingPassiveEffectsRenderPriority = 90;
  return runWithPriority(
    97 < renderPriorityLevel ? 97 : renderPriorityLevel,
    flushPassiveEffectsImpl.bind(null, root, expirationTime)
  );
}
function flushPassiveEffectsImpl(root) {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext)
    throw ReactErrorProd(Error(331));
  var prevExecutionContext = executionContext;
  executionContext |= CommitContext;
  for (root = root.current.firstEffect; null !== root; ) {
    try {
      var finishedWork = root;
      if (0 !== (finishedWork.effectTag & 512))
        switch (finishedWork.tag) {
          case 0:
          case 11:
          case 15:
            commitHookEffectList(128, 0, finishedWork),
              commitHookEffectList(0, 64, finishedWork);
        }
    } catch (error) {
      if (null === root) throw ReactErrorProd(Error(330));
      captureCommitPhaseError(root, error);
    }
    finishedWork = root.nextEffect;
    root.nextEffect = null;
    root = finishedWork;
  }
  executionContext = prevExecutionContext;
  flushSyncCallbackQueue();
  return !0;
}
function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
  sourceFiber = createCapturedValue(error, sourceFiber);
  sourceFiber = createRootErrorUpdate(rootFiber, sourceFiber, 1073741823);
  enqueueUpdate(rootFiber, sourceFiber);
  rootFiber = markUpdateTimeFromFiberToRoot(rootFiber, 1073741823);
  null !== rootFiber && scheduleCallbackForRoot(rootFiber, 99, 1073741823);
}
function captureCommitPhaseError(sourceFiber, error) {
  if (3 === sourceFiber.tag)
    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
  else
    for (var fiber = sourceFiber.return; null !== fiber; ) {
      if (3 === fiber.tag) {
        captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
        break;
      } else if (1 === fiber.tag) {
        var instance = fiber.stateNode;
        if (
          "function" === typeof fiber.type.getDerivedStateFromError ||
          ("function" === typeof instance.componentDidCatch &&
            (null === legacyErrorBoundariesThatAlreadyFailed ||
              !legacyErrorBoundariesThatAlreadyFailed.has(instance)))
        ) {
          sourceFiber = createCapturedValue(error, sourceFiber);
          sourceFiber = createClassErrorUpdate(fiber, sourceFiber, 1073741823);
          enqueueUpdate(fiber, sourceFiber);
          fiber = markUpdateTimeFromFiberToRoot(fiber, 1073741823);
          null !== fiber && scheduleCallbackForRoot(fiber, 99, 1073741823);
          break;
        }
      }
      fiber = fiber.return;
    }
}
function pingSuspendedRoot(root, thenable, suspendedTime) {
  var pingCache = root.pingCache;
  null !== pingCache && pingCache.delete(thenable);
  workInProgressRoot === root && renderExpirationTime === suspendedTime
    ? workInProgressRootExitStatus === RootSuspendedWithDelay ||
      (workInProgressRootExitStatus === RootSuspended &&
        1073741823 === workInProgressRootLatestProcessedExpirationTime &&
        now() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS)
      ? prepareFreshStack(root, renderExpirationTime)
      : (workInProgressRootHasPendingPing = !0)
    : root.lastPendingTime < suspendedTime ||
      ((thenable = root.pingTime),
      (0 !== thenable && thenable < suspendedTime) ||
        ((root.pingTime = suspendedTime),
        root.finishedExpirationTime === suspendedTime &&
          ((root.finishedExpirationTime = 0), (root.finishedWork = null)),
        (thenable = requestCurrentTime()),
        (thenable = inferPriorityFromExpirationTime(thenable, suspendedTime)),
        scheduleCallbackForRoot(root, thenable, suspendedTime)));
}
function retryTimedOutBoundary(boundaryFiber, retryTime) {
  var currentTime = requestCurrentTime();
  1 === retryTime &&
    (retryTime = computeExpirationForFiber(currentTime, boundaryFiber, null));
  currentTime = inferPriorityFromExpirationTime(currentTime, retryTime);
  boundaryFiber = markUpdateTimeFromFiberToRoot(boundaryFiber, retryTime);
  null !== boundaryFiber &&
    scheduleCallbackForRoot(boundaryFiber, currentTime, retryTime);
}
function retryDehydratedSuspenseBoundary(boundaryFiber) {
  var suspenseState = boundaryFiber.memoizedState,
    retryTime = 1;
  null !== suspenseState && (retryTime = suspenseState.retryTime);
  retryTimedOutBoundary(boundaryFiber, retryTime);
}
function resolveRetryThenable(boundaryFiber, thenable) {
  var retryTime = 1;
  switch (boundaryFiber.tag) {
    case 13:
      var retryCache = boundaryFiber.stateNode;
      var suspenseState = boundaryFiber.memoizedState;
      null !== suspenseState && (retryTime = suspenseState.retryTime);
      break;
    default:
      throw ReactErrorProd(Error(314));
  }
  null !== retryCache && retryCache.delete(thenable);
  retryTimedOutBoundary(boundaryFiber, retryTime);
}
var beginWork$$1;
beginWork$$1 = function(current$$1, workInProgress, renderExpirationTime) {
  var updateExpirationTime = workInProgress.expirationTime;
  if (null !== current$$1)
    if (
      current$$1.memoizedProps !== workInProgress.pendingProps ||
      (disableLegacyContext ? 0 : didPerformWorkStackCursor.current)
    )
      didReceiveUpdate = !0;
    else {
      if (updateExpirationTime < renderExpirationTime) {
        didReceiveUpdate = !1;
        switch (workInProgress.tag) {
          case 3:
            pushHostRootContext(workInProgress);
            break;
          case 5:
            pushHostContext(workInProgress);
            break;
          case 1:
            isContextProvider(workInProgress.type) &&
              pushContextProvider(workInProgress);
            break;
          case 4:
            pushHostContainer(
              workInProgress,
              workInProgress.stateNode.containerInfo
            );
            break;
          case 10:
            pushProvider(workInProgress, workInProgress.memoizedProps.value);
            break;
          case 13:
            updateExpirationTime = workInProgress.memoizedState;
            if (null !== updateExpirationTime) {
              if (null !== updateExpirationTime.dehydrated) {
                push(
                  suspenseStackCursor,
                  suspenseStackCursor.current & 1,
                  workInProgress
                );
                workInProgress.effectTag |= 64;
                break;
              }
              updateExpirationTime = workInProgress.child.childExpirationTime;
              if (
                0 !== updateExpirationTime &&
                updateExpirationTime >= renderExpirationTime
              )
                return updateSuspenseComponent(
                  current$$1,
                  workInProgress,
                  renderExpirationTime
                );
              push(
                suspenseStackCursor,
                suspenseStackCursor.current & 1,
                workInProgress
              );
              workInProgress = bailoutOnAlreadyFinishedWork(
                current$$1,
                workInProgress,
                renderExpirationTime
              );
              return null !== workInProgress ? workInProgress.sibling : null;
            }
            push(
              suspenseStackCursor,
              suspenseStackCursor.current & 1,
              workInProgress
            );
            break;
          case 19:
            updateExpirationTime =
              workInProgress.childExpirationTime >= renderExpirationTime;
            if (0 !== (current$$1.effectTag & 64)) {
              if (updateExpirationTime)
                return updateSuspenseListComponent(
                  current$$1,
                  workInProgress,
                  renderExpirationTime
                );
              workInProgress.effectTag |= 64;
            }
            var renderState = workInProgress.memoizedState;
            null !== renderState &&
              ((renderState.rendering = null), (renderState.tail = null));
            push(
              suspenseStackCursor,
              suspenseStackCursor.current,
              workInProgress
            );
            if (!updateExpirationTime) return null;
        }
        return bailoutOnAlreadyFinishedWork(
          current$$1,
          workInProgress,
          renderExpirationTime
        );
      }
      didReceiveUpdate = !1;
    }
  else didReceiveUpdate = !1;
  workInProgress.expirationTime = 0;
  switch (workInProgress.tag) {
    case 2:
      updateExpirationTime = workInProgress.type;
      null !== current$$1 &&
        ((current$$1.alternate = null),
        (workInProgress.alternate = null),
        (workInProgress.effectTag |= 2));
      current$$1 = workInProgress.pendingProps;
      disableLegacyContext ||
        ((renderState = getUnmaskedContext(
          workInProgress,
          updateExpirationTime,
          !1
        )),
        (renderState = getMaskedContext(workInProgress, renderState)));
      prepareToReadContext(workInProgress, renderExpirationTime);
      renderState = renderWithHooks(
        null,
        workInProgress,
        updateExpirationTime,
        current$$1,
        renderState,
        renderExpirationTime
      );
      workInProgress.effectTag |= 1;
      if (
        "object" === typeof renderState &&
        null !== renderState &&
        "function" === typeof renderState.render &&
        void 0 === renderState.$$typeof
      ) {
        workInProgress.tag = 1;
        resetHooks();
        if (isContextProvider(updateExpirationTime)) {
          var hasContext = !0;
          pushContextProvider(workInProgress);
        } else hasContext = !1;
        workInProgress.memoizedState =
          null !== renderState.state && void 0 !== renderState.state
            ? renderState.state
            : null;
        var getDerivedStateFromProps =
          updateExpirationTime.getDerivedStateFromProps;
        "function" === typeof getDerivedStateFromProps &&
          applyDerivedStateFromProps(
            workInProgress,
            updateExpirationTime,
            getDerivedStateFromProps,
            current$$1
          );
        renderState.updater = classComponentUpdater;
        workInProgress.stateNode = renderState;
        renderState._reactInternalFiber = workInProgress;
        mountClassInstance(
          workInProgress,
          updateExpirationTime,
          current$$1,
          renderExpirationTime
        );
        workInProgress = finishClassComponent(
          null,
          workInProgress,
          updateExpirationTime,
          !0,
          hasContext,
          renderExpirationTime
        );
      } else
        (workInProgress.tag = 0),
          reconcileChildren(
            null,
            workInProgress,
            renderState,
            renderExpirationTime
          ),
          (workInProgress = workInProgress.child);
      return workInProgress;
    case 16:
      renderState = workInProgress.elementType;
      null !== current$$1 &&
        ((current$$1.alternate = null),
        (workInProgress.alternate = null),
        (workInProgress.effectTag |= 2));
      current$$1 = workInProgress.pendingProps;
      initializeLazyComponentType(renderState);
      if (1 !== renderState._status) throw renderState._result;
      renderState = renderState._result;
      workInProgress.type = renderState;
      hasContext = workInProgress.tag = resolveLazyComponentTag(renderState);
      current$$1 = resolveDefaultProps(renderState, current$$1);
      switch (hasContext) {
        case 0:
          workInProgress = updateFunctionComponent(
            null,
            workInProgress,
            renderState,
            current$$1,
            renderExpirationTime
          );
          break;
        case 1:
          workInProgress = updateClassComponent(
            null,
            workInProgress,
            renderState,
            current$$1,
            renderExpirationTime
          );
          break;
        case 11:
          workInProgress = updateForwardRef(
            null,
            workInProgress,
            renderState,
            current$$1,
            renderExpirationTime
          );
          break;
        case 14:
          workInProgress = updateMemoComponent(
            null,
            workInProgress,
            renderState,
            resolveDefaultProps(renderState.type, current$$1),
            updateExpirationTime,
            renderExpirationTime
          );
          break;
        default:
          throw ReactErrorProd(Error(306), renderState, "");
      }
      return workInProgress;
    case 0:
      return (
        (updateExpirationTime = workInProgress.type),
        (renderState = workInProgress.pendingProps),
        (renderState =
          workInProgress.elementType === updateExpirationTime
            ? renderState
            : resolveDefaultProps(updateExpirationTime, renderState)),
        updateFunctionComponent(
          current$$1,
          workInProgress,
          updateExpirationTime,
          renderState,
          renderExpirationTime
        )
      );
    case 1:
      return (
        (updateExpirationTime = workInProgress.type),
        (renderState = workInProgress.pendingProps),
        (renderState =
          workInProgress.elementType === updateExpirationTime
            ? renderState
            : resolveDefaultProps(updateExpirationTime, renderState)),
        updateClassComponent(
          current$$1,
          workInProgress,
          updateExpirationTime,
          renderState,
          renderExpirationTime
        )
      );
    case 3:
      pushHostRootContext(workInProgress);
      updateExpirationTime = workInProgress.updateQueue;
      if (null === updateExpirationTime) throw ReactErrorProd(Error(282));
      renderState = workInProgress.memoizedState;
      renderState = null !== renderState ? renderState.element : null;
      processUpdateQueue(
        workInProgress,
        updateExpirationTime,
        workInProgress.pendingProps,
        null,
        renderExpirationTime
      );
      updateExpirationTime = workInProgress.memoizedState.element;
      updateExpirationTime === renderState
        ? (workInProgress = bailoutOnAlreadyFinishedWork(
            current$$1,
            workInProgress,
            renderExpirationTime
          ))
        : (reconcileChildren(
            current$$1,
            workInProgress,
            updateExpirationTime,
            renderExpirationTime
          ),
          (workInProgress = workInProgress.child));
      return workInProgress;
    case 5:
      return (
        pushHostContext(workInProgress),
        null === current$$1 && tryToClaimNextHydratableInstance(workInProgress),
        (updateExpirationTime = workInProgress.type),
        (renderState = workInProgress.pendingProps),
        (hasContext = null !== current$$1 ? current$$1.memoizedProps : null),
        (getDerivedStateFromProps = renderState.children),
        shouldSetTextContent(updateExpirationTime, renderState)
          ? (getDerivedStateFromProps = null)
          : null !== hasContext &&
            shouldSetTextContent(updateExpirationTime, hasContext) &&
            (workInProgress.effectTag |= 16),
        markRef(current$$1, workInProgress),
        reconcileChildren(
          current$$1,
          workInProgress,
          getDerivedStateFromProps,
          renderExpirationTime
        ),
        workInProgress.child
      );
    case 6:
      return (
        null === current$$1 && tryToClaimNextHydratableInstance(workInProgress),
        null
      );
    case 13:
      return updateSuspenseComponent(
        current$$1,
        workInProgress,
        renderExpirationTime
      );
    case 4:
      return (
        pushHostContainer(
          workInProgress,
          workInProgress.stateNode.containerInfo
        ),
        (updateExpirationTime = workInProgress.pendingProps),
        null === current$$1
          ? (workInProgress.child = reconcileChildFibers(
              workInProgress,
              null,
              updateExpirationTime,
              renderExpirationTime
            ))
          : reconcileChildren(
              current$$1,
              workInProgress,
              updateExpirationTime,
              renderExpirationTime
            ),
        workInProgress.child
      );
    case 11:
      return (
        (updateExpirationTime = workInProgress.type),
        (renderState = workInProgress.pendingProps),
        (renderState =
          workInProgress.elementType === updateExpirationTime
            ? renderState
            : resolveDefaultProps(updateExpirationTime, renderState)),
        updateForwardRef(
          current$$1,
          workInProgress,
          updateExpirationTime,
          renderState,
          renderExpirationTime
        )
      );
    case 7:
      return (
        reconcileChildren(
          current$$1,
          workInProgress,
          workInProgress.pendingProps,
          renderExpirationTime
        ),
        workInProgress.child
      );
    case 8:
      return (
        reconcileChildren(
          current$$1,
          workInProgress,
          workInProgress.pendingProps.children,
          renderExpirationTime
        ),
        workInProgress.child
      );
    case 12:
      return (
        reconcileChildren(
          current$$1,
          workInProgress,
          workInProgress.pendingProps.children,
          renderExpirationTime
        ),
        workInProgress.child
      );
    case 10:
      a: {
        updateExpirationTime = workInProgress.type._context;
        renderState = workInProgress.pendingProps;
        getDerivedStateFromProps = workInProgress.memoizedProps;
        hasContext = renderState.value;
        pushProvider(workInProgress, hasContext);
        if (null !== getDerivedStateFromProps) {
          var oldValue = getDerivedStateFromProps.value;
          hasContext = is(oldValue, hasContext)
            ? 0
            : ("function" === typeof updateExpirationTime._calculateChangedBits
                ? updateExpirationTime._calculateChangedBits(
                    oldValue,
                    hasContext
                  )
                : 1073741823) | 0;
          if (0 === hasContext) {
            if (
              getDerivedStateFromProps.children === renderState.children &&
              (disableLegacyContext || !didPerformWorkStackCursor.current)
            ) {
              workInProgress = bailoutOnAlreadyFinishedWork(
                current$$1,
                workInProgress,
                renderExpirationTime
              );
              break a;
            }
          } else
            for (
              getDerivedStateFromProps = workInProgress.child,
                null !== getDerivedStateFromProps &&
                  (getDerivedStateFromProps.return = workInProgress);
              null !== getDerivedStateFromProps;

            ) {
              var list = getDerivedStateFromProps.dependencies;
              if (null !== list) {
                oldValue = getDerivedStateFromProps.child;
                for (
                  var dependency = list.firstContext;
                  null !== dependency;

                ) {
                  if (
                    dependency.context === updateExpirationTime &&
                    0 !== (dependency.observedBits & hasContext)
                  ) {
                    1 === getDerivedStateFromProps.tag &&
                      ((dependency = createUpdate(renderExpirationTime, null)),
                      (dependency.tag = 2),
                      enqueueUpdate(getDerivedStateFromProps, dependency));
                    getDerivedStateFromProps.expirationTime <
                      renderExpirationTime &&
                      (getDerivedStateFromProps.expirationTime = renderExpirationTime);
                    dependency = getDerivedStateFromProps.alternate;
                    null !== dependency &&
                      dependency.expirationTime < renderExpirationTime &&
                      (dependency.expirationTime = renderExpirationTime);
                    scheduleWorkOnParentPath(
                      getDerivedStateFromProps.return,
                      renderExpirationTime
                    );
                    list.expirationTime < renderExpirationTime &&
                      (list.expirationTime = renderExpirationTime);
                    break;
                  }
                  dependency = dependency.next;
                }
              } else if (10 === getDerivedStateFromProps.tag)
                oldValue =
                  getDerivedStateFromProps.type === workInProgress.type
                    ? null
                    : getDerivedStateFromProps.child;
              else if (18 === getDerivedStateFromProps.tag) {
                oldValue = getDerivedStateFromProps.return;
                if (null === oldValue) throw ReactErrorProd(Error(341));
                oldValue.expirationTime < renderExpirationTime &&
                  (oldValue.expirationTime = renderExpirationTime);
                list = oldValue.alternate;
                null !== list &&
                  list.expirationTime < renderExpirationTime &&
                  (list.expirationTime = renderExpirationTime);
                scheduleWorkOnParentPath(oldValue, renderExpirationTime);
                oldValue = getDerivedStateFromProps.sibling;
              } else oldValue = getDerivedStateFromProps.child;
              if (null !== oldValue) oldValue.return = getDerivedStateFromProps;
              else
                for (oldValue = getDerivedStateFromProps; null !== oldValue; ) {
                  if (oldValue === workInProgress) {
                    oldValue = null;
                    break;
                  }
                  getDerivedStateFromProps = oldValue.sibling;
                  if (null !== getDerivedStateFromProps) {
                    getDerivedStateFromProps.return = oldValue.return;
                    oldValue = getDerivedStateFromProps;
                    break;
                  }
                  oldValue = oldValue.return;
                }
              getDerivedStateFromProps = oldValue;
            }
        }
        reconcileChildren(
          current$$1,
          workInProgress,
          renderState.children,
          renderExpirationTime
        );
        workInProgress = workInProgress.child;
      }
      return workInProgress;
    case 9:
      return (
        (renderState = workInProgress.type),
        (hasContext = workInProgress.pendingProps),
        (updateExpirationTime = hasContext.children),
        prepareToReadContext(workInProgress, renderExpirationTime),
        (renderState = readContext(
          renderState,
          hasContext.unstable_observedBits
        )),
        (updateExpirationTime = updateExpirationTime(renderState)),
        (workInProgress.effectTag |= 1),
        reconcileChildren(
          current$$1,
          workInProgress,
          updateExpirationTime,
          renderExpirationTime
        ),
        workInProgress.child
      );
    case 14:
      return (
        (renderState = workInProgress.type),
        (hasContext = resolveDefaultProps(
          renderState,
          workInProgress.pendingProps
        )),
        (hasContext = resolveDefaultProps(renderState.type, hasContext)),
        updateMemoComponent(
          current$$1,
          workInProgress,
          renderState,
          hasContext,
          updateExpirationTime,
          renderExpirationTime
        )
      );
    case 15:
      return updateSimpleMemoComponent(
        current$$1,
        workInProgress,
        workInProgress.type,
        workInProgress.pendingProps,
        updateExpirationTime,
        renderExpirationTime
      );
    case 17:
      return (
        (updateExpirationTime = workInProgress.type),
        (renderState = workInProgress.pendingProps),
        (renderState =
          workInProgress.elementType === updateExpirationTime
            ? renderState
            : resolveDefaultProps(updateExpirationTime, renderState)),
        null !== current$$1 &&
          ((current$$1.alternate = null),
          (workInProgress.alternate = null),
          (workInProgress.effectTag |= 2)),
        (workInProgress.tag = 1),
        isContextProvider(updateExpirationTime)
          ? ((current$$1 = !0), pushContextProvider(workInProgress))
          : (current$$1 = !1),
        prepareToReadContext(workInProgress, renderExpirationTime),
        constructClassInstance(
          workInProgress,
          updateExpirationTime,
          renderState,
          renderExpirationTime
        ),
        mountClassInstance(
          workInProgress,
          updateExpirationTime,
          renderState,
          renderExpirationTime
        ),
        finishClassComponent(
          null,
          workInProgress,
          updateExpirationTime,
          !0,
          current$$1,
          renderExpirationTime
        )
      );
    case 19:
      return updateSuspenseListComponent(
        current$$1,
        workInProgress,
        renderExpirationTime
      );
  }
  throw ReactErrorProd(Error(156));
};
var onCommitFiberRoot = null,
  onCommitFiberUnmount = null;
function injectInternals(internals) {
  if ("undefined" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) return !1;
  var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook.isDisabled || !hook.supportsFiber) return !0;
  try {
    var rendererID = hook.inject(internals);
    onCommitFiberRoot = function(root) {
      try {
        hook.onCommitFiberRoot(
          rendererID,
          root,
          void 0,
          64 === (root.current.effectTag & 64)
        );
      } catch (err) {}
    };
    onCommitFiberUnmount = function(fiber) {
      try {
        hook.onCommitFiberUnmount(rendererID, fiber);
      } catch (err) {}
    };
  } catch (err) {}
  return !0;
}
function FiberNode(tag, pendingProps, key, mode) {
  this.tag = tag;
  this.key = key;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = mode;
  this.effectTag = 0;
  this.lastEffect = this.firstEffect = this.nextEffect = null;
  this.childExpirationTime = this.expirationTime = 0;
  this.alternate = null;
}
function createFiber(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}
function shouldConstruct(Component) {
  Component = Component.prototype;
  return !(!Component || !Component.isReactComponent);
}
function resolveLazyComponentTag(Component) {
  if ("function" === typeof Component)
    return shouldConstruct(Component) ? 1 : 0;
  if (void 0 !== Component && null !== Component) {
    Component = Component.$$typeof;
    if (Component === REACT_FORWARD_REF_TYPE) return 11;
    if (Component === REACT_MEMO_TYPE) return 14;
  }
  return 2;
}
function createWorkInProgress(current, pendingProps) {
  var workInProgress = current.alternate;
  null === workInProgress
    ? ((workInProgress = createFiber(
        current.tag,
        pendingProps,
        current.key,
        current.mode
      )),
      (workInProgress.elementType = current.elementType),
      (workInProgress.type = current.type),
      (workInProgress.stateNode = current.stateNode),
      (workInProgress.alternate = current),
      (current.alternate = workInProgress))
    : ((workInProgress.pendingProps = pendingProps),
      (workInProgress.effectTag = 0),
      (workInProgress.nextEffect = null),
      (workInProgress.firstEffect = null),
      (workInProgress.lastEffect = null));
  workInProgress.childExpirationTime = current.childExpirationTime;
  workInProgress.expirationTime = current.expirationTime;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  pendingProps = current.dependencies;
  workInProgress.dependencies =
    null === pendingProps
      ? null
      : {
          expirationTime: pendingProps.expirationTime,
          firstContext: pendingProps.firstContext,
          responders: pendingProps.responders
        };
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;
  return workInProgress;
}
function createFiberFromTypeAndProps(
  type,
  key,
  pendingProps,
  owner,
  mode,
  expirationTime
) {
  var fiberTag = 2;
  owner = type;
  if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
  else if ("string" === typeof type) fiberTag = 5;
  else
    a: switch (type) {
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(
          pendingProps.children,
          mode,
          expirationTime,
          key
        );
      case REACT_CONCURRENT_MODE_TYPE:
        fiberTag = 8;
        mode |= 7;
        break;
      case REACT_STRICT_MODE_TYPE:
        fiberTag = 8;
        mode |= 1;
        break;
      case REACT_PROFILER_TYPE:
        return (
          (type = createFiber(12, pendingProps, key, mode | 8)),
          (type.elementType = REACT_PROFILER_TYPE),
          (type.type = REACT_PROFILER_TYPE),
          (type.expirationTime = expirationTime),
          type
        );
      case REACT_SUSPENSE_TYPE:
        return (
          (type = createFiber(13, pendingProps, key, mode)),
          (type.type = REACT_SUSPENSE_TYPE),
          (type.elementType = REACT_SUSPENSE_TYPE),
          (type.expirationTime = expirationTime),
          type
        );
      case REACT_SUSPENSE_LIST_TYPE:
        return (
          (type = createFiber(19, pendingProps, key, mode)),
          (type.elementType = REACT_SUSPENSE_LIST_TYPE),
          (type.expirationTime = expirationTime),
          type
        );
      default:
        if ("object" === typeof type && null !== type)
          switch (type.$$typeof) {
            case REACT_PROVIDER_TYPE:
              fiberTag = 10;
              break a;
            case REACT_CONTEXT_TYPE:
              fiberTag = 9;
              break a;
            case REACT_FORWARD_REF_TYPE:
              fiberTag = 11;
              break a;
            case REACT_MEMO_TYPE:
              fiberTag = 14;
              break a;
            case REACT_LAZY_TYPE:
              fiberTag = 16;
              owner = null;
              break a;
          }
        throw ReactErrorProd(Error(130), null == type ? type : typeof type, "");
    }
  key = createFiber(fiberTag, pendingProps, key, mode);
  key.elementType = type;
  key.type = owner;
  key.expirationTime = expirationTime;
  return key;
}
function createFiberFromFragment(elements, mode, expirationTime, key) {
  elements = createFiber(7, elements, key, mode);
  elements.expirationTime = expirationTime;
  return elements;
}
function createFiberFromText(content, mode, expirationTime) {
  content = createFiber(6, content, null, mode);
  content.expirationTime = expirationTime;
  return content;
}
function createFiberFromPortal(portal, mode, expirationTime) {
  mode = createFiber(
    4,
    null !== portal.children ? portal.children : [],
    portal.key,
    mode
  );
  mode.expirationTime = expirationTime;
  mode.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null,
    implementation: portal.implementation
  };
  return mode;
}
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.current = null;
  this.containerInfo = containerInfo;
  this.pingCache = this.pendingChildren = null;
  this.finishedExpirationTime = 0;
  this.finishedWork = null;
  this.timeoutHandle = -1;
  this.pendingContext = this.context = null;
  this.hydrate = hydrate;
  this.callbackNode = this.firstBatch = null;
  this.pingTime = this.lastPendingTime = this.firstPendingTime = this.callbackExpirationTime = 0;
  this.hydrationCallbacks = null;
}
function updateContainer(element, container, parentComponent, callback) {
  var current$$1 = container.current,
    currentTime = requestCurrentTime(),
    suspenseConfig = ReactCurrentBatchConfig.suspense;
  current$$1 = computeExpirationForFiber(
    currentTime,
    current$$1,
    suspenseConfig
  );
  currentTime = container.current;
  a: if (parentComponent) {
    parentComponent = parentComponent._reactInternalFiber;
    b: if (disableLegacyContext) var parentContext = emptyContextObject;
    else {
      if (
        2 !== isFiberMountedImpl(parentComponent) ||
        1 !== parentComponent.tag
      )
        throw ReactErrorProd(Error(170));
      parentContext = parentComponent;
      do {
        switch (parentContext.tag) {
          case 3:
            parentContext = parentContext.stateNode.context;
            break b;
          case 1:
            if (isContextProvider(parentContext.type)) {
              parentContext =
                parentContext.stateNode
                  .__reactInternalMemoizedMergedChildContext;
              break b;
            }
        }
        parentContext = parentContext.return;
      } while (null !== parentContext);
      throw ReactErrorProd(Error(171));
    }
    if (1 === parentComponent.tag) {
      var Component = parentComponent.type;
      if (isContextProvider(Component)) {
        parentComponent = processChildContext(
          parentComponent,
          Component,
          parentContext
        );
        break a;
      }
    }
    parentComponent = parentContext;
  } else parentComponent = emptyContextObject;
  null === container.context
    ? (container.context = parentComponent)
    : (container.pendingContext = parentComponent);
  container = callback;
  suspenseConfig = createUpdate(current$$1, suspenseConfig);
  suspenseConfig.payload = { element: element };
  container = void 0 === container ? null : container;
  null !== container && (suspenseConfig.callback = container);
  enqueueUpdate(currentTime, suspenseConfig);
  scheduleUpdateOnFiber(currentTime, current$$1);
  return current$$1;
}
Mode.setCurrent(FastNoSideEffects);
var slice = Array.prototype.slice,
  LinearGradient = (function() {
    function LinearGradient(stops, x1, y1, x2, y2) {
      this._args = slice.call(arguments);
    }
    LinearGradient.prototype.applyFill = function(node) {
      node.fillLinear.apply(node, this._args);
    };
    return LinearGradient;
  })(),
  RadialGradient = (function() {
    function RadialGradient(stops, fx, fy, rx, ry, cx, cy) {
      this._args = slice.call(arguments);
    }
    RadialGradient.prototype.applyFill = function(node) {
      node.fillRadial.apply(node, this._args);
    };
    return RadialGradient;
  })(),
  Pattern = (function() {
    function Pattern(url, width, height, left, top) {
      this._args = slice.call(arguments);
    }
    Pattern.prototype.applyFill = function(node) {
      node.fillImage.apply(node, this._args);
    };
    return Pattern;
  })(),
  Surface = (function(_React$Component) {
    function Surface() {
      return _React$Component.apply(this, arguments) || this;
    }
    _inheritsLoose(Surface, _React$Component);
    var _proto4 = Surface.prototype;
    _proto4.componentDidMount = function() {
      var _this$props = this.props;
      this._surface = Mode.Surface(
        +_this$props.width,
        +_this$props.height,
        this._tagRef
      );
      _this$props = new FiberRootNode(this._surface, 0, !1);
      _this$props.hydrationCallbacks = null;
      var uninitializedFiber = createFiber(3, null, null, 0);
      _this$props.current = uninitializedFiber;
      this._mountNode = uninitializedFiber.stateNode = _this$props;
      updateContainer(this.props.children, this._mountNode, this);
    };
    _proto4.componentDidUpdate = function(prevProps) {
      var props = this.props;
      (props.height === prevProps.height && props.width === prevProps.width) ||
        this._surface.resize(+props.width, +props.height);
      updateContainer(this.props.children, this._mountNode, this);
      this._surface.render && this._surface.render();
    };
    _proto4.componentWillUnmount = function() {
      updateContainer(null, this._mountNode, this);
    };
    _proto4.render = function() {
      var _this = this,
        props = this.props;
      return React.createElement(Mode.Surface.tagName, {
        ref: function(ref) {
          return (_this._tagRef = ref);
        },
        accessKey: props.accessKey,
        className: props.className,
        draggable: props.draggable,
        role: props.role,
        style: props.style,
        tabIndex: props.tabIndex,
        title: props.title
      });
    };
    return Surface;
  })(React.Component),
  Text = (function(_React$Component2) {
    function Text(props) {
      var _this2 = _React$Component2.call(this, props) || this;
      ["height", "width", "x", "y"].forEach(function(key) {
        Object.defineProperty(_assertThisInitialized(_this2), key, {
          get: function() {
            return this._text ? this._text[key] : void 0;
          }
        });
      });
      return _this2;
    }
    _inheritsLoose(Text, _React$Component2);
    Text.prototype.render = function() {
      var _this3 = this;
      return React.createElement(
        TYPES.TEXT,
        _extends({}, this.props, {
          ref: function(t) {
            return (_this3._text = t);
          }
        }),
        childrenAsString(this.props.children)
      );
    };
    return Text;
  })(React.Component);
(function(devToolsConfig) {
  var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
  return injectInternals(
    Object.assign({}, devToolsConfig, {
      overrideHookState: null,
      overrideProps: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: ReactSharedInternals.ReactCurrentDispatcher,
      findHostInstanceByFiber: function(fiber) {
        fiber = findCurrentHostFiber(fiber);
        return null === fiber ? null : fiber.stateNode;
      },
      findFiberByHostInstance: function(instance) {
        return findFiberByHostInstance
          ? findFiberByHostInstance(instance)
          : null;
      },
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null
    })
  );
})({
  findFiberByHostInstance: function() {
    return null;
  },
  bundleType: 0,
  version: "16.8.6",
  rendererPackageName: "react-art"
});
module.exports = {
  ClippingRectangle: TYPES.CLIPPING_RECTANGLE,
  Group: TYPES.GROUP,
  Shape: TYPES.SHAPE,
  Path: Mode.Path,
  LinearGradient: LinearGradient,
  Pattern: Pattern,
  RadialGradient: RadialGradient,
  Surface: Surface,
  Text: Text,
  Transform: Transform
};
