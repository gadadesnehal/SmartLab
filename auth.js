
const SUPABASE_URL = "https://gqebepxeocjfswcndvwg.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-PSOfpp_UaYc0e0gUT2hpQ_vweRW15q";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

if (showLogin && showRegister && loginForm && registerForm) {
  showLogin.addEventListener("click", () => {
    loginForm.hidden = false;
    registerForm.hidden = true;
  });

  showRegister.addEventListener("click", () => {
    loginForm.hidden = true;
    registerForm.hidden = false;
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("registerMessage");
    message.textContent = "Creating account...";

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role
        }
      }
    });

    if (error) {
      message.textContent = error.message;
      return;
    }

    if (data.session) {
      message.textContent = "Registration successful! You can now log in.";
    } else {
      message.textContent =
        "Account request successful. Check your email to confirm registration, then log in.";
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("loginMessage");
    message.textContent = "Logging in...";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      message.textContent = error.message;
      return;
    }

    const role = data.user.user_metadata?.role;

    if (role === "patient") {
      window.location.href = "patient-dashboard.html";
    } else if (role === "labOwner") {
      window.location.href = "lab-dashboard.html";
    } else {
      message.textContent =
        "Login successful, but the account type is missing.";
    }
  });
}
