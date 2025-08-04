// Grab references to the input and suggestions list
const inputEl = document.getElementById("searchInput");
const suggestionsEl = document.getElementById("suggestions");

// Listen for user typing
inputEl.addEventListener("input", function () {
  // Normalize the query
  const query = this.value.toLowerCase().trim();

  // Clear any previous suggestions
  suggestionsEl.innerHTML = "";

  // If query is empty, do nothing
  if (!query) return;

  // 1. Filter names that include the query (case-insensitive)
  // 2. Take only the first 5 matches
  const matches = people
    .filter(function (name) {
      return name.toLowerCase().includes(query);
    })
    .slice(0, 5);

  // Render each match as a clickable list item
  matches.forEach(function (name) {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.textContent = name;

    // When clicked, fill the input and clear suggestions
    li.addEventListener("click", function () {
      inputEl.value = name;
      suggestionsEl.innerHTML = "";
    });

    suggestionsEl.appendChild(li);
  });
});