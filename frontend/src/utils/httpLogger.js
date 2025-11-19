/**
 * HTTP Logger for Sentry Integration
 * Centralized logging for all HTTP REST API requests
 */
import * as Sentry from "@sentry/react";

/**
 * Log HTTP request start
 */
export const logHttpRequest = (method, endpoint, data = null) => {
  const logData = {
    type: 'http_request',
    method,
    endpoint,
    timestamp: new Date().toISOString(),
    hasPayload: !!data,
    payloadSize: data ? JSON.stringify(data).length : 0
  };

  Sentry.addBreadcrumb({
    category: 'http',
    message: `${method} ${endpoint}`,
    level: 'info',
    data: logData
  });

  if (import.meta.env.DEV) {
    console.log(`[HTTP REQUEST] ${method} ${endpoint}`, logData);
  }
};

/**
 * Log successful HTTP response
 */
export const logHttpSuccess = (method, endpoint, status, duration, response = null) => {
  const logData = {
    type: 'http_success',
    method,
    endpoint,
    status,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    hasResponse: !!response,
    responseSize: response ? JSON.stringify(response).length : 0
  };

  Sentry.addBreadcrumb({
    category: 'http',
    message: `✅ ${method} ${endpoint} - ${status}`,
    level: 'info',
    data: logData
  });

  Sentry.captureMessage(`HTTP ${method} ${endpoint} successful`, {
    level: 'info',
    tags: {
      http_method: method,
      http_status: status,
      endpoint: endpoint,
      request_type: 'success'
    },
    extra: logData
  });

  if (import.meta.env.DEV) {
    console.log(`✅ [HTTP SUCCESS] ${method} ${endpoint} (${status}) - ${duration}ms`, logData);
  }
};

/**
 * Log HTTP error
 */
export const logHttpError = (method, endpoint, error, duration) => {
  const status = error.response?.status || 0;
  const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
  
  const logData = {
    type: 'http_error',
    method,
    endpoint,
    status,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    errorMessage,
    errorDetails: error.response?.data || null,
    stack: error.stack
  };

  Sentry.addBreadcrumb({
    category: 'http',
    message: `❌ ${method} ${endpoint} - ${status}`,
    level: 'error',
    data: logData
  });

  Sentry.captureException(error, {
    tags: {
      http_method: method,
      http_status: status,
      endpoint: endpoint,
      request_type: 'error'
    },
    extra: logData,
    contexts: {
      http_request: {
        method,
        url: endpoint,
        status_code: status,
        duration_ms: duration
      }
    }
  });

  console.error(`❌ [HTTP ERROR] ${method} ${endpoint} (${status}) - ${duration}ms`, logData);
};

/**
 * Log HTTP timeout
 */
export const logHttpTimeout = (method, endpoint, duration) => {
  const logData = {
    type: 'http_timeout',
    method,
    endpoint,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString()
  };

  Sentry.addBreadcrumb({
    category: 'http',
    message: `⏱️ ${method} ${endpoint} - TIMEOUT`,
    level: 'warning',
    data: logData
  });

  Sentry.captureMessage(`HTTP ${method} ${endpoint} timeout`, {
    level: 'warning',
    tags: {
      http_method: method,
      endpoint: endpoint,
      request_type: 'timeout'
    },
    extra: logData
  });

  console.warn(`⏱️ [HTTP TIMEOUT] ${method} ${endpoint} - ${duration}ms`, logData);
};

/**
 * Log authentication failure
 */
export const logAuthFailure = (endpoint, status) => {
  const logData = {
    type: 'auth_failure',
    endpoint,
    status,
    timestamp: new Date().toISOString()
  };

  Sentry.addBreadcrumb({
    category: 'auth',
    message: `��� Authentication failed at ${endpoint}`,
    level: 'warning',
    data: logData
  });

  Sentry.captureMessage(`Authentication failure at ${endpoint}`, {
    level: 'warning',
    tags: {
      http_status: status,
      endpoint: endpoint,
      request_type: 'auth_failure'
    },
    extra: logData
  });

  console.warn(`��� [AUTH FAILURE] ${endpoint} (${status})`, logData);
};

export default {
  logHttpRequest,
  logHttpSuccess,
  logHttpError,
  logHttpTimeout,
  logAuthFailure
};
