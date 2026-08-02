"use strict";
// login page 
Object.defineProperty(exports, "__esModule", { value: true });
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailWrap = document.getElementById("emailWrap");
const passwordWrap = document.getElementById("passwordWrap");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginBtn = document.getElementById("loginBtn");
const btnLabel = loginBtn.querySelector(".btn-label");
const googleBtn = document.getElementById("googleBtn");
const forgotLink = document.getElementById("forgotLink");
const createAccountLink = document.getElementById("createAccountLink");
const toast = document.getElementById("toast");
// ---- Helpers ----
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function getUsers() {
    const raw = localStorage.getItem("users");
    return raw ? JSON.parse(raw) : [];
}
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}
function findUser(email, password) {
    return getUsers().find((u) => u.email === email && u.password === password);
}
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle("error-toast", isError);
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}
function clearErrors() {
    emailWrap.classList.remove("error");
    passwordWrap.classList.remove("error");
    emailError.textContent = "";
    passwordError.textContent = "";
}
// ---- Ensure a demo account exists so the form is testable right away ----
function ensureDemoUser() {
    const users = getUsers();
    if (users.length === 0) {
        saveUsers([{ email: "demo@example.com", password: "demo123" }]);
    }
}
ensureDemoUser();
// ---- Form submit ----
form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let hasError = false;
    if (!isValidEmail(email)) {
        emailWrap.classList.add("error");
        emailError.textContent = "Please enter a valid email address";
        hasError = true;
    }
    if (!password) {
        passwordWrap.classList.add("error");
        passwordError.textContent = "Please enter your password";
        hasError = true;
    }
    if (hasError)
        return;
    loginBtn.disabled = true;
    btnLabel.textContent = "Logging in...";
    setTimeout(() => {
        loginBtn.disabled = false;
        btnLabel.textContent = "Log in";
        const match = findUser(email, password);
        if (match) {
            localStorage.setItem("currentUser", email);
            showToast("Logged in successfully ✓");
        }
        else {
            passwordWrap.classList.add("error");
            passwordError.textContent = "Incorrect email or password";
            showToast("Invalid login credentials", true);
        }
    }, 600);
});
// ---- Clear field errors while typing ----
[emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", clearErrors);
});
// ---- Other actions (demo handlers) ----
googleBtn.addEventListener("click", () => {
    showToast("Continue with Google (demo)");
});
forgotLink.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Password reset link would be sent (demo)");
});
createAccountLink.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Redirect to sign up page (demo)");
});
//# sourceMappingURL=login.js.map