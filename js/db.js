/**
 * STARVYON Learn - Database Access & Activity Telemetry Layer
 * 
 * Supports Neon Serverless Postgres via HTTP SQL endpoints, with automatic
 * graceful fallback to persistent client-side storage when credentials are not yet configured.
 * 
 * Exposes: `window.STARVYONDb`
 */
(function(root) {
  'use strict';

  var env = root.STARVYON_ENV || null;

  var CONFIG = {
    databaseUrl: (env && (env.get('NEON_DATABASE_URL') || env.get('DATABASE_URL'))) || '',
    apiKey: (env && (env.get('NEON_API_KEY') || env.get('API_KEY'))) || '',
    activitiesStorageKey: 'starvyon_activities_db',
    usersStorageKey: (env && env.get('AUTH_STORAGE_KEY')) || 'starvyon_users_db',
    progressKeyPrefix: (env && env.get('PROGRESS_KEY_PREFIX')) || 'starvyon_progress_'
  };

  /**
   * Determine whether Neon connection credentials are configured.
   */
  function isNeonConfigured() {
    return Boolean(
      CONFIG.databaseUrl && 
      CONFIG.databaseUrl.trim() !== '' && 
      CONFIG.databaseUrl.indexOf('neon.tech') !== -1
    );
  }

  /**
   * Parse a Neon database URL into host, user, password, dbname.
   */
  function parseDatabaseUrl(url) {
    try {
      // Format: postgresql://user:password@host/dbname?sslmode=require
      var match = url.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
      if (match) {
        return {
          user: match[1],
          password: match[2],
          host: match[3],
          dbname: match[4]
        };
      }
    } catch (e) {
      console.warn('[STARVYON Db] Failed to parse Neon URL:', e);
    }
    return null;
  }

  /**
   * Execute raw SQL via Neon's HTTP SQL proxy endpoint.
   */
  async function executeNeonSql(query, params) {
    if (!isNeonConfigured()) {
      throw new Error('Neon database is not configured.');
    }

    var parsed = parseDatabaseUrl(CONFIG.databaseUrl);
    if (!parsed) {
      throw new Error('Invalid Neon database connection string format.');
    }

    var endpoint = 'https://' + parsed.host + '/sql';

    var res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + parsed.password,
        'Neon-Connection-String': CONFIG.databaseUrl
      },
      body: JSON.stringify({
        query: query,
        params: params || []
      })
    });

    if (!res.ok) {
      var errText = await res.text();
      throw new Error('Neon SQL query failed (' + res.status + '): ' + errText);
    }

    return await res.json();
  }

  // ============================================================================
  // LOCAL PERSISTENCE HELPERS (Mock Mode when Neon is unconfigured)
  // ============================================================================

  function getLocalActivities() {
    try {
      var raw = localStorage.getItem(CONFIG.activitiesStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('[STARVYON Db] Failed to read activities from storage:', e);
      return [];
    }
  }

  function saveLocalActivities(activities) {
    try {
      localStorage.setItem(CONFIG.activitiesStorageKey, JSON.stringify(activities));
    } catch (e) {
      console.error('[STARVYON Db] Failed to save activities to storage:', e);
    }
  }

  // ============================================================================
  // DATABASE API METHODS
  // ============================================================================

  /**
   * Log an activity for a user (topic completion, quiz attempt, lab run, etc.)
   * @param {string} userId
   * @param {string} activityType - e.g. 'TOPIC_COMPLETED', 'QUIZ_SUBMITTED', 'LAB_RUN', 'USER_LOGIN'
   * @param {string} [courseId]
   * @param {string} [topicId]
   * @param {object} [details] - arbitrary metadata
   */
  async function logActivity(userId, activityType, courseId, topicId, details) {
    var activity = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      userId: userId || 'guest',
      activityType: activityType,
      courseId: courseId || null,
      topicId: topicId || null,
      details: details || {},
      createdAt: new Date().toISOString()
    };

    // Always record locally for offline and instant UI response
    var localList = getLocalActivities();
    localList.unshift(activity);
    if (localList.length > 500) localList.pop(); // Cap local history
    saveLocalActivities(localList);

    // If Neon is configured, sync asynchronously to Neon Postgres
    if (isNeonConfigured()) {
      try {
        var query = `
          INSERT INTO user_activities (id, user_id, activity_type, course_id, topic_id, details, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await executeNeonSql(query, [
          activity.id,
          activity.userId,
          activity.activityType,
          activity.courseId,
          activity.topicId,
          JSON.stringify(activity.details),
          activity.createdAt
        ]);
      } catch (err) {
        console.warn('[STARVYON Db] Remote activity sync failed, kept in local log:', err.message);
      }
    }

    // Dispatch activity logged event
    window.dispatchEvent(new CustomEvent('starvyon_activity_logged', { detail: activity }));
    return activity;
  }

  /**
   * Get activity history for a specific user.
   * @param {string} userId
   * @param {number} [limit=20]
   */
  async function getUserActivities(userId, limit) {
    limit = limit || 20;

    if (isNeonConfigured()) {
      try {
        var query = `
          SELECT * FROM user_activities
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2
        `;
        var res = await executeNeonSql(query, [userId, limit]);
        if (res && res.rows) return res.rows;
      } catch (e) {
        console.warn('[STARVYON Db] Remote fetch failed, falling back to local store:', e);
      }
    }

    var local = getLocalActivities();
    return local
      .filter(function(a) { return a.userId === userId; })
      .slice(0, limit);
  }

  /**
   * Get recent activity feed across all users (for community / radar).
   * @param {number} [limit=15]
   */
  async function getRecentActivities(limit) {
    limit = limit || 15;

    if (isNeonConfigured()) {
      try {
        var query = `
          SELECT a.*, u.name as user_name, u.role as user_role
          FROM user_activities a
          LEFT JOIN users u ON a.user_id = u.id
          ORDER BY a.created_at DESC
          LIMIT $1
        `;
        var res = await executeNeonSql(query, [limit]);
        if (res && res.rows) return res.rows;
      } catch (e) {
        console.warn('[STARVYON Db] Remote fetch failed:', e);
      }
    }

    return getLocalActivities().slice(0, limit);
  }

  /**
   * Sync and record progress state in the database.
   */
  async function recordTopicProgress(userId, courseId, topicId, completed) {
    var progressId = 'prg_' + userId + '_' + courseId + '_' + topicId;
    var now = new Date().toISOString();

    if (isNeonConfigured()) {
      try {
        var query = `
          INSERT INTO user_progress (id, user_id, course_id, topic_id, completed, completed_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (user_id, course_id, topic_id)
          DO UPDATE SET completed = $5, completed_at = CASE WHEN $5 THEN $6 ELSE NULL END, updated_at = $7
        `;
        await executeNeonSql(query, [progressId, userId, courseId, topicId, completed, now, now]);
      } catch (e) {
        console.warn('[STARVYON Db] Remote progress sync error:', e);
      }
    }

    // Log corresponding activity
    await logActivity(
      userId,
      completed ? 'TOPIC_COMPLETED' : 'TOPIC_UNCOMPLETED',
      courseId,
      topicId,
      { timestamp: now }
    );
  }

  /**
   * Record a quiz attempt score.
   */
  async function recordQuizScore(userId, courseId, topicId, score, total) {
    var progressId = 'prg_' + userId + '_' + courseId + '_' + topicId;
    var now = new Date().toISOString();
    var passed = total > 0 ? (score / total >= 0.7) : false;

    if (isNeonConfigured()) {
      try {
        var query = `
          INSERT INTO user_progress (id, user_id, course_id, topic_id, completed, quiz_score, quiz_total, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (user_id, course_id, topic_id)
          DO UPDATE SET quiz_score = $6, quiz_total = $7, completed = (user_progress.completed OR $5), updated_at = $8
        `;
        await executeNeonSql(query, [progressId, userId, courseId, topicId, passed, score, total, now]);
      } catch (e) {
        console.warn('[STARVYON Db] Remote quiz score sync error:', e);
      }
    }

    // Log activity
    await logActivity(
      userId,
      'QUIZ_SUBMITTED',
      courseId,
      topicId,
      { score: score, total: total, passed: passed, percentage: Math.round((score / total) * 100) }
    );
  }

  /**
   * Diagnostic info for database readiness.
   */
  function getStatus() {
    var neonReady = isNeonConfigured();
    return {
      driver: neonReady ? 'neon-serverless' : 'local-storage-mock',
      isNeonConnected: neonReady,
      databaseUrlConfigured: Boolean(CONFIG.databaseUrl),
      activitiesCount: getLocalActivities().length
    };
  }

  // Diagnostic notification in console
  if (isNeonConfigured()) {
    console.info('[STARVYON Database] Neon Serverless Postgres target detected. Live syncing enabled.');
  } else {
    console.info('[STARVYON Database] Ready in Local Storage mode. Set NEON_DATABASE_URL in .env to connect to live Neon Postgres.');
  }

  // Export to window
  root.STARVYONDb = {
    logActivity: logActivity,
    getUserActivities: getUserActivities,
    getRecentActivities: getRecentActivities,
    recordTopicProgress: recordTopicProgress,
    recordQuizScore: recordQuizScore,
    getStatus: getStatus,
    isNeonConfigured: isNeonConfigured
  };

})(typeof window !== 'undefined' ? window : this);
