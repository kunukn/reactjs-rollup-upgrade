"use strict";

var React = require("react");
var Scheduler = require("scheduler");
var tracing = require("scheduler/tracing");

// Do not require this module directly! Use normal `invariant` calls with
// template literal strings. The messages will be converted to ReactError during
// build, and in production they will be minified.
function ReactErrorProd(error) {
  var code = error.message;
  var url = "https://reactjs.org/docs/error-decoder.html?invariant=" + code;

  for (var i = 1; i < arguments.length; i++) {
    url += "&args[]=" + encodeURIComponent(arguments[i]);
  }

  error.message =
    "Minified React error #" +
    code +
    "; visit " +
    url +
    " for the full message or " +
    "use the non-minified dev environment for full errors and additional " +
    "helpful warnings. ";
  return error;
}

// Do not require this module directly! Use normal `invariant` calls with
// template literal strings. The messages will be converted to ReactError during
// build, and in production they will be minified.

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

require("warning");

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
function has(key) {
  return key._reactInternalFiber !== undefined;
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

// Re-export dynamic flags from the www version.
var _require = require("ReactFeatureFlags");
var debugRenderPhaseSideEffects = _require.debugRenderPhaseSideEffects;
var debugRenderPhaseSideEffectsForStrictMode =
  _require.debugRenderPhaseSideEffectsForStrictMode;
var replayFailedUnitOfWorkWithInvokeGuardedCallback =
  _require.replayFailedUnitOfWorkWithInvokeGuardedCallback;
var warnAboutDeprecatedLifecycles = _require.warnAboutDeprecatedLifecycles;
var disableInputAttributeSyncing = _require.disableInputAttributeSyncing;
var warnAboutShorthandPropertyCollision =
  _require.warnAboutShorthandPropertyCollision;
var warnAboutDeprecatedSetNativeProps =
  _require.warnAboutDeprecatedSetNativeProps;
var enableUserBlockingEvents = _require.enableUserBlockingEvents;
var disableLegacyContext = _require.disableLegacyContext;
var disableSchedulerTimeoutBasedOnReactExpirationTime =
  _require.disableSchedulerTimeoutBasedOnReactExpirationTime; // In www, we have experimental support for gathering data
var enableUserTimingAPI = false;
var enableProfilerTimer = true;
var enableSchedulerTracing = true;

var enableStableConcurrentModeAPIs = false;
var enableSuspenseServerRenderer = true;
var disableJavaScriptURLs = true;
var refCount = 0;
function addUserTimingListener() {
  refCount++;
  updateFlagOutsideOfReactCallStack();
  return function() {
    refCount--;
    updateFlagOutsideOfReactCallStack();
  };
} // The flag is intentionally updated in a timeout.
// We don't support toggling it during reconciliation or
// commit since that would cause mismatching user timing API calls.

var timeout = null;

function updateFlagOutsideOfReactCallStack() {
  if (!timeout) {
    timeout = setTimeout(function() {
      timeout = null;
      enableUserTimingAPI = refCount > 0;
    });
  }
}

var enableFlareAPI = true;
var enableFundamentalAPI = false;

var enableSuspenseCallback = true;

var flushSuspenseFallbacksInTests = true; // Flow magic to verify the exports of this file match the original version.

var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
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
      {
        throw ReactErrorProd(Error(188));
      }
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
        {
          throw ReactErrorProd(Error(188));
        }
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
          {
            throw ReactErrorProd(Error(188));
          }
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
            {
              throw ReactErrorProd(Error(189));
            }
          }
        })();
      }
    }

    (function() {
      if (!(a.alternate === b)) {
        {
          throw ReactErrorProd(Error(190));
        }
      }
    })();
  } // If the root is not a host container, we're in a disconnected tree. I.e.
  // unmounted.

  (function() {
    if (!(a.tag === HostRoot)) {
      {
        throw ReactErrorProd(Error(188));
      }
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

(function() {
  if (!React) {
    {
      throw ReactErrorProd(Error(227));
    }
  }
})();

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
        {
          throw ReactErrorProd(Error(96), pluginName);
        }
      }
    })();

    if (plugins[pluginIndex]) {
      continue;
    }

    (function() {
      if (!pluginModule.extractEvents) {
        {
          throw ReactErrorProd(Error(97), pluginName);
        }
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
          {
            throw ReactErrorProd(Error(98), eventName, pluginName);
          }
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
      {
        throw ReactErrorProd(Error(99), eventName);
      }
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
      {
        throw ReactErrorProd(Error(100), registrationName);
      }
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
      {
        throw ReactErrorProd(Error(101));
      }
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
          {
            throw ReactErrorProd(Error(102), pluginName);
          }
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

var ReactFbErrorUtils = require("ReactFbErrorUtils");

(function() {
  if (!(typeof ReactFbErrorUtils.invokeGuardedCallback === "function")) {
    {
      throw ReactErrorProd(Error(255));
    }
  }
})();

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
  // This will call `this.onError(err)` if an error was caught.
  ReactFbErrorUtils.invokeGuardedCallback.apply(this, arguments);
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
        {
          throw ReactErrorProd(Error(198));
        }
      }
    })();
  }
}

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
 * @see executeDispatchesInOrderStopAtTrueImpl
 */

/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */

/**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */

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
      {
        throw ReactErrorProd(Error(30));
      }
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
      {
        throw ReactErrorProd(Error(95));
      }
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
      {
        throw ReactErrorProd(Error(231), registrationName, typeof listener);
      }
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

var randomKey = Math.random()
  .toString(36)
  .slice(2);
var internalInstanceKey = "__reactInternalInstance$" + randomKey;
var internalEventHandlersKey = "__reactEventHandlers$" + randomKey;
function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}
/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */

function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey];
  }

  while (!node[internalInstanceKey]) {
    if (node.parentNode) {
      node = node.parentNode;
    } else {
      // Top of the tree. This node must not be part of a React tree (or is
      // unmounted, potentially).
      return null;
    }
  }

  var inst = node[internalInstanceKey];

  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber, this will always be the deepest root.
    return inst;
  }

  return null;
}
/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */

function getInstanceFromNode$1(node) {
  var inst = node[internalInstanceKey];

  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst;
    } else {
      return null;
    }
  }

  return null;
}
/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */

function getNodeFromInstance$1(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber this, is just the state node right now. We assume it will be
    // a host component or host text.
    return inst.stateNode;
  } // Without this first invariant, passing a non-DOM-component triggers the next
  // invariant for a missing parent, which is super confusing.

  (function() {
    {
      {
        throw ReactErrorProd(Error(33));
      }
    }
  })();
}
function getFiberCurrentPropsFromNode$1(node) {
  return node[internalEventHandlersKey] || null;
}
function updateFiberProps(node, props) {
  node[internalEventHandlersKey] = props;
}

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

/**
 * Return the parent instance of the passed-in instance.
 */

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

function traverseEnterLeave(from, to, fn, argFrom, argTo) {
  var common = from && to ? getLowestCommonAncestor(from, to) : null;
  var pathFrom = [];

  while (true) {
    if (!from) {
      break;
    }

    if (from === common) {
      break;
    }

    var alternate = from.alternate;

    if (alternate !== null && alternate === common) {
      break;
    }

    pathFrom.push(from);
    from = getParent(from);
  }

  var pathTo = [];

  while (true) {
    if (!to) {
      break;
    }

    if (to === common) {
      break;
    }

    var _alternate = to.alternate;

    if (_alternate !== null && _alternate === common) {
      break;
    }

    pathTo.push(to);
    to = getParent(to);
  }

  for (var i = 0; i < pathFrom.length; i++) {
    fn(pathFrom[i], "bubbled", argFrom);
  }

  for (var _i = pathTo.length; _i-- > 0; ) {
    fn(pathTo[_i], "captured", argTo);
  }
}

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

function accumulateEnterLeaveDispatches(leave, enter, from, to) {
  traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
}
function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}

var canUseDOM = !!(
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
);

// Do not use the below two methods directly!
// Instead use constants exported from DOMTopLevelEventTypes in ReactDOM.
// (It is the only module that is allowed to access these methods.)
function unsafeCastStringToDOMTopLevelType(topLevelType) {
  return topLevelType;
}
function unsafeCastDOMTopLevelTypeToString(topLevelType) {
  return topLevelType;
}

/**
 * Generate a mapping of standard vendor prefixes using the defined style property and event name.
 *
 * @param {string} styleProp
 * @param {string} eventName
 * @returns {object}
 */

function makePrefixMap(styleProp, eventName) {
  var prefixes = {};
  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes["Webkit" + styleProp] = "webkit" + eventName;
  prefixes["Moz" + styleProp] = "moz" + eventName;
  return prefixes;
}
/**
 * A list of event names to a configurable list of vendor prefixes.
 */

var vendorPrefixes = {
  animationend: makePrefixMap("Animation", "AnimationEnd"),
  animationiteration: makePrefixMap("Animation", "AnimationIteration"),
  animationstart: makePrefixMap("Animation", "AnimationStart"),
  transitionend: makePrefixMap("Transition", "TransitionEnd")
};
/**
 * Event names that have already been detected and prefixed (if applicable).
 */

var prefixedEventNames = {};
/**
 * Element to check for prefixes on.
 */

var style = {};
/**
 * Bootstrap if a DOM exists.
 */

if (canUseDOM) {
  style = document.createElement("div").style; // On some platforms, in particular some releases of Android 4.x,
  // the un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are usable, and if not remove them from the map.

  if (!("AnimationEvent" in window)) {
    delete vendorPrefixes.animationend.animation;
    delete vendorPrefixes.animationiteration.animation;
    delete vendorPrefixes.animationstart.animation;
  } // Same as above

  if (!("TransitionEvent" in window)) {
    delete vendorPrefixes.transitionend.transition;
  }
}
/**
 * Attempts to determine the correct vendor prefixed event name.
 *
 * @param {string} eventName
 * @returns {string}
 */

function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  } else if (!vendorPrefixes[eventName]) {
    return eventName;
  }

  var prefixMap = vendorPrefixes[eventName];

  for (var styleProp in prefixMap) {
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
      return (prefixedEventNames[eventName] = prefixMap[styleProp]);
    }
  }

  return eventName;
}

/**
 * To identify top level events in ReactDOM, we use constants defined by this
 * module. This is the only module that uses the unsafe* methods to express
 * that the constants actually correspond to the browser event names. This lets
 * us save some bundle size by avoiding a top level type -> event name map.
 * The rest of ReactDOM code should import top level types from this file.
 */

var TOP_ABORT = unsafeCastStringToDOMTopLevelType("abort");
var TOP_ANIMATION_END = unsafeCastStringToDOMTopLevelType(
  getVendorPrefixedEventName("animationend")
);
var TOP_ANIMATION_ITERATION = unsafeCastStringToDOMTopLevelType(
  getVendorPrefixedEventName("animationiteration")
);
var TOP_ANIMATION_START = unsafeCastStringToDOMTopLevelType(
  getVendorPrefixedEventName("animationstart")
);
var TOP_BLUR = unsafeCastStringToDOMTopLevelType("blur");
var TOP_CAN_PLAY = unsafeCastStringToDOMTopLevelType("canplay");
var TOP_CAN_PLAY_THROUGH = unsafeCastStringToDOMTopLevelType("canplaythrough");
var TOP_CANCEL = unsafeCastStringToDOMTopLevelType("cancel");
var TOP_CHANGE = unsafeCastStringToDOMTopLevelType("change");
var TOP_CLICK = unsafeCastStringToDOMTopLevelType("click");
var TOP_CLOSE = unsafeCastStringToDOMTopLevelType("close");
var TOP_COMPOSITION_END = unsafeCastStringToDOMTopLevelType("compositionend");
var TOP_COMPOSITION_START = unsafeCastStringToDOMTopLevelType(
  "compositionstart"
);
var TOP_COMPOSITION_UPDATE = unsafeCastStringToDOMTopLevelType(
  "compositionupdate"
);
var TOP_CONTEXT_MENU = unsafeCastStringToDOMTopLevelType("contextmenu");
var TOP_COPY = unsafeCastStringToDOMTopLevelType("copy");
var TOP_CUT = unsafeCastStringToDOMTopLevelType("cut");
var TOP_DOUBLE_CLICK = unsafeCastStringToDOMTopLevelType("dblclick");
var TOP_AUX_CLICK = unsafeCastStringToDOMTopLevelType("auxclick");
var TOP_DRAG = unsafeCastStringToDOMTopLevelType("drag");
var TOP_DRAG_END = unsafeCastStringToDOMTopLevelType("dragend");
var TOP_DRAG_ENTER = unsafeCastStringToDOMTopLevelType("dragenter");
var TOP_DRAG_EXIT = unsafeCastStringToDOMTopLevelType("dragexit");
var TOP_DRAG_LEAVE = unsafeCastStringToDOMTopLevelType("dragleave");
var TOP_DRAG_OVER = unsafeCastStringToDOMTopLevelType("dragover");
var TOP_DRAG_START = unsafeCastStringToDOMTopLevelType("dragstart");
var TOP_DROP = unsafeCastStringToDOMTopLevelType("drop");
var TOP_DURATION_CHANGE = unsafeCastStringToDOMTopLevelType("durationchange");
var TOP_EMPTIED = unsafeCastStringToDOMTopLevelType("emptied");
var TOP_ENCRYPTED = unsafeCastStringToDOMTopLevelType("encrypted");
var TOP_ENDED = unsafeCastStringToDOMTopLevelType("ended");
var TOP_ERROR = unsafeCastStringToDOMTopLevelType("error");
var TOP_FOCUS = unsafeCastStringToDOMTopLevelType("focus");
var TOP_GOT_POINTER_CAPTURE = unsafeCastStringToDOMTopLevelType(
  "gotpointercapture"
);
var TOP_INPUT = unsafeCastStringToDOMTopLevelType("input");
var TOP_INVALID = unsafeCastStringToDOMTopLevelType("invalid");
var TOP_KEY_DOWN = unsafeCastStringToDOMTopLevelType("keydown");
var TOP_KEY_PRESS = unsafeCastStringToDOMTopLevelType("keypress");
var TOP_KEY_UP = unsafeCastStringToDOMTopLevelType("keyup");
var TOP_LOAD = unsafeCastStringToDOMTopLevelType("load");
var TOP_LOAD_START = unsafeCastStringToDOMTopLevelType("loadstart");
var TOP_LOADED_DATA = unsafeCastStringToDOMTopLevelType("loadeddata");
var TOP_LOADED_METADATA = unsafeCastStringToDOMTopLevelType("loadedmetadata");
var TOP_LOST_POINTER_CAPTURE = unsafeCastStringToDOMTopLevelType(
  "lostpointercapture"
);
var TOP_MOUSE_DOWN = unsafeCastStringToDOMTopLevelType("mousedown");
var TOP_MOUSE_MOVE = unsafeCastStringToDOMTopLevelType("mousemove");
var TOP_MOUSE_OUT = unsafeCastStringToDOMTopLevelType("mouseout");
var TOP_MOUSE_OVER = unsafeCastStringToDOMTopLevelType("mouseover");
var TOP_MOUSE_UP = unsafeCastStringToDOMTopLevelType("mouseup");
var TOP_PASTE = unsafeCastStringToDOMTopLevelType("paste");
var TOP_PAUSE = unsafeCastStringToDOMTopLevelType("pause");
var TOP_PLAY = unsafeCastStringToDOMTopLevelType("play");
var TOP_PLAYING = unsafeCastStringToDOMTopLevelType("playing");
var TOP_POINTER_CANCEL = unsafeCastStringToDOMTopLevelType("pointercancel");
var TOP_POINTER_DOWN = unsafeCastStringToDOMTopLevelType("pointerdown");

var TOP_POINTER_MOVE = unsafeCastStringToDOMTopLevelType("pointermove");
var TOP_POINTER_OUT = unsafeCastStringToDOMTopLevelType("pointerout");
var TOP_POINTER_OVER = unsafeCastStringToDOMTopLevelType("pointerover");
var TOP_POINTER_UP = unsafeCastStringToDOMTopLevelType("pointerup");
var TOP_PROGRESS = unsafeCastStringToDOMTopLevelType("progress");
var TOP_RATE_CHANGE = unsafeCastStringToDOMTopLevelType("ratechange");
var TOP_RESET = unsafeCastStringToDOMTopLevelType("reset");
var TOP_SCROLL = unsafeCastStringToDOMTopLevelType("scroll");
var TOP_SEEKED = unsafeCastStringToDOMTopLevelType("seeked");
var TOP_SEEKING = unsafeCastStringToDOMTopLevelType("seeking");
var TOP_SELECTION_CHANGE = unsafeCastStringToDOMTopLevelType("selectionchange");
var TOP_STALLED = unsafeCastStringToDOMTopLevelType("stalled");
var TOP_SUBMIT = unsafeCastStringToDOMTopLevelType("submit");
var TOP_SUSPEND = unsafeCastStringToDOMTopLevelType("suspend");
var TOP_TEXT_INPUT = unsafeCastStringToDOMTopLevelType("textInput");
var TOP_TIME_UPDATE = unsafeCastStringToDOMTopLevelType("timeupdate");
var TOP_TOGGLE = unsafeCastStringToDOMTopLevelType("toggle");
var TOP_TOUCH_CANCEL = unsafeCastStringToDOMTopLevelType("touchcancel");
var TOP_TOUCH_END = unsafeCastStringToDOMTopLevelType("touchend");
var TOP_TOUCH_MOVE = unsafeCastStringToDOMTopLevelType("touchmove");
var TOP_TOUCH_START = unsafeCastStringToDOMTopLevelType("touchstart");
var TOP_TRANSITION_END = unsafeCastStringToDOMTopLevelType(
  getVendorPrefixedEventName("transitionend")
);
var TOP_VOLUME_CHANGE = unsafeCastStringToDOMTopLevelType("volumechange");
var TOP_WAITING = unsafeCastStringToDOMTopLevelType("waiting");
var TOP_WHEEL = unsafeCastStringToDOMTopLevelType("wheel"); // List of events that need to be individually attached to media elements.
// Note that events in this list will *not* be listened to at the top level
// unless they're explicitly whitelisted in `ReactBrowserEventEmitter.listenTo`.

var mediaEventTypes = [
  TOP_ABORT,
  TOP_CAN_PLAY,
  TOP_CAN_PLAY_THROUGH,
  TOP_DURATION_CHANGE,
  TOP_EMPTIED,
  TOP_ENCRYPTED,
  TOP_ENDED,
  TOP_ERROR,
  TOP_LOADED_DATA,
  TOP_LOADED_METADATA,
  TOP_LOAD_START,
  TOP_PAUSE,
  TOP_PLAY,
  TOP_PLAYING,
  TOP_PROGRESS,
  TOP_RATE_CHANGE,
  TOP_SEEKED,
  TOP_SEEKING,
  TOP_STALLED,
  TOP_SUSPEND,
  TOP_TIME_UPDATE,
  TOP_VOLUME_CHANGE,
  TOP_WAITING
];
function getRawEventName(topLevelType) {
  return unsafeCastDOMTopLevelTypeToString(topLevelType);
}

/**
 * These variables store information about text content of a target node,
 * allowing comparison of content before and after a given event.
 *
 * Identify the node where selection currently begins, then observe
 * both its text content and its current position in the DOM. Since the
 * browser may natively replace the target node during composition, we can
 * use its position to find its replacement.
 *
 *
 */
var root = null;
var startText = null;
var fallbackText = null;
function initialize(nativeEventTarget) {
  root = nativeEventTarget;
  startText = getText();
  return true;
}
function reset() {
  root = null;
  startText = null;
  fallbackText = null;
}
function getData() {
  if (fallbackText) {
    return fallbackText;
  }

  var start;
  var startValue = startText;
  var startLength = startValue.length;
  var end;
  var endValue = getText();
  var endLength = endValue.length;

  for (start = 0; start < startLength; start++) {
    if (startValue[start] !== endValue[start]) {
      break;
    }
  }

  var minEnd = startLength - start;

  for (end = 1; end <= minEnd; end++) {
    if (startValue[startLength - end] !== endValue[endLength - end]) {
      break;
    }
  }

  var sliceTail = end > 1 ? 1 - end : undefined;
  fallbackText = endValue.slice(start, sliceTail);
  return fallbackText;
}
function getText() {
  if ("value" in root) {
    return root.value;
  }

  return root.textContent;
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
      {
        throw ReactErrorProd(Error(279));
      }
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
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */

var SyntheticCompositionEvent = SyntheticEvent.extend({
  data: null
});

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */

var SyntheticInputEvent = SyntheticEvent.extend({
  data: null
});

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space

var START_KEYCODE = 229;
var canUseCompositionEvent = canUseDOM && "CompositionEvent" in window;
var documentMode = null;

if (canUseDOM && "documentMode" in document) {
  documentMode = document.documentMode;
} // Webkit offers a very useful `textInput` event that can be used to
// directly represent `beforeInput`. The IE `textinput` event is not as
// useful, so we don't use it.

var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode; // In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. Japanese ideographic
// spaces, for instance (\u3000) are not recorded correctly.

var useFallbackCompositionData =
  canUseDOM &&
  (!canUseCompositionEvent ||
    (documentMode && documentMode > 8 && documentMode <= 11));
var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE); // Events and their corresponding property names.

var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: "onBeforeInput",
      captured: "onBeforeInputCapture"
    },
    dependencies: [
      TOP_COMPOSITION_END,
      TOP_KEY_PRESS,
      TOP_TEXT_INPUT,
      TOP_PASTE
    ]
  },
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: "onCompositionEnd",
      captured: "onCompositionEndCapture"
    },
    dependencies: [
      TOP_BLUR,
      TOP_COMPOSITION_END,
      TOP_KEY_DOWN,
      TOP_KEY_PRESS,
      TOP_KEY_UP,
      TOP_MOUSE_DOWN
    ]
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: "onCompositionStart",
      captured: "onCompositionStartCapture"
    },
    dependencies: [
      TOP_BLUR,
      TOP_COMPOSITION_START,
      TOP_KEY_DOWN,
      TOP_KEY_PRESS,
      TOP_KEY_UP,
      TOP_MOUSE_DOWN
    ]
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: "onCompositionUpdate",
      captured: "onCompositionUpdateCapture"
    },
    dependencies: [
      TOP_BLUR,
      TOP_COMPOSITION_UPDATE,
      TOP_KEY_DOWN,
      TOP_KEY_PRESS,
      TOP_KEY_UP,
      TOP_MOUSE_DOWN
    ]
  }
}; // Track whether we've ever handled a keypress on the space key.

var hasSpaceKeypress = false;
/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */

function isKeypressCommand(nativeEvent) {
  return (
    (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
    !(nativeEvent.ctrlKey && nativeEvent.altKey)
  );
}
/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */

function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case TOP_COMPOSITION_START:
      return eventTypes.compositionStart;

    case TOP_COMPOSITION_END:
      return eventTypes.compositionEnd;

    case TOP_COMPOSITION_UPDATE:
      return eventTypes.compositionUpdate;
  }
}
/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */

function isFallbackCompositionStart(topLevelType, nativeEvent) {
  return topLevelType === TOP_KEY_DOWN && nativeEvent.keyCode === START_KEYCODE;
}
/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */

function isFallbackCompositionEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case TOP_KEY_UP:
      // Command keys insert or clear IME input.
      return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;

    case TOP_KEY_DOWN:
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return nativeEvent.keyCode !== START_KEYCODE;

    case TOP_KEY_PRESS:
    case TOP_MOUSE_DOWN:
    case TOP_BLUR:
      // Events are not possible without cancelling IME.
      return true;

    default:
      return false;
  }
}
/**
 * Google Input Tools provides composition data via a CustomEvent,
 * with the `data` property populated in the `detail` object. If this
 * is available on the event object, use it. If not, this is a plain
 * composition event and we have nothing special to extract.
 *
 * @param {object} nativeEvent
 * @return {?string}
 */

function getDataFromCustomEvent(nativeEvent) {
  var detail = nativeEvent.detail;

  if (typeof detail === "object" && "data" in detail) {
    return detail.data;
  }

  return null;
}
/**
 * Check if a composition event was triggered by Korean IME.
 * Our fallback mode does not work well with IE's Korean IME,
 * so just use native composition events when Korean IME is used.
 * Although CompositionEvent.locale property is deprecated,
 * it is available in IE, where our fallback mode is enabled.
 *
 * @param {object} nativeEvent
 * @return {boolean}
 */

