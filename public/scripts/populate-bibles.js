document.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("bible-module");
  if (!selectElement) return;

  fetch("../data/bibles.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load bibles.json");
      }
      return response.json();
    })
    .then(data => {
      // Clear any existing options
      selectElement.innerHTML = "";
      data.bibles.forEach(bible => {
        const option = document.createElement("option");
        option.value = bible.code;
        option.textContent = `${bible.code} : ${bible.description}`;
        selectElement.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Error loading bibles: " + err);
    });
});