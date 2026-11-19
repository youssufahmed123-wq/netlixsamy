// Youssef Samy - Netflix Clone demo
// Note: localStorage authentication is for front-end coursework only.
// Do not use this approach for real accounts or sensitive passwords.

"use strict";

function handleEmailForm(formId, inputId) {
    const form = document.getElementById(formId);
    const emailInput = document.getElementById(inputId);

    if (!form || !emailInput) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        sessionStorage.setItem("userEmail", email);
        window.location.href = "register.html";
    });
}

handleEmailForm("startForm", "startEmail");
handleEmailForm("bottomForm", "bottomEmail");

// Registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const savedEmail = sessionStorage.getItem("userEmail");
    const emailField = document.getElementById("email");
    if (savedEmail && emailField) emailField.value = savedEmail;

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms").checked;
        const message = document.getElementById("registerMessage");

        function showMessage(text, color) {
            message.textContent = text;
            message.style.color = color;
        }

        if (!fullName || !email || !password || !confirmPassword) {
            showMessage("Please fill in all fields.", "#ff4d4d");
            return;
        }
        if (password.length < 6) {
            showMessage("Password must be at least 6 characters.", "#ff4d4d");
            return;
        }
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "#ff4d4d");
            return;
        }
        if (!terms) {
            showMessage("Please accept the Terms and Conditions.", "#ff4d4d");
            return;
        }

        let users;
        try {
            users = JSON.parse(localStorage.getItem("marwanUsers")) || [];
            if (!Array.isArray(users)) users = [];
        } catch (error) {
            users = [];
        }

        const existingUser = users.find(user =>
            user.email && user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            showMessage("This email is already registered.", "#ff4d4d");
            return;
        }

        users.push({ fullName, email, password });
        localStorage.setItem("marwanUsers", JSON.stringify(users));
        sessionStorage.removeItem("userEmail");

        showMessage("Account created successfully! Redirecting to sign in...", "#4caf50");
        setTimeout(() => window.location.href = "login.html", 1200);
    });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        let users;
        try {
            users = JSON.parse(localStorage.getItem("marwanUsers")) || [];
            if (!Array.isArray(users)) users = [];
        } catch (error) {
            users = [];
        }

        const foundUser = users.find(user =>
            user.email &&
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        );

        if (!foundUser) {
            message.textContent = "Incorrect email or password.";
            message.style.color = "#ff4d4d";
            return;
        }

        message.textContent = "Login successful! Welcome " + foundUser.fullName;
        message.style.color = "#4caf50";
        localStorage.setItem("currentUser", JSON.stringify({
            fullName: foundUser.fullName,
            email: foundUser.email
        }));

        setTimeout(() => window.location.href = "index.html", 1200);
    });
}