function isUsingKoreanIME(nativeEvent) {
  return nativeEvent.locale === "ko";
} // Track the current IME composition status, if any.

var isComposing = false;
/**
 * @return {?object} A SyntheticCompositionEvent.
 */

function extractCompositionEvent(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var eventType;
  var fallbackData;

  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(topLevelType);
  } else if (!isComposing) {
    if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionStart;
    }
  } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
    eventType = eventTypes.compositionEnd;
  }

  if (!eventType) {
    return null;
  }

  if (useFallbackCompositionData && !isUsingKoreanIME(nativeEvent)) {
    // The current composition is stored statically and must not be
    // overwritten while composition continues.
    if (!isComposing && eventType === eventTypes.compositionStart) {
      isComposing = initialize(nativeEventTarget);
    } else if (eventType === eventTypes.compositionEnd) {
      if (isComposing) {
        fallbackData = getData();
      }
    }
  }

  var event = SyntheticCompositionEvent.getPooled(
    eventType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  );

  if (fallbackData) {
    // Inject data generated from fallback path into the synthetic event.
    // This matches the property of native CompositionEventInterface.
    event.data = fallbackData;
  } else {
    var customData = getDataFromCustomEvent(nativeEvent);

    if (customData !== null) {
      event.data = customData;
    }
  }

  accumulateTwoPhaseDispatches(event);
  return event;
}
/**
 * @param {TopLevelType} topLevelType Number from `TopLevelType`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The string corresponding to this `beforeInput` event.
 */

function getNativeBeforeInputChars(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case TOP_COMPOSITION_END:
      return getDataFromCustomEvent(nativeEvent);

    case TOP_KEY_PRESS:
      /**
       * If native `textInput` events are available, our goal is to make
       * use of them. However, there is a special case: the spacebar key.
       * In Webkit, preventing default on a spacebar `textInput` event
       * cancels character insertion, but it *also* causes the browser
       * to fall back to its default spacebar behavior of scrolling the
       * page.
       *
       * Tracking at:
       * https://code.google.com/p/chromium/issues/detail?id=355103
       *
       * To avoid this issue, use the keypress event as if no `textInput`
       * event is available.
       */
      var which = nativeEvent.which;

      if (which !== SPACEBAR_CODE) {
        return null;
      }

      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;

    case TOP_TEXT_INPUT:
      // Record the characters to be added to the DOM.
      var chars = nativeEvent.data; // If it's a spacebar character, assume that we have already handled
      // it at the keypress level and bail immediately. Android Chrome
      // doesn't give us keycodes, so we need to ignore it.

      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }

      return chars;

    default:
      // For other native event types, do nothing.
      return null;
  }
}
/**
 * For browsers that do not provide the `textInput` event, extract the
 * appropriate string to use for SyntheticInputEvent.
 *
 * @param {number} topLevelType Number from `TopLevelEventTypes`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The fallback string for this `beforeInput` event.
 */

function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
  // If we are currently composing (IME) and using a fallback to do so,
  // try to extract the composed characters from the fallback object.
  // If composition event is available, we extract a string only at
  // compositionevent, otherwise extract it at fallback events.
  if (isComposing) {
    if (
      topLevelType === TOP_COMPOSITION_END ||
      (!canUseCompositionEvent &&
        isFallbackCompositionEnd(topLevelType, nativeEvent))
    ) {
      var chars = getData();
      reset();
      isComposing = false;
      return chars;
    }

    return null;
  }

  switch (topLevelType) {
    case TOP_PASTE:
      // If a paste event occurs after a keypress, throw out the input
      // chars. Paste events should not lead to BeforeInput events.
      return null;

    case TOP_KEY_PRESS:
      /**
       * As of v27, Firefox may fire keypress events even when no character
       * will be inserted. A few possibilities:
       *
       * - `which` is `0`. Arrow keys, Esc key, etc.
       *
       * - `which` is the pressed key code, but no char is available.
       *   Ex: 'AltGr + d` in Polish. There is no modified character for
       *   this key combination and no character is inserted into the
       *   document, but FF fires the keypress for char code `100` anyway.
       *   No `input` event will occur.
       *
       * - `which` is the pressed key code, but a command combination is
       *   being used. Ex: `Cmd+C`. No character is inserted, and no
       *   `input` event will occur.
       */
      if (!isKeypressCommand(nativeEvent)) {
        // IE fires the `keypress` event when a user types an emoji via
        // Touch keyboard of Windows.  In such a case, the `char` property
        // holds an emoji character like `\uD83D\uDE0A`.  Because its length
        // is 2, the property `which` does not represent an emoji correctly.
        // In such a case, we directly return the `char` property instead of
        // using `which`.
        if (nativeEvent.char && nativeEvent.char.length > 1) {
          return nativeEvent.char;
        } else if (nativeEvent.which) {
          return String.fromCharCode(nativeEvent.which);
        }
      }

      return null;

    case TOP_COMPOSITION_END:
      return useFallbackCompositionData && !isUsingKoreanIME(nativeEvent)
        ? null
        : nativeEvent.data;

    default:
      return null;
  }
}
/**
 * Extract a SyntheticInputEvent for `beforeInput`, based on either native
 * `textInput` or fallback behavior.
 *
 * @return {?object} A SyntheticInputEvent.
 */

function extractBeforeInputEvent(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  var chars;

  if (canUseTextInputEvent) {
    chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
  } else {
    chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
  } // If no characters are being inserted, no BeforeInput event should
  // be fired.

  if (!chars) {
    return null;
  }

  var event = SyntheticInputEvent.getPooled(
    eventTypes.beforeInput,
    targetInst,
    nativeEvent,
    nativeEventTarget
  );
  event.data = chars;
  accumulateTwoPhaseDispatches(event);
  return event;
}
/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 *
 * This plugin is also responsible for emitting `composition` events, thus
 * allowing us to share composition fallback code for both `beforeInput` and
 * `composition` event types.
 */

var BeforeInputEventPlugin = {
  eventTypes: eventTypes,
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    var composition = extractCompositionEvent(
      topLevelType,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );
    var beforeInput = extractBeforeInputEvent(
      topLevelType,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );

    if (composition === null) {
      return beforeInput;
    }

    if (beforeInput === null) {
      return composition;
    }

    return [composition, beforeInput];
  }
};

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
      {
        throw ReactErrorProd(Error(280));
      }
    }
  })();

  var props = getFiberCurrentPropsFromNode(internalInstance.stateNode);
  restoreImpl(internalInstance.stateNode, internalInstance.type, props);
}

function setRestoreImplementation(impl) {
  restoreImpl = impl;
}
function enqueueStateRestore(target) {
  if (restoreTarget) {
    if (restoreQueue) {
      restoreQueue.push(target);
    } else {
      restoreQueue = [target];
    }
  } else {
    restoreTarget = target;
  }
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

// the renderer. Such as when we're dispatching events or if third party
// libraries need to call batchedUpdates. Eventually, this API will go away when
// everything is batched by default. We'll then have a similar API to opt-out of
// scheduled work and instead do synchronous work.
// Defaults

var batchedUpdatesImpl = function(fn, bookkeeping) {
  return fn(bookkeeping);
};

var discreteUpdatesImpl = function(fn, a, b, c) {
  return fn(a, b, c);
};

var flushDiscreteUpdatesImpl = function() {};

var batchedEventUpdatesImpl = batchedUpdatesImpl;
var isInsideEventHandler = false;
var isBatchingEventUpdates = false;

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
function batchedEventUpdates(fn, a, b) {
  if (isBatchingEventUpdates) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state.
    return fn(a, b);
  }

  isBatchingEventUpdates = true;

  try {
    return batchedEventUpdatesImpl(fn, a, b);
  } finally {
    isBatchingEventUpdates = false;
    finishEventHandler();
  }
}
function executeUserEventHandler(fn, value) {
  var previouslyInEventHandler = isInsideEventHandler;

  try {
    isInsideEventHandler = true;
    var type = typeof value === "object" && value !== null ? value.type : "";
    invokeGuardedCallbackAndCatchFirstError(type, fn, undefined, value);
  } finally {
    isInsideEventHandler = previouslyInEventHandler;
  }
}
function discreteUpdates(fn, a, b, c) {
  var prevIsInsideEventHandler = isInsideEventHandler;
  isInsideEventHandler = true;

  try {
    return discreteUpdatesImpl(fn, a, b, c);
  } finally {
    isInsideEventHandler = prevIsInsideEventHandler;

    if (!isInsideEventHandler) {
      finishEventHandler();
    }
  }
}
var lastFlushedEventTimeStamp = 0;
function flushDiscreteUpdatesIfNeeded(timeStamp) {
  // event.timeStamp isn't overly reliable due to inconsistencies in
  // how different browsers have historically provided the time stamp.
  // Some browsers provide high-resolution time stamps for all events,
  // some provide low-resolution time stamps for all events. FF < 52
  // even mixes both time stamps together. Some browsers even report
  // negative time stamps or time stamps that are 0 (iOS9) in some cases.
  // Given we are only comparing two time stamps with equality (!==),
  // we are safe from the resolution differences. If the time stamp is 0
  // we bail-out of preventing the flush, which can affect semantics,
  // such as if an earlier flush removes or adds event listeners that
  // are fired in the subsequent flush. However, this is the same
  // behaviour as we had before this change, so the risks are low.
  if (
    !isInsideEventHandler &&
    (!enableFlareAPI ||
      timeStamp === 0 ||
      lastFlushedEventTimeStamp !== timeStamp)
  ) {
    lastFlushedEventTimeStamp = timeStamp;
    flushDiscreteUpdatesImpl();
  }
}
function setBatchingImplementation(
  _batchedUpdatesImpl,
  _discreteUpdatesImpl,
  _flushDiscreteUpdatesImpl,
  _batchedEventUpdatesImpl
) {
  batchedUpdatesImpl = _batchedUpdatesImpl;
  discreteUpdatesImpl = _discreteUpdatesImpl;
  flushDiscreteUpdatesImpl = _flushDiscreteUpdatesImpl;
  batchedEventUpdatesImpl = _batchedEventUpdatesImpl;
}

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  "datetime-local": true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};

function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

  if (nodeName === "input") {
    return !!supportedInputTypes[elem.type];
  }

  if (nodeName === "textarea") {
    return true;
  }

  return false;
}

/**
 * HTML nodeType values that represent the type of the node
 */
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_FRAGMENT_NODE = 11;

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */

function getEventTarget(nativeEvent) {
  // Fallback to nativeEvent.srcElement for IE9
  // https://github.com/facebook/react/issues/12506
  var target = nativeEvent.target || nativeEvent.srcElement || window; // Normalize SVG <use> element events #4963

  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  } // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html

  return target.nodeType === TEXT_NODE ? target.parentNode : target;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */

function isEventSupported(eventNameSuffix) {
  if (!canUseDOM) {
    return false;
  }

  var eventName = "on" + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement("div");
    element.setAttribute(eventName, "return;");
    isSupported = typeof element[eventName] === "function";
  }

  return isSupported;
}

function isCheckable(elem) {
  var type = elem.type;
  var nodeName = elem.nodeName;
  return (
    nodeName &&
    nodeName.toLowerCase() === "input" &&
    (type === "checkbox" || type === "radio")
  );
}

function getTracker(node) {
  return node._valueTracker;
}

function detachTracker(node) {
  node._valueTracker = null;
}

function getValueFromNode(node) {
  var value = "";

  if (!node) {
    return value;
  }

  if (isCheckable(node)) {
    value = node.checked ? "true" : "false";
  } else {
    value = node.value;
  }

  return value;
}

function trackValueOnNode(node) {
  var valueField = isCheckable(node) ? "checked" : "value";
  var descriptor = Object.getOwnPropertyDescriptor(
    node.constructor.prototype,
    valueField
  );
  var currentValue = "" + node[valueField]; // if someone has already defined a value or Safari, then bail
  // and don't track value will cause over reporting of changes,
  // but it's better then a hard failure
  // (needed for certain tests that spyOn input values and Safari)

  if (
    node.hasOwnProperty(valueField) ||
    typeof descriptor === "undefined" ||
    typeof descriptor.get !== "function" ||
    typeof descriptor.set !== "function"
  ) {
    return;
  }

  var get = descriptor.get,
    set = descriptor.set;
  Object.defineProperty(node, valueField, {
    configurable: true,
    get: function() {
      return get.call(this);
    },
    set: function(value) {
      currentValue = "" + value;
      set.call(this, value);
    }
  }); // We could've passed this the first time
  // but it triggers a bug in IE11 and Edge 14/15.
  // Calling defineProperty() again should be equivalent.
  // https://github.com/facebook/react/issues/11768

  Object.defineProperty(node, valueField, {
    enumerable: descriptor.enumerable
  });
  var tracker = {
    getValue: function() {
      return currentValue;
    },
    setValue: function(value) {
      currentValue = "" + value;
    },
    stopTracking: function() {
      detachTracker(node);
      delete node[valueField];
    }
  };
  return tracker;
}

function track(node) {
  if (getTracker(node)) {
    return;
  } // TODO: Once it's just Fiber we can move this to node._wrapperState

  node._valueTracker = trackValueOnNode(node);
}
function updateValueIfChanged(node) {
  if (!node) {
    return false;
  }

  var tracker = getTracker(node); // if there is no tracker at this point it's unlikely
  // that trying again will succeed

  if (!tracker) {
    return true;
  }

  var lastValue = tracker.getValue();
  var nextValue = getValueFromNode(node);

  if (nextValue !== lastValue) {
    tracker.setValue(nextValue);
    return true;
  }

  return false;
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

// A reserved attribute.
// It is handled by React separately and shouldn't be written to the DOM.
var RESERVED = 0; // A simple string attribute.
// Attributes that aren't in the whitelist are presumed to have this type.

var STRING = 1; // A string attribute that accepts booleans in React. In HTML, these are called
// "enumerated" attributes with "true" and "false" as possible values.
// When true, it should be set to a "true" string.
// When false, it should be set to a "false" string.

var BOOLEANISH_STRING = 2; // A real boolean attribute.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.

var BOOLEAN = 3; // An attribute that can be used as a flag as well as with a value.
// When true, it should be present (set either to an empty string or its name).
// When false, it should be omitted.
// For any other value, should be present with that value.

var OVERLOADED_BOOLEAN = 4; // An attribute that must be numeric or parse as a numeric.
// When falsy, it should be removed.

var NUMERIC = 5; // An attribute that must be positive numeric or parse as a positive numeric.
// When falsy, it should be removed.

var POSITIVE_NUMERIC = 6;

/* eslint-disable max-len */
var ATTRIBUTE_NAME_START_CHAR =
  ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
/* eslint-enable max-len */

var ATTRIBUTE_NAME_CHAR =
  ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";

var ROOT_ATTRIBUTE_NAME = "data-reactroot";
var VALID_ATTRIBUTE_NAME_REGEX = new RegExp(
  "^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$"
);
var hasOwnProperty = Object.prototype.hasOwnProperty;
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
    return true;
  }

  if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
    return false;
  }

  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }

  illegalAttributeNameCache[attributeName] = true;

  return false;
}
function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
  if (propertyInfo !== null) {
    return propertyInfo.type === RESERVED;
  }

  if (isCustomComponentTag) {
    return false;
  }

  if (
    name.length > 2 &&
    (name[0] === "o" || name[0] === "O") &&
    (name[1] === "n" || name[1] === "N")
  ) {
    return true;
  }

  return false;
}
function shouldRemoveAttributeWithWarning(
  name,
  value,
  propertyInfo,
  isCustomComponentTag
) {
  if (propertyInfo !== null && propertyInfo.type === RESERVED) {
    return false;
  }

  switch (typeof value) {
    case "function": // $FlowIssue symbol is perfectly valid here

    case "symbol":
      // eslint-disable-line
      return true;

    case "boolean": {
      if (isCustomComponentTag) {
        return false;
      }

      if (propertyInfo !== null) {
        return !propertyInfo.acceptsBooleans;
      } else {
        var prefix = name.toLowerCase().slice(0, 5);
        return prefix !== "data-" && prefix !== "aria-";
      }
    }

    default:
      return false;
  }
}
function shouldRemoveAttribute(
  name,
  value,
  propertyInfo,
  isCustomComponentTag
) {
  if (value === null || typeof value === "undefined") {
    return true;
  }

  if (
    shouldRemoveAttributeWithWarning(
      name,
      value,
      propertyInfo,
      isCustomComponentTag
    )
  ) {
    return true;
  }

  if (isCustomComponentTag) {
    return false;
  }

  if (propertyInfo !== null) {
    switch (propertyInfo.type) {
      case BOOLEAN:
        return !value;

      case OVERLOADED_BOOLEAN:
        return value === false;

      case NUMERIC:
        return isNaN(value);

      case POSITIVE_NUMERIC:
        return isNaN(value) || value < 1;
    }
  }

  return false;
}
function getPropertyInfo(name) {
  return properties.hasOwnProperty(name) ? properties[name] : null;
}

function PropertyInfoRecord(
  name,
  type,
  mustUseProperty,
  attributeName,
  attributeNamespace,
  sanitizeURL
) {
  this.acceptsBooleans =
    type === BOOLEANISH_STRING ||
    type === BOOLEAN ||
    type === OVERLOADED_BOOLEAN;
  this.attributeName = attributeName;
  this.attributeNamespace = attributeNamespace;
  this.mustUseProperty = mustUseProperty;
  this.propertyName = name;
  this.type = type;
  this.sanitizeURL = sanitizeURL;
} // When adding attributes to this list, be sure to also add them to
// the `possibleStandardNames` module to ensure casing and incorrect
// name warnings.

var properties = {}; // These props are reserved by React. They shouldn't be written to the DOM.

[
  "children",
  "dangerouslySetInnerHTML", // TODO: This prevents the assignment of defaultValue to regular
  // elements (not just inputs). Now that ReactDOMInput assigns to the
  // defaultValue property -- do we need this?
  "defaultValue",
  "defaultChecked",
  "innerHTML",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "style"
].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    RESERVED,
    false, // mustUseProperty
    name, // attributeName
    null, // attributeNamespace
    false
  );
}); // A few React string attributes have a different name.
// This is a mapping from React prop names to the attribute names.

[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"]
].forEach(function(_ref) {
  var name = _ref[0],
    attributeName = _ref[1];
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false, // mustUseProperty
    attributeName, // attributeName
    null, // attributeNamespace
    false
  );
}); // These are "enumerated" HTML attributes that accept "true" and "false".
// In React, we let users pass `true` and `false` even though technically
// these aren't boolean attributes (they are coerced to strings).

["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEANISH_STRING,
    false, // mustUseProperty
    name.toLowerCase(), // attributeName
    null, // attributeNamespace
    false
  );
}); // These are "enumerated" SVG attributes that accept "true" and "false".
// In React, we let users pass `true` and `false` even though technically
// these aren't boolean attributes (they are coerced to strings).
// Since these are SVG attributes, their attribute names are case-sensitive.

[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha"
].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEANISH_STRING,
    false, // mustUseProperty
    name, // attributeName
    null, // attributeNamespace
    false
  );
}); // These are HTML boolean attributes.

[
  "allowFullScreen",
  "async", // Note: there is a special case that prevents it from being written to the DOM
  // on the client side because the browsers are inconsistent. Instead we call focus().
  "autoFocus",
  "autoPlay",
  "controls",
  "default",
  "defer",
  "disabled",
  "disablePictureInPicture",
  "formNoValidate",
  "hidden",
  "loop",
  "noModule",
  "noValidate",
  "open",
  "playsInline",
  "readOnly",
  "required",
  "reversed",
  "scoped",
  "seamless", // Microdata
  "itemScope"
].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEAN,
    false, // mustUseProperty
    name.toLowerCase(), // attributeName
    null, // attributeNamespace
    false
  );
}); // These are the few React props that we set as DOM properties
// rather than attributes. These are all booleans.

[
  "checked", // Note: `option.selected` is not updated if `select.multiple` is
  // disabled with `removeAttribute`. We have special logic for handling this.
  "multiple",
  "muted",
  "selected"
].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    BOOLEAN,
    true, // mustUseProperty
    name, // attributeName
    null, // attributeNamespace
    false
  );
}); // These are HTML attributes that are "overloaded booleans": they behave like
// booleans, but can also accept a string value.

["capture", "download"].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    OVERLOADED_BOOLEAN,
    false, // mustUseProperty
    name, // attributeName
    null, // attributeNamespace
    false
  );
}); // These are HTML attributes that must be positive numbers.

["cols", "rows", "size", "span"].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    POSITIVE_NUMERIC,
    false, // mustUseProperty
    name, // attributeName
    null, // attributeNamespace
    false
  );
}); // These are HTML attributes that must be numbers.

["rowSpan", "start"].forEach(function(name) {
  properties[name] = new PropertyInfoRecord(
    name,
    NUMERIC,
    false, // mustUseProperty
    name.toLowerCase(), // attributeName
    null, // attributeNamespace
    false
  );
});
var CAMELIZE = /[\-\:]([a-z])/g;

var capitalize = function(token) {
  return token[1].toUpperCase();
}; // This is a list of all SVG attributes that need special casing, namespacing,
// or boolean value assignment. Regular attributes that just accept strings
// and have the same names are omitted, just like in the HTML whitelist.
// Some of these attributes can be hard to find. This list was created by
// scrapping the MDN documentation.

[
  "accent-height",
  "alignment-baseline",
  "arabic-form",
  "baseline-shift",
  "cap-height",
  "clip-path",
  "clip-rule",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "dominant-baseline",
  "enable-background",
  "fill-opacity",
  "fill-rule",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "glyph-name",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "horiz-adv-x",
  "horiz-origin-x",
  "image-rendering",
  "letter-spacing",
  "lighting-color",
  "marker-end",
  "marker-mid",
  "marker-start",
  "overline-position",
  "overline-thickness",
  "paint-order",
  "panose-1",
  "pointer-events",
  "rendering-intent",
  "shape-rendering",
  "stop-color",
  "stop-opacity",
  "strikethrough-position",
  "strikethrough-thickness",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "text-decoration",
  "text-rendering",
  "underline-position",
  "underline-thickness",
  "unicode-bidi",
  "unicode-range",
  "units-per-em",
  "v-alphabetic",
  "v-hanging",
  "v-ideographic",
  "v-mathematical",
  "vector-effect",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "word-spacing",
  "writing-mode",
  "xmlns:xlink",
  "x-height"
].forEach(function(attributeName) {
  var name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false, // mustUseProperty
    attributeName,
    null, // attributeNamespace
    false
  );
}); // String SVG attributes with the xlink namespace.

[
  "xlink:actuate",
  "xlink:arcrole",
  "xlink:role",
  "xlink:show",
  "xlink:title",
  "xlink:type"
].forEach(function(attributeName) {
  var name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false, // mustUseProperty
    attributeName,
    "http://www.w3.org/1999/xlink",
    false
  );
}); // String SVG attributes with the xml namespace.

["xml:base", "xml:lang", "xml:space"].forEach(function(attributeName) {
  var name = attributeName.replace(CAMELIZE, capitalize);
  properties[name] = new PropertyInfoRecord(
    name,
    STRING,
    false, // mustUseProperty
    attributeName,
    "http://www.w3.org/XML/1998/namespace",
    false
  );
}); // These attribute exists both in HTML and SVG.
// The attribute name is case-sensitive in SVG so we can't just use
// the React name like we do for attributes that exist only in HTML.

["tabIndex", "crossOrigin"].forEach(function(attributeName) {
  properties[attributeName] = new PropertyInfoRecord(
    attributeName,
    STRING,
    false, // mustUseProperty
    attributeName.toLowerCase(), // attributeName
    null, // attributeNamespace
    false
  );
}); // These attributes accept URLs. These must not allow javascript: URLS.
// These will also need to accept Trusted Types object in the future.

var xlinkHref = "xlinkHref";
properties[xlinkHref] = new PropertyInfoRecord(
  "xlinkHref",
  STRING,
  false, // mustUseProperty
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  true
);
["src", "href", "action", "formAction"].forEach(function(attributeName) {
  properties[attributeName] = new PropertyInfoRecord(
    attributeName,
    STRING,
    false, // mustUseProperty
    attributeName.toLowerCase(), // attributeName
    null, // attributeNamespace
    true
  );
});

// and any newline or tab are filtered out as if they're not part of the URL.
// https://url.spec.whatwg.org/#url-parsing
// Tab or newline are defined as \r\n\t:
// https://infra.spec.whatwg.org/#ascii-tab-or-newline
// A C0 control is a code point in the range \u0000 NULL to \u001F
// INFORMATION SEPARATOR ONE, inclusive:
// https://infra.spec.whatwg.org/#c0-control-or-space

