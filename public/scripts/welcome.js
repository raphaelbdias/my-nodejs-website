// Use query parameter to display user's real name and current date
document.addEventListener("DOMContentLoaded", () => {
    // Parse URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const realName = urlParams.get("realName") || "User";
    document.getElementById("welcome-heading").textContent = `Welcome, ${realName}!`;
    
    // Display the current date:
    const currentDate = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    document.getElementById("current-date").textContent = currentDate;
});