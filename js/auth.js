// STARVYON Learn - Authentication & User Storage Engine
// Client-side persistent user database adhering to production schema.

window.STARVYONAuth = (function() {
  var env = window.STARVYON_ENV || null;
  var USERS_STORAGE_KEY = (env && env.get("AUTH_STORAGE_KEY")) || "starvyon_users_db";
  var SESSION_STORAGE_KEY = (env && env.get("AUTH_TOKEN_KEY")) || "starvyon_active_session";

  // Initialize mock database if empty
  function getUsersDatabase() {
    try {
      var data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Storage error:", e);
    }
    // Seed default student account for instant testing
    var initialDb = {
      "engineer@starvyon.internal": {
        id: "usr_seed_01",
        name: "Alex Vance",
        email: "engineer@starvyon.internal",
        passwordHash: "starvyon123",
        createdAt: "2026-10-01T08:00:00Z",
        role: "AI Systems Fellow"
      }
    };
    saveUsersDatabase(initialDb);
    return initialDb;
  }

  function saveUsersDatabase(db) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Failed to save users database:", e);
    }
  }

  function getCurrentUser() {
    try {
      var session = localStorage.getItem(SESSION_STORAGE_KEY);
      if (session) {
        var user = JSON.parse(session);
        return user;
      }
    } catch (e) {
      console.error("Session parse error:", e);
    }
    return null;
  }

  function register(name, email, password) {
    var db = getUsersDatabase();
    var normalizedEmail = email.toLowerCase().trim();
    if (db[normalizedEmail]) {
      return { success: false, message: "An account with this email address already exists." };
    }
    var newUser = {
      id: "usr_" + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password, // In client mock; production would be hashed
      createdAt: new Date().toISOString(),
      role: "Student Fellow"
    };
    db[normalizedEmail] = newUser;
    saveUsersDatabase(db);
    // Log activity
    if (window.STARVYONDb) {
      window.STARVYONDb.logActivity(newUser.id, 'USER_REGISTERED', null, null, {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      });
    }

    // Log user in automatically
    login(normalizedEmail, password);
    return { success: true, user: newUser };
  }

  function login(email, password) {
    var db = getUsersDatabase();
    var normalizedEmail = email.toLowerCase().trim();
    var user = db[normalizedEmail];
    if (!user || user.passwordHash !== password) {
      return { success: false, message: "Invalid email or password." };
    }
    var safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));

    // Log activity
    if (window.STARVYONDb) {
      window.STARVYONDb.logActivity(safeUser.id, 'USER_LOGIN', null, null, { email: safeUser.email });
    }

    return { success: true, user: safeUser };
  }

  function logout() {
    var currentUser = getCurrentUser();
    if (currentUser && window.STARVYONDb) {
      window.STARVYONDb.logActivity(currentUser.id, 'USER_LOGOUT', null, null, { email: currentUser.email });
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  return {
    getCurrentUser: getCurrentUser,
    register: register,
    login: login,
    logout: logout
  };
})();