/* eslint-disable max-len */

var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
var didWarn = false;

function sanitizeURL(url) {
  if (disableJavaScriptURLs) {
    (function() {
      if (!!isJavaScriptProtocol.test(url)) {
        {
          throw ReactErrorProd(Error(323), "");
        }
      }
    })();
  } else {
  }
}

/**
 * Get the value for a property on a node. Only used in DEV for SSR validation.
 * The "expected" argument is used as a hint of what the expected value is.
 * Some properties have multiple equivalent values.
 */

/**
 * Get the value for a attribute on a node. Only used in DEV for SSR validation.
 * The third argument is used as a hint of what the expected value is. Some
 * attributes have multiple equivalent values.
 */

/**
 * Sets the value for a property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 * @param {*} value
 */

function setValueForProperty(node, name, value, isCustomComponentTag) {
  var propertyInfo = getPropertyInfo(name);

  if (shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag)) {
    return;
  }

  if (shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag)) {
    value = null;
  } // If the prop isn't in the special list, treat it as a simple attribute.

  if (isCustomComponentTag || propertyInfo === null) {
    if (isAttributeNameSafe(name)) {
      var _attributeName = name;

      if (value === null) {
        node.removeAttribute(_attributeName);
      } else {
        node.setAttribute(_attributeName, "" + value);
      }
    }

    return;
  }

  var mustUseProperty = propertyInfo.mustUseProperty;

  if (mustUseProperty) {
    var propertyName = propertyInfo.propertyName;

    if (value === null) {
      var type = propertyInfo.type;
      node[propertyName] = type === BOOLEAN ? false : "";
    } else {
      // Contrary to `setAttribute`, object properties are properly
      // `toString`ed by IE8/9.
      node[propertyName] = value;
    }

    return;
  } // The rest are treated as attributes with special cases.

  var attributeName = propertyInfo.attributeName,
    attributeNamespace = propertyInfo.attributeNamespace;

  if (value === null) {
    node.removeAttribute(attributeName);
  } else {
    var _type = propertyInfo.type;
    var attributeValue;

    if (_type === BOOLEAN || (_type === OVERLOADED_BOOLEAN && value === true)) {
      attributeValue = "";
    } else {
      // `setAttribute` with objects becomes only `[object]` in IE8/9,
      // ('' + value) makes it output the correct toString()-value.
      attributeValue = "" + value;

      if (propertyInfo.sanitizeURL) {
        sanitizeURL(attributeValue);
      }
    }

    if (attributeNamespace) {
      node.setAttributeNS(attributeNamespace, attributeName, attributeValue);
    } else {
      node.setAttribute(attributeName, attributeValue);
    }
  }
}

// Flow does not allow string concatenation of most non-string types. To work
// around this limitation, we use an opaque type that can only be obtained by
// passing the value through getToStringValue first.
function toString(value) {
  return "" + value;
}
function getToStringValue(value) {
  switch (typeof value) {
    case "boolean":
    case "number":
    case "object":
    case "string":
    case "undefined":
      return value;

    default:
      // function, symbol are assigned as empty strings
      return "";
  }
}

// TODO: direct imports like some-package/src/* are bad. Fix me.
function isControlled(props) {
  var usesChecked = props.type === "checkbox" || props.type === "radio";
  return usesChecked ? props.checked != null : props.value != null;
}
/**
 * Implements an <input> host component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * See http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */

function getHostProps(element, props) {
  var node = element;
  var checked = props.checked;
  var hostProps = Object.assign({}, props, {
    defaultChecked: undefined,
    defaultValue: undefined,
    value: undefined,
    checked: checked != null ? checked : node._wrapperState.initialChecked
  });
  return hostProps;
}
function initWrapperState(element, props) {
  var node = element;
  var defaultValue = props.defaultValue == null ? "" : props.defaultValue;
  node._wrapperState = {
    initialChecked:
      props.checked != null ? props.checked : props.defaultChecked,
    initialValue: getToStringValue(
      props.value != null ? props.value : defaultValue
    ),
    controlled: isControlled(props)
  };
}
function updateChecked(element, props) {
  var node = element;
  var checked = props.checked;

  if (checked != null) {
    setValueForProperty(node, "checked", checked, false);
  }
}
function updateWrapper(element, props) {
  var node = element;

  updateChecked(element, props);
  var value = getToStringValue(props.value);
  var type = props.type;

  if (value != null) {
    if (type === "number") {
      if (
        (value === 0 && node.value === "") || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        node.value != value
      ) {
        node.value = toString(value);
      }
    } else if (node.value !== toString(value)) {
      node.value = toString(value);
    }
  } else if (type === "submit" || type === "reset") {
    // Submit/reset inputs need the attribute removed completely to avoid
    // blank-text buttons.
    node.removeAttribute("value");
    return;
  }

  if (disableInputAttributeSyncing) {
    // When not syncing the value attribute, React only assigns a new value
    // whenever the defaultValue React prop has changed. When not present,
    // React does nothing
    if (props.hasOwnProperty("defaultValue")) {
      setDefaultValue(node, props.type, getToStringValue(props.defaultValue));
    }
  } else {
    // When syncing the value attribute, the value comes from a cascade of
    // properties:
    //  1. The value React property
    //  2. The defaultValue React property
    //  3. Otherwise there should be no change
    if (props.hasOwnProperty("value")) {
      setDefaultValue(node, props.type, value);
    } else if (props.hasOwnProperty("defaultValue")) {
      setDefaultValue(node, props.type, getToStringValue(props.defaultValue));
    }
  }

  if (disableInputAttributeSyncing) {
    // When not syncing the checked attribute, the attribute is directly
    // controllable from the defaultValue React property. It needs to be
    // updated as new props come in.
    if (props.defaultChecked == null) {
      node.removeAttribute("checked");
    } else {
      node.defaultChecked = !!props.defaultChecked;
    }
  } else {
    // When syncing the checked attribute, it only changes when it needs
    // to be removed, such as transitioning from a checkbox into a text input
    if (props.checked == null && props.defaultChecked != null) {
      node.defaultChecked = !!props.defaultChecked;
    }
  }
}
function postMountWrapper(element, props, isHydrating) {
  var node = element; // Do not assign value if it is already set. This prevents user text input
  // from being lost during SSR hydration.

  if (props.hasOwnProperty("value") || props.hasOwnProperty("defaultValue")) {
    var type = props.type;
    var isButton = type === "submit" || type === "reset"; // Avoid setting value attribute on submit/reset inputs as it overrides the
    // default value provided by the browser. See: #12872

    if (isButton && (props.value === undefined || props.value === null)) {
      return;
    }

    var initialValue = toString(node._wrapperState.initialValue); // Do not assign value if it is already set. This prevents user text input
    // from being lost during SSR hydration.

    if (!isHydrating) {
      if (disableInputAttributeSyncing) {
        var value = getToStringValue(props.value); // When not syncing the value attribute, the value property points
        // directly to the React prop. Only assign it if it exists.

        if (value != null) {
          // Always assign on buttons so that it is possible to assign an
          // empty string to clear button text.
          //
          // Otherwise, do not re-assign the value property if is empty. This
          // potentially avoids a DOM write and prevents Firefox (~60.0.1) from
          // prematurely marking required inputs as invalid. Equality is compared
          // to the current value in case the browser provided value is not an
          // empty string.
          if (isButton || value !== node.value) {
            node.value = toString(value);
          }
        }
      } else {
        // When syncing the value attribute, the value property should use
        // the wrapperState._initialValue property. This uses:
        //
        //   1. The value React property when present
        //   2. The defaultValue React property when present
        //   3. An empty string
        if (initialValue !== node.value) {
          node.value = initialValue;
        }
      }
    }

    if (disableInputAttributeSyncing) {
      // When not syncing the value attribute, assign the value attribute
      // directly from the defaultValue React property (when present)
      var defaultValue = getToStringValue(props.defaultValue);

      if (defaultValue != null) {
        node.defaultValue = toString(defaultValue);
      }
    } else {
      // Otherwise, the value attribute is synchronized to the property,
      // so we assign defaultValue to the same thing as the value property
      // assignment step above.
      node.defaultValue = initialValue;
    }
  } // Normally, we'd just do `node.checked = node.checked` upon initial mount, less this bug
  // this is needed to work around a chrome bug where setting defaultChecked
  // will sometimes influence the value of checked (even after detachment).
  // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=608416
  // We need to temporarily unset name to avoid disrupting radio button groups.

  var name = node.name;

  if (name !== "") {
    node.name = "";
  }

  if (disableInputAttributeSyncing) {
    // When not syncing the checked attribute, the checked property
    // never gets assigned. It must be manually set. We don't want
    // to do this when hydrating so that existing user input isn't
    // modified
    if (!isHydrating) {
      updateChecked(element, props);
    } // Only assign the checked attribute if it is defined. This saves
    // a DOM write when controlling the checked attribute isn't needed
    // (text inputs, submit/reset)

    if (props.hasOwnProperty("defaultChecked")) {
      node.defaultChecked = !node.defaultChecked;
      node.defaultChecked = !!props.defaultChecked;
    }
  } else {
    // When syncing the checked attribute, both the checked property and
    // attribute are assigned at the same time using defaultChecked. This uses:
    //
    //   1. The checked React property when present
    //   2. The defaultChecked React property when present
    //   3. Otherwise, false
    node.defaultChecked = !node.defaultChecked;
    node.defaultChecked = !!node._wrapperState.initialChecked;
  }

  if (name !== "") {
    node.name = name;
  }
}
function restoreControlledState(element, props) {
  var node = element;
  updateWrapper(node, props);
  updateNamedCousins(node, props);
}

function updateNamedCousins(rootNode, props) {
  var name = props.name;

  if (props.type === "radio" && name != null) {
    var queryRoot = rootNode;

    while (queryRoot.parentNode) {
      queryRoot = queryRoot.parentNode;
    } // If `rootNode.form` was non-null, then we could try `form.elements`,
    // but that sometimes behaves strangely in IE8. We could also try using
    // `form.getElementsByName`, but that will only return direct children
    // and won't include inputs that use the HTML5 `form=` attribute. Since
    // the input might not even be in a form. It might not even be in the
    // document. Let's just use the local `querySelectorAll` to ensure we don't
    // miss anything.

    var group = queryRoot.querySelectorAll(
      "input[name=" + JSON.stringify("" + name) + '][type="radio"]'
    );

    for (var i = 0; i < group.length; i++) {
      var otherNode = group[i];

      if (otherNode === rootNode || otherNode.form !== rootNode.form) {
        continue;
      } // This will throw if radio buttons rendered by different copies of React
      // and the same name are rendered into the same form (same as #1939).
      // That's probably okay; we don't support it just as we don't support
      // mixing React radio buttons with non-React ones.

      var otherProps = getFiberCurrentPropsFromNode$1(otherNode);

      (function() {
        if (!otherProps) {
          {
            throw ReactErrorProd(Error(90));
          }
        }
      })(); // We need update the tracked value on the named cousin since the value
      // was changed but the input saw no event or value set

      updateValueIfChanged(otherNode); // If this is a controlled radio button group, forcing the input that
      // was previously checked to update will cause it to be come re-checked
      // as appropriate.

      updateWrapper(otherNode, otherProps);
    }
  }
} // In Chrome, assigning defaultValue to certain input types triggers input validation.
// For number inputs, the display value loses trailing decimal points. For email inputs,
// Chrome raises "The specified value <x> is not a valid email address".
//
// Here we check to see if the defaultValue has actually changed, avoiding these problems
// when the user is inputting text
//
// https://github.com/facebook/react/issues/7253

function setDefaultValue(node, type, value) {
  if (
    // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
    type !== "number" ||
    node.ownerDocument.activeElement !== node
  ) {
    if (value == null) {
      node.defaultValue = toString(node._wrapperState.initialValue);
    } else if (node.defaultValue !== toString(value)) {
      node.defaultValue = toString(value);
    }
  }
}

var eventTypes$1 = {
  change: {
    phasedRegistrationNames: {
      bubbled: "onChange",
      captured: "onChangeCapture"
    },
    dependencies: [
      TOP_BLUR,
      TOP_CHANGE,
      TOP_CLICK,
      TOP_FOCUS,
      TOP_INPUT,
      TOP_KEY_DOWN,
      TOP_KEY_UP,
      TOP_SELECTION_CHANGE
    ]
  }
};

function createAndAccumulateChangeEvent(inst, nativeEvent, target) {
  var event = SyntheticEvent.getPooled(
    eventTypes$1.change,
    inst,
    nativeEvent,
    target
  );
  event.type = "change"; // Flag this event loop as needing state restore.

  enqueueStateRestore(target);
  accumulateTwoPhaseDispatches(event);
  return event;
}
/**
 * For IE shims
 */

var activeElement = null;
var activeElementInst = null;
/**
 * SECTION: handle `change` event
 */

function shouldUseChangeEvent(elem) {
  var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return (
    nodeName === "select" || (nodeName === "input" && elem.type === "file")
  );
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = createAndAccumulateChangeEvent(
    activeElementInst,
    nativeEvent,
    getEventTarget(nativeEvent)
  ); // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.

  batchedUpdates(runEventInBatch, event);
}

function runEventInBatch(event) {
  runEventsInBatch(event);
}

function getInstIfValueChanged(targetInst) {
  var targetNode = getNodeFromInstance$1(targetInst);

  if (updateValueIfChanged(targetNode)) {
    return targetInst;
  }
}

function getTargetInstForChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CHANGE) {
    return targetInst;
  }
}
/**
 * SECTION: handle `input` event
 */

var isInputEventSupported = false;

if (canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events.
  isInputEventSupported =
    isEventSupported("input") &&
    (!document.documentMode || document.documentMode > 9);
}
/**
 * (For IE <=9) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */

function startWatchingForValueChange(target, targetInst) {
  activeElement = target;
  activeElementInst = targetInst;
  activeElement.attachEvent("onpropertychange", handlePropertyChange);
}
/**
 * (For IE <=9) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */

function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }

  activeElement.detachEvent("onpropertychange", handlePropertyChange);
  activeElement = null;
  activeElementInst = null;
}
/**
 * (For IE <=9) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */

function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== "value") {
    return;
  }

  if (getInstIfValueChanged(activeElementInst)) {
    manualDispatchChangeEvent(nativeEvent);
  }
}

function handleEventsForInputEventPolyfill(topLevelType, target, targetInst) {
  if (topLevelType === TOP_FOCUS) {
    // In IE9, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(target, targetInst);
  } else if (topLevelType === TOP_BLUR) {
    stopWatchingForValueChange();
  }
} // For IE8 and IE9.

function getTargetInstForInputEventPolyfill(topLevelType, targetInst) {
  if (
    topLevelType === TOP_SELECTION_CHANGE ||
    topLevelType === TOP_KEY_UP ||
    topLevelType === TOP_KEY_DOWN
  ) {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    return getInstIfValueChanged(activeElementInst);
  }
}
/**
 * SECTION: handle `click` event
 */

function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  var nodeName = elem.nodeName;
  return (
    nodeName &&
    nodeName.toLowerCase() === "input" &&
    (elem.type === "checkbox" || elem.type === "radio")
  );
}

function getTargetInstForClickEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_CLICK) {
    return getInstIfValueChanged(targetInst);
  }
}

function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
  if (topLevelType === TOP_INPUT || topLevelType === TOP_CHANGE) {
    return getInstIfValueChanged(targetInst);
  }
}

function handleControlledInputBlur(node) {
  var state = node._wrapperState;

  if (!state || !state.controlled || node.type !== "number") {
    return;
  }

  if (!disableInputAttributeSyncing) {
    // If controlled, assign the value attribute to the current value on blur
    setDefaultValue(node, "number", node.value);
  }
}
/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */

var ChangeEventPlugin = {
  eventTypes: eventTypes$1,
  _isInputEventSupported: isInputEventSupported,
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;
    var getTargetInstFunc, handleEventFunc;

    if (shouldUseChangeEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForChangeEvent;
    } else if (isTextInputElement(targetNode)) {
      if (isInputEventSupported) {
        getTargetInstFunc = getTargetInstForInputOrChangeEvent;
      } else {
        getTargetInstFunc = getTargetInstForInputEventPolyfill;
        handleEventFunc = handleEventsForInputEventPolyfill;
      }
    } else if (shouldUseClickEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForClickEvent;
    }

    if (getTargetInstFunc) {
      var inst = getTargetInstFunc(topLevelType, targetInst);

      if (inst) {
        var event = createAndAccumulateChangeEvent(
          inst,
          nativeEvent,
          nativeEventTarget
        );
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(topLevelType, targetNode, targetInst);
    } // When blurring, set the value attribute for number inputs

    if (topLevelType === TOP_BLUR) {
      handleControlledInputBlur(targetNode);
    }
  }
};

/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */
var DOMEventPluginOrder = [
  "ResponderEventPlugin",
  "SimpleEventPlugin",
  "EnterLeaveEventPlugin",
  "ChangeEventPlugin",
  "SelectEventPlugin",
  "BeforeInputEventPlugin"
];

var SyntheticUIEvent = SyntheticEvent.extend({
  view: null,
  detail: null
});

/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */
var modifierKeyToProp = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
}; // Older browsers (Safari <= 10, iOS Safari <= 10.2) do not support
// getModifierState. If getModifierState is not supported, we map it to a set of
// modifier keys exposed by the event. In this case, Lock-keys are not supported.

function modifierStateGetter(keyArg) {
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;

  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }

  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

var previousScreenX = 0;
var previousScreenY = 0; // Use flags to signal movementX/Y has already been set

var isMovementXSet = false;
var isMovementYSet = false;
/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var SyntheticMouseEvent = SyntheticUIEvent.extend({
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  pageX: null,
  pageY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: getEventModifierState,
  button: null,
  buttons: null,
  relatedTarget: function(event) {
    return (
      event.relatedTarget ||
      (event.fromElement === event.srcElement
        ? event.toElement
        : event.fromElement)
    );
  },
  movementX: function(event) {
    if ("movementX" in event) {
      return event.movementX;
    }

    var screenX = previousScreenX;
    previousScreenX = event.screenX;

    if (!isMovementXSet) {
      isMovementXSet = true;
      return 0;
    }

    return event.type === "mousemove" ? event.screenX - screenX : 0;
  },
  movementY: function(event) {
    if ("movementY" in event) {
      return event.movementY;
    }

    var screenY = previousScreenY;
    previousScreenY = event.screenY;

    if (!isMovementYSet) {
      isMovementYSet = true;
      return 0;
    }

    return event.type === "mousemove" ? event.screenY - screenY : 0;
  }
});

/**
 * @interface PointerEvent
 * @see http://www.w3.org/TR/pointerevents/
 */

var SyntheticPointerEvent = SyntheticMouseEvent.extend({
  pointerId: null,
  width: null,
  height: null,
  pressure: null,
  tangentialPressure: null,
  tiltX: null,
  tiltY: null,
  twist: null,
  pointerType: null,
  isPrimary: null
});

