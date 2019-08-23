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
Object.defineProperty(exports, "__esModule", { value: !0 });
var _require = require("SchedulerFeatureFlags"),
  enableIsInputPending = _require.enableIsInputPending,
  enableSchedulerDebugging = _require.enableSchedulerDebugging,
  requestIdleCallbackBeforeFirstFrame =
    _require.requestIdleCallbackBeforeFirstFrame,
  requestTimerEventBeforeFirstFrame =
    _require.requestTimerEventBeforeFirstFrame,
  enableMessageLoopImplementation = _require.enableMessageLoopImplementation,
  requestHostCallback,
  requestHostTimeout,
  cancelHostTimeout,
  shouldYieldToHost,
  requestPaint;
if ("undefined" === typeof window || "function" !== typeof MessageChannel) {
  var _callback = null,
    _timeoutID = null,
    _flushCallback = function() {
      if (null !== _callback)
        try {
          var currentTime = exports.unstable_now();
          _callback(!0, currentTime);
          _callback = null;
        } catch (e) {
          throw (setTimeout(_flushCallback, 0), e);
        }
    },
    initialTime = Date.now();
  exports.unstable_now = function() {
    return Date.now() - initialTime;
  };
  requestHostCallback = function(cb) {
    null !== _callback
      ? setTimeout(requestHostCallback, 0, cb)
      : ((_callback = cb), setTimeout(_flushCallback, 0));
  };
  requestHostTimeout = function(cb, ms) {
    _timeoutID = setTimeout(cb, ms);
  };
  cancelHostTimeout = function() {
    clearTimeout(_timeoutID);
  };
  shouldYieldToHost = function() {
    return !1;
  };
  requestPaint = exports.unstable_forceFrameRate = function() {};
} else {
  var performance = window.performance,
    _Date = window.Date,
    _setTimeout = window.setTimeout,
    _clearTimeout = window.clearTimeout,
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame,
    requestIdleCallback = window.requestIdleCallback;
  "undefined" !== typeof console &&
    ("function" !== typeof requestAnimationFrame &&
      console.error(
        "This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"
      ),
    "function" !== typeof cancelAnimationFrame &&
      console.error(
        "This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"
      ));
  var requestIdleCallbackBeforeFirstFrame$1 =
    requestIdleCallbackBeforeFirstFrame &&
    "function" === typeof requestIdleCallback &&
    "function" === typeof cancelIdleCallback;
  if ("object" === typeof performance && "function" === typeof performance.now)
    exports.unstable_now = function() {
      return performance.now();
    };
  else {
    var _initialTime = _Date.now();
    exports.unstable_now = function() {
      return _Date.now() - _initialTime;
    };
  }
  var isRAFLoopRunning = !1,
    isMessageLoopRunning = !1,
    scheduledHostCallback = null,
    rAFTimeoutID = -1,
    taskTimeoutID = -1,
    frameLength = enableMessageLoopImplementation ? 5 : 33.33,
    prevRAFTime = -1,
    prevRAFInterval = -1,
    frameDeadline = 0,
    fpsLocked = !1,
    needsPaint = !1;
  if (
    enableIsInputPending &&
    void 0 !== navigator &&
    void 0 !== navigator.scheduling &&
    void 0 !== navigator.scheduling.isInputPending
  ) {
    var scheduling = navigator.scheduling;
    shouldYieldToHost = function() {
      var currentTime = exports.unstable_now();
      return currentTime >= frameDeadline
        ? needsPaint || scheduling.isInputPending()
          ? !0
          : currentTime >= frameDeadline + 300
        : !1;
    };
    requestPaint = function() {
      needsPaint = !0;
    };
  } else
    (shouldYieldToHost = function() {
      return exports.unstable_now() >= frameDeadline;
    }),
      (requestPaint = function() {});
  exports.unstable_forceFrameRate = function(fps) {
    0 > fps || 125 < fps
      ? console.error(
          "forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported"
        )
      : 0 < fps
        ? ((frameLength = Math.floor(1e3 / fps)), (fpsLocked = !0))
        : ((frameLength = 33.33), (fpsLocked = !1));
  };
  var performWorkUntilDeadline = function() {
      if (enableMessageLoopImplementation)
        if (null !== scheduledHostCallback) {
          var currentTime = exports.unstable_now();
          frameDeadline = currentTime + frameLength;
          try {
            scheduledHostCallback(!0, currentTime)
              ? port.postMessage(null)
              : ((isMessageLoopRunning = !1), (scheduledHostCallback = null));
          } catch (error) {
            throw (port.postMessage(null), error);
          }
        } else isMessageLoopRunning = !1;
      else if (null !== scheduledHostCallback) {
        currentTime = exports.unstable_now();
        var _hasTimeRemaining = 0 < frameDeadline - currentTime;
        try {
          scheduledHostCallback(_hasTimeRemaining, currentTime) ||
            (scheduledHostCallback = null);
        } catch (error) {
          throw (port.postMessage(null), error);
        }
      }
      needsPaint = !1;
    },
    channel = new MessageChannel(),
    port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  var onAnimationFrame = function(rAFTime) {
    if (null === scheduledHostCallback)
      (prevRAFInterval = prevRAFTime = -1), (isRAFLoopRunning = !1);
    else {
      isRAFLoopRunning = !0;
      requestAnimationFrame(function(nextRAFTime) {
        _clearTimeout(rAFTimeoutID);
        onAnimationFrame(nextRAFTime);
      });
      var onTimeout = function() {
        frameDeadline = exports.unstable_now() + frameLength / 2;
        performWorkUntilDeadline();
        rAFTimeoutID = _setTimeout(onTimeout, 3 * frameLength);
      };
      rAFTimeoutID = _setTimeout(onTimeout, 3 * frameLength);
      if (-1 !== prevRAFTime && 0.1 < rAFTime - prevRAFTime) {
        var rAFInterval = rAFTime - prevRAFTime;
        !fpsLocked &&
          -1 !== prevRAFInterval &&
          rAFInterval < frameLength &&
          prevRAFInterval < frameLength &&
          ((frameLength =
            rAFInterval < prevRAFInterval ? prevRAFInterval : rAFInterval),
          8.33 > frameLength && (frameLength = 8.33));
        prevRAFInterval = rAFInterval;
      }
      prevRAFTime = rAFTime;
      frameDeadline = rAFTime + frameLength;
      port.postMessage(null);
    }
  };
  requestHostCallback = function(callback) {
    scheduledHostCallback = callback;
    if (enableMessageLoopImplementation)
      isMessageLoopRunning ||
        ((isMessageLoopRunning = !0), port.postMessage(null));
    else if (!isRAFLoopRunning) {
      isRAFLoopRunning = !0;
      requestAnimationFrame(function(rAFTime) {
        requestIdleCallbackBeforeFirstFrame$1 &&
          cancelIdleCallback(idleCallbackID);
        requestTimerEventBeforeFirstFrame && _clearTimeout(idleTimeoutID);
        onAnimationFrame(rAFTime);
      });
      var idleCallbackID;
      requestIdleCallbackBeforeFirstFrame$1 &&
        (idleCallbackID = requestIdleCallback(function() {
          requestTimerEventBeforeFirstFrame && _clearTimeout(idleTimeoutID);
          frameDeadline = exports.unstable_now() + frameLength;
          performWorkUntilDeadline();
        }));
      var idleTimeoutID;
      requestTimerEventBeforeFirstFrame &&
        (idleTimeoutID = _setTimeout(function() {
          requestIdleCallbackBeforeFirstFrame$1 &&
            cancelIdleCallback(idleCallbackID);
          frameDeadline = exports.unstable_now() + frameLength;
          performWorkUntilDeadline();
        }, 0));
    }
  };
  requestHostTimeout = function(callback, ms) {
    taskTimeoutID = _setTimeout(function() {
      callback(exports.unstable_now());
    }, ms);
  };
  cancelHostTimeout = function() {
    _clearTimeout(taskTimeoutID);
    taskTimeoutID = -1;
  };
}
function push(heap, node) {
  var index = heap.length;
  heap.push(node);
  a: for (;;) {
    var parentIndex = Math.floor((index - 1) / 2),
      parent = heap[parentIndex];
    if (void 0 !== parent && 0 < compare(parent, node))
      (heap[parentIndex] = node), (heap[index] = parent), (index = parentIndex);
    else break a;
  }
}
function peek(heap) {
  heap = heap[0];
  return void 0 === heap ? null : heap;
}
function pop(heap) {
  var first = heap[0];
  if (void 0 !== first) {
    var last = heap.pop();
    if (last !== first) {
      heap[0] = last;
      a: for (var index = 0, length = heap.length; index < length; ) {
        var leftIndex = 2 * (index + 1) - 1,
          left = heap[leftIndex],
          rightIndex = leftIndex + 1,
          right = heap[rightIndex];
        if (void 0 !== left && 0 > compare(left, last))
          void 0 !== right && 0 > compare(right, left)
            ? ((heap[index] = right),
              (heap[rightIndex] = last),
              (index = rightIndex))
            : ((heap[index] = left),
              (heap[leftIndex] = last),
              (index = leftIndex));
        else if (void 0 !== right && 0 > compare(right, last))
          (heap[index] = right),
            (heap[rightIndex] = last),
            (index = rightIndex);
        else break a;
      }
    }
    return first;
  }
  return null;
}
function compare(a, b) {
  var diff = a.sortIndex - b.sortIndex;
  return 0 !== diff ? diff : a.id - b.id;
}
var runIdCounter = 0,
  mainThreadIdCounter = 0,
  sharedProfilingBuffer =
    "function" === typeof SharedArrayBuffer
      ? new SharedArrayBuffer(4 * Int32Array.BYTES_PER_ELEMENT)
      : "function" === typeof ArrayBuffer
        ? new ArrayBuffer(4 * Int32Array.BYTES_PER_ELEMENT)
        : null,
  profilingState =
    null !== sharedProfilingBuffer ? new Int32Array(sharedProfilingBuffer) : [];
