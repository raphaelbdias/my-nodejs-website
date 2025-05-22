document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-bible");
  if (!searchButton) return;
  
  // Simple mapping for book abbreviations – adjust as needed.
  const bookAbbr = {
    "Genesis": "Gen",
    "Exodus": "Exo",
    "Leviticus": "Lev",
    "Numbers": "Num",
    "Deuteronomy": "Deu"
    // add others if needed
  };
  
  searchButton.addEventListener("click", async () => {
    const module = document.getElementById("bible-module").value;
    const book = document.getElementById("bible-book").value;
    const chapter = document.getElementById("chapter").value;
    
    if (!module || !book || !chapter) {
      alert("Please complete all fields.");
      return;
    }
    
    // Get the abbreviated book name if available
    const abbr = bookAbbr[book] || book;
    // Since verse range is removed, we'll fetch the entire chapter.
    // Use a high default end verse (e.g. 100) to cover most chapters.
    const query = `${abbr} ${chapter}:1-${chapter}:100`;
    const encodedQuery = encodeURIComponent(query);
    
    // Construct API URL; using your provided sample options.
    const url = `http://localhost:8000/api/search?module=${module}&query=${encodedQuery}&option_filters=nfmhcvaplsrwgeixtm&output_format=HTRML&output_encoding=UTF8&variant=0&locale=en`;
    
    try {
      const response = await fetch(url, {
        headers: { "accept": "application/json" }
      });
      if (!response.ok) {
        throw new Error("API error: " + response.statusText);
      }
      const data = await response.json();
      // Remove the selected book name from the beginning of each line using multiline regex.
      const modifiedResult = data.result.replace(new RegExp('^' + book + '\\s+', 'gm'), '');
      document.getElementById("search-result").innerHTML = modifiedResult;
    } catch (err) {
      document.getElementById("search-result").textContent = "Error: " + err;
    }
  });
});