var eventTypes$2 = {
  mouseEnter: {
    registrationName: "onMouseEnter",
    dependencies: [TOP_MOUSE_OUT, TOP_MOUSE_OVER]
  },
  mouseLeave: {
    registrationName: "onMouseLeave",
    dependencies: [TOP_MOUSE_OUT, TOP_MOUSE_OVER]
  },
  pointerEnter: {
    registrationName: "onPointerEnter",
    dependencies: [TOP_POINTER_OUT, TOP_POINTER_OVER]
  },
  pointerLeave: {
    registrationName: "onPointerLeave",
    dependencies: [TOP_POINTER_OUT, TOP_POINTER_OVER]
  }
};
var EnterLeaveEventPlugin = {
  eventTypes: eventTypes$2,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   */
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    var isOverEvent =
      topLevelType === TOP_MOUSE_OVER || topLevelType === TOP_POINTER_OVER;
    var isOutEvent =
      topLevelType === TOP_MOUSE_OUT || topLevelType === TOP_POINTER_OUT;

    if (isOverEvent && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }

    if (!isOutEvent && !isOverEvent) {
      // Must not be a mouse or pointer in or out - ignoring.
      return null;
    }

    var win;

    if (nativeEventTarget.window === nativeEventTarget) {
      // `nativeEventTarget` is probably a window object.
      win = nativeEventTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = nativeEventTarget.ownerDocument;

      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from;
    var to;

    if (isOutEvent) {
      from = targetInst;
      var related = nativeEvent.relatedTarget || nativeEvent.toElement;
      to = related ? getClosestInstanceFromNode(related) : null;
    } else {
      // Moving to a node from outside the window.
      from = null;
      to = targetInst;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var eventInterface, leaveEventType, enterEventType, eventTypePrefix;

    if (topLevelType === TOP_MOUSE_OUT || topLevelType === TOP_MOUSE_OVER) {
      eventInterface = SyntheticMouseEvent;
      leaveEventType = eventTypes$2.mouseLeave;
      enterEventType = eventTypes$2.mouseEnter;
      eventTypePrefix = "mouse";
    } else if (
      topLevelType === TOP_POINTER_OUT ||
      topLevelType === TOP_POINTER_OVER
    ) {
      eventInterface = SyntheticPointerEvent;
      leaveEventType = eventTypes$2.pointerLeave;
      enterEventType = eventTypes$2.pointerEnter;
      eventTypePrefix = "pointer";
    }

    var fromNode = from == null ? win : getNodeFromInstance$1(from);
    var toNode = to == null ? win : getNodeFromInstance$1(to);
    var leave = eventInterface.getPooled(
      leaveEventType,
      from,
      nativeEvent,
      nativeEventTarget
    );
    leave.type = eventTypePrefix + "leave";
    leave.target = fromNode;
    leave.relatedTarget = toNode;
    var enter = eventInterface.getPooled(
      enterEventType,
      to,
      nativeEvent,
      nativeEventTarget
    );
    enter.type = eventTypePrefix + "enter";
    enter.target = toNode;
    enter.relatedTarget = fromNode;
    accumulateEnterLeaveDispatches(leave, enter, from, to);
    return [leave, enter];
  }
};

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
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
      !hasOwnProperty$1.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

var PLUGIN_EVENT_SYSTEM = 1;
var RESPONDER_EVENT_SYSTEM = 1 << 1;
var IS_PASSIVE = 1 << 2;
var IS_ACTIVE = 1 << 3;
var PASSIVE_NOT_SUPPORTED = 1 << 4;

function createResponderListener(responder, props) {
  var eventResponderListener = {
    responder: responder,
    props: props
  };

  return eventResponderListener;
}
function isFiberSuspenseAndTimedOut(fiber) {
  return fiber.tag === SuspenseComponent && fiber.memoizedState !== null;
}
function getSuspenseFallbackChild(fiber) {
  return fiber.child.sibling.child;
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

var DiscreteEvent = 0;
var UserBlockingEvent = 1;
var ContinuousEvent = 2;

// CommonJS interop named imports.

var UserBlockingPriority$1 = Scheduler.unstable_UserBlockingPriority;
var runWithPriority$1 = Scheduler.unstable_runWithPriority;
var listenToResponderEventTypesImpl;
function setListenToResponderEventTypes(_listenToResponderEventTypesImpl) {
  listenToResponderEventTypesImpl = _listenToResponderEventTypesImpl;
}
var activeTimeouts = new Map();
var rootEventTypesToEventResponderInstances = new Map();
var currentTimeStamp = 0;
var currentTimers = new Map();
var currentInstance = null;
var currentTimerIDCounter = 0;
var currentDocument = null;
var eventResponderContext = {
  dispatchEvent: function(eventValue, eventListener, eventPriority) {
    validateResponderContext();
    validateEventValue(eventValue);

    switch (eventPriority) {
      case DiscreteEvent: {
        flushDiscreteUpdatesIfNeeded(currentTimeStamp);
        discreteUpdates(function() {
          return executeUserEventHandler(eventListener, eventValue);
        });
        break;
      }

      case UserBlockingEvent: {
        if (enableUserBlockingEvents) {
          runWithPriority$1(UserBlockingPriority$1, function() {
            return executeUserEventHandler(eventListener, eventValue);
          });
        } else {
          executeUserEventHandler(eventListener, eventValue);
        }

        break;
      }

      case ContinuousEvent: {
        executeUserEventHandler(eventListener, eventValue);
        break;
      }
    }
  },
  isTargetWithinResponder: function(target) {
    validateResponderContext();

    if (target != null) {
      var fiber = getClosestInstanceFromNode(target);
      var responderFiber = currentInstance.fiber;

      while (fiber !== null) {
        if (fiber === responderFiber || fiber.alternate === responderFiber) {
          return true;
        }

        fiber = fiber.return;
      }
    }

    return false;
  },
  isTargetWithinResponderScope: function(target) {
    validateResponderContext();
    var componentInstance = currentInstance;
    var responder = componentInstance.responder;

    if (target != null) {
      var fiber = getClosestInstanceFromNode(target);
      var responderFiber = currentInstance.fiber;

      while (fiber !== null) {
        if (fiber === responderFiber || fiber.alternate === responderFiber) {
          return true;
        }

        if (doesFiberHaveResponder(fiber, responder)) {
          return false;
        }

        fiber = fiber.return;
      }
    }

    return false;
  },
  isTargetWithinNode: function(childTarget, parentTarget) {
    validateResponderContext();
    var childFiber = getClosestInstanceFromNode(childTarget);
    var parentFiber = getClosestInstanceFromNode(parentTarget);
    var parentAlternateFiber = parentFiber.alternate;
    var node = childFiber;

    while (node !== null) {
      if (node === parentFiber || node === parentAlternateFiber) {
        return true;
      }

      node = node.return;
    }

    return false;
  },
  addRootEventTypes: function(rootEventTypes) {
    validateResponderContext();
    var activeDocument = getActiveDocument();
    listenToResponderEventTypesImpl(rootEventTypes, activeDocument);

    for (var i = 0; i < rootEventTypes.length; i++) {
      var rootEventType = rootEventTypes[i];
      var eventResponderInstance = currentInstance;
      registerRootEventType(rootEventType, eventResponderInstance);
    }
  },
  removeRootEventTypes: function(rootEventTypes) {
    validateResponderContext();

    for (var i = 0; i < rootEventTypes.length; i++) {
      var rootEventType = rootEventTypes[i];
      var rootEventResponders = rootEventTypesToEventResponderInstances.get(
        rootEventType
      );
      var rootEventTypesSet = currentInstance.rootEventTypes;

      if (rootEventTypesSet !== null) {
        rootEventTypesSet.delete(rootEventType);
      }

      if (rootEventResponders !== undefined) {
        rootEventResponders.delete(currentInstance);
      }
    }
  },
  setTimeout: function(func, delay) {
    validateResponderContext();

    if (currentTimers === null) {
      currentTimers = new Map();
    }

    var timeout = currentTimers.get(delay);
    var timerId = currentTimerIDCounter++;

    if (timeout === undefined) {
      var timers = new Map();
      var id = setTimeout(function() {
        processTimers(timers, delay);
      }, delay);
      timeout = {
        id: id,
        timers: timers
      };
      currentTimers.set(delay, timeout);
    }

    timeout.timers.set(timerId, {
      instance: currentInstance,
      func: func,
      id: timerId,
      timeStamp: currentTimeStamp
    });
    activeTimeouts.set(timerId, timeout);
    return timerId;
  },
  clearTimeout: function(timerId) {
    validateResponderContext();
    var timeout = activeTimeouts.get(timerId);

    if (timeout !== undefined) {
      var timers = timeout.timers;
      timers.delete(timerId);

      if (timers.size === 0) {
        clearTimeout(timeout.id);
      }
    }
  },
  getFocusableElementsInScope: function(deep) {
    validateResponderContext();
    var focusableElements = [];
    var eventResponderInstance = currentInstance;
    var currentResponder = eventResponderInstance.responder;
    var focusScopeFiber = eventResponderInstance.fiber;

    if (deep) {
      var deepNode = focusScopeFiber.return;

      while (deepNode !== null) {
        if (doesFiberHaveResponder(deepNode, currentResponder)) {
          focusScopeFiber = deepNode;
        }

        deepNode = deepNode.return;
      }
    }

    var child = focusScopeFiber.child;

    if (child !== null) {
      collectFocusableElements(child, focusableElements);
    }

    return focusableElements;
  },
  getActiveDocument: getActiveDocument,
  objectAssign: Object.assign,
  getTimeStamp: function() {
    validateResponderContext();
    return currentTimeStamp;
  },
  isTargetWithinHostComponent: function(target, elementType) {
    validateResponderContext();
    var fiber = getClosestInstanceFromNode(target);

    while (fiber !== null) {
      if (fiber.tag === HostComponent && fiber.type === elementType) {
        return true;
      }

      fiber = fiber.return;
    }

    return false;
  },
  enqueueStateRestore: enqueueStateRestore
};

function validateEventValue(eventValue) {
  if (typeof eventValue === "object" && eventValue !== null) {
    var target = eventValue.target,
      type = eventValue.type,
      timeStamp = eventValue.timeStamp;

    if (target == null || type == null || timeStamp == null) {
      throw new Error(
        'context.dispatchEvent: "target", "timeStamp", and "type" fields on event object are required.'
      );
    }

    eventValue.preventDefault = function() {};

    eventValue.stopPropagation = function() {};

    eventValue.isDefaultPrevented = function() {};

    eventValue.isPropagationStopped = function() {}; // $FlowFixMe: we don't need value, Flow thinks we do

    Object.defineProperty(eventValue, "nativeEvent", {
      get: function() {}
    });
  }
}

function collectFocusableElements(node, focusableElements) {
  if (isFiberSuspenseAndTimedOut(node)) {
    var fallbackChild = getSuspenseFallbackChild(node);

    if (fallbackChild !== null) {
      collectFocusableElements(fallbackChild, focusableElements);
    }
  } else {
    if (isFiberHostComponentFocusable(node)) {
      focusableElements.push(node.stateNode);
    } else {
      var child = node.child;

      if (child !== null) {
        collectFocusableElements(child, focusableElements);
      }
    }
  }

  var sibling = node.sibling;

  if (sibling !== null) {
    collectFocusableElements(sibling, focusableElements);
  }
}

function doesFiberHaveResponder(fiber, responder) {
  if (fiber.tag === HostComponent) {
    var dependencies = fiber.dependencies;

    if (dependencies !== null) {
      var respondersMap = dependencies.responders;

      if (respondersMap !== null && respondersMap.has(responder)) {
        return true;
      }
    }
  }

  return false;
}

function getActiveDocument() {
  return currentDocument;
}

function isFiberHostComponentFocusable(fiber) {
  if (fiber.tag !== HostComponent) {
    return false;
  }

  var type = fiber.type,
    memoizedProps = fiber.memoizedProps;

  if (memoizedProps.tabIndex === -1 || memoizedProps.disabled) {
    return false;
  }

  if (memoizedProps.tabIndex === 0 || memoizedProps.contentEditable === true) {
    return true;
  }

  if (type === "a" || type === "area") {
    return !!memoizedProps.href && memoizedProps.rel !== "ignore";
  }

  if (type === "input") {
    return memoizedProps.type !== "hidden" && memoizedProps.type !== "file";
  }

  return (
    type === "button" ||
    type === "textarea" ||
    type === "object" ||
    type === "select" ||
    type === "iframe" ||
    type === "embed"
  );
}

function processTimers(timers, delay) {
  var timersArr = Array.from(timers.values());

  try {
    batchedEventUpdates(function() {
      for (var i = 0; i < timersArr.length; i++) {
        var _timersArr$i = timersArr[i],
          instance = _timersArr$i.instance,
          func = _timersArr$i.func,
          id = _timersArr$i.id,
          timeStamp = _timersArr$i.timeStamp;
        currentInstance = instance;
        currentTimeStamp = timeStamp + delay;

        try {
          func();
        } finally {
          activeTimeouts.delete(id);
        }
      }
    });
  } finally {
    currentTimers = null;
    currentInstance = null;
    currentTimeStamp = 0;
  }
}

function createDOMResponderEvent(
  topLevelType,
  nativeEvent,
  nativeEventTarget,
  passive,
  passiveSupported
) {
  var _ref = nativeEvent,
    buttons = _ref.buttons,
    pointerType = _ref.pointerType;
  var eventPointerType = "";
  var pointerId = null;

  if (pointerType !== undefined) {
    eventPointerType = pointerType;
    pointerId = nativeEvent.pointerId;
  } else if (nativeEvent.key !== undefined) {
    eventPointerType = "keyboard";
  } else if (buttons !== undefined) {
    eventPointerType = "mouse";
  } else if (nativeEvent.changedTouches !== undefined) {
    eventPointerType = "touch";
  }

  return {
    nativeEvent: nativeEvent,
    passive: passive,
    passiveSupported: passiveSupported,
    pointerId: pointerId,
    pointerType: eventPointerType,
    responderTarget: null,
    target: nativeEventTarget,
    type: topLevelType
  };
}

function responderEventTypesContainType(eventTypes, type) {
  for (var i = 0, len = eventTypes.length; i < len; i++) {
    if (eventTypes[i] === type) {
      return true;
    }
  }

  return false;
}

function validateResponderTargetEventTypes(eventType, responder) {
  var targetEventTypes = responder.targetEventTypes; // Validate the target event type exists on the responder

  if (targetEventTypes !== null) {
    return responderEventTypesContainType(targetEventTypes, eventType);
  }

  return false;
}

function traverseAndHandleEventResponderInstances(
  topLevelType,
  targetFiber,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags
) {
  var isPassiveEvent = (eventSystemFlags & IS_PASSIVE) !== 0;
  var isPassiveSupported = (eventSystemFlags & PASSIVE_NOT_SUPPORTED) === 0;
  var isPassive = isPassiveEvent || !isPassiveSupported;
  var eventType = isPassive ? topLevelType : topLevelType + "_active"; // Trigger event responders in this order:
  // - Bubble target responder phase
  // - Root responder phase

  var visitedResponders = new Set();
  var responderEvent = createDOMResponderEvent(
    topLevelType,
    nativeEvent,
    nativeEventTarget,
    isPassiveEvent,
    isPassiveSupported
  );
  var node = targetFiber;

  while (node !== null) {
    var _node = node,
      dependencies = _node.dependencies,
      tag = _node.tag;

    if (tag === HostComponent && dependencies !== null) {
      var respondersMap = dependencies.responders;

      if (respondersMap !== null) {
        var responderInstances = Array.from(respondersMap.values());

        for (var i = 0, length = responderInstances.length; i < length; i++) {
          var responderInstance = responderInstances[i];
          var props = responderInstance.props,
            responder = responderInstance.responder,
            state = responderInstance.state,
            target = responderInstance.target;

          if (
            !visitedResponders.has(responder) &&
            validateResponderTargetEventTypes(eventType, responder)
          ) {
            visitedResponders.add(responder);
            var onEvent = responder.onEvent;

            if (onEvent !== null) {
              currentInstance = responderInstance;
              responderEvent.responderTarget = target;
              onEvent(responderEvent, eventResponderContext, props, state);
            }
          }
        }
      }
    }

    node = node.return;
  } // Root phase

  var rootEventResponderInstances = rootEventTypesToEventResponderInstances.get(
    eventType
  );

  if (rootEventResponderInstances !== undefined) {
    var _responderInstances = Array.from(rootEventResponderInstances);

    for (var _i = 0; _i < _responderInstances.length; _i++) {
      var _responderInstance = _responderInstances[_i];
      var props = _responderInstance.props,
        responder = _responderInstance.responder,
        state = _responderInstance.state,
        target = _responderInstance.target;
      var onRootEvent = responder.onRootEvent;

      if (onRootEvent !== null) {
        currentInstance = _responderInstance;
        responderEvent.responderTarget = target;
        onRootEvent(responderEvent, eventResponderContext, props, state);
      }
    }
  }
}

function mountEventResponder(responder, responderInstance, props, state) {
  var onMount = responder.onMount;

  if (onMount !== null) {
    currentInstance = responderInstance;

    try {
      batchedEventUpdates(function() {
        onMount(eventResponderContext, props, state);
      });
    } finally {
      currentInstance = null;
      currentTimers = null;
    }
  }
}
function unmountEventResponder(responderInstance) {
  var responder = responderInstance.responder;
  var onUnmount = responder.onUnmount;

  if (onUnmount !== null) {
    var props = responderInstance.props,
      state = responderInstance.state;
    currentInstance = responderInstance;

    try {
      batchedEventUpdates(function() {
        onUnmount(eventResponderContext, props, state);
      });
    } finally {
      currentInstance = null;
      currentTimers = null;
    }
  }

  var rootEventTypesSet = responderInstance.rootEventTypes;

  if (rootEventTypesSet !== null) {
    var rootEventTypes = Array.from(rootEventTypesSet);

    for (var i = 0; i < rootEventTypes.length; i++) {
      var topLevelEventType = rootEventTypes[i];
      var rootEventResponderInstances = rootEventTypesToEventResponderInstances.get(
        topLevelEventType
      );

      if (rootEventResponderInstances !== undefined) {
        rootEventResponderInstances.delete(responderInstance);
      }
    }
  }
}

function validateResponderContext() {
  (function() {
    if (!(currentInstance !== null)) {
      {
        throw ReactErrorProd(Error(324));
      }
    }
  })();
}

function dispatchEventForResponderEventSystem(
  topLevelType,
  targetFiber,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags
) {
  if (enableFlareAPI) {
    var previousInstance = currentInstance;
    var previousTimers = currentTimers;
    var previousTimeStamp = currentTimeStamp;
    var previousDocument = currentDocument;
    currentTimers = null; // nodeType 9 is DOCUMENT_NODE

    currentDocument =
      nativeEventTarget.nodeType === 9
        ? nativeEventTarget
        : nativeEventTarget.ownerDocument; // We might want to control timeStamp another way here

    currentTimeStamp = nativeEvent.timeStamp;

    try {
      batchedEventUpdates(function() {
        traverseAndHandleEventResponderInstances(
          topLevelType,
          targetFiber,
          nativeEvent,
          nativeEventTarget,
          eventSystemFlags
        );
      });
    } finally {
      currentTimers = previousTimers;
      currentInstance = previousInstance;
      currentTimeStamp = previousTimeStamp;
      currentDocument = previousDocument;
    }
  }
}
function addRootEventTypesForResponderInstance(
  responderInstance,
  rootEventTypes
) {
  for (var i = 0; i < rootEventTypes.length; i++) {
    var rootEventType = rootEventTypes[i];
    registerRootEventType(rootEventType, responderInstance);
  }
}

function registerRootEventType(rootEventType, eventResponderInstance) {
  var rootEventResponderInstances = rootEventTypesToEventResponderInstances.get(
    rootEventType
  );

  if (rootEventResponderInstances === undefined) {
    rootEventResponderInstances = new Set();
    rootEventTypesToEventResponderInstances.set(
      rootEventType,
      rootEventResponderInstances
    );
  }

  var rootEventTypesSet = eventResponderInstance.rootEventTypes;

  if (rootEventTypesSet === null) {
    rootEventTypesSet = eventResponderInstance.rootEventTypes = new Set();
  }

  (function() {
    if (!!rootEventTypesSet.has(rootEventType)) {
      {
        throw ReactErrorProd(Error(325), rootEventType);
      }
    }
  })();

  rootEventTypesSet.add(rootEventType);
  rootEventResponderInstances.add(eventResponderInstance);
}

var EventListenerWWW = require("EventListener");

function addEventBubbleListener(element, eventType, listener) {
  EventListenerWWW.listen(element, eventType, listener);
}
function addEventCaptureListener(element, eventType, listener) {
  EventListenerWWW.capture(element, eventType, listener);
}
function addEventCaptureListenerWithPassiveFlag(
  element,
  eventType,
  listener,
  passive
) {
  EventListenerWWW.captureWithPassiveFlag(
    element,
    eventType,
    listener,
    passive
  );
} // Flow magic to verify the exports of this file match the original version.

/**
 * @interface Event
 * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
 */

var SyntheticAnimationEvent = SyntheticEvent.extend({
  animationName: null,
  elapsedTime: null,
  pseudoElement: null
});

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */

var SyntheticClipboardEvent = SyntheticEvent.extend({
  clipboardData: function(event) {
    return "clipboardData" in event
      ? event.clipboardData
      : window.clipboardData;
  }
});

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var SyntheticFocusEvent = SyntheticUIEvent.extend({
  relatedTarget: null
});

/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {number} Normalized `charCode` property.
 */
function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ("charCode" in nativeEvent) {
    charCode = nativeEvent.charCode; // FF does not set `charCode` for the Enter-key, check against `keyCode`.

    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  } // IE and Edge (on Windows) and Chrome / Safari (on Windows and Linux)
  // report Enter as charCode 10 when ctrl is pressed.

  if (charCode === 10) {
    charCode = 13;
  } // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.

  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */

var normalizeKey = {
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
};
/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */

var translateToKey = {
  "8": "Backspace",
  "9": "Tab",
  "12": "Clear",
  "13": "Enter",
  "16": "Shift",
  "17": "Control",
  "18": "Alt",
  "19": "Pause",
  "20": "CapsLock",
  "27": "Escape",
  "32": " ",
  "33": "PageUp",
  "34": "PageDown",
  "35": "End",
  "36": "Home",
  "37": "ArrowLeft",
  "38": "ArrowUp",
  "39": "ArrowRight",
  "40": "ArrowDown",
  "45": "Insert",
  "46": "Delete",
  "112": "F1",
  "113": "F2",
  "114": "F3",
  "115": "F4",
  "116": "F5",
  "117": "F6",
  "118": "F7",
  "119": "F8",
  "120": "F9",
  "121": "F10",
  "122": "F11",
  "123": "F12",
  "144": "NumLock",
  "145": "ScrollLock",
  "224": "Meta"
};
/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */

function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.
    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;

    if (key !== "Unidentified") {
      return key;
    }
  } // Browser does not implement `key`, polyfill as much of it as we can.

  if (nativeEvent.type === "keypress") {
    var charCode = getEventCharCode(nativeEvent); // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.

    return charCode === 13 ? "Enter" : String.fromCharCode(charCode);
  }

  if (nativeEvent.type === "keydown" || nativeEvent.type === "keyup") {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || "Unidentified";
  }

  return "";
}

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var SyntheticKeyboardEvent = SyntheticUIEvent.extend({
  key: getEventKey,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: getEventModifierState,
  // Legacy Interface
  charCode: function(event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.
    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === "keypress") {
      return getEventCharCode(event);
    }

    return 0;
  },
  keyCode: function(event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.
    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === "keydown" || event.type === "keyup") {
      return event.keyCode;
    }

    return 0;
  },
  which: function(event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === "keypress") {
      return getEventCharCode(event);
    }

    if (event.type === "keydown" || event.type === "keyup") {
      return event.keyCode;
    }

    return 0;
  }
});

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var SyntheticDragEvent = SyntheticMouseEvent.extend({
  dataTransfer: null
});

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */

var SyntheticTouchEvent = SyntheticUIEvent.extend({
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState
});

/**
 * @interface Event
 * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
 */

var SyntheticTransitionEvent = SyntheticEvent.extend({
  propertyName: null,
  elapsedTime: null,
  pseudoElement: null
});

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */

var SyntheticWheelEvent = SyntheticMouseEvent.extend({
  deltaX: function(event) {
    return "deltaX" in event
      ? event.deltaX // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      : "wheelDeltaX" in event
        ? -event.wheelDeltaX
        : 0;
  },
  deltaY: function(event) {
    return "deltaY" in event
      ? event.deltaY // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      : "wheelDeltaY" in event
        ? -event.wheelDeltaY // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
        : "wheelDelta" in event
          ? -event.wheelDelta
          : 0;
  },
  deltaZ: null,
  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
});

/**
 * Turns
 * ['abort', ...]
 * into
 * eventTypes = {
 *   'abort': {
 *     phasedRegistrationNames: {
 *       bubbled: 'onAbort',
 *       captured: 'onAbortCapture',
 *     },
 *     dependencies: [TOP_ABORT],
 *   },
 *   ...
 * };
 * topLevelEventsToDispatchConfig = new Map([
 *   [TOP_ABORT, { sameConfig }],
 * ]);
 */

var eventTuples = [
  // Discrete events
  [TOP_BLUR, "blur", DiscreteEvent],
  [TOP_CANCEL, "cancel", DiscreteEvent],
  [TOP_CLICK, "click", DiscreteEvent],
  [TOP_CLOSE, "close", DiscreteEvent],
  [TOP_CONTEXT_MENU, "contextMenu", DiscreteEvent],
  [TOP_COPY, "copy", DiscreteEvent],
  [TOP_CUT, "cut", DiscreteEvent],
  [TOP_AUX_CLICK, "auxClick", DiscreteEvent],
  [TOP_DOUBLE_CLICK, "doubleClick", DiscreteEvent],
  [TOP_DRAG_END, "dragEnd", DiscreteEvent],
  [TOP_DRAG_START, "dragStart", DiscreteEvent],
  [TOP_DROP, "drop", DiscreteEvent],
  [TOP_FOCUS, "focus", DiscreteEvent],
  [TOP_INPUT, "input", DiscreteEvent],
  [TOP_INVALID, "invalid", DiscreteEvent],
  [TOP_KEY_DOWN, "keyDown", DiscreteEvent],
  [TOP_KEY_PRESS, "keyPress", DiscreteEvent],
  [TOP_KEY_UP, "keyUp", DiscreteEvent],
  [TOP_MOUSE_DOWN, "mouseDown", DiscreteEvent],
  [TOP_MOUSE_UP, "mouseUp", DiscreteEvent],
  [TOP_PASTE, "paste", DiscreteEvent],
  [TOP_PAUSE, "pause", DiscreteEvent],
  [TOP_PLAY, "play", DiscreteEvent],
  [TOP_POINTER_CANCEL, "pointerCancel", DiscreteEvent],
  [TOP_POINTER_DOWN, "pointerDown", DiscreteEvent],
  [TOP_POINTER_UP, "pointerUp", DiscreteEvent],
  [TOP_RATE_CHANGE, "rateChange", DiscreteEvent],
  [TOP_RESET, "reset", DiscreteEvent],
  [TOP_SEEKED, "seeked", DiscreteEvent],
  [TOP_SUBMIT, "submit", DiscreteEvent],
  [TOP_TOUCH_CANCEL, "touchCancel", DiscreteEvent],
  [TOP_TOUCH_END, "touchEnd", DiscreteEvent],
  [TOP_TOUCH_START, "touchStart", DiscreteEvent],
  [TOP_VOLUME_CHANGE, "volumeChange", DiscreteEvent], // User-blocking events
  [TOP_DRAG, "drag", UserBlockingEvent],
  [TOP_DRAG_ENTER, "dragEnter", UserBlockingEvent],
  [TOP_DRAG_EXIT, "dragExit", UserBlockingEvent],
  [TOP_DRAG_LEAVE, "dragLeave", UserBlockingEvent],
  [TOP_DRAG_OVER, "dragOver", UserBlockingEvent],
  [TOP_MOUSE_MOVE, "mouseMove", UserBlockingEvent],
  [TOP_MOUSE_OUT, "mouseOut", UserBlockingEvent],
  [TOP_MOUSE_OVER, "mouseOver", UserBlockingEvent],
  [TOP_POINTER_MOVE, "pointerMove", UserBlockingEvent],
  [TOP_POINTER_OUT, "pointerOut", UserBlockingEvent],
  [TOP_POINTER_OVER, "pointerOver", UserBlockingEvent],
  [TOP_SCROLL, "scroll", UserBlockingEvent],
  [TOP_TOGGLE, "toggle", UserBlockingEvent],
  [TOP_TOUCH_MOVE, "touchMove", UserBlockingEvent],
  [TOP_WHEEL, "wheel", UserBlockingEvent], // Continuous events
  [TOP_ABORT, "abort", ContinuousEvent],
  [TOP_ANIMATION_END, "animationEnd", ContinuousEvent],
  [TOP_ANIMATION_ITERATION, "animationIteration", ContinuousEvent],
  [TOP_ANIMATION_START, "animationStart", ContinuousEvent],
  [TOP_CAN_PLAY, "canPlay", ContinuousEvent],
  [TOP_CAN_PLAY_THROUGH, "canPlayThrough", ContinuousEvent],
  [TOP_DURATION_CHANGE, "durationChange", ContinuousEvent],
  [TOP_EMPTIED, "emptied", ContinuousEvent],
  [TOP_ENCRYPTED, "encrypted", ContinuousEvent],
  [TOP_ENDED, "ended", ContinuousEvent],
  [TOP_ERROR, "error", ContinuousEvent],
  [TOP_GOT_POINTER_CAPTURE, "gotPointerCapture", ContinuousEvent],
  [TOP_LOAD, "load", ContinuousEvent],
  [TOP_LOADED_DATA, "loadedData", ContinuousEvent],
  [TOP_LOADED_METADATA, "loadedMetadata", ContinuousEvent],
  [TOP_LOAD_START, "loadStart", ContinuousEvent],
  [TOP_LOST_POINTER_CAPTURE, "lostPointerCapture", ContinuousEvent],
  [TOP_PLAYING, "playing", ContinuousEvent],
  [TOP_PROGRESS, "progress", ContinuousEvent],
  [TOP_SEEKING, "seeking", ContinuousEvent],
  [TOP_STALLED, "stalled", ContinuousEvent],
  [TOP_SUSPEND, "suspend", ContinuousEvent],
  [TOP_TIME_UPDATE, "timeUpdate", ContinuousEvent],
  [TOP_TRANSITION_END, "transitionEnd", ContinuousEvent],
  [TOP_WAITING, "waiting", ContinuousEvent]
];
var eventTypes$4 = {};
var topLevelEventsToDispatchConfig = {};