profilingState[0] = 0;
profilingState[3] = 0;
var eventLogSize = (profilingState[1] = 0),
  eventLogBuffer = null,
  eventLog = null,
  eventLogIndex = 0;
function logEvent(entries) {
  if (null !== eventLog) {
    var offset = eventLogIndex;
    eventLogIndex += entries.length;
    if (eventLogIndex + 1 > eventLogSize) {
      eventLogSize = eventLogIndex + 1;
      var newEventLog = new Int32Array(
        eventLogSize * Int32Array.BYTES_PER_ELEMENT
      );
      newEventLog.set(eventLog);
      eventLogBuffer = newEventLog.buffer;
      eventLog = newEventLog;
    }
    eventLog.set(entries, offset);
  }
}
var taskQueue = [],
  timerQueue = [],
  taskIdCounter = 1,
  isSchedulerPaused = !1,
  currentTask = null,
  currentPriorityLevel = 3,
  isPerformingWork = !1,
  isHostCallbackScheduled = !1,
  isHostTimeoutScheduled = !1;
function advanceTimers(currentTime) {
  for (var timer = peek(timerQueue); null !== timer; ) {
    if (null === timer.callback) pop(timerQueue);
    else if (timer.startTime <= currentTime) {
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
      var task = timer;
      profilingState[3]++;
      null !== eventLog && logEvent([1, void 0, task.id, task.priorityLevel]);
      timer.isQueued = !0;
    } else break;
    timer = peek(timerQueue);
  }
}
function handleTimeout(currentTime) {
  isHostTimeoutScheduled = !1;
  advanceTimers(currentTime);
  if (!isHostCallbackScheduled)
    if (null !== peek(taskQueue))
      (isHostCallbackScheduled = !0), requestHostCallback(flushWork);
    else {
      var firstTimer = peek(timerQueue);
      null !== firstTimer &&
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
}
function flushWork(hasTimeRemaining, initialTime) {
  null !== eventLog && logEvent([8, initialTime, mainThreadIdCounter]);
  isHostCallbackScheduled = !1;
  isHostTimeoutScheduled &&
    ((isHostTimeoutScheduled = !1), cancelHostTimeout());
  isPerformingWork = !0;
  var previousPriorityLevel = currentPriorityLevel;
  try {
    try {
      advanceTimers(initialTime);
      for (
        currentTask = peek(taskQueue);
        !(
          null === currentTask ||
          (enableSchedulerDebugging && isSchedulerPaused) ||
          (currentTask.expirationTime > initialTime &&
            (!hasTimeRemaining || shouldYieldToHost()))
        );

      ) {
        var callback = currentTask.callback;
        if (null !== callback) {
          currentTask.callback = null;
          currentPriorityLevel = currentTask.priorityLevel;
          var didUserCallbackTimeout =
              currentTask.expirationTime <= initialTime,
            task = currentTask,
            time = initialTime;
          runIdCounter++;
          profilingState[0] = task.priorityLevel;
          profilingState[1] = task.id;
          profilingState[2] = runIdCounter;
          null !== eventLog && logEvent([5, time, task.id, runIdCounter]);
          var continuationCallback = callback(didUserCallbackTimeout);
          initialTime = exports.unstable_now();
          "function" === typeof continuationCallback
            ? ((currentTask.callback = continuationCallback),
              (task = currentTask),
              (time = initialTime),
              (profilingState[0] = 0),
              (profilingState[1] = 0),
              (profilingState[2] = 0),
              null !== eventLog && logEvent([6, time, task.id, runIdCounter]))
            : ((task = currentTask),
              (time = initialTime),
              (profilingState[0] = 0),
              (profilingState[1] = 0),
              profilingState[3]--,
              null !== eventLog && logEvent([2, time, task.id]),
              (currentTask.isQueued = !1),
              currentTask === peek(taskQueue) && pop(taskQueue));
          advanceTimers(initialTime);
        } else pop(taskQueue);
        currentTask = peek(taskQueue);
      }
      if (null !== currentTask) var JSCompiler_inline_result = !0;
      else {
        var firstTimer = peek(timerQueue);
        null !== firstTimer &&
          requestHostTimeout(handleTimeout, firstTimer.startTime - initialTime);
        JSCompiler_inline_result = !1;
      }
      return JSCompiler_inline_result;
    } catch (error) {
      if (null !== currentTask) {
        var currentTime = exports.unstable_now();
        hasTimeRemaining = currentTask;
        profilingState[0] = 0;
        profilingState[1] = 0;
        profilingState[3]--;
        null !== eventLog && logEvent([3, currentTime, hasTimeRemaining.id]);
        currentTask.isQueued = !1;
      }
      throw error;
    }
  } finally {
    (currentTask = null),
      (currentPriorityLevel = previousPriorityLevel),
      (isPerformingWork = !1),
      (previousPriorityLevel = exports.unstable_now()),
      mainThreadIdCounter++,
      null !== eventLog &&
        logEvent([7, previousPriorityLevel, mainThreadIdCounter]);
  }
}
function timeoutForPriorityLevel(priorityLevel) {
  switch (priorityLevel) {
    case 1:
      return -1;
    case 2:
      return 250;
    case 5:
      return 1073741823;
    case 4:
      return 1e4;
    default:
      return 5e3;
  }
}
var unstable_requestPaint = requestPaint,
  unstable_Profiling = {
    startLoggingProfilingEvents: function() {
      eventLogSize = 1e3;
      eventLogBuffer = new ArrayBuffer(
        eventLogSize * Int32Array.BYTES_PER_ELEMENT
      );
      eventLog = new Int32Array(eventLogBuffer);
      eventLogIndex = 0;
    },
    stopLoggingProfilingEvents: function() {
      var buffer = eventLogBuffer;
      eventLogBuffer = eventLog = null;
      return buffer;
    },
    sharedProfilingBuffer: sharedProfilingBuffer
  };
exports.unstable_IdlePriority = 5;
exports.unstable_ImmediatePriority = 1;
exports.unstable_LowPriority = 4;
exports.unstable_NormalPriority = 3;
exports.unstable_Profiling = unstable_Profiling;
exports.unstable_UserBlockingPriority = 2;
exports.unstable_cancelCallback = function(task) {
  if (task.isQueued) {
    var currentTime = exports.unstable_now();
    profilingState[3]--;
    null !== eventLog && logEvent([4, currentTime, task.id]);
    task.isQueued = !1;
  }
  task.callback = null;
};
exports.unstable_continueExecution = function() {
  isSchedulerPaused = !1;
  isHostCallbackScheduled ||
    isPerformingWork ||
    ((isHostCallbackScheduled = !0), requestHostCallback(flushWork));
};
exports.unstable_getCurrentPriorityLevel = function() {
  return currentPriorityLevel;
};
exports.unstable_getFirstCallbackNode = function() {
  return peek(taskQueue);
};
exports.unstable_next = function(eventHandler) {
  switch (currentPriorityLevel) {
    case 1:
    case 2:
    case 3:
      var priorityLevel = 3;
      break;
    default:
      priorityLevel = currentPriorityLevel;
  }
  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;
  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
};
exports.unstable_pauseExecution = function() {
  isSchedulerPaused = !0;
};
exports.unstable_requestPaint = unstable_requestPaint;
exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      break;
    default:
      priorityLevel = 3;
  }
  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;
  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
};
exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now();
  if ("object" === typeof options && null !== options) {
    var startTime = options.delay;
    startTime =
      "number" === typeof startTime && 0 < startTime
        ? currentTime + startTime
        : currentTime;
    options =
      "number" === typeof options.timeout
        ? options.timeout
        : timeoutForPriorityLevel(priorityLevel);
  } else
    (options = timeoutForPriorityLevel(priorityLevel)),
      (startTime = currentTime);
  options = startTime + options;
  priorityLevel = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: options,
    sortIndex: -1,
    isQueued: !1
  };
  startTime > currentTime
    ? ((priorityLevel.sortIndex = startTime),
      push(timerQueue, priorityLevel),
      null === peek(taskQueue) &&
        priorityLevel === peek(timerQueue) &&
        (isHostTimeoutScheduled
          ? cancelHostTimeout()
          : (isHostTimeoutScheduled = !0),
        requestHostTimeout(handleTimeout, startTime - currentTime)))
    : ((priorityLevel.sortIndex = options),
      push(taskQueue, priorityLevel),
      profilingState[3]++,
      null !== eventLog &&
        logEvent([
          1,
          currentTime,
          priorityLevel.id,
          priorityLevel.priorityLevel
        ]),
      (priorityLevel.isQueued = !0),
      isHostCallbackScheduled ||
        isPerformingWork ||
        ((isHostCallbackScheduled = !0), requestHostCallback(flushWork)));
  return priorityLevel;
};
exports.unstable_shouldYield = function() {
  var currentTime = exports.unstable_now();
  advanceTimers(currentTime);
  var firstTask = peek(taskQueue);
  return (
    (firstTask !== currentTask &&
      null !== currentTask &&
      null !== firstTask &&
      null !== firstTask.callback &&
      firstTask.startTime <= currentTime &&
      firstTask.expirationTime < currentTask.expirationTime) ||
    shouldYieldToHost()
  );
};
exports.unstable_wrapCallback = function(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function() {
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;
    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
};