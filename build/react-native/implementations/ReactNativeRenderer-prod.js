"use strict";

require("react-native/Libraries/ReactPrivate/ReactNativePrivateInitializeCore");
var ReactNativePrivateInterface = require("react-native/Libraries/ReactPrivate/ReactNativePrivateInterface");
var React = require("react");
var Scheduler = require("scheduler");
var tracing = require("scheduler/tracing");

// Do not require this module directly! Use normal `invariant` calls with
// template literal strings. The messages will be converted to ReactError during
// build, and in production they will be minified.
function ReactError(error) {
  error.name = "Invariant Violation";
  return error;
}

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

/**
 * Injectable ordering of event plugins.
 */
var eventPluginOrder = null;
/**
 * Injectable mapping from names to event plugin modules.
 */

var namesToPlugins = {};
/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */

function recomputePluginOrdering() {
  if (!eventPluginOrder) {
    // Wait until an `eventPluginOrder` is injected.
    return;
  }

  for (var pluginName in namesToPlugins) {
    var pluginModule = namesToPlugins[pluginName];
    var pluginIndex = eventPluginOrder.indexOf(pluginName);

    (function() {
      if (!(pluginIndex > -1)) {
        throw ReactError(
          Error(
            "EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `" +
              pluginName +
              "`."
          )
        );
      }
    })();

    if (plugins[pluginIndex]) {
      continue;
    }

    (function() {
      if (!pluginModule.extractEvents) {
        throw ReactError(
          Error(
            "EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `" +
              pluginName +
              "` does not."
          )
        );
      }
    })();

    plugins[pluginIndex] = pluginModule;
    var publishedEvents = pluginModule.eventTypes;

    for (var eventName in publishedEvents) {
      (function() {
        if (
          !publishEventForPlugin(
            publishedEvents[eventName],
            pluginModule,
            eventName
          )
        ) {
          throw ReactError(
            Error(
              "EventPluginRegistry: Failed to publish event `" +
                eventName +
                "` for plugin `" +
                pluginName +
                "`."
            )
          );
        }
      })();
    }
  }
}
/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */

function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
  (function() {
    if (!!eventNameDispatchConfigs.hasOwnProperty(eventName)) {
      throw ReactError(
        Error(
          "EventPluginHub: More than one plugin attempted to publish the same event name, `" +
            eventName +
            "`."
        )
      );
    }
  })();

  eventNameDispatchConfigs[eventName] = dispatchConfig;
  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(
          phasedRegistrationName,
          pluginModule,
          eventName
        );
      }
    }

    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(
      dispatchConfig.registrationName,
      pluginModule,
      eventName
    );
    return true;
  }

  return false;
}
/**
 * Publishes a registration name that is used to identify dispatched events.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */

function publishRegistrationName(registrationName, pluginModule, eventName) {
  (function() {
    if (!!registrationNameModules[registrationName]) {
      throw ReactError(
        Error(
          "EventPluginHub: More than one plugin attempted to publish the same registration name, `" +
            registrationName +
            "`."
        )
      );
    }
  })();

  registrationNameModules[registrationName] = pluginModule;
  registrationNameDependencies[registrationName] =
    pluginModule.eventTypes[eventName].dependencies;
}
/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */

/**
 * Ordered list of injected plugins.
 */

var plugins = [];
/**
 * Mapping from event name to dispatch config
 */

var eventNameDispatchConfigs = {};
/**
 * Mapping from registration name to plugin module
 */

var registrationNameModules = {};
/**
 * Mapping from registration name to event name
 */

var registrationNameDependencies = {};
/**
 * Mapping from lowercase registration names to the properly cased version,
 * used to warn in the case of missing event handlers. Available
 * only in false.
 * @type {Object}
 */

// Trust the developer to only use possibleRegistrationNames in false

/**
 * Injects an ordering of plugins (by plugin name). This allows the ordering
 * to be decoupled from injection of the actual plugins so that ordering is
 * always deterministic regardless of packaging, on-the-fly injection, etc.
 *
 * @param {array} InjectedEventPluginOrder
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginOrder}
 */

function injectEventPluginOrder(injectedEventPluginOrder) {
  (function() {
    if (!!eventPluginOrder) {
      throw ReactError(
        Error(
          "EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React."
        )
      );
    }
  })(); // Clone the ordering so it cannot be dynamically mutated.

  eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
  recomputePluginOrdering();
}
/**
 * Injects plugins to be used by `EventPluginHub`. The plugin names must be
 * in the ordering injected by `injectEventPluginOrder`.
 *
 * Plugins can be injected as part of page initialization or on-the-fly.
 *
 * @param {object} injectedNamesToPlugins Map from names to plugin modules.
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginsByName}
 */

function injectEventPluginsByName(injectedNamesToPlugins) {
  var isOrderingDirty = false;

  for (var pluginName in injectedNamesToPlugins) {
    if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
      continue;
    }

    var pluginModule = injectedNamesToPlugins[pluginName];

    if (
      !namesToPlugins.hasOwnProperty(pluginName) ||
      namesToPlugins[pluginName] !== pluginModule
    ) {
      (function() {
        if (!!namesToPlugins[pluginName]) {
          throw ReactError(
            Error(
              "EventPluginRegistry: Cannot inject two different event plugins using the same name, `" +
                pluginName +
                "`."
            )
          );
        }
      })();

      namesToPlugins[pluginName] = pluginModule;
      isOrderingDirty = true;
    }
  }

  if (isOrderingDirty) {
    recomputePluginOrdering();
  }
}

var invokeGuardedCallbackImpl = function(
  name,
  func,
  context,
  a,
  b,
  c,
  d,
  e,
  f
) {
  var funcArgs = Array.prototype.slice.call(arguments, 3);

  try {
    func.apply(context, funcArgs);
  } catch (error) {
    this.onError(error);
  }
};

var hasError = false;
var caughtError = null; // Used by event system to capture/rethrow the first error.

var hasRethrowError = false;
var rethrowError = null;
var reporter = {
  onError: function(error) {
    hasError = true;
    caughtError = error;
  }
};
/**
 * Call a function while guarding against errors that happens within it.
 * Returns an error if it throws, otherwise null.
 *
 * In production, this is implemented using a try-catch. The reason we don't
 * use a try-catch directly is so that we can swap out a different
 * implementation in DEV mode.
 *
 * @param {String} name of the guard to use for logging or debugging
 * @param {Function} func The function to invoke
 * @param {*} context The context to use when calling the function
 * @param {...*} args Arguments for function
 */

function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {
  hasError = false;
  caughtError = null;
  invokeGuardedCallbackImpl.apply(reporter, arguments);
}
/**
 * Same as invokeGuardedCallback, but instead of returning an error, it stores
 * it in a global so it can be rethrown by `rethrowCaughtError` later.
 * TODO: See if caughtError and rethrowError can be unified.
 *
 * @param {String} name of the guard to use for logging or debugging
 * @param {Function} func The function to invoke
 * @param {*} context The context to use when calling the function
 * @param {...*} args Arguments for function
 */

function invokeGuardedCallbackAndCatchFirstError(
  name,
  func,
  context,
  a,
  b,
  c,
  d,
  e,
  f
) {
  invokeGuardedCallback.apply(this, arguments);

  if (hasError) {
    var error = clearCaughtError();

    if (!hasRethrowError) {
      hasRethrowError = true;
      rethrowError = error;
    }
  }
}
/**
 * During execution of guarded functions we will capture the first error which
 * we will rethrow to be handled by the top level error handler.
 */

function rethrowCaughtError() {
  if (hasRethrowError) {
    var error = rethrowError;
    hasRethrowError = false;
    rethrowError = null;
    throw error;
  }
}

function clearCaughtError() {
  if (hasError) {
    var error = caughtError;
    hasError = false;
    caughtError = null;
    return error;
  } else {
    (function() {
      {
        throw ReactError(
          Error(
            "clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();
  }
}

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var getFiberCurrentPropsFromNode = null;
var getInstanceFromNode = null;
var getNodeFromInstance = null;
function setComponentTree(
  getFiberCurrentPropsFromNodeImpl,
  getInstanceFromNodeImpl,
  getNodeFromInstanceImpl
) {
  getFiberCurrentPropsFromNode = getFiberCurrentPropsFromNodeImpl;
  getInstanceFromNode = getInstanceFromNodeImpl;
  getNodeFromInstance = getNodeFromInstanceImpl;
}
/**
 * Dispatch the event to the listener.
 * @param {SyntheticEvent} event SyntheticEvent to handle
 * @param {function} listener Application-level callback
 * @param {*} inst Internal component instance
 */

function executeDispatch(event, listener, inst) {
  var type = event.type || "unknown-event";
  event.currentTarget = getNodeFromInstance(inst);
  invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
  event.currentTarget = null;
}
/**
 * Standard/simple iteration through an event's collected dispatches.
 */

function executeDispatchesInOrder(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      } // Listeners and Instances are two parallel arrays that are always in sync.

      executeDispatch(event, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, dispatchListeners, dispatchInstances);
  }

  event._dispatchListeners = null;
  event._dispatchInstances = null;
}
/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return {?string} id of the first dispatch execution who's listener returns
 * true, or null if no listener returned true.
 */

function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;

  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      } // Listeners and Instances are two parallel arrays that are always in sync.

      if (dispatchListeners[i](event, dispatchInstances[i])) {
        return dispatchInstances[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchInstances)) {
      return dispatchInstances;
    }
  }

  return null;
}
/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */

function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchInstances = null;
  event._dispatchListeners = null;
  return ret;
}
/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */

function executeDirectDispatch(event) {
  var dispatchListener = event._dispatchListeners;
  var dispatchInstance = event._dispatchInstances;

  (function() {
    if (!!Array.isArray(dispatchListener)) {
      throw ReactError(Error("executeDirectDispatch(...): Invalid `event`."));
    }
  })();

  event.currentTarget = dispatchListener
    ? getNodeFromInstance(dispatchInstance)
    : null;
  var res = dispatchListener ? dispatchListener(event) : null;
  event.currentTarget = null;
  event._dispatchListeners = null;
  event._dispatchInstances = null;
  return res;
}
/**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */

function hasDispatches(event) {
  return !!event._dispatchListeners;
}

/**
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  (function() {
    if (!(next != null)) {
      throw ReactError(
        Error(
          "accumulateInto(...): Accumulated items must not be null or undefined."
        )
      );
    }
  })();

  if (current == null) {
    return next;
  } // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }

    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

/**
 * @param {array} arr an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 * @param {function} cb Callback invoked with each element or a collection.
 * @param {?} [scope] Scope used as `this` in a callback.
 */
function forEachAccumulated(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
}

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */

var eventQueue = null;
/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */

var executeDispatchesAndRelease = function(event) {
  if (event) {
    executeDispatchesInOrder(event);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};

var executeDispatchesAndReleaseTopLevel = function(e) {
  return executeDispatchesAndRelease(e);
};

function runEventsInBatch(events) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events);
  } // Set `eventQueue` to null before processing it so that we can tell if more
  // events get enqueued while processing.

  var processingEventQueue = eventQueue;
  eventQueue = null;

  if (!processingEventQueue) {
    return;
  }

  forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);

  (function() {
    if (!!eventQueue) {
      throw ReactError(
        Error(
          "processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented."
        )
      );
    }
  })(); // This would be a good time to rethrow if any of the event handlers threw.

  rethrowCaughtError();
}

function isInteractive(tag) {
  return (
    tag === "button" ||
    tag === "input" ||
    tag === "select" ||
    tag === "textarea"
  );
}

function shouldPreventMouseEvent(name, type, props) {
  switch (name) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
      return !!(props.disabled && isInteractive(type));

    default:
      return false;
  }
}
/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */

/**
 * Methods for injecting dependencies.
 */

var injection = {
  /**
   * @param {array} InjectedEventPluginOrder
   * @public
   */
  injectEventPluginOrder: injectEventPluginOrder,

  /**
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   */
  injectEventPluginsByName: injectEventPluginsByName
};
/**
 * @param {object} inst The instance, which is the source of events.
 * @param {string} registrationName Name of listener (e.g. `onClick`).
 * @return {?function} The stored callback.
 */

function getListener(inst, registrationName) {
  var listener; // TODO: shouldPreventMouseEvent is DOM-specific and definitely should not
  // live here; needs to be moved to a better place soon

  var stateNode = inst.stateNode;

  if (!stateNode) {
    // Work in progress (ex: onload events in incremental mode).
    return null;
  }

  var props = getFiberCurrentPropsFromNode(stateNode);

  if (!props) {
    // Work in progress.
    return null;
  }

  listener = props[registrationName];

  if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
    return null;
  }

  (function() {
    if (!(!listener || typeof listener === "function")) {
      throw ReactError(
        Error(
          "Expected `" +
            registrationName +
            "` listener to be a function, instead got a value of `" +
            typeof listener +
            "` type."
        )
      );
    }
  })();

  return listener;
}
/**
 * Allows registered plugins an opportunity to extract events from top-level
 * native browser events.
 *
 * @return {*} An accumulation of synthetic events.
 * @internal
 */

function extractPluginEvents(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var events = null;

  for (var i = 0; i < plugins.length; i++) {
    // Not every plugin in the ordering may be loaded at runtime.
    var possiblePlugin = plugins[i];

    if (possiblePlugin) {
      var extractedEvents = possiblePlugin.extractEvents(
        topLevelType,
        targetInst,
        nativeEvent,
        nativeEventTarget
      );

      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents);
      }
    }
  }

  return events;
}

function runExtractedPluginEventsInBatch(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var events = extractPluginEvents(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  );
  runEventsInBatch(events);
}

var FunctionComponent = 0;
var ClassComponent = 1;
var IndeterminateComponent = 2; // Before we know whether it is function or class

var HostRoot = 3; // Root of a host tree. Could be nested inside another node.

var HostPortal = 4; // A subtree. Could be an entry point to a different renderer.

var HostComponent = 5;
var HostText = 6;
var Fragment = 7;
var Mode = 8;
var ContextConsumer = 9;
var ContextProvider = 10;
var ForwardRef = 11;
var Profiler = 12;
var SuspenseComponent = 13;
var MemoComponent = 14;
var SimpleMemoComponent = 15;
var LazyComponent = 16;
var IncompleteClassComponent = 17;
var DehydratedFragment = 18;
var SuspenseListComponent = 19;
var FundamentalComponent = 20;

function getParent(inst) {
  do {
    inst = inst.return; // TODO: If this is a HostRoot we might want to bail out.
    // That is depending on if we want nested subtrees (layers) to bubble
    // events to their parent. We could also go through parentNode on the
    // host node but that wouldn't work for React Native and doesn't let us
    // do the portal feature.
  } while (inst && inst.tag !== HostComponent);

  if (inst) {
    return inst;
  }

  return null;
}
/**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */

function getLowestCommonAncestor(instA, instB) {
  var depthA = 0;

  for (var tempA = instA; tempA; tempA = getParent(tempA)) {
    depthA++;
  }

  var depthB = 0;

  for (var tempB = instB; tempB; tempB = getParent(tempB)) {
    depthB++;
  } // If A is deeper, crawl up.

  while (depthA - depthB > 0) {
    instA = getParent(instA);
    depthA--;
  } // If B is deeper, crawl up.

  while (depthB - depthA > 0) {
    instB = getParent(instB);
    depthB--;
  } // Walk in lockstep until we find a match.

  var depth = depthA;

  while (depth--) {
    if (instA === instB || instA === instB.alternate) {
      return instA;
    }

    instA = getParent(instA);
    instB = getParent(instB);
  }

  return null;
}
/**
 * Return if A is an ancestor of B.
 */

function isAncestor(instA, instB) {
  while (instB) {
    if (instA === instB || instA === instB.alternate) {
      return true;
    }

    instB = getParent(instB);
  }

  return false;
}
/**
 * Return the parent instance of the passed-in instance.
 */

function getParentInstance(inst) {
  return getParent(inst);
}
/**
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */

function traverseTwoPhase(inst, fn, arg) {
  var path = [];

  while (inst) {
    path.push(inst);
    inst = getParent(inst);
  }

  var i;

  for (i = path.length; i-- > 0; ) {
    fn(path[i], "captured", arg);
  }

  for (i = 0; i < path.length; i++) {
    fn(path[i], "bubbled", arg);
  }
}
/**
 * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
 * should would receive a `mouseEnter` or `mouseLeave` event.
 *
 * Does not invoke the callback on the nearest common ancestor because nothing
 * "entered" or "left" that element.
 */

/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
function listenerAtPhase(inst, event, propagationPhase) {
  var registrationName =
    event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(inst, registrationName);
}
/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing even a
 * single one.
 */

/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */

function accumulateDirectionalDispatches(inst, phase, event) {
  var listener = listenerAtPhase(inst, event, phase);

  if (listener) {
    event._dispatchListeners = accumulateInto(
      event._dispatchListeners,
      listener
    );
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}
/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We cannot perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */

function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
}
/**
 * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
 */

function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    var targetInst = event._targetInst;
    var parentInst = targetInst ? getParentInstance(targetInst) : null;
    traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
  }
}
/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */

function accumulateDispatches(inst, ignoredDirection, event) {
  if (inst && event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(inst, registrationName);

    if (listener) {
      event._dispatchListeners = accumulateInto(
        event._dispatchListeners,
        listener
      );
      event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
    }
  }
}
/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */

function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event._targetInst, null, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
}
function accumulateTwoPhaseDispatchesSkipTarget(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
}

function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}

/* eslint valid-typeof: 0 */
var EVENT_POOL_SIZE = 10;
/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var EventInterface = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: function() {
    return null;
  },
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

function functionThatReturnsTrue() {
  return true;
}

function functionThatReturnsFalse() {
  return false;
}
/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {*} targetInst Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @param {DOMEventTarget} nativeEventTarget Target node.
 */

function SyntheticEvent(
  dispatchConfig,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst;
  this.nativeEvent = nativeEvent;
  var Interface = this.constructor.Interface;

  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }

    var normalize = Interface[propName];

    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      if (propName === "target") {
        this.target = nativeEventTarget;
      } else {
        this[propName] = nativeEvent[propName];
      }
    }
  }

  var defaultPrevented =
    nativeEvent.defaultPrevented != null
      ? nativeEvent.defaultPrevented
      : nativeEvent.returnValue === false;

  if (defaultPrevented) {
    this.isDefaultPrevented = functionThatReturnsTrue;
  } else {
    this.isDefaultPrevented = functionThatReturnsFalse;
  }

  this.isPropagationStopped = functionThatReturnsFalse;
  return this;
}

Object.assign(SyntheticEvent.prototype, {
  preventDefault: function() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;

    if (!event) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    } else if (typeof event.returnValue !== "unknown") {
      event.returnValue = false;
    }

    this.isDefaultPrevented = functionThatReturnsTrue;
  },
  stopPropagation: function() {
    var event = this.nativeEvent;

    if (!event) {
      return;
    }

    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== "unknown") {
      // The ChangeEventPlugin registers a "propertychange" event for
      // IE. This event does not support bubbling or cancelling, and
      // any references to cancelBubble throw "Member not found".  A
      // typeof check of "unknown" circumvents this issue (and is also
      // IE specific).
      event.cancelBubble = true;
    }

    this.isPropagationStopped = functionThatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = functionThatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: functionThatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    var Interface = this.constructor.Interface;

    for (var propName in Interface) {
      {
        this[propName] = null;
      }
    }

    this.dispatchConfig = null;
    this._targetInst = null;
    this.nativeEvent = null;
    this.isDefaultPrevented = functionThatReturnsFalse;
    this.isPropagationStopped = functionThatReturnsFalse;
    this._dispatchListeners = null;
    this._dispatchInstances = null;
  }
});
SyntheticEvent.Interface = EventInterface;
/**
 * Helper to reduce boilerplate when creating subclasses.
 */

SyntheticEvent.extend = function(Interface) {
  var Super = this;

  var E = function() {};

  E.prototype = Super.prototype;
  var prototype = new E();

  function Class() {
    return Super.apply(this, arguments);
  }

  Object.assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  Class.Interface = Object.assign({}, Super.Interface, Interface);
  Class.extend = Super.extend;
  addEventPoolingTo(Class);
  return Class;
};

addEventPoolingTo(SyntheticEvent);
function getPooledEvent(dispatchConfig, targetInst, nativeEvent, nativeInst) {
  var EventConstructor = this;

  if (EventConstructor.eventPool.length) {
    var instance = EventConstructor.eventPool.pop();
    EventConstructor.call(
      instance,
      dispatchConfig,
      targetInst,
      nativeEvent,
      nativeInst
    );
    return instance;
  }

  return new EventConstructor(
    dispatchConfig,
    targetInst,
    nativeEvent,
    nativeInst
  );
}

function releasePooledEvent(event) {
  var EventConstructor = this;

  (function() {
    if (!(event instanceof EventConstructor)) {
      throw ReactError(
        Error(
          "Trying to release an event instance into a pool of a different type."
        )
      );
    }
  })();

  event.destructor();

  if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
    EventConstructor.eventPool.push(event);
  }
}

function addEventPoolingTo(EventConstructor) {
  EventConstructor.eventPool = [];
  EventConstructor.getPooled = getPooledEvent;
  EventConstructor.release = releasePooledEvent;
}

/**
 * `touchHistory` isn't actually on the native event, but putting it in the
 * interface will ensure that it is cleaned up when pooled/destroyed. The
 * `ResponderEventPlugin` will populate it appropriately.
 */

var ResponderSyntheticEvent = SyntheticEvent.extend({
  touchHistory: function(nativeEvent) {
    return null; // Actually doesn't even look at the native event.
  }
});

var TOP_TOUCH_START = "topTouchStart";
var TOP_TOUCH_MOVE = "topTouchMove";
var TOP_TOUCH_END = "topTouchEnd";
var TOP_TOUCH_CANCEL = "topTouchCancel";
var TOP_SCROLL = "topScroll";
var TOP_SELECTION_CHANGE = "topSelectionChange";
function isStartish(topLevelType) {
  return topLevelType === TOP_TOUCH_START;
}
function isMoveish(topLevelType) {
  return topLevelType === TOP_TOUCH_MOVE;
}
function isEndish(topLevelType) {
  return topLevelType === TOP_TOUCH_END || topLevelType === TOP_TOUCH_CANCEL;
}
var startDependencies = [TOP_TOUCH_START];
var moveDependencies = [TOP_TOUCH_MOVE];
var endDependencies = [TOP_TOUCH_CANCEL, TOP_TOUCH_END];

/**
 * Tracks the position and time of each active touch by `touch.identifier`. We
 * should typically only see IDs in the range of 1-20 because IDs get recycled
 * when touches end and start again.
 */

var MAX_TOUCH_BANK = 20;
var touchBank = [];
var touchHistory = {
  touchBank: touchBank,
  numberActiveTouches: 0,
  // If there is only one active touch, we remember its location. This prevents
  // us having to loop through all of the touches all the time in the most
  // common case.
  indexOfSingleActiveTouch: -1,
  mostRecentTimeStamp: 0
};

function timestampForTouch(touch) {
  // The legacy internal implementation provides "timeStamp", which has been
  // renamed to "timestamp". Let both work for now while we iron it out
  // TODO (evv): rename timeStamp to timestamp in internal code
  return touch.timeStamp || touch.timestamp;
}
/**
 * TODO: Instead of making gestures recompute filtered velocity, we could
 * include a built in velocity computation that can be reused globally.
 */

function createTouchRecord(touch) {
  return {
    touchActive: true,
    startPageX: touch.pageX,
    startPageY: touch.pageY,
    startTimeStamp: timestampForTouch(touch),
    currentPageX: touch.pageX,
    currentPageY: touch.pageY,
    currentTimeStamp: timestampForTouch(touch),
    previousPageX: touch.pageX,
    previousPageY: touch.pageY,
    previousTimeStamp: timestampForTouch(touch)
  };
}

function resetTouchRecord(touchRecord, touch) {
  touchRecord.touchActive = true;
  touchRecord.startPageX = touch.pageX;
  touchRecord.startPageY = touch.pageY;
  touchRecord.startTimeStamp = timestampForTouch(touch);
  touchRecord.currentPageX = touch.pageX;
  touchRecord.currentPageY = touch.pageY;
  touchRecord.currentTimeStamp = timestampForTouch(touch);
  touchRecord.previousPageX = touch.pageX;
  touchRecord.previousPageY = touch.pageY;
  touchRecord.previousTimeStamp = timestampForTouch(touch);
}

function getTouchIdentifier(_ref) {
  var identifier = _ref.identifier;

  (function() {
    if (!(identifier != null)) {
      throw ReactError(Error("Touch object is missing identifier."));
    }
  })();

  return identifier;
}

function recordTouchStart(touch) {
  var identifier = getTouchIdentifier(touch);
  var touchRecord = touchBank[identifier];

  if (touchRecord) {
    resetTouchRecord(touchRecord, touch);
  } else {
    touchBank[identifier] = createTouchRecord(touch);
  }

  touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
}

function recordTouchMove(touch) {
  var touchRecord = touchBank[getTouchIdentifier(touch)];

  if (touchRecord) {
    touchRecord.touchActive = true;
    touchRecord.previousPageX = touchRecord.currentPageX;
    touchRecord.previousPageY = touchRecord.currentPageY;
    touchRecord.previousTimeStamp = touchRecord.currentTimeStamp;
    touchRecord.currentPageX = touch.pageX;
    touchRecord.currentPageY = touch.pageY;
    touchRecord.currentTimeStamp = timestampForTouch(touch);
    touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
  } else {
    console.warn(
      "Cannot record touch move without a touch start.\n" + "Touch Move: %s\n",
      "Touch Bank: %s",
      printTouch(touch),
      printTouchBank()
    );
  }
}

function recordTouchEnd(touch) {
  var touchRecord = touchBank[getTouchIdentifier(touch)];

  if (touchRecord) {
    touchRecord.touchActive = false;
    touchRecord.previousPageX = touchRecord.currentPageX;
    touchRecord.previousPageY = touchRecord.currentPageY;
    touchRecord.previousTimeStamp = touchRecord.currentTimeStamp;
    touchRecord.currentPageX = touch.pageX;
    touchRecord.currentPageY = touch.pageY;
    touchRecord.currentTimeStamp = timestampForTouch(touch);
    touchHistory.mostRecentTimeStamp = timestampForTouch(touch);
  } else {
    console.warn(
      "Cannot record touch end without a touch start.\n" + "Touch End: %s\n",
      "Touch Bank: %s",
      printTouch(touch),
      printTouchBank()
    );
  }
}

function printTouch(touch) {
  return JSON.stringify({
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    timestamp: timestampForTouch(touch)
  });
}

function printTouchBank() {
  var printed = JSON.stringify(touchBank.slice(0, MAX_TOUCH_BANK));

  if (touchBank.length > MAX_TOUCH_BANK) {
    printed += " (original size: " + touchBank.length + ")";
  }

  return printed;
}

var ResponderTouchHistoryStore = {
  recordTouchTrack: function(topLevelType, nativeEvent) {
    if (isMoveish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordTouchMove);
    } else if (isStartish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordTouchStart);
      touchHistory.numberActiveTouches = nativeEvent.touches.length;

      if (touchHistory.numberActiveTouches === 1) {
        touchHistory.indexOfSingleActiveTouch =
          nativeEvent.touches[0].identifier;
      }
    } else if (isEndish(topLevelType)) {
      nativeEvent.changedTouches.forEach(recordTouchEnd);
      touchHistory.numberActiveTouches = nativeEvent.touches.length;

      if (touchHistory.numberActiveTouches === 1) {
        for (var i = 0; i < touchBank.length; i++) {
          var touchTrackToCheck = touchBank[i];

          if (touchTrackToCheck != null && touchTrackToCheck.touchActive) {
            touchHistory.indexOfSingleActiveTouch = i;
            break;
          }
        }
      }
    }
  },
  touchHistory: touchHistory
};

/**
 * Accumulates items that must not be null or undefined.
 *
 * This is used to conserve memory by avoiding array allocations.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulate(current, next) {
  (function() {
    if (!(next != null)) {
      throw ReactError(
        Error(
          "accumulate(...): Accumulated items must not be null or undefined."
        )
      );
    }
  })();

  if (current == null) {
    return next;
  } // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).

  if (Array.isArray(current)) {
    return current.concat(next);
  }

  if (Array.isArray(next)) {
    return [current].concat(next);
  }

  return [current, next];
}

/**
 * Instance of element that should respond to touch/move types of interactions,
 * as indicated explicitly by relevant callbacks.
 */

var responderInst = null;
/**
 * Count of current touches. A textInput should become responder iff the
 * selection changes while there is a touch on the screen.
 */

var trackedTouchCount = 0;

var changeResponder = function(nextResponderInst, blockHostResponder) {
  var oldResponderInst = responderInst;
  responderInst = nextResponderInst;

  if (ResponderEventPlugin.GlobalResponderHandler !== null) {
    ResponderEventPlugin.GlobalResponderHandler.onChange(
      oldResponderInst,
      nextResponderInst,
      blockHostResponder
    );
  }
};

var eventTypes = {
  /**
   * On a `touchStart`/`mouseDown`, is it desired that this element become the
   * responder?
   */
  startShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onStartShouldSetResponder",
      captured: "onStartShouldSetResponderCapture"
    },
    dependencies: startDependencies
  },

  /**
   * On a `scroll`, is it desired that this element become the responder? This
   * is usually not needed, but should be used to retroactively infer that a
   * `touchStart` had occurred during momentum scroll. During a momentum scroll,
   * a touch start will be immediately followed by a scroll event if the view is
   * currently scrolling.
   *
   * TODO: This shouldn't bubble.
   */
  scrollShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onScrollShouldSetResponder",
      captured: "onScrollShouldSetResponderCapture"
    },
    dependencies: [TOP_SCROLL]
  },

  /**
   * On text selection change, should this element become the responder? This
   * is needed for text inputs or other views with native selection, so the
   * JS view can claim the responder.
   *
   * TODO: This shouldn't bubble.
   */
  selectionChangeShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onSelectionChangeShouldSetResponder",
      captured: "onSelectionChangeShouldSetResponderCapture"
    },
    dependencies: [TOP_SELECTION_CHANGE]
  },

  /**
   * On a `touchMove`/`mouseMove`, is it desired that this element become the
   * responder?
   */
  moveShouldSetResponder: {
    phasedRegistrationNames: {
      bubbled: "onMoveShouldSetResponder",
      captured: "onMoveShouldSetResponderCapture"
    },
    dependencies: moveDependencies
  },

  /**
   * Direct responder events dispatched directly to responder. Do not bubble.
   */
  responderStart: {
    registrationName: "onResponderStart",
    dependencies: startDependencies
  },
  responderMove: {
    registrationName: "onResponderMove",
    dependencies: moveDependencies
  },
  responderEnd: {
    registrationName: "onResponderEnd",
    dependencies: endDependencies
  },
  responderRelease: {
    registrationName: "onResponderRelease",
    dependencies: endDependencies
  },
  responderTerminationRequest: {
    registrationName: "onResponderTerminationRequest",
    dependencies: []
  },
  responderGrant: {
    registrationName: "onResponderGrant",
    dependencies: []
  },
  responderReject: {
    registrationName: "onResponderReject",
    dependencies: []
  },
  responderTerminate: {
    registrationName: "onResponderTerminate",
    dependencies: []
  }
};
/**
 *
 * Responder System:
 * ----------------
 *
 * - A global, solitary "interaction lock" on a view.
 * - If a node becomes the responder, it should convey visual feedback
 *   immediately to indicate so, either by highlighting or moving accordingly.
 * - To be the responder means, that touches are exclusively important to that
 *   responder view, and no other view.
 * - While touches are still occurring, the responder lock can be transferred to
 *   a new view, but only to increasingly "higher" views (meaning ancestors of
 *   the current responder).
 *
 * Responder being granted:
 * ------------------------
 *
 * - Touch starts, moves, and scrolls can cause an ID to become the responder.
 * - We capture/bubble `startShouldSetResponder`/`moveShouldSetResponder` to
 *   the "appropriate place".
 * - If nothing is currently the responder, the "appropriate place" is the
 *   initiating event's `targetID`.
 * - If something *is* already the responder, the "appropriate place" is the
 *   first common ancestor of the event target and the current `responderInst`.
 * - Some negotiation happens: See the timing diagram below.
 * - Scrolled views automatically become responder. The reasoning is that a
 *   platform scroll view that isn't built on top of the responder system has
 *   began scrolling, and the active responder must now be notified that the
 *   interaction is no longer locked to it - the system has taken over.
 *
 * - Responder being released:
 *   As soon as no more touches that *started* inside of descendants of the
 *   *current* responderInst, an `onResponderRelease` event is dispatched to the
 *   current responder, and the responder lock is released.
 *
 * TODO:
 * - on "end", a callback hook for `onResponderEndShouldRemainResponder` that
 *   determines if the responder lock should remain.
 * - If a view shouldn't "remain" the responder, any active touches should by
 *   default be considered "dead" and do not influence future negotiations or
 *   bubble paths. It should be as if those touches do not exist.
 * -- For multitouch: Usually a translate-z will choose to "remain" responder
 *  after one out of many touches ended. For translate-y, usually the view
 *  doesn't wish to "remain" responder after one of many touches end.
 * - Consider building this on top of a `stopPropagation` model similar to
 *   `W3C` events.
 * - Ensure that `onResponderTerminate` is called on touch cancels, whether or
 *   not `onResponderTerminationRequest` returns `true` or `false`.
 *
 */

/*                                             Negotiation Performed
                                             +-----------------------+
                                            /                         \
Process low level events to    +     Current Responder      +   wantsResponderID
determine who to perform negot-|   (if any exists at all)   |
iation/transition              | Otherwise just pass through|
-------------------------------+----------------------------+------------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchStart|           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onStartShouldSetResponder|----->|onResponderStart (cur)  |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderReject
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderStart|
                               |                            | +----------------+
Bubble to find first ID        |                            |
to return true:wantsResponderID|                            |
                               |                            |
     +-------------+           |                            |
     | onTouchMove |           |                            |
     +------+------+     none  |                            |
            |            return|                            |
+-----------v-------------+true| +------------------------+ |
|onMoveShouldSetResponder |----->|onResponderMove (cur)   |<-----------+
+-----------+-------------+    | +------------------------+ |          |
            |                  |                            | +--------+-------+
            | returned true for|       false:REJECT +-------->|onResponderRejec|
            | wantsResponderID |                    |       | +----------------+
            | (now attempt     | +------------------+-----+ |
            |  handoff)        | |   onResponder          | |
            +------------------->|      TerminationRequest| |
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |         true:GRANT +-------->|onResponderGrant|
                               |                            | +--------+-------+
                               | +------------------------+ |          |
                               | |   onResponderTerminate |<-----------+
                               | +------------------+-----+ |
                               |                    |       | +----------------+
                               |                    +-------->|onResponderMove |
                               |                            | +----------------+
                               |                            |
                               |                            |
      Some active touch started|                            |
      inside current responder | +------------------------+ |
      +------------------------->|      onResponderEnd    | |
      |                        | +------------------------+ |
  +---+---------+              |                            |
  | onTouchEnd  |              |                            |
  +---+---------+              |                            |
      |                        | +------------------------+ |
      +------------------------->|     onResponderEnd     | |
      No active touches started| +-----------+------------+ |
      inside current responder |             |              |
                               |             v              |
                               | +------------------------+ |
                               | |    onResponderRelease  | |
                               | +------------------------+ |
                               |                            |
                               +                            + */

/**
 * A note about event ordering in the `EventPluginHub`.
 *
 * Suppose plugins are injected in the following order:
 *
 * `[R, S, C]`
 *
 * To help illustrate the example, assume `S` is `SimpleEventPlugin` (for
 * `onClick` etc) and `R` is `ResponderEventPlugin`.
 *
 * "Deferred-Dispatched Events":
 *
 * - The current event plugin system will traverse the list of injected plugins,
 *   in order, and extract events by collecting the plugin's return value of
 *   `extractEvents()`.
 * - These events that are returned from `extractEvents` are "deferred
 *   dispatched events".
 * - When returned from `extractEvents`, deferred-dispatched events contain an
 *   "accumulation" of deferred dispatches.
 * - These deferred dispatches are accumulated/collected before they are
 *   returned, but processed at a later time by the `EventPluginHub` (hence the
 *   name deferred).
 *
 * In the process of returning their deferred-dispatched events, event plugins
 * themselves can dispatch events on-demand without returning them from
 * `extractEvents`. Plugins might want to do this, so that they can use event
 * dispatching as a tool that helps them decide which events should be extracted
 * in the first place.
 *
 * "On-Demand-Dispatched Events":
 *
 * - On-demand-dispatched events are not returned from `extractEvents`.
 * - On-demand-dispatched events are dispatched during the process of returning
 *   the deferred-dispatched events.
 * - They should not have side effects.
 * - They should be avoided, and/or eventually be replaced with another
 *   abstraction that allows event plugins to perform multiple "rounds" of event
 *   extraction.
 *
 * Therefore, the sequence of event dispatches becomes:
 *
 * - `R`s on-demand events (if any)   (dispatched by `R` on-demand)
 * - `S`s on-demand events (if any)   (dispatched by `S` on-demand)
 * - `C`s on-demand events (if any)   (dispatched by `C` on-demand)
 * - `R`s extracted events (if any)   (dispatched by `EventPluginHub`)
 * - `S`s extracted events (if any)   (dispatched by `EventPluginHub`)
 * - `C`s extracted events (if any)   (dispatched by `EventPluginHub`)
 *
 * In the case of `ResponderEventPlugin`: If the `startShouldSetResponder`
 * on-demand dispatch returns `true` (and some other details are satisfied) the
 * `onResponderGrant` deferred dispatched event is returned from
 * `extractEvents`. The sequence of dispatch executions in this case
 * will appear as follows:
 *
 * - `startShouldSetResponder` (`ResponderEventPlugin` dispatches on-demand)
 * - `touchStartCapture`       (`EventPluginHub` dispatches as usual)
 * - `touchStart`              (`EventPluginHub` dispatches as usual)
 * - `responderGrant/Reject`   (`EventPluginHub` dispatches as usual)
 */

function setResponderAndExtractTransfer(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var shouldSetEventType = isStartish(topLevelType)
    ? eventTypes.startShouldSetResponder
    : isMoveish(topLevelType)
      ? eventTypes.moveShouldSetResponder
      : topLevelType === TOP_SELECTION_CHANGE
        ? eventTypes.selectionChangeShouldSetResponder
        : eventTypes.scrollShouldSetResponder; // TODO: stop one short of the current responder.

  var bubbleShouldSetFrom = !responderInst
    ? targetInst
    : getLowestCommonAncestor(responderInst, targetInst); // When capturing/bubbling the "shouldSet" event, we want to skip the target
  // (deepest ID) if it happens to be the current responder. The reasoning:
  // It's strange to get an `onMoveShouldSetResponder` when you're *already*
  // the responder.

  var skipOverBubbleShouldSetFrom = bubbleShouldSetFrom === responderInst;
  var shouldSetEvent = ResponderSyntheticEvent.getPooled(
    shouldSetEventType,
    bubbleShouldSetFrom,
    nativeEvent,
    nativeEventTarget
  );
  shouldSetEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;

  if (skipOverBubbleShouldSetFrom) {
    accumulateTwoPhaseDispatchesSkipTarget(shouldSetEvent);
  } else {
    accumulateTwoPhaseDispatches(shouldSetEvent);
  }

  var wantsResponderInst = executeDispatchesInOrderStopAtTrue(shouldSetEvent);

  if (!shouldSetEvent.isPersistent()) {
    shouldSetEvent.constructor.release(shouldSetEvent);
  }

  if (!wantsResponderInst || wantsResponderInst === responderInst) {
    return null;
  }

  var extracted;
  var grantEvent = ResponderSyntheticEvent.getPooled(
    eventTypes.responderGrant,
    wantsResponderInst,
    nativeEvent,
    nativeEventTarget
  );
  grantEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
  accumulateDirectDispatches(grantEvent);
  var blockHostResponder = executeDirectDispatch(grantEvent) === true;

  if (responderInst) {
    var terminationRequestEvent = ResponderSyntheticEvent.getPooled(
      eventTypes.responderTerminationRequest,
      responderInst,
      nativeEvent,
      nativeEventTarget
    );
    terminationRequestEvent.touchHistory =
      ResponderTouchHistoryStore.touchHistory;
    accumulateDirectDispatches(terminationRequestEvent);
    var shouldSwitch =
      !hasDispatches(terminationRequestEvent) ||
      executeDirectDispatch(terminationRequestEvent);

    if (!terminationRequestEvent.isPersistent()) {
      terminationRequestEvent.constructor.release(terminationRequestEvent);
    }

    if (shouldSwitch) {
      var terminateEvent = ResponderSyntheticEvent.getPooled(
        eventTypes.responderTerminate,
        responderInst,
        nativeEvent,
        nativeEventTarget
      );
      terminateEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(terminateEvent);
      extracted = accumulate(extracted, [grantEvent, terminateEvent]);
      changeResponder(wantsResponderInst, blockHostResponder);
    } else {
      var rejectEvent = ResponderSyntheticEvent.getPooled(
        eventTypes.responderReject,
        wantsResponderInst,
        nativeEvent,
        nativeEventTarget
      );
      rejectEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(rejectEvent);
      extracted = accumulate(extracted, rejectEvent);
    }
  } else {
    extracted = accumulate(extracted, grantEvent);
    changeResponder(wantsResponderInst, blockHostResponder);
  }

  return extracted;
}
/**
 * A transfer is a negotiation between a currently set responder and the next
 * element to claim responder status. Any start event could trigger a transfer
 * of responderInst. Any move event could trigger a transfer.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @return {boolean} True if a transfer of responder could possibly occur.
 */

function canTriggerTransfer(topLevelType, topLevelInst, nativeEvent) {
  return (
    topLevelInst && // responderIgnoreScroll: We are trying to migrate away from specifically
    // tracking native scroll events here and responderIgnoreScroll indicates we
    // will send topTouchCancel to handle canceling touch events instead
    ((topLevelType === TOP_SCROLL && !nativeEvent.responderIgnoreScroll) ||
      (trackedTouchCount > 0 && topLevelType === TOP_SELECTION_CHANGE) ||
      isStartish(topLevelType) ||
      isMoveish(topLevelType))
  );
}
/**
 * Returns whether or not this touch end event makes it such that there are no
 * longer any touches that started inside of the current `responderInst`.
 *
 * @param {NativeEvent} nativeEvent Native touch end event.
 * @return {boolean} Whether or not this touch end event ends the responder.
 */

function noResponderTouches(nativeEvent) {
  var touches = nativeEvent.touches;

  if (!touches || touches.length === 0) {
    return true;
  }

  for (var i = 0; i < touches.length; i++) {
    var activeTouch = touches[i];
    var target = activeTouch.target;

    if (target !== null && target !== undefined && target !== 0) {
      // Is the original touch location inside of the current responder?
      var targetInst = getInstanceFromNode(target);

      if (isAncestor(responderInst, targetInst)) {
        return false;
      }
    }
  }

  return true;
}

var ResponderEventPlugin = {
  /* For unit testing only */
  _getResponder: function() {
    return responderInst;
  },
  eventTypes: eventTypes,

  /**
   * We must be resilient to `targetInst` being `null` on `touchMove` or
   * `touchEnd`. On certain platforms, this means that a native scroll has
   * assumed control and the original touch targets are destroyed.
   */
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    if (isStartish(topLevelType)) {
      trackedTouchCount += 1;
    } else if (isEndish(topLevelType)) {
      if (trackedTouchCount >= 0) {
        trackedTouchCount -= 1;
      } else {
        console.error(
          "Ended a touch event which was not counted in `trackedTouchCount`."
        );
        return null;
      }
    }

    ResponderTouchHistoryStore.recordTouchTrack(topLevelType, nativeEvent);
    var extracted = canTriggerTransfer(topLevelType, targetInst, nativeEvent)
      ? setResponderAndExtractTransfer(
          topLevelType,
          targetInst,
          nativeEvent,
          nativeEventTarget
        )
      : null; // Responder may or may not have transferred on a new touch start/move.
    // Regardless, whoever is the responder after any potential transfer, we
    // direct all touch start/move/ends to them in the form of
    // `onResponderMove/Start/End`. These will be called for *every* additional
    // finger that move/start/end, dispatched directly to whoever is the
    // current responder at that moment, until the responder is "released".
    //
    // These multiple individual change touch events are are always bookended
    // by `onResponderGrant`, and one of
    // (`onResponderRelease/onResponderTerminate`).

    var isResponderTouchStart = responderInst && isStartish(topLevelType);
    var isResponderTouchMove = responderInst && isMoveish(topLevelType);
    var isResponderTouchEnd = responderInst && isEndish(topLevelType);
    var incrementalTouch = isResponderTouchStart
      ? eventTypes.responderStart
      : isResponderTouchMove
        ? eventTypes.responderMove
        : isResponderTouchEnd
          ? eventTypes.responderEnd
          : null;

    if (incrementalTouch) {
      var gesture = ResponderSyntheticEvent.getPooled(
        incrementalTouch,
        responderInst,
        nativeEvent,
        nativeEventTarget
      );
      gesture.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(gesture);
      extracted = accumulate(extracted, gesture);
    }

    var isResponderTerminate =
      responderInst && topLevelType === TOP_TOUCH_CANCEL;
    var isResponderRelease =
      responderInst &&
      !isResponderTerminate &&
      isEndish(topLevelType) &&
      noResponderTouches(nativeEvent);
    var finalTouch = isResponderTerminate
      ? eventTypes.responderTerminate
      : isResponderRelease
        ? eventTypes.responderRelease
        : null;

    if (finalTouch) {
      var finalEvent = ResponderSyntheticEvent.getPooled(
        finalTouch,
        responderInst,
        nativeEvent,
        nativeEventTarget
      );
      finalEvent.touchHistory = ResponderTouchHistoryStore.touchHistory;
      accumulateDirectDispatches(finalEvent);
      extracted = accumulate(extracted, finalEvent);
      changeResponder(null);
    }

    return extracted;
  },
  GlobalResponderHandler: null,
  injection: {
    /**
     * @param {{onChange: (ReactID, ReactID) => void} GlobalResponderHandler
     * Object that handles any change in responder. Use this to inject
     * integration with an existing touch handling system etc.
     */
    injectGlobalResponderHandler: function(GlobalResponderHandler) {
      ResponderEventPlugin.GlobalResponderHandler = GlobalResponderHandler;
    }
  }
};

var customBubblingEventTypes =
  ReactNativePrivateInterface.ReactNativeViewConfigRegistry
    .customBubblingEventTypes;
var customDirectEventTypes =
  ReactNativePrivateInterface.ReactNativeViewConfigRegistry
    .customDirectEventTypes;
var ReactNativeBridgeEventPlugin = {
  eventTypes: {},

  /**
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    if (targetInst == null) {
      // Probably a node belonging to another renderer's tree.
      return null;
    }

    var bubbleDispatchConfig = customBubblingEventTypes[topLevelType];
    var directDispatchConfig = customDirectEventTypes[topLevelType];

    (function() {
      if (!(bubbleDispatchConfig || directDispatchConfig)) {
        throw ReactError(
          Error(
            'Unsupported top level event type "' + topLevelType + '" dispatched'
          )
        );
      }
    })();

    var event = SyntheticEvent.getPooled(
      bubbleDispatchConfig || directDispatchConfig,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );

    if (bubbleDispatchConfig) {
      accumulateTwoPhaseDispatches(event);
    } else if (directDispatchConfig) {
      accumulateDirectDispatches(event);
    } else {
      return null;
    }

    return event;
  }
};

var ReactNativeEventPluginOrder = [
  "ResponderEventPlugin",
  "ReactNativeBridgeEventPlugin"
];

/**
 * Make sure essential globals are available and are patched correctly. Please don't remove this
 * line. Bundles created by react-packager `require` it before executing any application code. This
 * ensures it exists in the dependency graph and can be `require`d.
 * TODO: require this in packager, not in React #10932517
 */
// Module provided by RN:
/**
 * Inject module for resolving DOM hierarchy and plugin ordering.
 */

injection.injectEventPluginOrder(ReactNativeEventPluginOrder);
/**
 * Some important event plugins included by default (without having to require
 * them).
 */

injection.injectEventPluginsByName({
  ResponderEventPlugin: ResponderEventPlugin,
  ReactNativeBridgeEventPlugin: ReactNativeBridgeEventPlugin
});

var instanceCache = new Map();
var instanceProps = new Map();
function precacheFiberNode(hostInst, tag) {
  instanceCache.set(tag, hostInst);
}
function uncacheFiberNode(tag) {
  instanceCache.delete(tag);
  instanceProps.delete(tag);
}

function getInstanceFromTag(tag) {
  return instanceCache.get(tag) || null;
}

function getTagFromInstance(inst) {
  var tag = inst.stateNode._nativeTag;

  if (tag === undefined) {
    tag = inst.stateNode.canonical._nativeTag;
  }

  (function() {
    if (!tag) {
      throw ReactError(Error("All native instances should have a tag."));
    }
  })();

  return tag;
}

function getFiberCurrentPropsFromNode$1(stateNode) {
  return instanceProps.get(stateNode._nativeTag) || null;
}
function updateFiberProps(tag, props) {
  instanceProps.set(tag, props);
}

var restoreImpl = null;
var restoreTarget = null;
var restoreQueue = null;

function restoreStateOfTarget(target) {
  // We perform this translation at the end of the event loop so that we
  // always receive the correct fiber here
  var internalInstance = getInstanceFromNode(target);

  if (!internalInstance) {
    // Unmounted
    return;
  }

  (function() {
    if (!(typeof restoreImpl === "function")) {
      throw ReactError(
        Error(
          "setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();

  var props = getFiberCurrentPropsFromNode(internalInstance.stateNode);
  restoreImpl(internalInstance.stateNode, internalInstance.type, props);
}

function needsStateRestore() {
  return restoreTarget !== null || restoreQueue !== null;
}
function restoreStateIfNeeded() {
  if (!restoreTarget) {
    return;
  }

  var target = restoreTarget;
  var queuedTargets = restoreQueue;
  restoreTarget = null;
  restoreQueue = null;
  restoreStateOfTarget(target);

  if (queuedTargets) {
    for (var i = 0; i < queuedTargets.length; i++) {
      restoreStateOfTarget(queuedTargets[i]);
    }
  }
}

var enableUserTimingAPI = false;
var replayFailedUnitOfWorkWithInvokeGuardedCallback = false;

var enableProfilerTimer = false;
var enableSchedulerTracing = false;
var enableSuspenseServerRenderer = false;

var enableFlareAPI = false;
var enableFundamentalAPI = false;

var flushSuspenseFallbacksInTests = true;

var enableSuspenseCallback = false;

var disableLegacyContext = false;
var disableSchedulerTimeoutBasedOnReactExpirationTime = false; // Only used in www builds.

// Flow magic to verify the exports of this file match the original version.

// the renderer. Such as when we're dispatching events or if third party
// libraries need to call batchedUpdates. Eventually, this API will go away when
// everything is batched by default. We'll then have a similar API to opt-out of
// scheduled work and instead do synchronous work.
// Defaults

var batchedUpdatesImpl = function(fn, bookkeeping) {
  return fn(bookkeeping);
};

var flushDiscreteUpdatesImpl = function() {};

var isInsideEventHandler = false;
function finishEventHandler() {
  // Here we wait until all updates have propagated, which is important
  // when using controlled components within layers:
  // https://github.com/facebook/react/issues/1698
  // Then we restore state of any controlled component.
  var controlledComponentsHavePendingUpdates = needsStateRestore();

  if (controlledComponentsHavePendingUpdates) {
    // If a controlled event was fired, we may need to restore the state of
    // the DOM node back to the controlled value. This is necessary when React
    // bails out of the update without touching the DOM.
    flushDiscreteUpdatesImpl();
    restoreStateIfNeeded();
  }
}

function batchedUpdates(fn, bookkeeping) {
  if (isInsideEventHandler) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state.
    return fn(bookkeeping);
  }

  isInsideEventHandler = true;

  try {
    return batchedUpdatesImpl(fn, bookkeeping);
  } finally {
    isInsideEventHandler = false;
    finishEventHandler();
  }
}

function setBatchingImplementation(
  _batchedUpdatesImpl,
  _discreteUpdatesImpl,
  _flushDiscreteUpdatesImpl,
  _batchedEventUpdatesImpl
) {
  batchedUpdatesImpl = _batchedUpdatesImpl;
  flushDiscreteUpdatesImpl = _flushDiscreteUpdatesImpl;
}

/**
 * Version of `ReactBrowserEventEmitter` that works on the receiving side of a
 * serialized worker boundary.
 */
// Shared default empty native event - conserve memory.

var EMPTY_NATIVE_EVENT = {};
/**
 * Selects a subsequence of `Touch`es, without destroying `touches`.
 *
 * @param {Array<Touch>} touches Deserialized touch objects.
 * @param {Array<number>} indices Indices by which to pull subsequence.
 * @return {Array<Touch>} Subsequence of touch objects.
 */

var touchSubsequence = function(touches, indices) {
  var ret = [];

  for (var i = 0; i < indices.length; i++) {
    ret.push(touches[indices[i]]);
  }

  return ret;
};
/**
 * TODO: Pool all of this.
 *
 * Destroys `touches` by removing touch objects at indices `indices`. This is
 * to maintain compatibility with W3C touch "end" events, where the active
 * touches don't include the set that has just been "ended".
 *
 * @param {Array<Touch>} touches Deserialized touch objects.
 * @param {Array<number>} indices Indices to remove from `touches`.
 * @return {Array<Touch>} Subsequence of removed touch objects.
 */

var removeTouchesAtIndices = function(touches, indices) {
  var rippedOut = []; // use an unsafe downcast to alias to nullable elements,
  // so we can delete and then compact.

  var temp = touches;

  for (var i = 0; i < indices.length; i++) {
    var index = indices[i];
    rippedOut.push(touches[index]);
    temp[index] = null;
  }

  var fillAt = 0;

  for (var j = 0; j < temp.length; j++) {
    var cur = temp[j];

    if (cur !== null) {
      temp[fillAt++] = cur;
    }
  }

  temp.length = fillAt;
  return rippedOut;
};
/**
 * Internal version of `receiveEvent` in terms of normalized (non-tag)
 * `rootNodeID`.
 *
 * @see receiveEvent.
 *
 * @param {rootNodeID} rootNodeID React root node ID that event occurred on.
 * @param {TopLevelType} topLevelType Top level type of event.
 * @param {?object} nativeEventParam Object passed from native.
 */

function _receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam) {
  var nativeEvent = nativeEventParam || EMPTY_NATIVE_EVENT;
  var inst = getInstanceFromTag(rootNodeID);
  batchedUpdates(function() {
    runExtractedPluginEventsInBatch(
      topLevelType,
      inst,
      nativeEvent,
      nativeEvent.target
    );
  }); // React Native doesn't use ReactControlledComponent but if it did, here's
  // where it would do it.
}
/**
 * Publicly exposed method on module for native objc to invoke when a top
 * level event is extracted.
 * @param {rootNodeID} rootNodeID React root node ID that event occurred on.
 * @param {TopLevelType} topLevelType Top level type of event.
 * @param {object} nativeEventParam Object passed from native.
 */

function receiveEvent(rootNodeID, topLevelType, nativeEventParam) {
  _receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam);
}
/**
 * Simple multi-wrapper around `receiveEvent` that is intended to receive an
 * efficient representation of `Touch` objects, and other information that
 * can be used to construct W3C compliant `Event` and `Touch` lists.
 *
 * This may create dispatch behavior that differs than web touch handling. We
 * loop through each of the changed touches and receive it as a single event.
 * So two `touchStart`/`touchMove`s that occur simultaneously are received as
 * two separate touch event dispatches - when they arguably should be one.
 *
 * This implementation reuses the `Touch` objects themselves as the `Event`s
 * since we dispatch an event for each touch (though that might not be spec
 * compliant). The main purpose of reusing them is to save allocations.
 *
 * TODO: Dispatch multiple changed touches in one event. The bubble path
 * could be the first common ancestor of all the `changedTouches`.
 *
 * One difference between this behavior and W3C spec: cancelled touches will
 * not appear in `.touches`, or in any future `.touches`, though they may
 * still be "actively touching the surface".
 *
 * Web desktop polyfills only need to construct a fake touch event with
 * identifier 0, also abandoning traditional click handlers.
 */

function receiveTouches(eventTopLevelType, touches, changedIndices) {
  var changedTouches =
    eventTopLevelType === "topTouchEnd" ||
    eventTopLevelType === "topTouchCancel"
      ? removeTouchesAtIndices(touches, changedIndices)
      : touchSubsequence(touches, changedIndices);

  for (var jj = 0; jj < changedTouches.length; jj++) {
    var touch = changedTouches[jj]; // Touch objects can fulfill the role of `DOM` `Event` objects if we set
    // the `changedTouches`/`touches`. This saves allocations.

    touch.changedTouches = changedTouches;
    touch.touches = touches;
    var nativeEvent = touch;
    var rootNodeID = null;
    var target = nativeEvent.target;

    if (target !== null && target !== undefined) {
      if (target < 1) {
      } else {
        rootNodeID = target;
      }
    } // $FlowFixMe Shouldn't we *not* call it if rootNodeID is null?

    _receiveRootNodeIDEvent(rootNodeID, eventTopLevelType, nativeEvent);
  }
}

// Module provided by RN:
var ReactNativeGlobalResponderHandler = {
  onChange: function(from, to, blockNativeResponder) {
    if (to !== null) {
      var tag = to.stateNode._nativeTag;
      ReactNativePrivateInterface.UIManager.setJSResponder(
        tag,
        blockNativeResponder
      );
    } else {
      ReactNativePrivateInterface.UIManager.clearJSResponder();
    }
  }
};

/**
 * Register the event emitter with the native bridge
 */

ReactNativePrivateInterface.RCTEventEmitter.register({
  receiveEvent: receiveEvent,
  receiveTouches: receiveTouches
});
setComponentTree(
  getFiberCurrentPropsFromNode$1,
  getInstanceFromTag,
  getTagFromInstance
);
ResponderEventPlugin.injection.injectGlobalResponderHandler(
  ReactNativeGlobalResponderHandler
);

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 *
 * Note that this module is currently shared and assumed to be stateless.
 * If this becomes an actual Map, that will break.
 */

/**
 * This API should be called `delete` but we'd have to make sure to always
 * transform these to strings for IE support. When this transform is fully
 * supported we can rename it.
 */

function get(key) {
  return key._reactInternalFiber;
}

function set(key, value) {
  key._reactInternalFiber = value;
}

var ReactSharedInternals =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED; // Prevent newer renderers from RTE when used with older react package versions.
// Current owner and dispatcher used to share the same ref,
// but PR #14548 split them out to better support the react-debug-tools package.

if (!ReactSharedInternals.hasOwnProperty("ReactCurrentDispatcher")) {
  ReactSharedInternals.ReactCurrentDispatcher = {
    current: null
  };
}

if (!ReactSharedInternals.hasOwnProperty("ReactCurrentBatchConfig")) {
  ReactSharedInternals.ReactCurrentBatchConfig = {
    suspense: null
  };
}

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === "function" && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol
  ? Symbol.for("react.strict_mode")
  : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_CONCURRENT_MODE_TYPE = hasSymbol
  ? Symbol.for("react.concurrent_mode")
  : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol
  ? Symbol.for("react.forward_ref")
  : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol
  ? Symbol.for("react.suspense_list")
  : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 0xead4;
var REACT_FUNDAMENTAL_TYPE = hasSymbol
  ? Symbol.for("react.fundamental")
  : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 0xead6;
var MAYBE_ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = "@@iterator";
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== "object") {
    return null;
  }

  var maybeIterator =
    (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
    maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === "function") {
    return maybeIterator;
  }

  return null;
}

var Uninitialized = -1;
var Pending = 0;
var Resolved = 1;
var Rejected = 2;
function refineResolvedLazyComponent(lazyComponent) {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}
function initializeLazyComponentType(lazyComponent) {
  if (lazyComponent._status === Uninitialized) {
    lazyComponent._status = Pending;
    var ctor = lazyComponent._ctor;
    var thenable = ctor();
    lazyComponent._result = thenable;
    thenable.then(
      function(moduleObject) {
        if (lazyComponent._status === Pending) {
          var defaultExport = moduleObject.default;

          lazyComponent._status = Resolved;
          lazyComponent._result = defaultExport;
        }
      },
      function(error) {
        if (lazyComponent._status === Pending) {
          lazyComponent._status = Rejected;
          lazyComponent._result = error;
        }
      }
    );
  }
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || "";
  return (
    outerType.displayName ||
    (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName)
  );
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  if (typeof type === "function") {
    return type.displayName || type.name || null;
  }

  if (typeof type === "string") {
    return type;
  }

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

  if (typeof type === "object") {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return "Context.Consumer";

      case REACT_PROVIDER_TYPE:
        return "Context.Provider";

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, "ForwardRef");

      case REACT_MEMO_TYPE:
        return getComponentName(type.type);

      case REACT_LAZY_TYPE: {
        var thenable = type;
        var resolvedThenable = refineResolvedLazyComponent(thenable);

        if (resolvedThenable) {
          return getComponentName(resolvedThenable);
        }

        break;
      }
    }
  }

  return null;
}

// Don't change these two values. They're used by React Dev Tools.
var NoEffect =
  /*              */
  0;
var PerformedWork =
  /*         */
  1; // You can change the rest (and add more).

var Placement =
  /*             */
  2;
var Update =
  /*                */
  4;
var PlacementAndUpdate =
  /*    */
  6;
var Deletion =
  /*              */
  8;
var ContentReset =
  /*          */
  16;
var Callback =
  /*              */
  32;
var DidCapture =
  /*            */
  64;
var Ref =
  /*                   */
  128;
var Snapshot =
  /*              */
  256;
var Passive =
  /*               */
  512; // Passive & Update & Callback & Ref & Snapshot

var LifecycleEffectMask =
  /*   */
  932; // Union of all host effects

var HostEffectMask =
  /*        */
  1023;
var Incomplete =
  /*            */
  1024;
var ShouldCapture =
  /*         */
  2048;

var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var MOUNTING = 1;
var MOUNTED = 2;
var UNMOUNTED = 3;

function isFiberMountedImpl(fiber) {
  var node = fiber;

  if (!fiber.alternate) {
    // If there is no alternate, this might be a new tree that isn't inserted
    // yet. If it is, then it will have a pending insertion effect on it.
    if ((node.effectTag & Placement) !== NoEffect) {
      return MOUNTING;
    }

    while (node.return) {
      node = node.return;

      if ((node.effectTag & Placement) !== NoEffect) {
        return MOUNTING;
      }
    }
  } else {
    while (node.return) {
      node = node.return;
    }
  }

  if (node.tag === HostRoot) {
    // TODO: Check if this was a nested HostRoot when used with
    // renderContainerIntoSubtree.
    return MOUNTED;
  } // If we didn't hit the root, that means that we're in an disconnected tree
  // that has been unmounted.

  return UNMOUNTED;
}

function isFiberMounted(fiber) {
  return isFiberMountedImpl(fiber) === MOUNTED;
}
function isMounted(component) {
  var fiber = get(component);

  if (!fiber) {
    return false;
  }

  return isFiberMountedImpl(fiber) === MOUNTED;
}

function assertIsMounted(fiber) {
  (function() {
    if (!(isFiberMountedImpl(fiber) === MOUNTED)) {
      throw ReactError(Error("Unable to find node on an unmounted component."));
    }
  })();
}

function findCurrentFiberUsingSlowPath(fiber) {
  var alternate = fiber.alternate;

  if (!alternate) {
    // If there is no alternate, then we only need to check if it is mounted.
    var state = isFiberMountedImpl(fiber);

    (function() {
      if (!(state !== UNMOUNTED)) {
        throw ReactError(
          Error("Unable to find node on an unmounted component.")
        );
      }
    })();

    if (state === MOUNTING) {
      return null;
    }

    return fiber;
  } // If we have two possible branches, we'll walk backwards up to the root
  // to see what path the root points to. On the way we may hit one of the
  // special cases and we'll deal with them.

  var a = fiber;
  var b = alternate;

  while (true) {
    var parentA = a.return;

    if (parentA === null) {
      // We're at the root.
      break;
    }

    var parentB = parentA.alternate;

    if (parentB === null) {
      // There is no alternate. This is an unusual case. Currently, it only
      // happens when a Suspense component is hidden. An extra fragment fiber
      // is inserted in between the Suspense fiber and its children. Skip
      // over this extra fragment fiber and proceed to the next parent.
      var nextParent = parentA.return;

      if (nextParent !== null) {
        a = b = nextParent;
        continue;
      } // If there's no parent, we're at the root.

      break;
    } // If both copies of the parent fiber point to the same child, we can
    // assume that the child is current. This happens when we bailout on low
    // priority: the bailed out fiber's child reuses the current child.

    if (parentA.child === parentB.child) {
      var child = parentA.child;

      while (child) {
        if (child === a) {
          // We've determined that A is the current branch.
          assertIsMounted(parentA);
          return fiber;
        }

        if (child === b) {
          // We've determined that B is the current branch.
          assertIsMounted(parentA);
          return alternate;
        }

        child = child.sibling;
      } // We should never have an alternate for any mounting node. So the only
      // way this could possibly happen is if this was unmounted, if at all.

      (function() {
        {
          throw ReactError(
            Error("Unable to find node on an unmounted component.")
          );
        }
      })();
    }

    if (a.return !== b.return) {
      // The return pointer of A and the return pointer of B point to different
      // fibers. We assume that return pointers never criss-cross, so A must
      // belong to the child set of A.return, and B must belong to the child
      // set of B.return.
      a = parentA;
      b = parentB;
    } else {
      // The return pointers point to the same fiber. We'll have to use the
      // default, slow path: scan the child sets of each parent alternate to see
      // which child belongs to which set.
      //
      // Search parent A's child set
      var didFindChild = false;
      var _child = parentA.child;

      while (_child) {
        if (_child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }

        if (_child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }

        _child = _child.sibling;
      }

      if (!didFindChild) {
        // Search parent B's child set
        _child = parentB.child;

        while (_child) {
          if (_child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }

          if (_child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }

          _child = _child.sibling;
        }

        (function() {
          if (!didFindChild) {
            throw ReactError(
              Error(
                "Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue."
              )
            );
          }
        })();
      }
    }

    (function() {
      if (!(a.alternate === b)) {
        throw ReactError(
          Error(
            "Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();
  } // If the root is not a host container, we're in a disconnected tree. I.e.
  // unmounted.

  (function() {
    if (!(a.tag === HostRoot)) {
      throw ReactError(Error("Unable to find node on an unmounted component."));
    }
  })();

  if (a.stateNode.current === a) {
    // We've determined that A is the current branch.
    return fiber;
  } // Otherwise B has to be current branch.

  return alternate;
}
function findCurrentHostFiber(parent) {
  var currentParent = findCurrentFiberUsingSlowPath(parent);

  if (!currentParent) {
    return null;
  } // Next we'll drill down this component to find the first HostComponent/Text.

  var node = currentParent;

  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      return node;
    } else if (node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === currentParent) {
      return null;
    }

    while (!node.sibling) {
      if (!node.return || node.return === currentParent) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  } // Flow needs the return null here, but ESLint complains about it.
  // eslint-disable-next-line no-unreachable

  return null;
}

// Modules provided by RN:
var emptyObject = {};
/**
 * Create a payload that contains all the updates between two sets of props.
 *
 * These helpers are all encapsulated into a single module, because they use
 * mutation as a performance optimization which leads to subtle shared
 * dependencies between the code paths. To avoid this mutable state leaking
 * across modules, I've kept them isolated to this module.
 */

// Tracks removed keys
var removedKeys = null;
var removedKeyCount = 0;

function defaultDiffer(prevProp, nextProp) {
  if (typeof nextProp !== "object" || nextProp === null) {
    // Scalars have already been checked for equality
    return true;
  } else {
    // For objects and arrays, the default diffing algorithm is a deep compare
    return ReactNativePrivateInterface.deepDiffer(prevProp, nextProp);
  }
}

function restoreDeletedValuesInNestedArray(
  updatePayload,
  node,
  validAttributes
) {
  if (Array.isArray(node)) {
    var i = node.length;

    while (i-- && removedKeyCount > 0) {
      restoreDeletedValuesInNestedArray(
        updatePayload,
        node[i],
        validAttributes
      );
    }
  } else if (node && removedKeyCount > 0) {
    var obj = node;

    for (var propKey in removedKeys) {
      if (!removedKeys[propKey]) {
        continue;
      }

      var nextProp = obj[propKey];

      if (nextProp === undefined) {
        continue;
      }

      var attributeConfig = validAttributes[propKey];

      if (!attributeConfig) {
        continue; // not a valid native prop
      }

      if (typeof nextProp === "function") {
        nextProp = true;
      }

      if (typeof nextProp === "undefined") {
        nextProp = null;
      }

      if (typeof attributeConfig !== "object") {
        // case: !Object is the default case
        updatePayload[propKey] = nextProp;
      } else if (
        typeof attributeConfig.diff === "function" ||
        typeof attributeConfig.process === "function"
      ) {
        // case: CustomAttributeConfiguration
        var nextValue =
          typeof attributeConfig.process === "function"
            ? attributeConfig.process(nextProp)
            : nextProp;
        updatePayload[propKey] = nextValue;
      }

      removedKeys[propKey] = false;
      removedKeyCount--;
    }
  }
}

function diffNestedArrayProperty(
  updatePayload,
  prevArray,
  nextArray,
  validAttributes
) {
  var minLength =
    prevArray.length < nextArray.length ? prevArray.length : nextArray.length;
  var i;

  for (i = 0; i < minLength; i++) {
    // Diff any items in the array in the forward direction. Repeated keys
    // will be overwritten by later values.
    updatePayload = diffNestedProperty(
      updatePayload,
      prevArray[i],
      nextArray[i],
      validAttributes
    );
  }

  for (; i < prevArray.length; i++) {
    // Clear out all remaining properties.
    updatePayload = clearNestedProperty(
      updatePayload,
      prevArray[i],
      validAttributes
    );
  }

  for (; i < nextArray.length; i++) {
    // Add all remaining properties.
    updatePayload = addNestedProperty(
      updatePayload,
      nextArray[i],
      validAttributes
    );
  }

  return updatePayload;
}

function diffNestedProperty(
  updatePayload,
  prevProp,
  nextProp,
  validAttributes
) {
  if (!updatePayload && prevProp === nextProp) {
    // If no properties have been added, then we can bail out quickly on object
    // equality.
    return updatePayload;
  }

  if (!prevProp || !nextProp) {
    if (nextProp) {
      return addNestedProperty(updatePayload, nextProp, validAttributes);
    }

    if (prevProp) {
      return clearNestedProperty(updatePayload, prevProp, validAttributes);
    }

    return updatePayload;
  }

  if (!Array.isArray(prevProp) && !Array.isArray(nextProp)) {
    // Both are leaves, we can diff the leaves.
    return diffProperties(updatePayload, prevProp, nextProp, validAttributes);
  }

  if (Array.isArray(prevProp) && Array.isArray(nextProp)) {
    // Both are arrays, we can diff the arrays.
    return diffNestedArrayProperty(
      updatePayload,
      prevProp,
      nextProp,
      validAttributes
    );
  }

  if (Array.isArray(prevProp)) {
    return diffProperties(
      updatePayload, // $FlowFixMe - We know that this is always an object when the input is.
      ReactNativePrivateInterface.flattenStyle(prevProp), // $FlowFixMe - We know that this isn't an array because of above flow.
      nextProp,
      validAttributes
    );
  }

  return diffProperties(
    updatePayload,
    prevProp, // $FlowFixMe - We know that this is always an object when the input is.
    ReactNativePrivateInterface.flattenStyle(nextProp),
    validAttributes
  );
}
/**
 * addNestedProperty takes a single set of props and valid attribute
 * attribute configurations. It processes each prop and adds it to the
 * updatePayload.
 */

function addNestedProperty(updatePayload, nextProp, validAttributes) {
  if (!nextProp) {
    return updatePayload;
  }

  if (!Array.isArray(nextProp)) {
    // Add each property of the leaf.
    return addProperties(updatePayload, nextProp, validAttributes);
  }

  for (var i = 0; i < nextProp.length; i++) {
    // Add all the properties of the array.
    updatePayload = addNestedProperty(
      updatePayload,
      nextProp[i],
      validAttributes
    );
  }

  return updatePayload;
}
/**
 * clearNestedProperty takes a single set of props and valid attributes. It
 * adds a null sentinel to the updatePayload, for each prop key.
 */

function clearNestedProperty(updatePayload, prevProp, validAttributes) {
  if (!prevProp) {
    return updatePayload;
  }

  if (!Array.isArray(prevProp)) {
    // Add each property of the leaf.
    return clearProperties(updatePayload, prevProp, validAttributes);
  }

  for (var i = 0; i < prevProp.length; i++) {
    // Add all the properties of the array.
    updatePayload = clearNestedProperty(
      updatePayload,
      prevProp[i],
      validAttributes
    );
  }

  return updatePayload;
}
/**
 * diffProperties takes two sets of props and a set of valid attributes
 * and write to updatePayload the values that changed or were deleted.
 * If no updatePayload is provided, a new one is created and returned if
 * anything changed.
 */

function diffProperties(updatePayload, prevProps, nextProps, validAttributes) {
  var attributeConfig;
  var nextProp;
  var prevProp;

  for (var propKey in nextProps) {
    attributeConfig = validAttributes[propKey];

    if (!attributeConfig) {
      continue; // not a valid native prop
    }

    prevProp = prevProps[propKey];
    nextProp = nextProps[propKey]; // functions are converted to booleans as markers that the associated
    // events should be sent from native.

    if (typeof nextProp === "function") {
      nextProp = true; // If nextProp is not a function, then don't bother changing prevProp
      // since nextProp will win and go into the updatePayload regardless.

      if (typeof prevProp === "function") {
        prevProp = true;
      }
    } // An explicit value of undefined is treated as a null because it overrides
    // any other preceding value.

    if (typeof nextProp === "undefined") {
      nextProp = null;

      if (typeof prevProp === "undefined") {
        prevProp = null;
      }
    }

    if (removedKeys) {
      removedKeys[propKey] = false;
    }

    if (updatePayload && updatePayload[propKey] !== undefined) {
      // Something else already triggered an update to this key because another
      // value diffed. Since we're now later in the nested arrays our value is
      // more important so we need to calculate it and override the existing
      // value. It doesn't matter if nothing changed, we'll set it anyway.
      // Pattern match on: attributeConfig
      if (typeof attributeConfig !== "object") {
        // case: !Object is the default case
        updatePayload[propKey] = nextProp;
      } else if (
        typeof attributeConfig.diff === "function" ||
        typeof attributeConfig.process === "function"
      ) {
        // case: CustomAttributeConfiguration
        var nextValue =
          typeof attributeConfig.process === "function"
            ? attributeConfig.process(nextProp)
            : nextProp;
        updatePayload[propKey] = nextValue;
      }

      continue;
    }

    if (prevProp === nextProp) {
      continue; // nothing changed
    } // Pattern match on: attributeConfig

    if (typeof attributeConfig !== "object") {
      // case: !Object is the default case
      if (defaultDiffer(prevProp, nextProp)) {
        // a normal leaf has changed
        (updatePayload || (updatePayload = {}))[propKey] = nextProp;
      }
    } else if (
      typeof attributeConfig.diff === "function" ||
      typeof attributeConfig.process === "function"
    ) {
      // case: CustomAttributeConfiguration
      var shouldUpdate =
        prevProp === undefined ||
        (typeof attributeConfig.diff === "function"
          ? attributeConfig.diff(prevProp, nextProp)
          : defaultDiffer(prevProp, nextProp));

      if (shouldUpdate) {
        var _nextValue =
          typeof attributeConfig.process === "function"
            ? attributeConfig.process(nextProp)
            : nextProp;

        (updatePayload || (updatePayload = {}))[propKey] = _nextValue;
      }
    } else {
      // default: fallthrough case when nested properties are defined
      removedKeys = null;
      removedKeyCount = 0; // We think that attributeConfig is not CustomAttributeConfiguration at
      // this point so we assume it must be AttributeConfiguration.

      updatePayload = diffNestedProperty(
        updatePayload,
        prevProp,
        nextProp,
        attributeConfig
      );

      if (removedKeyCount > 0 && updatePayload) {
        restoreDeletedValuesInNestedArray(
          updatePayload,
          nextProp,
          attributeConfig
        );
        removedKeys = null;
      }
    }
  } // Also iterate through all the previous props to catch any that have been
  // removed and make sure native gets the signal so it can reset them to the
  // default.

  for (var _propKey in prevProps) {
    if (nextProps[_propKey] !== undefined) {
      continue; // we've already covered this key in the previous pass
    }

    attributeConfig = validAttributes[_propKey];

    if (!attributeConfig) {
      continue; // not a valid native prop
    }

    if (updatePayload && updatePayload[_propKey] !== undefined) {
      // This was already updated to a diff result earlier.
      continue;
    }

    prevProp = prevProps[_propKey];

    if (prevProp === undefined) {
      continue; // was already empty anyway
    } // Pattern match on: attributeConfig

    if (
      typeof attributeConfig !== "object" ||
      typeof attributeConfig.diff === "function" ||
      typeof attributeConfig.process === "function"
    ) {
      // case: CustomAttributeConfiguration | !Object
      // Flag the leaf property for removal by sending a sentinel.
      (updatePayload || (updatePayload = {}))[_propKey] = null;

      if (!removedKeys) {
        removedKeys = {};
      }

      if (!removedKeys[_propKey]) {
        removedKeys[_propKey] = true;
        removedKeyCount++;
      }
    } else {
      // default:
      // This is a nested attribute configuration where all the properties
      // were removed so we need to go through and clear out all of them.
      updatePayload = clearNestedProperty(
        updatePayload,
        prevProp,
        attributeConfig
      );
    }
  }

  return updatePayload;
}
/**
 * addProperties adds all the valid props to the payload after being processed.
 */

function addProperties(updatePayload, props, validAttributes) {
  // TODO: Fast path
  return diffProperties(updatePayload, emptyObject, props, validAttributes);
}
/**
 * clearProperties clears all the previous props by adding a null sentinel
 * to the payload for each valid key.
 */

function clearProperties(updatePayload, prevProps, validAttributes) {
  // TODO: Fast path
  return diffProperties(updatePayload, prevProps, emptyObject, validAttributes);
}

function create(props, validAttributes) {
  return addProperties(
    null, // updatePayload
    props,
    validAttributes
  );
}
function diff(prevProps, nextProps, validAttributes) {
  return diffProperties(
    null, // updatePayload
    prevProps,
    nextProps,
    validAttributes
  );
}

/**
 * In the future, we should cleanup callbacks by cancelling them instead of
 * using this.
 */
function mountSafeCallback_NOT_REALLY_SAFE(context, callback) {
  return function() {
    if (!callback) {
      return undefined;
    } // This protects against createClass() components.
    // We don't know if there is code depending on it.
    // We intentionally don't use isMounted() because even accessing
    // isMounted property on a React ES6 class will trigger a warning.

    if (typeof context.__isMounted === "boolean") {
      if (!context.__isMounted) {
        return undefined;
      }
    } // FIXME: there used to be other branches that protected
    // against unmounted host components. But RN host components don't
    // define isMounted() anymore, so those checks didn't do anything.
    // They caused false positive warning noise so we removed them:
    // https://github.com/facebook/react-native/issues/18868#issuecomment-413579095
    // However, this means that the callback is NOT guaranteed to be safe
    // for host components. The solution we should implement is to make
    // UIManager.measure() and similar calls truly cancelable. Then we
    // can change our own code calling them to cancel when something unmounts.

    return callback.apply(context, arguments);
  };
}

// Modules provided by RN:
/**
 * This component defines the same methods as NativeMethodsMixin but without the
 * findNodeHandle wrapper. This wrapper is unnecessary for HostComponent views
 * and would also result in a circular require.js dependency (since
 * ReactNativeFiber depends on this component and NativeMethodsMixin depends on
 * ReactNativeFiber).
 */

var ReactNativeFiberHostComponent =
  /*#__PURE__*/
  (function() {
    function ReactNativeFiberHostComponent(tag, viewConfig) {
      this._nativeTag = tag;
      this._children = [];
      this.viewConfig = viewConfig;
    }

    var _proto = ReactNativeFiberHostComponent.prototype;

    _proto.blur = function blur() {
      ReactNativePrivateInterface.TextInputState.blurTextInput(this._nativeTag);
    };

    _proto.focus = function focus() {
      ReactNativePrivateInterface.TextInputState.focusTextInput(
        this._nativeTag
      );
    };

    _proto.measure = function measure(callback) {
      ReactNativePrivateInterface.UIManager.measure(
        this._nativeTag,
        mountSafeCallback_NOT_REALLY_SAFE(this, callback)
      );
    };

    _proto.measureInWindow = function measureInWindow(callback) {
      ReactNativePrivateInterface.UIManager.measureInWindow(
        this._nativeTag,
        mountSafeCallback_NOT_REALLY_SAFE(this, callback)
      );
    };

    _proto.measureLayout = function measureLayout(
      relativeToNativeNode,
      onSuccess,
      onFail
    ) /* currently unused */
    {
      var relativeNode;

      if (typeof relativeToNativeNode === "number") {
        // Already a node handle
        relativeNode = relativeToNativeNode;
      } else if (relativeToNativeNode._nativeTag) {
        relativeNode = relativeToNativeNode._nativeTag;
      } else if (
        relativeToNativeNode.canonical &&
        relativeToNativeNode.canonical._nativeTag
      ) {
        relativeNode = relativeToNativeNode.canonical._nativeTag;
      }

      if (relativeNode == null) {
        return;
      }

      ReactNativePrivateInterface.UIManager.measureLayout(
        this._nativeTag,
        relativeNode,
        mountSafeCallback_NOT_REALLY_SAFE(this, onFail),
        mountSafeCallback_NOT_REALLY_SAFE(this, onSuccess)
      );
    };

    _proto.setNativeProps = function setNativeProps(nativeProps) {
      var updatePayload = create(nativeProps, this.viewConfig.validAttributes); // Avoid the overhead of bridge calls if there's no update.
      // This is an expensive no-op for Android, and causes an unnecessary
      // view invalidation for certain components (eg RCTTextInput) on iOS.

      if (updatePayload != null) {
        ReactNativePrivateInterface.UIManager.updateView(
          this._nativeTag,
          this.viewConfig.uiViewClassName,
          updatePayload
        );
      }
    };

    return ReactNativeFiberHostComponent;
  })(); // eslint-disable-next-line no-unused-expressions

// can re-export everything from this module.

function shim() {
  (function() {
    {
      throw ReactError(
        Error(
          "The current renderer does not support persistence. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();
} // Persistence (when unsupported)

var supportsPersistence = false;
var cloneInstance = shim;
var cloneFundamentalInstance = shim;
var createContainerChildSet = shim;
var appendChildToContainerChildSet = shim;
var finalizeContainerChildren = shim;
var replaceContainerChildren = shim;
var cloneHiddenInstance = shim;
var cloneHiddenTextInstance = shim;

// can re-export everything from this module.

function shim$1() {
  (function() {
    {
      throw ReactError(
        Error(
          "The current renderer does not support hydration. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();
} // Hydration (when unsupported)

var supportsHydration = false;
var canHydrateInstance = shim$1;
var canHydrateTextInstance = shim$1;
var canHydrateSuspenseInstance = shim$1;
var isSuspenseInstancePending = shim$1;
var isSuspenseInstanceFallback = shim$1;
var registerSuspenseInstanceRetry = shim$1;
var getNextHydratableSibling = shim$1;
var getFirstHydratableChild = shim$1;
var hydrateInstance = shim$1;
var hydrateTextInstance = shim$1;
var getNextHydratableInstanceAfterSuspenseInstance = shim$1;
var clearSuspenseBoundary = shim$1;
var clearSuspenseBoundaryFromContainer = shim$1;

var getViewConfigForType =
  ReactNativePrivateInterface.ReactNativeViewConfigRegistry.get;
var UPDATE_SIGNAL = {};

// % 10 === 1 means it is a rootTag.
// % 2 === 0 means it is a Fabric tag.

var nextReactTag = 3;

function allocateTag() {
  var tag = nextReactTag;

  if (tag % 10 === 1) {
    tag += 2;
  }

  nextReactTag = tag + 2;
  return tag;
}

function recursivelyUncacheFiberNode(node) {
  if (typeof node === "number") {
    // Leaf node (eg text)
    uncacheFiberNode(node);
  } else {
    uncacheFiberNode(node._nativeTag);

    node._children.forEach(recursivelyUncacheFiberNode);
  }
}

function appendInitialChild(parentInstance, child) {
  parentInstance._children.push(child);
}
function createInstance(
  type,
  props,
  rootContainerInstance,
  hostContext,
  internalInstanceHandle
) {
  var tag = allocateTag();
  var viewConfig = getViewConfigForType(type);

  var updatePayload = create(props, viewConfig.validAttributes);
  ReactNativePrivateInterface.UIManager.createView(
    tag, // reactTag
    viewConfig.uiViewClassName, // viewName
    rootContainerInstance, // rootTag
    updatePayload // props
  );
  var component = new ReactNativeFiberHostComponent(tag, viewConfig);
  precacheFiberNode(internalInstanceHandle, tag);
  updateFiberProps(tag, props); // Not sure how to avoid this cast. Flow is okay if the component is defined
  // in the same file but if it's external it can't see the types.

  return component;
}
function createTextInstance(
  text,
  rootContainerInstance,
  hostContext,
  internalInstanceHandle
) {
  (function() {
    if (!hostContext.isInAParentText) {
      throw ReactError(
        Error("Text strings must be rendered within a <Text> component.")
      );
    }
  })();

  var tag = allocateTag();
  ReactNativePrivateInterface.UIManager.createView(
    tag, // reactTag
    "RCTRawText", // viewName
    rootContainerInstance, // rootTag
    {
      text: text
    } // props
  );
  precacheFiberNode(internalInstanceHandle, tag);
  return tag;
}
function finalizeInitialChildren(
  parentInstance,
  type,
  props,
  rootContainerInstance,
  hostContext
) {
  // Don't send a no-op message over the bridge.
  if (parentInstance._children.length === 0) {
    return false;
  } // Map from child objects to native tags.
  // Either way we need to pass a copy of the Array to prevent it from being frozen.

  var nativeTags = parentInstance._children.map(function(child) {
    return typeof child === "number"
      ? child // Leaf node (eg text)
      : child._nativeTag;
  });

  ReactNativePrivateInterface.UIManager.setChildren(
    parentInstance._nativeTag, // containerTag
    nativeTags // reactTags
  );
  return false;
}
function getRootHostContext(rootContainerInstance) {
  return {
    isInAParentText: false
  };
}
function getChildHostContext(parentHostContext, type, rootContainerInstance) {
  var prevIsInAParentText = parentHostContext.isInAParentText;
  var isInAParentText =
    type === "AndroidTextInput" || // Android
    type === "RCTMultilineTextInputView" || // iOS
    type === "RCTSinglelineTextInputView" || // iOS
    type === "RCTText" ||
    type === "RCTVirtualText";

  if (prevIsInAParentText !== isInAParentText) {
    return {
      isInAParentText: isInAParentText
    };
  } else {
    return parentHostContext;
  }
}
function getPublicInstance(instance) {
  return instance;
}
function prepareForCommit(containerInfo) {
  // Noop
}
function prepareUpdate(
  instance,
  type,
  oldProps,
  newProps,
  rootContainerInstance,
  hostContext
) {
  return UPDATE_SIGNAL;
}
function resetAfterCommit(containerInfo) {
  // Noop
}
var isPrimaryRenderer = true;

var scheduleTimeout = setTimeout;
var cancelTimeout = clearTimeout;
var noTimeout = -1;
function shouldDeprioritizeSubtree(type, props) {
  return false;
}
function shouldSetTextContent(type, props) {
  // TODO (bvaughn) Revisit this decision.
  // Always returning false simplifies the createInstance() implementation,
  // But creates an additional child Fiber for raw text children.
  // No additional native views are created though.
  // It's not clear to me which is better so I'm deferring for now.
  // More context @ github.com/facebook/react/pull/8560#discussion_r92111303
  return false;
} // -------------------
//     Mutation
// -------------------

var supportsMutation = true;
function appendChild(parentInstance, child) {
  var childTag = typeof child === "number" ? child : child._nativeTag;
  var children = parentInstance._children;
  var index = children.indexOf(child);

  if (index >= 0) {
    children.splice(index, 1);
    children.push(child);
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerTag
      [index], // moveFromIndices
      [children.length - 1], // moveToIndices
      [], // addChildReactTags
      [], // addAtIndices
      [] // removeAtIndices
    );
  } else {
    children.push(child);
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerTag
      [], // moveFromIndices
      [], // moveToIndices
      [childTag], // addChildReactTags
      [children.length - 1], // addAtIndices
      [] // removeAtIndices
    );
  }
}
function appendChildToContainer(parentInstance, child) {
  var childTag = typeof child === "number" ? child : child._nativeTag;
  ReactNativePrivateInterface.UIManager.setChildren(
    parentInstance, // containerTag
    [childTag] // reactTags
  );
}
function commitTextUpdate(textInstance, oldText, newText) {
  ReactNativePrivateInterface.UIManager.updateView(
    textInstance, // reactTag
    "RCTRawText", // viewName
    {
      text: newText
    } // props
  );
}

function commitUpdate(
  instance,
  updatePayloadTODO,
  type,
  oldProps,
  newProps,
  internalInstanceHandle
) {
  var viewConfig = instance.viewConfig;
  updateFiberProps(instance._nativeTag, newProps);
  var updatePayload = diff(oldProps, newProps, viewConfig.validAttributes); // Avoid the overhead of bridge calls if there's no update.
  // This is an expensive no-op for Android, and causes an unnecessary
  // view invalidation for certain components (eg RCTTextInput) on iOS.

  if (updatePayload != null) {
    ReactNativePrivateInterface.UIManager.updateView(
      instance._nativeTag, // reactTag
      viewConfig.uiViewClassName, // viewName
      updatePayload // props
    );
  }
}
function insertBefore(parentInstance, child, beforeChild) {
  var children = parentInstance._children;
  var index = children.indexOf(child); // Move existing child or add new child?

  if (index >= 0) {
    children.splice(index, 1);
    var beforeChildIndex = children.indexOf(beforeChild);
    children.splice(beforeChildIndex, 0, child);
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerID
      [index], // moveFromIndices
      [beforeChildIndex], // moveToIndices
      [], // addChildReactTags
      [], // addAtIndices
      [] // removeAtIndices
    );
  } else {
    var _beforeChildIndex = children.indexOf(beforeChild);

    children.splice(_beforeChildIndex, 0, child);
    var childTag = typeof child === "number" ? child : child._nativeTag;
    ReactNativePrivateInterface.UIManager.manageChildren(
      parentInstance._nativeTag, // containerID
      [], // moveFromIndices
      [], // moveToIndices
      [childTag], // addChildReactTags
      [_beforeChildIndex], // addAtIndices
      [] // removeAtIndices
    );
  }
}
function insertInContainerBefore(parentInstance, child, beforeChild) {
  // TODO (bvaughn): Remove this check when...
  // We create a wrapper object for the container in ReactNative render()
  // Or we refactor to remove wrapper objects entirely.
  // For more info on pros/cons see PR #8560 description.
  (function() {
    if (!(typeof parentInstance !== "number")) {
      throw ReactError(
        Error("Container does not support insertBefore operation")
      );
    }
  })();
}
function removeChild(parentInstance, child) {
  recursivelyUncacheFiberNode(child);
  var children = parentInstance._children;
  var index = children.indexOf(child);
  children.splice(index, 1);
  ReactNativePrivateInterface.UIManager.manageChildren(
    parentInstance._nativeTag, // containerID
    [], // moveFromIndices
    [], // moveToIndices
    [], // addChildReactTags
    [], // addAtIndices
    [index] // removeAtIndices
  );
}
function removeChildFromContainer(parentInstance, child) {
  recursivelyUncacheFiberNode(child);
  ReactNativePrivateInterface.UIManager.manageChildren(
    parentInstance, // containerID
    [], // moveFromIndices
    [], // moveToIndices
    [], // addChildReactTags
    [], // addAtIndices
    [0] // removeAtIndices
  );
}
function resetTextContent(instance) {
  // Noop
}
function hideInstance(instance) {
  var viewConfig = instance.viewConfig;
  var updatePayload = create(
    {
      style: {
        display: "none"
      }
    },
    viewConfig.validAttributes
  );
  ReactNativePrivateInterface.UIManager.updateView(
    instance._nativeTag,
    viewConfig.uiViewClassName,
    updatePayload
  );
}
function hideTextInstance(textInstance) {
  throw new Error("Not yet implemented.");
}
function unhideInstance(instance, props) {
  var viewConfig = instance.viewConfig;
  var updatePayload = diff(
    Object.assign({}, props, {
      style: [
        props.style,
        {
          display: "none"
        }
      ]
    }),
    props,
    viewConfig.validAttributes
  );
  ReactNativePrivateInterface.UIManager.updateView(
    instance._nativeTag,
    viewConfig.uiViewClassName,
    updatePayload
  );
}
function unhideTextInstance(textInstance, text) {
  throw new Error("Not yet implemented.");
}
function mountResponderInstance(
  responder,
  responderInstance,
  props,
  state,
  instance,
  rootContainerInstance
) {
  throw new Error("Not yet implemented.");
}
function unmountResponderInstance(responderInstance) {
  throw new Error("Not yet implemented.");
}
function getFundamentalComponentInstance(fundamentalInstance) {
  throw new Error("Not yet implemented.");
}
function mountFundamentalComponent(fundamentalInstance) {
  throw new Error("Not yet implemented.");
}
function shouldUpdateFundamentalComponent(fundamentalInstance) {
  throw new Error("Not yet implemented.");
}
function updateFundamentalComponent(fundamentalInstance) {
  throw new Error("Not yet implemented.");
}
function unmountFundamentalComponent(fundamentalInstance) {
  throw new Error("Not yet implemented.");
}

var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
var describeComponentFrame = function(name, source, ownerName) {
  var sourceInfo = "";

  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, "");

    sourceInfo = " (at " + fileName + ":" + source.lineNumber + ")";
  } else if (ownerName) {
    sourceInfo = " (created by " + ownerName + ")";
  }

  return "\n    in " + (name || "Unknown") + sourceInfo;
};

var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

function describeFiber(fiber) {
  switch (fiber.tag) {
    case HostRoot:
    case HostPortal:
    case HostText:
    case Fragment:
    case ContextProvider:
    case ContextConsumer:
      return "";

    default:
      var owner = fiber._debugOwner;
      var source = fiber._debugSource;
      var name = getComponentName(fiber.type);
      var ownerName = null;

      if (owner) {
        ownerName = getComponentName(owner.type);
      }

      return describeComponentFrame(name, source, ownerName);
  }
}

function getStackByFiberInDevAndProd(workInProgress) {
  var info = "";
  var node = workInProgress;

  do {
    info += describeFiber(node);
    node = node.return;
  } while (node);

  return info;
}

// Prefix measurements so that it's possible to filter them.
// Longer prefixes are hard to read in DevTools.
var reactEmoji = "\u269B";
var warningEmoji = "\u26D4";
var supportsUserTiming =
  typeof performance !== "undefined" &&
  typeof performance.mark === "function" &&
  typeof performance.clearMarks === "function" &&
  typeof performance.measure === "function" &&
  typeof performance.clearMeasures === "function"; // Keep track of current fiber so that we know the path to unwind on pause.
// TODO: this looks the same as nextUnitOfWork in scheduler. Can we unify them?

var currentFiber = null; // If we're in the middle of user code, which fiber and method is it?
// Reusing `currentFiber` would be confusing for this because user code fiber
// can change during commit phase too, but we don't need to unwind it (since
// lifecycles in the commit phase don't resemble a tree).

var currentPhase = null;
var currentPhaseFiber = null; // Did lifecycle hook schedule an update? This is often a performance problem,
// so we will keep track of it, and include it in the report.
// Track commits caused by cascading updates.

var isCommitting = false;
var hasScheduledUpdateInCurrentCommit = false;
var hasScheduledUpdateInCurrentPhase = false;
var commitCountInCurrentWorkLoop = 0;
var effectCountInCurrentCommit = 0;
// to avoid stretch the commit phase with measurement overhead.

var labelsInCurrentCommit = new Set();

var formatMarkName = function(markName) {
  return reactEmoji + " " + markName;
};

var formatLabel = function(label, warning) {
  var prefix = warning ? warningEmoji + " " : reactEmoji + " ";
  var suffix = warning ? " Warning: " + warning : "";
  return "" + prefix + label + suffix;
};

var beginMark = function(markName) {
  performance.mark(formatMarkName(markName));
};

var clearMark = function(markName) {
  performance.clearMarks(formatMarkName(markName));
};

var endMark = function(label, markName, warning) {
  var formattedMarkName = formatMarkName(markName);
  var formattedLabel = formatLabel(label, warning);

  try {
    performance.measure(formattedLabel, formattedMarkName);
  } catch (err) {} // If previous mark was missing for some reason, this will throw.
  // This could only happen if React crashed in an unexpected place earlier.
  // Don't pile on with more errors.
  // Clear marks immediately to avoid growing buffer.

  performance.clearMarks(formattedMarkName);
  performance.clearMeasures(formattedLabel);
};

var getFiberMarkName = function(label, debugID) {
  return label + " (#" + debugID + ")";
};

var getFiberLabel = function(componentName, isMounted, phase) {
  if (phase === null) {
    // These are composite component total time measurements.
    return componentName + " [" + (isMounted ? "update" : "mount") + "]";
  } else {
    // Composite component methods.
    return componentName + "." + phase;
  }
};

var beginFiberMark = function(fiber, phase) {
  var componentName = getComponentName(fiber.type) || "Unknown";
  var debugID = fiber._debugID;
  var isMounted = fiber.alternate !== null;
  var label = getFiberLabel(componentName, isMounted, phase);

  if (isCommitting && labelsInCurrentCommit.has(label)) {
    // During the commit phase, we don't show duplicate labels because
    // there is a fixed overhead for every measurement, and we don't
    // want to stretch the commit phase beyond necessary.
    return false;
  }

  labelsInCurrentCommit.add(label);
  var markName = getFiberMarkName(label, debugID);
  beginMark(markName);
  return true;
};

var clearFiberMark = function(fiber, phase) {
  var componentName = getComponentName(fiber.type) || "Unknown";
  var debugID = fiber._debugID;
  var isMounted = fiber.alternate !== null;
  var label = getFiberLabel(componentName, isMounted, phase);
  var markName = getFiberMarkName(label, debugID);
  clearMark(markName);
};

var endFiberMark = function(fiber, phase, warning) {
  var componentName = getComponentName(fiber.type) || "Unknown";
  var debugID = fiber._debugID;
  var isMounted = fiber.alternate !== null;
  var label = getFiberLabel(componentName, isMounted, phase);
  var markName = getFiberMarkName(label, debugID);
  endMark(label, markName, warning);
};

var shouldIgnoreFiber = function(fiber) {
  // Host components should be skipped in the timeline.
  // We could check typeof fiber.type, but does this work with RN?
  switch (fiber.tag) {
    case HostRoot:
    case HostComponent:
    case HostText:
    case HostPortal:
    case Fragment:
    case ContextProvider:
    case ContextConsumer:
    case Mode:
      return true;

    default:
      return false;
  }
};

var clearPendingPhaseMeasurement = function() {
  if (currentPhase !== null && currentPhaseFiber !== null) {
    clearFiberMark(currentPhaseFiber, currentPhase);
  }

  currentPhaseFiber = null;
  currentPhase = null;
  hasScheduledUpdateInCurrentPhase = false;
};

var pauseTimers = function() {
  // Stops all currently active measurements so that they can be resumed
  // if we continue in a later deferred loop from the same unit of work.
  var fiber = currentFiber;

  while (fiber) {
    if (fiber._debugIsCurrentlyTiming) {
      endFiberMark(fiber, null, null);
    }

    fiber = fiber.return;
  }
};

var resumeTimersRecursively = function(fiber) {
  if (fiber.return !== null) {
    resumeTimersRecursively(fiber.return);
  }

  if (fiber._debugIsCurrentlyTiming) {
    beginFiberMark(fiber, null);
  }
};

var resumeTimers = function() {
  // Resumes all measurements that were active during the last deferred loop.
  if (currentFiber !== null) {
    resumeTimersRecursively(currentFiber);
  }
};

function recordEffect() {
  if (enableUserTimingAPI) {
    effectCountInCurrentCommit++;
  }
}
function recordScheduleUpdate() {
  if (enableUserTimingAPI) {
    if (isCommitting) {
      hasScheduledUpdateInCurrentCommit = true;
    }

    if (
      currentPhase !== null &&
      currentPhase !== "componentWillMount" &&
      currentPhase !== "componentWillReceiveProps"
    ) {
      hasScheduledUpdateInCurrentPhase = true;
    }
  }
}

function startWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    } // If we pause, this is the fiber to unwind from.

    currentFiber = fiber;

    if (!beginFiberMark(fiber, null)) {
      return;
    }

    fiber._debugIsCurrentlyTiming = true;
  }
}
function cancelWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    } // Remember we shouldn't complete measurement for this fiber.
    // Otherwise flamechart will be deep even for small updates.

    fiber._debugIsCurrentlyTiming = false;
    clearFiberMark(fiber, null);
  }
}
function stopWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    } // If we pause, its parent is the fiber to unwind from.

    currentFiber = fiber.return;

    if (!fiber._debugIsCurrentlyTiming) {
      return;
    }

    fiber._debugIsCurrentlyTiming = false;
    endFiberMark(fiber, null, null);
  }
}
function stopFailedWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    } // If we pause, its parent is the fiber to unwind from.

    currentFiber = fiber.return;

    if (!fiber._debugIsCurrentlyTiming) {
      return;
    }

    fiber._debugIsCurrentlyTiming = false;
    var warning =
      fiber.tag === SuspenseComponent
        ? "Rendering was suspended"
        : "An error was thrown inside this error boundary";
    endFiberMark(fiber, null, warning);
  }
}
function startPhaseTimer(fiber, phase) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    clearPendingPhaseMeasurement();

    if (!beginFiberMark(fiber, phase)) {
      return;
    }

    currentPhaseFiber = fiber;
    currentPhase = phase;
  }
}
function stopPhaseTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    if (currentPhase !== null && currentPhaseFiber !== null) {
      var warning = hasScheduledUpdateInCurrentPhase
        ? "Scheduled a cascading update"
        : null;
      endFiberMark(currentPhaseFiber, currentPhase, warning);
    }

    currentPhase = null;
    currentPhaseFiber = null;
  }
}
function startWorkLoopTimer(nextUnitOfWork) {
  if (enableUserTimingAPI) {
    currentFiber = nextUnitOfWork;

    if (!supportsUserTiming) {
      return;
    }

    commitCountInCurrentWorkLoop = 0; // This is top level call.
    // Any other measurements are performed within.

    beginMark("(React Tree Reconciliation)"); // Resume any measurements that were in progress during the last loop.

    resumeTimers();
  }
}
function stopWorkLoopTimer(interruptedBy, didCompleteRoot) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    var warning = null;

    if (interruptedBy !== null) {
      if (interruptedBy.tag === HostRoot) {
        warning = "A top-level update interrupted the previous render";
      } else {
        var componentName = getComponentName(interruptedBy.type) || "Unknown";
        warning =
          "An update to " + componentName + " interrupted the previous render";
      }
    } else if (commitCountInCurrentWorkLoop > 1) {
      warning = "There were cascading updates";
    }

    commitCountInCurrentWorkLoop = 0;
    var label = didCompleteRoot
      ? "(React Tree Reconciliation: Completed Root)"
      : "(React Tree Reconciliation: Yielded)"; // Pause any measurements until the next loop.

    pauseTimers();
    endMark(label, "(React Tree Reconciliation)", warning);
  }
}
function startCommitTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    isCommitting = true;
    hasScheduledUpdateInCurrentCommit = false;
    labelsInCurrentCommit.clear();
    beginMark("(Committing Changes)");
  }
}
function stopCommitTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    var warning = null;

    if (hasScheduledUpdateInCurrentCommit) {
      warning = "Lifecycle hook scheduled a cascading update";
    } else if (commitCountInCurrentWorkLoop > 0) {
      warning = "Caused by a cascading update in earlier commit";
    }

    hasScheduledUpdateInCurrentCommit = false;
    commitCountInCurrentWorkLoop++;
    isCommitting = false;
    labelsInCurrentCommit.clear();
    endMark("(Committing Changes)", "(Committing Changes)", warning);
  }
}
function startCommitSnapshotEffectsTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    effectCountInCurrentCommit = 0;
    beginMark("(Committing Snapshot Effects)");
  }
}
function stopCommitSnapshotEffectsTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    var count = effectCountInCurrentCommit;
    effectCountInCurrentCommit = 0;
    endMark(
      "(Committing Snapshot Effects: " + count + " Total)",
      "(Committing Snapshot Effects)",
      null
    );
  }
}
function startCommitHostEffectsTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    effectCountInCurrentCommit = 0;
    beginMark("(Committing Host Effects)");
  }
}
function stopCommitHostEffectsTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    var count = effectCountInCurrentCommit;
    effectCountInCurrentCommit = 0;
    endMark(
      "(Committing Host Effects: " + count + " Total)",
      "(Committing Host Effects)",
      null
    );
  }
}
function startCommitLifeCyclesTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    effectCountInCurrentCommit = 0;
    beginMark("(Calling Lifecycle Methods)");
  }
}
function stopCommitLifeCyclesTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    var count = effectCountInCurrentCommit;
    effectCountInCurrentCommit = 0;
    endMark(
      "(Calling Lifecycle Methods: " + count + " Total)",
      "(Calling Lifecycle Methods)",
      null
    );
  }
}

var valueStack = [];
var index = -1;

function createCursor(defaultValue) {
  return {
    current: defaultValue
  };
}

function pop(cursor, fiber) {
  if (index < 0) {
    return;
  }

  cursor.current = valueStack[index];
  valueStack[index] = null;

  index--;
}

function push(cursor, value, fiber) {
  index++;
  valueStack[index] = cursor.current;

  cursor.current = value;
}

var emptyContextObject = {};

var contextStackCursor = createCursor(emptyContextObject); // A cursor to a boolean indicating whether the context has changed.

var didPerformWorkStackCursor = createCursor(false); // Keep track of the previous context object that was on the stack.
// We use this to get access to the parent context after we have already
// pushed the next context provider, and now need to merge their contexts.

var previousContext = emptyContextObject;

function getUnmaskedContext(
  workInProgress,
  Component,
  didPushOwnContextIfProvider
) {
  if (disableLegacyContext) {
    return emptyContextObject;
  } else {
    if (didPushOwnContextIfProvider && isContextProvider(Component)) {
      // If the fiber is a context provider itself, when we read its context
      // we may have already pushed its own child context on the stack. A context
      // provider should not "see" its own child context. Therefore we read the
      // previous (parent) context instead for a context provider.
      return previousContext;
    }

    return contextStackCursor.current;
  }
}

function cacheContext(workInProgress, unmaskedContext, maskedContext) {
  if (disableLegacyContext) {
    return;
  } else {
    var instance = workInProgress.stateNode;
    instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
    instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
  }
}

function getMaskedContext(workInProgress, unmaskedContext) {
  if (disableLegacyContext) {
    return emptyContextObject;
  } else {
    var type = workInProgress.type;
    var contextTypes = type.contextTypes;

    if (!contextTypes) {
      return emptyContextObject;
    } // Avoid recreating masked context unless unmasked context has changed.
    // Failing to do this will result in unnecessary calls to componentWillReceiveProps.
    // This may trigger infinite loops if componentWillReceiveProps calls setState.

    var instance = workInProgress.stateNode;

    if (
      instance &&
      instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext
    ) {
      return instance.__reactInternalMemoizedMaskedChildContext;
    }

    var context = {};

    for (var key in contextTypes) {
      context[key] = unmaskedContext[key];
    }

    if (instance) {
      cacheContext(workInProgress, unmaskedContext, context);
    }

    return context;
  }
}

function hasContextChanged() {
  if (disableLegacyContext) {
    return false;
  } else {
    return didPerformWorkStackCursor.current;
  }
}

function isContextProvider(type) {
  if (disableLegacyContext) {
    return false;
  } else {
    var childContextTypes = type.childContextTypes;
    return childContextTypes !== null && childContextTypes !== undefined;
  }
}

function popContext(fiber) {
  if (disableLegacyContext) {
    return;
  } else {
    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }
}

function popTopLevelContextObject(fiber) {
  if (disableLegacyContext) {
    return;
  } else {
    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }
}

function pushTopLevelContextObject(fiber, context, didChange) {
  if (disableLegacyContext) {
    return;
  } else {
    (function() {
      if (!(contextStackCursor.current === emptyContextObject)) {
        throw ReactError(
          Error(
            "Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();

    push(contextStackCursor, context, fiber);
    push(didPerformWorkStackCursor, didChange, fiber);
  }
}

function processChildContext(fiber, type, parentContext) {
  if (disableLegacyContext) {
    return parentContext;
  } else {
    var instance = fiber.stateNode;
    var childContextTypes = type.childContextTypes; // TODO (bvaughn) Replace this behavior with an invariant() in the future.
    // It has only been added in Fiber to match the (unintentional) behavior in Stack.

    if (typeof instance.getChildContext !== "function") {
      return parentContext;
    }

    var childContext;

    startPhaseTimer(fiber, "getChildContext");
    childContext = instance.getChildContext();
    stopPhaseTimer();

    for (var contextKey in childContext) {
      (function() {
        if (!(contextKey in childContextTypes)) {
          throw ReactError(
            Error(
              (getComponentName(type) || "Unknown") +
                '.getChildContext(): key "' +
                contextKey +
                '" is not defined in childContextTypes.'
            )
          );
        }
      })();
    }

    return Object.assign({}, parentContext, {}, childContext);
  }
}

function pushContextProvider(workInProgress) {
  if (disableLegacyContext) {
    return false;
  } else {
    var instance = workInProgress.stateNode; // We push the context as early as possible to ensure stack integrity.
    // If the instance does not exist yet, we will push null at first,
    // and replace it on the stack later when invalidating the context.

    var memoizedMergedChildContext =
      (instance && instance.__reactInternalMemoizedMergedChildContext) ||
      emptyContextObject; // Remember the parent context so we can merge with it later.
    // Inherit the parent's did-perform-work value to avoid inadvertently blocking updates.

    previousContext = contextStackCursor.current;
    push(contextStackCursor, memoizedMergedChildContext, workInProgress);
    push(
      didPerformWorkStackCursor,
      didPerformWorkStackCursor.current,
      workInProgress
    );
    return true;
  }
}

function invalidateContextProvider(workInProgress, type, didChange) {
  if (disableLegacyContext) {
    return;
  } else {
    var instance = workInProgress.stateNode;

    (function() {
      if (!instance) {
        throw ReactError(
          Error(
            "Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();

    if (didChange) {
      // Merge parent and own context.
      // Skip this if we're not updating due to sCU.
      // This avoids unnecessarily recomputing memoized values.
      var mergedContext = processChildContext(
        workInProgress,
        type,
        previousContext
      );
      instance.__reactInternalMemoizedMergedChildContext = mergedContext; // Replace the old (or empty) context with the new one.
      // It is important to unwind the context in the reverse order.

      pop(didPerformWorkStackCursor, workInProgress);
      pop(contextStackCursor, workInProgress); // Now push the new context and mark that it has changed.

      push(contextStackCursor, mergedContext, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    } else {
      pop(didPerformWorkStackCursor, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    }
  }
}

function findCurrentUnmaskedContext(fiber) {
  if (disableLegacyContext) {
    return emptyContextObject;
  } else {
    // Currently this is only used with renderSubtreeIntoContainer; not sure if it
    // makes sense elsewhere
    (function() {
      if (!(isFiberMounted(fiber) && fiber.tag === ClassComponent)) {
        throw ReactError(
          Error(
            "Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();

    var node = fiber;

    do {
      switch (node.tag) {
        case HostRoot:
          return node.stateNode.context;

        case ClassComponent: {
          var Component = node.type;

          if (isContextProvider(Component)) {
            return node.stateNode.__reactInternalMemoizedMergedChildContext;
          }

          break;
        }
      }

      node = node.return;
    } while (node !== null);

    (function() {
      {
        throw ReactError(
          Error(
            "Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();
  }
}

var LegacyRoot = 0;
var BatchedRoot = 1;
var ConcurrentRoot = 2;

// Intentionally not named imports because Rollup would use dynamic dispatch for
// CommonJS interop named imports.
var Scheduler_runWithPriority = Scheduler.unstable_runWithPriority;
var Scheduler_scheduleCallback = Scheduler.unstable_scheduleCallback;
var Scheduler_cancelCallback = Scheduler.unstable_cancelCallback;
var Scheduler_shouldYield = Scheduler.unstable_shouldYield;
var Scheduler_requestPaint = Scheduler.unstable_requestPaint;
var Scheduler_now = Scheduler.unstable_now;
var Scheduler_getCurrentPriorityLevel =
  Scheduler.unstable_getCurrentPriorityLevel;
var Scheduler_ImmediatePriority = Scheduler.unstable_ImmediatePriority;
var Scheduler_UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
var Scheduler_NormalPriority = Scheduler.unstable_NormalPriority;
var Scheduler_LowPriority = Scheduler.unstable_LowPriority;
var Scheduler_IdlePriority = Scheduler.unstable_IdlePriority;

if (enableSchedulerTracing) {
  // Provide explicit error message when production+profiling bundle of e.g.
  // react-dom is used with production (non-profiling) bundle of
  // scheduler/tracing
  (function() {
    if (
      !(
        tracing.__interactionsRef != null &&
        tracing.__interactionsRef.current != null
      )
    ) {
      throw ReactError(
        Error(
          "It is not supported to run the profiling version of a renderer (for example, `react-dom/profiling`) without also replacing the `scheduler/tracing` module with `scheduler/tracing-profiling`. Your bundler might have a setting for aliasing both modules. Learn more at http://fb.me/react-profiling"
        )
      );
    }
  })();
}

var fakeCallbackNode = {}; // Except for NoPriority, these correspond to Scheduler priorities. We use
// ascending numbers so we can compare them like numbers. They start at 90 to
// avoid clashing with Scheduler's priorities.

var ImmediatePriority = 99;
var UserBlockingPriority = 98;
var NormalPriority = 97;
var LowPriority = 96;
var IdlePriority = 95; // NoPriority is the absence of priority. Also React-only.

var NoPriority = 90;
var shouldYield = Scheduler_shouldYield;
var requestPaint = // Fall back gracefully if we're running an older version of Scheduler.
  Scheduler_requestPaint !== undefined ? Scheduler_requestPaint : function() {};
var syncQueue = null;
var immediateQueueCallbackNode = null;
var isFlushingSyncQueue = false;
var initialTimeMs = Scheduler_now(); // If the initial timestamp is reasonably small, use Scheduler's `now` directly.
// This will be the case for modern browsers that support `performance.now`. In
// older browsers, Scheduler falls back to `Date.now`, which returns a Unix
// timestamp. In that case, subtract the module initialization time to simulate
// the behavior of performance.now and keep our times small enough to fit
// within 32 bits.
// TODO: Consider lifting this into Scheduler.

var now =
  initialTimeMs < 10000
    ? Scheduler_now
    : function() {
        return Scheduler_now() - initialTimeMs;
      };
function getCurrentPriorityLevel() {
  switch (Scheduler_getCurrentPriorityLevel()) {
    case Scheduler_ImmediatePriority:
      return ImmediatePriority;

    case Scheduler_UserBlockingPriority:
      return UserBlockingPriority;

    case Scheduler_NormalPriority:
      return NormalPriority;

    case Scheduler_LowPriority:
      return LowPriority;

    case Scheduler_IdlePriority:
      return IdlePriority;

    default:
      (function() {
        {
          throw ReactError(Error("Unknown priority level."));
        }
      })();
  }
}

function reactPriorityToSchedulerPriority(reactPriorityLevel) {
  switch (reactPriorityLevel) {
    case ImmediatePriority:
      return Scheduler_ImmediatePriority;

    case UserBlockingPriority:
      return Scheduler_UserBlockingPriority;

    case NormalPriority:
      return Scheduler_NormalPriority;

    case LowPriority:
      return Scheduler_LowPriority;

    case IdlePriority:
      return Scheduler_IdlePriority;

    default:
      (function() {
        {
          throw ReactError(Error("Unknown priority level."));
        }
      })();
  }
}

function runWithPriority(reactPriorityLevel, fn) {
  var priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_runWithPriority(priorityLevel, fn);
}
function scheduleCallback(reactPriorityLevel, callback, options) {
  var priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
  return Scheduler_scheduleCallback(priorityLevel, callback, options);
}
function scheduleSyncCallback(callback) {
  // Push this callback into an internal queue. We'll flush these either in
  // the next tick, or earlier if something calls `flushSyncCallbackQueue`.
  if (syncQueue === null) {
    syncQueue = [callback]; // Flush the queue in the next tick, at the earliest.

    immediateQueueCallbackNode = Scheduler_scheduleCallback(
      Scheduler_ImmediatePriority,
      flushSyncCallbackQueueImpl
    );
  } else {
    // Push onto existing queue. Don't need to schedule a callback because
    // we already scheduled one when we created the queue.
    syncQueue.push(callback);
  }

  return fakeCallbackNode;
}
function cancelCallback(callbackNode) {
  if (callbackNode !== fakeCallbackNode) {
    Scheduler_cancelCallback(callbackNode);
  }
}
function flushSyncCallbackQueue() {
  if (immediateQueueCallbackNode !== null) {
    var node = immediateQueueCallbackNode;
    immediateQueueCallbackNode = null;
    Scheduler_cancelCallback(node);
  }

  flushSyncCallbackQueueImpl();
}

function flushSyncCallbackQueueImpl() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    // Prevent re-entrancy.
    isFlushingSyncQueue = true;
    var i = 0;

    try {
      var _isSync = true;
      var queue = syncQueue;
      runWithPriority(ImmediatePriority, function() {
        for (; i < queue.length; i++) {
          var callback = queue[i];

          do {
            callback = callback(_isSync);
          } while (callback !== null);
        }
      });
      syncQueue = null;
    } catch (error) {
      // If something throws, leave the remaining callbacks on the queue.
      if (syncQueue !== null) {
        syncQueue = syncQueue.slice(i + 1);
      } // Resume flushing in the next tick

      Scheduler_scheduleCallback(
        Scheduler_ImmediatePriority,
        flushSyncCallbackQueue
      );
      throw error;
    } finally {
      isFlushingSyncQueue = false;
    }
  }
}

var NoMode = 0;
var StrictMode = 1; // TODO: Remove BatchedMode and ConcurrentMode by reading from the root
// tag instead

var BatchedMode = 2;
var ConcurrentMode = 4;
var ProfileMode = 8;

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var MAX_SIGNED_31_BIT_INT = 1073741823;

var NoWork = 0;
var Never = 1;
var Sync = MAX_SIGNED_31_BIT_INT;
var Batched = Sync - 1;
var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = Batched - 1; // 1 unit of expiration time represents 10ms.

function msToExpirationTime(ms) {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}
function expirationTimeToMs(expirationTime) {
  return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
}

function ceiling(num, precision) {
  return (((num / precision) | 0) + 1) * precision;
}

function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE
    )
  );
} // TODO: This corresponds to Scheduler's NormalPriority, not LowPriority. Update
// the names to reflect.

var LOW_PRIORITY_EXPIRATION = 5000;
var LOW_PRIORITY_BATCH_SIZE = 250;
function computeAsyncExpiration(currentTime) {
  return computeExpirationBucket(
    currentTime,
    LOW_PRIORITY_EXPIRATION,
    LOW_PRIORITY_BATCH_SIZE
  );
}
function computeSuspenseExpiration(currentTime, timeoutMs) {
  // TODO: Should we warn if timeoutMs is lower than the normal pri expiration time?
  return computeExpirationBucket(
    currentTime,
    timeoutMs,
    LOW_PRIORITY_BATCH_SIZE
  );
} // We intentionally set a higher expiration time for interactive updates in
// dev than in production.
//
// If the main thread is being blocked so long that you hit the expiration,
// it's a problem that could be solved with better scheduling.
//
// People will be more likely to notice this and fix it with the long
// expiration time in development.
//
// In production we opt for better UX at the risk of masking scheduling
// problems, by expiring fast.

var HIGH_PRIORITY_EXPIRATION = 150;
var HIGH_PRIORITY_BATCH_SIZE = 100;
function computeInteractiveExpiration(currentTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE
  );
}
function inferPriorityFromExpirationTime(currentTime, expirationTime) {
  if (expirationTime === Sync) {
    return ImmediatePriority;
  }

  if (expirationTime === Never) {
    return IdlePriority;
  }

  var msUntil =
    expirationTimeToMs(expirationTime) - expirationTimeToMs(currentTime);

  if (msUntil <= 0) {
    return ImmediatePriority;
  }

  if (msUntil <= HIGH_PRIORITY_EXPIRATION + HIGH_PRIORITY_BATCH_SIZE) {
    return UserBlockingPriority;
  }

  if (msUntil <= LOW_PRIORITY_EXPIRATION + LOW_PRIORITY_BATCH_SIZE) {
    return NormalPriority;
  } // TODO: Handle LowPriority
  // Assume anything lower has idle priority

  return IdlePriority;
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */

function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  } // Test for A's keys different from B.

  for (var i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

function resolveDefaultProps(Component, baseProps) {
  if (Component && Component.defaultProps) {
    // Resolve default props. Taken from ReactElement
    var props = Object.assign({}, baseProps);
    var defaultProps = Component.defaultProps;

    for (var propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }

    return props;
  }

  return baseProps;
}
function readLazyComponentType(lazyComponent) {
  initializeLazyComponentType(lazyComponent);

  if (lazyComponent._status !== Resolved) {
    throw lazyComponent._result;
  }

  return lazyComponent._result;
}

var valueCursor = createCursor(null);
var currentlyRenderingFiber = null;
var lastContextDependency = null;
var lastContextWithAllBitsObserved = null;
function resetContextDependencies() {
  // This is called right before React yields execution, to ensure `readContext`
  // cannot be called outside the render phase.
  currentlyRenderingFiber = null;
  lastContextDependency = null;
  lastContextWithAllBitsObserved = null;
}

function pushProvider(providerFiber, nextValue) {
  var context = providerFiber.type._context;

  if (isPrimaryRenderer) {
    push(valueCursor, context._currentValue, providerFiber);
    context._currentValue = nextValue;
  } else {
    push(valueCursor, context._currentValue2, providerFiber);
    context._currentValue2 = nextValue;
  }
}
function popProvider(providerFiber) {
  var currentValue = valueCursor.current;
  pop(valueCursor, providerFiber);
  var context = providerFiber.type._context;

  if (isPrimaryRenderer) {
    context._currentValue = currentValue;
  } else {
    context._currentValue2 = currentValue;
  }
}
function calculateChangedBits(context, newValue, oldValue) {
  if (is(oldValue, newValue)) {
    // No change
    return 0;
  } else {
    var changedBits =
      typeof context._calculateChangedBits === "function"
        ? context._calculateChangedBits(oldValue, newValue)
        : MAX_SIGNED_31_BIT_INT;

    return changedBits | 0;
  }
}
function scheduleWorkOnParentPath(parent, renderExpirationTime) {
  // Update the child expiration time of all the ancestors, including
  // the alternates.
  var node = parent;

  while (node !== null) {
    var alternate = node.alternate;

    if (node.childExpirationTime < renderExpirationTime) {
      node.childExpirationTime = renderExpirationTime;

      if (
        alternate !== null &&
        alternate.childExpirationTime < renderExpirationTime
      ) {
        alternate.childExpirationTime = renderExpirationTime;
      }
    } else if (
      alternate !== null &&
      alternate.childExpirationTime < renderExpirationTime
    ) {
      alternate.childExpirationTime = renderExpirationTime;
    } else {
      // Neither alternate was updated, which means the rest of the
      // ancestor path already has sufficient priority.
      break;
    }

    node = node.return;
  }
}
function propagateContextChange(
  workInProgress,
  context,
  changedBits,
  renderExpirationTime
) {
  var fiber = workInProgress.child;

  if (fiber !== null) {
    // Set the return pointer of the child to the work-in-progress fiber.
    fiber.return = workInProgress;
  }

  while (fiber !== null) {
    var nextFiber = void 0; // Visit this fiber.

    var list = fiber.dependencies;

    if (list !== null) {
      nextFiber = fiber.child;
      var dependency = list.firstContext;

      while (dependency !== null) {
        // Check if the context matches.
        if (
          dependency.context === context &&
          (dependency.observedBits & changedBits) !== 0
        ) {
          // Match! Schedule an update on this fiber.
          if (fiber.tag === ClassComponent) {
            // Schedule a force update on the work-in-progress.
            var update = createUpdate(renderExpirationTime, null);
            update.tag = ForceUpdate; // TODO: Because we don't have a work-in-progress, this will add the
            // update to the current fiber, too, which means it will persist even if
            // this render is thrown away. Since it's a race condition, not sure it's
            // worth fixing.

            enqueueUpdate(fiber, update);
          }

          if (fiber.expirationTime < renderExpirationTime) {
            fiber.expirationTime = renderExpirationTime;
          }

          var alternate = fiber.alternate;

          if (
            alternate !== null &&
            alternate.expirationTime < renderExpirationTime
          ) {
            alternate.expirationTime = renderExpirationTime;
          }

          scheduleWorkOnParentPath(fiber.return, renderExpirationTime); // Mark the expiration time on the list, too.

          if (list.expirationTime < renderExpirationTime) {
            list.expirationTime = renderExpirationTime;
          } // Since we already found a match, we can stop traversing the
          // dependency list.

          break;
        }

        dependency = dependency.next;
      }
    } else if (fiber.tag === ContextProvider) {
      // Don't scan deeper if this is a matching provider
      nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
    } else if (
      enableSuspenseServerRenderer &&
      fiber.tag === DehydratedFragment
    ) {
      // If a dehydrated suspense bounudary is in this subtree, we don't know
      // if it will have any context consumers in it. The best we can do is
      // mark it as having updates.
      var parentSuspense = fiber.return;

      (function() {
        if (!(parentSuspense !== null)) {
          throw ReactError(
            Error(
              "We just came from a parent so we must have had a parent. This is a bug in React."
            )
          );
        }
      })();

      if (parentSuspense.expirationTime < renderExpirationTime) {
        parentSuspense.expirationTime = renderExpirationTime;
      }

      var _alternate = parentSuspense.alternate;

      if (
        _alternate !== null &&
        _alternate.expirationTime < renderExpirationTime
      ) {
        _alternate.expirationTime = renderExpirationTime;
      } // This is intentionally passing this fiber as the parent
      // because we want to schedule this fiber as having work
      // on its children. We'll use the childExpirationTime on
      // this fiber to indicate that a context has changed.

      scheduleWorkOnParentPath(parentSuspense, renderExpirationTime);
      nextFiber = fiber.sibling;
    } else {
      // Traverse down.
      nextFiber = fiber.child;
    }

    if (nextFiber !== null) {
      // Set the return pointer of the child to the work-in-progress fiber.
      nextFiber.return = fiber;
    } else {
      // No child. Traverse to next sibling.
      nextFiber = fiber;

      while (nextFiber !== null) {
        if (nextFiber === workInProgress) {
          // We're back to the root of this subtree. Exit.
          nextFiber = null;
          break;
        }

        var sibling = nextFiber.sibling;

        if (sibling !== null) {
          // Set the return pointer of the sibling to the work-in-progress fiber.
          sibling.return = nextFiber.return;
          nextFiber = sibling;
          break;
        } // No more siblings. Traverse up.

        nextFiber = nextFiber.return;
      }
    }

    fiber = nextFiber;
  }
}
function prepareToReadContext(workInProgress, renderExpirationTime) {
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  lastContextWithAllBitsObserved = null;
  var dependencies = workInProgress.dependencies;

  if (dependencies !== null) {
    var firstContext = dependencies.firstContext;

    if (firstContext !== null) {
      if (dependencies.expirationTime >= renderExpirationTime) {
        // Context list has a pending update. Mark that this fiber performed work.
        markWorkInProgressReceivedUpdate();
      } // Reset the work-in-progress list

      dependencies.firstContext = null;
    }
  }
}
function readContext(context, observedBits) {
  if (lastContextWithAllBitsObserved === context) {
    // Nothing to do. We already observe everything in this context.
  } else if (observedBits === false || observedBits === 0) {
    // Do not observe any updates.
  } else {
    var resolvedObservedBits; // Avoid deopting on observable arguments or heterogeneous types.

    if (
      typeof observedBits !== "number" ||
      observedBits === MAX_SIGNED_31_BIT_INT
    ) {
      // Observe all updates.
      lastContextWithAllBitsObserved = context;
      resolvedObservedBits = MAX_SIGNED_31_BIT_INT;
    } else {
      resolvedObservedBits = observedBits;
    }

    var contextItem = {
      context: context,
      observedBits: resolvedObservedBits,
      next: null
    };

    if (lastContextDependency === null) {
      (function() {
        if (!(currentlyRenderingFiber !== null)) {
          throw ReactError(
            Error(
              "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
            )
          );
        }
      })(); // This is the first dependency for this component. Create a new list.

      lastContextDependency = contextItem;
      currentlyRenderingFiber.dependencies = {
        expirationTime: NoWork,
        firstContext: contextItem,
        responders: null
      };
    } else {
      // Append a new context item.
      lastContextDependency = lastContextDependency.next = contextItem;
    }
  }

  return isPrimaryRenderer ? context._currentValue : context._currentValue2;
}

// UpdateQueue is a linked list of prioritized updates.
//
// Like fibers, update queues come in pairs: a current queue, which represents
// the visible state of the screen, and a work-in-progress queue, which can be
// mutated and processed asynchronously before it is committed — a form of
// double buffering. If a work-in-progress render is discarded before finishing,
// we create a new work-in-progress by cloning the current queue.
//
// Both queues share a persistent, singly-linked list structure. To schedule an
// update, we append it to the end of both queues. Each queue maintains a
// pointer to first update in the persistent list that hasn't been processed.
// The work-in-progress pointer always has a position equal to or greater than
// the current queue, since we always work on that one. The current queue's
// pointer is only updated during the commit phase, when we swap in the
// work-in-progress.
//
// For example:
//
//   Current pointer:           A - B - C - D - E - F
//   Work-in-progress pointer:              D - E - F
//                                          ^
//                                          The work-in-progress queue has
//                                          processed more updates than current.
//
// The reason we append to both queues is because otherwise we might drop
// updates without ever processing them. For example, if we only add updates to
// the work-in-progress queue, some updates could be lost whenever a work-in
// -progress render restarts by cloning from current. Similarly, if we only add
// updates to the current queue, the updates will be lost whenever an already
// in-progress queue commits and swaps with the current queue. However, by
// adding to both queues, we guarantee that the update will be part of the next
// work-in-progress. (And because the work-in-progress queue becomes the
// current queue once it commits, there's no danger of applying the same
// update twice.)
//
// Prioritization
// --------------
//
// Updates are not sorted by priority, but by insertion; new updates are always
// appended to the end of the list.
//
// The priority is still important, though. When processing the update queue
// during the render phase, only the updates with sufficient priority are
// included in the result. If we skip an update because it has insufficient
// priority, it remains in the queue to be processed later, during a lower
// priority render. Crucially, all updates subsequent to a skipped update also
// remain in the queue *regardless of their priority*. That means high priority
// updates are sometimes processed twice, at two separate priorities. We also
// keep track of a base state, that represents the state before the first
// update in the queue is applied.
//
// For example:
//
//   Given a base state of '', and the following queue of updates
//
//     A1 - B2 - C1 - D2
//
//   where the number indicates the priority, and the update is applied to the
//   previous state by appending a letter, React will process these updates as
//   two separate renders, one per distinct priority level:
//
//   First render, at priority 1:
//     Base state: ''
//     Updates: [A1, C1]
//     Result state: 'AC'
//
//   Second render, at priority 2:
//     Base state: 'A'            <-  The base state does not include C1,
//                                    because B2 was skipped.
//     Updates: [B2, C1, D2]      <-  C1 was rebased on top of B2
//     Result state: 'ABCD'
//
// Because we process updates in insertion order, and rebase high priority
// updates when preceding updates are skipped, the final result is deterministic
// regardless of priority. Intermediate state may vary according to system
// resources, but the final state is always the same.
var UpdateState = 0;
var ReplaceState = 1;
var ForceUpdate = 2;
var CaptureUpdate = 3; // Global state that is reset at the beginning of calling `processUpdateQueue`.
// It should only be read right after calling `processUpdateQueue`, via
// `checkHasForceUpdateAfterProcessing`.

var hasForceUpdate = false;

function createUpdateQueue(baseState) {
  var queue = {
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
  return queue;
}

function cloneUpdateQueue(currentQueue) {
  var queue = {
    baseState: currentQueue.baseState,
    firstUpdate: currentQueue.firstUpdate,
    lastUpdate: currentQueue.lastUpdate,
    // TODO: With resuming, if we bail out and resuse the child tree, we should
    // keep these effects.
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null
  };
  return queue;
}

function createUpdate(expirationTime, suspenseConfig) {
  var update = {
    expirationTime: expirationTime,
    suspenseConfig: suspenseConfig,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
    nextEffect: null
  };

  return update;
}

function appendUpdateToQueue(queue, update) {
  // Append the update to the end of the list.
  if (queue.lastUpdate === null) {
    // Queue is empty
    queue.firstUpdate = queue.lastUpdate = update;
  } else {
    queue.lastUpdate.next = update;
    queue.lastUpdate = update;
  }
}

function enqueueUpdate(fiber, update) {
  // Update queues are created lazily.
  var alternate = fiber.alternate;
  var queue1;
  var queue2;

  if (alternate === null) {
    // There's only one fiber.
    queue1 = fiber.updateQueue;
    queue2 = null;

    if (queue1 === null) {
      queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
    }
  } else {
    // There are two owners.
    queue1 = fiber.updateQueue;
    queue2 = alternate.updateQueue;

    if (queue1 === null) {
      if (queue2 === null) {
        // Neither fiber has an update queue. Create new ones.
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
        queue2 = alternate.updateQueue = createUpdateQueue(
          alternate.memoizedState
        );
      } else {
        // Only one fiber has an update queue. Clone to create a new one.
        queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
      }
    } else {
      if (queue2 === null) {
        // Only one fiber has an update queue. Clone to create a new one.
        queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
      } else {
        // Both owners have an update queue.
      }
    }
  }

  if (queue2 === null || queue1 === queue2) {
    // There's only a single queue.
    appendUpdateToQueue(queue1, update);
  } else {
    // There are two queues. We need to append the update to both queues,
    // while accounting for the persistent structure of the list — we don't
    // want the same update to be added multiple times.
    if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
      // One of the queues is not empty. We must add the update to both queues.
      appendUpdateToQueue(queue1, update);
      appendUpdateToQueue(queue2, update);
    } else {
      // Both queues are non-empty. The last update is the same in both lists,
      // because of structural sharing. So, only append to one of the lists.
      appendUpdateToQueue(queue1, update); // But we still need to update the `lastUpdate` pointer of queue2.

      queue2.lastUpdate = update;
    }
  }
}
function enqueueCapturedUpdate(workInProgress, update) {
  // Captured updates go into a separate list, and only on the work-in-
  // progress queue.
  var workInProgressQueue = workInProgress.updateQueue;

  if (workInProgressQueue === null) {
    workInProgressQueue = workInProgress.updateQueue = createUpdateQueue(
      workInProgress.memoizedState
    );
  } else {
    // TODO: I put this here rather than createWorkInProgress so that we don't
    // clone the queue unnecessarily. There's probably a better way to
    // structure this.
    workInProgressQueue = ensureWorkInProgressQueueIsAClone(
      workInProgress,
      workInProgressQueue
    );
  } // Append the update to the end of the list.

  if (workInProgressQueue.lastCapturedUpdate === null) {
    // This is the first render phase update
    workInProgressQueue.firstCapturedUpdate = workInProgressQueue.lastCapturedUpdate = update;
  } else {
    workInProgressQueue.lastCapturedUpdate.next = update;
    workInProgressQueue.lastCapturedUpdate = update;
  }
}

function ensureWorkInProgressQueueIsAClone(workInProgress, queue) {
  var current = workInProgress.alternate;

  if (current !== null) {
    // If the work-in-progress queue is equal to the current queue,
    // we need to clone it first.
    if (queue === current.updateQueue) {
      queue = workInProgress.updateQueue = cloneUpdateQueue(queue);
    }
  }

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
    case ReplaceState: {
      var payload = update.payload;

      if (typeof payload === "function") {
        // Updater function
        var nextState = payload.call(instance, prevState, nextProps);

        return nextState;
      } // State object

      return payload;
    }

    case CaptureUpdate: {
      workInProgress.effectTag =
        (workInProgress.effectTag & ~ShouldCapture) | DidCapture;
    }
    // Intentional fallthrough

    case UpdateState: {
      var _payload = update.payload;
      var partialState;

      if (typeof _payload === "function") {
        // Updater function
        partialState = _payload.call(instance, prevState, nextProps);
      } else {
        // Partial state object
        partialState = _payload;
      }

      if (partialState === null || partialState === undefined) {
        // Null and undefined are treated as no-ops.
        return prevState;
      } // Merge the partial state and the previous state.

      return Object.assign({}, prevState, partialState);
    }

    case ForceUpdate: {
      hasForceUpdate = true;
      return prevState;
    }
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
  hasForceUpdate = false;
  queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);

  var newBaseState = queue.baseState;
  var newFirstUpdate = null;
  var newExpirationTime = NoWork; // Iterate through the list of updates to compute the result.

  var update = queue.firstUpdate;
  var resultState = newBaseState;

  while (update !== null) {
    var updateExpirationTime = update.expirationTime;

    if (updateExpirationTime < renderExpirationTime) {
      // This update does not have sufficient priority. Skip it.
      if (newFirstUpdate === null) {
        // This is the first skipped update. It will be the first update in
        // the new list.
        newFirstUpdate = update; // Since this is the first update that was skipped, the current result
        // is the new base state.

        newBaseState = resultState;
      } // Since this update will remain in the list, update the remaining
      // expiration time.

      if (newExpirationTime < updateExpirationTime) {
        newExpirationTime = updateExpirationTime;
      }
    } else {
      // This update does have sufficient priority.
      // Mark the event time of this update as relevant to this render pass.
      // TODO: This should ideally use the true event time of this update rather than
      // its priority which is a derived and not reverseable value.
      // TODO: We should skip this update if it was already committed but currently
      // we have no way of detecting the difference between a committed and suspended
      // update here.
      markRenderEventTimeAndConfig(updateExpirationTime, update.suspenseConfig); // Process it and compute a new result.

      resultState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        resultState,
        props,
        instance
      );
      var callback = update.callback;

      if (callback !== null) {
        workInProgress.effectTag |= Callback; // Set this to null, in case it was mutated during an aborted render.

        update.nextEffect = null;

        if (queue.lastEffect === null) {
          queue.firstEffect = queue.lastEffect = update;
        } else {
          queue.lastEffect.nextEffect = update;
          queue.lastEffect = update;
        }
      }
    } // Continue to the next update.

    update = update.next;
  } // Separately, iterate though the list of captured updates.

  var newFirstCapturedUpdate = null;
  update = queue.firstCapturedUpdate;

  while (update !== null) {
    var _updateExpirationTime = update.expirationTime;

    if (_updateExpirationTime < renderExpirationTime) {
      // This update does not have sufficient priority. Skip it.
      if (newFirstCapturedUpdate === null) {
        // This is the first skipped captured update. It will be the first
        // update in the new list.
        newFirstCapturedUpdate = update; // If this is the first update that was skipped, the current result is
        // the new base state.

        if (newFirstUpdate === null) {
          newBaseState = resultState;
        }
      } // Since this update will remain in the list, update the remaining
      // expiration time.

      if (newExpirationTime < _updateExpirationTime) {
        newExpirationTime = _updateExpirationTime;
      }
    } else {
      // This update does have sufficient priority. Process it and compute
      // a new result.
      resultState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        resultState,
        props,
        instance
      );
      var _callback = update.callback;

      if (_callback !== null) {
        workInProgress.effectTag |= Callback; // Set this to null, in case it was mutated during an aborted render.

        update.nextEffect = null;

        if (queue.lastCapturedEffect === null) {
          queue.firstCapturedEffect = queue.lastCapturedEffect = update;
        } else {
          queue.lastCapturedEffect.nextEffect = update;
          queue.lastCapturedEffect = update;
        }
      }
    }

    update = update.next;
  }

  if (newFirstUpdate === null) {
    queue.lastUpdate = null;
  }

  if (newFirstCapturedUpdate === null) {
    queue.lastCapturedUpdate = null;
  } else {
    workInProgress.effectTag |= Callback;
  }

  if (newFirstUpdate === null && newFirstCapturedUpdate === null) {
    // We processed every update, without skipping. That means the new base
    // state is the same as the result state.
    newBaseState = resultState;
  }

  queue.baseState = newBaseState;
  queue.firstUpdate = newFirstUpdate;
  queue.firstCapturedUpdate = newFirstCapturedUpdate; // Set the remaining expiration time to be whatever is remaining in the queue.
  // This should be fine because the only two other things that contribute to
  // expiration time are props and context. We're already in the middle of the
  // begin phase by the time we start processing the queue, so we've already
  // dealt with the props. Context in components that specify
  // shouldComponentUpdate is tricky; but we'll have to account for
  // that regardless.

  workInProgress.expirationTime = newExpirationTime;
  workInProgress.memoizedState = resultState;
}

function callCallback(callback, context) {
  (function() {
    if (!(typeof callback === "function")) {
      throw ReactError(
        Error(
          "Invalid argument passed as callback. Expected a function. Instead received: " +
            callback
        )
      );
    }
  })();

  callback.call(context);
}

function resetHasForceUpdateBeforeProcessing() {
  hasForceUpdate = false;
}
function checkHasForceUpdateAfterProcessing() {
  return hasForceUpdate;
}
function commitUpdateQueue(
  finishedWork,
  finishedQueue,
  instance,
  renderExpirationTime
) {
  // If the finished render included captured updates, and there are still
  // lower priority updates left over, we need to keep the captured updates
  // in the queue so that they are rebased and not dropped once we process the
  // queue again at the lower priority.
  if (finishedQueue.firstCapturedUpdate !== null) {
    // Join the captured update list to the end of the normal list.
    if (finishedQueue.lastUpdate !== null) {
      finishedQueue.lastUpdate.next = finishedQueue.firstCapturedUpdate;
      finishedQueue.lastUpdate = finishedQueue.lastCapturedUpdate;
    } // Clear the list of captured updates.

    finishedQueue.firstCapturedUpdate = finishedQueue.lastCapturedUpdate = null;
  } // Commit the effects

  commitUpdateEffects(finishedQueue.firstEffect, instance);
  finishedQueue.firstEffect = finishedQueue.lastEffect = null;
  commitUpdateEffects(finishedQueue.firstCapturedEffect, instance);
  finishedQueue.firstCapturedEffect = finishedQueue.lastCapturedEffect = null;
}

function commitUpdateEffects(effect, instance) {
  while (effect !== null) {
    var callback = effect.callback;

    if (callback !== null) {
      effect.callback = null;
      callCallback(callback, instance);
    }

    effect = effect.nextEffect;
  }
}

var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;
function requestCurrentSuspenseConfig() {
  return ReactCurrentBatchConfig.suspense;
}

// We'll use it to determine whether we need to initialize legacy refs.

var emptyRefsObject = new React.Component().refs;
function applyDerivedStateFromProps(
  workInProgress,
  ctor,
  getDerivedStateFromProps,
  nextProps
) {
  var prevState = workInProgress.memoizedState;

  var partialState = getDerivedStateFromProps(nextProps, prevState);

  var memoizedState =
    partialState === null || partialState === undefined
      ? prevState
      : Object.assign({}, prevState, partialState);
  workInProgress.memoizedState = memoizedState; // Once the update queue is empty, persist the derived state onto the
  // base state.

  var updateQueue = workInProgress.updateQueue;

  if (updateQueue !== null && workInProgress.expirationTime === NoWork) {
    updateQueue.baseState = memoizedState;
  }
}
var classComponentUpdater = {
  isMounted: isMounted,
  enqueueSetState: function(inst, payload, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTime();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(
      currentTime,
      fiber,
      suspenseConfig
    );
    var update = createUpdate(expirationTime, suspenseConfig);
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
  enqueueReplaceState: function(inst, payload, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTime();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(
      currentTime,
      fiber,
      suspenseConfig
    );
    var update = createUpdate(expirationTime, suspenseConfig);
    update.tag = ReplaceState;
    update.payload = payload;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
  enqueueForceUpdate: function(inst, callback) {
    var fiber = get(inst);
    var currentTime = requestCurrentTime();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(
      currentTime,
      fiber,
      suspenseConfig
    );
    var update = createUpdate(expirationTime, suspenseConfig);
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
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
  var instance = workInProgress.stateNode;

  if (typeof instance.shouldComponentUpdate === "function") {
    startPhaseTimer(workInProgress, "shouldComponentUpdate");
    var shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext
    );
    stopPhaseTimer();

    return shouldUpdate;
  }

  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }

  return true;
}

function adoptClassInstance(workInProgress, instance) {
  instance.updater = classComponentUpdater;
  workInProgress.stateNode = instance; // The instance needs access to the fiber so that it can schedule updates

  set(instance, workInProgress);
}

function constructClassInstance(
  workInProgress,
  ctor,
  props,
  renderExpirationTime
) {
  var isLegacyContextConsumer = false;
  var unmaskedContext = emptyContextObject;
  var context = emptyContextObject;
  var contextType = ctor.contextType;

  if (typeof contextType === "object" && contextType !== null) {
    context = readContext(contextType);
  } else if (!disableLegacyContext) {
    unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    var contextTypes = ctor.contextTypes;
    isLegacyContextConsumer =
      contextTypes !== null && contextTypes !== undefined;
    context = isLegacyContextConsumer
      ? getMaskedContext(workInProgress, unmaskedContext)
      : emptyContextObject;
  } // Instantiate twice to help detect side-effects.

  var instance = new ctor(props, context);
  var state = (workInProgress.memoizedState =
    instance.state !== null && instance.state !== undefined
      ? instance.state
      : null);
  adoptClassInstance(workInProgress, instance);

  if (isLegacyContextConsumer) {
    cacheContext(workInProgress, unmaskedContext, context);
  }

  return instance;
}

function callComponentWillMount(workInProgress, instance) {
  startPhaseTimer(workInProgress, "componentWillMount");
  var oldState = instance.state;

  if (typeof instance.componentWillMount === "function") {
    instance.componentWillMount();
  }

  if (typeof instance.UNSAFE_componentWillMount === "function") {
    instance.UNSAFE_componentWillMount();
  }

  stopPhaseTimer();

  if (oldState !== instance.state) {
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}

function callComponentWillReceiveProps(
  workInProgress,
  instance,
  newProps,
  nextContext
) {
  var oldState = instance.state;
  startPhaseTimer(workInProgress, "componentWillReceiveProps");

  if (typeof instance.componentWillReceiveProps === "function") {
    instance.componentWillReceiveProps(newProps, nextContext);
  }

  if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
    instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
  }

  stopPhaseTimer();

  if (instance.state !== oldState) {
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
} // Invokes the mount life-cycles on a previously never rendered instance.

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

  if (typeof contextType === "object" && contextType !== null) {
    instance.context = readContext(contextType);
  } else if (disableLegacyContext) {
    instance.context = emptyContextObject;
  } else {
    var unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    instance.context = getMaskedContext(workInProgress, unmaskedContext);
  }

  var updateQueue = workInProgress.updateQueue;

  if (updateQueue !== null) {
    processUpdateQueue(
      workInProgress,
      updateQueue,
      newProps,
      instance,
      renderExpirationTime
    );
    instance.state = workInProgress.memoizedState;
  }

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;

  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps
    );
    instance.state = workInProgress.memoizedState;
  } // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (
    typeof ctor.getDerivedStateFromProps !== "function" &&
    typeof instance.getSnapshotBeforeUpdate !== "function" &&
    (typeof instance.UNSAFE_componentWillMount === "function" ||
      typeof instance.componentWillMount === "function")
  ) {
    callComponentWillMount(workInProgress, instance); // If we had additional state updates during this life-cycle, let's
    // process them now.

    updateQueue = workInProgress.updateQueue;

    if (updateQueue !== null) {
      processUpdateQueue(
        workInProgress,
        updateQueue,
        newProps,
        instance,
        renderExpirationTime
      );
      instance.state = workInProgress.memoizedState;
    }
  }

  if (typeof instance.componentDidMount === "function") {
    workInProgress.effectTag |= Update;
  }
}

function resumeMountClassInstance(
  workInProgress,
  ctor,
  newProps,
  renderExpirationTime
) {
  var instance = workInProgress.stateNode;
  var oldProps = workInProgress.memoizedProps;
  instance.props = oldProps;
  var oldContext = instance.context;
  var contextType = ctor.contextType;
  var nextContext = emptyContextObject;

  if (typeof contextType === "object" && contextType !== null) {
    nextContext = readContext(contextType);
  } else if (!disableLegacyContext) {
    var nextLegacyUnmaskedContext = getUnmaskedContext(
      workInProgress,
      ctor,
      true
    );
    nextContext = getMaskedContext(workInProgress, nextLegacyUnmaskedContext);
  }

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  var hasNewLifecycles =
    typeof getDerivedStateFromProps === "function" ||
    typeof instance.getSnapshotBeforeUpdate === "function"; // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.
  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === "function" ||
      typeof instance.componentWillReceiveProps === "function")
  ) {
    if (oldProps !== newProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();
  var oldState = workInProgress.memoizedState;
  var newState = (instance.state = oldState);
  var updateQueue = workInProgress.updateQueue;

  if (updateQueue !== null) {
    processUpdateQueue(
      workInProgress,
      updateQueue,
      newProps,
      instance,
      renderExpirationTime
    );
    newState = workInProgress.memoizedState;
  }

  if (
    oldProps === newProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing()
  ) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === "function") {
      workInProgress.effectTag |= Update;
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps
    );
    newState = workInProgress.memoizedState;
  }

  var shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext
    );

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillMount === "function" ||
        typeof instance.componentWillMount === "function")
    ) {
      startPhaseTimer(workInProgress, "componentWillMount");

      if (typeof instance.componentWillMount === "function") {
        instance.componentWillMount();
      }

      if (typeof instance.UNSAFE_componentWillMount === "function") {
        instance.UNSAFE_componentWillMount();
      }

      stopPhaseTimer();
    }

    if (typeof instance.componentDidMount === "function") {
      workInProgress.effectTag |= Update;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidMount === "function") {
      workInProgress.effectTag |= Update;
    } // If shouldComponentUpdate returned false, we should still update the
    // memoized state to indicate that this work can be reused.

    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  } // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.

  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
} // Invokes the update life-cycles and returns false if it shouldn't rerender.

function updateClassInstance(
  current,
  workInProgress,
  ctor,
  newProps,
  renderExpirationTime
) {
  var instance = workInProgress.stateNode;
  var oldProps = workInProgress.memoizedProps;
  instance.props =
    workInProgress.type === workInProgress.elementType
      ? oldProps
      : resolveDefaultProps(workInProgress.type, oldProps);
  var oldContext = instance.context;
  var contextType = ctor.contextType;
  var nextContext = emptyContextObject;

  if (typeof contextType === "object" && contextType !== null) {
    nextContext = readContext(contextType);
  } else if (!disableLegacyContext) {
    var nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
    nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
  }

  var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  var hasNewLifecycles =
    typeof getDerivedStateFromProps === "function" ||
    typeof instance.getSnapshotBeforeUpdate === "function"; // Note: During these life-cycles, instance.props/instance.state are what
  // ever the previously attempted to render - not the "current". However,
  // during componentDidUpdate we pass the "current" props.
  // In order to support react-lifecycles-compat polyfilled components,
  // Unsafe lifecycles should not be invoked for components using the new APIs.

  if (
    !hasNewLifecycles &&
    (typeof instance.UNSAFE_componentWillReceiveProps === "function" ||
      typeof instance.componentWillReceiveProps === "function")
  ) {
    if (oldProps !== newProps || oldContext !== nextContext) {
      callComponentWillReceiveProps(
        workInProgress,
        instance,
        newProps,
        nextContext
      );
    }
  }

  resetHasForceUpdateBeforeProcessing();
  var oldState = workInProgress.memoizedState;
  var newState = (instance.state = oldState);
  var updateQueue = workInProgress.updateQueue;

  if (updateQueue !== null) {
    processUpdateQueue(
      workInProgress,
      updateQueue,
      newProps,
      instance,
      renderExpirationTime
    );
    newState = workInProgress.memoizedState;
  }

  if (
    oldProps === newProps &&
    oldState === newState &&
    !hasContextChanged() &&
    !checkHasForceUpdateAfterProcessing()
  ) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === "function") {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Snapshot;
      }
    }

    return false;
  }

  if (typeof getDerivedStateFromProps === "function") {
    applyDerivedStateFromProps(
      workInProgress,
      ctor,
      getDerivedStateFromProps,
      newProps
    );
    newState = workInProgress.memoizedState;
  }

  var shouldUpdate =
    checkHasForceUpdateAfterProcessing() ||
    checkShouldComponentUpdate(
      workInProgress,
      ctor,
      oldProps,
      newProps,
      oldState,
      newState,
      nextContext
    );

  if (shouldUpdate) {
    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (
      !hasNewLifecycles &&
      (typeof instance.UNSAFE_componentWillUpdate === "function" ||
        typeof instance.componentWillUpdate === "function")
    ) {
      startPhaseTimer(workInProgress, "componentWillUpdate");

      if (typeof instance.componentWillUpdate === "function") {
        instance.componentWillUpdate(newProps, newState, nextContext);
      }

      if (typeof instance.UNSAFE_componentWillUpdate === "function") {
        instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
      }

      stopPhaseTimer();
    }

    if (typeof instance.componentDidUpdate === "function") {
      workInProgress.effectTag |= Update;
    }

    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      workInProgress.effectTag |= Snapshot;
    }
  } else {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === "function") {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Update;
      }
    }

    if (typeof instance.getSnapshotBeforeUpdate === "function") {
      if (
        oldProps !== current.memoizedProps ||
        oldState !== current.memoizedState
      ) {
        workInProgress.effectTag |= Snapshot;
      }
    } // If shouldComponentUpdate returned false, we should still update the
    // memoized props/state to indicate that this work can be reused.

    workInProgress.memoizedProps = newProps;
    workInProgress.memoizedState = newState;
  } // Update the existing instance's state, props, and context pointers even
  // if shouldComponentUpdate returns false.

  instance.props = newProps;
  instance.state = newState;
  instance.context = nextContext;
  return shouldUpdate;
}

var isArray = Array.isArray;

function coerceRef(returnFiber, current$$1, element) {
  var mixedRef = element.ref;

  if (
    mixedRef !== null &&
    typeof mixedRef !== "function" &&
    typeof mixedRef !== "object"
  ) {
    if (element._owner) {
      var owner = element._owner;
      var inst;

      if (owner) {
        var ownerFiber = owner;

        (function() {
          if (!(ownerFiber.tag === ClassComponent)) {
            throw ReactError(
              Error(
                "Function components cannot have refs. Did you mean to use React.forwardRef()?"
              )
            );
          }
        })();

        inst = ownerFiber.stateNode;
      }

      (function() {
        if (!inst) {
          throw ReactError(
            Error(
              "Missing owner for string ref " +
                mixedRef +
                ". This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();

      var stringRef = "" + mixedRef; // Check if previous string ref matches new string ref

      if (
        current$$1 !== null &&
        current$$1.ref !== null &&
        typeof current$$1.ref === "function" &&
        current$$1.ref._stringRef === stringRef
      ) {
        return current$$1.ref;
      }

      var ref = function(value) {
        var refs = inst.refs;

        if (refs === emptyRefsObject) {
          // This is a lazy pooled frozen object, so we need to initialize.
          refs = inst.refs = {};
        }

        if (value === null) {
          delete refs[stringRef];
        } else {
          refs[stringRef] = value;
        }
      };

      ref._stringRef = stringRef;
      return ref;
    } else {
      (function() {
        if (!(typeof mixedRef === "string")) {
          throw ReactError(
            Error(
              "Expected ref to be a function, a string, an object returned by React.createRef(), or null."
            )
          );
        }
      })();

      (function() {
        if (!element._owner) {
          throw ReactError(
            Error(
              "Element ref was specified as a string (" +
                mixedRef +
                ") but no owner was set. This could happen for one of the following reasons:\n1. You may be adding a ref to a function component\n2. You may be adding a ref to a component that was not created inside a component's render method\n3. You have multiple copies of React loaded\nSee https://fb.me/react-refs-must-have-owner for more information."
            )
          );
        }
      })();
    }
  }

  return mixedRef;
}

function throwOnInvalidObjectType(returnFiber, newChild) {
  if (returnFiber.type !== "textarea") {
    var addendum = "";

    (function() {
      {
        throw ReactError(
          Error(
            "Objects are not valid as a React child (found: " +
              (Object.prototype.toString.call(newChild) === "[object Object]"
                ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
                : newChild) +
              ")." +
              addendum
          )
        );
      }
    })();
  }
}

// to be able to optimize each path individually by branching early. This needs
// a compiler or we can do it manually. Helpers that don't need this branching
// live outside of this function.

function ChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    } // Deletions are added in reversed order so we add it to the front.
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.

    var last = returnFiber.lastEffect;

    if (last !== null) {
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }

    childToDelete.nextEffect = null;
    childToDelete.effectTag = Deletion;
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    } // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.

    var childToDelete = currentFirstChild;

    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }

    return null;
  }

  function mapRemainingChildren(returnFiber, currentFirstChild) {
    // Add the remaining children to a temporary map so that we can find them by
    // keys quickly. Implicit (null) keys get added to this set with their index
    // instead.
    var existingChildren = new Map();
    var existingChild = currentFirstChild;

    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }

      existingChild = existingChild.sibling;
    }

    return existingChildren;
  }

  function useFiber(fiber, pendingProps, expirationTime) {
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;

    if (!shouldTrackSideEffects) {
      // Noop.
      return lastPlacedIndex;
    }

    var current$$1 = newFiber.alternate;

    if (current$$1 !== null) {
      var oldIndex = current$$1.index;

      if (oldIndex < lastPlacedIndex) {
        // This is a move.
        newFiber.effectTag = Placement;
        return lastPlacedIndex;
      } else {
        // This item can stay in place.
        return oldIndex;
      }
    } else {
      // This is an insertion.
      newFiber.effectTag = Placement;
      return lastPlacedIndex;
    }
  }

  function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement;
    }

    return newFiber;
  }

  function updateTextNode(
    returnFiber,
    current$$1,
    textContent,
    expirationTime
  ) {
    if (current$$1 === null || current$$1.tag !== HostText) {
      // Insert
      var created = createFiberFromText(
        textContent,
        returnFiber.mode,
        expirationTime
      );
      created.return = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current$$1, textContent, expirationTime);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateElement(returnFiber, current$$1, element, expirationTime) {
    if (
      current$$1 !== null &&
      (current$$1.elementType === element.type || // Keep this check inline so it only runs on the false path:
        false)
    ) {
      // Move based on index
      var existing = useFiber(current$$1, element.props, expirationTime);
      existing.ref = coerceRef(returnFiber, current$$1, element);
      existing.return = returnFiber;

      return existing;
    } else {
      // Insert
      var created = createFiberFromElement(
        element,
        returnFiber.mode,
        expirationTime
      );
      created.ref = coerceRef(returnFiber, current$$1, element);
      created.return = returnFiber;
      return created;
    }
  }

  function updatePortal(returnFiber, current$$1, portal, expirationTime) {
    if (
      current$$1 === null ||
      current$$1.tag !== HostPortal ||
      current$$1.stateNode.containerInfo !== portal.containerInfo ||
      current$$1.stateNode.implementation !== portal.implementation
    ) {
      // Insert
      var created = createFiberFromPortal(
        portal,
        returnFiber.mode,
        expirationTime
      );
      created.return = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(
        current$$1,
        portal.children || [],
        expirationTime
      );
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateFragment(
    returnFiber,
    current$$1,
    fragment,
    expirationTime,
    key
  ) {
    if (current$$1 === null || current$$1.tag !== Fragment) {
      // Insert
      var created = createFiberFromFragment(
        fragment,
        returnFiber.mode,
        expirationTime,
        key
      );
      created.return = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current$$1, fragment, expirationTime);
      existing.return = returnFiber;
      return existing;
    }
  }

  function createChild(returnFiber, newChild, expirationTime) {
    if (typeof newChild === "string" || typeof newChild === "number") {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      var created = createFiberFromText(
        "" + newChild,
        returnFiber.mode,
        expirationTime
      );
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          var _created = createFiberFromElement(
            newChild,
            returnFiber.mode,
            expirationTime
          );

          _created.ref = coerceRef(returnFiber, null, newChild);
          _created.return = returnFiber;
          return _created;
        }

        case REACT_PORTAL_TYPE: {
          var _created2 = createFiberFromPortal(
            newChild,
            returnFiber.mode,
            expirationTime
          );

          _created2.return = returnFiber;
          return _created2;
        }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        var _created3 = createFiberFromFragment(
          newChild,
          returnFiber.mode,
          expirationTime,
          null
        );

        _created3.return = returnFiber;
        return _created3;
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    return null;
  }

  function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
    // Update the fiber if the keys match, otherwise return null.
    var key = oldFiber !== null ? oldFiber.key : null;

    if (typeof newChild === "string" || typeof newChild === "number") {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      if (key !== null) {
        return null;
      }

      return updateTextNode(
        returnFiber,
        oldFiber,
        "" + newChild,
        expirationTime
      );
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          if (newChild.key === key) {
            if (newChild.type === REACT_FRAGMENT_TYPE) {
              return updateFragment(
                returnFiber,
                oldFiber,
                newChild.props.children,
                expirationTime,
                key
              );
            }

            return updateElement(
              returnFiber,
              oldFiber,
              newChild,
              expirationTime
            );
          } else {
            return null;
          }
        }

        case REACT_PORTAL_TYPE: {
          if (newChild.key === key) {
            return updatePortal(
              returnFiber,
              oldFiber,
              newChild,
              expirationTime
            );
          } else {
            return null;
          }
        }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        if (key !== null) {
          return null;
        }

        return updateFragment(
          returnFiber,
          oldFiber,
          newChild,
          expirationTime,
          null
        );
      }

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
    if (typeof newChild === "string" || typeof newChild === "number") {
      // Text nodes don't have keys, so we neither have to check the old nor
      // new node for the key. If both are text nodes, they match.
      var matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(
        returnFiber,
        matchedFiber,
        "" + newChild,
        expirationTime
      );
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          var _matchedFiber =
            existingChildren.get(
              newChild.key === null ? newIdx : newChild.key
            ) || null;

          if (newChild.type === REACT_FRAGMENT_TYPE) {
            return updateFragment(
              returnFiber,
              _matchedFiber,
              newChild.props.children,
              expirationTime,
              newChild.key
            );
          }

          return updateElement(
            returnFiber,
            _matchedFiber,
            newChild,
            expirationTime
          );
        }

        case REACT_PORTAL_TYPE: {
          var _matchedFiber2 =
            existingChildren.get(
              newChild.key === null ? newIdx : newChild.key
            ) || null;

          return updatePortal(
            returnFiber,
            _matchedFiber2,
            newChild,
            expirationTime
          );
        }
      }

      if (isArray(newChild) || getIteratorFn(newChild)) {
        var _matchedFiber3 = existingChildren.get(newIdx) || null;

        return updateFragment(
          returnFiber,
          _matchedFiber3,
          newChild,
          expirationTime,
          null
        );
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    return null;
  }
  /**
   * Warns if there is a duplicate or missing key
   */

  function reconcileChildrenArray(
    returnFiber,
    currentFirstChild,
    newChildren,
    expirationTime
  ) {
    // This algorithm can't optimize by searching from both ends since we
    // don't have backpointers on fibers. I'm trying to see how far we can get
    // with that model. If it ends up not being worth the tradeoffs, we can
    // add it later.
    // Even with a two ended optimization, we'd want to optimize for the case
    // where there are few changes and brute force the comparison instead of
    // going for the Map. It'd like to explore hitting that path first in
    // forward-only mode and only go for the Map once we notice that we need
    // lots of look ahead. This doesn't handle reversal as well as two ended
    // search but that's unusual. Besides, for the two ended optimization to
    // work on Iterables, we'd need to copy the whole set.
    // In this first iteration, we'll just live with hitting the bad case
    // (adding everything to a Map) in for every insert/move.
    // If you change this code, also update reconcileChildrenIterator() which
    // uses the same algorithm.
    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;

    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      var newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        expirationTime
      );

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        var _newFiber = createChild(
          returnFiber,
          newChildren[newIdx],
          expirationTime
        );

        if (_newFiber === null) {
          continue;
        }

        lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber;
        } else {
          previousNewFiber.sibling = _newFiber;
        }

        previousNewFiber = _newFiber;
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.

    var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber2 = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        expirationTime
      );

      if (_newFiber2 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber2.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(
              _newFiber2.key === null ? newIdx : _newFiber2.key
            );
          }
        }

        lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber2;
        } else {
          previousNewFiber.sibling = _newFiber2;
        }

        previousNewFiber = _newFiber2;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstChild;
  }

  function reconcileChildrenIterator(
    returnFiber,
    currentFirstChild,
    newChildrenIterable,
    expirationTime
  ) {
    // This is the same implementation as reconcileChildrenArray(),
    // but using the iterator instead.
    var iteratorFn = getIteratorFn(newChildrenIterable);

    (function() {
      if (!(typeof iteratorFn === "function")) {
        throw ReactError(
          Error(
            "An object is not an iterable. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();

    var newChildren = iteratorFn.call(newChildrenIterable);

    (function() {
      if (!(newChildren != null)) {
        throw ReactError(Error("An iterable object provided no iterator."));
      }
    })();

    var resultingFirstChild = null;
    var previousNewFiber = null;
    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;
    var step = newChildren.next();

    for (
      ;
      oldFiber !== null && !step.done;
      newIdx++, step = newChildren.next()
    ) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

      var newFiber = updateSlot(
        returnFiber,
        oldFiber,
        step.value,
        expirationTime
      );

      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }

        break;
      }

      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }

      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }

      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (step.done) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; !step.done; newIdx++, step = newChildren.next()) {
        var _newFiber3 = createChild(returnFiber, step.value, expirationTime);

        if (_newFiber3 === null) {
          continue;
        }

        lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber3;
        } else {
          previousNewFiber.sibling = _newFiber3;
        }

        previousNewFiber = _newFiber3;
      }

      return resultingFirstChild;
    } // Add all children to a key map for quick lookups.

    var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

    for (; !step.done; newIdx++, step = newChildren.next()) {
      var _newFiber4 = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        step.value,
        expirationTime
      );

      if (_newFiber4 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber4.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren.delete(
              _newFiber4.key === null ? newIdx : _newFiber4.key
            );
          }
        }

        lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);

        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber4;
        } else {
          previousNewFiber.sibling = _newFiber4;
        }

        previousNewFiber = _newFiber4;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstChild;
  }

  function reconcileSingleTextNode(
    returnFiber,
    currentFirstChild,
    textContent,
    expirationTime
  ) {
    // There's no need to check for keys on text nodes since we don't have a
    // way to define them.
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      var existing = useFiber(currentFirstChild, textContent, expirationTime);
      existing.return = returnFiber;
      return existing;
    } // The existing first child is not a text node so we need to create one
    // and delete the existing ones.

    deleteRemainingChildren(returnFiber, currentFirstChild);
    var created = createFiberFromText(
      textContent,
      returnFiber.mode,
      expirationTime
    );
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleElement(
    returnFiber,
    currentFirstChild,
    element,
    expirationTime
  ) {
    var key = element.key;
    var child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (
          child.tag === Fragment
            ? element.type === REACT_FRAGMENT_TYPE
            : child.elementType === element.type || false // Keep this check inline so it only runs on the false path:
        ) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(
            child,
            element.type === REACT_FRAGMENT_TYPE
              ? element.props.children
              : element.props,
            expirationTime
          );
          existing.ref = coerceRef(returnFiber, child, element);
          existing.return = returnFiber;

          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    if (element.type === REACT_FRAGMENT_TYPE) {
      var created = createFiberFromFragment(
        element.props.children,
        returnFiber.mode,
        expirationTime,
        element.key
      );
      created.return = returnFiber;
      return created;
    } else {
      var _created4 = createFiberFromElement(
        element,
        returnFiber.mode,
        expirationTime
      );

      _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
      _created4.return = returnFiber;
      return _created4;
    }
  }

  function reconcileSinglePortal(
    returnFiber,
    currentFirstChild,
    portal,
    expirationTime
  ) {
    var key = portal.key;
    var child = currentFirstChild;

    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (
          child.tag === HostPortal &&
          child.stateNode.containerInfo === portal.containerInfo &&
          child.stateNode.implementation === portal.implementation
        ) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, portal.children || [], expirationTime);
          existing.return = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }

      child = child.sibling;
    }

    var created = createFiberFromPortal(
      portal,
      returnFiber.mode,
      expirationTime
    );
    created.return = returnFiber;
    return created;
  } // This API will tag the children with the side-effect of the reconciliation
  // itself. They will be added to the side-effect list as we pass through the
  // children and the parent.

  function reconcileChildFibers(
    returnFiber,
    currentFirstChild,
    newChild,
    expirationTime
  ) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.
    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    var isUnkeyedTopLevelFragment =
      typeof newChild === "object" &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;

    if (isUnkeyedTopLevelFragment) {
      newChild = newChild.props.children;
    } // Handle object types

    var isObject = typeof newChild === "object" && newChild !== null;

    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime
            )
          );

        case REACT_PORTAL_TYPE:
          return placeSingleChild(
            reconcileSinglePortal(
              returnFiber,
              currentFirstChild,
              newChild,
              expirationTime
            )
          );
      }
    }

    if (typeof newChild === "string" || typeof newChild === "number") {
      return placeSingleChild(
        reconcileSingleTextNode(
          returnFiber,
          currentFirstChild,
          "" + newChild,
          expirationTime
        )
      );
    }

    if (isArray(newChild)) {
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime
      );
    }

    if (getIteratorFn(newChild)) {
      return reconcileChildrenIterator(
        returnFiber,
        currentFirstChild,
        newChild,
        expirationTime
      );
    }

    if (isObject) {
      throwOnInvalidObjectType(returnFiber, newChild);
    }

    if (typeof newChild === "undefined" && !isUnkeyedTopLevelFragment) {
      // If the new child is undefined, and the return fiber is a composite
      // component, throw an error. If Fiber return types are disabled,
      // we already threw above.
      switch (returnFiber.tag) {
        case ClassComponent: {
        }
        // Intentionally fall through to the next case, which handles both
        // functions and classes
        // eslint-disable-next-lined no-fallthrough

        case FunctionComponent: {
          var Component = returnFiber.type;

          (function() {
            {
              throw ReactError(
                Error(
                  (Component.displayName || Component.name || "Component") +
                    "(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null."
                )
              );
            }
          })();
        }
      }
    } // Remaining cases are all treated as empty.

    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  return reconcileChildFibers;
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);
function cloneChildFibers(current$$1, workInProgress) {
  (function() {
    if (!(current$$1 === null || workInProgress.child === current$$1.child)) {
      throw ReactError(Error("Resuming work not yet implemented."));
    }
  })();

  if (workInProgress.child === null) {
    return;
  }

  var currentChild = workInProgress.child;
  var newChild = createWorkInProgress(
    currentChild,
    currentChild.pendingProps,
    currentChild.expirationTime
  );
  workInProgress.child = newChild;
  newChild.return = workInProgress;

  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(
      currentChild,
      currentChild.pendingProps,
      currentChild.expirationTime
    );
    newChild.return = workInProgress;
  }

  newChild.sibling = null;
} // Reset a workInProgress child set to prepare it for a second pass.

function resetChildFibers(workInProgress, renderExpirationTime) {
  var child = workInProgress.child;

  while (child !== null) {
    resetWorkInProgress(child, renderExpirationTime);
    child = child.sibling;
  }
}

var NO_CONTEXT = {};
var contextStackCursor$1 = createCursor(NO_CONTEXT);
var contextFiberStackCursor = createCursor(NO_CONTEXT);
var rootInstanceStackCursor = createCursor(NO_CONTEXT);

function requiredContext(c) {
  (function() {
    if (!(c !== NO_CONTEXT)) {
      throw ReactError(
        Error(
          "Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();

  return c;
}

function getRootHostContainer() {
  var rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}

function pushHostContainer(fiber, nextRootInstance) {
  // Push current root instance onto the stack;
  // This allows us to reset root when portals are popped.
  push(rootInstanceStackCursor, nextRootInstance, fiber); // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.

  push(contextFiberStackCursor, fiber, fiber); // Finally, we need to push the host context to the stack.
  // However, we can't just call getRootHostContext() and push it because
  // we'd have a different number of entries on the stack depending on
  // whether getRootHostContext() throws somewhere in renderer code or not.
  // So we push an empty value first. This lets us safely unwind on errors.

  push(contextStackCursor$1, NO_CONTEXT, fiber);
  var nextRootContext = getRootHostContext(nextRootInstance); // Now that we know this function doesn't throw, replace it.

  pop(contextStackCursor$1, fiber);
  push(contextStackCursor$1, nextRootContext, fiber);
}

function popHostContainer(fiber) {
  pop(contextStackCursor$1, fiber);
  pop(contextFiberStackCursor, fiber);
  pop(rootInstanceStackCursor, fiber);
}

function getHostContext() {
  var context = requiredContext(contextStackCursor$1.current);
  return context;
}

function pushHostContext(fiber) {
  var rootInstance = requiredContext(rootInstanceStackCursor.current);
  var context = requiredContext(contextStackCursor$1.current);
  var nextContext = getChildHostContext(context, fiber.type, rootInstance); // Don't push this Fiber's context unless it's unique.

  if (context === nextContext) {
    return;
  } // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.

  push(contextFiberStackCursor, fiber, fiber);
  push(contextStackCursor$1, nextContext, fiber);
}

function popHostContext(fiber) {
  // Do not pop unless this Fiber provided the current context.
  // pushHostContext() only pushes Fibers that provide unique contexts.
  if (contextFiberStackCursor.current !== fiber) {
    return;
  }

  pop(contextStackCursor$1, fiber);
  pop(contextFiberStackCursor, fiber);
}

var DefaultSuspenseContext = 0; // The Suspense Context is split into two parts. The lower bits is
// inherited deeply down the subtree. The upper bits only affect
// this immediate suspense boundary and gets reset each new
// boundary or suspense list.

var SubtreeSuspenseContextMask = 1; // Subtree Flags:
// InvisibleParentSuspenseContext indicates that one of our parent Suspense
// boundaries is not currently showing visible main content.
// Either because it is already showing a fallback or is not mounted at all.
// We can use this to determine if it is desirable to trigger a fallback at
// the parent. If not, then we might need to trigger undesirable boundaries
// and/or suspend the commit to avoid hiding the parent content.

var InvisibleParentSuspenseContext = 1; // Shallow Flags:
// ForceSuspenseFallback can be used by SuspenseList to force newly added
// items into their fallback state during one of the render passes.

var ForceSuspenseFallback = 2;
var suspenseStackCursor = createCursor(DefaultSuspenseContext);
function hasSuspenseContext(parentContext, flag) {
  return (parentContext & flag) !== 0;
}
function setDefaultShallowSuspenseContext(parentContext) {
  return parentContext & SubtreeSuspenseContextMask;
}
function setShallowSuspenseContext(parentContext, shallowContext) {
  return (parentContext & SubtreeSuspenseContextMask) | shallowContext;
}
function addSubtreeSuspenseContext(parentContext, subtreeContext) {
  return parentContext | subtreeContext;
}
function pushSuspenseContext(fiber, newContext) {
  push(suspenseStackCursor, newContext, fiber);
}
function popSuspenseContext(fiber) {
  pop(suspenseStackCursor, fiber);
}

function shouldCaptureSuspense(workInProgress, hasInvisibleParent) {
  // If it was the primary children that just suspended, capture and render the
  // fallback. Otherwise, don't capture and bubble to the next boundary.
  var nextState = workInProgress.memoizedState;

  if (nextState !== null) {
    if (nextState.dehydrated !== null) {
      // A dehydrated boundary always captures.
      return true;
    }

    return false;
  }

  var props = workInProgress.memoizedProps; // In order to capture, the Suspense component must have a fallback prop.

  if (props.fallback === undefined) {
    return false;
  } // Regular boundaries always capture.

  if (props.unstable_avoidThisFallback !== true) {
    return true;
  } // If it's a boundary we should avoid, then we prefer to bubble up to the
  // parent boundary if it is currently invisible.

  if (hasInvisibleParent) {
    return false;
  } // If the parent is not able to handle it, we must handle it.

  return true;
}
function findFirstSuspended(row) {
  var node = row;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      var state = node.memoizedState;

      if (state !== null) {
        var dehydrated = state.dehydrated;

        if (
          dehydrated === null ||
          isSuspenseInstancePending(dehydrated) ||
          isSuspenseInstanceFallback(dehydrated)
        ) {
          return node;
        }
      }
    } else if (
      node.tag === SuspenseListComponent && // revealOrder undefined can't be trusted because it don't
      // keep track of whether it suspended or not.
      node.memoizedProps.revealOrder !== undefined
    ) {
      var didSuspend = (node.effectTag & DidCapture) !== NoEffect;

      if (didSuspend) {
        return node;
      }
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === row) {
      return null;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === row) {
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }

  return null;
}

function createResponderListener(responder, props) {
  var eventResponderListener = {
    responder: responder,
    props: props
  };

  return eventResponderListener;
}

function createResponderInstance(
  responder,
  responderProps,
  responderState,
  target,
  fiber
) {
  return {
    fiber: fiber,
    props: responderProps,
    responder: responder,
    rootEventTypes: null,
    state: responderState,
    target: target
  };
}

var NoEffect$1 =
  /*             */
  0;
var UnmountSnapshot =
  /*      */
  2;
var UnmountMutation =
  /*      */
  4;
var MountMutation =
  /*        */
  8;
var UnmountLayout =
  /*        */
  16;
var MountLayout =
  /*          */
  32;
var MountPassive =
  /*         */
  64;
var UnmountPassive =
  /*       */
  128;

var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
// These are set right before calling the component.
var renderExpirationTime$1 = NoWork; // The work-in-progress fiber. I've named it differently to distinguish it from
// the work-in-progress hook.

var currentlyRenderingFiber$1 = null; // Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.

var currentHook = null;
var nextCurrentHook = null;
var firstWorkInProgressHook = null;
var workInProgressHook = null;
var nextWorkInProgressHook = null;
var remainingExpirationTime = NoWork;
var componentUpdateQueue = null;
var sideEffectTag = 0; // Updates scheduled during render will trigger an immediate re-render at the
// end of the current pass. We can't store these updates on the normal queue,
// because if the work is aborted, they should be discarded. Because this is
// a relatively rare case, we also don't want to add an additional field to
// either the hook or queue object types. So we store them in a lazily create
// map of queue -> render-phase updates, which are discarded once the component
// completes without re-rendering.
// Whether an update was scheduled during the currently executing render pass.

var didScheduleRenderPhaseUpdate = false; // Lazily created map of render-phase updates

var renderPhaseUpdates = null; // Counter to prevent infinite loops.

var numberOfReRenders = 0;
var RE_RENDER_LIMIT = 25; // In DEV, this is the name of the currently executing primitive hook

function throwInvalidHookError() {
  (function() {
    {
      throw ReactError(
        Error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem."
        )
      );
    }
  })();
}

function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    return false;
  }

  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
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
  nextCurrentHook = current !== null ? current.memoizedState : null;

  {
    ReactCurrentDispatcher$1.current =
      nextCurrentHook === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
  }

  var children = Component(props, refOrContext);

  if (didScheduleRenderPhaseUpdate) {
    do {
      didScheduleRenderPhaseUpdate = false;
      numberOfReRenders += 1; // Start over from the beginning of the list

      nextCurrentHook = current !== null ? current.memoizedState : null;
      nextWorkInProgressHook = firstWorkInProgressHook;
      currentHook = null;
      workInProgressHook = null;
      componentUpdateQueue = null;

      ReactCurrentDispatcher$1.current = HooksDispatcherOnUpdate;
      children = Component(props, refOrContext);
    } while (didScheduleRenderPhaseUpdate);

    renderPhaseUpdates = null;
    numberOfReRenders = 0;
  } // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrancy.

  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
  var renderedWork = currentlyRenderingFiber$1;
  renderedWork.memoizedState = firstWorkInProgressHook;
  renderedWork.expirationTime = remainingExpirationTime;
  renderedWork.updateQueue = componentUpdateQueue;
  renderedWork.effectTag |= sideEffectTag;

  var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
  renderExpirationTime$1 = NoWork;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  nextCurrentHook = null;
  firstWorkInProgressHook = null;
  workInProgressHook = null;
  nextWorkInProgressHook = null;

  remainingExpirationTime = NoWork;
  componentUpdateQueue = null;
  sideEffectTag = 0; // These were reset above
  // didScheduleRenderPhaseUpdate = false;
  // renderPhaseUpdates = null;
  // numberOfReRenders = 0;

  (function() {
    if (!!didRenderTooFewHooks) {
      throw ReactError(
        Error(
          "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."
        )
      );
    }
  })();

  return children;
}
function bailoutHooks(current, workInProgress, expirationTime) {
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.effectTag &= ~(Passive | Update);

  if (current.expirationTime <= expirationTime) {
    current.expirationTime = NoWork;
  }
}
function resetHooks() {
  // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrancy.
  ReactCurrentDispatcher$1.current = ContextOnlyDispatcher; // This is used to reset the state of this module when a component throws.
  // It's also called inside mountIndeterminateComponent if we determine the
  // component is a module-style component.

  renderExpirationTime$1 = NoWork;
  currentlyRenderingFiber$1 = null;
  currentHook = null;
  nextCurrentHook = null;
  firstWorkInProgressHook = null;
  workInProgressHook = null;
  nextWorkInProgressHook = null;

  remainingExpirationTime = NoWork;
  componentUpdateQueue = null;
  sideEffectTag = 0;
  didScheduleRenderPhaseUpdate = false;
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

  if (workInProgressHook === null) {
    // This is the first hook in the list
    firstWorkInProgressHook = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}

function updateWorkInProgressHook() {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base. When we reach the end of the base list, we must switch to
  // the dispatcher used for mounts.
  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
    nextCurrentHook = currentHook !== null ? currentHook.next : null;
  } else {
    // Clone from the current hook.
    (function() {
      if (!(nextCurrentHook !== null)) {
        throw ReactError(
          Error("Rendered more hooks than during the previous render.")
        );
      }
    })();

    currentHook = nextCurrentHook;
    var newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      queue: currentHook.queue,
      baseUpdate: currentHook.baseUpdate,
      next: null
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      workInProgressHook = firstWorkInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }

    nextCurrentHook = currentHook.next;
  }

  return workInProgressHook;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null
  };
}

function basicStateReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}

function mountReducer(reducer, initialArg, init) {
  var hook = mountWorkInProgressHook();
  var initialState;

  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState
  });
  var dispatch = (queue.dispatch = dispatchAction.bind(
    null, // Flow doesn't know this is non-null, but we do.
    currentlyRenderingFiber$1,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

function updateReducer(reducer, initialArg, init) {
  var hook = updateWorkInProgressHook();
  var queue = hook.queue;

  (function() {
    if (!(queue !== null)) {
      throw ReactError(
        Error(
          "Should have a queue. This is likely a bug in React. Please file an issue."
        )
      );
    }
  })();

  queue.lastRenderedReducer = reducer;

  if (numberOfReRenders > 0) {
    // This is a re-render. Apply the new render phase updates to the previous
    // work-in-progress hook.
    var _dispatch = queue.dispatch;

    if (renderPhaseUpdates !== null) {
      // Render phase updates are stored in a map of queue -> linked list
      var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);

      if (firstRenderPhaseUpdate !== undefined) {
        renderPhaseUpdates.delete(queue);
        var newState = hook.memoizedState;
        var update = firstRenderPhaseUpdate;

        do {
          // Process this render phase update. We don't have to check the
          // priority because it will always be the same as the current
          // render's.
          var action = update.action;
          newState = reducer(newState, action);
          update = update.next;
        } while (update !== null); // Mark that the fiber performed work, but only if the new state is
        // different from the current state.

        if (!is(newState, hook.memoizedState)) {
          markWorkInProgressReceivedUpdate();
        }

        hook.memoizedState = newState; // Don't persist the state accumulated from the render phase updates to
        // the base state unless the queue is empty.
        // TODO: Not sure if this is the desired semantics, but it's what we
        // do for gDSFP. I can't remember why.

        if (hook.baseUpdate === queue.last) {
          hook.baseState = newState;
        }

        queue.lastRenderedState = newState;
        return [newState, _dispatch];
      }
    }

    return [hook.memoizedState, _dispatch];
  } // The last update in the entire queue

  var last = queue.last; // The last update that is part of the base state.

  var baseUpdate = hook.baseUpdate;
  var baseState = hook.baseState; // Find the first unprocessed update.

  var first;

  if (baseUpdate !== null) {
    if (last !== null) {
      // For the first update, the queue is a circular linked list where
      // `queue.last.next = queue.first`. Once the first update commits, and
      // the `baseUpdate` is no longer empty, we can unravel the list.
      last.next = null;
    }

    first = baseUpdate.next;
  } else {
    first = last !== null ? last.next : null;
  }

  if (first !== null) {
    var _newState = baseState;
    var newBaseState = null;
    var newBaseUpdate = null;
    var prevUpdate = baseUpdate;
    var _update = first;
    var didSkip = false;

    do {
      var updateExpirationTime = _update.expirationTime;

      if (updateExpirationTime < renderExpirationTime$1) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        if (!didSkip) {
          didSkip = true;
          newBaseUpdate = prevUpdate;
          newBaseState = _newState;
        } // Update the remaining priority in the queue.

        if (updateExpirationTime > remainingExpirationTime) {
          remainingExpirationTime = updateExpirationTime;
        }
      } else {
        // This update does have sufficient priority.
        // Mark the event time of this update as relevant to this render pass.
        // TODO: This should ideally use the true event time of this update rather than
        // its priority which is a derived and not reverseable value.
        // TODO: We should skip this update if it was already committed but currently
        // we have no way of detecting the difference between a committed and suspended
        // update here.
        markRenderEventTimeAndConfig(
          updateExpirationTime,
          _update.suspenseConfig
        ); // Process this update.

        if (_update.eagerReducer === reducer) {
          // If this update was processed eagerly, and its reducer matches the
          // current reducer, we can use the eagerly computed state.
          _newState = _update.eagerState;
        } else {
          var _action = _update.action;
          _newState = reducer(_newState, _action);
        }
      }

      prevUpdate = _update;
      _update = _update.next;
    } while (_update !== null && _update !== first);

    if (!didSkip) {
      newBaseUpdate = prevUpdate;
      newBaseState = _newState;
    } // Mark that the fiber performed work, but only if the new state is
    // different from the current state.

    if (!is(_newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = _newState;
    hook.baseUpdate = newBaseUpdate;
    hook.baseState = newBaseState;
    queue.lastRenderedState = _newState;
  }

  var dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}

function mountState(initialState) {
  var hook = mountWorkInProgressHook();

  if (typeof initialState === "function") {
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = (hook.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  });
  var dispatch = (queue.dispatch = dispatchAction.bind(
    null, // Flow doesn't know this is non-null, but we do.
    currentlyRenderingFiber$1,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

function pushEffect(tag, create, destroy, deps) {
  var effect = {
    tag: tag,
    create: create,
    destroy: destroy,
    deps: deps,
    // Circular
    next: null
  };

  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    var lastEffect = componentUpdateQueue.lastEffect;

    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      var firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }

  return effect;
}

function mountRef(initialValue) {
  var hook = mountWorkInProgressHook();
  var ref = {
    current: initialValue
  };

  hook.memoizedState = ref;
  return ref;
}

function updateRef(initialValue) {
  var hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

function mountEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  sideEffectTag |= fiberEffectTag;
  hook.memoizedState = pushEffect(hookEffectTag, create, undefined, nextDeps);
}

function updateEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var destroy = undefined;

  if (currentHook !== null) {
    var prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;

    if (nextDeps !== null) {
      var prevDeps = prevEffect.deps;

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(NoEffect$1, create, destroy, nextDeps);
        return;
      }
    }
  }

  sideEffectTag |= fiberEffectTag;
  hook.memoizedState = pushEffect(hookEffectTag, create, destroy, nextDeps);
}

function mountEffect(create, deps) {
  return mountEffectImpl(
    Update | Passive,
    UnmountPassive | MountPassive,
    create,
    deps
  );
}

function updateEffect(create, deps) {
  return updateEffectImpl(
    Update | Passive,
    UnmountPassive | MountPassive,
    create,
    deps
  );
}

function mountLayoutEffect(create, deps) {
  return mountEffectImpl(Update, UnmountMutation | MountLayout, create, deps);
}

function updateLayoutEffect(create, deps) {
  return updateEffectImpl(Update, UnmountMutation | MountLayout, create, deps);
}

function imperativeHandleEffect(create, ref) {
  if (typeof ref === "function") {
    var refCallback = ref;

    var _inst = create();

    refCallback(_inst);
    return function() {
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    var refObject = ref;

    var _inst2 = create();

    refObject.current = _inst2;
    return function() {
      refObject.current = null;
    };
  }
}

function mountImperativeHandle(ref, create, deps) {
  var effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  return mountEffectImpl(
    Update,
    UnmountMutation | MountLayout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps
  );
}

function updateImperativeHandle(ref, create, deps) {
  var effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  return updateEffectImpl(
    Update,
    UnmountMutation | MountLayout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps
  );
}

function mountDebugValue(value, formatterFn) {
  // This hook is normally a no-op.
  // The react-debug-hooks package injects its own implementation
  // so that e.g. DevTools can display custom hook values.
}

var updateDebugValue = mountDebugValue;

function mountCallback(callback, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback(callback, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      var prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function mountMemo(nextCreate, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(nextCreate, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      var prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function dispatchAction(fiber, queue, action) {
  (function() {
    if (!(numberOfReRenders < RE_RENDER_LIMIT)) {
      throw ReactError(
        Error(
          "Too many re-renders. React limits the number of renders to prevent an infinite loop."
        )
      );
    }
  })();

  var alternate = fiber.alternate;

  if (
    fiber === currentlyRenderingFiber$1 ||
    (alternate !== null && alternate === currentlyRenderingFiber$1)
  ) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdate = true;
    var update = {
      expirationTime: renderExpirationTime$1,
      suspenseConfig: null,
      action: action,
      eagerReducer: null,
      eagerState: null,
      next: null
    };

    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map();
    }

    var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);

    if (firstRenderPhaseUpdate === undefined) {
      renderPhaseUpdates.set(queue, update);
    } else {
      // Append the update to the end of the list.
      var lastRenderPhaseUpdate = firstRenderPhaseUpdate;

      while (lastRenderPhaseUpdate.next !== null) {
        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      }

      lastRenderPhaseUpdate.next = update;
    }
  } else {
    var currentTime = requestCurrentTime();
    var suspenseConfig = requestCurrentSuspenseConfig();
    var expirationTime = computeExpirationForFiber(
      currentTime,
      fiber,
      suspenseConfig
    );
    var _update2 = {
      expirationTime: expirationTime,
      suspenseConfig: suspenseConfig,
      action: action,
      eagerReducer: null,
      eagerState: null,
      next: null
    };

    var last = queue.last;

    if (last === null) {
      // This is the first update. Create a circular list.
      _update2.next = _update2;
    } else {
      var first = last.next;

      if (first !== null) {
        // Still circular.
        _update2.next = first;
      }

      last.next = _update2;
    }

    queue.last = _update2;

    if (
      fiber.expirationTime === NoWork &&
      (alternate === null || alternate.expirationTime === NoWork)
    ) {
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      var lastRenderedReducer = queue.lastRenderedReducer;

      if (lastRenderedReducer !== null) {
        try {
          var currentState = queue.lastRenderedState;
          var eagerState = lastRenderedReducer(currentState, action); // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.

          _update2.eagerReducer = lastRenderedReducer;
          _update2.eagerState = eagerState;

          if (is(eagerState, currentState)) {
            // Fast path. We can bail out without scheduling React to re-render.
            // It's still possible that we'll need to rebase this update later,
            // if the component re-renders for a different reason and by that
            // time the reducer has changed.
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {
        }
      }
    }

    scheduleWork(fiber, expirationTime);
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
};
var HooksDispatcherOnMount = {
  readContext: readContext,
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useResponder: createResponderListener
};
var HooksDispatcherOnUpdate = {
  readContext: readContext,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useResponder: createResponderListener
};

// CommonJS interop named imports.

var now$1 = Scheduler.unstable_now;
var commitTime = 0;
var profilerStartTime = -1;

function getCommitTime() {
  return commitTime;
}

function recordCommitTime() {
  if (!enableProfilerTimer) {
    return;
  }

  commitTime = now$1();
}

function startProfilerTimer(fiber) {
  if (!enableProfilerTimer) {
    return;
  }

  profilerStartTime = now$1();

  if (fiber.actualStartTime < 0) {
    fiber.actualStartTime = now$1();
  }
}

function stopProfilerTimerIfRunning(fiber) {
  if (!enableProfilerTimer) {
    return;
  }

  profilerStartTime = -1;
}

function stopProfilerTimerIfRunningAndRecordDelta(fiber, overrideBaseTime) {
  if (!enableProfilerTimer) {
    return;
  }

  if (profilerStartTime >= 0) {
    var elapsedTime = now$1() - profilerStartTime;
    fiber.actualDuration += elapsedTime;

    if (overrideBaseTime) {
      fiber.selfBaseDuration = elapsedTime;
    }

    profilerStartTime = -1;
  }
}

// This may have been an insertion or a hydration.

var hydrationParentFiber = null;
var nextHydratableInstance = null;
var isHydrating = false;

function enterHydrationState(fiber) {
  if (!supportsHydration) {
    return false;
  }

  var parentInstance = fiber.stateNode.containerInfo;
  nextHydratableInstance = getFirstHydratableChild(parentInstance);
  hydrationParentFiber = fiber;
  isHydrating = true;
  return true;
}

function reenterHydrationStateFromDehydratedSuspenseInstance(
  fiber,
  suspenseInstance
) {
  if (!supportsHydration) {
    return false;
  }

  nextHydratableInstance = getNextHydratableSibling(suspenseInstance);
  popToNextHostParent(fiber);
  isHydrating = true;
  return true;
}

function deleteHydratableInstance(returnFiber, instance) {
  var childToDelete = createFiberFromHostInstanceForDeletion();
  childToDelete.stateNode = instance;
  childToDelete.return = returnFiber;
  childToDelete.effectTag = Deletion; // This might seem like it belongs on progressedFirstDeletion. However,
  // these children are not part of the reconciliation list of children.
  // Even if we abort and rereconcile the children, that will try to hydrate
  // again and the nodes are still in the host tree so these will be
  // recreated.

  if (returnFiber.lastEffect !== null) {
    returnFiber.lastEffect.nextEffect = childToDelete;
    returnFiber.lastEffect = childToDelete;
  } else {
    returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
  }
}

function insertNonHydratedInstance(returnFiber, fiber) {
  fiber.effectTag |= Placement;
}

function tryHydrate(fiber, nextInstance) {
  switch (fiber.tag) {
    case HostComponent: {
      var type = fiber.type;
      var props = fiber.pendingProps;
      var instance = canHydrateInstance(nextInstance, type, props);

      if (instance !== null) {
        fiber.stateNode = instance;
        return true;
      }

      return false;
    }

    case HostText: {
      var text = fiber.pendingProps;
      var textInstance = canHydrateTextInstance(nextInstance, text);

      if (textInstance !== null) {
        fiber.stateNode = textInstance;
        return true;
      }

      return false;
    }

    case SuspenseComponent: {
      if (enableSuspenseServerRenderer) {
        var suspenseInstance = canHydrateSuspenseInstance(nextInstance);

        if (suspenseInstance !== null) {
          var suspenseState = {
            dehydrated: suspenseInstance,
            retryTime: Never
          };
          fiber.memoizedState = suspenseState; // Store the dehydrated fragment as a child fiber.
          // This simplifies the code for getHostSibling and deleting nodes,
          // since it doesn't have to consider all Suspense boundaries and
          // check if they're dehydrated ones or not.

          var dehydratedFragment = createFiberFromDehydratedFragment(
            suspenseInstance
          );
          dehydratedFragment.return = fiber;
          fiber.child = dehydratedFragment;
          return true;
        }
      }

      return false;
    }

    default:
      return false;
  }
}

function tryToClaimNextHydratableInstance(fiber) {
  if (!isHydrating) {
    return;
  }

  var nextInstance = nextHydratableInstance;

  if (!nextInstance) {
    // Nothing to hydrate. Make it an insertion.
    insertNonHydratedInstance(hydrationParentFiber, fiber);
    isHydrating = false;
    hydrationParentFiber = fiber;
    return;
  }

  var firstAttemptedInstance = nextInstance;

  if (!tryHydrate(fiber, nextInstance)) {
    // If we can't hydrate this instance let's try the next one.
    // We use this as a heuristic. It's based on intuition and not data so it
    // might be flawed or unnecessary.
    nextInstance = getNextHydratableSibling(firstAttemptedInstance);

    if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
      // Nothing to hydrate. Make it an insertion.
      insertNonHydratedInstance(hydrationParentFiber, fiber);
      isHydrating = false;
      hydrationParentFiber = fiber;
      return;
    } // We matched the next one, we'll now assume that the first one was
    // superfluous and we'll delete it. Since we can't eagerly delete it
    // we'll have to schedule a deletion. To do that, this node needs a dummy
    // fiber associated with it.

    deleteHydratableInstance(hydrationParentFiber, firstAttemptedInstance);
  }

  hydrationParentFiber = fiber;
  nextHydratableInstance = getFirstHydratableChild(nextInstance);
}

function prepareToHydrateHostInstance(
  fiber,
  rootContainerInstance,
  hostContext
) {
  if (!supportsHydration) {
    (function() {
      {
        throw ReactError(
          Error(
            "Expected prepareToHydrateHostInstance() to never be called. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();
  }

  var instance = fiber.stateNode;
  var updatePayload = hydrateInstance(
    instance,
    fiber.type,
    fiber.memoizedProps,
    rootContainerInstance,
    hostContext,
    fiber
  ); // TODO: Type this specific to this type of component.

  fiber.updateQueue = updatePayload; // If the update payload indicates that there is a change or if there
  // is a new ref we mark this as an update.

  if (updatePayload !== null) {
    return true;
  }

  return false;
}

function prepareToHydrateHostTextInstance(fiber) {
  if (!supportsHydration) {
    (function() {
      {
        throw ReactError(
          Error(
            "Expected prepareToHydrateHostTextInstance() to never be called. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();
  }

  var textInstance = fiber.stateNode;
  var textContent = fiber.memoizedProps;
  var shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);

  return shouldUpdate;
}

function skipPastDehydratedSuspenseInstance(fiber) {
  if (!supportsHydration) {
    (function() {
      {
        throw ReactError(
          Error(
            "Expected skipPastDehydratedSuspenseInstance() to never be called. This error is likely caused by a bug in React. Please file an issue."
          )
        );
      }
    })();
  }

  var suspenseState = fiber.memoizedState;
  var suspenseInstance =
    suspenseState !== null ? suspenseState.dehydrated : null;

  (function() {
    if (!suspenseInstance) {
      throw ReactError(
        Error(
          "Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();

  return getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance);
}

function popToNextHostParent(fiber) {
  var parent = fiber.return;

  while (
    parent !== null &&
    parent.tag !== HostComponent &&
    parent.tag !== HostRoot &&
    parent.tag !== SuspenseComponent
  ) {
    parent = parent.return;
  }

  hydrationParentFiber = parent;
}

function popHydrationState(fiber) {
  if (!supportsHydration) {
    return false;
  }

  if (fiber !== hydrationParentFiber) {
    // We're deeper than the current hydration context, inside an inserted
    // tree.
    return false;
  }

  if (!isHydrating) {
    // If we're not currently hydrating but we're in a hydration context, then
    // we were an insertion and now need to pop up reenter hydration of our
    // siblings.
    popToNextHostParent(fiber);
    isHydrating = true;
    return false;
  }

  var type = fiber.type; // If we have any remaining hydratable nodes, we need to delete them now.
  // We only do this deeper than head and body since they tend to have random
  // other nodes in them. We also ignore components with pure text content in
  // side of them.
  // TODO: Better heuristic.

  if (
    fiber.tag !== HostComponent ||
    (type !== "head" &&
      type !== "body" &&
      !shouldSetTextContent(type, fiber.memoizedProps))
  ) {
    var nextInstance = nextHydratableInstance;

    while (nextInstance) {
      deleteHydratableInstance(fiber, nextInstance);
      nextInstance = getNextHydratableSibling(nextInstance);
    }
  }

  popToNextHostParent(fiber);

  if (fiber.tag === SuspenseComponent) {
    nextHydratableInstance = skipPastDehydratedSuspenseInstance(fiber);
  } else {
    nextHydratableInstance = hydrationParentFiber
      ? getNextHydratableSibling(fiber.stateNode)
      : null;
  }

  return true;
}

function resetHydrationState() {
  if (!supportsHydration) {
    return;
  }

  hydrationParentFiber = null;
  nextHydratableInstance = null;
  isHydrating = false;
}

var ReactCurrentOwner$3 = ReactSharedInternals.ReactCurrentOwner;
var didReceiveUpdate = false;

function reconcileChildren(
  current$$1,
  workInProgress,
  nextChildren,
  renderExpirationTime
) {
  if (current$$1 === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    );
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current$$1.child,
      nextChildren,
      renderExpirationTime
    );
  }
}

function forceUnmountCurrentAndReconcile(
  current$$1,
  workInProgress,
  nextChildren,
  renderExpirationTime
) {
  // This function is fork of reconcileChildren. It's used in cases where we
  // want to reconcile without matching against the existing set. This has the
  // effect of all current children being unmounted; even if the type and key
  // are the same, the old child is unmounted and a new child is created.
  //
  // To do this, we're going to go through the reconcile algorithm twice. In
  // the first pass, we schedule a deletion for all the current children by
  // passing null.
  workInProgress.child = reconcileChildFibers(
    workInProgress,
    current$$1.child,
    null,
    renderExpirationTime
  ); // In the second pass, we mount the new children. The trick here is that we
  // pass null in place of where we usually pass the current child set. This has
  // the effect of remounting all children regardless of whether their their
  // identity matches.

  workInProgress.child = reconcileChildFibers(
    workInProgress,
    null,
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
  // TODO: current can be non-null here even if the component
  // hasn't yet mounted. This happens after the first render suspends.
  // We'll need to figure out if this is fine or can cause issues.
  var render = Component.render;
  var ref = workInProgress.ref; // The rest is a fork of updateFunctionComponent

  var nextChildren;
  prepareToReadContext(workInProgress, renderExpirationTime);

  {
    nextChildren = renderWithHooks(
      current$$1,
      workInProgress,
      render,
      nextProps,
      ref,
      renderExpirationTime
    );
  }

  if (current$$1 !== null && !didReceiveUpdate) {
    bailoutHooks(current$$1, workInProgress, renderExpirationTime);
    return bailoutOnAlreadyFinishedWork(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  } // React DevTools reads this flag.

  workInProgress.effectTag |= PerformedWork;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
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
  if (current$$1 === null) {
    var type = Component.type;

    if (
      isSimpleFunctionComponent(type) &&
      Component.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
      Component.defaultProps === undefined
    ) {
      var resolvedType = type;

      workInProgress.tag = SimpleMemoComponent;
      workInProgress.type = resolvedType;

      return updateSimpleMemoComponent(
        current$$1,
        workInProgress,
        resolvedType,
        nextProps,
        updateExpirationTime,
        renderExpirationTime
      );
    }

    var child = createFiberFromTypeAndProps(
      Component.type,
      null,
      nextProps,
      null,
      workInProgress.mode,
      renderExpirationTime
    );
    child.ref = workInProgress.ref;
    child.return = workInProgress;
    workInProgress.child = child;
    return child;
  }

  var currentChild = current$$1.child; // This is always exactly one child

  if (updateExpirationTime < renderExpirationTime) {
    // This will be the props with resolved defaultProps,
    // unlike current.memoizedProps which will be the unresolved ones.
    var prevProps = currentChild.memoizedProps; // Default to shallow comparison

    var compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual;

    if (
      compare(prevProps, nextProps) &&
      current$$1.ref === workInProgress.ref
    ) {
      return bailoutOnAlreadyFinishedWork(
        current$$1,
        workInProgress,
        renderExpirationTime
      );
    }
  } // React DevTools reads this flag.

  workInProgress.effectTag |= PerformedWork;
  var newChild = createWorkInProgress(
    currentChild,
    nextProps,
    renderExpirationTime
  );
  newChild.ref = workInProgress.ref;
  newChild.return = workInProgress;
  workInProgress.child = newChild;
  return newChild;
}

function updateSimpleMemoComponent(
  current$$1,
  workInProgress,
  Component,
  nextProps,
  updateExpirationTime,
  renderExpirationTime
) {
  // TODO: current can be non-null here even if the component
  // hasn't yet mounted. This happens when the inner render suspends.
  // We'll need to figure out if this is fine or can cause issues.
  if (current$$1 !== null) {
    var prevProps = current$$1.memoizedProps;

    if (
      shallowEqual(prevProps, nextProps) &&
      current$$1.ref === workInProgress.ref && // Prevent bailout if the implementation changed due to hot reload:
      true
    ) {
      didReceiveUpdate = false;

      if (updateExpirationTime < renderExpirationTime) {
        return bailoutOnAlreadyFinishedWork(
          current$$1,
          workInProgress,
          renderExpirationTime
        );
      }
    }
  }

  return updateFunctionComponent(
    current$$1,
    workInProgress,
    Component,
    nextProps,
    renderExpirationTime
  );
}

function updateFragment(current$$1, workInProgress, renderExpirationTime) {
  var nextChildren = workInProgress.pendingProps;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function updateMode(current$$1, workInProgress, renderExpirationTime) {
  var nextChildren = workInProgress.pendingProps.children;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function updateProfiler(current$$1, workInProgress, renderExpirationTime) {
  if (enableProfilerTimer) {
    workInProgress.effectTag |= Update;
  }

  var nextProps = workInProgress.pendingProps;
  var nextChildren = nextProps.children;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function markRef(current$$1, workInProgress) {
  var ref = workInProgress.ref;

  if (
    (current$$1 === null && ref !== null) ||
    (current$$1 !== null && current$$1.ref !== ref)
  ) {
    // Schedule a Ref effect
    workInProgress.effectTag |= Ref;
  }
}

function updateFunctionComponent(
  current$$1,
  workInProgress,
  Component,
  nextProps,
  renderExpirationTime
) {
  var context;

  if (!disableLegacyContext) {
    var unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  var nextChildren;
  prepareToReadContext(workInProgress, renderExpirationTime);

  {
    nextChildren = renderWithHooks(
      current$$1,
      workInProgress,
      Component,
      nextProps,
      context,
      renderExpirationTime
    );
  }

  if (current$$1 !== null && !didReceiveUpdate) {
    bailoutHooks(current$$1, workInProgress, renderExpirationTime);
    return bailoutOnAlreadyFinishedWork(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  } // React DevTools reads this flag.

  workInProgress.effectTag |= PerformedWork;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
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
  var hasContext;

  if (isContextProvider(Component)) {
    hasContext = true;
    pushContextProvider(workInProgress);
  } else {
    hasContext = false;
  }

  prepareToReadContext(workInProgress, renderExpirationTime);
  var instance = workInProgress.stateNode;
  var shouldUpdate;

  if (instance === null) {
    if (current$$1 !== null) {
      // An class component without an instance only mounts if it suspended
      // inside a non- concurrent tree, in an inconsistent state. We want to
      // tree it like a new mount, even though an empty version of it already
      // committed. Disconnect the alternate pointers.
      current$$1.alternate = null;
      workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

      workInProgress.effectTag |= Placement;
    } // In the initial pass we might need to construct the instance.

    constructClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime
    );
    mountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime
    );
    shouldUpdate = true;
  } else if (current$$1 === null) {
    // In a resume, we'll already have an instance we can reuse.
    shouldUpdate = resumeMountClassInstance(
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime
    );
  } else {
    shouldUpdate = updateClassInstance(
      current$$1,
      workInProgress,
      Component,
      nextProps,
      renderExpirationTime
    );
  }

  var nextUnitOfWork = finishClassComponent(
    current$$1,
    workInProgress,
    Component,
    shouldUpdate,
    hasContext,
    renderExpirationTime
  );

  return nextUnitOfWork;
}

function finishClassComponent(
  current$$1,
  workInProgress,
  Component,
  shouldUpdate,
  hasContext,
  renderExpirationTime
) {
  // Refs should update even if shouldComponentUpdate returns false
  markRef(current$$1, workInProgress);
  var didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect;

  if (!shouldUpdate && !didCaptureError) {
    // Context providers should defer to sCU for rendering
    if (hasContext) {
      invalidateContextProvider(workInProgress, Component, false);
    }

    return bailoutOnAlreadyFinishedWork(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  }

  var instance = workInProgress.stateNode; // Rerender

  ReactCurrentOwner$3.current = workInProgress;
  var nextChildren;

  if (
    didCaptureError &&
    typeof Component.getDerivedStateFromError !== "function"
  ) {
    // If we captured an error, but getDerivedStateFrom catch is not defined,
    // unmount all the children. componentDidCatch will schedule an update to
    // re-render a fallback. This is temporary until we migrate everyone to
    // the new API.
    // TODO: Warn in a future release.
    nextChildren = null;

    if (enableProfilerTimer) {
      stopProfilerTimerIfRunning(workInProgress);
    }
  } else {
    {
      nextChildren = instance.render();
    }
  } // React DevTools reads this flag.

  workInProgress.effectTag |= PerformedWork;

  if (current$$1 !== null && didCaptureError) {
    // If we're recovering from an error, reconcile without reusing any of
    // the existing children. Conceptually, the normal children and the children
    // that are shown on error are two different sets, so we shouldn't reuse
    // normal children even if their identities match.
    forceUnmountCurrentAndReconcile(
      current$$1,
      workInProgress,
      nextChildren,
      renderExpirationTime
    );
  } else {
    reconcileChildren(
      current$$1,
      workInProgress,
      nextChildren,
      renderExpirationTime
    );
  } // Memoize state using the values we just used to render.
  // TODO: Restructure so we never read values from the instance.

  workInProgress.memoizedState = instance.state; // The context might have changed so we need to recalculate it.

  if (hasContext) {
    invalidateContextProvider(workInProgress, Component, true);
  }

  return workInProgress.child;
}

function pushHostRootContext(workInProgress) {
  var root = workInProgress.stateNode;

  if (root.pendingContext) {
    pushTopLevelContextObject(
      workInProgress,
      root.pendingContext,
      root.pendingContext !== root.context
    );
  } else if (root.context) {
    // Should always be set
    pushTopLevelContextObject(workInProgress, root.context, false);
  }

  pushHostContainer(workInProgress, root.containerInfo);
}

function updateHostRoot(current$$1, workInProgress, renderExpirationTime) {
  pushHostRootContext(workInProgress);
  var updateQueue = workInProgress.updateQueue;

  (function() {
    if (!(updateQueue !== null)) {
      throw ReactError(
        Error(
          "If the root does not have an updateQueue, we should have already bailed out. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();

  var nextProps = workInProgress.pendingProps;
  var prevState = workInProgress.memoizedState;
  var prevChildren = prevState !== null ? prevState.element : null;
  processUpdateQueue(
    workInProgress,
    updateQueue,
    nextProps,
    null,
    renderExpirationTime
  );
  var nextState = workInProgress.memoizedState; // Caution: React DevTools currently depends on this property
  // being called "element".

  var nextChildren = nextState.element;

  if (nextChildren === prevChildren) {
    // If the state is the same as before, that's a bailout because we had
    // no work that expires at this time.
    resetHydrationState();
    return bailoutOnAlreadyFinishedWork(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  }

  var root = workInProgress.stateNode;

  if (
    (current$$1 === null || current$$1.child === null) &&
    root.hydrate &&
    enterHydrationState(workInProgress)
  ) {
    // If we don't have any current children this might be the first pass.
    // We always try to hydrate. If this isn't a hydration pass there won't
    // be any children to hydrate which is effectively the same thing as
    // not hydrating.
    // This is a bit of a hack. We track the host root as a placement to
    // know that we're currently in a mounting state. That way isMounted
    // works as expected. We must reset this before committing.
    // TODO: Delete this when we delete isMounted and findDOMNode.
    workInProgress.effectTag |= Placement; // Ensure that children mount into this root without tracking
    // side-effects. This ensures that we don't store Placement effects on
    // nodes that will be hydrated.

    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    );
  } else {
    // Otherwise reset hydration state in case we aborted and resumed another
    // root.
    reconcileChildren(
      current$$1,
      workInProgress,
      nextChildren,
      renderExpirationTime
    );
    resetHydrationState();
  }

  return workInProgress.child;
}

function updateHostComponent(current$$1, workInProgress, renderExpirationTime) {
  pushHostContext(workInProgress);

  if (current$$1 === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  var type = workInProgress.type;
  var nextProps = workInProgress.pendingProps;
  var prevProps = current$$1 !== null ? current$$1.memoizedProps : null;
  var nextChildren = nextProps.children;
  var isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also have access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.effectTag |= ContentReset;
  }

  markRef(current$$1, workInProgress); // Check the host config to see if the children are offscreen/hidden.

  if (
    workInProgress.mode & ConcurrentMode &&
    renderExpirationTime !== Never &&
    shouldDeprioritizeSubtree(type, nextProps)
  ) {
    if (enableSchedulerTracing) {
      markSpawnedWork(Never);
    } // Schedule this fiber to re-render at offscreen priority. Then bailout.

    workInProgress.expirationTime = workInProgress.childExpirationTime = Never;
    return null;
  }

  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function updateHostText(current$$1, workInProgress) {
  if (current$$1 === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  } // Nothing to do here. This is terminal. We'll do the completion step
  // immediately after.

  return null;
}

function mountLazyComponent(
  _current,
  workInProgress,
  elementType,
  updateExpirationTime,
  renderExpirationTime
) {
  if (_current !== null) {
    // An lazy component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.effectTag |= Placement;
  }

  var props = workInProgress.pendingProps; // We can't start a User Timing measurement with correct label yet.
  // Cancel and resume right after we know the tag.

  cancelWorkTimer(workInProgress);
  var Component = readLazyComponentType(elementType); // Store the unwrapped component in the type.

  workInProgress.type = Component;
  var resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component));
  startWorkTimer(workInProgress);
  var resolvedProps = resolveDefaultProps(Component, props);
  var child;

  switch (resolvedTag) {
    case FunctionComponent: {
      child = updateFunctionComponent(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      );
      break;
    }

    case ClassComponent: {
      child = updateClassComponent(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      );
      break;
    }

    case ForwardRef: {
      child = updateForwardRef(
        null,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime
      );
      break;
    }

    case MemoComponent: {
      child = updateMemoComponent(
        null,
        workInProgress,
        Component,
        resolveDefaultProps(Component.type, resolvedProps), // The inner type can have defaults too
        updateExpirationTime,
        renderExpirationTime
      );
      break;
    }

    default: {
      var hint = "";

      (function() {
        {
          throw ReactError(
            Error(
              "Element type is invalid. Received a promise that resolves to: " +
                Component +
                ". Lazy element type must resolve to a class or function." +
                hint
            )
          );
        }
      })();
    }
  }

  return child;
}

function mountIncompleteClassComponent(
  _current,
  workInProgress,
  Component,
  nextProps,
  renderExpirationTime
) {
  if (_current !== null) {
    // An incomplete component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.effectTag |= Placement;
  } // Promote the fiber to a class and try rendering again.

  workInProgress.tag = ClassComponent; // The rest of this function is a fork of `updateClassComponent`
  // Push context providers early to prevent context stack mismatches.
  // During mounting we don't know the child context yet as the instance doesn't exist.
  // We will invalidate the child context in finishClassComponent() right after rendering.

  var hasContext;

  if (isContextProvider(Component)) {
    hasContext = true;
    pushContextProvider(workInProgress);
  } else {
    hasContext = false;
  }

  prepareToReadContext(workInProgress, renderExpirationTime);
  constructClassInstance(
    workInProgress,
    Component,
    nextProps,
    renderExpirationTime
  );
  mountClassInstance(
    workInProgress,
    Component,
    nextProps,
    renderExpirationTime
  );
  return finishClassComponent(
    null,
    workInProgress,
    Component,
    true,
    hasContext,
    renderExpirationTime
  );
}

function mountIndeterminateComponent(
  _current,
  workInProgress,
  Component,
  renderExpirationTime
) {
  if (_current !== null) {
    // An indeterminate component only mounts if it suspended inside a non-
    // concurrent tree, in an inconsistent state. We want to treat it like
    // a new mount, even though an empty version of it already committed.
    // Disconnect the alternate pointers.
    _current.alternate = null;
    workInProgress.alternate = null; // Since this is conceptually a new fiber, schedule a Placement effect

    workInProgress.effectTag |= Placement;
  }

  var props = workInProgress.pendingProps;
  var context;

  if (!disableLegacyContext) {
    var unmaskedContext = getUnmaskedContext(workInProgress, Component, false);
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  prepareToReadContext(workInProgress, renderExpirationTime);
  var value;

  {
    value = renderWithHooks(
      null,
      workInProgress,
      Component,
      props,
      context,
      renderExpirationTime
    );
  } // React DevTools reads this flag.

  workInProgress.effectTag |= PerformedWork;

  if (
    typeof value === "object" &&
    value !== null &&
    typeof value.render === "function" &&
    value.$$typeof === undefined
  ) {
    workInProgress.tag = ClassComponent; // Throw out any hooks that were used.

    resetHooks(); // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.

    var hasContext = false;

    if (isContextProvider(Component)) {
      hasContext = true;
      pushContextProvider(workInProgress);
    } else {
      hasContext = false;
    }

    workInProgress.memoizedState =
      value.state !== null && value.state !== undefined ? value.state : null;
    var getDerivedStateFromProps = Component.getDerivedStateFromProps;

    if (typeof getDerivedStateFromProps === "function") {
      applyDerivedStateFromProps(
        workInProgress,
        Component,
        getDerivedStateFromProps,
        props
      );
    }

    adoptClassInstance(workInProgress, value);
    mountClassInstance(workInProgress, Component, props, renderExpirationTime);
    return finishClassComponent(
      null,
      workInProgress,
      Component,
      true,
      hasContext,
      renderExpirationTime
    );
  } else {
    // Proceed under the assumption that this is a function component
    workInProgress.tag = FunctionComponent;

    reconcileChildren(null, workInProgress, value, renderExpirationTime);

    return workInProgress.child;
  }
}

var SUSPENDED_MARKER = {
  dehydrated: null,
  retryTime: Never
};

function shouldRemainOnFallback(suspenseContext, current$$1, workInProgress) {
  // If the context is telling us that we should show a fallback, and we're not
  // already showing content, then we should show the fallback instead.
  return (
    hasSuspenseContext(suspenseContext, ForceSuspenseFallback) &&
    (current$$1 === null || current$$1.memoizedState !== null)
  );
}

function updateSuspenseComponent(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  var mode = workInProgress.mode;
  var nextProps = workInProgress.pendingProps; // This is used by DevTools to force a boundary to suspend.

  var suspenseContext = suspenseStackCursor.current;
  var nextDidTimeout = false;
  var didSuspend = (workInProgress.effectTag & DidCapture) !== NoEffect;

  if (
    didSuspend ||
    shouldRemainOnFallback(suspenseContext, current$$1, workInProgress)
  ) {
    // Something in this boundary's subtree already suspended. Switch to
    // rendering the fallback children.
    nextDidTimeout = true;
    workInProgress.effectTag &= ~DidCapture;
  } else {
    // Attempting the main content
    if (current$$1 === null || current$$1.memoizedState !== null) {
      // This is a new mount or this boundary is already showing a fallback state.
      // Mark this subtree context as having at least one invisible parent that could
      // handle the fallback state.
      // Boundaries without fallbacks or should be avoided are not considered since
      // they cannot handle preferred fallback states.
      if (
        nextProps.fallback !== undefined &&
        nextProps.unstable_avoidThisFallback !== true
      ) {
        suspenseContext = addSubtreeSuspenseContext(
          suspenseContext,
          InvisibleParentSuspenseContext
        );
      }
    }
  }

  suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  pushSuspenseContext(workInProgress, suspenseContext);

  if (current$$1 === null) {
    if (enableSuspenseServerRenderer) {
      // If we're currently hydrating, try to hydrate this boundary.
      // But only if this has a fallback.
      if (nextProps.fallback !== undefined) {
        tryToClaimNextHydratableInstance(workInProgress); // This could've been a dehydrated suspense component.

        var suspenseState = workInProgress.memoizedState;

        if (suspenseState !== null) {
          var dehydrated = suspenseState.dehydrated;

          if (dehydrated !== null) {
            return mountDehydratedSuspenseComponent(
              workInProgress,
              dehydrated,
              renderExpirationTime
            );
          }
        }
      }
    } // This is the initial mount. This branch is pretty simple because there's
    // no previous state that needs to be preserved.

    if (nextDidTimeout) {
      // Mount separate fragments for primary and fallback children.
      var nextFallbackChildren = nextProps.fallback;
      var primaryChildFragment = createFiberFromFragment(
        null,
        mode,
        NoWork,
        null
      );
      primaryChildFragment.return = workInProgress;

      if ((workInProgress.mode & BatchedMode) === NoMode) {
        // Outside of batched mode, we commit the effects from the
        // partially completed, timed-out tree, too.
        var progressedState = workInProgress.memoizedState;
        var progressedPrimaryChild =
          progressedState !== null
            ? workInProgress.child.child
            : workInProgress.child;
        primaryChildFragment.child = progressedPrimaryChild;
        var progressedChild = progressedPrimaryChild;

        while (progressedChild !== null) {
          progressedChild.return = primaryChildFragment;
          progressedChild = progressedChild.sibling;
        }
      }

      var fallbackChildFragment = createFiberFromFragment(
        nextFallbackChildren,
        mode,
        renderExpirationTime,
        null
      );
      fallbackChildFragment.return = workInProgress;
      primaryChildFragment.sibling = fallbackChildFragment; // Skip the primary children, and continue working on the
      // fallback children.

      workInProgress.memoizedState = SUSPENDED_MARKER;
      workInProgress.child = primaryChildFragment;
      return fallbackChildFragment;
    } else {
      // Mount the primary children without an intermediate fragment fiber.
      var nextPrimaryChildren = nextProps.children;
      workInProgress.memoizedState = null;
      return (workInProgress.child = mountChildFibers(
        workInProgress,
        null,
        nextPrimaryChildren,
        renderExpirationTime
      ));
    }
  } else {
    // This is an update. This branch is more complicated because we need to
    // ensure the state of the primary children is preserved.
    var prevState = current$$1.memoizedState;

    if (prevState !== null) {
      if (enableSuspenseServerRenderer) {
        var _dehydrated = prevState.dehydrated;

        if (_dehydrated !== null) {
          if (!didSuspend) {
            return updateDehydratedSuspenseComponent(
              current$$1,
              workInProgress,
              _dehydrated,
              prevState,
              renderExpirationTime
            );
          } else if (workInProgress.memoizedState !== null) {
            // Something suspended and we should still be in dehydrated mode.
            // Leave the existing child in place.
            workInProgress.child = current$$1.child; // The dehydrated completion pass expects this flag to be there
            // but the normal suspense pass doesn't.

            workInProgress.effectTag |= DidCapture;
            return null;
          } else {
            // Suspended but we should no longer be in dehydrated mode.
            // Therefore we now have to render the fallback. Wrap the children
            // in a fragment fiber to keep them separate from the fallback
            // children.
            var _nextFallbackChildren = nextProps.fallback;

            var _primaryChildFragment = createFiberFromFragment(
              // It shouldn't matter what the pending props are because we aren't
              // going to render this fragment.
              null,
              mode,
              NoWork,
              null
            );

            _primaryChildFragment.return = workInProgress; // This is always null since we never want the previous child
            // that we're not going to hydrate.

            _primaryChildFragment.child = null;

            if ((workInProgress.mode & BatchedMode) === NoMode) {
              // Outside of batched mode, we commit the effects from the
              // partially completed, timed-out tree, too.
              var _progressedChild = (_primaryChildFragment.child =
                workInProgress.child);

              while (_progressedChild !== null) {
                _progressedChild.return = _primaryChildFragment;
                _progressedChild = _progressedChild.sibling;
              }
            } else {
              // We will have dropped the effect list which contains the deletion.
              // We need to reconcile to delete the current child.
              reconcileChildFibers(
                workInProgress,
                current$$1.child,
                null,
                renderExpirationTime
              );
            } // Because primaryChildFragment is a new fiber that we're inserting as the
            // parent of a new tree, we need to set its treeBaseDuration.

            if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
              // treeBaseDuration is the sum of all the child tree base durations.
              var treeBaseDuration = 0;
              var hiddenChild = _primaryChildFragment.child;

              while (hiddenChild !== null) {
                treeBaseDuration += hiddenChild.treeBaseDuration;
                hiddenChild = hiddenChild.sibling;
              }

              _primaryChildFragment.treeBaseDuration = treeBaseDuration;
            } // Create a fragment from the fallback children, too.

            var _fallbackChildFragment = createFiberFromFragment(
              _nextFallbackChildren,
              mode,
              renderExpirationTime,
              null
            );

            _fallbackChildFragment.return = workInProgress;
            _primaryChildFragment.sibling = _fallbackChildFragment;
            _fallbackChildFragment.effectTag |= Placement;
            _primaryChildFragment.childExpirationTime = NoWork;
            workInProgress.memoizedState = SUSPENDED_MARKER;
            workInProgress.child = _primaryChildFragment; // Skip the primary children, and continue working on the
            // fallback children.

            return _fallbackChildFragment;
          }
        }
      } // The current tree already timed out. That means each child set is
      // wrapped in a fragment fiber.

      var currentPrimaryChildFragment = current$$1.child;
      var currentFallbackChildFragment = currentPrimaryChildFragment.sibling;

      if (nextDidTimeout) {
        // Still timed out. Reuse the current primary children by cloning
        // its fragment. We're going to skip over these entirely.
        var _nextFallbackChildren2 = nextProps.fallback;

        var _primaryChildFragment2 = createWorkInProgress(
          currentPrimaryChildFragment,
          currentPrimaryChildFragment.pendingProps,
          NoWork
        );

        _primaryChildFragment2.return = workInProgress;

        if ((workInProgress.mode & BatchedMode) === NoMode) {
          // Outside of batched mode, we commit the effects from the
          // partially completed, timed-out tree, too.
          var _progressedState = workInProgress.memoizedState;

          var _progressedPrimaryChild =
            _progressedState !== null
              ? workInProgress.child.child
              : workInProgress.child;

          if (_progressedPrimaryChild !== currentPrimaryChildFragment.child) {
            _primaryChildFragment2.child = _progressedPrimaryChild;
            var _progressedChild2 = _progressedPrimaryChild;

            while (_progressedChild2 !== null) {
              _progressedChild2.return = _primaryChildFragment2;
              _progressedChild2 = _progressedChild2.sibling;
            }
          }
        } // Because primaryChildFragment is a new fiber that we're inserting as the
        // parent of a new tree, we need to set its treeBaseDuration.

        if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
          // treeBaseDuration is the sum of all the child tree base durations.
          var _treeBaseDuration = 0;
          var _hiddenChild = _primaryChildFragment2.child;

          while (_hiddenChild !== null) {
            _treeBaseDuration += _hiddenChild.treeBaseDuration;
            _hiddenChild = _hiddenChild.sibling;
          }

          _primaryChildFragment2.treeBaseDuration = _treeBaseDuration;
        } // Clone the fallback child fragment, too. These we'll continue
        // working on.

        var _fallbackChildFragment2 = createWorkInProgress(
          currentFallbackChildFragment,
          _nextFallbackChildren2,
          currentFallbackChildFragment.expirationTime
        );

        _fallbackChildFragment2.return = workInProgress;
        _primaryChildFragment2.sibling = _fallbackChildFragment2;
        _primaryChildFragment2.childExpirationTime = NoWork; // Skip the primary children, and continue working on the
        // fallback children.

        workInProgress.memoizedState = SUSPENDED_MARKER;
        workInProgress.child = _primaryChildFragment2;
        return _fallbackChildFragment2;
      } else {
        // No longer suspended. Switch back to showing the primary children,
        // and remove the intermediate fragment fiber.
        var _nextPrimaryChildren = nextProps.children;
        var currentPrimaryChild = currentPrimaryChildFragment.child;
        var primaryChild = reconcileChildFibers(
          workInProgress,
          currentPrimaryChild,
          _nextPrimaryChildren,
          renderExpirationTime
        ); // If this render doesn't suspend, we need to delete the fallback
        // children. Wait until the complete phase, after we've confirmed the
        // fallback is no longer needed.
        // TODO: Would it be better to store the fallback fragment on
        // the stateNode?
        // Continue rendering the children, like we normally do.

        workInProgress.memoizedState = null;
        return (workInProgress.child = primaryChild);
      }
    } else {
      // The current tree has not already timed out. That means the primary
      // children are not wrapped in a fragment fiber.
      var _currentPrimaryChild = current$$1.child;

      if (nextDidTimeout) {
        // Timed out. Wrap the children in a fragment fiber to keep them
        // separate from the fallback children.
        var _nextFallbackChildren3 = nextProps.fallback;

        var _primaryChildFragment3 = createFiberFromFragment(
          // It shouldn't matter what the pending props are because we aren't
          // going to render this fragment.
          null,
          mode,
          NoWork,
          null
        );

        _primaryChildFragment3.return = workInProgress;
        _primaryChildFragment3.child = _currentPrimaryChild;

        if (_currentPrimaryChild !== null) {
          _currentPrimaryChild.return = _primaryChildFragment3;
        } // Even though we're creating a new fiber, there are no new children,
        // because we're reusing an already mounted tree. So we don't need to
        // schedule a placement.
        // primaryChildFragment.effectTag |= Placement;

        if ((workInProgress.mode & BatchedMode) === NoMode) {
          // Outside of batched mode, we commit the effects from the
          // partially completed, timed-out tree, too.
          var _progressedState2 = workInProgress.memoizedState;

          var _progressedPrimaryChild2 =
            _progressedState2 !== null
              ? workInProgress.child.child
              : workInProgress.child;

          _primaryChildFragment3.child = _progressedPrimaryChild2;
          var _progressedChild3 = _progressedPrimaryChild2;

          while (_progressedChild3 !== null) {
            _progressedChild3.return = _primaryChildFragment3;
            _progressedChild3 = _progressedChild3.sibling;
          }
        } // Because primaryChildFragment is a new fiber that we're inserting as the
        // parent of a new tree, we need to set its treeBaseDuration.

        if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
          // treeBaseDuration is the sum of all the child tree base durations.
          var _treeBaseDuration2 = 0;
          var _hiddenChild2 = _primaryChildFragment3.child;

          while (_hiddenChild2 !== null) {
            _treeBaseDuration2 += _hiddenChild2.treeBaseDuration;
            _hiddenChild2 = _hiddenChild2.sibling;
          }

          _primaryChildFragment3.treeBaseDuration = _treeBaseDuration2;
        } // Create a fragment from the fallback children, too.

        var _fallbackChildFragment3 = createFiberFromFragment(
          _nextFallbackChildren3,
          mode,
          renderExpirationTime,
          null
        );

        _fallbackChildFragment3.return = workInProgress;
        _primaryChildFragment3.sibling = _fallbackChildFragment3;
        _fallbackChildFragment3.effectTag |= Placement;
        _primaryChildFragment3.childExpirationTime = NoWork; // Skip the primary children, and continue working on the
        // fallback children.

        workInProgress.memoizedState = SUSPENDED_MARKER;
        workInProgress.child = _primaryChildFragment3;
        return _fallbackChildFragment3;
      } else {
        // Still haven't timed out.  Continue rendering the children, like we
        // normally do.
        workInProgress.memoizedState = null;
        var _nextPrimaryChildren2 = nextProps.children;
        return (workInProgress.child = reconcileChildFibers(
          workInProgress,
          _currentPrimaryChild,
          _nextPrimaryChildren2,
          renderExpirationTime
        ));
      }
    }
  }
}

function retrySuspenseComponentWithoutHydrating(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  // We're now not suspended nor dehydrated.
  workInProgress.memoizedState = null; // Retry with the full children.

  var nextProps = workInProgress.pendingProps;
  var nextChildren = nextProps.children; // This will ensure that the children get Placement effects and
  // that the old child gets a Deletion effect.
  // We could also call forceUnmountCurrentAndReconcile.

  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function mountDehydratedSuspenseComponent(
  workInProgress,
  suspenseInstance,
  renderExpirationTime
) {
  // During the first pass, we'll bail out and not drill into the children.
  // Instead, we'll leave the content in place and try to hydrate it later.
  if ((workInProgress.mode & BatchedMode) === NoMode) {
    workInProgress.expirationTime = Sync;
  } else if (isSuspenseInstanceFallback(suspenseInstance)) {
    // This is a client-only boundary. Since we won't get any content from the server
    // for this, we need to schedule that at a higher priority based on when it would
    // have timed out. In theory we could render it in this pass but it would have the
    // wrong priority associated with it and will prevent hydration of parent path.
    // Instead, we'll leave work left on it to render it in a separate commit.
    // TODO This time should be the time at which the server rendered response that is
    // a parent to this boundary was displayed. However, since we currently don't have
    // a protocol to transfer that time, we'll just estimate it by using the current
    // time. This will mean that Suspense timeouts are slightly shifted to later than
    // they should be.
    var serverDisplayTime = requestCurrentTime(); // Schedule a normal pri update to render this content.

    var newExpirationTime = computeAsyncExpiration(serverDisplayTime);

    if (enableSchedulerTracing) {
      markSpawnedWork(newExpirationTime);
    }

    workInProgress.expirationTime = newExpirationTime;
  } else {
    // We'll continue hydrating the rest at offscreen priority since we'll already
    // be showing the right content coming from the server, it is no rush.
    workInProgress.expirationTime = Never;

    if (enableSchedulerTracing) {
      markSpawnedWork(Never);
    }
  }

  return null;
}

function updateDehydratedSuspenseComponent(
  current$$1,
  workInProgress,
  suspenseInstance,
  suspenseState,
  renderExpirationTime
) {
  // We should never be hydrating at this point because it is the first pass,
  // but after we've already committed once.
  if ((workInProgress.mode & BatchedMode) === NoMode) {
    return retrySuspenseComponentWithoutHydrating(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  }

  if (isSuspenseInstanceFallback(suspenseInstance)) {
    // This boundary is in a permanent fallback state. In this case, we'll never
    // get an update and we'll never be able to hydrate the final content. Let's just try the
    // client side render instead.
    return retrySuspenseComponentWithoutHydrating(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  } // We use childExpirationTime to indicate that a child might depend on context, so if
  // any context has changed, we need to treat is as if the input might have changed.

  var hasContextChanged$$1 =
    current$$1.childExpirationTime >= renderExpirationTime;

  if (didReceiveUpdate || hasContextChanged$$1) {
    // This boundary has changed since the first render. This means that we are now unable to
    // hydrate it. We might still be able to hydrate it using an earlier expiration time, if
    // we are rendering at lower expiration than sync.
    if (renderExpirationTime < Sync) {
      if (suspenseState.retryTime <= renderExpirationTime) {
        // This render is even higher pri than we've seen before, let's try again
        // at even higher pri.
        var attemptHydrationAtExpirationTime = renderExpirationTime + 1;
        suspenseState.retryTime = attemptHydrationAtExpirationTime;
        scheduleWork(current$$1, attemptHydrationAtExpirationTime); // TODO: Early abort this render.
      } else {
        // We have already tried to ping at a higher priority than we're rendering with
        // so if we got here, we must have failed to hydrate at those levels. We must
        // now give up. Instead, we're going to delete the whole subtree and instead inject
        // a new real Suspense boundary to take its place, which may render content
        // or fallback. This might suspend for a while and if it does we might still have
        // an opportunity to hydrate before this pass commits.
      }
    } // If we have scheduled higher pri work above, this will probably just abort the render
    // since we now have higher priority work, but in case it doesn't, we need to prepare to
    // render something, if we time out. Even if that requires us to delete everything and
    // skip hydration.
    // Delay having to do this as long as the suspense timeout allows us.

    renderDidSuspendDelayIfPossible();
    return retrySuspenseComponentWithoutHydrating(
      current$$1,
      workInProgress,
      renderExpirationTime
    );
  } else if (isSuspenseInstancePending(suspenseInstance)) {
    // This component is still pending more data from the server, so we can't hydrate its
    // content. We treat it as if this component suspended itself. It might seem as if
    // we could just try to render it client-side instead. However, this will perform a
    // lot of unnecessary work and is unlikely to complete since it often will suspend
    // on missing data anyway. Additionally, the server might be able to render more
    // than we can on the client yet. In that case we'd end up with more fallback states
    // on the client than if we just leave it alone. If the server times out or errors
    // these should update this boundary to the permanent Fallback state instead.
    // Mark it as having captured (i.e. suspended).
    workInProgress.effectTag |= DidCapture; // Leave the child in place. I.e. the dehydrated fragment.

    workInProgress.child = current$$1.child; // Register a callback to retry this boundary once the server has sent the result.

    registerSuspenseInstanceRetry(
      suspenseInstance,
      retryDehydratedSuspenseBoundary.bind(null, current$$1)
    );
    return null;
  } else {
    // This is the first attempt.
    reenterHydrationStateFromDehydratedSuspenseInstance(
      workInProgress,
      suspenseInstance
    );
    var nextProps = workInProgress.pendingProps;
    var nextChildren = nextProps.children;
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    );
    return workInProgress.child;
  }
}

function propagateSuspenseContextChange(
  workInProgress,
  firstChild,
  renderExpirationTime
) {
  // Mark any Suspense boundaries with fallbacks as having work to do.
  // If they were previously forced into fallbacks, they may now be able
  // to unblock.
  var node = firstChild;

  while (node !== null) {
    if (node.tag === SuspenseComponent) {
      var state = node.memoizedState;

      if (state !== null) {
        if (node.expirationTime < renderExpirationTime) {
          node.expirationTime = renderExpirationTime;
        }

        var alternate = node.alternate;

        if (
          alternate !== null &&
          alternate.expirationTime < renderExpirationTime
        ) {
          alternate.expirationTime = renderExpirationTime;
        }

        scheduleWorkOnParentPath(node.return, renderExpirationTime);
      }
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function findLastContentRow(firstChild) {
  // This is going to find the last row among these children that is already
  // showing content on the screen, as opposed to being in fallback state or
  // new. If a row has multiple Suspense boundaries, any of them being in the
  // fallback state, counts as the whole row being in a fallback state.
  // Note that the "rows" will be workInProgress, but any nested children
  // will still be current since we haven't rendered them yet. The mounted
  // order may not be the same as the new order. We use the new order.
  var row = firstChild;
  var lastContentRow = null;

  while (row !== null) {
    var currentRow = row.alternate; // New rows can't be content rows.

    if (currentRow !== null && findFirstSuspended(currentRow) === null) {
      lastContentRow = row;
    }

    row = row.sibling;
  }

  return lastContentRow;
}

function initSuspenseListRenderState(
  workInProgress,
  isBackwards,
  tail,
  lastContentRow,
  tailMode
) {
  var renderState = workInProgress.memoizedState;

  if (renderState === null) {
    workInProgress.memoizedState = {
      isBackwards: isBackwards,
      rendering: null,
      last: lastContentRow,
      tail: tail,
      tailExpiration: 0,
      tailMode: tailMode
    };
  } else {
    // We can reuse the existing object from previous renders.
    renderState.isBackwards = isBackwards;
    renderState.rendering = null;
    renderState.last = lastContentRow;
    renderState.tail = tail;
    renderState.tailExpiration = 0;
    renderState.tailMode = tailMode;
  }
} // This can end up rendering this component multiple passes.
// The first pass splits the children fibers into two sets. A head and tail.
// We first render the head. If anything is in fallback state, we do another
// pass through beginWork to rerender all children (including the tail) with
// the force suspend context. If the first render didn't have anything in
// in fallback state. Then we render each row in the tail one-by-one.
// That happens in the completeWork phase without going back to beginWork.

function updateSuspenseListComponent(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  var nextProps = workInProgress.pendingProps;
  var revealOrder = nextProps.revealOrder;
  var tailMode = nextProps.tail;
  var newChildren = nextProps.children;
  reconcileChildren(
    current$$1,
    workInProgress,
    newChildren,
    renderExpirationTime
  );
  var suspenseContext = suspenseStackCursor.current;
  var shouldForceFallback = hasSuspenseContext(
    suspenseContext,
    ForceSuspenseFallback
  );

  if (shouldForceFallback) {
    suspenseContext = setShallowSuspenseContext(
      suspenseContext,
      ForceSuspenseFallback
    );
    workInProgress.effectTag |= DidCapture;
  } else {
    var didSuspendBefore =
      current$$1 !== null && (current$$1.effectTag & DidCapture) !== NoEffect;

    if (didSuspendBefore) {
      // If we previously forced a fallback, we need to schedule work
      // on any nested boundaries to let them know to try to render
      // again. This is the same as context updating.
      propagateSuspenseContextChange(
        workInProgress,
        workInProgress.child,
        renderExpirationTime
      );
    }

    suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
  }

  pushSuspenseContext(workInProgress, suspenseContext);

  if ((workInProgress.mode & BatchedMode) === NoMode) {
    // Outside of batched mode, SuspenseList doesn't work so we just
    // use make it a noop by treating it as the default revealOrder.
    workInProgress.memoizedState = null;
  } else {
    switch (revealOrder) {
      case "forwards": {
        var lastContentRow = findLastContentRow(workInProgress.child);
        var tail;

        if (lastContentRow === null) {
          // The whole list is part of the tail.
          // TODO: We could fast path by just rendering the tail now.
          tail = workInProgress.child;
          workInProgress.child = null;
        } else {
          // Disconnect the tail rows after the content row.
          // We're going to render them separately later.
          tail = lastContentRow.sibling;
          lastContentRow.sibling = null;
        }

        initSuspenseListRenderState(
          workInProgress,
          false, // isBackwards
          tail,
          lastContentRow,
          tailMode
        );
        break;
      }

      case "backwards": {
        // We're going to find the first row that has existing content.
        // At the same time we're going to reverse the list of everything
        // we pass in the meantime. That's going to be our tail in reverse
        // order.
        var _tail = null;
        var row = workInProgress.child;
        workInProgress.child = null;

        while (row !== null) {
          var currentRow = row.alternate; // New rows can't be content rows.

          if (currentRow !== null && findFirstSuspended(currentRow) === null) {
            // This is the beginning of the main content.
            workInProgress.child = row;
            break;
          }

          var nextRow = row.sibling;
          row.sibling = _tail;
          _tail = row;
          row = nextRow;
        } // TODO: If workInProgress.child is null, we can continue on the tail immediately.

        initSuspenseListRenderState(
          workInProgress,
          true, // isBackwards
          _tail,
          null, // last
          tailMode
        );
        break;
      }

      case "together": {
        initSuspenseListRenderState(
          workInProgress,
          false, // isBackwards
          null, // tail
          null, // last
          undefined
        );
        break;
      }

      default: {
        // The default reveal order is the same as not having
        // a boundary.
        workInProgress.memoizedState = null;
      }
    }
  }

  return workInProgress.child;
}

function updatePortalComponent(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
  var nextChildren = workInProgress.pendingProps;

  if (current$$1 === null) {
    // Portals are special because we don't append the children during mount
    // but at commit. Therefore we need to track insertions which the normal
    // flow doesn't do during mount. This doesn't happen at the root because
    // the root always starts with a "current" with a null child.
    // TODO: Consider unifying this with how the root works.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime
    );
  } else {
    reconcileChildren(
      current$$1,
      workInProgress,
      nextChildren,
      renderExpirationTime
    );
  }

  return workInProgress.child;
}

function updateContextProvider(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  var providerType = workInProgress.type;
  var context = providerType._context;
  var newProps = workInProgress.pendingProps;
  var oldProps = workInProgress.memoizedProps;
  var newValue = newProps.value;

  pushProvider(workInProgress, newValue);

  if (oldProps !== null) {
    var oldValue = oldProps.value;
    var changedBits = calculateChangedBits(context, newValue, oldValue);

    if (changedBits === 0) {
      // No change. Bailout early if children are the same.
      if (oldProps.children === newProps.children && !hasContextChanged()) {
        return bailoutOnAlreadyFinishedWork(
          current$$1,
          workInProgress,
          renderExpirationTime
        );
      }
    } else {
      // The context value changed. Search for matching consumers and schedule
      // them to update.
      propagateContextChange(
        workInProgress,
        context,
        changedBits,
        renderExpirationTime
      );
    }
  }

  var newChildren = newProps.children;
  reconcileChildren(
    current$$1,
    workInProgress,
    newChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function updateContextConsumer(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  var context = workInProgress.type; // The logic below for Context differs depending on PROD or DEV mode. In
  // DEV mode, we create a separate object for Context.Consumer that acts
  // like a proxy to Context. This proxy object adds unnecessary code in PROD
  // so we use the old behaviour (Context.Consumer references Context) to
  // reduce size and overhead. The separate object references context via
  // a property called "_context", which also gives us the ability to check
  // in DEV mode if this property exists or not and warn if it does not.

  var newProps = workInProgress.pendingProps;
  var render = newProps.children;

  prepareToReadContext(workInProgress, renderExpirationTime);
  var newValue = readContext(context, newProps.unstable_observedBits);
  var newChildren;

  {
    newChildren = render(newValue);
  } // React DevTools reads this flag.

  workInProgress.effectTag |= PerformedWork;
  reconcileChildren(
    current$$1,
    workInProgress,
    newChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function updateFundamentalComponent$1(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  var fundamentalImpl = workInProgress.type.impl;

  if (fundamentalImpl.reconcileChildren === false) {
    return null;
  }

  var nextProps = workInProgress.pendingProps;
  var nextChildren = nextProps.children;
  reconcileChildren(
    current$$1,
    workInProgress,
    nextChildren,
    renderExpirationTime
  );
  return workInProgress.child;
}

function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true;
}

function bailoutOnAlreadyFinishedWork(
  current$$1,
  workInProgress,
  renderExpirationTime
) {
  cancelWorkTimer(workInProgress);

  if (current$$1 !== null) {
    // Reuse previous dependencies
    workInProgress.dependencies = current$$1.dependencies;
  }

  if (enableProfilerTimer) {
    // Don't update "base" render times for bailouts.
    stopProfilerTimerIfRunning(workInProgress);
  } // Check if the children have any pending work.

  var childExpirationTime = workInProgress.childExpirationTime;

  if (childExpirationTime < renderExpirationTime) {
    // The children don't have any work either. We can skip them.
    // TODO: Once we add back resuming, we should check if the children are
    // a work-in-progress set. If so, we need to transfer their effects.
    return null;
  } else {
    // This fiber doesn't have work, but its subtree does. Clone the child
    // fibers and continue.
    cloneChildFibers(current$$1, workInProgress);
    return workInProgress.child;
  }
}

function beginWork$1(current$$1, workInProgress, renderExpirationTime) {
  var updateExpirationTime = workInProgress.expirationTime;

  if (current$$1 !== null) {
    var oldProps = current$$1.memoizedProps;
    var newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasContextChanged() || // Force a re-render if the implementation changed due to hot reload:
      false
    ) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else if (updateExpirationTime < renderExpirationTime) {
      didReceiveUpdate = false; // This fiber does not have any pending work. Bailout without entering
      // the begin phase. There's still some bookkeeping we that needs to be done
      // in this optimized path, mostly pushing stuff onto the stack.

      switch (workInProgress.tag) {
        case HostRoot:
          pushHostRootContext(workInProgress);
          resetHydrationState();
          break;

        case HostComponent:
          pushHostContext(workInProgress);

          if (
            workInProgress.mode & ConcurrentMode &&
            renderExpirationTime !== Never &&
            shouldDeprioritizeSubtree(workInProgress.type, newProps)
          ) {
            if (enableSchedulerTracing) {
              markSpawnedWork(Never);
            } // Schedule this fiber to re-render at offscreen priority. Then bailout.

            workInProgress.expirationTime = workInProgress.childExpirationTime = Never;
            return null;
          }

          break;

        case ClassComponent: {
          var Component = workInProgress.type;

          if (isContextProvider(Component)) {
            pushContextProvider(workInProgress);
          }

          break;
        }

        case HostPortal:
          pushHostContainer(
            workInProgress,
            workInProgress.stateNode.containerInfo
          );
          break;

        case ContextProvider: {
          var newValue = workInProgress.memoizedProps.value;
          pushProvider(workInProgress, newValue);
          break;
        }

        case Profiler:
          if (enableProfilerTimer) {
            workInProgress.effectTag |= Update;
          }

          break;

        case SuspenseComponent: {
          var state = workInProgress.memoizedState;

          if (state !== null) {
            if (enableSuspenseServerRenderer) {
              if (state.dehydrated !== null) {
                pushSuspenseContext(
                  workInProgress,
                  setDefaultShallowSuspenseContext(suspenseStackCursor.current)
                ); // We know that this component will suspend again because if it has
                // been unsuspended it has committed as a resolved Suspense component.
                // If it needs to be retried, it should have work scheduled on it.

                workInProgress.effectTag |= DidCapture;
                break;
              }
            } // If this boundary is currently timed out, we need to decide
            // whether to retry the primary children, or to skip over it and
            // go straight to the fallback. Check the priority of the primary
            // child fragment.

            var primaryChildFragment = workInProgress.child;
            var primaryChildExpirationTime =
              primaryChildFragment.childExpirationTime;

            if (
              primaryChildExpirationTime !== NoWork &&
              primaryChildExpirationTime >= renderExpirationTime
            ) {
              // The primary children have pending work. Use the normal path
              // to attempt to render the primary children again.
              return updateSuspenseComponent(
                current$$1,
                workInProgress,
                renderExpirationTime
              );
            } else {
              pushSuspenseContext(
                workInProgress,
                setDefaultShallowSuspenseContext(suspenseStackCursor.current)
              ); // The primary children do not have pending work with sufficient
              // priority. Bailout.

              var child = bailoutOnAlreadyFinishedWork(
                current$$1,
                workInProgress,
                renderExpirationTime
              );

              if (child !== null) {
                // The fallback children have pending work. Skip over the
                // primary children and work on the fallback.
                return child.sibling;
              } else {
                return null;
              }
            }
          } else {
            pushSuspenseContext(
              workInProgress,
              setDefaultShallowSuspenseContext(suspenseStackCursor.current)
            );
          }

          break;
        }

        case SuspenseListComponent: {
          var didSuspendBefore =
            (current$$1.effectTag & DidCapture) !== NoEffect;
          var hasChildWork =
            workInProgress.childExpirationTime >= renderExpirationTime;

          if (didSuspendBefore) {
            if (hasChildWork) {
              // If something was in fallback state last time, and we have all the
              // same children then we're still in progressive loading state.
              // Something might get unblocked by state updates or retries in the
              // tree which will affect the tail. So we need to use the normal
              // path to compute the correct tail.
              return updateSuspenseListComponent(
                current$$1,
                workInProgress,
                renderExpirationTime
              );
            } // If none of the children had any work, that means that none of
            // them got retried so they'll still be blocked in the same way
            // as before. We can fast bail out.

            workInProgress.effectTag |= DidCapture;
          } // If nothing suspended before and we're rendering the same children,
          // then the tail doesn't matter. Anything new that suspends will work
          // in the "together" mode, so we can continue from the state we had.

          var renderState = workInProgress.memoizedState;

          if (renderState !== null) {
            // Reset to the "together" mode in case we've started a different
            // update in the past but didn't complete it.
            renderState.rendering = null;
            renderState.tail = null;
          }

          pushSuspenseContext(workInProgress, suspenseStackCursor.current);

          if (hasChildWork) {
            break;
          } else {
            // If none of the children had any work, that means that none of
            // them got retried so they'll still be blocked in the same way
            // as before. We can fast bail out.
            return null;
          }
        }
      }

      return bailoutOnAlreadyFinishedWork(
        current$$1,
        workInProgress,
        renderExpirationTime
      );
    } else {
      // An update was scheduled on this fiber, but there are no new props
      // nor legacy context. Set this to false. If an update queue or context
      // consumer produces a changed value, it will set this to true. Otherwise,
      // the component will assume the children have not changed and bail out.
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  } // Before entering the begin phase, clear the expiration time.

  workInProgress.expirationTime = NoWork;

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        current$$1,
        workInProgress,
        workInProgress.type,
        renderExpirationTime
      );
    }

    case LazyComponent: {
      var elementType = workInProgress.elementType;
      return mountLazyComponent(
        current$$1,
        workInProgress,
        elementType,
        updateExpirationTime,
        renderExpirationTime
      );
    }

    case FunctionComponent: {
      var _Component = workInProgress.type;
      var unresolvedProps = workInProgress.pendingProps;
      var resolvedProps =
        workInProgress.elementType === _Component
          ? unresolvedProps
          : resolveDefaultProps(_Component, unresolvedProps);
      return updateFunctionComponent(
        current$$1,
        workInProgress,
        _Component,
        resolvedProps,
        renderExpirationTime
      );
    }

    case ClassComponent: {
      var _Component2 = workInProgress.type;
      var _unresolvedProps = workInProgress.pendingProps;

      var _resolvedProps =
        workInProgress.elementType === _Component2
          ? _unresolvedProps
          : resolveDefaultProps(_Component2, _unresolvedProps);

      return updateClassComponent(
        current$$1,
        workInProgress,
        _Component2,
        _resolvedProps,
        renderExpirationTime
      );
    }

    case HostRoot:
      return updateHostRoot(current$$1, workInProgress, renderExpirationTime);

    case HostComponent:
      return updateHostComponent(
        current$$1,
        workInProgress,
        renderExpirationTime
      );

    case HostText:
      return updateHostText(current$$1, workInProgress);

    case SuspenseComponent:
      return updateSuspenseComponent(
        current$$1,
        workInProgress,
        renderExpirationTime
      );

    case HostPortal:
      return updatePortalComponent(
        current$$1,
        workInProgress,
        renderExpirationTime
      );

    case ForwardRef: {
      var type = workInProgress.type;
      var _unresolvedProps2 = workInProgress.pendingProps;

      var _resolvedProps2 =
        workInProgress.elementType === type
          ? _unresolvedProps2
          : resolveDefaultProps(type, _unresolvedProps2);

      return updateForwardRef(
        current$$1,
        workInProgress,
        type,
        _resolvedProps2,
        renderExpirationTime
      );
    }

    case Fragment:
      return updateFragment(current$$1, workInProgress, renderExpirationTime);

    case Mode:
      return updateMode(current$$1, workInProgress, renderExpirationTime);

    case Profiler:
      return updateProfiler(current$$1, workInProgress, renderExpirationTime);

    case ContextProvider:
      return updateContextProvider(
        current$$1,
        workInProgress,
        renderExpirationTime
      );

    case ContextConsumer:
      return updateContextConsumer(
        current$$1,
        workInProgress,
        renderExpirationTime
      );

    case MemoComponent: {
      var _type2 = workInProgress.type;
      var _unresolvedProps3 = workInProgress.pendingProps; // Resolve outer props first, then resolve inner props.

      var _resolvedProps3 = resolveDefaultProps(_type2, _unresolvedProps3);

      _resolvedProps3 = resolveDefaultProps(_type2.type, _resolvedProps3);
      return updateMemoComponent(
        current$$1,
        workInProgress,
        _type2,
        _resolvedProps3,
        updateExpirationTime,
        renderExpirationTime
      );
    }

    case SimpleMemoComponent: {
      return updateSimpleMemoComponent(
        current$$1,
        workInProgress,
        workInProgress.type,
        workInProgress.pendingProps,
        updateExpirationTime,
        renderExpirationTime
      );
    }

    case IncompleteClassComponent: {
      var _Component3 = workInProgress.type;
      var _unresolvedProps4 = workInProgress.pendingProps;

      var _resolvedProps4 =
        workInProgress.elementType === _Component3
          ? _unresolvedProps4
          : resolveDefaultProps(_Component3, _unresolvedProps4);

      return mountIncompleteClassComponent(
        current$$1,
        workInProgress,
        _Component3,
        _resolvedProps4,
        renderExpirationTime
      );
    }

    case SuspenseListComponent: {
      return updateSuspenseListComponent(
        current$$1,
        workInProgress,
        renderExpirationTime
      );
    }

    case FundamentalComponent: {
      if (enableFundamentalAPI) {
        return updateFundamentalComponent$1(
          current$$1,
          workInProgress,
          renderExpirationTime
        );
      }

      break;
    }
  }

  (function() {
    {
      throw ReactError(
        Error(
          "Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();
}

function createFundamentalStateInstance(currentFiber, props, impl, state) {
  return {
    currentFiber: currentFiber,
    impl: impl,
    instance: null,
    prevProps: null,
    props: props,
    state: state
  };
}

var emptyObject$1 = {};
var isArray$2 = Array.isArray;

function markUpdate(workInProgress) {
  // Tag the fiber with an update effect. This turns a Placement into
  // a PlacementAndUpdate.
  workInProgress.effectTag |= Update;
}

function markRef$1(workInProgress) {
  workInProgress.effectTag |= Ref;
}

var appendAllChildren;
var updateHostContainer;
var updateHostComponent$1;
var updateHostText$1;

if (supportsMutation) {
  // Mutation mode
  appendAllChildren = function(
    parent,
    workInProgress,
    needsVisibilityToggle,
    isHidden
  ) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
    var node = workInProgress.child;

    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        appendInitialChild(parent, node.stateNode);
      } else if (enableFundamentalAPI && node.tag === FundamentalComponent) {
        appendInitialChild(parent, node.stateNode.instance);
      } else if (node.tag === HostPortal) {
        // If we have a portal child, then we don't want to traverse
        // down its children. Instead, we'll get insertions from each child in
        // the portal directly.
      } else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === workInProgress) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  };

  updateHostContainer = function(workInProgress) {
    // Noop
  };

  updateHostComponent$1 = function(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance
  ) {
    // If we have an alternate, that means this is an update and we need to
    // schedule a side-effect to do the updates.
    var oldProps = current.memoizedProps;

    if (oldProps === newProps) {
      // In mutation mode, this is sufficient for a bailout because
      // we won't touch this node even if children changed.
      return;
    } // If we get updated because one of our children updated, we don't
    // have newProps so we'll have to reuse them.
    // TODO: Split the update API as separate for the props vs. children.
    // Even better would be if children weren't special cased at all tho.

    var instance = workInProgress.stateNode;
    var currentHostContext = getHostContext(); // TODO: Experiencing an error where oldProps is null. Suggests a host
    // component is hitting the resume path. Figure out why. Possibly
    // related to `hidden`.

    var updatePayload = prepareUpdate(
      instance,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
      currentHostContext
    ); // TODO: Type this specific to this type of component.

    workInProgress.updateQueue = updatePayload; // If the update payload indicates that there is a change or if there
    // is a new ref we mark this as an update. All the work is done in commitWork.

    if (updatePayload) {
      markUpdate(workInProgress);
    }
  };

  updateHostText$1 = function(current, workInProgress, oldText, newText) {
    // If the text differs, mark it as an update. All the work in done in commitWork.
    if (oldText !== newText) {
      markUpdate(workInProgress);
    }
  };
} else if (supportsPersistence) {
  // Persistent host tree mode
  appendAllChildren = function(
    parent,
    workInProgress,
    needsVisibilityToggle,
    isHidden
  ) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
    var node = workInProgress.child;

    while (node !== null) {
      // eslint-disable-next-line no-labels
      branches: if (node.tag === HostComponent) {
        var instance = node.stateNode;

        if (needsVisibilityToggle && isHidden) {
          // This child is inside a timed out tree. Hide it.
          var props = node.memoizedProps;
          var type = node.type;
          instance = cloneHiddenInstance(instance, type, props, node);
        }

        appendInitialChild(parent, instance);
      } else if (node.tag === HostText) {
        var _instance = node.stateNode;

        if (needsVisibilityToggle && isHidden) {
          // This child is inside a timed out tree. Hide it.
          var text = node.memoizedProps;
          _instance = cloneHiddenTextInstance(_instance, text, node);
        }

        appendInitialChild(parent, _instance);
      } else if (enableFundamentalAPI && node.tag === FundamentalComponent) {
        var _instance2 = node.stateNode.instance;

        if (needsVisibilityToggle && isHidden) {
          // This child is inside a timed out tree. Hide it.
          var _props = node.memoizedProps;
          var _type = node.type;
          _instance2 = cloneHiddenInstance(_instance2, _type, _props, node);
        }

        appendInitialChild(parent, _instance2);
      } else if (node.tag === HostPortal) {
        // If we have a portal child, then we don't want to traverse
        // down its children. Instead, we'll get insertions from each child in
        // the portal directly.
      } else if (node.tag === SuspenseComponent) {
        if ((node.effectTag & Update) !== NoEffect) {
          // Need to toggle the visibility of the primary children.
          var newIsHidden = node.memoizedState !== null;

          if (newIsHidden) {
            var primaryChildParent = node.child;

            if (primaryChildParent !== null) {
              if (primaryChildParent.child !== null) {
                primaryChildParent.child.return = primaryChildParent;
                appendAllChildren(
                  parent,
                  primaryChildParent,
                  true,
                  newIsHidden
                );
              }

              var fallbackChildParent = primaryChildParent.sibling;

              if (fallbackChildParent !== null) {
                fallbackChildParent.return = node;
                node = fallbackChildParent;
                continue;
              }
            }
          }
        }

        if (node.child !== null) {
          // Continue traversing like normal
          node.child.return = node;
          node = node.child;
          continue;
        }
      } else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      } // $FlowFixMe This is correct but Flow is confused by the labeled break.

      node = node;

      if (node === workInProgress) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  }; // An unfortunate fork of appendAllChildren because we have two different parent types.

  var appendAllChildrenToContainer = function(
    containerChildSet,
    workInProgress,
    needsVisibilityToggle,
    isHidden
  ) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
    var node = workInProgress.child;

    while (node !== null) {
      // eslint-disable-next-line no-labels
      branches: if (node.tag === HostComponent) {
        var instance = node.stateNode;

        if (needsVisibilityToggle && isHidden) {
          // This child is inside a timed out tree. Hide it.
          var props = node.memoizedProps;
          var type = node.type;
          instance = cloneHiddenInstance(instance, type, props, node);
        }

        appendChildToContainerChildSet(containerChildSet, instance);
      } else if (node.tag === HostText) {
        var _instance3 = node.stateNode;

        if (needsVisibilityToggle && isHidden) {
          // This child is inside a timed out tree. Hide it.
          var text = node.memoizedProps;
          _instance3 = cloneHiddenTextInstance(_instance3, text, node);
        }

        appendChildToContainerChildSet(containerChildSet, _instance3);
      } else if (enableFundamentalAPI && node.tag === FundamentalComponent) {
        var _instance4 = node.stateNode.instance;

        if (needsVisibilityToggle && isHidden) {
          // This child is inside a timed out tree. Hide it.
          var _props2 = node.memoizedProps;
          var _type2 = node.type;
          _instance4 = cloneHiddenInstance(_instance4, _type2, _props2, node);
        }

        appendChildToContainerChildSet(containerChildSet, _instance4);
      } else if (node.tag === HostPortal) {
        // If we have a portal child, then we don't want to traverse
        // down its children. Instead, we'll get insertions from each child in
        // the portal directly.
      } else if (node.tag === SuspenseComponent) {
        if ((node.effectTag & Update) !== NoEffect) {
          // Need to toggle the visibility of the primary children.
          var newIsHidden = node.memoizedState !== null;

          if (newIsHidden) {
            var primaryChildParent = node.child;

            if (primaryChildParent !== null) {
              if (primaryChildParent.child !== null) {
                primaryChildParent.child.return = primaryChildParent;
                appendAllChildrenToContainer(
                  containerChildSet,
                  primaryChildParent,
                  true,
                  newIsHidden
                );
              }

              var fallbackChildParent = primaryChildParent.sibling;

              if (fallbackChildParent !== null) {
                fallbackChildParent.return = node;
                node = fallbackChildParent;
                continue;
              }
            }
          }
        }

        if (node.child !== null) {
          // Continue traversing like normal
          node.child.return = node;
          node = node.child;
          continue;
        }
      } else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      } // $FlowFixMe This is correct but Flow is confused by the labeled break.

      node = node;

      if (node === workInProgress) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === workInProgress) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  };

  updateHostContainer = function(workInProgress) {
    var portalOrRoot = workInProgress.stateNode;
    var childrenUnchanged = workInProgress.firstEffect === null;

    if (childrenUnchanged) {
      // No changes, just reuse the existing instance.
    } else {
      var container = portalOrRoot.containerInfo;
      var newChildSet = createContainerChildSet(container); // If children might have changed, we have to add them all to the set.

      appendAllChildrenToContainer(newChildSet, workInProgress, false, false);
      portalOrRoot.pendingChildren = newChildSet; // Schedule an update on the container to swap out the container.

      markUpdate(workInProgress);
      finalizeContainerChildren(container, newChildSet);
    }
  };

  updateHostComponent$1 = function(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance
  ) {
    var currentInstance = current.stateNode;
    var oldProps = current.memoizedProps; // If there are no effects associated with this node, then none of our children had any updates.
    // This guarantees that we can reuse all of them.

    var childrenUnchanged = workInProgress.firstEffect === null;

    if (childrenUnchanged && oldProps === newProps) {
      // No changes, just reuse the existing instance.
      // Note that this might release a previous clone.
      workInProgress.stateNode = currentInstance;
      return;
    }

    var recyclableInstance = workInProgress.stateNode;
    var currentHostContext = getHostContext();
    var updatePayload = null;

    if (oldProps !== newProps) {
      updatePayload = prepareUpdate(
        recyclableInstance,
        type,
        oldProps,
        newProps,
        rootContainerInstance,
        currentHostContext
      );
    }

    if (childrenUnchanged && updatePayload === null) {
      // No changes, just reuse the existing instance.
      // Note that this might release a previous clone.
      workInProgress.stateNode = currentInstance;
      return;
    }

    var newInstance = cloneInstance(
      currentInstance,
      updatePayload,
      type,
      oldProps,
      newProps,
      workInProgress,
      childrenUnchanged,
      recyclableInstance
    );

    if (
      finalizeInitialChildren(
        newInstance,
        type,
        newProps,
        rootContainerInstance,
        currentHostContext
      )
    ) {
      markUpdate(workInProgress);
    }

    workInProgress.stateNode = newInstance;

    if (childrenUnchanged) {
      // If there are no other effects in this tree, we need to flag this node as having one.
      // Even though we're not going to use it for anything.
      // Otherwise parents won't know that there are new children to propagate upwards.
      markUpdate(workInProgress);
    } else {
      // If children might have changed, we have to add them all to the set.
      appendAllChildren(newInstance, workInProgress, false, false);
    }
  };

  updateHostText$1 = function(current, workInProgress, oldText, newText) {
    if (oldText !== newText) {
      // If the text content differs, we'll create a new text instance for it.
      var rootContainerInstance = getRootHostContainer();
      var currentHostContext = getHostContext();
      workInProgress.stateNode = createTextInstance(
        newText,
        rootContainerInstance,
        currentHostContext,
        workInProgress
      ); // We'll have to mark it as having an effect, even though we won't use the effect for anything.
      // This lets the parents know that at least one of their children has changed.

      markUpdate(workInProgress);
    }
  };
} else {
  // No host operations
  updateHostContainer = function(workInProgress) {
    // Noop
  };

  updateHostComponent$1 = function(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance
  ) {
    // Noop
  };

  updateHostText$1 = function(current, workInProgress, oldText, newText) {
    // Noop
  };
}

function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
  switch (renderState.tailMode) {
    case "hidden": {
      // Any insertions at the end of the tail list after this point
      // should be invisible. If there are already mounted boundaries
      // anything before them are not considered for collapsing.
      // Therefore we need to go through the whole tail to find if
      // there are any.
      var tailNode = renderState.tail;
      var lastTailNode = null;

      while (tailNode !== null) {
        if (tailNode.alternate !== null) {
          lastTailNode = tailNode;
        }

        tailNode = tailNode.sibling;
      } // Next we're simply going to delete all insertions after the
      // last rendered item.

      if (lastTailNode === null) {
        // All remaining items in the tail are insertions.
        renderState.tail = null;
      } else {
        // Detach the insertion after the last node that was already
        // inserted.
        lastTailNode.sibling = null;
      }

      break;
    }

    case "collapsed": {
      // Any insertions at the end of the tail list after this point
      // should be invisible. If there are already mounted boundaries
      // anything before them are not considered for collapsing.
      // Therefore we need to go through the whole tail to find if
      // there are any.
      var _tailNode = renderState.tail;
      var _lastTailNode = null;

      while (_tailNode !== null) {
        if (_tailNode.alternate !== null) {
          _lastTailNode = _tailNode;
        }

        _tailNode = _tailNode.sibling;
      } // Next we're simply going to delete all insertions after the
      // last rendered item.

      if (_lastTailNode === null) {
        // All remaining items in the tail are insertions.
        if (!hasRenderedATailFallback && renderState.tail !== null) {
          // We suspended during the head. We want to show at least one
          // row at the tail. So we'll keep on and cut off the rest.
          renderState.tail.sibling = null;
        } else {
          renderState.tail = null;
        }
      } else {
        // Detach the insertion after the last node that was already
        // inserted.
        _lastTailNode.sibling = null;
      }

      break;
    }
  }
}

function completeWork(current, workInProgress, renderExpirationTime) {
  var newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      break;

    case LazyComponent:
      break;

    case SimpleMemoComponent:
    case FunctionComponent:
      break;

    case ClassComponent: {
      var Component = workInProgress.type;

      if (isContextProvider(Component)) {
        popContext(workInProgress);
      }

      break;
    }

    case HostRoot: {
      popHostContainer(workInProgress);
      popTopLevelContextObject(workInProgress);
      var fiberRoot = workInProgress.stateNode;

      if (fiberRoot.pendingContext) {
        fiberRoot.context = fiberRoot.pendingContext;
        fiberRoot.pendingContext = null;
      }

      if (current === null || current.child === null) {
        // If we hydrated, pop so that we can delete any remaining children
        // that weren't hydrated.
        popHydrationState(workInProgress); // This resets the hacky state to fix isMounted before committing.
        // TODO: Delete this when we delete isMounted and findDOMNode.

        workInProgress.effectTag &= ~Placement;
      }

      updateHostContainer(workInProgress);
      break;
    }

    case HostComponent: {
      popHostContext(workInProgress);
      var rootContainerInstance = getRootHostContainer();
      var type = workInProgress.type;

      if (current !== null && workInProgress.stateNode != null) {
        updateHostComponent$1(
          current,
          workInProgress,
          type,
          newProps,
          rootContainerInstance
        );

        if (enableFlareAPI) {
          var prevListeners = current.memoizedProps.listeners;
          var nextListeners = newProps.listeners;
          var instance = workInProgress.stateNode;

          if (prevListeners !== nextListeners) {
            updateEventListeners(
              nextListeners,
              instance,
              rootContainerInstance,
              workInProgress
            );
          }
        }

        if (current.ref !== workInProgress.ref) {
          markRef$1(workInProgress);
        }
      } else {
        if (!newProps) {
          (function() {
            if (!(workInProgress.stateNode !== null)) {
              throw ReactError(
                Error(
                  "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
                )
              );
            }
          })(); // This can happen when we abort work.

          break;
        }

        var currentHostContext = getHostContext(); // TODO: Move createInstance to beginWork and keep it on a context
        // "stack" as the parent. Then append children as we go in beginWork
        // or completeWork depending on we want to add then top->down or
        // bottom->up. Top->down is faster in IE11.

        var wasHydrated = popHydrationState(workInProgress);

        if (wasHydrated) {
          // TODO: Move this and createInstance step into the beginPhase
          // to consolidate.
          if (
            prepareToHydrateHostInstance(
              workInProgress,
              rootContainerInstance,
              currentHostContext
            )
          ) {
            // If changes to the hydrated node needs to be applied at the
            // commit-phase we mark this as such.
            markUpdate(workInProgress);
          }

          if (enableFlareAPI) {
            var _instance5 = workInProgress.stateNode;
            var listeners = newProps.listeners;

            if (listeners != null) {
              updateEventListeners(
                listeners,
                _instance5,
                rootContainerInstance,
                workInProgress
              );
            }
          }
        } else {
          var _instance6 = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress
          );

          appendAllChildren(_instance6, workInProgress, false, false);

          if (enableFlareAPI) {
            var _listeners = newProps.listeners;

            if (_listeners != null) {
              updateEventListeners(
                _listeners,
                _instance6,
                rootContainerInstance,
                workInProgress
              );
            }
          } // Certain renderers require commit-time effects for initial mount.
          // (eg DOM renderer supports auto-focus for certain elements).
          // Make sure such renderers get scheduled for later work.

          if (
            finalizeInitialChildren(
              _instance6,
              type,
              newProps,
              rootContainerInstance,
              currentHostContext
            )
          ) {
            markUpdate(workInProgress);
          }

          workInProgress.stateNode = _instance6;
        }

        if (workInProgress.ref !== null) {
          // If there is a ref on a host node we need to schedule a callback
          markRef$1(workInProgress);
        }
      }

      break;
    }

    case HostText: {
      var newText = newProps;

      if (current && workInProgress.stateNode != null) {
        var oldText = current.memoizedProps; // If we have an alternate, that means this is an update and we need
        // to schedule a side-effect to do the updates.

        updateHostText$1(current, workInProgress, oldText, newText);
      } else {
        if (typeof newText !== "string") {
          (function() {
            if (!(workInProgress.stateNode !== null)) {
              throw ReactError(
                Error(
                  "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
                )
              );
            }
          })(); // This can happen when we abort work.
        }

        var _rootContainerInstance = getRootHostContainer();

        var _currentHostContext = getHostContext();

        var _wasHydrated = popHydrationState(workInProgress);

        if (_wasHydrated) {
          if (prepareToHydrateHostTextInstance(workInProgress)) {
            markUpdate(workInProgress);
          }
        } else {
          workInProgress.stateNode = createTextInstance(
            newText,
            _rootContainerInstance,
            _currentHostContext,
            workInProgress
          );
        }
      }

      break;
    }

    case ForwardRef:
      break;

    case SuspenseComponent: {
      popSuspenseContext(workInProgress);
      var nextState = workInProgress.memoizedState;

      if (enableSuspenseServerRenderer) {
        if (nextState !== null && nextState.dehydrated !== null) {
          if (current === null) {
            var _wasHydrated2 = popHydrationState(workInProgress);

            (function() {
              if (!_wasHydrated2) {
                throw ReactError(
                  Error(
                    "A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React."
                  )
                );
              }
            })();

            if (enableSchedulerTracing) {
              markSpawnedWork(Never);
            }

            return null;
          } else {
            // We should never have been in a hydration state if we didn't have a current.
            // However, in some of those paths, we might have reentered a hydration state
            // and then we might be inside a hydration state. In that case, we'll need to
            // exit out of it.
            resetHydrationState();

            if ((workInProgress.effectTag & DidCapture) === NoEffect) {
              // This boundary did not suspend so it's now hydrated and unsuspended.
              workInProgress.memoizedState = null;

              if (enableSuspenseCallback) {
                // Notify the callback.
                workInProgress.effectTag |= Update;
              }
            } else {
              // Something suspended. Schedule an effect to attach retry listeners.
              workInProgress.effectTag |= Update;
            }

            return null;
          }
        }
      }

      if ((workInProgress.effectTag & DidCapture) !== NoEffect) {
        // Something suspended. Re-render with the fallback children.
        workInProgress.expirationTime = renderExpirationTime; // Do not reset the effect list.

        return workInProgress;
      }

      var nextDidTimeout = nextState !== null;
      var prevDidTimeout = false;

      if (current === null) {
        // In cases where we didn't find a suitable hydration boundary we never
        // put this in dehydrated mode, but we still need to pop the hydration
        // state since we might be inside the insertion tree.
        popHydrationState(workInProgress);
      } else {
        var prevState = current.memoizedState;
        prevDidTimeout = prevState !== null;

        if (!nextDidTimeout && prevState !== null) {
          // We just switched from the fallback to the normal children.
          // Delete the fallback.
          // TODO: Would it be better to store the fallback fragment on
          // the stateNode during the begin phase?
          var currentFallbackChild = current.child.sibling;

          if (currentFallbackChild !== null) {
            // Deletions go at the beginning of the return fiber's effect list
            var first = workInProgress.firstEffect;

            if (first !== null) {
              workInProgress.firstEffect = currentFallbackChild;
              currentFallbackChild.nextEffect = first;
            } else {
              workInProgress.firstEffect = workInProgress.lastEffect = currentFallbackChild;
              currentFallbackChild.nextEffect = null;
            }

            currentFallbackChild.effectTag = Deletion;
          }
        }
      }

      if (nextDidTimeout && !prevDidTimeout) {
        // If this subtreee is running in batched mode we can suspend,
        // otherwise we won't suspend.
        // TODO: This will still suspend a synchronous tree if anything
        // in the concurrent tree already suspended during this render.
        // This is a known bug.
        if ((workInProgress.mode & BatchedMode) !== NoMode) {
          // TODO: Move this back to throwException because this is too late
          // if this is a large tree which is common for initial loads. We
          // don't know if we should restart a render or not until we get
          // this marker, and this is too late.
          // If this render already had a ping or lower pri updates,
          // and this is the first time we know we're going to suspend we
          // should be able to immediately restart from within throwException.
          var hasInvisibleChildContext =
            current === null &&
            workInProgress.memoizedProps.unstable_avoidThisFallback !== true;

          if (
            hasInvisibleChildContext ||
            hasSuspenseContext(
              suspenseStackCursor.current,
              InvisibleParentSuspenseContext
            )
          ) {
            // If this was in an invisible tree or a new render, then showing
            // this boundary is ok.
            renderDidSuspend();
          } else {
            // Otherwise, we're going to have to hide content so we should
            // suspend for longer if possible.
            renderDidSuspendDelayIfPossible();
          }
        }
      }

      if (supportsPersistence) {
        // TODO: Only schedule updates if not prevDidTimeout.
        if (nextDidTimeout) {
          // If this boundary just timed out, schedule an effect to attach a
          // retry listener to the proimse. This flag is also used to hide the
          // primary children.
          workInProgress.effectTag |= Update;
        }
      }

      if (supportsMutation) {
        // TODO: Only schedule updates if these values are non equal, i.e. it changed.
        if (nextDidTimeout || prevDidTimeout) {
          // If this boundary just timed out, schedule an effect to attach a
          // retry listener to the proimse. This flag is also used to hide the
          // primary children. In mutation mode, we also need the flag to
          // *unhide* children that were previously hidden, so check if the
          // is currently timed out, too.
          workInProgress.effectTag |= Update;
        }
      }

      if (
        enableSuspenseCallback &&
        workInProgress.updateQueue !== null &&
        workInProgress.memoizedProps.suspenseCallback != null
      ) {
        // Always notify the callback
        workInProgress.effectTag |= Update;
      }

      break;
    }

    case Fragment:
      break;

    case Mode:
      break;

    case Profiler:
      break;

    case HostPortal:
      popHostContainer(workInProgress);
      updateHostContainer(workInProgress);
      break;

    case ContextProvider:
      // Pop provider fiber
      popProvider(workInProgress);
      break;

    case ContextConsumer:
      break;

    case MemoComponent:
      break;

    case IncompleteClassComponent: {
      // Same as class component case. I put it down here so that the tags are
      // sequential to ensure this switch is compiled to a jump table.
      var _Component = workInProgress.type;

      if (isContextProvider(_Component)) {
        popContext(workInProgress);
      }

      break;
    }

    case SuspenseListComponent: {
      popSuspenseContext(workInProgress);
      var renderState = workInProgress.memoizedState;

      if (renderState === null) {
        // We're running in the default, "independent" mode. We don't do anything
        // in this mode.
        break;
      }

      var didSuspendAlready =
        (workInProgress.effectTag & DidCapture) !== NoEffect;
      var renderedTail = renderState.rendering;

      if (renderedTail === null) {
        // We just rendered the head.
        if (!didSuspendAlready) {
          // This is the first pass. We need to figure out if anything is still
          // suspended in the rendered set.
          // If new content unsuspended, but there's still some content that
          // didn't. Then we need to do a second pass that forces everything
          // to keep showing their fallbacks.
          // We might be suspended if something in this render pass suspended, or
          // something in the previous committed pass suspended. Otherwise,
          // there's no chance so we can skip the expensive call to
          // findFirstSuspended.
          var cannotBeSuspended =
            renderHasNotSuspendedYet() &&
            (current === null || (current.effectTag & DidCapture) === NoEffect);

          if (!cannotBeSuspended) {
            var row = workInProgress.child;

            while (row !== null) {
              var suspended = findFirstSuspended(row);

              if (suspended !== null) {
                didSuspendAlready = true;
                workInProgress.effectTag |= DidCapture;
                cutOffTailIfNeeded(renderState, false); // If this is a newly suspended tree, it might not get committed as
                // part of the second pass. In that case nothing will subscribe to
                // its thennables. Instead, we'll transfer its thennables to the
                // SuspenseList so that it can retry if they resolve.
                // There might be multiple of these in the list but since we're
                // going to wait for all of them anyway, it doesn't really matter
                // which ones gets to ping. In theory we could get clever and keep
                // track of how many dependencies remain but it gets tricky because
                // in the meantime, we can add/remove/change items and dependencies.
                // We might bail out of the loop before finding any but that
                // doesn't matter since that means that the other boundaries that
                // we did find already has their listeners attached.

                var newThennables = suspended.updateQueue;

                if (newThennables !== null) {
                  workInProgress.updateQueue = newThennables;
                  workInProgress.effectTag |= Update;
                } // Rerender the whole list, but this time, we'll force fallbacks
                // to stay in place.
                // Reset the effect list before doing the second pass since that's now invalid.

                workInProgress.firstEffect = workInProgress.lastEffect = null; // Reset the child fibers to their original state.

                resetChildFibers(workInProgress, renderExpirationTime); // Set up the Suspense Context to force suspense and immediately
                // rerender the children.

                pushSuspenseContext(
                  workInProgress,
                  setShallowSuspenseContext(
                    suspenseStackCursor.current,
                    ForceSuspenseFallback
                  )
                );
                return workInProgress.child;
              }

              row = row.sibling;
            }
          }
        } else {
          cutOffTailIfNeeded(renderState, false);
        } // Next we're going to render the tail.
      } else {
        // Append the rendered row to the child list.
        if (!didSuspendAlready) {
          var _suspended = findFirstSuspended(renderedTail);

          if (_suspended !== null) {
            workInProgress.effectTag |= DidCapture;
            didSuspendAlready = true;
            cutOffTailIfNeeded(renderState, true); // This might have been modified.

            if (
              renderState.tail === null &&
              renderState.tailMode === "hidden"
            ) {
              // We need to delete the row we just rendered.
              // Ensure we transfer the update queue to the parent.
              var _newThennables = _suspended.updateQueue;

              if (_newThennables !== null) {
                workInProgress.updateQueue = _newThennables;
                workInProgress.effectTag |= Update;
              } // Reset the effect list to what it w as before we rendered this
              // child. The nested children have already appended themselves.

              var lastEffect = (workInProgress.lastEffect =
                renderState.lastEffect); // Remove any effects that were appended after this point.

              if (lastEffect !== null) {
                lastEffect.nextEffect = null;
              } // We're done.

              return null;
            }
          } else if (
            now() > renderState.tailExpiration &&
            renderExpirationTime > Never
          ) {
            // We have now passed our CPU deadline and we'll just give up further
            // attempts to render the main content and only render fallbacks.
            // The assumption is that this is usually faster.
            workInProgress.effectTag |= DidCapture;
            didSuspendAlready = true;
            cutOffTailIfNeeded(renderState, false); // Since nothing actually suspended, there will nothing to ping this
            // to get it started back up to attempt the next item. If we can show
            // them, then they really have the same priority as this render.
            // So we'll pick it back up the very next render pass once we've had
            // an opportunity to yield for paint.

            var nextPriority = renderExpirationTime - 1;
            workInProgress.expirationTime = workInProgress.childExpirationTime = nextPriority;

            if (enableSchedulerTracing) {
              markSpawnedWork(nextPriority);
            }
          }
        }

        if (renderState.isBackwards) {
          // The effect list of the backwards tail will have been added
          // to the end. This breaks the guarantee that life-cycles fire in
          // sibling order but that isn't a strong guarantee promised by React.
          // Especially since these might also just pop in during future commits.
          // Append to the beginning of the list.
          renderedTail.sibling = workInProgress.child;
          workInProgress.child = renderedTail;
        } else {
          var previousSibling = renderState.last;

          if (previousSibling !== null) {
            previousSibling.sibling = renderedTail;
          } else {
            workInProgress.child = renderedTail;
          }

          renderState.last = renderedTail;
        }
      }

      if (renderState.tail !== null) {
        // We still have tail rows to render.
        if (renderState.tailExpiration === 0) {
          // Heuristic for how long we're willing to spend rendering rows
          // until we just give up and show what we have so far.
          var TAIL_EXPIRATION_TIMEOUT_MS = 500;
          renderState.tailExpiration = now() + TAIL_EXPIRATION_TIMEOUT_MS;
        } // Pop a row.

        var next = renderState.tail;
        renderState.rendering = next;
        renderState.tail = next.sibling;
        renderState.lastEffect = workInProgress.lastEffect;
        next.sibling = null; // Restore the context.
        // TODO: We can probably just avoid popping it instead and only
        // setting it the first time we go from not suspended to suspended.

        var suspenseContext = suspenseStackCursor.current;

        if (didSuspendAlready) {
          suspenseContext = setShallowSuspenseContext(
            suspenseContext,
            ForceSuspenseFallback
          );
        } else {
          suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
        }

        pushSuspenseContext(workInProgress, suspenseContext); // Do a pass over the next row.

        return next;
      }

      break;
    }

    case FundamentalComponent: {
      if (enableFundamentalAPI) {
        var fundamentalImpl = workInProgress.type.impl;
        var fundamentalInstance = workInProgress.stateNode;

        if (fundamentalInstance === null) {
          var getInitialState = fundamentalImpl.getInitialState;
          var fundamentalState;

          if (getInitialState !== undefined) {
            fundamentalState = getInitialState(newProps);
          }

          fundamentalInstance = workInProgress.stateNode = createFundamentalStateInstance(
            workInProgress,
            newProps,
            fundamentalImpl,
            fundamentalState || {}
          );

          var _instance7 = getFundamentalComponentInstance(fundamentalInstance);

          fundamentalInstance.instance = _instance7;

          if (fundamentalImpl.reconcileChildren === false) {
            return null;
          }

          appendAllChildren(_instance7, workInProgress, false, false);
          mountFundamentalComponent(fundamentalInstance);
        } else {
          // We fire update in commit phase
          var prevProps = fundamentalInstance.props;
          fundamentalInstance.prevProps = prevProps;
          fundamentalInstance.props = newProps;
          fundamentalInstance.currentFiber = workInProgress;

          if (supportsPersistence) {
            var _instance8 = cloneFundamentalInstance(fundamentalInstance);

            fundamentalInstance.instance = _instance8;
            appendAllChildren(_instance8, workInProgress, false, false);
          }

          var shouldUpdate = shouldUpdateFundamentalComponent(
            fundamentalInstance
          );

          if (shouldUpdate) {
            markUpdate(workInProgress);
          }
        }
      }

      break;
    }

    default:
      (function() {
        {
          throw ReactError(
            Error(
              "Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();
  }

  return null;
}

function mountEventResponder(
  responder,
  responderProps,
  instance,
  rootContainerInstance,
  fiber,
  respondersMap
) {
  var responderState = emptyObject$1;
  var getInitialState = responder.getInitialState;

  if (getInitialState !== null) {
    responderState = getInitialState(responderProps);
  }

  var responderInstance = createResponderInstance(
    responder,
    responderProps,
    responderState,
    instance,
    fiber
  );
  mountResponderInstance(
    responder,
    responderInstance,
    responderProps,
    responderState,
    instance,
    rootContainerInstance
  );
  respondersMap.set(responder, responderInstance);
}

function updateEventListener(
  listener,
  fiber,
  visistedResponders,
  respondersMap,
  instance,
  rootContainerInstance
) {
  var responder;
  var props;

  if (listener) {
    responder = listener.responder;
    props = listener.props;
  }

  (function() {
    if (!(responder && responder.$$typeof === REACT_RESPONDER_TYPE)) {
      throw ReactError(
        Error(
          "An invalid value was used as an event listener. Expect one or many event listeners created via React.unstable_useResponder()."
        )
      );
    }
  })();

  var listenerProps = props;

  if (visistedResponders.has(responder)) {
    // show warning
    return;
  }

  visistedResponders.add(responder);
  var responderInstance = respondersMap.get(responder);

  if (responderInstance === undefined) {
    // Mount
    mountEventResponder(
      responder,
      listenerProps,
      instance,
      rootContainerInstance,
      fiber,
      respondersMap
    );
  } else {
    // Update
    responderInstance.props = listenerProps;
    responderInstance.fiber = fiber;
  }
}

function updateEventListeners(
  listeners,
  instance,
  rootContainerInstance,
  fiber
) {
  var visistedResponders = new Set();
  var dependencies = fiber.dependencies;

  if (listeners != null) {
    if (dependencies === null) {
      dependencies = fiber.dependencies = {
        expirationTime: NoWork,
        firstContext: null,
        responders: new Map()
      };
    }

    var respondersMap = dependencies.responders;

    if (respondersMap === null) {
      respondersMap = new Map();
    }

    if (isArray$2(listeners)) {
      for (var i = 0, length = listeners.length; i < length; i++) {
        var listener = listeners[i];
        updateEventListener(
          listener,
          fiber,
          visistedResponders,
          respondersMap,
          instance,
          rootContainerInstance
        );
      }
    } else {
      updateEventListener(
        listeners,
        fiber,
        visistedResponders,
        respondersMap,
        instance,
        rootContainerInstance
      );
    }
  }

  if (dependencies !== null) {
    var _respondersMap = dependencies.responders;

    if (_respondersMap !== null) {
      // Unmount
      var mountedResponders = Array.from(_respondersMap.keys());

      for (var _i = 0, _length = mountedResponders.length; _i < _length; _i++) {
        var mountedResponder = mountedResponders[_i];

        if (!visistedResponders.has(mountedResponder)) {
          var responderInstance = _respondersMap.get(mountedResponder);

          unmountResponderInstance(responderInstance);

          _respondersMap.delete(mountedResponder);
        }
      }
    }
  }
}

function unwindWork(workInProgress, renderExpirationTime) {
  switch (workInProgress.tag) {
    case ClassComponent: {
      var Component = workInProgress.type;

      if (isContextProvider(Component)) {
        popContext(workInProgress);
      }

      var effectTag = workInProgress.effectTag;

      if (effectTag & ShouldCapture) {
        workInProgress.effectTag = (effectTag & ~ShouldCapture) | DidCapture;
        return workInProgress;
      }

      return null;
    }

    case HostRoot: {
      popHostContainer(workInProgress);
      popTopLevelContextObject(workInProgress);
      var _effectTag = workInProgress.effectTag;

      (function() {
        if (!((_effectTag & DidCapture) === NoEffect)) {
          throw ReactError(
            Error(
              "The root failed to unmount after an error. This is likely a bug in React. Please file an issue."
            )
          );
        }
      })();

      workInProgress.effectTag = (_effectTag & ~ShouldCapture) | DidCapture;
      return workInProgress;
    }

    case HostComponent: {
      // TODO: popHydrationState
      popHostContext(workInProgress);
      return null;
    }

    case SuspenseComponent: {
      popSuspenseContext(workInProgress);

      if (enableSuspenseServerRenderer) {
        var suspenseState = workInProgress.memoizedState;

        if (suspenseState !== null && suspenseState.dehydrated !== null) {
          (function() {
            if (!(workInProgress.alternate !== null)) {
              throw ReactError(
                Error(
                  "Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue."
                )
              );
            }
          })();

          resetHydrationState();
        }
      }

      var _effectTag2 = workInProgress.effectTag;

      if (_effectTag2 & ShouldCapture) {
        workInProgress.effectTag = (_effectTag2 & ~ShouldCapture) | DidCapture; // Captured a suspense effect. Re-render the boundary.

        return workInProgress;
      }

      return null;
    }

    case SuspenseListComponent: {
      popSuspenseContext(workInProgress); // SuspenseList doesn't actually catch anything. It should've been
      // caught by a nested boundary. If not, it should bubble through.

      return null;
    }

    case HostPortal:
      popHostContainer(workInProgress);
      return null;

    case ContextProvider:
      popProvider(workInProgress);
      return null;

    default:
      return null;
  }
}

function unwindInterruptedWork(interruptedWork) {
  switch (interruptedWork.tag) {
    case ClassComponent: {
      var childContextTypes = interruptedWork.type.childContextTypes;

      if (childContextTypes !== null && childContextTypes !== undefined) {
        popContext(interruptedWork);
      }

      break;
    }

    case HostRoot: {
      popHostContainer(interruptedWork);
      popTopLevelContextObject(interruptedWork);
      break;
    }

    case HostComponent: {
      popHostContext(interruptedWork);
      break;
    }

    case HostPortal:
      popHostContainer(interruptedWork);
      break;

    case SuspenseComponent:
      popSuspenseContext(interruptedWork);
      break;

    case SuspenseListComponent:
      popSuspenseContext(interruptedWork);
      break;

    case ContextProvider:
      popProvider(interruptedWork);
      break;

    default:
      break;
  }
}

function createCapturedValue(value, source) {
  // If the value is an error, call this function immediately after it is thrown
  // so the stack is accurate.
  return {
    value: value,
    source: source,
    stack: getStackByFiberInDevAndProd(source)
  };
}

// Module provided by RN:
(function() {
  if (
    !(
      typeof ReactNativePrivateInterface.ReactFiberErrorDialog
        .showErrorDialog === "function"
    )
  ) {
    throw ReactError(
      Error("Expected ReactFiberErrorDialog.showErrorDialog to be a function.")
    );
  }
})();

function showErrorDialog(capturedError) {
  return ReactNativePrivateInterface.ReactFiberErrorDialog.showErrorDialog(
    capturedError
  );
}

function logCapturedError(capturedError) {
  var logError = showErrorDialog(capturedError); // Allow injected showErrorDialog() to prevent default console.error logging.
  // This enables renderers like ReactNative to better manage redbox behavior.

  if (logError === false) {
    return;
  }

  var error = capturedError.error;

  {
    // In production, we print the error directly.
    // This will include the message, the JS stack, and anything the browser wants to show.
    // We pass the error object instead of custom message so that the browser displays the error natively.
    console.error(error);
  }
}

var PossiblyWeakSet = typeof WeakSet === "function" ? WeakSet : Set;
function logError(boundary, errorInfo) {
  var source = errorInfo.source;
  var stack = errorInfo.stack;

  if (stack === null && source !== null) {
    stack = getStackByFiberInDevAndProd(source);
  }

  var capturedError = {
    componentName: source !== null ? getComponentName(source.type) : null,
    componentStack: stack !== null ? stack : "",
    error: errorInfo.value,
    errorBoundary: null,
    errorBoundaryName: null,
    errorBoundaryFound: false,
    willRetry: false
  };

  if (boundary !== null && boundary.tag === ClassComponent) {
    capturedError.errorBoundary = boundary.stateNode;
    capturedError.errorBoundaryName = getComponentName(boundary.type);
    capturedError.errorBoundaryFound = true;
    capturedError.willRetry = true;
  }

  try {
    logCapturedError(capturedError);
  } catch (e) {
    // This method must not throw, or React internal state will get messed up.
    // If console.error is overridden, or logCapturedError() shows a dialog that throws,
    // we want to report this error outside of the normal stack as a last resort.
    // https://github.com/facebook/react/issues/13188
    setTimeout(function() {
      throw e;
    });
  }
}

var callComponentWillUnmountWithTimer = function(current$$1, instance) {
  startPhaseTimer(current$$1, "componentWillUnmount");
  instance.props = current$$1.memoizedProps;
  instance.state = current$$1.memoizedState;
  instance.componentWillUnmount();
  stopPhaseTimer();
}; // Capture errors so they don't interrupt unmounting.

function safelyCallComponentWillUnmount(current$$1, instance) {
  {
    try {
      callComponentWillUnmountWithTimer(current$$1, instance);
    } catch (unmountError) {
      captureCommitPhaseError(current$$1, unmountError);
    }
  }
}

function safelyDetachRef(current$$1) {
  var ref = current$$1.ref;

  if (ref !== null) {
    if (typeof ref === "function") {
      {
        try {
          ref(null);
        } catch (refError) {
          captureCommitPhaseError(current$$1, refError);
        }
      }
    } else {
      ref.current = null;
    }
  }
}

function safelyCallDestroy(current$$1, destroy) {
  {
    try {
      destroy();
    } catch (error) {
      captureCommitPhaseError(current$$1, error);
    }
  }
}

function commitBeforeMutationLifeCycles(current$$1, finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      commitHookEffectList(UnmountSnapshot, NoEffect$1, finishedWork);
      return;
    }

    case ClassComponent: {
      if (finishedWork.effectTag & Snapshot) {
        if (current$$1 !== null) {
          var prevProps = current$$1.memoizedProps;
          var prevState = current$$1.memoizedState;
          startPhaseTimer(finishedWork, "getSnapshotBeforeUpdate");
          var instance = finishedWork.stateNode; // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.

          var snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState
          );

          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
          stopPhaseTimer();
        }
      }

      return;
    }

    case HostRoot:
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;

    default: {
      (function() {
        {
          throw ReactError(
            Error(
              "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();
    }
  }
}

function commitHookEffectList(unmountTag, mountTag, finishedWork) {
  var updateQueue = finishedWork.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var effect = firstEffect;

    do {
      if ((effect.tag & unmountTag) !== NoEffect$1) {
        // Unmount
        var destroy = effect.destroy;
        effect.destroy = undefined;

        if (destroy !== undefined) {
          destroy();
        }
      }

      if ((effect.tag & mountTag) !== NoEffect$1) {
        // Mount
        var create = effect.create;
        effect.destroy = create();
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

function commitPassiveHookEffects(finishedWork) {
  if ((finishedWork.effectTag & Passive) !== NoEffect) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        commitHookEffectList(UnmountPassive, NoEffect$1, finishedWork);
        commitHookEffectList(NoEffect$1, MountPassive, finishedWork);
        break;
      }

      default:
        break;
    }
  }
}

function commitLifeCycles(
  finishedRoot,
  current$$1,
  finishedWork,
  committedExpirationTime
) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent: {
      commitHookEffectList(UnmountLayout, MountLayout, finishedWork);
      break;
    }

    case ClassComponent: {
      var instance = finishedWork.stateNode;

      if (finishedWork.effectTag & Update) {
        if (current$$1 === null) {
          startPhaseTimer(finishedWork, "componentDidMount"); // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.

          instance.componentDidMount();
          stopPhaseTimer();
        } else {
          var prevProps =
            finishedWork.elementType === finishedWork.type
              ? current$$1.memoizedProps
              : resolveDefaultProps(
                  finishedWork.type,
                  current$$1.memoizedProps
                );
          var prevState = current$$1.memoizedState;
          startPhaseTimer(finishedWork, "componentDidUpdate"); // We could update instance props and state here,
          // but instead we rely on them being set during last render.
          // TODO: revisit this when we implement resuming.

          instance.componentDidUpdate(
            prevProps,
            prevState,
            instance.__reactInternalSnapshotBeforeUpdate
          );
          stopPhaseTimer();
        }
      }

      var updateQueue = finishedWork.updateQueue;

      if (updateQueue !== null) {
        commitUpdateQueue(
          finishedWork,
          updateQueue,
          instance,
          committedExpirationTime
        );
      }

      return;
    }

    case HostRoot: {
      var _updateQueue = finishedWork.updateQueue;

      if (_updateQueue !== null) {
        var _instance = null;

        if (finishedWork.child !== null) {
          switch (finishedWork.child.tag) {
            case HostComponent:
              _instance = getPublicInstance(finishedWork.child.stateNode);
              break;

            case ClassComponent:
              _instance = finishedWork.child.stateNode;
              break;
          }
        }

        commitUpdateQueue(
          finishedWork,
          _updateQueue,
          _instance,
          committedExpirationTime
        );
      }

      return;
    }

    case HostComponent: {
      var _instance2 = finishedWork.stateNode; // Renderers may schedule work to be done after host components are mounted
      // (eg DOM renderer may schedule auto-focus for inputs and form controls).
      // These effects should only be committed when components are first mounted,
      // aka when there is no current/alternate.

      if (current$$1 === null && finishedWork.effectTag & Update) {
        var type = finishedWork.type;
        var props = finishedWork.memoizedProps;
      }

      return;
    }

    case HostText: {
      // We have no life-cycles associated with text.
      return;
    }

    case HostPortal: {
      // We have no life-cycles associated with portals.
      return;
    }

    case Profiler: {
      if (enableProfilerTimer) {
        var onRender = finishedWork.memoizedProps.onRender;

        if (typeof onRender === "function") {
          if (enableSchedulerTracing) {
            onRender(
              finishedWork.memoizedProps.id,
              current$$1 === null ? "mount" : "update",
              finishedWork.actualDuration,
              finishedWork.treeBaseDuration,
              finishedWork.actualStartTime,
              getCommitTime(),
              finishedRoot.memoizedInteractions
            );
          } else {
            onRender(
              finishedWork.memoizedProps.id,
              current$$1 === null ? "mount" : "update",
              finishedWork.actualDuration,
              finishedWork.treeBaseDuration,
              finishedWork.actualStartTime,
              getCommitTime()
            );
          }
        }
      }

      return;
    }

    case SuspenseComponent: {
      if (enableSuspenseCallback) {
        commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
      }

      return;
    }

    case SuspenseListComponent:
    case IncompleteClassComponent:
    case FundamentalComponent:
      return;

    default: {
      (function() {
        {
          throw ReactError(
            Error(
              "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();
    }
  }
}

function hideOrUnhideAllChildren(finishedWork, isHidden) {
  if (supportsMutation) {
    // We only have the top Fiber that was inserted but we need to recurse down its
    // children to find all the terminal nodes.
    var node = finishedWork;

    while (true) {
      if (node.tag === HostComponent) {
        var instance = node.stateNode;

        if (isHidden) {
          hideInstance(instance);
        } else {
          unhideInstance(node.stateNode, node.memoizedProps);
        }
      } else if (node.tag === HostText) {
        var _instance3 = node.stateNode;

        if (isHidden) {
          hideTextInstance(_instance3);
        } else {
          unhideTextInstance(_instance3, node.memoizedProps);
        }
      } else if (
        node.tag === SuspenseComponent &&
        node.memoizedState !== null &&
        node.memoizedState.dehydrated === null
      ) {
        // Found a nested Suspense component that timed out. Skip over the
        // primary child fragment, which should remain hidden.
        var fallbackChildFragment = node.child.sibling;
        fallbackChildFragment.return = node;
        node = fallbackChildFragment;
        continue;
      } else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }

      if (node === finishedWork) {
        return;
      }

      while (node.sibling === null) {
        if (node.return === null || node.return === finishedWork) {
          return;
        }

        node = node.return;
      }

      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
}

function commitAttachRef(finishedWork) {
  var ref = finishedWork.ref;

  if (ref !== null) {
    var instance = finishedWork.stateNode;
    var instanceToUse;

    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;

      default:
        instanceToUse = instance;
    }

    if (typeof ref === "function") {
      ref(instanceToUse);
    } else {
      ref.current = instanceToUse;
    }
  }
}

function commitDetachRef(current$$1) {
  var currentRef = current$$1.ref;

  if (currentRef !== null) {
    if (typeof currentRef === "function") {
      currentRef(null);
    } else {
      currentRef.current = null;
    }
  }
} // User-originating errors (lifecycles and refs) should not interrupt
// deletion, so don't let them throw. Host-originating errors should
// interrupt deletion, so it's okay

function commitUnmount(finishedRoot, current$$1, renderPriorityLevel) {
  onCommitUnmount(current$$1);

  switch (current$$1.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent: {
      var updateQueue = current$$1.updateQueue;

      if (updateQueue !== null) {
        var lastEffect = updateQueue.lastEffect;

        if (lastEffect !== null) {
          var firstEffect = lastEffect.next; // When the owner fiber is deleted, the destroy function of a passive
          // effect hook is called during the synchronous commit phase. This is
          // a concession to implementation complexity. Calling it in the
          // passive effect phase (like they usually are, when dependencies
          // change during an update) would require either traversing the
          // children of the deleted fiber again, or including unmount effects
          // as part of the fiber effect list.
          //
          // Because this is during the sync commit phase, we need to change
          // the priority.
          //
          // TODO: Reconsider this implementation trade off.

          var priorityLevel =
            renderPriorityLevel > NormalPriority
              ? NormalPriority
              : renderPriorityLevel;
          runWithPriority(priorityLevel, function() {
            var effect = firstEffect;

            do {
              var destroy = effect.destroy;

              if (destroy !== undefined) {
                safelyCallDestroy(current$$1, destroy);
              }

              effect = effect.next;
            } while (effect !== firstEffect);
          });
        }
      }

      break;
    }

    case ClassComponent: {
      safelyDetachRef(current$$1);
      var instance = current$$1.stateNode;

      if (typeof instance.componentWillUnmount === "function") {
        safelyCallComponentWillUnmount(current$$1, instance);
      }

      return;
    }

    case HostComponent: {
      if (enableFlareAPI) {
        var dependencies = current$$1.dependencies;

        if (dependencies !== null) {
          var respondersMap = dependencies.responders;

          if (respondersMap !== null) {
            var responderInstances = Array.from(respondersMap.values());

            for (
              var i = 0, length = responderInstances.length;
              i < length;
              i++
            ) {
              var responderInstance = responderInstances[i];
              unmountResponderInstance(responderInstance);
            }

            dependencies.responders = null;
          }
        }
      }

      safelyDetachRef(current$$1);
      return;
    }

    case HostPortal: {
      // TODO: this is recursive.
      // We are also not using this parent because
      // the portal will get pushed immediately.
      if (supportsMutation) {
        unmountHostComponents(finishedRoot, current$$1, renderPriorityLevel);
      } else if (supportsPersistence) {
        emptyPortalContainer(current$$1);
      }

      return;
    }

    case FundamentalComponent: {
      if (enableFundamentalAPI) {
        var fundamentalInstance = current$$1.stateNode;

        if (fundamentalInstance !== null) {
          unmountFundamentalComponent(fundamentalInstance);
          current$$1.stateNode = null;
        }
      }

      return;
    }

    case DehydratedFragment: {
      if (enableSuspenseCallback) {
        var hydrationCallbacks = finishedRoot.hydrationCallbacks;

        if (hydrationCallbacks !== null) {
          var onDeleted = hydrationCallbacks.onDeleted;

          if (onDeleted) {
            onDeleted(current$$1.stateNode);
          }
        }
      }
    }
  }
}

function commitNestedUnmounts(finishedRoot, root, renderPriorityLevel) {
  // While we're inside a removed host node we don't want to call
  // removeChild on the inner nodes because they're removed by the top
  // call anyway. We also want to call componentWillUnmount on all
  // composites before this host node is removed from the tree. Therefore
  // we do an inner loop while we're still inside the host node.
  var node = root;

  while (true) {
    commitUnmount(finishedRoot, node, renderPriorityLevel); // Visit children because they may contain more composite or host nodes.
    // Skip portals because commitUnmount() currently visits them recursively.

    if (
      node.child !== null && // If we use mutation we drill down into portals using commitUnmount above.
      // If we don't use mutation we drill down into portals here instead.
      (!supportsMutation || node.tag !== HostPortal)
    ) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === root) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function detachFiber(current$$1) {
  // Cut off the return pointers to disconnect it from the tree. Ideally, we
  // should clear the child pointer of the parent alternate to let this
  // get GC:ed but we don't know which for sure which parent is the current
  // one so we'll settle for GC:ing the subtree of this child. This child
  // itself will be GC:ed when the parent updates the next time.
  current$$1.return = null;
  current$$1.child = null;
  current$$1.memoizedState = null;
  current$$1.updateQueue = null;
  current$$1.dependencies = null;
  var alternate = current$$1.alternate;

  if (alternate !== null) {
    alternate.return = null;
    alternate.child = null;
    alternate.memoizedState = null;
    alternate.updateQueue = null;
    alternate.dependencies = null;
  }
}

function emptyPortalContainer(current$$1) {
  if (!supportsPersistence) {
    return;
  }

  var portal = current$$1.stateNode;
  var containerInfo = portal.containerInfo;
  var emptyChildSet = createContainerChildSet(containerInfo);
  replaceContainerChildren(containerInfo, emptyChildSet);
}

function commitContainer(finishedWork) {
  if (!supportsPersistence) {
    return;
  }

  switch (finishedWork.tag) {
    case ClassComponent:
    case HostComponent:
    case HostText:
    case FundamentalComponent: {
      return;
    }

    case HostRoot:
    case HostPortal: {
      var portalOrRoot = finishedWork.stateNode;
      var containerInfo = portalOrRoot.containerInfo,
        pendingChildren = portalOrRoot.pendingChildren;
      replaceContainerChildren(containerInfo, pendingChildren);
      return;
    }

    default: {
      (function() {
        {
          throw ReactError(
            Error(
              "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();
    }
  }
}

function getHostParentFiber(fiber) {
  var parent = fiber.return;

  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }

    parent = parent.return;
  }

  (function() {
    {
      throw ReactError(
        Error(
          "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })();
}

function isHostParent(fiber) {
  return (
    fiber.tag === HostComponent ||
    fiber.tag === HostRoot ||
    fiber.tag === HostPortal
  );
}

function getHostSibling(fiber) {
  // We're going to search forward into the tree until we find a sibling host
  // node. Unfortunately, if multiple insertions are done in a row we have to
  // search past them. This leads to exponential search for the next sibling.
  // TODO: Find a more efficient way to do this.
  var node = fiber;

  siblings: while (true) {
    // If we didn't find anything, let's try the next sibling.
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        // If we pop out of the root or hit the parent the fiber we are the
        // last sibling.
        return null;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;

    while (
      node.tag !== HostComponent &&
      node.tag !== HostText &&
      node.tag !== DehydratedFragment
    ) {
      // If it is not host node and, we might have a host node inside it.
      // Try to search down until we find one.
      if (node.effectTag & Placement) {
        // If we don't have a child, try the siblings instead.
        continue siblings;
      } // If we don't have a child, try the siblings instead.
      // We also skip portals because they are not part of this host tree.

      if (node.child === null || node.tag === HostPortal) {
        continue siblings;
      } else {
        node.child.return = node;
        node = node.child;
      }
    } // Check if this host node is stable or about to be placed.

    if (!(node.effectTag & Placement)) {
      // Found it!
      return node.stateNode;
    }
  }
}

function commitPlacement(finishedWork) {
  if (!supportsMutation) {
    return;
  } // Recursively insert all host nodes into the parent.

  var parentFiber = getHostParentFiber(finishedWork); // Note: these two variables *must* always be updated together.

  var parent;
  var isContainer;
  var parentStateNode = parentFiber.stateNode;

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      isContainer = false;
      break;

    case HostRoot:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;

    case HostPortal:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;

    case FundamentalComponent:
      if (enableFundamentalAPI) {
        parent = parentStateNode.instance;
        isContainer = false;
      }

    // eslint-disable-next-line-no-fallthrough

    default:
      (function() {
        {
          throw ReactError(
            Error(
              "Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();
  }

  if (parentFiber.effectTag & ContentReset) {
    // Reset the text content of the parent before doing any insertions
    parentFiber.effectTag &= ~ContentReset;
  }

  var before = getHostSibling(finishedWork); // We only have the top Fiber that was inserted but we need to recurse down its
  // children to find all the terminal nodes.

  var node = finishedWork;

  while (true) {
    var isHost = node.tag === HostComponent || node.tag === HostText;

    if (isHost || (enableFundamentalAPI && node.tag === FundamentalComponent)) {
      var stateNode = isHost ? node.stateNode : node.stateNode.instance;

      if (before) {
        if (isContainer) {
          insertInContainerBefore(parent, stateNode, before);
        } else {
          insertBefore(parent, stateNode, before);
        }
      } else {
        if (isContainer) {
          appendChildToContainer(parent, stateNode);
        } else {
          appendChild(parent, stateNode);
        }
      }
    } else if (node.tag === HostPortal) {
      // If the insertion itself is a portal, then we don't want to traverse
      // down its children. Instead, we'll get insertions from each child in
      // the portal directly.
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === finishedWork) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === finishedWork) {
        return;
      }

      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function unmountHostComponents(finishedRoot, current$$1, renderPriorityLevel) {
  // We only have the top Fiber that was deleted but we need to recurse down its
  // children to find all the terminal nodes.
  var node = current$$1; // Each iteration, currentParent is populated with node's host parent if not
  // currentParentIsValid.

  var currentParentIsValid = false; // Note: these two variables *must* always be updated together.

  var currentParent;
  var currentParentIsContainer;

  while (true) {
    if (!currentParentIsValid) {
      var parent = node.return;

      findParent: while (true) {
        (function() {
          if (!(parent !== null)) {
            throw ReactError(
              Error(
                "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
              )
            );
          }
        })();

        var parentStateNode = parent.stateNode;

        switch (parent.tag) {
          case HostComponent:
            currentParent = parentStateNode;
            currentParentIsContainer = false;
            break findParent;

          case HostRoot:
            currentParent = parentStateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;

          case HostPortal:
            currentParent = parentStateNode.containerInfo;
            currentParentIsContainer = true;
            break findParent;

          case FundamentalComponent:
            if (enableFundamentalAPI) {
              currentParent = parentStateNode.instance;
              currentParentIsContainer = false;
            }
        }

        parent = parent.return;
      }

      currentParentIsValid = true;
    }

    if (node.tag === HostComponent || node.tag === HostText) {
      commitNestedUnmounts(finishedRoot, node, renderPriorityLevel); // After all the children have unmounted, it is now safe to remove the
      // node from the tree.

      if (currentParentIsContainer) {
        removeChildFromContainer(currentParent, node.stateNode);
      } else {
        removeChild(currentParent, node.stateNode);
      } // Don't visit children because we already visited them.
    } else if (enableFundamentalAPI && node.tag === FundamentalComponent) {
      var fundamentalNode = node.stateNode.instance;
      commitNestedUnmounts(finishedRoot, node, renderPriorityLevel); // After all the children have unmounted, it is now safe to remove the
      // node from the tree.

      if (currentParentIsContainer) {
        removeChildFromContainer(currentParent, fundamentalNode);
      } else {
        removeChild(currentParent, fundamentalNode);
      }
    } else if (
      enableSuspenseServerRenderer &&
      node.tag === DehydratedFragment
    ) {
      if (enableSuspenseCallback) {
        var hydrationCallbacks = finishedRoot.hydrationCallbacks;

        if (hydrationCallbacks !== null) {
          var onDeleted = hydrationCallbacks.onDeleted;

          if (onDeleted) {
            onDeleted(node.stateNode);
          }
        }
      } // Delete the dehydrated suspense boundary and all of its content.

      if (currentParentIsContainer) {
        clearSuspenseBoundaryFromContainer(currentParent, node.stateNode);
      } else {
        clearSuspenseBoundary(currentParent, node.stateNode);
      }
    } else if (node.tag === HostPortal) {
      if (node.child !== null) {
        // When we go into a portal, it becomes the parent to remove from.
        // We will reassign it back when we pop the portal on the way up.
        currentParent = node.stateNode.containerInfo;
        currentParentIsContainer = true; // Visit children because portals might contain host components.

        node.child.return = node;
        node = node.child;
        continue;
      }
    } else {
      commitUnmount(finishedRoot, node, renderPriorityLevel); // Visit children because we may find more host components below.

      if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
    }

    if (node === current$$1) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === current$$1) {
        return;
      }

      node = node.return;

      if (node.tag === HostPortal) {
        // When we go out of the portal, we need to restore the parent.
        // Since we don't keep a stack of them, we will search for it.
        currentParentIsValid = false;
      }
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

function commitDeletion(finishedRoot, current$$1, renderPriorityLevel) {
  if (supportsMutation) {
    // Recursively delete all host nodes from the parent.
    // Detach refs and call componentWillUnmount() on the whole subtree.
    unmountHostComponents(finishedRoot, current$$1, renderPriorityLevel);
  } else {
    // Detach refs and call componentWillUnmount() on the whole subtree.
    commitNestedUnmounts(finishedRoot, current$$1, renderPriorityLevel);
  }

  detachFiber(current$$1);
}

function commitWork(current$$1, finishedWork) {
  if (!supportsMutation) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case MemoComponent:
      case SimpleMemoComponent: {
        // Note: We currently never use MountMutation, but useLayout uses
        // UnmountMutation.
        commitHookEffectList(UnmountMutation, MountMutation, finishedWork);
        return;
      }

      case Profiler: {
        return;
      }

      case SuspenseComponent: {
        commitSuspenseComponent(finishedWork);
        attachSuspenseRetryListeners(finishedWork);
        return;
      }

      case SuspenseListComponent: {
        attachSuspenseRetryListeners(finishedWork);
        return;
      }
    }

    commitContainer(finishedWork);
    return;
  }

  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent: {
      // Note: We currently never use MountMutation, but useLayout uses
      // UnmountMutation.
      commitHookEffectList(UnmountMutation, MountMutation, finishedWork);
      return;
    }

    case ClassComponent: {
      return;
    }

    case HostComponent: {
      var instance = finishedWork.stateNode;

      if (instance != null) {
        // Commit the work prepared earlier.
        var newProps = finishedWork.memoizedProps; // For hydration we reuse the update path but we treat the oldProps
        // as the newProps. The updatePayload will contain the real change in
        // this case.

        var oldProps =
          current$$1 !== null ? current$$1.memoizedProps : newProps;
        var type = finishedWork.type; // TODO: Type the updateQueue to be specific to host components.

        var updatePayload = finishedWork.updateQueue;
        finishedWork.updateQueue = null;

        if (updatePayload !== null) {
          commitUpdate(
            instance,
            updatePayload,
            type,
            oldProps,
            newProps,
            finishedWork
          );
        }
      }

      return;
    }

    case HostText: {
      (function() {
        if (!(finishedWork.stateNode !== null)) {
          throw ReactError(
            Error(
              "This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();

      var textInstance = finishedWork.stateNode;
      var newText = finishedWork.memoizedProps; // For hydration we reuse the update path but we treat the oldProps
      // as the newProps. The updatePayload will contain the real change in
      // this case.

      var oldText = current$$1 !== null ? current$$1.memoizedProps : newText;
      commitTextUpdate(textInstance, oldText, newText);
      return;
    }

    case HostRoot: {
      return;
    }

    case Profiler: {
      return;
    }

    case SuspenseComponent: {
      commitSuspenseComponent(finishedWork);
      attachSuspenseRetryListeners(finishedWork);
      return;
    }

    case SuspenseListComponent: {
      attachSuspenseRetryListeners(finishedWork);
      return;
    }

    case IncompleteClassComponent: {
      return;
    }

    case FundamentalComponent: {
      if (enableFundamentalAPI) {
        var fundamentalInstance = finishedWork.stateNode;
        updateFundamentalComponent(fundamentalInstance);
      }

      return;
    }

    default: {
      (function() {
        {
          throw ReactError(
            Error(
              "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
            )
          );
        }
      })();
    }
  }
}

function commitSuspenseComponent(finishedWork) {
  var newState = finishedWork.memoizedState;
  var newDidTimeout;
  var primaryChildParent = finishedWork;

  if (newState === null) {
    newDidTimeout = false;
  } else {
    newDidTimeout = true;
    primaryChildParent = finishedWork.child;
    markCommitTimeOfFallback();
  }

  if (supportsMutation && primaryChildParent !== null) {
    hideOrUnhideAllChildren(primaryChildParent, newDidTimeout);
  }

  if (enableSuspenseCallback && newState !== null) {
    var suspenseCallback = finishedWork.memoizedProps.suspenseCallback;

    if (typeof suspenseCallback === "function") {
      var thenables = finishedWork.updateQueue;

      if (thenables !== null) {
        suspenseCallback(new Set(thenables));
      }
    } else {
    }
  }
}

function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
  if (enableSuspenseCallback) {
    var hydrationCallbacks = finishedRoot.hydrationCallbacks;

    if (hydrationCallbacks !== null) {
      var onHydrated = hydrationCallbacks.onHydrated;

      if (onHydrated) {
        var newState = finishedWork.memoizedState;

        if (newState === null) {
          var current$$1 = finishedWork.alternate;

          if (current$$1 !== null) {
            var prevState = current$$1.memoizedState;

            if (prevState !== null && prevState.dehydrated !== null) {
              onHydrated(prevState.dehydrated);
            }
          }
        }
      }
    }
  }
}

function attachSuspenseRetryListeners(finishedWork) {
  // If this boundary just timed out, then it will have a set of thenables.
  // For each thenable, attach a listener so that when it resolves, React
  // attempts to re-render the boundary in the primary (pre-timeout) state.
  var thenables = finishedWork.updateQueue;

  if (thenables !== null) {
    finishedWork.updateQueue = null;
    var retryCache = finishedWork.stateNode;

    if (retryCache === null) {
      retryCache = finishedWork.stateNode = new PossiblyWeakSet();
    }

    thenables.forEach(function(thenable) {
      // Memoize using the boundary fiber to prevent redundant listeners.
      var retry = resolveRetryThenable.bind(null, finishedWork, thenable);

      if (!retryCache.has(thenable)) {
        if (enableSchedulerTracing) {
          retry = tracing.unstable_wrap(retry);
        }

        retryCache.add(thenable);
        thenable.then(retry, retry);
      }
    });
  }
}

function commitResetTextContent(current$$1) {
  if (!supportsMutation) {
    return;
  }

  resetTextContent(current$$1.stateNode);
}

var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;

function createRootErrorUpdate(fiber, errorInfo, expirationTime) {
  var update = createUpdate(expirationTime, null); // Unmount the root by rendering null.

  update.tag = CaptureUpdate; // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: null
  };
  var error = errorInfo.value;

  update.callback = function() {
    onUncaughtError(error);
    logError(fiber, errorInfo);
  };

  return update;
}

function createClassErrorUpdate(fiber, errorInfo, expirationTime) {
  var update = createUpdate(expirationTime, null);
  update.tag = CaptureUpdate;
  var getDerivedStateFromError = fiber.type.getDerivedStateFromError;

  if (typeof getDerivedStateFromError === "function") {
    var error = errorInfo.value;

    update.payload = function() {
      logError(fiber, errorInfo);
      return getDerivedStateFromError(error);
    };
  }

  var inst = fiber.stateNode;

  if (inst !== null && typeof inst.componentDidCatch === "function") {
    update.callback = function callback() {
      if (typeof getDerivedStateFromError !== "function") {
        // To preserve the preexisting retry behavior of error boundaries,
        // we keep track of which ones already failed during this batch.
        // This gets reset before we yield back to the browser.
        // TODO: Warn in strict mode if getDerivedStateFromError is
        // not defined.
        markLegacyErrorBoundaryAsFailed(this); // Only log here if componentDidCatch is the only error boundary method defined

        logError(fiber, errorInfo);
      }

      var error = errorInfo.value;
      var stack = errorInfo.stack;
      this.componentDidCatch(error, {
        componentStack: stack !== null ? stack : ""
      });
    };
  } else {
  }

  return update;
}

function attachPingListener(root, renderExpirationTime, thenable) {
  // Attach a listener to the promise to "ping" the root and retry. But
  // only if one does not already exist for the current render expiration
  // time (which acts like a "thread ID" here).
  var pingCache = root.pingCache;
  var threadIDs;

  if (pingCache === null) {
    pingCache = root.pingCache = new PossiblyWeakMap();
    threadIDs = new Set();
    pingCache.set(thenable, threadIDs);
  } else {
    threadIDs = pingCache.get(thenable);

    if (threadIDs === undefined) {
      threadIDs = new Set();
      pingCache.set(thenable, threadIDs);
    }
  }

  if (!threadIDs.has(renderExpirationTime)) {
    // Memoize using the thread ID to prevent redundant listeners.
    threadIDs.add(renderExpirationTime);
    var ping = pingSuspendedRoot.bind(
      null,
      root,
      thenable,
      renderExpirationTime
    );

    if (enableSchedulerTracing) {
      ping = tracing.unstable_wrap(ping);
    }

    thenable.then(ping, ping);
  }
}

function throwException(
  root,
  returnFiber,
  sourceFiber,
  value,
  renderExpirationTime
) {
  // The source fiber did not complete.
  sourceFiber.effectTag |= Incomplete; // Its effect list is no longer valid.

  sourceFiber.firstEffect = sourceFiber.lastEffect = null;

  if (
    value !== null &&
    typeof value === "object" &&
    typeof value.then === "function"
  ) {
    // This is a thenable.
    var thenable = value;
    var hasInvisibleParentBoundary = hasSuspenseContext(
      suspenseStackCursor.current,
      InvisibleParentSuspenseContext
    ); // Schedule the nearest Suspense to re-render the timed out view.

    var _workInProgress = returnFiber;

    do {
      if (
        _workInProgress.tag === SuspenseComponent &&
        shouldCaptureSuspense(_workInProgress, hasInvisibleParentBoundary)
      ) {
        // Found the nearest boundary.
        // Stash the promise on the boundary fiber. If the boundary times out, we'll
        // attach another listener to flip the boundary back to its normal state.
        var thenables = _workInProgress.updateQueue;

        if (thenables === null) {
          var updateQueue = new Set();
          updateQueue.add(thenable);
          _workInProgress.updateQueue = updateQueue;
        } else {
          thenables.add(thenable);
        } // If the boundary is outside of batched mode, we should *not*
        // suspend the commit. Pretend as if the suspended component rendered
        // null and keep rendering. In the commit phase, we'll schedule a
        // subsequent synchronous update to re-render the Suspense.
        //
        // Note: It doesn't matter whether the component that suspended was
        // inside a batched mode tree. If the Suspense is outside of it, we
        // should *not* suspend the commit.

        if ((_workInProgress.mode & BatchedMode) === NoMode) {
          _workInProgress.effectTag |= DidCapture; // We're going to commit this fiber even though it didn't complete.
          // But we shouldn't call any lifecycle methods or callbacks. Remove
          // all lifecycle effect tags.

          sourceFiber.effectTag &= ~(LifecycleEffectMask | Incomplete);

          if (sourceFiber.tag === ClassComponent) {
            var currentSourceFiber = sourceFiber.alternate;

            if (currentSourceFiber === null) {
              // This is a new mount. Change the tag so it's not mistaken for a
              // completed class component. For example, we should not call
              // componentWillUnmount if it is deleted.
              sourceFiber.tag = IncompleteClassComponent;
            } else {
              // When we try rendering again, we should not reuse the current fiber,
              // since it's known to be in an inconsistent state. Use a force update to
              // prevent a bail out.
              var update = createUpdate(Sync, null);
              update.tag = ForceUpdate;
              enqueueUpdate(sourceFiber, update);
            }
          } // The source fiber did not complete. Mark it with Sync priority to
          // indicate that it still has pending work.

          sourceFiber.expirationTime = Sync; // Exit without suspending.

          return;
        } // Confirmed that the boundary is in a concurrent mode tree. Continue
        // with the normal suspend path.
        //
        // After this we'll use a set of heuristics to determine whether this
        // render pass will run to completion or restart or "suspend" the commit.
        // The actual logic for this is spread out in different places.
        //
        // This first principle is that if we're going to suspend when we complete
        // a root, then we should also restart if we get an update or ping that
        // might unsuspend it, and vice versa. The only reason to suspend is
        // because you think you might want to restart before committing. However,
        // it doesn't make sense to restart only while in the period we're suspended.
        //
        // Restarting too aggressively is also not good because it starves out any
        // intermediate loading state. So we use heuristics to determine when.
        // Suspense Heuristics
        //
        // If nothing threw a Promise or all the same fallbacks are already showing,
        // then don't suspend/restart.
        //
        // If this is an initial render of a new tree of Suspense boundaries and
        // those trigger a fallback, then don't suspend/restart. We want to ensure
        // that we can show the initial loading state as quickly as possible.
        //
        // If we hit a "Delayed" case, such as when we'd switch from content back into
        // a fallback, then we should always suspend/restart. SuspenseConfig applies to
        // this case. If none is defined, JND is used instead.
        //
        // If we're already showing a fallback and it gets "retried", allowing us to show
        // another level, but there's still an inner boundary that would show a fallback,
        // then we suspend/restart for 500ms since the last time we showed a fallback
        // anywhere in the tree. This effectively throttles progressive loading into a
        // consistent train of commits. This also gives us an opportunity to restart to
        // get to the completed state slightly earlier.
        //
        // If there's ambiguity due to batching it's resolved in preference of:
        // 1) "delayed", 2) "initial render", 3) "retry".
        //
        // We want to ensure that a "busy" state doesn't get force committed. We want to
        // ensure that new initial loading states can commit as soon as possible.

        attachPingListener(root, renderExpirationTime, thenable);
        _workInProgress.effectTag |= ShouldCapture;
        _workInProgress.expirationTime = renderExpirationTime;
        return;
      } // This boundary already captured during this render. Continue to the next
      // boundary.

      _workInProgress = _workInProgress.return;
    } while (_workInProgress !== null); // No boundary was found. Fallthrough to error mode.
    // TODO: Use invariant so the message is stripped in prod?

    value = new Error(
      (getComponentName(sourceFiber.type) || "A React component") +
        " suspended while rendering, but no fallback UI was specified.\n" +
        "\n" +
        "Add a <Suspense fallback=...> component higher in the tree to " +
        "provide a loading indicator or placeholder to display." +
        getStackByFiberInDevAndProd(sourceFiber)
    );
  } // We didn't find a boundary that could handle this type of exception. Start
  // over and traverse parent path again, this time treating the exception
  // as an error.

  renderDidError();
  value = createCapturedValue(value, sourceFiber);
  var workInProgress = returnFiber;

  do {
    switch (workInProgress.tag) {
      case HostRoot: {
        var _errorInfo = value;
        workInProgress.effectTag |= ShouldCapture;
        workInProgress.expirationTime = renderExpirationTime;

        var _update = createRootErrorUpdate(
          workInProgress,
          _errorInfo,
          renderExpirationTime
        );

        enqueueCapturedUpdate(workInProgress, _update);
        return;
      }

      case ClassComponent:
        // Capture and retry
        var errorInfo = value;
        var ctor = workInProgress.type;
        var instance = workInProgress.stateNode;

        if (
          (workInProgress.effectTag & DidCapture) === NoEffect &&
          (typeof ctor.getDerivedStateFromError === "function" ||
            (instance !== null &&
              typeof instance.componentDidCatch === "function" &&
              !isAlreadyFailedLegacyErrorBoundary(instance)))
        ) {
          workInProgress.effectTag |= ShouldCapture;
          workInProgress.expirationTime = renderExpirationTime; // Schedule the error boundary to re-render using updated state

          var _update2 = createClassErrorUpdate(
            workInProgress,
            errorInfo,
            renderExpirationTime
          );

          enqueueCapturedUpdate(workInProgress, _update2);
          return;
        }

        break;

      default:
        break;
    }

    workInProgress = workInProgress.return;
  } while (workInProgress !== null);
}

var ceil = Math.ceil;
var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
var ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner;
var IsSomeRendererActing = ReactSharedInternals.IsSomeRendererActing;
var NoContext =
  /*                    */
  0;
var BatchedContext =
  /*               */
  1;
var EventContext =
  /*                 */
  2;
var DiscreteEventContext =
  /*         */
  4;
var LegacyUnbatchedContext =
  /*       */
  8;
var RenderContext =
  /*                */
  16;
var CommitContext =
  /*                */
  32;
var RootIncomplete = 0;
var RootErrored = 1;
var RootSuspended = 2;
var RootSuspendedWithDelay = 3;
var RootCompleted = 4;
// Describes where we are in the React execution stack
var executionContext = NoContext; // The root we're working on

var workInProgressRoot = null; // The fiber we're working on

var workInProgress = null; // The expiration time we're rendering

var renderExpirationTime = NoWork; // Whether to root completed, errored, suspended, etc.

var workInProgressRootExitStatus = RootIncomplete; // Most recent event time among processed updates during this render.
// This is conceptually a time stamp but expressed in terms of an ExpirationTime
// because we deal mostly with expiration times in the hot path, so this avoids
// the conversion happening in the hot path.

var workInProgressRootLatestProcessedExpirationTime = Sync;
var workInProgressRootLatestSuspenseTimeout = Sync;
var workInProgressRootCanSuspendUsingConfig = null; // If we're pinged while rendering we don't always restart immediately.
// This flag determines if it might be worthwhile to restart if an opportunity
// happens latere.

var workInProgressRootHasPendingPing = false; // The most recent time we committed a fallback. This lets us ensure a train
// model where we don't commit new loading states in too quick succession.

var globalMostRecentFallbackTime = 0;
var FALLBACK_THROTTLE_MS = 500;
var nextEffect = null;
var hasUncaughtError = false;
var firstUncaughtError = null;
var legacyErrorBoundariesThatAlreadyFailed = null;
var rootDoesHavePassiveEffects = false;
var rootWithPendingPassiveEffects = null;
var pendingPassiveEffectsRenderPriority = NoPriority;
var pendingPassiveEffectsExpirationTime = NoWork;
var rootsWithPendingDiscreteUpdates = null; // Use these to prevent an infinite loop of nested updates

var NESTED_UPDATE_LIMIT = 50;
var nestedUpdateCount = 0;
var rootWithNestedUpdates = null;
var interruptedBy = null; // Marks the need to reschedule pending interactions at these expiration times
// during the commit phase. This enables them to be traced across components
// that spawn new work during render. E.g. hidden boundaries, suspended SSR
// hydration or SuspenseList.

var spawnedWorkDuringRender = null; // Expiration times are computed by adding to the current time (the start
// time). However, if two updates are scheduled within the same event, we
// should treat their start times as simultaneous, even if the actual clock
// time has advanced between the first and second call.
// In other words, because expiration times determine how updates are batched,
// we want all updates of like priority that occur within the same event to
// receive the same expiration time. Otherwise we get tearing.

var currentEventTime = NoWork;
function requestCurrentTime() {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    // We're inside React, so it's fine to read the actual time.
    return msToExpirationTime(now());
  } // We're not inside React, so we may be in the middle of a browser event.

  if (currentEventTime !== NoWork) {
    // Use the same start time for all updates until we enter React again.
    return currentEventTime;
  } // This is the first update since React yielded. Compute a new start time.

  currentEventTime = msToExpirationTime(now());
  return currentEventTime;
}
function computeExpirationForFiber(currentTime, fiber, suspenseConfig) {
  var mode = fiber.mode;

  if ((mode & BatchedMode) === NoMode) {
    return Sync;
  }

  var priorityLevel = getCurrentPriorityLevel();

  if ((mode & ConcurrentMode) === NoMode) {
    return priorityLevel === ImmediatePriority ? Sync : Batched;
  }

  if ((executionContext & RenderContext) !== NoContext) {
    // Use whatever time we're already rendering
    return renderExpirationTime;
  }

  var expirationTime;

  if (suspenseConfig !== null) {
    // Compute an expiration time based on the Suspense timeout.
    expirationTime = computeSuspenseExpiration(
      currentTime,
      suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION
    );
  } else {
    // Compute an expiration time based on the Scheduler priority.
    switch (priorityLevel) {
      case ImmediatePriority:
        expirationTime = Sync;
        break;

      case UserBlockingPriority:
        // TODO: Rename this to computeUserBlockingExpiration
        expirationTime = computeInteractiveExpiration(currentTime);
        break;

      case NormalPriority:
      case LowPriority:
        // TODO: Handle LowPriority
        // TODO: Rename this to... something better.
        expirationTime = computeAsyncExpiration(currentTime);
        break;

      case IdlePriority:
        expirationTime = Never;
        break;

      default:
        (function() {
          {
            throw ReactError(Error("Expected a valid priority level"));
          }
        })();
    }
  } // If we're in the middle of rendering a tree, do not update at the same
  // expiration time that is already rendering.
  // TODO: We shouldn't have to do this if the update is on a different root.
  // Refactor computeExpirationForFiber + scheduleUpdate so we have access to
  // the root when we check for this condition.

  if (workInProgressRoot !== null && expirationTime === renderExpirationTime) {
    // This is a trick to move this update into a separate batch
    expirationTime -= 1;
  }

  return expirationTime;
}

function scheduleUpdateOnFiber(fiber, expirationTime) {
  checkForNestedUpdates();
  var root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);

  if (root === null) {
    return;
  }

  root.pingTime = NoWork;
  checkForInterruption(fiber, expirationTime);
  recordScheduleUpdate(); // TODO: computeExpirationForFiber also reads the priority. Pass the
  // priority as an argument to that function and this one.

  var priorityLevel = getCurrentPriorityLevel();

  if (expirationTime === Sync) {
    if (
      // Check if we're inside unbatchedUpdates
      (executionContext & LegacyUnbatchedContext) !== NoContext && // Check if we're not already rendering
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // Register pending interactions on the root to avoid losing traced interaction data.
      schedulePendingInteractions(root, expirationTime); // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
      // root inside of batchedUpdates should be synchronous, but layout updates
      // should be deferred until the end of the batch.

      var callback = renderRoot(root, Sync, true);

      while (callback !== null) {
        callback = callback(true);
      }
    } else {
      scheduleCallbackForRoot(root, ImmediatePriority, Sync);

      if (executionContext === NoContext) {
        // Flush the synchronous work now, wnless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of sync mode.
        flushSyncCallbackQueue();
      }
    }
  } else {
    scheduleCallbackForRoot(root, priorityLevel, expirationTime);
  }

  if (
    (executionContext & DiscreteEventContext) !== NoContext && // Only updates at user-blocking priority or greater are considered
    // discrete, even inside a discrete event.
    (priorityLevel === UserBlockingPriority ||
      priorityLevel === ImmediatePriority)
  ) {
    // This is the result of a discrete event. Track the lowest priority
    // discrete update per root so we can flush them early, if needed.
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      var lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);

      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
var scheduleWork = scheduleUpdateOnFiber; // This is split into a separate function so we can mark a fiber with pending
// work without treating it as a typical update that originates from an event;
// e.g. retrying a Suspense boundary isn't an update, but it does schedule work
// on a fiber.

function markUpdateTimeFromFiberToRoot(fiber, expirationTime) {
  // Update the source fiber's expiration time
  if (fiber.expirationTime < expirationTime) {
    fiber.expirationTime = expirationTime;
  }

  var alternate = fiber.alternate;

  if (alternate !== null && alternate.expirationTime < expirationTime) {
    alternate.expirationTime = expirationTime;
  } // Walk the parent path to the root and update the child expiration time.

  var node = fiber.return;
  var root = null;

  if (node === null && fiber.tag === HostRoot) {
    root = fiber.stateNode;
  } else {
    while (node !== null) {
      alternate = node.alternate;

      if (node.childExpirationTime < expirationTime) {
        node.childExpirationTime = expirationTime;

        if (
          alternate !== null &&
          alternate.childExpirationTime < expirationTime
        ) {
          alternate.childExpirationTime = expirationTime;
        }
      } else if (
        alternate !== null &&
        alternate.childExpirationTime < expirationTime
      ) {
        alternate.childExpirationTime = expirationTime;
      }

      if (node.return === null && node.tag === HostRoot) {
        root = node.stateNode;
        break;
      }

      node = node.return;
    }
  }

  if (root !== null) {
    // Update the first and last pending expiration times in this root
    var firstPendingTime = root.firstPendingTime;

    if (expirationTime > firstPendingTime) {
      root.firstPendingTime = expirationTime;
    }

    var lastPendingTime = root.lastPendingTime;

    if (lastPendingTime === NoWork || expirationTime < lastPendingTime) {
      root.lastPendingTime = expirationTime;
    }
  }

  return root;
} // Use this function, along with runRootCallback, to ensure that only a single
// callback per root is scheduled. It's still possible to call renderRoot
// directly, but scheduling via this function helps avoid excessive callbacks.
// It works by storing the callback node and expiration time on the root. When a
// new callback comes in, it compares the expiration time to determine if it
// should cancel the previous one. It also relies on commitRoot scheduling a
// callback to render the next level, because that means we don't need a
// separate callback per expiration time.

function scheduleCallbackForRoot(root, priorityLevel, expirationTime) {
  var existingCallbackExpirationTime = root.callbackExpirationTime;

  if (existingCallbackExpirationTime < expirationTime) {
    // New callback has higher priority than the existing one.
    var existingCallbackNode = root.callbackNode;

    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }

    root.callbackExpirationTime = expirationTime;

    if (expirationTime === Sync) {
      // Sync React callbacks are scheduled on a special internal queue
      root.callbackNode = scheduleSyncCallback(
        runRootCallback.bind(
          null,
          root,
          renderRoot.bind(null, root, expirationTime)
        )
      );
    } else {
      var options = null;

      if (
        !disableSchedulerTimeoutBasedOnReactExpirationTime &&
        expirationTime !== Never
      ) {
        var timeout = expirationTimeToMs(expirationTime) - now();
        options = {
          timeout: timeout
        };
      }

      root.callbackNode = scheduleCallback(
        priorityLevel,
        runRootCallback.bind(
          null,
          root,
          renderRoot.bind(null, root, expirationTime)
        ),
        options
      );
    }
  } // Associate the current interactions with this new root+priority.

  schedulePendingInteractions(root, expirationTime);
}

function runRootCallback(root, callback, isSync) {
  var prevCallbackNode = root.callbackNode;
  var continuation = null;

  try {
    continuation = callback(isSync);

    if (continuation !== null) {
      return runRootCallback.bind(null, root, continuation);
    } else {
      return null;
    }
  } finally {
    // If the callback exits without returning a continuation, remove the
    // corresponding callback node from the root. Unless the callback node
    // has changed, which implies that it was already cancelled by a high
    // priority update.
    if (continuation === null && prevCallbackNode === root.callbackNode) {
      root.callbackNode = null;
      root.callbackExpirationTime = NoWork;
    }
  }
}

function flushDiscreteUpdates() {
  // TODO: Should be able to flush inside batchedUpdates, but not inside `act`.
  // However, `act` uses `batchedUpdates`, so there's no way to distinguish
  // those two cases. Need to fix this before exposing flushDiscreteUpdates
  // as a public API.
  if (
    (executionContext & (BatchedContext | RenderContext | CommitContext)) !==
    NoContext
  ) {
    return;
  }

  flushPendingDiscreteUpdates(); // If the discrete updates scheduled passive effects, flush them now so that
  // they fire before the next serial event.

  flushPassiveEffects();
}

function resolveLocksOnRoot(root, expirationTime) {
  var firstBatch = root.firstBatch;

  if (
    firstBatch !== null &&
    firstBatch._defer &&
    firstBatch._expirationTime >= expirationTime
  ) {
    scheduleCallback(NormalPriority, function() {
      firstBatch._onComplete();

      return null;
    });
    return true;
  } else {
    return false;
  }
}

function flushPendingDiscreteUpdates() {
  if (rootsWithPendingDiscreteUpdates !== null) {
    // For each root with pending discrete updates, schedule a callback to
    // immediately flush them.
    var roots = rootsWithPendingDiscreteUpdates;
    rootsWithPendingDiscreteUpdates = null;
    roots.forEach(function(expirationTime, root) {
      scheduleSyncCallback(renderRoot.bind(null, root, expirationTime));
    }); // Now flush the immediate queue.

    flushSyncCallbackQueue();
  }
}

function batchedUpdates$1(fn, a) {
  var prevExecutionContext = executionContext;
  executionContext |= BatchedContext;

  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
function batchedEventUpdates$1(fn, a) {
  var prevExecutionContext = executionContext;
  executionContext |= EventContext;

  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
function discreteUpdates$1(fn, a, b, c) {
  var prevExecutionContext = executionContext;
  executionContext |= DiscreteEventContext;

  try {
    // Should this
    return runWithPriority(UserBlockingPriority, fn.bind(null, a, b, c));
  } finally {
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}

function prepareFreshStack(root, expirationTime) {
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;
  var timeoutHandle = root.timeoutHandle;

  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout; // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above

    cancelTimeout(timeoutHandle);
  }

  if (workInProgress !== null) {
    var interruptedWork = workInProgress.return;

    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }

  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null, expirationTime);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootLatestProcessedExpirationTime = Sync;
  workInProgressRootLatestSuspenseTimeout = Sync;
  workInProgressRootCanSuspendUsingConfig = null;
  workInProgressRootHasPendingPing = false;

  if (enableSchedulerTracing) {
    spawnedWorkDuringRender = null;
  }
}

function renderRoot(root, expirationTime, isSync) {
  (function() {
    if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
      throw ReactError(Error("Should not already be working."));
    }
  })();

  if (root.firstPendingTime < expirationTime) {
    // If there's no work left at this expiration time, exit immediately. This
    // happens when multiple callbacks are scheduled for a single root, but an
    // earlier callback flushes the work of a later one.
    return null;
  }

  if (isSync && root.finishedExpirationTime === expirationTime) {
    // There's already a pending commit at this expiration time.
    // TODO: This is poorly factored. This case only exists for the
    // batch.commit() API.
    return commitRoot.bind(null, root);
  }

  flushPassiveEffects(); // If the root or expiration time have changed, throw out the existing stack
  // and prepare a fresh one. Otherwise we'll continue where we left off.

  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    prepareFreshStack(root, expirationTime);
    startWorkOnPendingInteractions(root, expirationTime);
  } else if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
    // We could've received an update at a lower priority while we yielded.
    // We're suspended in a delayed state. Once we complete this render we're
    // just going to try to recover at the last pending time anyway so we might
    // as well start doing that eagerly.
    // Ideally we should be able to do this even for retries but we don't yet
    // know if we're going to process an update which wants to commit earlier,
    // and this path happens very early so it would happen too often. Instead,
    // for that case, we'll wait until we complete.
    if (workInProgressRootHasPendingPing) {
      // We have a ping at this expiration. Let's restart to see if we get unblocked.
      prepareFreshStack(root, expirationTime);
    } else {
      var lastPendingTime = root.lastPendingTime;

      if (lastPendingTime < expirationTime) {
        // There's lower priority work. It might be unsuspended. Try rendering
        // at that level immediately, while preserving the position in the queue.
        return renderRoot.bind(null, root, lastPendingTime);
      }
    }
  } // If we have a work-in-progress fiber, it means there's still work to do
  // in this root.

  if (workInProgress !== null) {
    var prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    var prevDispatcher = ReactCurrentDispatcher.current;

    if (prevDispatcher === null) {
      // The React isomorphic package does not include a default dispatcher.
      // Instead the first renderer will lazily attach one, in order to give
      // nicer error messages.
      prevDispatcher = ContextOnlyDispatcher;
    }

    ReactCurrentDispatcher.current = ContextOnlyDispatcher;
    var prevInteractions = null;

    if (enableSchedulerTracing) {
      prevInteractions = tracing.__interactionsRef.current;
      tracing.__interactionsRef.current = root.memoizedInteractions;
    }

    startWorkLoopTimer(workInProgress); // TODO: Fork renderRoot into renderRootSync and renderRootAsync

    if (isSync) {
      if (expirationTime !== Sync) {
        // An async update expired. There may be other expired updates on
        // this root. We should render all the expired work in a
        // single batch.
        var currentTime = requestCurrentTime();

        if (currentTime < expirationTime) {
          // Restart at the current time.
          executionContext = prevExecutionContext;
          resetContextDependencies();
          ReactCurrentDispatcher.current = prevDispatcher;

          if (enableSchedulerTracing) {
            tracing.__interactionsRef.current = prevInteractions;
          }

          return renderRoot.bind(null, root, currentTime);
        }
      }
    } else {
      // Since we know we're in a React event, we can clear the current
      // event time. The next update will compute a new event time.
      currentEventTime = NoWork;
    }

    do {
      try {
        if (isSync) {
          workLoopSync();
        } else {
          workLoop();
        }

        break;
      } catch (thrownValue) {
        // Reset module-level state that was set during the render phase.
        resetContextDependencies();
        resetHooks();
        var sourceFiber = workInProgress;

        if (sourceFiber === null || sourceFiber.return === null) {
          // Expected to be working on a non-root fiber. This is a fatal error
          // because there's no ancestor that can handle it; the root is
          // supposed to capture all errors that weren't caught by an error
          // boundary.
          prepareFreshStack(root, expirationTime);
          executionContext = prevExecutionContext;
          throw thrownValue;
        }

        if (enableProfilerTimer && sourceFiber.mode & ProfileMode) {
          // Record the time spent rendering before an error was thrown. This
          // avoids inaccurate Profiler durations in the case of a
          // suspended render.
          stopProfilerTimerIfRunningAndRecordDelta(sourceFiber, true);
        }

        var returnFiber = sourceFiber.return;
        throwException(
          root,
          returnFiber,
          sourceFiber,
          thrownValue,
          renderExpirationTime
        );
        workInProgress = completeUnitOfWork(sourceFiber);
      }
    } while (true);

    executionContext = prevExecutionContext;
    resetContextDependencies();
    ReactCurrentDispatcher.current = prevDispatcher;

    if (enableSchedulerTracing) {
      tracing.__interactionsRef.current = prevInteractions;
    }

    if (workInProgress !== null) {
      // There's still work left over. Return a continuation.
      stopInterruptedWorkLoopTimer();
      return renderRoot.bind(null, root, expirationTime);
    }
  } // We now have a consistent tree. The next step is either to commit it, or, if
  // something suspended, wait to commit it after a timeout.

  stopFinishedWorkLoopTimer();
  root.finishedWork = root.current.alternate;
  root.finishedExpirationTime = expirationTime;
  var isLocked = resolveLocksOnRoot(root, expirationTime);

  if (isLocked) {
    // This root has a lock that prevents it from committing. Exit. If we begin
    // work on the root again, without any intervening updates, it will finish
    // without doing additional work.
    return null;
  } // Set this to null to indicate there's no in-progress render.

  workInProgressRoot = null;

  switch (workInProgressRootExitStatus) {
    case RootIncomplete: {
      (function() {
        {
          throw ReactError(Error("Should have a work-in-progress."));
        }
      })();
    }
    // Flow knows about invariant, so it complains if I add a break statement,
    // but eslint doesn't know about invariant, so it complains if I do.
    // eslint-disable-next-line no-fallthrough

    case RootErrored: {
      // An error was thrown. First check if there is lower priority work
      // scheduled on this root.
      var _lastPendingTime = root.lastPendingTime;

      if (_lastPendingTime < expirationTime) {
        // There's lower priority work. Before raising the error, try rendering
        // at the lower priority to see if it fixes it. Use a continuation to
        // maintain the existing priority and position in the queue.
        return renderRoot.bind(null, root, _lastPendingTime);
      }

      if (!isSync) {
        // If we're rendering asynchronously, it's possible the error was
        // caused by tearing due to a mutation during an event. Try rendering
        // one more time without yiedling to events.
        prepareFreshStack(root, expirationTime);
        scheduleSyncCallback(renderRoot.bind(null, root, expirationTime));
        return null;
      } // If we're already rendering synchronously, commit the root in its
      // errored state.

      return commitRoot.bind(null, root);
    }

    case RootSuspended: {
      var hasNotProcessedNewUpdates =
        workInProgressRootLatestProcessedExpirationTime === Sync;

      if (
        hasNotProcessedNewUpdates &&
        !isSync && // do not delay if we're inside an act() scope
        !(
          false &&
          flushSuspenseFallbacksInTests &&
          IsThisRendererActing.current
        )
      ) {
        // If we have not processed any new updates during this pass, then this is
        // either a retry of an existing fallback state or a hidden tree.
        // Hidden trees shouldn't be batched with other work and after that's
        // fixed it can only be a retry.
        // We're going to throttle committing retries so that we don't show too
        // many loading states too quickly.
        var msUntilTimeout =
          globalMostRecentFallbackTime + FALLBACK_THROTTLE_MS - now(); // Don't bother with a very short suspense time.

        if (msUntilTimeout > 10) {
          if (workInProgressRootHasPendingPing) {
            // This render was pinged but we didn't get to restart earlier so try
            // restarting now instead.
            prepareFreshStack(root, expirationTime);
            return renderRoot.bind(null, root, expirationTime);
          }

          var _lastPendingTime2 = root.lastPendingTime;

          if (_lastPendingTime2 < expirationTime) {
            // There's lower priority work. It might be unsuspended. Try rendering
            // at that level.
            return renderRoot.bind(null, root, _lastPendingTime2);
          } // The render is suspended, it hasn't timed out, and there's no lower
          // priority work to do. Instead of committing the fallback
          // immediately, wait for more data to arrive.

          root.timeoutHandle = scheduleTimeout(
            commitRoot.bind(null, root),
            msUntilTimeout
          );
          return null;
        }
      } // The work expired. Commit immediately.

      return commitRoot.bind(null, root);
    }

    case RootSuspendedWithDelay: {
      if (
        !isSync && // do not delay if we're inside an act() scope
        !(
          false &&
          flushSuspenseFallbacksInTests &&
          IsThisRendererActing.current
        )
      ) {
        // We're suspended in a state that should be avoided. We'll try to avoid committing
        // it for as long as the timeouts let us.
        if (workInProgressRootHasPendingPing) {
          // This render was pinged but we didn't get to restart earlier so try
          // restarting now instead.
          prepareFreshStack(root, expirationTime);
          return renderRoot.bind(null, root, expirationTime);
        }

        var _lastPendingTime3 = root.lastPendingTime;

        if (_lastPendingTime3 < expirationTime) {
          // There's lower priority work. It might be unsuspended. Try rendering
          // at that level immediately.
          return renderRoot.bind(null, root, _lastPendingTime3);
        }

        var _msUntilTimeout;

        if (workInProgressRootLatestSuspenseTimeout !== Sync) {
          // We have processed a suspense config whose expiration time we can use as
          // the timeout.
          _msUntilTimeout =
            expirationTimeToMs(workInProgressRootLatestSuspenseTimeout) - now();
        } else if (workInProgressRootLatestProcessedExpirationTime === Sync) {
          // This should never normally happen because only new updates cause
          // delayed states, so we should have processed something. However,
          // this could also happen in an offscreen tree.
          _msUntilTimeout = 0;
        } else {
          // If we don't have a suspense config, we're going to use a heuristic to
          // determine how long we can suspend.
          var eventTimeMs = inferTimeFromExpirationTime(
            workInProgressRootLatestProcessedExpirationTime
          );
          var currentTimeMs = now();
          var timeUntilExpirationMs =
            expirationTimeToMs(expirationTime) - currentTimeMs;
          var timeElapsed = currentTimeMs - eventTimeMs;

          if (timeElapsed < 0) {
            // We get this wrong some time since we estimate the time.
            timeElapsed = 0;
          }

          _msUntilTimeout = jnd(timeElapsed) - timeElapsed; // Clamp the timeout to the expiration time.
          // TODO: Once the event time is exact instead of inferred from expiration time
          // we don't need this.

          if (timeUntilExpirationMs < _msUntilTimeout) {
            _msUntilTimeout = timeUntilExpirationMs;
          }
        } // Don't bother with a very short suspense time.

        if (_msUntilTimeout > 10) {
          // The render is suspended, it hasn't timed out, and there's no lower
          // priority work to do. Instead of committing the fallback
          // immediately, wait for more data to arrive.
          root.timeoutHandle = scheduleTimeout(
            commitRoot.bind(null, root),
            _msUntilTimeout
          );
          return null;
        }
      } // The work expired. Commit immediately.

      return commitRoot.bind(null, root);
    }

    case RootCompleted: {
      // The work completed. Ready to commit.
      if (
        !isSync && // do not delay if we're inside an act() scope
        !(
          false &&
          flushSuspenseFallbacksInTests &&
          IsThisRendererActing.current
        ) &&
        workInProgressRootLatestProcessedExpirationTime !== Sync &&
        workInProgressRootCanSuspendUsingConfig !== null
      ) {
        // If we have exceeded the minimum loading delay, which probably
        // means we have shown a spinner already, we might have to suspend
        // a bit longer to ensure that the spinner is shown for enough time.
        var _msUntilTimeout2 = computeMsUntilSuspenseLoadingDelay(
          workInProgressRootLatestProcessedExpirationTime,
          expirationTime,
          workInProgressRootCanSuspendUsingConfig
        );

        if (_msUntilTimeout2 > 10) {
          root.timeoutHandle = scheduleTimeout(
            commitRoot.bind(null, root),
            _msUntilTimeout2
          );
          return null;
        }
      }

      return commitRoot.bind(null, root);
    }

    default: {
      (function() {
        {
          throw ReactError(Error("Unknown root exit status."));
        }
      })();
    }
  }
}

function markCommitTimeOfFallback() {
  globalMostRecentFallbackTime = now();
}
function markRenderEventTimeAndConfig(expirationTime, suspenseConfig) {
  if (
    expirationTime < workInProgressRootLatestProcessedExpirationTime &&
    expirationTime > Never
  ) {
    workInProgressRootLatestProcessedExpirationTime = expirationTime;
  }

  if (suspenseConfig !== null) {
    if (
      expirationTime < workInProgressRootLatestSuspenseTimeout &&
      expirationTime > Never
    ) {
      workInProgressRootLatestSuspenseTimeout = expirationTime; // Most of the time we only have one config and getting wrong is not bad.

      workInProgressRootCanSuspendUsingConfig = suspenseConfig;
    }
  }
}
function renderDidSuspend() {
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootSuspended;
  }
}
function renderDidSuspendDelayIfPossible() {
  if (
    workInProgressRootExitStatus === RootIncomplete ||
    workInProgressRootExitStatus === RootSuspended
  ) {
    workInProgressRootExitStatus = RootSuspendedWithDelay;
  }
}
function renderDidError() {
  if (workInProgressRootExitStatus !== RootCompleted) {
    workInProgressRootExitStatus = RootErrored;
  }
} // Called during render to determine if anything has suspended.
// Returns false if we're not sure.

function renderHasNotSuspendedYet() {
  // If something errored or completed, we can't really be sure,
  // so those are false.
  return workInProgressRootExitStatus === RootIncomplete;
}

function inferTimeFromExpirationTime(expirationTime) {
  // We don't know exactly when the update was scheduled, but we can infer an
  // approximate start time from the expiration time.
  var earliestExpirationTimeMs = expirationTimeToMs(expirationTime);
  return earliestExpirationTimeMs - LOW_PRIORITY_EXPIRATION;
}

function inferTimeFromExpirationTimeWithSuspenseConfig(
  expirationTime,
  suspenseConfig
) {
  // We don't know exactly when the update was scheduled, but we can infer an
  // approximate start time from the expiration time by subtracting the timeout
  // that was added to the event time.
  var earliestExpirationTimeMs = expirationTimeToMs(expirationTime);
  return (
    earliestExpirationTimeMs -
    (suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION)
  );
}

function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function workLoop() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  var current$$1 = unitOfWork.alternate;
  startWorkTimer(unitOfWork);
  var next;

  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork$$1(current$$1, unitOfWork, renderExpirationTime);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork$$1(current$$1, unitOfWork, renderExpirationTime);
  }

  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner$2.current = null;
  return next;
}

function completeUnitOfWork(unitOfWork) {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  workInProgress = unitOfWork;

  do {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    var current$$1 = workInProgress.alternate;
    var returnFiber = workInProgress.return; // Check if the work completed or if something threw.

    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      var next = void 0;

      if (
        !enableProfilerTimer ||
        (workInProgress.mode & ProfileMode) === NoMode
      ) {
        next = completeWork(current$$1, workInProgress, renderExpirationTime);
      } else {
        startProfilerTimer(workInProgress);
        next = completeWork(current$$1, workInProgress, renderExpirationTime); // Update render duration assuming we didn't error.

        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
      }

      stopWorkTimer(workInProgress);
      resetChildExpirationTime(workInProgress);

      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        return next;
      }

      if (
        returnFiber !== null && // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }

        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }

          returnFiber.lastEffect = workInProgress.lastEffect;
        } // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if needed,
        // by doing multiple passes over the effect list. We don't want to
        // schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.

        var effectTag = workInProgress.effectTag; // Skip both NoWork and PerformedWork tags when creating the effect
        // list. PerformedWork effect is read by React DevTools but shouldn't be
        // committed.

        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            returnFiber.firstEffect = workInProgress;
          }

          returnFiber.lastEffect = workInProgress;
        }
      }
    } else {
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      var _next = unwindWork(workInProgress, renderExpirationTime); // Because this fiber did not complete, don't reset its expiration time.

      if (
        enableProfilerTimer &&
        (workInProgress.mode & ProfileMode) !== NoMode
      ) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false); // Include the time spent working on failed children before continuing.

        var actualDuration = workInProgress.actualDuration;
        var child = workInProgress.child;

        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }

        workInProgress.actualDuration = actualDuration;
      }

      if (_next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        // TODO: The name stopFailedWorkTimer is misleading because Suspense
        // also captures and restarts.
        stopFailedWorkTimer(workInProgress);
        _next.effectTag &= HostEffectMask;
        return _next;
      }

      stopWorkTimer(workInProgress);

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
    }

    var siblingFiber = workInProgress.sibling;

    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      return siblingFiber;
    } // Otherwise, return to the parent

    workInProgress = returnFiber;
  } while (workInProgress !== null); // We've reached the root.

  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }

  return null;
}

function resetChildExpirationTime(completedWork) {
  if (
    renderExpirationTime !== Never &&
    completedWork.childExpirationTime === Never
  ) {
    // The children of this component are hidden. Don't bubble their
    // expiration times.
    return;
  }

  var newChildExpirationTime = NoWork; // Bubble up the earliest expiration time.

  if (enableProfilerTimer && (completedWork.mode & ProfileMode) !== NoMode) {
    // In profiling mode, resetChildExpirationTime is also used to reset
    // profiler durations.
    var actualDuration = completedWork.actualDuration;
    var treeBaseDuration = completedWork.selfBaseDuration; // When a fiber is cloned, its actualDuration is reset to 0. This value will
    // only be updated if work is done on the fiber (i.e. it doesn't bailout).
    // When work is done, it should bubble to the parent's actualDuration. If
    // the fiber has not been cloned though, (meaning no work was done), then
    // this value will reflect the amount of time spent working on a previous
    // render. In that case it should not bubble. We determine whether it was
    // cloned by comparing the child pointer.

    var shouldBubbleActualDurations =
      completedWork.alternate === null ||
      completedWork.child !== completedWork.alternate.child;
    var child = completedWork.child;

    while (child !== null) {
      var childUpdateExpirationTime = child.expirationTime;
      var childChildExpirationTime = child.childExpirationTime;

      if (childUpdateExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childUpdateExpirationTime;
      }

      if (childChildExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = childChildExpirationTime;
      }

      if (shouldBubbleActualDurations) {
        actualDuration += child.actualDuration;
      }

      treeBaseDuration += child.treeBaseDuration;
      child = child.sibling;
    }

    completedWork.actualDuration = actualDuration;
    completedWork.treeBaseDuration = treeBaseDuration;
  } else {
    var _child = completedWork.child;

    while (_child !== null) {
      var _childUpdateExpirationTime = _child.expirationTime;
      var _childChildExpirationTime = _child.childExpirationTime;

      if (_childUpdateExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = _childUpdateExpirationTime;
      }

      if (_childChildExpirationTime > newChildExpirationTime) {
        newChildExpirationTime = _childChildExpirationTime;
      }

      _child = _child.sibling;
    }
  }

  completedWork.childExpirationTime = newChildExpirationTime;
}

function commitRoot(root) {
  var renderPriorityLevel = getCurrentPriorityLevel();
  runWithPriority(
    ImmediatePriority,
    commitRootImpl.bind(null, root, renderPriorityLevel)
  ); // If there are passive effects, schedule a callback to flush them. This goes
  // outside commitRootImpl so that it inherits the priority of the render.

  if (rootWithPendingPassiveEffects !== null) {
    scheduleCallback(NormalPriority, function() {
      flushPassiveEffects();
      return null;
    });
  }

  return null;
}

function commitRootImpl(root, renderPriorityLevel) {
  flushPassiveEffects();
  (function() {
    if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
      throw ReactError(Error("Should not already be working."));
    }
  })();

  var finishedWork = root.finishedWork;
  var expirationTime = root.finishedExpirationTime;

  if (finishedWork === null) {
    return null;
  }

  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;

  (function() {
    if (!(finishedWork !== root.current)) {
      throw ReactError(
        Error(
          "Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue."
        )
      );
    }
  })(); // commitRoot never returns a continuation; it always finishes synchronously.
  // So we can clear these now to allow a new callback to be scheduled.

  root.callbackNode = null;
  root.callbackExpirationTime = NoWork;
  startCommitTimer(); // Update the first and last pending times on this root. The new first
  // pending time is whatever is left on the root fiber.

  var updateExpirationTimeBeforeCommit = finishedWork.expirationTime;
  var childExpirationTimeBeforeCommit = finishedWork.childExpirationTime;
  var firstPendingTimeBeforeCommit =
    childExpirationTimeBeforeCommit > updateExpirationTimeBeforeCommit
      ? childExpirationTimeBeforeCommit
      : updateExpirationTimeBeforeCommit;
  root.firstPendingTime = firstPendingTimeBeforeCommit;

  if (firstPendingTimeBeforeCommit < root.lastPendingTime) {
    // This usually means we've finished all the work, but it can also happen
    // when something gets downprioritized during render, like a hidden tree.
    root.lastPendingTime = firstPendingTimeBeforeCommit;
  }

  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    renderExpirationTime = NoWork;
  } else {
  } // This indicates that the last root we worked on is not the same one that
  // we're committing now. This most commonly happens when a suspended root
  // times out.
  // Get the list of effects.

  var firstEffect;

  if (finishedWork.effectTag > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if it
    // had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }

  if (firstEffect !== null) {
    var prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    var prevInteractions = null;

    if (enableSchedulerTracing) {
      prevInteractions = tracing.__interactionsRef.current;
      tracing.__interactionsRef.current = root.memoizedInteractions;
    } // Reset this to null before calling lifecycles

    ReactCurrentOwner$2.current = null; // The commit phase is broken into several sub-phases. We do a separate pass
    // of the effect list for each phase: all mutation effects come before all
    // layout effects, and so on.
    // The first phase a "before mutation" phase. We use this phase to read the
    // state of the host tree right before we mutate it. This is where
    // getSnapshotBeforeUpdate is called.

    startCommitSnapshotEffectsTimer();
    prepareForCommit(root.containerInfo);
    nextEffect = firstEffect;

    do {
      {
        try {
          commitBeforeMutationEffects();
        } catch (error) {
          (function() {
            if (!(nextEffect !== null)) {
              throw ReactError(Error("Should be working on an effect."));
            }
          })();

          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);

    stopCommitSnapshotEffectsTimer();

    if (enableProfilerTimer) {
      // Mark the current commit time to be shared by all Profilers in this
      // batch. This enables them to be grouped later.
      recordCommitTime();
    } // The next phase is the mutation phase, where we mutate the host tree.

    startCommitHostEffectsTimer();
    nextEffect = firstEffect;

    do {
      {
        try {
          commitMutationEffects(root, renderPriorityLevel);
        } catch (error) {
          (function() {
            if (!(nextEffect !== null)) {
              throw ReactError(Error("Should be working on an effect."));
            }
          })();

          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);

    stopCommitHostEffectsTimer();
    resetAfterCommit(root.containerInfo); // The work-in-progress tree is now the current tree. This must come after
    // the mutation phase, so that the previous tree is still current during
    // componentWillUnmount, but before the layout phase, so that the finished
    // work is current during componentDidMount/Update.

    root.current = finishedWork; // The next phase is the layout phase, where we call effects that read
    // the host tree after it's been mutated. The idiomatic use case for this is
    // layout, but class component lifecycles also fire here for legacy reasons.

    startCommitLifeCyclesTimer();
    nextEffect = firstEffect;

    do {
      {
        try {
          commitLayoutEffects(root, expirationTime);
        } catch (error) {
          (function() {
            if (!(nextEffect !== null)) {
              throw ReactError(Error("Should be working on an effect."));
            }
          })();

          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);

    stopCommitLifeCyclesTimer();
    nextEffect = null; // Tell Scheduler to yield at the end of the frame, so the browser has an
    // opportunity to paint.

    requestPaint();

    if (enableSchedulerTracing) {
      tracing.__interactionsRef.current = prevInteractions;
    }

    executionContext = prevExecutionContext;
  } else {
    // No effects.
    root.current = finishedWork; // Measure these anyway so the flamegraph explicitly shows that there were
    // no effects.
    // TODO: Maybe there's a better way to report this.

    startCommitSnapshotEffectsTimer();
    stopCommitSnapshotEffectsTimer();

    if (enableProfilerTimer) {
      recordCommitTime();
    }

    startCommitHostEffectsTimer();
    stopCommitHostEffectsTimer();
    startCommitLifeCyclesTimer();
    stopCommitLifeCyclesTimer();
  }

  stopCommitTimer();
  var rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects. Stash a reference to them. But don't
    // schedule a callback until after flushing layout work.
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsExpirationTime = expirationTime;
    pendingPassiveEffectsRenderPriority = renderPriorityLevel;
  } else {
    // We are done with the effect chain at this point so let's clear the
    // nextEffect pointers to assist with GC. If we have passive effects, we'll
    // clear this in flushPassiveEffects.
    nextEffect = firstEffect;

    while (nextEffect !== null) {
      var nextNextEffect = nextEffect.nextEffect;
      nextEffect.nextEffect = null;
      nextEffect = nextNextEffect;
    }
  } // Check if there's remaining work on this root

  var remainingExpirationTime = root.firstPendingTime;

  if (remainingExpirationTime !== NoWork) {
    var currentTime = requestCurrentTime();
    var priorityLevel = inferPriorityFromExpirationTime(
      currentTime,
      remainingExpirationTime
    );

    if (enableSchedulerTracing) {
      if (spawnedWorkDuringRender !== null) {
        var expirationTimes = spawnedWorkDuringRender;
        spawnedWorkDuringRender = null;

        for (var i = 0; i < expirationTimes.length; i++) {
          scheduleInteractions(
            root,
            expirationTimes[i],
            root.memoizedInteractions
          );
        }
      }
    }

    scheduleCallbackForRoot(root, priorityLevel, remainingExpirationTime);
  } else {
    // If there's no remaining work, we can clear the set of already failed
    // error boundaries.
    legacyErrorBoundariesThatAlreadyFailed = null;
  }

  if (enableSchedulerTracing) {
    if (!rootDidHavePassiveEffects) {
      // If there are no passive effects, then we can complete the pending interactions.
      // Otherwise, we'll wait until after the passive effects are flushed.
      // Wait to do this until after remaining work has been scheduled,
      // so that we don't prematurely signal complete for interactions when there's e.g. hidden work.
      finishPendingInteractions(root, expirationTime);
    }
  }

  onCommitRoot(finishedWork.stateNode, expirationTime);

  if (remainingExpirationTime === Sync) {
    // Count the number of times the root synchronously re-renders without
    // finishing. If there are too many, it indicates an infinite update loop.
    if (root === rootWithNestedUpdates) {
      nestedUpdateCount++;
    } else {
      nestedUpdateCount = 0;
      rootWithNestedUpdates = root;
    }
  } else {
    nestedUpdateCount = 0;
  }

  if (hasUncaughtError) {
    hasUncaughtError = false;
    var _error3 = firstUncaughtError;
    firstUncaughtError = null;
    throw _error3;
  }

  if ((executionContext & LegacyUnbatchedContext) !== NoContext) {
    // This is a legacy edge case. We just committed the initial mount of
    // a ReactDOM.render-ed root inside of batchedUpdates. The commit fired
    // synchronously, but layout updates should be deferred until the end
    // of the batch.
    return null;
  } // If layout work was scheduled, flush it now.

  flushSyncCallbackQueue();
  return null;
}

function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    if ((nextEffect.effectTag & Snapshot) !== NoEffect) {
      recordEffect();
      var current$$1 = nextEffect.alternate;
      commitBeforeMutationLifeCycles(current$$1, nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitMutationEffects(root, renderPriorityLevel) {
  // TODO: Should probably move the bulk of this function to commitWork.
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag;

    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    if (effectTag & Ref) {
      var current$$1 = nextEffect.alternate;

      if (current$$1 !== null) {
        commitDetachRef(current$$1);
      }
    } // The following switch statement is only concerned about placement,
    // updates, and deletions. To avoid needing to add a case for every possible
    // bitmap value, we remove the secondary effects from the effect tag and
    // switch on that value.

    var primaryEffectTag = effectTag & (Placement | Update | Deletion);

    switch (primaryEffectTag) {
      case Placement: {
        commitPlacement(nextEffect); // Clear the "placement" from effect tag so that we know that this is
        // inserted, before any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted does
        // and isMounted is deprecated anyway so we should be able to kill this.

        nextEffect.effectTag &= ~Placement;
        break;
      }

      case PlacementAndUpdate: {
        // Placement
        commitPlacement(nextEffect); // Clear the "placement" from effect tag so that we know that this is
        // inserted, before any life-cycles like componentDidMount gets called.

        nextEffect.effectTag &= ~Placement; // Update

        var _current = nextEffect.alternate;
        commitWork(_current, nextEffect);
        break;
      }

      case Update: {
        var _current2 = nextEffect.alternate;
        commitWork(_current2, nextEffect);
        break;
      }

      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    } // TODO: Only record a mutation effect if primaryEffectTag is non-zero.

    recordEffect();
    nextEffect = nextEffect.nextEffect;
  }
}

function commitLayoutEffects(root, committedExpirationTime) {
  // TODO: Should probably move the bulk of this function to commitWork.
  while (nextEffect !== null) {
    var effectTag = nextEffect.effectTag;

    if (effectTag & (Update | Callback)) {
      recordEffect();
      var current$$1 = nextEffect.alternate;
      commitLifeCycles(root, current$$1, nextEffect, committedExpirationTime);
    }

    if (effectTag & Ref) {
      recordEffect();
      commitAttachRef(nextEffect);
    }

    if (effectTag & Passive) {
      rootDoesHavePassiveEffects = true;
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function flushPassiveEffects() {
  if (rootWithPendingPassiveEffects === null) {
    return false;
  }

  var root = rootWithPendingPassiveEffects;
  var expirationTime = pendingPassiveEffectsExpirationTime;
  var renderPriorityLevel = pendingPassiveEffectsRenderPriority;
  rootWithPendingPassiveEffects = null;
  pendingPassiveEffectsExpirationTime = NoWork;
  pendingPassiveEffectsRenderPriority = NoPriority;
  var priorityLevel =
    renderPriorityLevel > NormalPriority ? NormalPriority : renderPriorityLevel;
  return runWithPriority(
    priorityLevel,
    flushPassiveEffectsImpl.bind(null, root, expirationTime)
  );
}

function flushPassiveEffectsImpl(root, expirationTime) {
  var prevInteractions = null;

  if (enableSchedulerTracing) {
    prevInteractions = tracing.__interactionsRef.current;
    tracing.__interactionsRef.current = root.memoizedInteractions;
  }

  (function() {
    if (!((executionContext & (RenderContext | CommitContext)) === NoContext)) {
      throw ReactError(
        Error("Cannot flush passive effects while already rendering.")
      );
    }
  })();

  var prevExecutionContext = executionContext;
  executionContext |= CommitContext; // Note: This currently assumes there are no passive effects on the root
  // fiber, because the root is not part of its own effect list. This could
  // change in the future.

  var effect = root.current.firstEffect;

  while (effect !== null) {
    {
      try {
        commitPassiveHookEffects(effect);
      } catch (error) {
        (function() {
          if (!(effect !== null)) {
            throw ReactError(Error("Should be working on an effect."));
          }
        })();

        captureCommitPhaseError(effect, error);
      }
    }

    var nextNextEffect = effect.nextEffect; // Remove nextEffect pointer to assist GC

    effect.nextEffect = null;
    effect = nextNextEffect;
  }

  if (enableSchedulerTracing) {
    tracing.__interactionsRef.current = prevInteractions;
    finishPendingInteractions(root, expirationTime);
  }

  executionContext = prevExecutionContext;
  flushSyncCallbackQueue(); // If additional passive effects were scheduled, increment a counter. If this
  // exceeds the limit, we'll fire a warning.

  return true;
}

function isAlreadyFailedLegacyErrorBoundary(instance) {
  return (
    legacyErrorBoundariesThatAlreadyFailed !== null &&
    legacyErrorBoundariesThatAlreadyFailed.has(instance)
  );
}
function markLegacyErrorBoundaryAsFailed(instance) {
  if (legacyErrorBoundariesThatAlreadyFailed === null) {
    legacyErrorBoundariesThatAlreadyFailed = new Set([instance]);
  } else {
    legacyErrorBoundariesThatAlreadyFailed.add(instance);
  }
}

function prepareToThrowUncaughtError(error) {
  if (!hasUncaughtError) {
    hasUncaughtError = true;
    firstUncaughtError = error;
  }
}

var onUncaughtError = prepareToThrowUncaughtError;

function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
  var errorInfo = createCapturedValue(error, sourceFiber);
  var update = createRootErrorUpdate(rootFiber, errorInfo, Sync);
  enqueueUpdate(rootFiber, update);
  var root = markUpdateTimeFromFiberToRoot(rootFiber, Sync);

  if (root !== null) {
    scheduleCallbackForRoot(root, ImmediatePriority, Sync);
  }
}

function captureCommitPhaseError(sourceFiber, error) {
  if (sourceFiber.tag === HostRoot) {
    // Error was thrown at the root. There is no parent, so the root
    // itself should capture it.
    captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    return;
  }

  var fiber = sourceFiber.return;

  while (fiber !== null) {
    if (fiber.tag === HostRoot) {
      captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
      return;
    } else if (fiber.tag === ClassComponent) {
      var ctor = fiber.type;
      var instance = fiber.stateNode;

      if (
        typeof ctor.getDerivedStateFromError === "function" ||
        (typeof instance.componentDidCatch === "function" &&
          !isAlreadyFailedLegacyErrorBoundary(instance))
      ) {
        var errorInfo = createCapturedValue(error, sourceFiber);
        var update = createClassErrorUpdate(
          fiber,
          errorInfo, // TODO: This is always sync
          Sync
        );
        enqueueUpdate(fiber, update);
        var root = markUpdateTimeFromFiberToRoot(fiber, Sync);

        if (root !== null) {
          scheduleCallbackForRoot(root, ImmediatePriority, Sync);
        }

        return;
      }
    }

    fiber = fiber.return;
  }
}
function pingSuspendedRoot(root, thenable, suspendedTime) {
  var pingCache = root.pingCache;

  if (pingCache !== null) {
    // The thenable resolved, so we no longer need to memoize, because it will
    // never be thrown again.
    pingCache.delete(thenable);
  }

  if (workInProgressRoot === root && renderExpirationTime === suspendedTime) {
    // Received a ping at the same priority level at which we're currently
    // rendering. We might want to restart this render. This should mirror
    // the logic of whether or not a root suspends once it completes.
    // TODO: If we're rendering sync either due to Sync, Batched or expired,
    // we should probably never restart.
    // If we're suspended with delay, we'll always suspend so we can always
    // restart. If we're suspended without any updates, it might be a retry.
    // If it's early in the retry we can restart. We can't know for sure
    // whether we'll eventually process an update during this render pass,
    // but it's somewhat unlikely that we get to a ping before that, since
    // getting to the root most update is usually very fast.
    if (
      workInProgressRootExitStatus === RootSuspendedWithDelay ||
      (workInProgressRootExitStatus === RootSuspended &&
        workInProgressRootLatestProcessedExpirationTime === Sync &&
        now() - globalMostRecentFallbackTime < FALLBACK_THROTTLE_MS)
    ) {
      // Restart from the root. Don't need to schedule a ping because
      // we're already working on this tree.
      prepareFreshStack(root, renderExpirationTime);
    } else {
      // Even though we can't restart right now, we might get an
      // opportunity later. So we mark this render as having a ping.
      workInProgressRootHasPendingPing = true;
    }

    return;
  }

  var lastPendingTime = root.lastPendingTime;

  if (lastPendingTime < suspendedTime) {
    // The root is no longer suspended at this time.
    return;
  }

  var pingTime = root.pingTime;

  if (pingTime !== NoWork && pingTime < suspendedTime) {
    // There's already a lower priority ping scheduled.
    return;
  } // Mark the time at which this ping was scheduled.

  root.pingTime = suspendedTime;

  if (root.finishedExpirationTime === suspendedTime) {
    // If there's a pending fallback waiting to commit, throw it away.
    root.finishedExpirationTime = NoWork;
    root.finishedWork = null;
  }

  var currentTime = requestCurrentTime();
  var priorityLevel = inferPriorityFromExpirationTime(
    currentTime,
    suspendedTime
  );
  scheduleCallbackForRoot(root, priorityLevel, suspendedTime);
}

function retryTimedOutBoundary(boundaryFiber, retryTime) {
  // The boundary fiber (a Suspense component or SuspenseList component)
  // previously was rendered in its fallback state. One of the promises that
  // suspended it has resolved, which means at least part of the tree was
  // likely unblocked. Try rendering again, at a new expiration time.
  var currentTime = requestCurrentTime();

  if (retryTime === Never) {
    var suspenseConfig = null; // Retries don't carry over the already committed update.

    retryTime = computeExpirationForFiber(
      currentTime,
      boundaryFiber,
      suspenseConfig
    );
  } // TODO: Special case idle priority?

  var priorityLevel = inferPriorityFromExpirationTime(currentTime, retryTime);
  var root = markUpdateTimeFromFiberToRoot(boundaryFiber, retryTime);

  if (root !== null) {
    scheduleCallbackForRoot(root, priorityLevel, retryTime);
  }
}

function retryDehydratedSuspenseBoundary(boundaryFiber) {
  var suspenseState = boundaryFiber.memoizedState;
  var retryTime = Never;

  if (suspenseState !== null) {
    retryTime = suspenseState.retryTime;
  }

  retryTimedOutBoundary(boundaryFiber, retryTime);
}
function resolveRetryThenable(boundaryFiber, thenable) {
  var retryTime = Never; // Default

  var retryCache;

  if (enableSuspenseServerRenderer) {
    switch (boundaryFiber.tag) {
      case SuspenseComponent:
        retryCache = boundaryFiber.stateNode;
        var suspenseState = boundaryFiber.memoizedState;

        if (suspenseState !== null) {
          retryTime = suspenseState.retryTime;
        }

        break;

      default:
        (function() {
          {
            throw ReactError(
              Error(
                "Pinged unknown suspense boundary type. This is probably a bug in React."
              )
            );
          }
        })();
    }
  } else {
    retryCache = boundaryFiber.stateNode;
  }

  if (retryCache !== null) {
    // The thenable resolved, so we no longer need to memoize, because it will
    // never be thrown again.
    retryCache.delete(thenable);
  }

  retryTimedOutBoundary(boundaryFiber, retryTime);
} // Computes the next Just Noticeable Difference (JND) boundary.
// The theory is that a person can't tell the difference between small differences in time.
// Therefore, if we wait a bit longer than necessary that won't translate to a noticeable
// difference in the experience. However, waiting for longer might mean that we can avoid
// showing an intermediate loading state. The longer we have already waited, the harder it
// is to tell small differences in time. Therefore, the longer we've already waited,
// the longer we can wait additionally. At some point we have to give up though.
// We pick a train model where the next boundary commits at a consistent schedule.
// These particular numbers are vague estimates. We expect to adjust them based on research.

function jnd(timeElapsed) {
  return timeElapsed < 120
    ? 120
    : timeElapsed < 480
      ? 480
      : timeElapsed < 1080
        ? 1080
        : timeElapsed < 1920
          ? 1920
          : timeElapsed < 3000
            ? 3000
            : timeElapsed < 4320
              ? 4320
              : ceil(timeElapsed / 1960) * 1960;
}

function computeMsUntilSuspenseLoadingDelay(
  mostRecentEventTime,
  committedExpirationTime,
  suspenseConfig
) {
  var busyMinDurationMs = suspenseConfig.busyMinDurationMs | 0;

  if (busyMinDurationMs <= 0) {
    return 0;
  }

  var busyDelayMs = suspenseConfig.busyDelayMs | 0; // Compute the time until this render pass would expire.

  var currentTimeMs = now();
  var eventTimeMs = inferTimeFromExpirationTimeWithSuspenseConfig(
    mostRecentEventTime,
    suspenseConfig
  );
  var timeElapsed = currentTimeMs - eventTimeMs;

  if (timeElapsed <= busyDelayMs) {
    // If we haven't yet waited longer than the initial delay, we don't
    // have to wait any additional time.
    return 0;
  }

  var msUntilTimeout = busyDelayMs + busyMinDurationMs - timeElapsed; // This is the value that is passed to `setTimeout`.

  return msUntilTimeout;
}

function checkForNestedUpdates() {
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    rootWithNestedUpdates = null;

    (function() {
      {
        throw ReactError(
          Error(
            "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops."
          )
        );
      }
    })();
  }
}

function stopFinishedWorkLoopTimer() {
  var didCompleteRoot = true;
  stopWorkLoopTimer(interruptedBy, didCompleteRoot);
  interruptedBy = null;
}

function stopInterruptedWorkLoopTimer() {
  // TODO: Track which fiber caused the interruption.
  var didCompleteRoot = false;
  stopWorkLoopTimer(interruptedBy, didCompleteRoot);
  interruptedBy = null;
}

function checkForInterruption(fiberThatReceivedUpdate, updateExpirationTime) {
  if (
    enableUserTimingAPI &&
    workInProgressRoot !== null &&
    updateExpirationTime > renderExpirationTime
  ) {
    interruptedBy = fiberThatReceivedUpdate;
  }
}

var beginWork$$1;

{
  beginWork$$1 = beginWork$1;
}

var IsThisRendererActing = {
  current: false
};

// In tests, we want to enforce a mocked scheduler.

// scheduler is the actual recommendation. The alternative could be a testing build,
// a new lib, or whatever; we dunno just yet. This message is for early adopters
// to get their tests right.

function computeThreadID(root, expirationTime) {
  // Interaction threads are unique per root and expiration time.
  return expirationTime * 1000 + root.interactionThreadID;
}

function markSpawnedWork(expirationTime) {
  if (!enableSchedulerTracing) {
    return;
  }

  if (spawnedWorkDuringRender === null) {
    spawnedWorkDuringRender = [expirationTime];
  } else {
    spawnedWorkDuringRender.push(expirationTime);
  }
}

function scheduleInteractions(root, expirationTime, interactions) {
  if (!enableSchedulerTracing) {
    return;
  }

  if (interactions.size > 0) {
    var pendingInteractionMap = root.pendingInteractionMap;
    var pendingInteractions = pendingInteractionMap.get(expirationTime);

    if (pendingInteractions != null) {
      interactions.forEach(function(interaction) {
        if (!pendingInteractions.has(interaction)) {
          // Update the pending async work count for previously unscheduled interaction.
          interaction.__count++;
        }

        pendingInteractions.add(interaction);
      });
    } else {
      pendingInteractionMap.set(expirationTime, new Set(interactions)); // Update the pending async work count for the current interactions.

      interactions.forEach(function(interaction) {
        interaction.__count++;
      });
    }

    var subscriber = tracing.__subscriberRef.current;

    if (subscriber !== null) {
      var threadID = computeThreadID(root, expirationTime);
      subscriber.onWorkScheduled(interactions, threadID);
    }
  }
}

function schedulePendingInteractions(root, expirationTime) {
  // This is called when work is scheduled on a root.
  // It associates the current interactions with the newly-scheduled expiration.
  // They will be restored when that expiration is later committed.
  if (!enableSchedulerTracing) {
    return;
  }

  scheduleInteractions(root, expirationTime, tracing.__interactionsRef.current);
}

function startWorkOnPendingInteractions(root, expirationTime) {
  // This is called when new work is started on a root.
  if (!enableSchedulerTracing) {
    return;
  } // Determine which interactions this batch of work currently includes, So that
  // we can accurately attribute time spent working on it, And so that cascading
  // work triggered during the render phase will be associated with it.

  var interactions = new Set();
  root.pendingInteractionMap.forEach(function(
    scheduledInteractions,
    scheduledExpirationTime
  ) {
    if (scheduledExpirationTime >= expirationTime) {
      scheduledInteractions.forEach(function(interaction) {
        return interactions.add(interaction);
      });
    }
  }); // Store the current set of interactions on the FiberRoot for a few reasons:
  // We can re-use it in hot functions like renderRoot() without having to
  // recalculate it. We will also use it in commitWork() to pass to any Profiler
  // onRender() hooks. This also provides DevTools with a way to access it when
  // the onCommitRoot() hook is called.

  root.memoizedInteractions = interactions;

  if (interactions.size > 0) {
    var subscriber = tracing.__subscriberRef.current;

    if (subscriber !== null) {
      var threadID = computeThreadID(root, expirationTime);

      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        // If the subscriber throws, rethrow it in a separate task
        scheduleCallback(ImmediatePriority, function() {
          throw error;
        });
      }
    }
  }
}

function finishPendingInteractions(root, committedExpirationTime) {
  if (!enableSchedulerTracing) {
    return;
  }

  var earliestRemainingTimeAfterCommit = root.firstPendingTime;
  var subscriber;

  try {
    subscriber = tracing.__subscriberRef.current;

    if (subscriber !== null && root.memoizedInteractions.size > 0) {
      var threadID = computeThreadID(root, committedExpirationTime);
      subscriber.onWorkStopped(root.memoizedInteractions, threadID);
    }
  } catch (error) {
    // If the subscriber throws, rethrow it in a separate task
    scheduleCallback(ImmediatePriority, function() {
      throw error;
    });
  } finally {
    // Clear completed interactions from the pending Map.
    // Unless the render was suspended or cascading work was scheduled,
    // In which case– leave pending interactions until the subsequent render.
    var pendingInteractionMap = root.pendingInteractionMap;
    pendingInteractionMap.forEach(function(
      scheduledInteractions,
      scheduledExpirationTime
    ) {
      // Only decrement the pending interaction count if we're done.
      // If there's still work at the current priority,
      // That indicates that we are waiting for suspense data.
      if (scheduledExpirationTime > earliestRemainingTimeAfterCommit) {
        pendingInteractionMap.delete(scheduledExpirationTime);
        scheduledInteractions.forEach(function(interaction) {
          interaction.__count--;

          if (subscriber !== null && interaction.__count === 0) {
            try {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            } catch (error) {
              // If the subscriber throws, rethrow it in a separate task
              scheduleCallback(ImmediatePriority, function() {
                throw error;
              });
            }
          }
        });
      }
    });
  }
}

var onCommitFiberRoot = null;
var onCommitFiberUnmount = null;
var isDevToolsPresent = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined";
function injectInternals(internals) {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined") {
    // No DevTools
    return false;
  }

  var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (hook.isDisabled) {
    // This isn't a real property on the hook, but it can be set to opt out
    // of DevTools integration and associated warnings and logs.
    // https://github.com/facebook/react/issues/3877
    return true;
  }

  if (!hook.supportsFiber) {
    return true;
  }

  try {
    var rendererID = hook.inject(internals); // We have successfully injected, so now it is safe to set up hooks.

    onCommitFiberRoot = function(root, expirationTime) {
      try {
        var didError = (root.current.effectTag & DidCapture) === DidCapture;

        if (enableProfilerTimer) {
          var currentTime = requestCurrentTime();
          var priorityLevel = inferPriorityFromExpirationTime(
            currentTime,
            expirationTime
          );
          hook.onCommitFiberRoot(rendererID, root, priorityLevel, didError);
        } else {
          hook.onCommitFiberRoot(rendererID, root, undefined, didError);
        }
      } catch (err) {}
    };

    onCommitFiberUnmount = function(fiber) {
      try {
        hook.onCommitFiberUnmount(rendererID, fiber);
      } catch (err) {}
    };
  } catch (err) {
    // Catch all errors because it is unsafe to throw during initialization.
  } // DevTools exists

  return true;
}
function onCommitRoot(root, expirationTime) {
  if (typeof onCommitFiberRoot === "function") {
    onCommitFiberRoot(root, expirationTime);
  }
}
function onCommitUnmount(fiber) {
  if (typeof onCommitFiberUnmount === "function") {
    onCommitFiberUnmount(fiber);
  }
}

var debugCounter = 1;

function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.effectTag = NoEffect;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;
  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;
  this.alternate = null;

  if (enableProfilerTimer) {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN; // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).

    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  } // This is normally DEV-only except www when it adds listeners.
  // TODO: remove the User Timing integration in favor of Root Events.

  if (enableUserTimingAPI) {
    this._debugID = debugCounter++;
    this._debugIsCurrentlyTiming = false;
  }
} // This is a constructor function, rather than a POJO constructor, still
// please ensure we do the following:
// 1) Nobody should add any instance methods on this. Instance methods can be
//    more difficult to predict when they get optimized and they are almost
//    never inlined properly in static compilers.
// 2) Nobody should rely on `instanceof Fiber` for type testing. We should
//    always know when it is a fiber.
// 3) We might want to experiment with using numeric keys since they are easier
//    to optimize in a non-JIT environment.
// 4) We can easily go from a constructor to a createFiber object literal if that
//    is faster.
// 5) It should be easy to port this to a C struct and keep a C implementation
//    compatible.

var createFiber = function(tag, pendingProps, key, mode) {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function isSimpleFunctionComponent(type) {
  return (
    typeof type === "function" &&
    !shouldConstruct(type) &&
    type.defaultProps === undefined
  );
}
function resolveLazyComponentTag(Component) {
  if (typeof Component === "function") {
    return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
  } else if (Component !== undefined && Component !== null) {
    var $$typeof = Component.$$typeof;

    if ($$typeof === REACT_FORWARD_REF_TYPE) {
      return ForwardRef;
    }

    if ($$typeof === REACT_MEMO_TYPE) {
      return MemoComponent;
    }
  }

  return IndeterminateComponent;
} // This is used to create an alternate fiber to do work on.

function createWorkInProgress(current, pendingProps, expirationTime) {
  var workInProgress = current.alternate;

  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps; // We already have an alternate.
    // Reset the effect tag.

    workInProgress.effectTag = NoEffect; // The effect list is no longer valid.

    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;

    if (enableProfilerTimer) {
      // We intentionally reset, rather than copy, actualDuration & actualStartTime.
      // This prevents time from endlessly accumulating in new commits.
      // This has the downside of resetting values for different priority renders,
      // But works for yielding (the common case) and should support resuming.
      workInProgress.actualDuration = 0;
      workInProgress.actualStartTime = -1;
    }
  }

  workInProgress.childExpirationTime = current.childExpirationTime;
  workInProgress.expirationTime = current.expirationTime;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue; // Clone the dependencies object. This is mutated during the render phase, so
  // it cannot be shared with the current fiber.

  var currentDependencies = current.dependencies;
  workInProgress.dependencies =
    currentDependencies === null
      ? null
      : {
          expirationTime: currentDependencies.expirationTime,
          firstContext: currentDependencies.firstContext,
          responders: currentDependencies.responders
        }; // These will be overridden during the parent's reconciliation

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  if (enableProfilerTimer) {
    workInProgress.selfBaseDuration = current.selfBaseDuration;
    workInProgress.treeBaseDuration = current.treeBaseDuration;
  }

  return workInProgress;
} // Used to reuse a Fiber for a second pass.

function resetWorkInProgress(workInProgress, renderExpirationTime) {
  // This resets the Fiber to what createFiber or createWorkInProgress would
  // have set the values to before during the first pass. Ideally this wouldn't
  // be necessary but unfortunately many code paths reads from the workInProgress
  // when they should be reading from current and writing to workInProgress.
  // We assume pendingProps, index, key, ref, return are still untouched to
  // avoid doing another reconciliation.
  // Reset the effect tag but keep any Placement tags, since that's something
  // that child fiber is setting, not the reconciliation.
  workInProgress.effectTag &= Placement; // The effect list is no longer valid.

  workInProgress.nextEffect = null;
  workInProgress.firstEffect = null;
  workInProgress.lastEffect = null;
  var current = workInProgress.alternate;

  if (current === null) {
    // Reset to createFiber's initial values.
    workInProgress.childExpirationTime = NoWork;
    workInProgress.expirationTime = renderExpirationTime;
    workInProgress.child = null;
    workInProgress.memoizedProps = null;
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;
    workInProgress.dependencies = null;

    if (enableProfilerTimer) {
      // Note: We don't reset the actualTime counts. It's useful to accumulate
      // actual time across multiple render passes.
      workInProgress.selfBaseDuration = 0;
      workInProgress.treeBaseDuration = 0;
    }
  } else {
    // Reset to the cloned values that createWorkInProgress would've.
    workInProgress.childExpirationTime = current.childExpirationTime;
    workInProgress.expirationTime = current.expirationTime;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue; // Clone the dependencies object. This is mutated during the render phase, so
    // it cannot be shared with the current fiber.

    var currentDependencies = current.dependencies;
    workInProgress.dependencies =
      currentDependencies === null
        ? null
        : {
            expirationTime: currentDependencies.expirationTime,
            firstContext: currentDependencies.firstContext,
            responders: currentDependencies.responders
          };

    if (enableProfilerTimer) {
      // Note: We don't reset the actualTime counts. It's useful to accumulate
      // actual time across multiple render passes.
      workInProgress.selfBaseDuration = current.selfBaseDuration;
      workInProgress.treeBaseDuration = current.treeBaseDuration;
    }
  }

  return workInProgress;
}
function createHostRootFiber(tag) {
  var mode;

  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode | BatchedMode | StrictMode;
  } else if (tag === BatchedRoot) {
    mode = BatchedMode | StrictMode;
  } else {
    mode = NoMode;
  }

  if (enableProfilerTimer && isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}
function createFiberFromTypeAndProps(
  type, // React$ElementType
  key,
  pendingProps,
  owner,
  mode,
  expirationTime
) {
  var fiber;
  var fiberTag = IndeterminateComponent; // The resolved type is set if we know what the final type will be. I.e. it's not lazy.

  var resolvedType = type;

  if (typeof type === "function") {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent;
    } else {
    }
  } else if (typeof type === "string") {
    fiberTag = HostComponent;
  } else {
    getTag: switch (type) {
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(
          pendingProps.children,
          mode,
          expirationTime,
          key
        );

      case REACT_CONCURRENT_MODE_TYPE:
        fiberTag = Mode;
        mode |= ConcurrentMode | BatchedMode | StrictMode;
        break;

      case REACT_STRICT_MODE_TYPE:
        fiberTag = Mode;
        mode |= StrictMode;
        break;

      case REACT_PROFILER_TYPE:
        return createFiberFromProfiler(pendingProps, mode, expirationTime, key);

      case REACT_SUSPENSE_TYPE:
        return createFiberFromSuspense(pendingProps, mode, expirationTime, key);

      case REACT_SUSPENSE_LIST_TYPE:
        return createFiberFromSuspenseList(
          pendingProps,
          mode,
          expirationTime,
          key
        );

      default: {
        if (typeof type === "object" && type !== null) {
          switch (type.$$typeof) {
            case REACT_PROVIDER_TYPE:
              fiberTag = ContextProvider;
              break getTag;

            case REACT_CONTEXT_TYPE:
              // This is a consumer
              fiberTag = ContextConsumer;
              break getTag;

            case REACT_FORWARD_REF_TYPE:
              fiberTag = ForwardRef;

              break getTag;

            case REACT_MEMO_TYPE:
              fiberTag = MemoComponent;
              break getTag;

            case REACT_LAZY_TYPE:
              fiberTag = LazyComponent;
              resolvedType = null;
              break getTag;

            case REACT_FUNDAMENTAL_TYPE:
              if (enableFundamentalAPI) {
                return createFiberFromFundamental(
                  type,
                  pendingProps,
                  mode,
                  expirationTime,
                  key
                );
              }

              break;
          }
        }

        var info = "";

        (function() {
          {
            throw ReactError(
              Error(
                "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " +
                  (type == null ? type : typeof type) +
                  "." +
                  info
              )
            );
          }
        })();
      }
    }
  }

  fiber = createFiber(fiberTag, pendingProps, key, mode);
  fiber.elementType = type;
  fiber.type = resolvedType;
  fiber.expirationTime = expirationTime;
  return fiber;
}
function createFiberFromElement(element, mode, expirationTime) {
  var owner = null;

  var type = element.type;
  var key = element.key;
  var pendingProps = element.props;
  var fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
    expirationTime
  );

  return fiber;
}
function createFiberFromFragment(elements, mode, expirationTime, key) {
  var fiber = createFiber(Fragment, elements, key, mode);
  fiber.expirationTime = expirationTime;
  return fiber;
}
function createFiberFromFundamental(
  fundamentalComponent,
  pendingProps,
  mode,
  expirationTime,
  key
) {
  var fiber = createFiber(FundamentalComponent, pendingProps, key, mode);
  fiber.elementType = fundamentalComponent;
  fiber.type = fundamentalComponent;
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberFromProfiler(pendingProps, mode, expirationTime, key) {
  var fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode); // TODO: The Profiler fiber shouldn't have a type. It has a tag.

  fiber.elementType = REACT_PROFILER_TYPE;
  fiber.type = REACT_PROFILER_TYPE;
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberFromSuspense(pendingProps, mode, expirationTime, key) {
  var fiber = createFiber(SuspenseComponent, pendingProps, key, mode); // TODO: The SuspenseComponent fiber shouldn't have a type. It has a tag.
  // This needs to be fixed in getComponentName so that it relies on the tag
  // instead.

  fiber.type = REACT_SUSPENSE_TYPE;
  fiber.elementType = REACT_SUSPENSE_TYPE;
  fiber.expirationTime = expirationTime;
  return fiber;
}
function createFiberFromSuspenseList(pendingProps, mode, expirationTime, key) {
  var fiber = createFiber(SuspenseListComponent, pendingProps, key, mode);

  fiber.elementType = REACT_SUSPENSE_LIST_TYPE;
  fiber.expirationTime = expirationTime;
  return fiber;
}
function createFiberFromText(content, mode, expirationTime) {
  var fiber = createFiber(HostText, content, null, mode);
  fiber.expirationTime = expirationTime;
  return fiber;
}
function createFiberFromHostInstanceForDeletion() {
  var fiber = createFiber(HostComponent, null, null, NoMode); // TODO: These should not need a type.

  fiber.elementType = "DELETED";
  fiber.type = "DELETED";
  return fiber;
}
function createFiberFromDehydratedFragment(dehydratedNode) {
  var fiber = createFiber(DehydratedFragment, null, null, NoMode);
  fiber.stateNode = dehydratedNode;
  return fiber;
}
function createFiberFromPortal(portal, mode, expirationTime) {
  var pendingProps = portal.children !== null ? portal.children : [];
  var fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
  fiber.expirationTime = expirationTime;
  fiber.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null,
    // Used by persistent updates
    implementation: portal.implementation
  };
  return fiber;
} // Used for stashing WIP properties to replay failed work in DEV.

function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.current = null;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.pingCache = null;
  this.finishedExpirationTime = NoWork;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.firstBatch = null;
  this.callbackNode = null;
  this.callbackExpirationTime = NoWork;
  this.firstPendingTime = NoWork;
  this.lastPendingTime = NoWork;
  this.pingTime = NoWork;

  if (enableSchedulerTracing) {
    this.interactionThreadID = tracing.unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }

  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }
}

function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  var root = new FiberRootNode(containerInfo, tag, hydrate);

  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  } // Cyclic construction. This cheats the type system right now because
  // stateNode is any.

  var uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  return root;
}

// This lets us hook into Fiber to debug what it's doing.
// See https://github.com/facebook/react/pull/8033.
// This is not part of the public API, not even for React DevTools.
// You may only inject a debugTool if you work on React Fiber itself.

function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyContextObject;
  }

  var fiber = get(parentComponent);
  var parentContext = findCurrentUnmaskedContext(fiber);

  if (fiber.tag === ClassComponent) {
    var Component = fiber.type;

    if (isContextProvider(Component)) {
      return processChildContext(fiber, Component, parentContext);
    }
  }

  return parentContext;
}

function scheduleRootUpdate(
  current$$1,
  element,
  expirationTime,
  suspenseConfig,
  callback
) {
  var update = createUpdate(expirationTime, suspenseConfig); // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: element
  };
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    update.callback = callback;
  }

  enqueueUpdate(current$$1, update);
  scheduleWork(current$$1, expirationTime);
  return expirationTime;
}

function updateContainerAtExpirationTime(
  element,
  container,
  parentComponent,
  expirationTime,
  suspenseConfig,
  callback
) {
  // TODO: If this is a nested container, this won't be the root.
  var current$$1 = container.current;

  var context = getContextForSubtree(parentComponent);

  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  return scheduleRootUpdate(
    current$$1,
    element,
    expirationTime,
    suspenseConfig,
    callback
  );
}

function findHostInstance(component) {
  var fiber = get(component);

  if (fiber === undefined) {
    if (typeof component.render === "function") {
      (function() {
        {
          throw ReactError(
            Error("Unable to find node on an unmounted component.")
          );
        }
      })();
    } else {
      (function() {
        {
          throw ReactError(
            Error(
              "Argument appears to not be a ReactComponent. Keys: " +
                Object.keys(component)
            )
          );
        }
      })();
    }
  }

  var hostFiber = findCurrentHostFiber(fiber);

  if (hostFiber === null) {
    return null;
  }

  return hostFiber.stateNode;
}

function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}
function updateContainer(element, container, parentComponent, callback) {
  var current$$1 = container.current;
  var currentTime = requestCurrentTime();

  var suspenseConfig = requestCurrentSuspenseConfig();
  var expirationTime = computeExpirationForFiber(
    currentTime,
    current$$1,
    suspenseConfig
  );
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    suspenseConfig,
    callback
  );
}
function getPublicRootInstance(container) {
  var containerFiber = container.current;

  if (!containerFiber.child) {
    return null;
  }

  switch (containerFiber.child.tag) {
    case HostComponent:
      return getPublicInstance(containerFiber.child.stateNode);

    default:
      return containerFiber.child.stateNode;
  }
}

var overrideHookState = null;
var overrideProps = null;
var scheduleUpdate = null;
var setSuspenseHandler = null;

function injectIntoDevTools(devToolsConfig) {
  var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
  var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
  return injectInternals(
    Object.assign({}, devToolsConfig, {
      overrideHookState: overrideHookState,
      overrideProps: overrideProps,
      setSuspenseHandler: setSuspenseHandler,
      scheduleUpdate: scheduleUpdate,
      currentDispatcherRef: ReactCurrentDispatcher,
      findHostInstanceByFiber: function(fiber) {
        var hostFiber = findCurrentHostFiber(fiber);

        if (hostFiber === null) {
          return null;
        }

        return hostFiber.stateNode;
      },
      findFiberByHostInstance: function(instance) {
        if (!findFiberByHostInstance) {
          // Might not be implemented by the renderer.
          return null;
        }

        return findFiberByHostInstance(instance);
      },
      // React Refresh
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      // Enables DevTools to append owner stacks to error messages in DEV mode.
      getCurrentFiber: null
    })
  );
}

// This file intentionally does *not* have the Flow annotation.
// Don't add it. See `./inline-typed.js` for an explanation.

function createPortal(
  children,
  containerInfo, // TODO: figure out the API for cross-renderer implementation.
  implementation
) {
  var key =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return {
    // This tag allow us to uniquely identify this as a React Portal
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : "" + key,
    children: children,
    containerInfo: containerInfo,
    implementation: implementation
  };
}

// TODO: this is special because it gets imported during build.

var ReactVersion = "16.8.6";

var NativeMethodsMixin = function(findNodeHandle, findHostInstance) {
  /**
   * `NativeMethodsMixin` provides methods to access the underlying native
   * component directly. This can be useful in cases when you want to focus
   * a view or measure its on-screen dimensions, for example.
   *
   * The methods described here are available on most of the default components
   * provided by React Native. Note, however, that they are *not* available on
   * composite components that aren't directly backed by a native view. This will
   * generally include most components that you define in your own app. For more
   * information, see [Direct
   * Manipulation](docs/direct-manipulation.html).
   *
   * Note the Flow $Exact<> syntax is required to support mixins.
   * React createClass mixins can only be used with exact types.
   */
  var NativeMethodsMixin = {
    /**
     * Determines the location on screen, width, and height of the given view and
     * returns the values via an async callback. If successful, the callback will
     * be called with the following arguments:
     *
     *  - x
     *  - y
     *  - width
     *  - height
     *  - pageX
     *  - pageY
     *
     * Note that these measurements are not available until after the rendering
     * has been completed in native. If you need the measurements as soon as
     * possible, consider using the [`onLayout`
     * prop](docs/view.html#onlayout) instead.
     */
    measure: function(callback) {
      var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
      // Tests using ReactTestRenderer will trigger this case indirectly.
      // Mimicking stack behavior, we should silently ignore this case.
      // TODO Fix ReactTestRenderer so we can remove this try/catch.

      try {
        maybeInstance = findHostInstance(this);
      } catch (error) {} // If there is no host component beneath this we should fail silently.
      // This is not an error; it could mean a class component rendered null.

      if (maybeInstance == null) {
        return;
      }

      if (maybeInstance.canonical) {
        // We can't call FabricUIManager here because it won't be loaded in paper
        // at initialization time. See https://github.com/facebook/react/pull/15490
        // for more info.
        nativeFabricUIManager.measure(
          maybeInstance.node,
          mountSafeCallback_NOT_REALLY_SAFE(this, callback)
        );
      } else {
        ReactNativePrivateInterface.UIManager.measure(
          findNodeHandle(this),
          mountSafeCallback_NOT_REALLY_SAFE(this, callback)
        );
      }
    },

    /**
     * Determines the location of the given view in the window and returns the
     * values via an async callback. If the React root view is embedded in
     * another native view, this will give you the absolute coordinates. If
     * successful, the callback will be called with the following
     * arguments:
     *
     *  - x
     *  - y
     *  - width
     *  - height
     *
     * Note that these measurements are not available until after the rendering
     * has been completed in native.
     */
    measureInWindow: function(callback) {
      var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
      // Tests using ReactTestRenderer will trigger this case indirectly.
      // Mimicking stack behavior, we should silently ignore this case.
      // TODO Fix ReactTestRenderer so we can remove this try/catch.

      try {
        maybeInstance = findHostInstance(this);
      } catch (error) {} // If there is no host component beneath this we should fail silently.
      // This is not an error; it could mean a class component rendered null.

      if (maybeInstance == null) {
        return;
      }

      if (maybeInstance.canonical) {
        // We can't call FabricUIManager here because it won't be loaded in paper
        // at initialization time. See https://github.com/facebook/react/pull/15490
        // for more info.
        nativeFabricUIManager.measureInWindow(
          maybeInstance.node,
          mountSafeCallback_NOT_REALLY_SAFE(this, callback)
        );
      } else {
        ReactNativePrivateInterface.UIManager.measureInWindow(
          findNodeHandle(this),
          mountSafeCallback_NOT_REALLY_SAFE(this, callback)
        );
      }
    },

    /**
     * Like [`measure()`](#measure), but measures the view relative an ancestor,
     * specified as `relativeToNativeNode`. This means that the returned x, y
     * are relative to the origin x, y of the ancestor view.
     *
     * As always, to obtain a native node handle for a component, you can use
     * `findNodeHandle(component)`.
     */
    measureLayout: function(
      relativeToNativeNode,
      onSuccess,
      onFail
    ) /* currently unused */
    {
      var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
      // Tests using ReactTestRenderer will trigger this case indirectly.
      // Mimicking stack behavior, we should silently ignore this case.
      // TODO Fix ReactTestRenderer so we can remove this try/catch.

      try {
        maybeInstance = findHostInstance(this);
      } catch (error) {} // If there is no host component beneath this we should fail silently.
      // This is not an error; it could mean a class component rendered null.

      if (maybeInstance == null) {
        return;
      }

      if (maybeInstance.canonical) {
        return;
      } else {
        var relativeNode;

        if (typeof relativeToNativeNode === "number") {
          // Already a node handle
          relativeNode = relativeToNativeNode;
        } else if (relativeToNativeNode._nativeTag) {
          relativeNode = relativeToNativeNode._nativeTag;
        }

        if (relativeNode == null) {
          return;
        }

        ReactNativePrivateInterface.UIManager.measureLayout(
          findNodeHandle(this),
          relativeNode,
          mountSafeCallback_NOT_REALLY_SAFE(this, onFail),
          mountSafeCallback_NOT_REALLY_SAFE(this, onSuccess)
        );
      }
    },

    /**
     * This function sends props straight to native. They will not participate in
     * future diff process - this means that if you do not include them in the
     * next render, they will remain active (see [Direct
     * Manipulation](docs/direct-manipulation.html)).
     */
    setNativeProps: function(nativeProps) {
      // Class components don't have viewConfig -> validateAttributes.
      // Nor does it make sense to set native props on a non-native component.
      // Instead, find the nearest host component and set props on it.
      // Use findNodeHandle() rather than findNodeHandle() because
      // We want the instance/wrapper (not the native tag).
      var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
      // Tests using ReactTestRenderer will trigger this case indirectly.
      // Mimicking stack behavior, we should silently ignore this case.
      // TODO Fix ReactTestRenderer so we can remove this try/catch.

      try {
        maybeInstance = findHostInstance(this);
      } catch (error) {} // If there is no host component beneath this we should fail silently.
      // This is not an error; it could mean a class component rendered null.

      if (maybeInstance == null) {
        return;
      }

      if (maybeInstance.canonical) {
        return;
      }

      var nativeTag =
        maybeInstance._nativeTag || maybeInstance.canonical._nativeTag;
      var viewConfig =
        maybeInstance.viewConfig || maybeInstance.canonical.viewConfig;

      var updatePayload = create(nativeProps, viewConfig.validAttributes); // Avoid the overhead of bridge calls if there's no update.
      // This is an expensive no-op for Android, and causes an unnecessary
      // view invalidation for certain components (eg RCTTextInput) on iOS.

      if (updatePayload != null) {
        ReactNativePrivateInterface.UIManager.updateView(
          nativeTag,
          viewConfig.uiViewClassName,
          updatePayload
        );
      }
    },

    /**
     * Requests focus for the given input or view. The exact behavior triggered
     * will depend on the platform and type of view.
     */
    focus: function() {
      ReactNativePrivateInterface.TextInputState.focusTextInput(
        findNodeHandle(this)
      );
    },

    /**
     * Removes focus from an input or view. This is the opposite of `focus()`.
     */
    blur: function() {
      ReactNativePrivateInterface.TextInputState.blurTextInput(
        findNodeHandle(this)
      );
    }
  };

  return NativeMethodsMixin;
};

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var ReactNativeComponent = function(findNodeHandle, findHostInstance) {
  /**
   * Superclass that provides methods to access the underlying native component.
   * This can be useful when you want to focus a view or measure its dimensions.
   *
   * Methods implemented by this class are available on most default components
   * provided by React Native. However, they are *not* available on composite
   * components that are not directly backed by a native view. For more
   * information, see [Direct Manipulation](docs/direct-manipulation.html).
   *
   * @abstract
   */
  var ReactNativeComponent =
    /*#__PURE__*/
    (function(_React$Component) {
      _inheritsLoose(ReactNativeComponent, _React$Component);

      function ReactNativeComponent() {
        return _React$Component.apply(this, arguments) || this;
      }

      var _proto = ReactNativeComponent.prototype;

      /**
       * Due to bugs in Flow's handling of React.createClass, some fields already
       * declared in the base class need to be redeclared below.
       */

      /**
       * Removes focus. This is the opposite of `focus()`.
       */
      _proto.blur = function blur() {
        ReactNativePrivateInterface.TextInputState.blurTextInput(
          findNodeHandle(this)
        );
      };
      /**
       * Requests focus. The exact behavior depends on the platform and view.
       */

      _proto.focus = function focus() {
        ReactNativePrivateInterface.TextInputState.focusTextInput(
          findNodeHandle(this)
        );
      };
      /**
       * Measures the on-screen location and dimensions. If successful, the callback
       * will be called asynchronously with the following arguments:
       *
       *  - x
       *  - y
       *  - width
       *  - height
       *  - pageX
       *  - pageY
       *
       * These values are not available until after natives rendering completes. If
       * you need the measurements as soon as possible, consider using the
       * [`onLayout` prop](docs/view.html#onlayout) instead.
       */

      _proto.measure = function measure(callback) {
        var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
        // Tests using ReactTestRenderer will trigger this case indirectly.
        // Mimicking stack behavior, we should silently ignore this case.
        // TODO Fix ReactTestRenderer so we can remove this try/catch.

        try {
          maybeInstance = findHostInstance(this);
        } catch (error) {} // If there is no host component beneath this we should fail silently.
        // This is not an error; it could mean a class component rendered null.

        if (maybeInstance == null) {
          return;
        }

        if (maybeInstance.canonical) {
          // We can't call FabricUIManager here because it won't be loaded in paper
          // at initialization time. See https://github.com/facebook/react/pull/15490
          // for more info.
          nativeFabricUIManager.measure(
            maybeInstance.node,
            mountSafeCallback_NOT_REALLY_SAFE(this, callback)
          );
        } else {
          ReactNativePrivateInterface.UIManager.measure(
            findNodeHandle(this),
            mountSafeCallback_NOT_REALLY_SAFE(this, callback)
          );
        }
      };
      /**
       * Measures the on-screen location and dimensions. Even if the React Native
       * root view is embedded within another native view, this method will give you
       * the absolute coordinates measured from the window. If successful, the
       * callback will be called asynchronously with the following arguments:
       *
       *  - x
       *  - y
       *  - width
       *  - height
       *
       * These values are not available until after natives rendering completes.
       */

      _proto.measureInWindow = function measureInWindow(callback) {
        var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
        // Tests using ReactTestRenderer will trigger this case indirectly.
        // Mimicking stack behavior, we should silently ignore this case.
        // TODO Fix ReactTestRenderer so we can remove this try/catch.

        try {
          maybeInstance = findHostInstance(this);
        } catch (error) {} // If there is no host component beneath this we should fail silently.
        // This is not an error; it could mean a class component rendered null.

        if (maybeInstance == null) {
          return;
        }

        if (maybeInstance.canonical) {
          // We can't call FabricUIManager here because it won't be loaded in paper
          // at initialization time. See https://github.com/facebook/react/pull/15490
          // for more info.
          nativeFabricUIManager.measureInWindow(
            maybeInstance.node,
            mountSafeCallback_NOT_REALLY_SAFE(this, callback)
          );
        } else {
          ReactNativePrivateInterface.UIManager.measureInWindow(
            findNodeHandle(this),
            mountSafeCallback_NOT_REALLY_SAFE(this, callback)
          );
        }
      };
      /**
       * Similar to [`measure()`](#measure), but the resulting location will be
       * relative to the supplied ancestor's location.
       *
       * Obtain a native node handle with `ReactNative.findNodeHandle(component)`.
       */

      _proto.measureLayout = function measureLayout(
        relativeToNativeNode,
        onSuccess,
        onFail
      ) {
        var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
        // Tests using ReactTestRenderer will trigger this case indirectly.
        // Mimicking stack behavior, we should silently ignore this case.
        // TODO Fix ReactTestRenderer so we can remove this try/catch.

        try {
          maybeInstance = findHostInstance(this);
        } catch (error) {} // If there is no host component beneath this we should fail silently.
        // This is not an error; it could mean a class component rendered null.

        if (maybeInstance == null) {
          return;
        }

        if (maybeInstance.canonical) {
          return;
        } else {
          var relativeNode;

          if (typeof relativeToNativeNode === "number") {
            // Already a node handle
            relativeNode = relativeToNativeNode;
          } else if (relativeToNativeNode._nativeTag) {
            relativeNode = relativeToNativeNode._nativeTag;
          }

          if (relativeNode == null) {
            return;
          }

          ReactNativePrivateInterface.UIManager.measureLayout(
            findNodeHandle(this),
            relativeNode,
            mountSafeCallback_NOT_REALLY_SAFE(this, onFail),
            mountSafeCallback_NOT_REALLY_SAFE(this, onSuccess)
          );
        }
      };
      /**
       * This function sends props straight to native. They will not participate in
       * future diff process - this means that if you do not include them in the
       * next render, they will remain active (see [Direct
       * Manipulation](docs/direct-manipulation.html)).
       */

      _proto.setNativeProps = function setNativeProps(nativeProps) {
        // Class components don't have viewConfig -> validateAttributes.
        // Nor does it make sense to set native props on a non-native component.
        // Instead, find the nearest host component and set props on it.
        // Use findNodeHandle() rather than ReactNative.findNodeHandle() because
        // We want the instance/wrapper (not the native tag).
        var maybeInstance; // Fiber errors if findNodeHandle is called for an umounted component.
        // Tests using ReactTestRenderer will trigger this case indirectly.
        // Mimicking stack behavior, we should silently ignore this case.
        // TODO Fix ReactTestRenderer so we can remove this try/catch.

        try {
          maybeInstance = findHostInstance(this);
        } catch (error) {} // If there is no host component beneath this we should fail silently.
        // This is not an error; it could mean a class component rendered null.

        if (maybeInstance == null) {
          return;
        }

        if (maybeInstance.canonical) {
          return;
        }

        var nativeTag =
          maybeInstance._nativeTag || maybeInstance.canonical._nativeTag;
        var viewConfig =
          maybeInstance.viewConfig || maybeInstance.canonical.viewConfig;
        var updatePayload = create(nativeProps, viewConfig.validAttributes); // Avoid the overhead of bridge calls if there's no update.
        // This is an expensive no-op for Android, and causes an unnecessary
        // view invalidation for certain components (eg RCTTextInput) on iOS.

        if (updatePayload != null) {
          ReactNativePrivateInterface.UIManager.updateView(
            nativeTag,
            viewConfig.uiViewClassName,
            updatePayload
          );
        }
      };

      return ReactNativeComponent;
    })(React.Component); // eslint-disable-next-line no-unused-expressions

  return ReactNativeComponent;
};

var getInspectorDataForViewTag;

{
  getInspectorDataForViewTag = function() {
    (function() {
      {
        throw ReactError(
          Error("getInspectorDataForViewTag() is not available in production")
        );
      }
    })();
  };
}

function setNativeProps(handle, nativeProps) {
  if (handle._nativeTag == null) {
    return;
  }

  var updatePayload = create(nativeProps, handle.viewConfig.validAttributes); // Avoid the overhead of bridge calls if there's no update.
  // This is an expensive no-op for Android, and causes an unnecessary
  // view invalidation for certain components (eg RCTTextInput) on iOS.

  if (updatePayload != null) {
    ReactNativePrivateInterface.UIManager.updateView(
      handle._nativeTag,
      handle.viewConfig.uiViewClassName,
      updatePayload
    );
  }
}

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;

function findNodeHandle(componentOrHandle) {
  if (componentOrHandle == null) {
    return null;
  }

  if (typeof componentOrHandle === "number") {
    // Already a node handle
    return componentOrHandle;
  }

  if (componentOrHandle._nativeTag) {
    return componentOrHandle._nativeTag;
  }

  if (componentOrHandle.canonical && componentOrHandle.canonical._nativeTag) {
    return componentOrHandle.canonical._nativeTag;
  }

  var hostInstance;

  {
    hostInstance = findHostInstance(componentOrHandle);
  }

  if (hostInstance == null) {
    return hostInstance;
  }

  if (hostInstance.canonical) {
    // Fabric
    return hostInstance.canonical._nativeTag;
  }

  return hostInstance._nativeTag;
}

setBatchingImplementation(
  batchedUpdates$1,
  discreteUpdates$1,
  flushDiscreteUpdates,
  batchedEventUpdates$1
);

function computeComponentStackForErrorReporting(reactTag) {
  var fiber = getInstanceFromTag(reactTag);

  if (!fiber) {
    return "";
  }

  return getStackByFiberInDevAndProd(fiber);
}

var roots = new Map();
var ReactNativeRenderer = {
  NativeComponent: ReactNativeComponent(findNodeHandle, findHostInstance),
  findNodeHandle: findNodeHandle,
  dispatchCommand: function(handle, command, args) {
    if (handle._nativeTag == null) {
      return;
    }

    ReactNativePrivateInterface.UIManager.dispatchViewManagerCommand(
      handle._nativeTag,
      command,
      args
    );
  },
  setNativeProps: setNativeProps,
  render: function(element, containerTag, callback) {
    var root = roots.get(containerTag);

    if (!root) {
      // TODO (bvaughn): If we decide to keep the wrapper component,
      // We could create a wrapper for containerTag as well to reduce special casing.
      root = createContainer(containerTag, LegacyRoot, false, null);
      roots.set(containerTag, root);
    }

    updateContainer(element, root, null, callback);
    return getPublicRootInstance(root);
  },
  unmountComponentAtNode: function(containerTag) {
    var root = roots.get(containerTag);

    if (root) {
      // TODO: Is it safe to reset this now or should I wait since this unmount could be deferred?
      updateContainer(null, root, null, function() {
        roots.delete(containerTag);
      });
    }
  },
  unmountComponentAtNodeAndRemoveContainer: function(containerTag) {
    ReactNativeRenderer.unmountComponentAtNode(containerTag); // Call back into native to remove all of the subviews from this container

    ReactNativePrivateInterface.UIManager.removeRootView(containerTag);
  },
  createPortal: function(children, containerTag) {
    var key =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return createPortal(children, containerTag, null, key);
  },
  unstable_batchedUpdates: batchedUpdates,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    // Used as a mixin in many createClass-based components
    NativeMethodsMixin: NativeMethodsMixin(findNodeHandle, findHostInstance),
    computeComponentStackForErrorReporting: computeComponentStackForErrorReporting
  }
};
injectIntoDevTools({
  findFiberByHostInstance: getInstanceFromTag,
  getInspectorDataForViewTag: getInspectorDataForViewTag,
  bundleType: 0,
  version: ReactVersion,
  rendererPackageName: "react-native-renderer"
});

var ReactNativeRenderer$2 = {
  default: ReactNativeRenderer
};

var ReactNativeRenderer$3 =
  (ReactNativeRenderer$2 && ReactNativeRenderer) || ReactNativeRenderer$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.

var reactNativeRenderer =
  ReactNativeRenderer$3.default || ReactNativeRenderer$3;

module.exports = reactNativeRenderer;