for (var i = 0; i < eventTuples.length; i++) {
  var eventTuple = eventTuples[i];
  var topEvent = eventTuple[0];
  var event = eventTuple[1];
  var eventPriority = eventTuple[2];
  var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
  var onEvent = "on" + capitalizedEvent;
  var config = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + "Capture"
    },
    dependencies: [topEvent],
    eventPriority: eventPriority
  };
  eventTypes$4[event] = config;
  topLevelEventsToDispatchConfig[topEvent] = config;
} // Only used in DEV for exhaustiveness validation.

var SimpleEventPlugin = {
  eventTypes: eventTypes$4,
  getEventPriority: function(topLevelType) {
    var config = topLevelEventsToDispatchConfig[topLevelType];
    return config !== undefined ? config.eventPriority : ContinuousEvent;
  },
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];

    if (!dispatchConfig) {
      return null;
    }

    var EventConstructor;

    switch (topLevelType) {
      case TOP_KEY_PRESS:
        // Firefox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode(nativeEvent) === 0) {
          return null;
        }

      /* falls through */

      case TOP_KEY_DOWN:
      case TOP_KEY_UP:
        EventConstructor = SyntheticKeyboardEvent;
        break;

      case TOP_BLUR:
      case TOP_FOCUS:
        EventConstructor = SyntheticFocusEvent;
        break;

      case TOP_CLICK:
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }

      /* falls through */

      case TOP_AUX_CLICK:
      case TOP_DOUBLE_CLICK:
      case TOP_MOUSE_DOWN:
      case TOP_MOUSE_MOVE:
      case TOP_MOUSE_UP: // TODO: Disabled elements should not respond to mouse events

      /* falls through */

      case TOP_MOUSE_OUT:
      case TOP_MOUSE_OVER:
      case TOP_CONTEXT_MENU:
        EventConstructor = SyntheticMouseEvent;
        break;

      case TOP_DRAG:
      case TOP_DRAG_END:
      case TOP_DRAG_ENTER:
      case TOP_DRAG_EXIT:
      case TOP_DRAG_LEAVE:
      case TOP_DRAG_OVER:
      case TOP_DRAG_START:
      case TOP_DROP:
        EventConstructor = SyntheticDragEvent;
        break;

      case TOP_TOUCH_CANCEL:
      case TOP_TOUCH_END:
      case TOP_TOUCH_MOVE:
      case TOP_TOUCH_START:
        EventConstructor = SyntheticTouchEvent;
        break;

      case TOP_ANIMATION_END:
      case TOP_ANIMATION_ITERATION:
      case TOP_ANIMATION_START:
        EventConstructor = SyntheticAnimationEvent;
        break;

      case TOP_TRANSITION_END:
        EventConstructor = SyntheticTransitionEvent;
        break;

      case TOP_SCROLL:
        EventConstructor = SyntheticUIEvent;
        break;

      case TOP_WHEEL:
        EventConstructor = SyntheticWheelEvent;
        break;

      case TOP_COPY:
      case TOP_CUT:
      case TOP_PASTE:
        EventConstructor = SyntheticClipboardEvent;
        break;

      case TOP_GOT_POINTER_CAPTURE:
      case TOP_LOST_POINTER_CAPTURE:
      case TOP_POINTER_CANCEL:
      case TOP_POINTER_DOWN:
      case TOP_POINTER_MOVE:
      case TOP_POINTER_OUT:
      case TOP_POINTER_OVER:
      case TOP_POINTER_UP:
        EventConstructor = SyntheticPointerEvent;
        break;

      default:
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0

        EventConstructor = SyntheticEvent;
        break;
    }

    var event = EventConstructor.getPooled(
      dispatchConfig,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );
    accumulateTwoPhaseDispatches(event);
    return event;
  }
};

var passiveBrowserEventsSupported = false; // Check if browser support events with passive listeners
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support

if (enableFlareAPI && canUseDOM) {
  try {
    var options = {}; // $FlowFixMe: Ignore Flow complaining about needing a value

    Object.defineProperty(options, "passive", {
      get: function() {
        passiveBrowserEventsSupported = true;
      }
    });
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, options);
  } catch (e) {
    passiveBrowserEventsSupported = false;
  }
}

// Intentionally not named imports because Rollup would use dynamic dispatch for
// CommonJS interop named imports.
var UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
var runWithPriority = Scheduler.unstable_runWithPriority;
var getEventPriority = SimpleEventPlugin.getEventPriority;
var CALLBACK_BOOKKEEPING_POOL_SIZE = 10;
var callbackBookkeepingPool = [];

/**
 * Find the deepest React component completely containing the root of the
 * passed-in instance (for use when entire React trees are nested within each
 * other). If React trees are not nested, returns null.
 */
function findRootContainerNode(inst) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  while (inst.return) {
    inst = inst.return;
  }

  if (inst.tag !== HostRoot) {
    // This can happen if we're in a detached tree.
    return null;
  }

  return inst.stateNode.containerInfo;
} // Used to store ancestor hierarchy in top level callback

function getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst) {
  if (callbackBookkeepingPool.length) {
    var instance = callbackBookkeepingPool.pop();
    instance.topLevelType = topLevelType;
    instance.nativeEvent = nativeEvent;
    instance.targetInst = targetInst;
    return instance;
  }

  return {
    topLevelType: topLevelType,
    nativeEvent: nativeEvent,
    targetInst: targetInst,
    ancestors: []
  };
}

function releaseTopLevelCallbackBookKeeping(instance) {
  instance.topLevelType = null;
  instance.nativeEvent = null;
  instance.targetInst = null;
  instance.ancestors.length = 0;

  if (callbackBookkeepingPool.length < CALLBACK_BOOKKEEPING_POOL_SIZE) {
    callbackBookkeepingPool.push(instance);
  }
}

function handleTopLevel(bookKeeping) {
  var targetInst = bookKeeping.targetInst; // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.

  var ancestor = targetInst;

  do {
    if (!ancestor) {
      var ancestors = bookKeeping.ancestors;
      ancestors.push(ancestor);
      break;
    }

    var root = findRootContainerNode(ancestor);

    if (!root) {
      break;
    }

    bookKeeping.ancestors.push(ancestor);
    ancestor = getClosestInstanceFromNode(root);
  } while (ancestor);

  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];
    var eventTarget = getEventTarget(bookKeeping.nativeEvent);
    var topLevelType = bookKeeping.topLevelType;
    var nativeEvent = bookKeeping.nativeEvent;
    runExtractedPluginEventsInBatch(
      topLevelType,
      targetInst,
      nativeEvent,
      eventTarget
    );
  }
} // TODO: can we stop exporting these?

var _enabled = true;
function setEnabled(enabled) {
  _enabled = !!enabled;
}
function isEnabled() {
  return _enabled;
}
function trapBubbledEvent(topLevelType, element) {
  trapEventForPluginEventSystem(element, topLevelType, false);
}
function trapCapturedEvent(topLevelType, element) {
  trapEventForPluginEventSystem(element, topLevelType, true);
}
function trapEventForResponderEventSystem(element, topLevelType, passive) {
  if (enableFlareAPI) {
    var rawEventName = getRawEventName(topLevelType);
    var eventFlags = RESPONDER_EVENT_SYSTEM; // If passive option is not supported, then the event will be
    // active and not passive, but we flag it as using not being
    // supported too. This way the responder event plugins know,
    // and can provide polyfills if needed.

    if (passive) {
      if (passiveBrowserEventsSupported) {
        eventFlags |= IS_PASSIVE;
      } else {
        eventFlags |= IS_ACTIVE;
        eventFlags |= PASSIVE_NOT_SUPPORTED;
        passive = false;
      }
    } else {
      eventFlags |= IS_ACTIVE;
    } // Check if interactive and wrap in discreteUpdates

    var listener = dispatchEvent.bind(null, topLevelType, eventFlags);

    if (passiveBrowserEventsSupported) {
      addEventCaptureListenerWithPassiveFlag(
        element,
        rawEventName,
        listener,
        passive
      );
    } else {
      addEventCaptureListener(element, rawEventName, listener);
    }
  }
}

function trapEventForPluginEventSystem(element, topLevelType, capture) {
  var listener;

  switch (getEventPriority(topLevelType)) {
    case DiscreteEvent:
      listener = dispatchDiscreteEvent.bind(
        null,
        topLevelType,
        PLUGIN_EVENT_SYSTEM
      );
      break;

    case UserBlockingEvent:
      listener = dispatchUserBlockingUpdate.bind(
        null,
        topLevelType,
        PLUGIN_EVENT_SYSTEM
      );
      break;

    case ContinuousEvent:
    default:
      listener = dispatchEvent.bind(null, topLevelType, PLUGIN_EVENT_SYSTEM);
      break;
  }

  var rawEventName = getRawEventName(topLevelType);

  if (capture) {
    addEventCaptureListener(element, rawEventName, listener);
  } else {
    addEventBubbleListener(element, rawEventName, listener);
  }
}

function dispatchDiscreteEvent(topLevelType, eventSystemFlags, nativeEvent) {
  flushDiscreteUpdatesIfNeeded(nativeEvent.timeStamp);
  discreteUpdates(dispatchEvent, topLevelType, eventSystemFlags, nativeEvent);
}

function dispatchUserBlockingUpdate(
  topLevelType,
  eventSystemFlags,
  nativeEvent
) {
  if (enableUserBlockingEvents) {
    runWithPriority(
      UserBlockingPriority,
      dispatchEvent.bind(null, topLevelType, eventSystemFlags, nativeEvent)
    );
  } else {
    dispatchEvent(topLevelType, eventSystemFlags, nativeEvent);
  }
}

function dispatchEventForPluginEventSystem(
  topLevelType,
  eventSystemFlags,
  nativeEvent,
  targetInst
) {
  var bookKeeping = getTopLevelCallbackBookKeeping(
    topLevelType,
    nativeEvent,
    targetInst
  );

  try {
    // Event queue being processed in the same cycle allows
    // `preventDefault`.
    batchedEventUpdates(handleTopLevel, bookKeeping);
  } finally {
    releaseTopLevelCallbackBookKeeping(bookKeeping);
  }
}

function dispatchEvent(topLevelType, eventSystemFlags, nativeEvent) {
  if (!_enabled) {
    return;
  }

  var nativeEventTarget = getEventTarget(nativeEvent);
  var targetInst = getClosestInstanceFromNode(nativeEventTarget);

  if (
    targetInst !== null &&
    typeof targetInst.tag === "number" &&
    !isFiberMounted(targetInst)
  ) {
    // If we get an event (ex: img onload) before committing that
    // component's mount, ignore it for now (that is, treat it as if it was an
    // event on a non-React tree). We might also consider queueing events and
    // dispatching them after the mount.
    targetInst = null;
  }

  if (enableFlareAPI) {
    if (eventSystemFlags === PLUGIN_EVENT_SYSTEM) {
      dispatchEventForPluginEventSystem(
        topLevelType,
        eventSystemFlags,
        nativeEvent,
        targetInst
      );
    } else {
      // React Flare event system
      dispatchEventForResponderEventSystem(
        topLevelType,
        targetInst,
        nativeEvent,
        nativeEventTarget,
        eventSystemFlags
      );
    }
  } else {
    dispatchEventForPluginEventSystem(
      topLevelType,
      eventSystemFlags,
      nativeEvent,
      targetInst
    );
  }
}

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactDOMEventListener, which is injected and can therefore support
 *    pluggable event sources. This is the only work that occurs in the main
 *    thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
var elementListeningSets = new PossiblyWeakMap();
function getListeningSetForElement(element) {
  var listeningSet = elementListeningSets.get(element);

  if (listeningSet === undefined) {
    listeningSet = new Set();
    elementListeningSets.set(element, listeningSet);
  }

  return listeningSet;
}
/**
 * We listen for bubbled touch events on the document object.
 *
 * Firefox v8.01 (and possibly others) exhibited strange behavior when
 * mounting `onmousemove` events at some node that was not the document
 * element. The symptoms were that if your mouse is not moving over something
 * contained within that mount point (for example on the background) the
 * top-level listeners for `onmousemove` won't be called. However, if you
 * register the `mousemove` on the document object, then it will of course
 * catch all `mousemove`s. This along with iOS quirks, justifies restricting
 * top-level listeners to the document object only, at least for these
 * movement types of events and possibly all events.
 *
 * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
 *
 * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
 * they bubble to document.
 *
 * @param {string} registrationName Name of listener (e.g. `onClick`).
 * @param {object} mountAt Container where to mount the listener
 */

function listenTo(registrationName, mountAt) {
  var listeningSet = getListeningSetForElement(mountAt);
  var dependencies = registrationNameDependencies[registrationName];

  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i];

    if (!listeningSet.has(dependency)) {
      switch (dependency) {
        case TOP_SCROLL:
          trapCapturedEvent(TOP_SCROLL, mountAt);
          break;

        case TOP_FOCUS:
        case TOP_BLUR:
          trapCapturedEvent(TOP_FOCUS, mountAt);
          trapCapturedEvent(TOP_BLUR, mountAt); // We set the flag for a single dependency later in this function,
          // but this ensures we mark both as attached rather than just one.

          listeningSet.add(TOP_BLUR);
          listeningSet.add(TOP_FOCUS);
          break;

        case TOP_CANCEL:
        case TOP_CLOSE:
          if (isEventSupported(getRawEventName(dependency))) {
            trapCapturedEvent(dependency, mountAt);
          }

          break;

        case TOP_INVALID:
        case TOP_SUBMIT:
        case TOP_RESET:
          // We listen to them on the target DOM elements.
          // Some of them bubble so we don't want them to fire twice.
          break;

        default:
          // By default, listen on the top level to all non-media events.
          // Media events don't bubble so adding the listener wouldn't do anything.
          var isMediaEvent = mediaEventTypes.indexOf(dependency) !== -1;

          if (!isMediaEvent) {
            trapBubbledEvent(dependency, mountAt);
          }

          break;
      }

      listeningSet.add(dependency);
    }
  }
}
function isListeningToAllDependencies(registrationName, mountAt) {
  var listeningSet = getListeningSetForElement(mountAt);
  var dependencies = registrationNameDependencies[registrationName];

  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i];

    if (!listeningSet.has(dependency)) {
      return false;
    }
  }

  return true;
}

function getActiveElement(doc) {
  doc = doc || (typeof document !== "undefined" ? document : undefined);

  if (typeof doc === "undefined") {
    return null;
  }

  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */

function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }

  return node;
}
/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */

function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }

    node = node.parentNode;
  }
}
/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */

function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType === TEXT_NODE) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

/**
 * @param {DOMElement} outerNode
 * @return {?object}
 */

function getOffsets(outerNode) {
  var ownerDocument = outerNode.ownerDocument;
  var win = (ownerDocument && ownerDocument.defaultView) || window;
  var selection = win.getSelection && win.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode,
    anchorOffset = selection.anchorOffset,
    focusNode = selection.focusNode,
    focusOffset = selection.focusOffset; // In Firefox, anchorNode and focusNode can be "anonymous divs", e.g. the
  // up/down buttons on an <input type="number">. Anonymous divs do not seem to
  // expose properties, triggering a "Permission denied error" if any of its
  // properties are accessed. The only seemingly possible way to avoid erroring
  // is to access a property that typically works for non-anonymous divs and
  // catch any error that may otherwise arise. See
  // https://bugzilla.mozilla.org/show_bug.cgi?id=208427

  try {
    /* eslint-disable no-unused-expressions */
    anchorNode.nodeType;
    focusNode.nodeType;
    /* eslint-enable no-unused-expressions */
  } catch (e) {
    return null;
  }

  return getModernOffsetsFromPoints(
    outerNode,
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset
  );
}
/**
 * Returns {start, end} where `start` is the character/codepoint index of
 * (anchorNode, anchorOffset) within the textContent of `outerNode`, and
 * `end` is the index of (focusNode, focusOffset).
 *
 * Returns null if you pass in garbage input but we should probably just crash.
 *
 * Exported only for testing.
 */

function getModernOffsetsFromPoints(
  outerNode,
  anchorNode,
  anchorOffset,
  focusNode,
  focusOffset
) {
  var length = 0;
  var start = -1;
  var end = -1;
  var indexWithinAnchor = 0;
  var indexWithinFocus = 0;
  var node = outerNode;
  var parentNode = null;

  outer: while (true) {
    var next = null;

    while (true) {
      if (
        node === anchorNode &&
        (anchorOffset === 0 || node.nodeType === TEXT_NODE)
      ) {
        start = length + anchorOffset;
      }

      if (
        node === focusNode &&
        (focusOffset === 0 || node.nodeType === TEXT_NODE)
      ) {
        end = length + focusOffset;
      }

      if (node.nodeType === TEXT_NODE) {
        length += node.nodeValue.length;
      }

      if ((next = node.firstChild) === null) {
        break;
      } // Moving from `node` to its first child `next`.

      parentNode = node;
      node = next;
    }

    while (true) {
      if (node === outerNode) {
        // If `outerNode` has children, this is always the second time visiting
        // it. If it has no children, this is still the first loop, and the only
        // valid selection is anchorNode and focusNode both equal to this node
        // and both offsets 0, in which case we will have handled above.
        break outer;
      }

      if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset) {
        start = length;
      }

      if (parentNode === focusNode && ++indexWithinFocus === focusOffset) {
        end = length;
      }

      if ((next = node.nextSibling) !== null) {
        break;
      }

      node = parentNode;
      parentNode = node.parentNode;
    } // Moving from `node` to its next sibling `next`.

    node = next;
  }

  if (start === -1 || end === -1) {
    // This should never happen. (Would happen if the anchor/focus nodes aren't
    // actually inside the passed-in node.)
    return null;
  }

  return {
    start: start,
    end: end
  };
}
/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programmatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */

