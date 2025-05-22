document.addEventListener("DOMContentLoaded", () => {
  // Helper to create/update the tooltip
  const showTooltip = (text, rect) => {
    let tooltip = document.getElementById("tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "tooltip";
      // Basic styling for tooltip
      tooltip.style.position = "absolute";
      tooltip.style.background = "#fff";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.padding = "10px";
      tooltip.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.2)";
      tooltip.style.zIndex = "1000";
      document.body.appendChild(tooltip);
    }
    tooltip.innerHTML = text;
    // Position tooltip below the clicked element
    tooltip.style.left = rect.left + "px";
    tooltip.style.top = rect.bottom + window.scrollY + 5 + "px";
    tooltip.style.display = "block";
  };

  // Helper to remove the tooltip
  const removeTooltip = () => {
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  };

  // Dismiss tooltip when clicking outside of <w> elements and the tooltip
  document.addEventListener("click", (e) => {
    const tooltip = document.getElementById("tooltip");
    if (tooltip && !tooltip.contains(e.target) && e.target.tagName.toLowerCase() !== "w") {
      removeTooltip();
    }
  });

  // Function to attach click events to <w> elements with a lemma attribute in the search result
  const attachStrongClickEvents = () => {
    const strongElements = document.querySelectorAll("#search-result w[lemma]");
    strongElements.forEach(el => {
      el.style.cursor = "pointer"; // indicate clickable
      el.addEventListener("click", async (event) => {
        event.stopPropagation(); // prevent document click from dismissing tooltip immediately
        const lemmaAttr = el.getAttribute("lemma"); // e.g., "strong:H07225"
        if (!lemmaAttr) return;
        const parts = lemmaAttr.split(":");
        if (parts.length < 2) return;
        const code = parts[1]; // e.g., "H07225" or "G12345"
        let moduleName;
        // Determine commentary module based on the first character
        if (code.charAt(0) === "H") {
          moduleName = "StrongsHebrew";
        } else if (code.charAt(0) === "G") {
          moduleName = "StrongsGreek";
        } else {
          // Fall back to commentary dropdown selection
          moduleName = document.getElementById("commentary-dropdown").value;
        }
        const strongsNumber = code.substring(1); // e.g., "07225"
        const url = `https://diatheke-api-v2-cjahfyezhha7evh8.canadacentral-01.azurewebsites.net/api/commentaries?module=${moduleName}&strongs=${strongsNumber}`;
        try {
          const response = await fetch(url, { headers: { "accept": "application/json" } });
          if (!response.ok) {
            throw new Error("API error: " + response.statusText);
          }
          const data = await response.json();
          // Prefer the parsed definition; if not available, show the raw HTML
          const commentaryText = data.parsed && data.parsed.definition 
            ? data.parsed.definition 
            : data.raw_html;
          const rect = el.getBoundingClientRect();
          showTooltip(commentaryText, rect);
        } catch (err) {
          const rect = el.getBoundingClientRect();
          showTooltip("Error fetching commentary: " + err, rect);
        }
      });
    });
  };

  // Use a MutationObserver to attach events whenever #search-result updates
  const searchResult = document.getElementById("search-result");
  if (searchResult) {
    const observer = new MutationObserver(() => { attachStrongClickEvents(); });
    observer.observe(searchResult, { childList: true, subtree: true });
    // Attach events immediately in case content already exists
    attachStrongClickEvents();
  }
});