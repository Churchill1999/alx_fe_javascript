// Load quotes from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The best way to predict the future is to create it.",
    category: "Motivation"
  },
  {
    text: "Code is like humor. When you have to explain it, it’s bad.",
    category: "Programming"
  },
  {
    text: "Simplicity is the soul of efficiency.",
    category: "Programming"
  }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>${quote.category}</small>
  `;

  // Save last viewed category in session storage
  sessionStorage.setItem("lastViewedCategory", quote.category);
}

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Filter quotes by category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (!categoryFilter) return;

  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(
      quote => quote.category === selectedCategory
    );
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  const randomQuote =
    filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>${randomQuote.category}</small>
  `;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  if (!textInput || !categoryInput) return;

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
}

// JSON Export
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for button
document.addEventListener("DOMContentLoaded", () => {
  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", showRandomQuote);
  }

  populateCategories();
  filterQuotes();
});