function setOffsets(node, offsets) {
  var doc = node.ownerDocument || document;
  var win = (doc && doc.defaultView) || window; // Edge fails with "Object expected" in some scenarios.
  // (For instance: TinyMCE editor used in a list component that supports pasting to add more,
  // fails when pasting 100+ items)

  if (!win.getSelection) {
    return;
  }

  var selection = win.getSelection();
  var length = node.textContent.length;
  var start = Math.min(offsets.start, length);
  var end = offsets.end === undefined ? start : Math.min(offsets.end, length); // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.

  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset(node, start);
  var endMarker = getNodeForCharacterOffset(node, end);

  if (startMarker && endMarker) {
    if (
      selection.rangeCount === 1 &&
      selection.anchorNode === startMarker.node &&
      selection.anchorOffset === startMarker.offset &&
      selection.focusNode === endMarker.node &&
      selection.focusOffset === endMarker.offset
    ) {
      return;
    }

    var range = doc.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}

function isTextNode(node) {
  return node && node.nodeType === TEXT_NODE;
}

function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ("contains" in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

function isInDocument(node) {
  return (
    node &&
    node.ownerDocument &&
    containsNode(node.ownerDocument.documentElement, node)
  );
}

function isSameOriginFrame(iframe) {
  try {
    // Accessing the contentDocument of a HTMLIframeElement can cause the browser
    // to throw, e.g. if it has a cross-origin src attribute.
    // Safari will show an error in the console when the access results in "Blocked a frame with origin". e.g:
    // iframe.contentDocument.defaultView;
    // A safety way is to access one of the cross origin properties: Window or Location
    // Which might result in "SecurityError" DOM Exception and it is compatible to Safari.
    // https://html.spec.whatwg.org/multipage/browsers.html#integration-with-idl
    return typeof iframe.contentWindow.location.href === "string";
  } catch (err) {
    return false;
  }
}

function getActiveElementDeep() {
  var win = window;
  var element = getActiveElement();

  while (element instanceof win.HTMLIFrameElement) {
    if (isSameOriginFrame(element)) {
      win = element.contentWindow;
    } else {
      return element;
    }

    element = getActiveElement(win.document);
  }

  return element;
}
/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */

/**
 * @hasSelectionCapabilities: we get the element types that support selection
 * from https://html.spec.whatwg.org/#do-not-apply, looking at `selectionStart`
 * and `selectionEnd` rows.
 */

function hasSelectionCapabilities(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  return (
    nodeName &&
    ((nodeName === "input" &&
      (elem.type === "text" ||
        elem.type === "search" ||
        elem.type === "tel" ||
        elem.type === "url" ||
        elem.type === "password")) ||
      nodeName === "textarea" ||
      elem.contentEditable === "true")
  );
}
function getSelectionInformation() {
  var focusedElem = getActiveElementDeep();
  return {
    focusedElem: focusedElem,
    selectionRange: hasSelectionCapabilities(focusedElem)
      ? getSelection$1(focusedElem)
      : null
  };
}
/**
 * @restoreSelection: If any selection information was potentially lost,
 * restore it. This is useful when performing operations that could remove dom
 * nodes and place them back in, resulting in focus being lost.
 */

function restoreSelection(priorSelectionInformation) {
  var curFocusedElem = getActiveElementDeep();
  var priorFocusedElem = priorSelectionInformation.focusedElem;
  var priorSelectionRange = priorSelectionInformation.selectionRange;

  if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
    if (
      priorSelectionRange !== null &&
      hasSelectionCapabilities(priorFocusedElem)
    ) {
      setSelection(priorFocusedElem, priorSelectionRange);
    } // Focusing a node can change the scroll position, which is undesirable

    var ancestors = [];
    var ancestor = priorFocusedElem;

    while ((ancestor = ancestor.parentNode)) {
      if (ancestor.nodeType === ELEMENT_NODE) {
        ancestors.push({
          element: ancestor,
          left: ancestor.scrollLeft,
          top: ancestor.scrollTop
        });
      }
    }

    if (typeof priorFocusedElem.focus === "function") {
      priorFocusedElem.focus();
    }

    for (var i = 0; i < ancestors.length; i++) {
      var info = ancestors[i];
      info.element.scrollLeft = info.left;
      info.element.scrollTop = info.top;
    }
  }
}
/**
 * @getSelection: Gets the selection bounds of a focused textarea, input or
 * contentEditable node.
 * -@input: Look up selection bounds of this input
 * -@return {start: selectionStart, end: selectionEnd}
 */

function getSelection$1(input) {
  var selection;

  if ("selectionStart" in input) {
    // Modern browser with input or textarea.
    selection = {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  } else {
    // Content editable or old IE textarea.
    selection = getOffsets(input);
  }

  return (
    selection || {
      start: 0,
      end: 0
    }
  );
}
/**
 * @setSelection: Sets the selection bounds of a textarea or input and focuses
 * the input.
 * -@input     Set selection bounds of this input or textarea
 * -@offsets   Object of same form that is returned from get*
 */

function setSelection(input, offsets) {
  var start = offsets.start,
    end = offsets.end;

  if (end === undefined) {
    end = start;
  }

  if ("selectionStart" in input) {
    input.selectionStart = start;
    input.selectionEnd = Math.min(end, input.value.length);
  } else {
    setOffsets(input, offsets);
  }
}

var skipSelectionChangeEvent =
  canUseDOM && "documentMode" in document && document.documentMode <= 11;
var eventTypes$3 = {
  select: {
    phasedRegistrationNames: {
      bubbled: "onSelect",
      captured: "onSelectCapture"
    },
    dependencies: [
      TOP_BLUR,
      TOP_CONTEXT_MENU,
      TOP_DRAG_END,
      TOP_FOCUS,
      TOP_KEY_DOWN,
      TOP_KEY_UP,
      TOP_MOUSE_DOWN,
      TOP_MOUSE_UP,
      TOP_SELECTION_CHANGE
    ]
  }
};
var activeElement$1 = null;
var activeElementInst$1 = null;
var lastSelection = null;
var mouseDown = false;
/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @return {object}
 */

function getSelection(node) {
  if ("selectionStart" in node && hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else {
    var win = (node.ownerDocument && node.ownerDocument.defaultView) || window;
    var selection = win.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  }
}
/**
 * Get document associated with the event target.
 *
 * @param {object} nativeEventTarget
 * @return {Document}
 */

function getEventTargetDocument(eventTarget) {
  return eventTarget.window === eventTarget
    ? eventTarget.document
    : eventTarget.nodeType === DOCUMENT_NODE
      ? eventTarget
      : eventTarget.ownerDocument;
}
/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @param {object} nativeEventTarget
 * @return {?SyntheticEvent}
 */

function constructSelectEvent(nativeEvent, nativeEventTarget) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  var doc = getEventTargetDocument(nativeEventTarget);

  if (
    mouseDown ||
    activeElement$1 == null ||
    activeElement$1 !== getActiveElement(doc)
  ) {
    return null;
  } // Only fire when selection has actually changed.

  var currentSelection = getSelection(activeElement$1);

  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;
    var syntheticEvent = SyntheticEvent.getPooled(
      eventTypes$3.select,
      activeElementInst$1,
      nativeEvent,
      nativeEventTarget
    );
    syntheticEvent.type = "select";
    syntheticEvent.target = activeElement$1;
    accumulateTwoPhaseDispatches(syntheticEvent);
    return syntheticEvent;
  }

  return null;
}
/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */

var SelectEventPlugin = {
  eventTypes: eventTypes$3,
  extractEvents: function(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    var doc = getEventTargetDocument(nativeEventTarget); // Track whether all listeners exists for this plugin. If none exist, we do
    // not extract events. See #3639.

    if (!doc || !isListeningToAllDependencies("onSelect", doc)) {
      return null;
    }

    var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;

    switch (topLevelType) {
      // Track the input node that has focus.
      case TOP_FOCUS:
        if (
          isTextInputElement(targetNode) ||
          targetNode.contentEditable === "true"
        ) {
          activeElement$1 = targetNode;
          activeElementInst$1 = targetInst;
          lastSelection = null;
        }

        break;

      case TOP_BLUR:
        activeElement$1 = null;
        activeElementInst$1 = null;
        lastSelection = null;
        break;
      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.

      case TOP_MOUSE_DOWN:
        mouseDown = true;
        break;

      case TOP_CONTEXT_MENU:
      case TOP_MOUSE_UP:
      case TOP_DRAG_END:
        mouseDown = false;
        return constructSelectEvent(nativeEvent, nativeEventTarget);
      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't). IE's event fires out of order with respect
      // to key and input events on deletion, so we discard it.
      //
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      // This is also our approach for IE handling, for the reason above.

      case TOP_SELECTION_CHANGE:
        if (skipSelectionChangeEvent) {
          break;
        }

      // falls through

      case TOP_KEY_DOWN:
      case TOP_KEY_UP:
        return constructSelectEvent(nativeEvent, nativeEventTarget);
    }

    return null;
  }
};

/**
 * Inject modules for resolving DOM hierarchy and plugin ordering.
 */

injection.injectEventPluginOrder(DOMEventPluginOrder);
setComponentTree(
  getFiberCurrentPropsFromNode$1,
  getInstanceFromNode$1,
  getNodeFromInstance$1
);
/**
 * Some important event plugins included by default (without having to require
 * them).
 */

injection.injectEventPluginsByName({
  SimpleEventPlugin: SimpleEventPlugin,
  EnterLeaveEventPlugin: EnterLeaveEventPlugin,
  ChangeEventPlugin: ChangeEventPlugin,
  SelectEventPlugin: SelectEventPlugin,
  BeforeInputEventPlugin: BeforeInputEventPlugin
});

function endsWith(subject, search) {
  var length = subject.length;
  return subject.substring(length - search.length, length) === search;
}

function flattenChildren(children) {
  var content = ""; // Flatten children. We'll warn if they are invalid
  // during validateProps() which runs for hydration too.
  // Note that this would throw on non-element objects.
  // Elements are stringified (which is normally irrelevant
  // but matters for <fbt>).

  React.Children.forEach(children, function(child) {
    if (child == null) {
      return;
    }

    content += child; // Note: we don't warn about invalid children here.
    // Instead, this is done separately below so that
    // it happens during the hydration codepath too.
  });
  return content;
}
/**
 * Implements an <option> host component that warns when `selected` is set.
 */

function postMountWrapper$1(element, props) {
  // value="" should make a value attribute (#6219)
  if (props.value != null) {
    element.setAttribute("value", toString(getToStringValue(props.value)));
  }
}
function getHostProps$1(element, props) {
  var hostProps = Object.assign(
    {
      children: undefined
    },
    props
  );
  var content = flattenChildren(props.children);

  if (content) {
    hostProps.children = content;
  }

  return hostProps;
}

// TODO: direct imports like some-package/src/* are bad. Fix me.
function updateOptions(node, multiple, propValue, setDefaultSelected) {
  var options = node.options;

  if (multiple) {
    var selectedValues = propValue;
    var selectedValue = {};

    for (var i = 0; i < selectedValues.length; i++) {
      // Prefix to avoid chaos with special keys.
      selectedValue["$" + selectedValues[i]] = true;
    }

    for (var _i = 0; _i < options.length; _i++) {
      var selected = selectedValue.hasOwnProperty("$" + options[_i].value);

      if (options[_i].selected !== selected) {
        options[_i].selected = selected;
      }

      if (selected && setDefaultSelected) {
        options[_i].defaultSelected = true;
      }
    }
  } else {
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    var _selectedValue = toString(getToStringValue(propValue));

    var defaultSelected = null;

    for (var _i2 = 0; _i2 < options.length; _i2++) {
      if (options[_i2].value === _selectedValue) {
        options[_i2].selected = true;

        if (setDefaultSelected) {
          options[_i2].defaultSelected = true;
        }

        return;
      }

      if (defaultSelected === null && !options[_i2].disabled) {
        defaultSelected = options[_i2];
      }
    }

    if (defaultSelected !== null) {
      defaultSelected.selected = true;
    }
  }
}
/**
 * Implements a <select> host component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * stringable. If `multiple` is true, the prop must be an array of stringables.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */

function getHostProps$2(element, props) {
  return Object.assign({}, props, {
    value: undefined
  });
}
function initWrapperState$1(element, props) {
  var node = element;

  node._wrapperState = {
    wasMultiple: !!props.multiple
  };
}
function postMountWrapper$2(element, props) {
  var node = element;
  node.multiple = !!props.multiple;
  var value = props.value;

  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  } else if (props.defaultValue != null) {
    updateOptions(node, !!props.multiple, props.defaultValue, true);
  }
}
function postUpdateWrapper(element, props) {
  var node = element;
  var wasMultiple = node._wrapperState.wasMultiple;
  node._wrapperState.wasMultiple = !!props.multiple;
  var value = props.value;

  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  } else if (wasMultiple !== !!props.multiple) {
    // For simplicity, reapply `defaultValue` if `multiple` is toggled.
    if (props.defaultValue != null) {
      updateOptions(node, !!props.multiple, props.defaultValue, true);
    } else {
      // Revert the select back to its default unselected state.
      updateOptions(node, !!props.multiple, props.multiple ? [] : "", false);
    }
  }
}
function restoreControlledState$2(element, props) {
  var node = element;
  var value = props.value;

  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  }
}

/**
 * Implements a <textarea> host component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */
function getHostProps$3(element, props) {
  var node = element;

  (function() {
    if (!(props.dangerouslySetInnerHTML == null)) {
      {
        throw ReactErrorProd(Error(91));
      }
    }
  })(); // Always set children to the same thing. In IE9, the selection range will
  // get reset if `textContent` is mutated.  We could add a check in setTextContent
  // to only set the value if/when the value differs from the node value (which would
  // completely solve this IE9 bug), but Sebastian+Sophie seemed to like this
  // solution. The value can be a boolean or object so that's why it's forced
  // to be a string.

  var hostProps = Object.assign({}, props, {
    value: undefined,
    defaultValue: undefined,
    children: toString(node._wrapperState.initialValue)
  });
  return hostProps;
}
function initWrapperState$2(element, props) {
  var node = element;

  var initialValue = props.value; // Only bother fetching default value if we're going to use it

  if (initialValue == null) {
    var defaultValue = props.defaultValue; // TODO (yungsters): Remove support for children content in <textarea>.

    var children = props.children;

    if (children != null) {
      (function() {
        if (!(defaultValue == null)) {
          {
            throw ReactErrorProd(Error(92));
          }
        }
      })();

      if (Array.isArray(children)) {
        (function() {
          if (!(children.length <= 1)) {
            {
              throw ReactErrorProd(Error(93));
            }
          }
        })();

        children = children[0];
      }

      defaultValue = children;
    }

    if (defaultValue == null) {
      defaultValue = "";
    }

    initialValue = defaultValue;
  }

  node._wrapperState = {
    initialValue: getToStringValue(initialValue)
  };
}
function updateWrapper$1(element, props) {
  var node = element;
  var value = getToStringValue(props.value);
  var defaultValue = getToStringValue(props.defaultValue);

  if (value != null) {
    // Cast `value` to a string to ensure the value is set correctly. While
    // browsers typically do this as necessary, jsdom doesn't.
    var newValue = toString(value); // To avoid side effects (such as losing text selection), only set value if changed

    if (newValue !== node.value) {
      node.value = newValue;
    }

    if (props.defaultValue == null && node.defaultValue !== newValue) {
      node.defaultValue = newValue;
    }
  }

  if (defaultValue != null) {
    node.defaultValue = toString(defaultValue);
  }
}
function postMountWrapper$3(element, props) {
  var node = element; // This is in postMount because we need access to the DOM node, which is not
  // available until after the component has mounted.

  var textContent = node.textContent; // Only set node.value if textContent is equal to the expected
  // initial value. In IE10/IE11 there is a bug where the placeholder attribute
  // will populate textContent as well.
  // https://developer.microsoft.com/microsoft-edge/platform/issues/101525/

  if (textContent === node._wrapperState.initialValue) {
    node.value = textContent;
  }
}
function restoreControlledState$3(element, props) {
  // DOM component is still mounted; update
  updateWrapper$1(element, props);
}

var HTML_NAMESPACE$1 = "http://www.w3.org/1999/xhtml";
var MATH_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
var Namespaces = {
  html: HTML_NAMESPACE$1,
  mathml: MATH_NAMESPACE,
  svg: SVG_NAMESPACE
}; // Assumes there is no parent namespace.

function getIntrinsicNamespace(type) {
  switch (type) {
    case "svg":
      return SVG_NAMESPACE;

    case "math":
      return MATH_NAMESPACE;

    default:
      return HTML_NAMESPACE$1;
  }
}
function getChildNamespace(parentNamespace, type) {
  if (parentNamespace == null || parentNamespace === HTML_NAMESPACE$1) {
    // No (or default) parent namespace: potential entry point.
    return getIntrinsicNamespace(type);
  }

  if (parentNamespace === SVG_NAMESPACE && type === "foreignObject") {
    // We're leaving SVG.
    return HTML_NAMESPACE$1;
  } // By default, pass namespace below.

  return parentNamespace;
}

/* globals MSApp */

/**
 * Create a function which has 'unsafe' privileges (required by windows8 apps)
 */
var createMicrosoftUnsafeLocalFunction = function(func) {
  if (typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction) {
    return function(arg0, arg1, arg2, arg3) {
      MSApp.execUnsafeLocalFunction(function() {
        return func(arg0, arg1, arg2, arg3);
      });
    };
  } else {
    return func;
  }
};

var reusableSVGContainer;
/**
 * Set the innerHTML property of a node
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */

var setInnerHTML = createMicrosoftUnsafeLocalFunction(function(node, html) {
  // IE does not have innerHTML for SVG nodes, so instead we inject the
  // new markup in a temp node and then move the child nodes across into
  // the target node
  if (node.namespaceURI === Namespaces.svg && !("innerHTML" in node)) {
    reusableSVGContainer =
      reusableSVGContainer || document.createElement("div");
    reusableSVGContainer.innerHTML = "<svg>" + html + "</svg>";
    var svgNode = reusableSVGContainer.firstChild;

    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    while (svgNode.firstChild) {
      node.appendChild(svgNode.firstChild);
    }
  } else {
    node.innerHTML = html;
  }
});

/**
 * Set the textContent property of a node. For text updates, it's faster
 * to set the `nodeValue` of the Text node directly instead of using
 * `.textContent` which will remove the existing node and create a new one.
 *
 * @param {DOMElement} node
 * @param {string} text
 * @internal
 */

var setTextContent = function(node, text) {
  if (text) {
    var firstChild = node.firstChild;

    if (
      firstChild &&
      firstChild === node.lastChild &&
      firstChild.nodeType === TEXT_NODE
    ) {
      firstChild.nodeValue = text;
      return;
    }
  }

  node.textContent = text;
};

// List derived from Gecko source code:
// https://github.com/mozilla/gecko-dev/blob/4e638efc71/layout/style/test/property_database.js

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */

function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}
/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */

var prefixes = ["Webkit", "ms", "Moz", "O"]; // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.

Object.keys(isUnitlessNumber).forEach(function(prop) {
  prefixes.forEach(function(prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */

function dangerousStyleValue(name, value, isCustomProperty) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901
  var isEmpty = value == null || typeof value === "boolean" || value === "";

  if (isEmpty) {
    return "";
  }

  if (
    !isCustomProperty &&
    typeof value === "number" &&
    value !== 0 &&
    !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
  ) {
    return value + "px"; // Presumes implicit 'px' suffix for unitless numbers
  }

  return ("" + value).trim();
}

/**
 * Operations for dealing with CSS properties.
 */

/**
 * This creates a string that is expected to be equivalent to the style
 * attribute generated by server-side rendering. It by-passes warnings and
 * security checks so it's not safe to use this value for anything other than
 * comparison. It is only used in DEV for SSR validation.
 */

/**
 * Sets the value for multiple styles on a node.  If a value is specified as
 * '' (empty string), the corresponding style property will be unset.
 *
 * @param {DOMElement} node
 * @param {object} styles
 */

function setValueForStyles(node, styles) {
  var style = node.style;

  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }

    var isCustomProperty = styleName.indexOf("--") === 0;

    var styleValue = dangerousStyleValue(
      styleName,
      styles[styleName],
      isCustomProperty
    );

    if (styleName === "float") {
      styleName = "cssFloat";
    }

    if (isCustomProperty) {
      style.setProperty(styleName, styleValue);
    } else {
      style[styleName] = styleValue;
    }
  }
}

/**
 * When mixing shorthand and longhand property names, we warn during updates if
 * we expect an incorrect result to occur. In particular, we warn for:
 *
 * Updating a shorthand property (longhand gets overwritten):
 *   {font: 'foo', fontVariant: 'bar'} -> {font: 'baz', fontVariant: 'bar'}
 *   becomes .style.font = 'baz'
 * Removing a shorthand property (longhand gets lost too):
 *   {font: 'foo', fontVariant: 'bar'} -> {fontVariant: 'bar'}
 *   becomes .style.font = ''
 * Removing a longhand property (should revert to shorthand; doesn't):
 *   {font: 'foo', fontVariant: 'bar'} -> {font: 'foo'}
 *   becomes .style.fontVariant = ''
 */

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special-case tags.
var omittedCloseTags = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true // NOTE: menuitem's close tag should be omitted, but that causes problems.
};

// `omittedCloseTags` except that `menuitem` should still have its closing tag.

var voidElementTags = Object.assign(
  {
    menuitem: true
  },
  omittedCloseTags
);

// or add stack by default to invariants where possible.

var HTML$1 = "__html";
function assertValidProps(tag, props) {
  if (!props) {
    return;
  } // Note the use of `==` which checks for null or undefined.

  if (voidElementTags[tag]) {
    (function() {
      if (!(props.children == null && props.dangerouslySetInnerHTML == null)) {
        {
          throw ReactErrorProd(Error(137), tag, "");
        }
      }
    })();
  }

  if (props.dangerouslySetInnerHTML != null) {
    (function() {
      if (!(props.children == null)) {
        {
          throw ReactErrorProd(Error(60));
        }
      }
    })();

    (function() {
      if (
        !(
          typeof props.dangerouslySetInnerHTML === "object" &&
          HTML$1 in props.dangerouslySetInnerHTML
        )
      ) {
        {
          throw ReactErrorProd(Error(61));
        }
      }
    })();
  }

  (function() {
    if (!(props.style == null || typeof props.style === "object")) {
      {
        throw ReactErrorProd(Error(62), "");
      }
    }
  })();
}

function isCustomComponent(tagName, props) {
  if (tagName.indexOf("-") === -1) {
    return typeof props.is === "string";
  }

  switch (tagName) {
    // These are reserved SVG and MathML elements.
    // We don't mind this whitelist too much because we expect it to never grow.
    // The alternative is to track the namespace in a few places which is convoluted.
    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;

    default:
      return true;
  }
}

// When adding attributes to the HTML or SVG whitelist, be sure to
// also add them to this module to ensure casing and incorrect name
// warnings.

// TODO: direct imports like some-package/src/* are bad. Fix me.
var DANGEROUSLY_SET_INNER_HTML = "dangerouslySetInnerHTML";
var SUPPRESS_CONTENT_EDITABLE_WARNING = "suppressContentEditableWarning";
var SUPPRESS_HYDRATION_WARNING$1 = "suppressHydrationWarning";
var AUTOFOCUS = "autoFocus";
var CHILDREN = "children";
var STYLE$1 = "style";
var HTML = "__html";
var LISTENERS = "listeners";
var HTML_NAMESPACE = Namespaces.html;
function ensureListeningTo(rootContainerElement, registrationName) {
  var isDocumentOrFragment =
    rootContainerElement.nodeType === DOCUMENT_NODE ||
    rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE;
  var doc = isDocumentOrFragment
    ? rootContainerElement
    : rootContainerElement.ownerDocument;
  listenTo(registrationName, doc);
}

function getOwnerDocumentFromRootContainer(rootContainerElement) {
  return rootContainerElement.nodeType === DOCUMENT_NODE
    ? rootContainerElement
    : rootContainerElement.ownerDocument;
}

function noop() {}

function trapClickOnNonInteractiveElement(node) {
  // Mobile Safari does not fire properly bubble click events on
  // non-interactive elements, which means delegated click listeners do not
  // fire. The workaround for this bug involves attaching an empty click
  // listener on the target node.
  // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
  // Just set it using the onclick property so that we don't have to manage any
  // bookkeeping for it. Not sure if we need to clear it when the listener is
  // removed.
  // TODO: Only do this for the relevant Safaris maybe?
  node.onclick = noop;
}

function setInitialDOMProperties(
  tag,
  domElement,
  rootContainerElement,
  nextProps,
  isCustomComponentTag
) {
  for (var propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }

    var nextProp = nextProps[propKey];

    if (propKey === STYLE$1) {
      setValueForStyles(domElement, nextProp);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHtml = nextProp ? nextProp[HTML] : undefined;

      if (nextHtml != null) {
        setInnerHTML(domElement, nextHtml);
      }
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === "string") {
        // Avoid setting initial textContent when the text is empty. In IE11 setting
        // textContent on a <textarea> will cause the placeholder to not
        // show within the <textarea> until it has been focused and blurred again.
        // https://github.com/facebook/react/issues/6731#issuecomment-254874553
        var canSetTextContent = tag !== "textarea" || nextProp !== "";

        if (canSetTextContent) {
          setTextContent(domElement, nextProp);
        }
      } else if (typeof nextProp === "number") {
        setTextContent(domElement, "" + nextProp);
      }
    } else if (
      (enableFlareAPI && propKey === LISTENERS) ||
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING$1
    ) {
      // Noop
    } else if (propKey === AUTOFOCUS) {
      // We polyfill it separately on the client during commit.
      // We could have excluded it in the property list instead of
      // adding a special case here, but then it wouldn't be emitted
      // on server rendering (but we *do* want to emit it in SSR).
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        ensureListeningTo(rootContainerElement, propKey);
      }
    } else if (nextProp != null) {
      setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag);
    }
  }
}

function updateDOMProperties(
  domElement,
  updatePayload,
  wasCustomComponentTag,
  isCustomComponentTag
) {
  // TODO: Handle wasCustomComponentTag
  for (var i = 0; i < updatePayload.length; i += 2) {
    var propKey = updatePayload[i];
    var propValue = updatePayload[i + 1];

    if (propKey === STYLE$1) {
      setValueForStyles(domElement, propValue);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      setInnerHTML(domElement, propValue);
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {
      setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
    }
  }
}

function createElement(type, props, rootContainerElement, parentNamespace) {
  var ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement);
  var domElement;
  var namespaceURI = parentNamespace;

  if (namespaceURI === HTML_NAMESPACE) {
    namespaceURI = getIntrinsicNamespace(type);
  }

  if (namespaceURI === HTML_NAMESPACE) {
    if (type === "script") {
      // Create the script via .innerHTML so its "parser-inserted" flag is
      // set to true and it does not execute
      var div = ownerDocument.createElement("div");
      div.innerHTML = "<script><" + "/script>"; // eslint-disable-line
      // This is guaranteed to yield a script element.

      var firstChild = div.firstChild;
      domElement = div.removeChild(firstChild);
    } else if (typeof props.is === "string") {
      // $FlowIssue `createElement` should be updated for Web Components
      domElement = ownerDocument.createElement(type, {
        is: props.is
      });
    } else {
      // Separate else branch instead of using `props.is || undefined` above because of a Firefox bug.
      // See discussion in https://github.com/facebook/react/pull/6896
      // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
      domElement = ownerDocument.createElement(type); // Normally attributes are assigned in `setInitialDOMProperties`, however the `multiple` and `size`
      // attributes on `select`s needs to be added before `option`s are inserted.
      // This prevents:
      // - a bug where the `select` does not scroll to the correct option because singular
      //  `select` elements automatically pick the first item #13222
      // - a bug where the `select` set the first item as selected despite the `size` attribute #14239
      // See https://github.com/facebook/react/issues/13222
      // and https://github.com/facebook/react/issues/14239

      if (type === "select") {
        var node = domElement;

        if (props.multiple) {
          node.multiple = true;
        } else if (props.size) {
          // Setting a size greater than 1 causes a select to behave like `multiple=true`, where
          // it is possible that no option is selected.
          //
          // This is only necessary when a select in "single selection mode".
          node.size = props.size;
        }
      }
    }
  } else {
    domElement = ownerDocument.createElementNS(namespaceURI, type);
  }

  return domElement;
}
function createTextNode(text, rootContainerElement) {
  return getOwnerDocumentFromRootContainer(rootContainerElement).createTextNode(
    text
  );
}
function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
  var isCustomComponentTag = isCustomComponent(tag, rawProps);

  var props;

  switch (tag) {
    case "iframe":
    case "object":
    case "embed":
      trapBubbledEvent(TOP_LOAD, domElement);
      props = rawProps;
      break;

    case "video":
    case "audio":
      // Create listener for each media event
      for (var i = 0; i < mediaEventTypes.length; i++) {
        trapBubbledEvent(mediaEventTypes[i], domElement);
      }

      props = rawProps;
      break;

    case "source":
      trapBubbledEvent(TOP_ERROR, domElement);
      props = rawProps;
      break;

    case "img":
    case "image":
    case "link":
      trapBubbledEvent(TOP_ERROR, domElement);
      trapBubbledEvent(TOP_LOAD, domElement);
      props = rawProps;
      break;

    case "form":
      trapBubbledEvent(TOP_RESET, domElement);
      trapBubbledEvent(TOP_SUBMIT, domElement);
      props = rawProps;
      break;

    case "details":
      trapBubbledEvent(TOP_TOGGLE, domElement);
      props = rawProps;
      break;

    case "input":
      initWrapperState(domElement, rawProps);
      props = getHostProps(domElement, rawProps);
      trapBubbledEvent(TOP_INVALID, domElement); // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.

      ensureListeningTo(rootContainerElement, "onChange");
      break;

    case "option":
      props = getHostProps$1(domElement, rawProps);
      break;

    case "select":
      initWrapperState$1(domElement, rawProps);
      props = getHostProps$2(domElement, rawProps);
      trapBubbledEvent(TOP_INVALID, domElement); // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.

      ensureListeningTo(rootContainerElement, "onChange");
      break;

    case "textarea":
      initWrapperState$2(domElement, rawProps);
      props = getHostProps$3(domElement, rawProps);
      trapBubbledEvent(TOP_INVALID, domElement); // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.

      ensureListeningTo(rootContainerElement, "onChange");
      break;

    default:
      props = rawProps;
  }

  assertValidProps(tag, props);
  setInitialDOMProperties(
    tag,
    domElement,
    rootContainerElement,
    props,
    isCustomComponentTag
  );

  switch (tag) {
    case "input":
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper(domElement, rawProps, false);
      break;

    case "textarea":
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper$3(domElement, rawProps);
      break;

    case "option":
      postMountWrapper$1(domElement, rawProps);
      break;

    case "select":
      postMountWrapper$2(domElement, rawProps);
      break;

    default:
      if (typeof props.onClick === "function") {
        // TODO: This cast may not be sound for SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(domElement);
      }

      break;
  }
} // Calculate the diff between the two objects.

