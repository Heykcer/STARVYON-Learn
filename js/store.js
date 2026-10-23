// STARVYON Learn - Learning Progress & Mastery Store
// Tracks completed lessons, quiz scores, and persistence per user account.

window.STARVYONStore = (function() {
  var env = window.STARVYON_ENV || null;
  var PROGRESS_KEY_PREFIX = (env && env.get("PROGRESS_KEY_PREFIX")) || "starvyon_progress_";

  function getUserKey() {
    var user = window.STARVYONAuth.getCurrentUser();
    return user ? PROGRESS_KEY_PREFIX + user.id : PROGRESS_KEY_PREFIX + "guest";
  }

  function getProgress() {
    try {
      var data = localStorage.getItem(getUserKey());
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Failed to read progress:", e);
    }
    return {
      completedTopics: {},
      quizScores: {},
      lastAccessedTopic: null,
      bookmarks: []
    };
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(getUserKey(), JSON.stringify(progress));
      // Notify listeners
      window.dispatchEvent(new CustomEvent("starvyon_progress_updated", { detail: progress }));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  }

  function markTopicCompleted(courseId, topicId) {
    var p = getProgress();
    var key = courseId + "::" + topicId;
    p.completedTopics[key] = {
      completedAt: new Date().toISOString()
    };
    p.lastAccessedTopic = { courseId: courseId, topicId: topicId };
    saveProgress(p);

    // Sync to database and log activity
    var user = window.STARVYONAuth ? window.STARVYONAuth.getCurrentUser() : null;
    var uid = user ? user.id : 'guest';
    if (window.STARVYONDb) {
      window.STARVYONDb.recordTopicProgress(uid, courseId, topicId, true);
    }
  }

  function toggleTopicCompleted(courseId, topicId) {
    var p = getProgress();
    var key = courseId + "::" + topicId;
    if (p.completedTopics[key]) {
      delete p.completedTopics[key];
    } else {
      p.completedTopics[key] = { completedAt: new Date().toISOString() };
    }
    p.lastAccessedTopic = { courseId: courseId, topicId: topicId };
    saveProgress(p);

    var isDone = !!p.completedTopics[key];
    var user = window.STARVYONAuth ? window.STARVYONAuth.getCurrentUser() : null;
    var uid = user ? user.id : 'guest';
    if (window.STARVYONDb) {
      window.STARVYONDb.recordTopicProgress(uid, courseId, topicId, isDone);
    }

    return isDone;
  }

  function isTopicCompleted(courseId, topicId) {
    var p = getProgress();
    return !!p.completedTopics[courseId + "::" + topicId];
  }

  function recordQuizScore(courseId, topicId, score, total) {
    var p = getProgress();
    var key = courseId + "::" + topicId;
    p.quizScores[key] = {
      score: score,
      total: total,
      passed: score / total >= 0.7,
      completedAt: new Date().toISOString()
    };
    saveProgress(p);

    // Sync quiz score to database & activity log
    var user = window.STARVYONAuth ? window.STARVYONAuth.getCurrentUser() : null;
    var uid = user ? user.id : 'guest';
    if (window.STARVYONDb) {
      window.STARVYONDb.recordQuizScore(uid, courseId, topicId, score, total);
    }
  }

  function getCourseProgress(courseId) {
    var course = window.STARVYONCatalog.getCourseById(courseId);
    if (!course) return { completed: 0, total: 0, percentage: 0 };

    var totalTopics = 0;
    var completedTopics = 0;
    var p = getProgress();

    for (var m = 0; m < course.modules.length; m++) {
      var mod = course.modules[m];
      for (var t = 0; t < mod.topics.length; t++) {
        totalTopics++;
        var key = courseId + "::" + mod.topics[t].topicId;
        if (p.completedTopics[key]) {
          completedTopics++;
        }
      }
    }

    var pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return {
      completed: completedTopics,
      total: totalTopics,
      percentage: pct
    };
  }

  function getOverallStats() {
    var allCourses = window.STARVYONCatalog.getAllCourses();
    var totalTopics = 0;
    var completedTopics = 0;
    var p = getProgress();

    for (var i = 0; i < allCourses.length; i++) {
      var c = allCourses[i];
      for (var m = 0; m < c.modules.length; m++) {
        for (var t = 0; t < c.modules[m].topics.length; t++) {
          totalTopics++;
          var key = c.id + "::" + c.modules[m].topics[t].topicId;
          if (p.completedTopics[key]) completedTopics++;
        }
      }
    }

    var quizzesTaken = Object.keys(p.quizScores).length;

    return {
      totalTopics: totalTopics,
      completedTopics: completedTopics,
      completionRate: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      quizzesTaken: quizzesTaken
    };
  }

  return {
    getProgress: getProgress,
    markTopicCompleted: markTopicCompleted,
    toggleTopicCompleted: toggleTopicCompleted,
    isTopicCompleted: isTopicCompleted,
    recordQuizScore: recordQuizScore,
    getCourseProgress: getCourseProgress,
    getOverallStats: getOverallStats
  };
})();
