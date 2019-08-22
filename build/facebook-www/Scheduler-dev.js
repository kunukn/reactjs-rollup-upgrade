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

'use strict';

if (__DEV__) {
  (function() {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var _require = require("SchedulerFeatureFlags");
var enableIsInputPending = _require.enableIsInputPending;
var enableSchedulerDebugging = _require.enableSchedulerDebugging;
var requestIdleCallbackBeforeFirstFrame =
  _require.requestIdleCallbackBeforeFirstFrame;
var requestTimerEventBeforeFirstFrame =
  _require.requestTimerEventBeforeFirstFrame;
var enableMessageLoopImplementation = _require.enableMessageLoopImplementation;

// works by scheduling a requestAnimationFrame, storing the time for the start
// of the frame, then scheduling a postMessage which gets scheduled after paint.
// Within the postMessage handler do as much work as possible until time + frame
// rate. By separating the idle call into a separate event tick we ensure that
// layout, paint and other browser work is counted against the available time.
// The frame rate is dynamically adjusted.

var requestHostCallback;

var requestHostTimeout;
var cancelHostTimeout;
var shouldYieldToHost;
var requestPaint;

if (
  // If Scheduler runs in a non-DOM environment, it falls back to a naive
  // implementation using setTimeout.
  typeof window === "undefined" || // Check if MessageChannel is supported, too.
  typeof MessageChannel !== "function"
) {
  // If this accidentally gets imported in a non-browser environment, e.g. JavaScriptCore,
  // fallback to a naive implementation.
  var _callback = null;
  var _timeoutID = null;

  var _flushCallback = function() {
    if (_callback !== null) {
      try {
        var currentTime = exports.unstable_now();
        var hasRemainingTime = true;

        _callback(hasRemainingTime, currentTime);

        _callback = null;
      } catch (e) {
        setTimeout(_flushCallback, 0);
        throw e;
      }
    }
  };

  exports.unstable_now = function() {
    return Date.now();
  };

  requestHostCallback = function(cb) {
    if (_callback !== null) {
      // Protect against re-entrancy.
      setTimeout(requestHostCallback, 0, cb);
    } else {
      _callback = cb;
      setTimeout(_flushCallback, 0);
    }
  };

  requestHostTimeout = function(cb, ms) {
    _timeoutID = setTimeout(cb, ms);
  };

  cancelHostTimeout = function() {
    clearTimeout(_timeoutID);
  };

  shouldYieldToHost = function() {
    return false;
  };

  requestPaint = exports.unstable_forceFrameRate = function() {};
} else {
  // Capture local references to native APIs, in case a polyfill overrides them.
  var performance = window.performance;
  var _Date = window.Date;
  var _setTimeout = window.setTimeout;
  var _clearTimeout = window.clearTimeout;
  var requestAnimationFrame = window.requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame;
  var requestIdleCallback = window.requestIdleCallback;

  if (typeof console !== "undefined") {
    // TODO: Remove fb.me link
    if (typeof requestAnimationFrame !== "function") {
      console.error(
        "This browser doesn't support requestAnimationFrame. " +
          "Make sure that you load a " +
          "polyfill in older browsers. https://fb.me/react-polyfills"
      );
    }

    if (typeof cancelAnimationFrame !== "function") {
      console.error(
        "This browser doesn't support cancelAnimationFrame. " +
          "Make sure that you load a " +
          "polyfill in older browsers. https://fb.me/react-polyfills"
      );
    }
  }

  var requestIdleCallbackBeforeFirstFrame$1 =
    requestIdleCallbackBeforeFirstFrame &&
    typeof requestIdleCallback === "function" &&
    typeof cancelIdleCallback === "function";
  exports.unstable_now =
    typeof performance === "object" && typeof performance.now === "function"
      ? function() {
          return performance.now();
        }
      : function() {
          return _Date.now();
        };
  var isRAFLoopRunning = false;
  var isMessageLoopRunning = false;
  var scheduledHostCallback = null;
  var rAFTimeoutID = -1;
  var taskTimeoutID = -1;
  var frameLength = enableMessageLoopImplementation // We won't attempt to align with the vsync. Instead we'll yield multiple
    ? // times per frame, often enough to keep it responsive even at really
      // high frame rates > 120.
      5 // Use a heuristic to measure the frame rate and yield at the end of the
    : // frame. We start out assuming that we run at 30fps but then the
      // heuristic tracking will adjust this value to a faster fps if we get
      // more frequent animation frames.
      33.33;
  var prevRAFTime = -1;
  var prevRAFInterval = -1;
  var frameDeadline = 0;
  var fpsLocked = false; // TODO: Make this configurable
  // TODO: Adjust this based on priority?

  var maxFrameLength = 300;
  var needsPaint = false;

  if (
    enableIsInputPending &&
    navigator !== undefined &&
    navigator.scheduling !== undefined &&
    navigator.scheduling.isInputPending !== undefined
  ) {
    var scheduling = navigator.scheduling;

    shouldYieldToHost = function() {
      var currentTime = exports.unstable_now();

      if (currentTime >= frameDeadline) {
        // There's no time left in the frame. We may want to yield control of
        // the main thread, so the browser can perform high priority tasks. The
        // main ones are painting and user input. If there's a pending paint or
        // a pending input, then we should yield. But if there's neither, then
        // we can yield less often while remaining responsive. We'll eventually
        // yield regardless, since there could be a pending paint that wasn't
        // accompanied by a call to `requestPaint`, or other main thread tasks
        // like network events.
        if (needsPaint || scheduling.isInputPending()) {
          // There is either a pending paint or a pending input.
          return true;
        } // There's no pending input. Only yield if we've reached the max
        // frame length.

        return currentTime >= frameDeadline + maxFrameLength;
      } else {
        // There's still time left in the frame.
        return false;
      }
    };

    requestPaint = function() {
      needsPaint = true;
    };
  } else {
    // `isInputPending` is not available. Since we have no way of knowing if
    // there's pending input, always yield at the end of the frame.
    shouldYieldToHost = function() {
      return exports.unstable_now() >= frameDeadline;
    }; // Since we yield every frame regardless, `requestPaint` has no effect.

    requestPaint = function() {};
  }

  exports.unstable_forceFrameRate = function(fps) {
    if (fps < 0 || fps > 125) {
      console.error(
        "forceFrameRate takes a positive int between 0 and 125, " +
          "forcing framerates higher than 125 fps is not unsupported"
      );
      return;
    }

    if (fps > 0) {
      frameLength = Math.floor(1000 / fps);
      fpsLocked = true;
    } else {
      // reset the framerate
      frameLength = 33.33;
      fpsLocked = false;
    }
  };

  var performWorkUntilDeadline = function() {
    if (enableMessageLoopImplementation) {
      if (scheduledHostCallback !== null) {
        var currentTime = exports.unstable_now(); // Yield after `frameLength` ms, regardless of where we are in the vsync
        // cycle. This means there's always time remaining at the beginning of
        // the message event.

        frameDeadline = currentTime + frameLength;
        var hasTimeRemaining = true;

        try {
          var hasMoreWork = scheduledHostCallback(
            hasTimeRemaining,
            currentTime
          );

          if (!hasMoreWork) {
            isMessageLoopRunning = false;
            scheduledHostCallback = null;
          } else {
            // If there's more work, schedule the next message event at the end
            // of the preceding one.
            port.postMessage(null);
          }
        } catch (error) {
          // If a scheduler task throws, exit the current browser task so the
          // error can be observed.
          port.postMessage(null);
          throw error;
        }
      } else {
        isMessageLoopRunning = false;
      } // Yielding to the browser will give it a chance to paint, so we can
      // reset this.

      needsPaint = false;
    } else {
      if (scheduledHostCallback !== null) {
        var _currentTime = exports.unstable_now();

        var _hasTimeRemaining = frameDeadline - _currentTime > 0;

        try {
          var _hasMoreWork = scheduledHostCallback(
            _hasTimeRemaining,
            _currentTime
          );

          if (!_hasMoreWork) {
            scheduledHostCallback = null;
          }
        } catch (error) {
          // If a scheduler task throws, exit the current browser task so the
          // error can be observed, and post a new task as soon as possible
          // so we can continue where we left off.
          port.postMessage(null);
          throw error;
        }
      } // Yielding to the browser will give it a chance to paint, so we can
      // reset this.

      needsPaint = false;
    }
  };

  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;

  var onAnimationFrame = function(rAFTime) {
    if (scheduledHostCallback === null) {
      // No scheduled work. Exit.
      prevRAFTime = -1;
      prevRAFInterval = -1;
      isRAFLoopRunning = false;
      return;
    } // Eagerly schedule the next animation callback at the beginning of the
    // frame. If the scheduler queue is not empty at the end of the frame, it
    // will continue flushing inside that callback. If the queue *is* empty,
    // then it will exit immediately. Posting the callback at the start of the
    // frame ensures it's fired within the earliest possible frame. If we
    // waited until the end of the frame to post the callback, we risk the
    // browser skipping a frame and not firing the callback until the frame
    // after that.

    isRAFLoopRunning = true;
    requestAnimationFrame(function(nextRAFTime) {
      _clearTimeout(rAFTimeoutID);

      onAnimationFrame(nextRAFTime);
    }); // requestAnimationFrame is throttled when the tab is backgrounded. We
    // don't want to stop working entirely. So we'll fallback to a timeout loop.
    // TODO: Need a better heuristic for backgrounded work.

    var onTimeout = function() {
      frameDeadline = exports.unstable_now() + frameLength / 2;
      performWorkUntilDeadline();
      rAFTimeoutID = _setTimeout(onTimeout, frameLength * 3);
    };

    rAFTimeoutID = _setTimeout(onTimeout, frameLength * 3);

    if (
      prevRAFTime !== -1 && // Make sure this rAF time is different from the previous one. This check
      // could fail if two rAFs fire in the same frame.
      rAFTime - prevRAFTime > 0.1
    ) {
      var rAFInterval = rAFTime - prevRAFTime;

      if (!fpsLocked && prevRAFInterval !== -1) {
        // We've observed two consecutive frame intervals. We'll use this to
        // dynamically adjust the frame rate.
        //
        // If one frame goes long, then the next one can be short to catch up.
        // If two frames are short in a row, then that's an indication that we
        // actually have a higher frame rate than what we're currently
        // optimizing. For example, if we're running on 120hz display or 90hz VR
        // display. Take the max of the two in case one of them was an anomaly
        // due to missed frame deadlines.
        if (rAFInterval < frameLength && prevRAFInterval < frameLength) {
          frameLength =
            rAFInterval < prevRAFInterval ? prevRAFInterval : rAFInterval;

          if (frameLength < 8.33) {
            // Defensive coding. We don't support higher frame rates than 120hz.
            // If the calculated frame length gets lower than 8, it is probably
            // a bug.
            frameLength = 8.33;
          }
        }
      }

      prevRAFInterval = rAFInterval;
    }

    prevRAFTime = rAFTime;
    frameDeadline = rAFTime + frameLength; // We use the postMessage trick to defer idle work until after the repaint.

    port.postMessage(null);
  };

  requestHostCallback = function(callback) {
    scheduledHostCallback = callback;

    if (enableMessageLoopImplementation) {
      if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        port.postMessage(null);
      }
    } else {
      if (!isRAFLoopRunning) {
        // Start a rAF loop.
        isRAFLoopRunning = true;
        requestAnimationFrame(function(rAFTime) {
          if (requestIdleCallbackBeforeFirstFrame$1) {
            cancelIdleCallback(idleCallbackID);
          }

          if (requestTimerEventBeforeFirstFrame) {
            _clearTimeout(idleTimeoutID);
          }

          onAnimationFrame(rAFTime);
        }); // If we just missed the last vsync, the next rAF might not happen for
        // another frame. To claim as much idle time as possible, post a
        // callback with `requestIdleCallback`, which should fire if there's
        // idle time left in the frame.
        //
        // This should only be an issue for the first rAF in the loop;
        // subsequent rAFs are scheduled at the beginning of the
        // preceding frame.

        var idleCallbackID;

        if (requestIdleCallbackBeforeFirstFrame$1) {
          idleCallbackID = requestIdleCallback(
            function onIdleCallbackBeforeFirstFrame() {
              if (requestTimerEventBeforeFirstFrame) {
                _clearTimeout(idleTimeoutID);
              }

              frameDeadline = exports.unstable_now() + frameLength;
              performWorkUntilDeadline();
            }
          );
        } // Alternate strategy to address the same problem. Scheduler a timer
        // with no delay. If this fires before the rAF, that likely indicates
        // that there's idle time before the next vsync. This isn't always the
        // case, but we'll be aggressive and assume it is, as a trade off to
        // prevent idle periods.

        var idleTimeoutID;

        if (requestTimerEventBeforeFirstFrame) {
          idleTimeoutID = _setTimeout(function onTimerEventBeforeFirstFrame() {
            if (requestIdleCallbackBeforeFirstFrame$1) {
              cancelIdleCallback(idleCallbackID);
            }

            frameDeadline = exports.unstable_now() + frameLength;
            performWorkUntilDeadline();
          }, 0);
        }
      }
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
  siftUp(heap, node, index);
}
function peek(heap) {
  var first = heap[0];
  return first === undefined ? null : first;
}
function pop(heap) {
  var first = heap[0];

  if (first !== undefined) {
    var last = heap.pop();

    if (last !== first) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }

    return first;
  } else {
    return null;
  }
}

function siftUp(heap, node, i) {
  var index = i;

  while (true) {
    var parentIndex = Math.floor((index - 1) / 2);
    var parent = heap[parentIndex];

    if (parent !== undefined && compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, i) {
  var index = i;
  var length = heap.length;

  while (index < length) {
    var leftIndex = (index + 1) * 2 - 1;
    var left = heap[leftIndex];
    var rightIndex = leftIndex + 1;
    var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  var diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

/* eslint-disable no-var */
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5; // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111

var maxSigned31BitInt = 1073741823; // Times out immediately

var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

var USER_BLOCKING_PRIORITY = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

var IDLE_PRIORITY = maxSigned31BitInt; // Tasks are stored on a min heap

var taskQueue = [];
var timerQueue = []; // Incrementing id counter. Used to maintain insertion order.

var taskIdCounter = 0; // Pausing the scheduler is useful for debugging.

var isSchedulerPaused = false;
var currentTask = null;
var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrancy.

var isPerformingWork = false;
var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false;

function flushTask(task, callback, currentTime) {
  currentPriorityLevel = task.priorityLevel;
  var didUserCallbackTimeout = task.expirationTime <= currentTime;
  var continuationCallback = callback(didUserCallbackTimeout);
  return typeof continuationCallback === "function"
    ? continuationCallback
    : null;
}

function advanceTimers(currentTime) {
  // Check for tasks that are no longer delayed and add them to the queue.
  var timer = peek(timerQueue);

  while (timer !== null) {
    if (timer.callback === null) {
      // Timer was cancelled.
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // Timer fired. Transfer to the task queue.
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    } else {
      // Remaining timers are pending.
      return;
    }

    timer = peek(timerQueue);
  }
}

function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

function flushWork(hasTimeRemaining, initialTime) {
  // We'll need a host callback the next time work is scheduled.
  isHostCallbackScheduled = false;

  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  var previousPriorityLevel = currentPriorityLevel;

  try {
    var currentTime = initialTime;
    advanceTimers(currentTime);
    currentTask = peek(taskQueue);

    while (
      currentTask !== null &&
      !(enableSchedulerDebugging && isSchedulerPaused)
    ) {
      if (
        currentTask.expirationTime > currentTime &&
        (!hasTimeRemaining || shouldYieldToHost())
      ) {
        // This currentTask hasn't expired, and we've reached the deadline.
        break;
      }

      var callback = currentTask.callback;

      if (callback !== null) {
        currentTask.callback = null;
        var continuation = flushTask(currentTask, callback, currentTime);

        if (continuation !== null) {
          currentTask.callback = continuation;
        } else {
          if (currentTask === peek(taskQueue)) {
            pop(taskQueue);
          }
        }

        currentTime = exports.unstable_now();
        advanceTimers(currentTime);
      } else {
        pop(taskQueue);
      }

      currentTask = peek(taskQueue);
    } // Return whether there's additional work

    if (currentTask !== null) {
      return true;
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }

      return false;
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;

    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_next(eventHandler) {
  var priorityLevel;

  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      // Shift down to normal priority
      priorityLevel = NormalPriority;
      break;

    default:
      // Anything lower than normal priority should remain at the current level.
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function() {
    // This is a fork of runWithPriority, inlined for performance.
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}

function timeoutForPriorityLevel(priorityLevel) {
  switch (priorityLevel) {
    case ImmediatePriority:
      return IMMEDIATE_PRIORITY_TIMEOUT;

    case UserBlockingPriority:
      return USER_BLOCKING_PRIORITY;

    case IdlePriority:
      return IDLE_PRIORITY;

    case LowPriority:
      return LOW_PRIORITY_TIMEOUT;

    case NormalPriority:
    default:
      return NORMAL_PRIORITY_TIMEOUT;
  }
}

function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now();
  var startTime;
  var timeout;

  if (typeof options === "object" && options !== null) {
    var delay = options.delay;

    if (typeof delay === "number" && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }

    timeout =
      typeof options.timeout === "number"
        ? options.timeout
        : timeoutForPriorityLevel(priorityLevel);
  } else {
    timeout = timeoutForPriorityLevel(priorityLevel);
    startTime = currentTime;
  }

  var expirationTime = startTime + timeout;
  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1
  };

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      } // Schedule a timeout.

      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask); // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

function unstable_pauseExecution() {
  isSchedulerPaused = true;
}

function unstable_continueExecution() {
  isSchedulerPaused = false;

  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}

function unstable_getFirstCallbackNode() {
  return peek(taskQueue);
}

function unstable_cancelCallback(task) {
  // Null out the callback to indicate the task has been canceled. (Can't remove
  // from the queue because you can't remove arbitrary nodes from an array based
  // heap, only the first one.)
  task.callback = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

function unstable_shouldYield() {
  var currentTime = exports.unstable_now();
  advanceTimers(currentTime);
  var firstTask = peek(taskQueue);
  return (
    (firstTask !== currentTask &&
      currentTask !== null &&
      firstTask !== null &&
      firstTask.callback !== null &&
      firstTask.startTime <= currentTime &&
      firstTask.expirationTime < currentTask.expirationTime) ||
    shouldYieldToHost()
  );
}

var unstable_requestPaint = requestPaint;

exports.unstable_ImmediatePriority = ImmediatePriority;
exports.unstable_UserBlockingPriority = UserBlockingPriority;
exports.unstable_NormalPriority = NormalPriority;
exports.unstable_IdlePriority = IdlePriority;
exports.unstable_LowPriority = LowPriority;
exports.unstable_runWithPriority = unstable_runWithPriority;
exports.unstable_next = unstable_next;
exports.unstable_scheduleCallback = unstable_scheduleCallback;
exports.unstable_cancelCallback = unstable_cancelCallback;
exports.unstable_wrapCallback = unstable_wrapCallback;
exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
exports.unstable_shouldYield = unstable_shouldYield;
exports.unstable_requestPaint = unstable_requestPaint;
exports.unstable_continueExecution = unstable_continueExecution;
exports.unstable_pauseExecution = unstable_pauseExecution;
exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;

  })();
}