function diffProperties(
  domElement,
  tag,
  lastRawProps,
  nextRawProps,
  rootContainerElement
) {
  var updatePayload = null;
  var lastProps;
  var nextProps;

  switch (tag) {
    case "input":
      lastProps = getHostProps(domElement, lastRawProps);
      nextProps = getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;

    case "option":
      lastProps = getHostProps$1(domElement, lastRawProps);
      nextProps = getHostProps$1(domElement, nextRawProps);
      updatePayload = [];
      break;

    case "select":
      lastProps = getHostProps$2(domElement, lastRawProps);
      nextProps = getHostProps$2(domElement, nextRawProps);
      updatePayload = [];
      break;

    case "textarea":
      lastProps = getHostProps$3(domElement, lastRawProps);
      nextProps = getHostProps$3(domElement, nextRawProps);
      updatePayload = [];
      break;

    default:
      lastProps = lastRawProps;
      nextProps = nextRawProps;

      if (
        typeof lastProps.onClick !== "function" &&
        typeof nextProps.onClick === "function"
      ) {
        // TODO: This cast may not be sound for SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(domElement);
      }

      break;
  }

  assertValidProps(tag, nextProps);
  var propKey;
  var styleName;
  var styleUpdates = null;

  for (propKey in lastProps) {
    if (
      nextProps.hasOwnProperty(propKey) ||
      !lastProps.hasOwnProperty(propKey) ||
      lastProps[propKey] == null
    ) {
      continue;
    }

    if (propKey === STYLE$1) {
      var lastStyle = lastProps[propKey];

      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }

          styleUpdates[styleName] = "";
        }
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN) {
      // Noop. This is handled by the clear text mechanism.
    } else if (
      (enableFlareAPI && propKey === LISTENERS) ||
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING$1
    ) {
      // Noop
    } else if (propKey === AUTOFOCUS) {
      // Noop. It doesn't work on updates anyway.
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      // This is a special case. If any listener updates we need to ensure
      // that the "current" fiber pointer gets updated so we need a commit
      // to update this element.
      if (!updatePayload) {
        updatePayload = [];
      }
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }

  for (propKey in nextProps) {
    var nextProp = nextProps[propKey];
    var lastProp = lastProps != null ? lastProps[propKey] : undefined;

    if (
      !nextProps.hasOwnProperty(propKey) ||
      nextProp === lastProp ||
      (nextProp == null && lastProp == null)
    ) {
      continue;
    }

    if (propKey === STYLE$1) {
      if (lastProp) {
        // Unset styles on `lastProp` but not on `nextProp`.
        for (styleName in lastProp) {
          if (
            lastProp.hasOwnProperty(styleName) &&
            (!nextProp || !nextProp.hasOwnProperty(styleName))
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }

            styleUpdates[styleName] = "";
          }
        } // Update styles that changed since `lastProp`.

        for (styleName in nextProp) {
          if (
            nextProp.hasOwnProperty(styleName) &&
            lastProp[styleName] !== nextProp[styleName]
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }

            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        // Relies on `updateStylesByID` not mutating `styleUpdates`.
        if (!styleUpdates) {
          if (!updatePayload) {
            updatePayload = [];
          }

          updatePayload.push(propKey, styleUpdates);
        }

        styleUpdates = nextProp;
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHtml = nextProp ? nextProp[HTML] : undefined;
      var lastHtml = lastProp ? lastProp[HTML] : undefined;

      if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          (updatePayload = updatePayload || []).push(propKey, "" + nextHtml);
        }
      } else {
        // TODO: It might be too late to clear this if we have children
        // inserted already.
      }
    } else if (propKey === CHILDREN) {
      if (
        lastProp !== nextProp &&
        (typeof nextProp === "string" || typeof nextProp === "number")
      ) {
        (updatePayload = updatePayload || []).push(propKey, "" + nextProp);
      }
    } else if (
      (enableFlareAPI && propKey === LISTENERS) ||
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING$1
    ) {
      // Noop
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        // We eagerly listen to this even though we haven't committed yet.
        ensureListeningTo(rootContainerElement, propKey);
      }

      if (!updatePayload && lastProp !== nextProp) {
        // This is a special case. If any listener updates we need to ensure
        // that the "current" props pointer gets updated so we need a commit
        // to update this element.
        updatePayload = [];
      }
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }

  if (styleUpdates) {
    (updatePayload = updatePayload || []).push(STYLE$1, styleUpdates);
  }

  return updatePayload;
} // Apply the diff.

function updateProperties(
  domElement,
  updatePayload,
  tag,
  lastRawProps,
  nextRawProps
) {
  // Update checked *before* name.
  // In the middle of an update, it is possible to have multiple checked.
  // When a checked radio tries to change name, browser makes another radio's checked false.
  if (
    tag === "input" &&
    nextRawProps.type === "radio" &&
    nextRawProps.name != null
  ) {
    updateChecked(domElement, nextRawProps);
  }

  var wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
  var isCustomComponentTag = isCustomComponent(tag, nextRawProps); // Apply the diff.

  updateDOMProperties(
    domElement,
    updatePayload,
    wasCustomComponentTag,
    isCustomComponentTag
  ); // TODO: Ensure that an update gets scheduled if any of the special props
  // changed.

  switch (tag) {
    case "input":
      // Update the wrapper around inputs *after* updating props. This has to
      // happen after `updateDOMProperties`. Otherwise HTML5 input validations
      // raise warnings and prevent the new value from being assigned.
      updateWrapper(domElement, nextRawProps);
      break;

    case "textarea":
      updateWrapper$1(domElement, nextRawProps);
      break;

    case "select":
      // <select> value update needs to occur after <option> children
      // reconciliation
      postUpdateWrapper(domElement, nextRawProps);
      break;
  }
}

function diffHydratedProperties(
  domElement,
  tag,
  rawProps,
  parentNamespace,
  rootContainerElement
) {
  var isCustomComponentTag;
  switch (tag) {
    case "iframe":
    case "object":
    case "embed":
      trapBubbledEvent(TOP_LOAD, domElement);
      break;

    case "video":
    case "audio":
      // Create listener for each media event
      for (var i = 0; i < mediaEventTypes.length; i++) {
        trapBubbledEvent(mediaEventTypes[i], domElement);
      }

      break;

    case "source":
      trapBubbledEvent(TOP_ERROR, domElement);
      break;

    case "img":
    case "image":
    case "link":
      trapBubbledEvent(TOP_ERROR, domElement);
      trapBubbledEvent(TOP_LOAD, domElement);
      break;

    case "form":
      trapBubbledEvent(TOP_RESET, domElement);
      trapBubbledEvent(TOP_SUBMIT, domElement);
      break;

    case "details":
      trapBubbledEvent(TOP_TOGGLE, domElement);
      break;

    case "input":
      initWrapperState(domElement, rawProps);
      trapBubbledEvent(TOP_INVALID, domElement); // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.

      ensureListeningTo(rootContainerElement, "onChange");
      break;

    case "option":
      break;

    case "select":
      initWrapperState$1(domElement, rawProps);
      trapBubbledEvent(TOP_INVALID, domElement); // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.

      ensureListeningTo(rootContainerElement, "onChange");
      break;

    case "textarea":
      initWrapperState$2(domElement, rawProps);
      trapBubbledEvent(TOP_INVALID, domElement); // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.

      ensureListeningTo(rootContainerElement, "onChange");
      break;
  }

  assertValidProps(tag, rawProps);

  var updatePayload = null;

  for (var propKey in rawProps) {
    if (!rawProps.hasOwnProperty(propKey)) {
      continue;
    }

    var nextProp = rawProps[propKey];

    if (propKey === CHILDREN) {
      // For text content children we compare against textContent. This
      // might match additional HTML that is hidden when we read it using
      // textContent. E.g. "foo" will match "f<span>oo</span>" but that still
      // satisfies our requirement. Our requirement is not to produce perfect
      // HTML and attributes. Ideally we should preserve structure but it's
      // ok not to if the visible content is still enough to indicate what
      // even listeners these nodes might be wired up to.
      // TODO: Warn if there is more than a single textNode as a child.
      // TODO: Should we use domElement.firstChild.nodeValue to compare?
      if (typeof nextProp === "string") {
        if (domElement.textContent !== nextProp) {
          updatePayload = [CHILDREN, nextProp];
        }
      } else if (typeof nextProp === "number") {
        if (domElement.textContent !== "" + nextProp) {
          updatePayload = [CHILDREN, "" + nextProp];
        }
      }
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        ensureListeningTo(rootContainerElement, propKey);
      }
    } else {
    }
  }

  switch (tag) {
    case "input":
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper(domElement, rawProps, true);
      break;

    case "textarea":
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper$3(domElement, rawProps);
      break;

    case "select":
    case "option":
      // For input and textarea we current always set the value property at
      // post mount to force it to diverge from attributes. However, for
      // option and select we don't quite do the same thing and select
      // is not resilient to the DOM state changing so we don't do that here.
      // TODO: Consider not doing this for input and textarea.
      break;

    default:
      if (typeof rawProps.onClick === "function") {
        // TODO: This cast may not be sound for SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(domElement);
      }

      break;
  }

  return updatePayload;
}
function diffHydratedText(textNode, text) {
  var isDifferent = textNode.nodeValue !== text;
  return isDifferent;
}

function restoreControlledState$1(domElement, tag, props) {
  switch (tag) {
    case "input":
      restoreControlledState(domElement, props);
      return;

    case "textarea":
      restoreControlledState$3(domElement, props);
      return;

    case "select":
      restoreControlledState$2(domElement, props);
      return;
  }
}
function listenToEventResponderEventTypes(eventTypes, element) {
  if (enableFlareAPI) {
    // Get the listening Set for this element. We use this to track
    // what events we're listening to.
    var listeningSet = getListeningSetForElement(element); // Go through each target event type of the event responder

    for (var i = 0, length = eventTypes.length; i < length; ++i) {
      var eventType = eventTypes[i];
      var isPassive = !endsWith(eventType, "_active");
      var eventKey = isPassive ? eventType + "_passive" : eventType;
      var targetEventType = isPassive
        ? eventType
        : eventType.substring(0, eventType.length - 7);

      if (!listeningSet.has(eventKey)) {
        trapEventForResponderEventSystem(element, targetEventType, isPassive);
        listeningSet.add(eventKey);
      }
    }
  }
} // We can remove this once the event API is stable and out of a flag

if (enableFlareAPI) {
  setListenToResponderEventTypes(listenToEventResponderEventTypes);
}

// can re-export everything from this module.

function shim() {
  (function() {
    {
      {
        throw ReactErrorProd(Error(270));
      }
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

var SUSPENSE_START_DATA = "$";
var SUSPENSE_END_DATA = "/$";
var SUSPENSE_PENDING_START_DATA = "$?";
var SUSPENSE_FALLBACK_START_DATA = "$!";
var STYLE = "style";
var eventsEnabled = null;
var selectionInformation = null;

function shouldAutoFocusHostComponent(type, props) {
  switch (type) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      return !!props.autoFocus;
  }

  return false;
}

function getRootHostContext(rootContainerInstance) {
  var type;
  var namespace;
  var nodeType = rootContainerInstance.nodeType;

  switch (nodeType) {
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE: {
      type = nodeType === DOCUMENT_NODE ? "#document" : "#fragment";
      var root = rootContainerInstance.documentElement;
      namespace = root ? root.namespaceURI : getChildNamespace(null, "");
      break;
    }

    default: {
      var container =
        nodeType === COMMENT_NODE
          ? rootContainerInstance.parentNode
          : rootContainerInstance;
      var ownNamespace = container.namespaceURI || null;
      type = container.tagName;
      namespace = getChildNamespace(ownNamespace, type);
      break;
    }
  }

  return namespace;
}
function getChildHostContext(parentHostContext, type, rootContainerInstance) {
  var parentNamespace = parentHostContext;
  return getChildNamespace(parentNamespace, type);
}
function getPublicInstance(instance) {
  return instance;
}
function prepareForCommit(containerInfo) {
  eventsEnabled = isEnabled();
  selectionInformation = getSelectionInformation();
  setEnabled(false);
}
function resetAfterCommit(containerInfo) {
  restoreSelection(selectionInformation);
  selectionInformation = null;
  setEnabled(eventsEnabled);
  eventsEnabled = null;
}
function createInstance(
  type,
  props,
  rootContainerInstance,
  hostContext,
  internalInstanceHandle
) {
  var parentNamespace;

  {
    parentNamespace = hostContext;
  }

  var domElement = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace
  );
  precacheFiberNode(internalInstanceHandle, domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
function appendInitialChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
function finalizeInitialChildren(
  domElement,
  type,
  props,
  rootContainerInstance,
  hostContext
) {
  setInitialProperties(domElement, type, props, rootContainerInstance);
  return shouldAutoFocusHostComponent(type, props);
}
function prepareUpdate(
  domElement,
  type,
  oldProps,
  newProps,
  rootContainerInstance,
  hostContext
) {
  return diffProperties(
    domElement,
    type,
    oldProps,
    newProps,
    rootContainerInstance
  );
}
function shouldSetTextContent(type, props) {
  return (
    type === "textarea" ||
    type === "option" ||
    type === "noscript" ||
    typeof props.children === "string" ||
    typeof props.children === "number" ||
    (typeof props.dangerouslySetInnerHTML === "object" &&
      props.dangerouslySetInnerHTML !== null &&
      props.dangerouslySetInnerHTML.__html != null)
  );
}
function shouldDeprioritizeSubtree(type, props) {
  return !!props.hidden;
}
function createTextInstance(
  text,
  rootContainerInstance,
  hostContext,
  internalInstanceHandle
) {
  var textNode = createTextNode(text, rootContainerInstance);
  precacheFiberNode(internalInstanceHandle, textNode);
  return textNode;
}
var isPrimaryRenderer = true;
// This initialization code may run even on server environments
// if a component just imports ReactDOM (e.g. for findDOMNode).
// Some environments might not have setTimeout or clearTimeout.

var scheduleTimeout = typeof setTimeout === "function" ? setTimeout : undefined;
var cancelTimeout =
  typeof clearTimeout === "function" ? clearTimeout : undefined;
var noTimeout = -1; // -------------------
//     Mutation
// -------------------

var supportsMutation = true;
function commitMount(domElement, type, newProps, internalInstanceHandle) {
  // Despite the naming that might imply otherwise, this method only
  // fires if there is an `Update` effect scheduled during mounting.
  // This happens if `finalizeInitialChildren` returns `true` (which it
  // does to implement the `autoFocus` attribute on the client). But
  // there are also other cases when this might happen (such as patching
  // up text content during hydration mismatch). So we'll check this again.
  if (shouldAutoFocusHostComponent(type, newProps)) {
    domElement.focus();
  }
}
function commitUpdate(
  domElement,
  updatePayload,
  type,
  oldProps,
  newProps,
  internalInstanceHandle
) {
  // Update the props handle so that we know which props are the ones with
  // with current event handlers.
  updateFiberProps(domElement, newProps); // Apply the diff to the DOM node.

  updateProperties(domElement, updatePayload, type, oldProps, newProps);
}
function resetTextContent(domElement) {
  setTextContent(domElement, "");
}
function commitTextUpdate(textInstance, oldText, newText) {
  textInstance.nodeValue = newText;
}
function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
function appendChildToContainer(container, child) {
  var parentNode;

  if (container.nodeType === COMMENT_NODE) {
    parentNode = container.parentNode;
    parentNode.insertBefore(child, container);
  } else {
    parentNode = container;
    parentNode.appendChild(child);
  } // This container might be used for a portal.
  // If something inside a portal is clicked, that click should bubble
  // through the React tree. However, on Mobile Safari the click would
  // never bubble through the *DOM* tree unless an ancestor with onclick
  // event exists. So we wouldn't see it and dispatch it.
  // This is why we ensure that non React root containers have inline onclick
  // defined.
  // https://github.com/facebook/react/issues/11918

  var reactRootContainer = container._reactRootContainer;

  if (
    (reactRootContainer === null || reactRootContainer === undefined) &&
    parentNode.onclick === null
  ) {
    // TODO: This cast may not be sound for SVG, MathML or custom elements.
    trapClickOnNonInteractiveElement(parentNode);
  }
}
function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
function insertInContainerBefore(container, child, beforeChild) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.insertBefore(child, beforeChild);
  } else {
    container.insertBefore(child, beforeChild);
  }
}
function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}
function removeChildFromContainer(container, child) {
  if (container.nodeType === COMMENT_NODE) {
    container.parentNode.removeChild(child);
  } else {
    container.removeChild(child);
  }
}
function clearSuspenseBoundary(parentInstance, suspenseInstance) {
  var node = suspenseInstance; // Delete all nodes within this suspense boundary.
  // There might be nested nodes so we need to keep track of how
  // deep we are and only break out when we're back on top.

  var depth = 0;

  do {
    var nextNode = node.nextSibling;
    parentInstance.removeChild(node);

    if (nextNode && nextNode.nodeType === COMMENT_NODE) {
      var data = nextNode.data;

      if (data === SUSPENSE_END_DATA) {
        if (depth === 0) {
          parentInstance.removeChild(nextNode);
          return;
        } else {
          depth--;
        }
      } else if (
        data === SUSPENSE_START_DATA ||
        data === SUSPENSE_PENDING_START_DATA ||
        data === SUSPENSE_FALLBACK_START_DATA
      ) {
        depth++;
      }
    }

    node = nextNode;
  } while (node); // TODO: Warn, we didn't find the end comment boundary.
}
function clearSuspenseBoundaryFromContainer(container, suspenseInstance) {
  if (container.nodeType === COMMENT_NODE) {
    clearSuspenseBoundary(container.parentNode, suspenseInstance);
  } else if (container.nodeType === ELEMENT_NODE) {
    clearSuspenseBoundary(container, suspenseInstance);
  } else {
    // Document nodes should never contain suspense boundaries.
  }
}
function hideInstance(instance) {
  // TODO: Does this work for all element types? What about MathML? Should we
  // pass host context to this method?
  instance = instance;
  var style = instance.style;

  if (typeof style.setProperty === "function") {
    style.setProperty("display", "none", "important");
  } else {
    style.display = "none";
  }
}
function hideTextInstance(textInstance) {
  textInstance.nodeValue = "";
}
function unhideInstance(instance, props) {
  instance = instance;
  var styleProp = props[STYLE];
  var display =
    styleProp !== undefined &&
    styleProp !== null &&
    styleProp.hasOwnProperty("display")
      ? styleProp.display
      : null;
  instance.style.display = dangerousStyleValue("display", display);
}
function unhideTextInstance(textInstance, text) {
  textInstance.nodeValue = text;
} // -------------------
//     Hydration
// -------------------

var supportsHydration = true;
function canHydrateInstance(instance, type, props) {
  if (
    instance.nodeType !== ELEMENT_NODE ||
    type.toLowerCase() !== instance.nodeName.toLowerCase()
  ) {
    return null;
  } // This has now been refined to an element node.

  return instance;
}
function canHydrateTextInstance(instance, text) {
  if (text === "" || instance.nodeType !== TEXT_NODE) {
    // Empty strings are not parsed by HTML so there won't be a correct match here.
    return null;
  } // This has now been refined to a text node.

  return instance;
}
function canHydrateSuspenseInstance(instance) {
  if (instance.nodeType !== COMMENT_NODE) {
    // Empty strings are not parsed by HTML so there won't be a correct match here.
    return null;
  } // This has now been refined to a suspense node.

  return instance;
}
function isSuspenseInstancePending(instance) {
  return instance.data === SUSPENSE_PENDING_START_DATA;
}
function isSuspenseInstanceFallback(instance) {
  return instance.data === SUSPENSE_FALLBACK_START_DATA;
}
function registerSuspenseInstanceRetry(instance, callback) {
  instance._reactRetry = callback;
}

function getNextHydratable(node) {
  // Skip non-hydratable nodes.
  for (; node != null; node = node.nextSibling) {
    var nodeType = node.nodeType;

    if (nodeType === ELEMENT_NODE || nodeType === TEXT_NODE) {
      break;
    }

    if (enableSuspenseServerRenderer) {
      if (nodeType === COMMENT_NODE) {
        var nodeData = node.data;

        if (
          nodeData === SUSPENSE_START_DATA ||
          nodeData === SUSPENSE_FALLBACK_START_DATA ||
          nodeData === SUSPENSE_PENDING_START_DATA
        ) {
          break;
        }
      }
    }
  }

  return node;
}

function getNextHydratableSibling(instance) {
  return getNextHydratable(instance.nextSibling);
}
function getFirstHydratableChild(parentInstance) {
  return getNextHydratable(parentInstance.firstChild);
}
function hydrateInstance(
  instance,
  type,
  props,
  rootContainerInstance,
  hostContext,
  internalInstanceHandle
) {
  precacheFiberNode(internalInstanceHandle, instance); // TODO: Possibly defer this until the commit phase where all the events
  // get attached.

  updateFiberProps(instance, props);
  var parentNamespace;

  {
    parentNamespace = hostContext;
  }

  return diffHydratedProperties(
    instance,
    type,
    props,
    parentNamespace,
    rootContainerInstance
  );
}
function hydrateTextInstance(textInstance, text, internalInstanceHandle) {
  precacheFiberNode(internalInstanceHandle, textInstance);
  return diffHydratedText(textInstance, text);
}
function getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance) {
  var node = suspenseInstance.nextSibling; // Skip past all nodes within this suspense boundary.
  // There might be nested nodes so we need to keep track of how
  // deep we are and only break out when we're back on top.

  var depth = 0;

  while (node) {
    if (node.nodeType === COMMENT_NODE) {
      var data = node.data;

      if (data === SUSPENSE_END_DATA) {
        if (depth === 0) {
          return getNextHydratableSibling(node);
        } else {
          depth--;
        }
      } else if (
        data === SUSPENSE_START_DATA ||
        data === SUSPENSE_FALLBACK_START_DATA ||
        data === SUSPENSE_PENDING_START_DATA
      ) {
        depth++;
      }
    }

    node = node.nextSibling;
  } // TODO: Warn, we didn't find the end comment boundary.

  return null;
}

