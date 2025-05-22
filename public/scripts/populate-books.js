document.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.getElementById("bible-book");
  if (!selectElement) return;

  fetch("../data/books.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load books.json");
      }
      return response.json();
    })
    .then(data => {
      // Clear any existing options
      selectElement.innerHTML = "";
      data.books.forEach(book => {
        const option = document.createElement("option");
        option.value = book;
        option.textContent = book;
        selectElement.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Error loading books: " + err);
    });
});