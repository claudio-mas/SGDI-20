import { useState, useEffect, useCallback, useRef } from 'react';

export interface IdleDetectionOptions {
  /** Time in milliseconds before user is considered idle (default: 2 minutes) */
  idleTimeout?: number;
  /** Events to track for activity (default: mouse, keyboard, touch) */
  events?: string[];
  /** Callback when user becomes idle */
  onIdle?: () => void;
  /** Callback when user becomes active again */
  onActive?: () => void;
}

export interface IdleDetectionResult {
  /** Whether the user is currently idle */
  isIdle: boolean;
  /** Timestamp of last activity */
  lastActivity: Date;
  /** Time in milliseconds since last activity */
  idleTime: number;
  /** Manually reset the idle timer */
  resetIdleTimer: () => void;
}

const DEFAULT_IDLE_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const DEFAULT_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
];

export function useIdleDetection(options: IdleDetectionOptions = {}): IdleDetectionResult {
  const {
    idleTimeout = DEFAULT_IDLE_TIMEOUT,
    events = DEFAULT_EVENTS,
    onIdle,
    onActive,
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [idleTime, setIdleTime] = useState(0);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasIdleRef = useRef(false);

  const resetIdleTimer = useCallback(() => {
    const now = new Date();
    setLastActivity(now);
    setIdleTime(0);
    
    if (wasIdleRef.current) {
      wasIdleRef.current = false;
      setIsIdle(false);
      onActive?.();
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      wasIdleRef.current = true;
      setIsIdle(true);
      onIdle?.();
    }, idleTimeout);
  }, [idleTimeout, onIdle, onActive]);

  // Set up event listeners
  useEffect(() => {
    const handleActivity = () => {
      resetIdleTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timer
    resetIdleTimer();

    // Update idle time every second
    intervalRef.current = setInterval(() => {
      setIdleTime(Date.now() - lastActivity.getTime());
    }, 1000);

    return () => {
      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      // Clear timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [events, resetIdleTimer, lastActivity]);

  return {
    isIdle,
    lastActivity,
    idleTime,
    resetIdleTimer,
  };
}

/**
 * Format idle time to a human-readable string
 */
export function formatIdleTime(idleTimeMs: number): string {
  const minutes = Math.floor(idleTimeMs / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (minutes < 1) {
    return 'Agora';
  }
  if (minutes < 60) {
    return `Ocioso há ${minutes}m`;
  }
  if (hours < 24) {
    return `Ocioso há ${hours}h`;
  }
  return 'Ocioso há mais de 1 dia';
}

export default useIdleDetection;
