// Toggle between Sign Up and Login forms and handle form submissions
document.addEventListener("DOMContentLoaded", () => {
    const signupTab = document.getElementById("signup-tab");
    const loginTab = document.getElementById("login-tab");
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    
    // Tab switching
    signupTab.addEventListener("click", () => {
        signupTab.classList.add("active");
        loginTab.classList.remove("active");
        signupForm.classList.add("active");
        loginForm.classList.remove("active");
    });
    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
    });
    
    // Handle Sign Up Form Submission
    document.getElementById("form-signup").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            phone: e.target.phone.value
        };
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if(result.success) {
                // Redirect or display message
                alert("Sign Up Successful! You can now log in.");
            } else {
                alert("Sign Up Failed!");
            }
        } catch (err) {
            console.error(err);
        }
    });
    
    // Handle Login Form Submission
    document.getElementById("form-login").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = {
            email: e.target["email-login"].value,
            password: e.target["password-login"].value
        };
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if(result.success && result.realName) {
                // Redirect to welcome page passing realName as query parameter
                window.location.href = `/html/welcome.html?realName=${encodeURIComponent(result.realName)}`;
            } else {
                alert("Login Failed!");
            }
        } catch (err) {
            console.error(err);
        }
    });
});