function mountResponderInstance(
  responder,
  responderInstance,
  responderProps,
  responderState,
  instance,
  rootContainerInstance
) {
  // Listen to events
  var doc = rootContainerInstance.ownerDocument;
  var documentBody = doc.body || doc;
  var _ref = responder,
    rootEventTypes = _ref.rootEventTypes,
    targetEventTypes = _ref.targetEventTypes;

  if (targetEventTypes !== null) {
    listenToEventResponderEventTypes(targetEventTypes, documentBody);
  }

  if (rootEventTypes !== null) {
    addRootEventTypesForResponderInstance(responderInstance, rootEventTypes);
    listenToEventResponderEventTypes(rootEventTypes, documentBody);
  }

  mountEventResponder(
    responder,
    responderInstance,
    responderProps,
    responderState
  );
  return responderInstance;
}
function unmountResponderInstance(responderInstance) {
  if (enableFlareAPI) {
    // TODO stop listening to targetEventTypes
    unmountEventResponder(responderInstance);
  }
}
function getFundamentalComponentInstance(fundamentalInstance) {
  if (enableFundamentalAPI) {
    var currentFiber = fundamentalInstance.currentFiber,
      impl = fundamentalInstance.impl,
      props = fundamentalInstance.props,
      state = fundamentalInstance.state;
    var instance = impl.getInstance(null, props, state);
    precacheFiberNode(currentFiber, instance);
    return instance;
  } // Because of the flag above, this gets around the Flow error;

  return null;
}
function mountFundamentalComponent(fundamentalInstance) {
  if (enableFundamentalAPI) {
    var impl = fundamentalInstance.impl,
      instance = fundamentalInstance.instance,
      props = fundamentalInstance.props,
      state = fundamentalInstance.state;
    var onMount = impl.onMount;

    if (onMount !== undefined) {
      onMount(null, instance, props, state);
    }
  }
}
function shouldUpdateFundamentalComponent(fundamentalInstance) {
  if (enableFundamentalAPI) {
    var impl = fundamentalInstance.impl,
      prevProps = fundamentalInstance.prevProps,
      props = fundamentalInstance.props,
      state = fundamentalInstance.state;
    var shouldUpdate = impl.shouldUpdate;

    if (shouldUpdate !== undefined) {
      return shouldUpdate(null, prevProps, props, state);
    }
  }

  return true;
}
function updateFundamentalComponent(fundamentalInstance) {
  if (enableFundamentalAPI) {
    var impl = fundamentalInstance.impl,
      instance = fundamentalInstance.instance,
      prevProps = fundamentalInstance.prevProps,
      props = fundamentalInstance.props,
      state = fundamentalInstance.state;
    var onUpdate = impl.onUpdate;

    if (onUpdate !== undefined) {
      onUpdate(null, instance, prevProps, props, state);
    }
  }
}
function unmountFundamentalComponent(fundamentalInstance) {
  if (enableFundamentalAPI) {
    var impl = fundamentalInstance.impl,
      instance = fundamentalInstance.instance,
      props = fundamentalInstance.props,
      state = fundamentalInstance.state;
    var onUnmount = impl.onUnmount;

    if (onUnmount !== undefined) {
      onUnmount(null, instance, props, state);
    }
  }
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
        {
          throw ReactErrorProd(Error(168));
        }
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
          {
            throw ReactErrorProd(
              Error(108),
              getComponentName(type) || "Unknown",
              contextKey
            );
          }
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
        {
          throw ReactErrorProd(Error(169));
        }
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
        {
          throw ReactErrorProd(Error(170));
        }
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
        {
          throw ReactErrorProd(Error(171));
        }
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
      {
        throw ReactErrorProd(Error(302));
      }
    }
  })();
}

var fakeCallbackNode = {}; // Except for NoPriority, these correspond to Scheduler priorities. We use
// ascending numbers so we can compare them like numbers. They start at 90 to
// avoid clashing with Scheduler's priorities.

var ImmediatePriority = 99;
var UserBlockingPriority$2 = 98;
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
      return UserBlockingPriority$2;

    case Scheduler_NormalPriority:
      return NormalPriority;

    case Scheduler_LowPriority:
      return LowPriority;

    case Scheduler_IdlePriority:
      return IdlePriority;

    default:
      (function() {
        {
          {
            throw ReactErrorProd(Error(332));
          }
        }
      })();
  }
}

function reactPriorityToSchedulerPriority(reactPriorityLevel) {
  switch (reactPriorityLevel) {
    case ImmediatePriority:
      return Scheduler_ImmediatePriority;

    case UserBlockingPriority$2:
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
          {
            throw ReactErrorProd(Error(332));
          }
        }
      })();
  }
}

function runWithPriority$2(reactPriorityLevel, fn) {
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
      runWithPriority$2(ImmediatePriority, function() {
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
    return UserBlockingPriority$2;
  }

  if (msUntil <= LOW_PRIORITY_EXPIRATION + LOW_PRIORITY_BATCH_SIZE) {
    return NormalPriority;
  } // TODO: Handle LowPriority
  // Assume anything lower has idle priority

  return IdlePriority;
}

var lowPriorityWarning = require("lowPriorityWarning");

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
          {
            throw ReactErrorProd(Error(341));
          }
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
          {
            throw ReactErrorProd(Error(308));
          }
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
      {
        throw ReactErrorProd(Error(191), callback);
      }
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
            {
              throw ReactErrorProd(Error(309));
            }
          }
        })();

        inst = ownerFiber.stateNode;
      }

      (function() {
        if (!inst) {
          {
            throw ReactErrorProd(Error(147), mixedRef);
          }
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
          {
            throw ReactErrorProd(Error(284));
          }
        }
      })();

      (function() {
        if (!element._owner) {
          {
            throw ReactErrorProd(Error(290), mixedRef);
          }
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
        {
          throw ReactErrorProd(
            Error(31),
            Object.prototype.toString.call(newChild) === "[object Object]"
              ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
              : newChild,
            addendum
          );
        }
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
        {
          throw ReactErrorProd(Error(150));
        }
      }
    })();

    var newChildren = iteratorFn.call(newChildrenIterable);

    (function() {
      if (!(newChildren != null)) {
        {
          throw ReactErrorProd(Error(151));
        }
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
              {
                throw ReactErrorProd(
                  Error(152),
                  Component.displayName || Component.name || "Component"
                );
              }
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
      {
        throw ReactErrorProd(Error(153));
      }
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
      {
        throw ReactErrorProd(Error(174));
      }
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
      {
        throw ReactErrorProd(Error(321));
      }
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
      {
        throw ReactErrorProd(Error(300));
      }
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
        {
          throw ReactErrorProd(Error(310));
        }
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
      {
        throw ReactErrorProd(Error(311));
      }
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
      {
        throw ReactErrorProd(Error(301));
      }
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
        {
          throw ReactErrorProd(Error(175));
        }
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
        {
          throw ReactErrorProd(Error(176));
        }
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
        {
          throw ReactErrorProd(Error(316));
        }
      }
    })();
  }

  var suspenseState = fiber.memoizedState;
  var suspenseInstance =
    suspenseState !== null ? suspenseState.dehydrated : null;

  (function() {
    if (!suspenseInstance) {
      {
        throw ReactErrorProd(Error(317));
      }
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
      {
        throw ReactErrorProd(Error(282));
      }
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
          {
            throw ReactErrorProd(Error(306), Component, hint);
          }
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
      {
        throw ReactErrorProd(Error(156));
      }
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

var emptyObject = {};
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
              {
                throw ReactErrorProd(Error(166));
              }
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
              {
                throw ReactErrorProd(Error(166));
              }
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
                {
                  throw ReactErrorProd(Error(318));
                }
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
          {
            throw ReactErrorProd(Error(156));
          }
        }
      })();
  }

  return null;
}

function mountEventResponder$1(
  responder,
  responderProps,
  instance,
  rootContainerInstance,
  fiber,
  respondersMap
) {
  var responderState = emptyObject;
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
      {
        throw ReactErrorProd(Error(339));
      }
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
    mountEventResponder$1(
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
          {
            throw ReactErrorProd(Error(285));
          }
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
              {
                throw ReactErrorProd(Error(340));
              }
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

var ReactFiberErrorDialogWWW = require("ReactFiberErrorDialog");

(function() {
  if (!(typeof ReactFiberErrorDialogWWW.showErrorDialog === "function")) {
    {
      throw ReactErrorProd(Error(320));
    }
  }
})();

function showErrorDialog(capturedError) {
  return ReactFiberErrorDialogWWW.showErrorDialog(capturedError);
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
          {
            throw ReactErrorProd(Error(163));
          }
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
        commitMount(_instance2, type, props, finishedWork);
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
          {
            throw ReactErrorProd(Error(163));
          }
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
          runWithPriority$2(priorityLevel, function() {
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
          {
            throw ReactErrorProd(Error(163));
          }
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
      {
        throw ReactErrorProd(Error(160));
      }
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
          {
            throw ReactErrorProd(Error(161));
          }
        }
      })();
  }

  if (parentFiber.effectTag & ContentReset) {
    // Reset the text content of the parent before doing any insertions
    resetTextContent(parent); // Clear ContentReset from the effect tag

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
            {
              throw ReactErrorProd(Error(160));
            }
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
          {
            throw ReactErrorProd(Error(162));
          }
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
          {
            throw ReactErrorProd(Error(163));
          }
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

var PossiblyWeakMap$1 = typeof WeakMap === "function" ? WeakMap : Map;

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
    pingCache = root.pingCache = new PossiblyWeakMap$1();
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

      case UserBlockingPriority$2:
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
            {
              throw ReactErrorProd(Error(326));
            }
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
var lastUniqueAsyncExpiration = NoWork;
function computeUniqueAsyncExpiration() {
  var currentTime = requestCurrentTime();
  var result = computeAsyncExpiration(currentTime);

  if (result <= lastUniqueAsyncExpiration) {
    // Since we assume the current time monotonically increases, we only hit
    // this branch when computeUniqueAsyncExpiration is fired multiple times
    // within a 200ms window (or whatever the async bucket size is).
    result -= 1;
  }

  lastUniqueAsyncExpiration = result;
  return result;
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
    (priorityLevel === UserBlockingPriority$2 ||
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

function flushRoot(root, expirationTime) {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    (function() {
      {
        {
          throw ReactErrorProd(Error(253));
        }
      }
    })();
  }

  scheduleSyncCallback(renderRoot.bind(null, root, expirationTime));
  flushSyncCallbackQueue();
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
    return runWithPriority$2(UserBlockingPriority$2, fn.bind(null, a, b, c));
  } finally {
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
function unbatchedUpdates(fn, a) {
  var prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;

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
function flushSync(fn, a) {
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    (function() {
      {
        {
          throw ReactErrorProd(Error(187));
        }
      }
    })();
  }

  var prevExecutionContext = executionContext;
  executionContext |= BatchedContext;

  try {
    return runWithPriority$2(ImmediatePriority, fn.bind(null, a));
  } finally {
    executionContext = prevExecutionContext; // Flush the immediate callbacks that were scheduled during this batch.
    // Note that this will happen even if batchedUpdates is higher up
    // the stack.

    flushSyncCallbackQueue();
  }
}
function flushControlled(fn) {
  var prevExecutionContext = executionContext;
  executionContext |= BatchedContext;

  try {
    runWithPriority$2(ImmediatePriority, fn);
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
      {
        throw ReactErrorProd(Error(327));
      }
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
          {
            throw ReactErrorProd(Error(328));
          }
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
          {
            throw ReactErrorProd(Error(329));
          }
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
  runWithPriority$2(
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
      {
        throw ReactErrorProd(Error(327));
      }
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
      {
        throw ReactErrorProd(Error(177));
      }
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
              {
                throw ReactErrorProd(Error(330));
              }
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
              {
                throw ReactErrorProd(Error(330));
              }
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
              {
                throw ReactErrorProd(Error(330));
              }
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
  return runWithPriority$2(
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
      {
        throw ReactErrorProd(Error(331));
      }
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
            {
              throw ReactErrorProd(Error(330));
            }
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
            {
              throw ReactErrorProd(Error(314));
            }
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
        {
          throw ReactErrorProd(Error(185));
        }
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
            {
              throw ReactErrorProd(
                Error(130),
                type == null ? type : typeof type,
                info
              );
            }
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
          {
            throw ReactErrorProd(Error(188));
          }
        }
      })();
    } else {
      (function() {
        {
          {
            throw ReactErrorProd(Error(268), Object.keys(component));
          }
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

function createPortal$1(
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

// TODO: This type is shared between the reconciler and ReactDOM, but will
// eventually be lifted out to the renderer.
var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
var didWarnAboutUnstableCreatePortal = false;

setRestoreImplementation(restoreControlledState$1);

function ReactBatch(root) {
  var expirationTime = computeUniqueAsyncExpiration();
  this._expirationTime = expirationTime;
  this._root = root;
  this._next = null;
  this._callbacks = null;
  this._didComplete = false;
  this._hasChildren = false;
  this._children = null;
  this._defer = true;
}

ReactBatch.prototype.render = function(children) {
  var _this = this;

  (function() {
    if (!_this._defer) {
      {
        throw ReactErrorProd(Error(250));
      }
    }
  })();

  this._hasChildren = true;
  this._children = children;
  var internalRoot = this._root._internalRoot;
  var expirationTime = this._expirationTime;
  var work = new ReactWork();
  updateContainerAtExpirationTime(
    children,
    internalRoot,
    null,
    expirationTime,
    null,
    work._onCommit
  );
  return work;
};

ReactBatch.prototype.then = function(onComplete) {
  if (this._didComplete) {
    onComplete();
    return;
  }

  var callbacks = this._callbacks;

  if (callbacks === null) {
    callbacks = this._callbacks = [];
  }

  callbacks.push(onComplete);
};

ReactBatch.prototype.commit = function() {
  var _this2 = this;

  var internalRoot = this._root._internalRoot;
  var firstBatch = internalRoot.firstBatch;

  (function() {
    if (!(_this2._defer && firstBatch !== null)) {
      {
        throw ReactErrorProd(Error(251));
      }
    }
  })();

  if (!this._hasChildren) {
    // This batch is empty. Return.
    this._next = null;
    this._defer = false;
    return;
  }

  var expirationTime = this._expirationTime; // Ensure this is the first batch in the list.

  if (firstBatch !== this) {
    // This batch is not the earliest batch. We need to move it to the front.
    // Update its expiration time to be the expiration time of the earliest
    // batch, so that we can flush it without flushing the other batches.
    if (this._hasChildren) {
      expirationTime = this._expirationTime = firstBatch._expirationTime; // Rendering this batch again ensures its children will be the final state
      // when we flush (updates are processed in insertion order: last
      // update wins).
      // TODO: This forces a restart. Should we print a warning?

      this.render(this._children);
    } // Remove the batch from the list.

    var previous = null;
    var batch = firstBatch;

    while (batch !== this) {
      previous = batch;
      batch = batch._next;
    }

    (function() {
      if (!(previous !== null)) {
        {
          throw ReactErrorProd(Error(251));
        }
      }
    })();

    previous._next = batch._next; // Add it to the front.

    this._next = firstBatch;
    firstBatch = internalRoot.firstBatch = this;
  } // Synchronously flush all the work up to this batch's expiration time.

  this._defer = false;
  flushRoot(internalRoot, expirationTime); // Pop the batch from the list.

  var next = this._next;
  this._next = null;
  firstBatch = internalRoot.firstBatch = next; // Append the next earliest batch's children to the update queue.

  if (firstBatch !== null && firstBatch._hasChildren) {
    firstBatch.render(firstBatch._children);
  }
};

ReactBatch.prototype._onComplete = function() {
  if (this._didComplete) {
    return;
  }

  this._didComplete = true;
  var callbacks = this._callbacks;

  if (callbacks === null) {
    return;
  } // TODO: Error handling.

  for (var i = 0; i < callbacks.length; i++) {
    var _callback = callbacks[i];

    _callback();
  }
};

function ReactWork() {
  this._callbacks = null;
  this._didCommit = false; // TODO: Avoid need to bind by replacing callbacks in the update queue with
  // list of Work objects.

  this._onCommit = this._onCommit.bind(this);
}

ReactWork.prototype.then = function(onCommit) {
  if (this._didCommit) {
    onCommit();
    return;
  }

  var callbacks = this._callbacks;

  if (callbacks === null) {
    callbacks = this._callbacks = [];
  }

  callbacks.push(onCommit);
};

ReactWork.prototype._onCommit = function() {
  if (this._didCommit) {
    return;
  }

  this._didCommit = true;
  var callbacks = this._callbacks;

  if (callbacks === null) {
    return;
  } // TODO: Error handling.

  for (var i = 0; i < callbacks.length; i++) {
    var _callback2 = callbacks[i];

    (function() {
      if (!(typeof _callback2 === "function")) {
        {
          throw ReactErrorProd(Error(191), _callback2);
        }
      }
    })();

    _callback2();
  }
};

function ReactSyncRoot(container, tag, options) {
  // Tag is either LegacyRoot or Concurrent Root
  var hydrate = options != null && options.hydrate === true;
  var hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  var root = createContainer(container, tag, hydrate, hydrationCallbacks);
  this._internalRoot = root;
}

function ReactRoot(container, options) {
  var hydrate = options != null && options.hydrate === true;
  var hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  var root = createContainer(
    container,
    ConcurrentRoot,
    hydrate,
    hydrationCallbacks
  );
  this._internalRoot = root;
}

ReactRoot.prototype.render = ReactSyncRoot.prototype.render = function(
  children,
  callback
) {
  var root = this._internalRoot;
  var work = new ReactWork();
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    work.then(callback);
  }

  updateContainer(children, root, null, work._onCommit);
  return work;
};

ReactRoot.prototype.unmount = ReactSyncRoot.prototype.unmount = function(
  callback
) {
  var root = this._internalRoot;
  var work = new ReactWork();
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    work.then(callback);
  }

  updateContainer(null, root, null, work._onCommit);
  return work;
}; // Sync roots cannot create batches. Only concurrent ones.

ReactRoot.prototype.createBatch = function() {
  var batch = new ReactBatch(this);
  var expirationTime = batch._expirationTime;
  var internalRoot = this._internalRoot;
  var firstBatch = internalRoot.firstBatch;

  if (firstBatch === null) {
    internalRoot.firstBatch = batch;
    batch._next = null;
  } else {
    // Insert sorted by expiration time then insertion order
    var insertAfter = null;
    var insertBefore = firstBatch;

    while (
      insertBefore !== null &&
      insertBefore._expirationTime >= expirationTime
    ) {
      insertAfter = insertBefore;
      insertBefore = insertBefore._next;
    }

    batch._next = insertBefore;

    if (insertAfter !== null) {
      insertAfter._next = batch;
    }
  }

  return batch;
};
/**
 * True if the supplied DOM node is a valid node element.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM is a valid DOM node.
 * @internal
 */

function isValidContainer(node) {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        node.nodeValue === " react-mount-point-unstable "))
  );
}

function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

function shouldHydrateDueToLegacyHeuristic(container) {
  var rootElement = getReactRootElementInContainer(container);
  return !!(
    rootElement &&
    rootElement.nodeType === ELEMENT_NODE &&
    rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME)
  );
}

setBatchingImplementation(
  batchedUpdates$1,
  discreteUpdates$1,
  flushDiscreteUpdates,
  batchedEventUpdates$1
);
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  var shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container); // First clear any existing content.

  if (!shouldHydrate) {
    var rootSibling;

    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  return new ReactSyncRoot(
    container,
    LegacyRoot,
    shouldHydrate
      ? {
          hydrate: true
        }
      : undefined
  );
}

function legacyRenderSubtreeIntoContainer(
  parentComponent,
  children,
  container,
  forceHydrate,
  callback
) {
  var root = container._reactRootContainer;
  var fiberRoot;

  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate
    );
    fiberRoot = root._internalRoot;

    if (typeof callback === "function") {
      var originalCallback = callback;

      callback = function() {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.

    unbatchedUpdates(function() {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;

    if (typeof callback === "function") {
      var _originalCallback = callback;

      callback = function() {
        var instance = getPublicRootInstance(fiberRoot);

        _originalCallback.call(instance);
      };
    } // Update

    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}

function createPortal$$1(children, container) {
  var key =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  (function() {
    if (!isValidContainer(container)) {
      {
        throw ReactErrorProd(Error(200));
      }
    }
  })(); // TODO: pass ReactDOM portal implementation as third argument

  return createPortal$1(children, container, null, key);
}

var ReactDOM$1 = {
  createPortal: createPortal$$1,
  findDOMNode: function(componentOrElement) {
    if (componentOrElement == null) {
      return null;
    }

    if (componentOrElement.nodeType === ELEMENT_NODE) {
      return componentOrElement;
    }

    return findHostInstance(componentOrElement);
  },
  hydrate: function(element, container, callback) {
    (function() {
      if (!isValidContainer(container)) {
        {
          throw ReactErrorProd(Error(200));
        }
      }
    })();

    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      true,
      callback
    );
  },
  render: function(element, container, callback) {
    (function() {
      if (!isValidContainer(container)) {
        {
          throw ReactErrorProd(Error(200));
        }
      }
    })();

    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback
    );
  },
  unstable_renderSubtreeIntoContainer: function(
    parentComponent,
    element,
    containerNode,
    callback
  ) {
    (function() {
      if (!isValidContainer(containerNode)) {
        {
          throw ReactErrorProd(Error(200));
        }
      }
    })();

    (function() {
      if (!(parentComponent != null && has(parentComponent))) {
        {
          throw ReactErrorProd(Error(38));
        }
      }
    })();

    return legacyRenderSubtreeIntoContainer(
      parentComponent,
      element,
      containerNode,
      false,
      callback
    );
  },
  unmountComponentAtNode: function(container) {
    (function() {
      if (!isValidContainer(container)) {
        {
          throw ReactErrorProd(Error(40));
        }
      }
    })();

    if (container._reactRootContainer) {
      unbatchedUpdates(function() {
        legacyRenderSubtreeIntoContainer(
          null,
          null,
          container,
          false,
          function() {
            container._reactRootContainer = null;
          }
        );
      }); // If you call unmountComponentAtNode twice in quick succession, you'll
      // get `true` twice. That's probably fine?

      return true;
    } else {
      return false;
    }
  },
  // Temporary alias since we already shipped React 16 RC with it.
  // TODO: remove in React 17.
  unstable_createPortal: function() {
    if (!didWarnAboutUnstableCreatePortal) {
      didWarnAboutUnstableCreatePortal = true;
      lowPriorityWarning(
        false,
        "The ReactDOM.unstable_createPortal() alias has been deprecated, " +
          "and will be removed in React 17+. Update your code to use " +
          "ReactDOM.createPortal() instead. It has the exact same API, " +
          'but without the "unstable_" prefix.'
      );
    }

    return createPortal$$1.apply(void 0, arguments);
  },
  unstable_batchedUpdates: batchedUpdates$1,
  // TODO remove this legacy method, unstable_discreteUpdates replaces it
  unstable_interactiveUpdates: function(fn, a, b, c) {
    flushDiscreteUpdates();
    return discreteUpdates$1(fn, a, b, c);
  },
  unstable_discreteUpdates: discreteUpdates$1,
  unstable_flushDiscreteUpdates: flushDiscreteUpdates,
  flushSync: flushSync,
  unstable_createRoot: createRoot,
  unstable_createSyncRoot: createSyncRoot,
  unstable_flushControlled: flushControlled,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    // Keep in sync with ReactDOMUnstableNativeDependencies.js
    // ReactTestUtils.js, and ReactTestUtilsAct.js. This is an array for better minification.
    Events: [
      getInstanceFromNode$1,
      getNodeFromInstance$1,
      getFiberCurrentPropsFromNode$1,
      injection.injectEventPluginsByName,
      eventNameDispatchConfigs,
      accumulateTwoPhaseDispatches,
      accumulateDirectDispatches,
      enqueueStateRestore,
      restoreStateIfNeeded,
      dispatchEvent,
      runEventsInBatch,
      flushPassiveEffects,
      IsThisRendererActing
    ]
  }
};

function createRoot(container, options) {
  var functionName = enableStableConcurrentModeAPIs
    ? "createRoot"
    : "unstable_createRoot";

  (function() {
    if (!isValidContainer(container)) {
      {
        throw ReactErrorProd(Error(299), functionName);
      }
    }
  })();

  return new ReactRoot(container, options);
}

function createSyncRoot(container, options) {
  var functionName = enableStableConcurrentModeAPIs
    ? "createRoot"
    : "unstable_createRoot";

  (function() {
    if (!isValidContainer(container)) {
      {
        throw ReactErrorProd(Error(299), functionName);
      }
    }
  })();

  return new ReactSyncRoot(container, BatchedRoot, options);
}

if (enableStableConcurrentModeAPIs) {
  ReactDOM$1.createRoot = createRoot;
  ReactDOM$1.createSyncRoot = createSyncRoot;
}

var foundDevTools = injectIntoDevTools({
  findFiberByHostInstance: getClosestInstanceFromNode,
  bundleType: 0,
  version: ReactVersion,
  rendererPackageName: "react-dom"
});

Object.assign(ReactDOM$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
  // These are real internal dependencies that are trickier to remove:
  ReactBrowserEventEmitter: {
    isEnabled: isEnabled
  },
  ReactFiberTreeReflection: {
    findCurrentFiberUsingSlowPath: findCurrentFiberUsingSlowPath
  },
  ReactDOMComponentTree: {
    getClosestInstanceFromNode: getClosestInstanceFromNode
  },
  ReactInstanceMap: {
    get: get
  },
  // Perf experiment
  addUserTimingListener: addUserTimingListener
});

var ReactDOMFB = {
  default: ReactDOM$1
};

var ReactDOMFB$1 = (ReactDOMFB && ReactDOM$1) || ReactDOMFB;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.

var index_fb = ReactDOMFB$1.default || ReactDOMFB$1;

module.exports = index_fb;
