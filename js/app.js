// STARVYON Learn - Main Application Bootstrap
// Orchestrates auth modal, navigation status, router, and event listeners.

window.STARVYONApp = (function() {
  function init() {
    var contentMount = document.getElementById("app-mount");
    if (!contentMount) return;

    // Initialize Router
    window.STARVYONRouter.init(contentMount);

    // Update Header Auth Pill
    updateAuthPill();

    // Attach Header Listeners
    setupHeaderListeners();

    // Listen to progress updates
    window.addEventListener("starvyon_progress_updated", function() {
      updateAuthPill();
    });
  }

  function updateAuthPill() {
    var pill = document.getElementById("header-auth-pill");
    if (!pill) return;
    var user = window.STARVYONAuth.getCurrentUser();
    if (user) {
      pill.innerHTML = `
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-forest); margin-right: 4px;"></span>
        <span>${user.name}</span>
      `;
      pill.onclick = function() {
        window.location.hash = "#profile";
      };
    } else {
      pill.innerHTML = `<span>Sign In</span>`;
      pill.onclick = function() {
        openAuthModal();
      };
    }
  }

  function setupHeaderListeners() {
    var authModal = document.getElementById("auth-modal");
    var closeBtn = document.getElementById("auth-modal-close");
    var toggleLink = document.getElementById("auth-toggle-mode");
    var authForm = document.getElementById("auth-form");
    var nameGroup = document.getElementById("auth-name-group");
    var modalTitle = document.getElementById("auth-modal-title");
    var submitBtn = document.getElementById("auth-submit-btn");
    var errorBox = document.getElementById("auth-error-msg");

    var isRegisterMode = false;

    if (closeBtn && authModal) {
      closeBtn.onclick = function() {
        authModal.classList.add("hidden");
      };
      authModal.onclick = function(e) {
        if (e.target === authModal) {
          authModal.classList.add("hidden");
        }
      };
    }

    if (toggleLink) {
      toggleLink.onclick = function() {
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
          modalTitle.innerText = "Register Fellow Account";
          nameGroup.classList.remove("hidden");
          submitBtn.innerText = "Create Account";
          toggleLink.innerText = "Already have an account? Sign In";
        } else {
          modalTitle.innerText = "Fellow Sign In";
          nameGroup.classList.add("hidden");
          submitBtn.innerText = "Sign In";
          toggleLink.innerText = "Need an account? Register";
        }
        errorBox.classList.add("hidden");
      };
    }

    if (authForm) {
      authForm.onsubmit = function(e) {
        e.preventDefault();
        var email = document.getElementById("auth-email").value;
        var pass = document.getElementById("auth-password").value;
        var name = document.getElementById("auth-name").value;

        if (isRegisterMode) {
          if (!name || name.trim() === "") {
            showError("Please enter your name.");
            return;
          }
          var regRes = window.STARVYONAuth.register(name, email, pass);
          if (!regRes.success) {
            showError(regRes.message);
            return;
          }
        } else {
          var loginRes = window.STARVYONAuth.login(email, pass);
          if (!loginRes.success) {
            showError(loginRes.message);
            return;
          }
        }

        authModal.classList.add("hidden");
        updateAuthPill();
        window.location.hash = "#profile";
      };
    }

    function showError(msg) {
      if (errorBox) {
        errorBox.innerText = msg;
        errorBox.classList.remove("hidden");
      }
    }
  }

  function openAuthModal() {
    var modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.remove("hidden");
      var errorBox = document.getElementById("auth-error-msg");
      if (errorBox) errorBox.classList.add("hidden");
    }
  }

  return {
    init: init,
    openAuthModal: openAuthModal
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  window.STARVYONApp.init();
});
