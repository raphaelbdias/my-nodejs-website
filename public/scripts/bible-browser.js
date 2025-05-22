document.addEventListener("DOMContentLoaded", () => {
  const browseButton = document.getElementById("browse-bibles");
  if (browseButton) {
    browseButton.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/systemnames");
        if (!response.ok) {
          throw new Error("API error: " + response.statusText);
        }
        const data = await response.json();
        // Assuming data.result is a newline-separated string of Bible names
        const bibleNames = data.result.split("\n").filter(name => name.trim() !== "");
        document.getElementById("bible-list").textContent = bibleNames.join("\n");
      } catch (err) {
        document.getElementById("bible-list").textContent = "Error: " + err;
      }
    });
  }
});