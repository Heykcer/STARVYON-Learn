/**
 * STARVYON Learn - Runtime Environment Configuration
 * 
 * Provides client-side and universal access to environment variables and feature flags.
 * Exposes configuration on `window.STARVYON_ENV` (with aliases `window.__ENV__` and `window.ENV`).
 */
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    var envConfig = factory();
    root.STARVYON_ENV = envConfig;
    root.__ENV__ = envConfig;
    root.ENV = envConfig;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DEFAULT_CONFIG = {
    // Application Settings
    APP_ENV: 'development',
    APP_NAME: 'STARVYON Learn',
    APP_URL: 'http://localhost:3000',
    APP_VERSION: '1.0.0',
    DEBUG: true,

    // API & Gateway
    API_BASE_URL: 'http://localhost:8000/api/v1',
    API_TIMEOUT_MS: 15000,

    // Database Configuration (Neon Serverless PostgreSQL)
    NEON_DATABASE_URL: '',
    NEON_API_KEY: '',
    DATABASE_DRIVER: 'neon',
    DATABASE_POOL_SIZE: 10,

    // Authentication & Storage
    ENABLE_MOCK_AUTH: true,
    AUTH_TOKEN_KEY: 'starvyon_active_session',
    AUTH_STORAGE_KEY: 'starvyon_users_db',
    PROGRESS_KEY_PREFIX: 'starvyon_progress_',
    SESSION_EXPIRY_HOURS: 72,

    // AI Providers & LLM Sandboxes
    OPENAI_API_KEY: '',
    ANTHROPIC_API_KEY: '',
    GEMINI_API_KEY: '',
    DEFAULT_LLM_MODEL: 'gemini-1.5-pro',

    // Observability & Analytics
    ANALYTICS_ENABLED: false,
    ANALYTICS_MEASUREMENT_ID: '',
    SENTRY_DSN: '',

    // Feature Flags
    FEATURE_INTERACTIVE_LABS: true,
    FEATURE_PROGRESS_RADAR: true,
    FEATURE_COURSE_QUIZZES: true,
    FEATURE_OFFLINE_STORAGE: true
  };

  // Node.js process.env support if imported in a server/build script
  var processEnv = (typeof process !== 'undefined' && process.env) ? process.env : {};

  // Merge default config with any environment overrides
  var config = Object.assign({}, DEFAULT_CONFIG);

  for (var key in DEFAULT_CONFIG) {
    if (Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key) && processEnv[key] !== undefined) {
      var val = processEnv[key];
      if (val === 'true') config[key] = true;
      else if (val === 'false') config[key] = false;
      else if (!isNaN(val) && typeof val === 'string' && val.trim() !== '') config[key] = Number(val);
      else config[key] = val;
    }
  }

  return {
    config: config,

    /**
     * Get a configuration value with an optional fallback.
     * @param {string} key - Environment variable name.
     * @param {*} [defaultValue] - Fallback value if key is not defined.
     * @returns {*}
     */
    get: function (key, defaultValue) {
      if (config[key] !== undefined && config[key] !== '') {
        return config[key];
      }
      return defaultValue !== undefined ? defaultValue : (config[key] !== undefined ? config[key] : null);
    },

    /**
     * Check if a feature flag is enabled.
     * @param {string} featureName - Feature flag key (e.g. 'FEATURE_INTERACTIVE_LABS').
     * @returns {boolean}
     */
    isFeatureEnabled: function (featureName) {
      var val = this.get(featureName, false);
      return val === true || val === 'true';
    },

    /**
     * Check if the application is running in development mode.
     * @returns {boolean}
     */
    isDevelopment: function () {
      return this.get('APP_ENV') === 'development' || this.get('DEBUG') === true;
    },

    /**
     * Check if the application is running in production mode.
     * @returns {boolean}
     */
    isProduction: function () {
      return this.get('APP_ENV') === 'production';
    }
  };
});
