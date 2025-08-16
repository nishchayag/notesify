class ErrorTracker {
  private static instance: ErrorTracker;
  private errorQueue: Array<{
    message: string;
    stack?: string;
    url: string;
    timestamp: number;
    userAgent: string;
    userId?: string;
  }> = [];

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  init() {
    if (typeof window === "undefined") return;

    // Global error handler
    window.addEventListener("error", (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });

    // Promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });

    // React error boundary support
    this.setupReactErrorBoundary();
  }

  logError(error: {
    message: string;
    stack?: string;
    url: string;
    timestamp: number;
    userAgent: string;
    userId?: string;
  }) {
    console.error("Error tracked:", error);

    this.errorQueue.push(error);

    // Send to analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: false,
      });
    }

    // Send to your error tracking service (optional)
    this.sendToErrorService(error);
  }

  private async sendToErrorService(error: {
    message: string;
    stack?: string;
    url: string;
    timestamp: number;
    userAgent: string;
    userId?: string;
  }) {
    try {
      // Example: Send to your own error tracking endpoint
      await fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(error),
      });
    } catch (e) {
      console.warn("Failed to send error to tracking service:", e);
    }
  }

  private setupReactErrorBoundary() {
    // This can be used with React Error Boundaries
    (
      window as unknown as { __REACT_ERROR_TRACKER__: ErrorTracker }
    ).__REACT_ERROR_TRACKER__ = this;
  }

  // Manual error logging
  track(error: Error, context?: Record<string, any>) {
    this.logError({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ...context,
    });
  }

  // Get error statistics
  getErrorStats() {
    return {
      totalErrors: this.errorQueue.length,
      recentErrors: this.errorQueue.slice(-10),
      errorsByType: this.groupErrorsByType(),
    };
  }

  private groupErrorsByType() {
    const groups: Record<string, number> = {};
    this.errorQueue.forEach((error) => {
      const type = error.message.split(":")[0] || "Unknown";
      groups[type] = (groups[type] || 0) + 1;
    });
    return groups;
  }
}

export default ErrorTracker;
