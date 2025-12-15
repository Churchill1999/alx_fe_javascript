// ============================
// INITIAL QUOTES (DEFAULT)
// ============================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit is your mind.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" }
];

// ============================
// DOM ELEMENTS
// ============================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// ============================
// SAVE TO LOCAL STORAGE
// ============================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ============================
// DISPLAY RANDOM QUOTE
// ============================
function displayRandomQuote(filteredQuotes = quotes) {
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>— ${quote.category}</small>
  `;

  // Save last viewed quote (session storage)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ============================
// ADD NEW QUOTE
// ============================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  if (textInput.value === "" || categoryInput.value === "") {
    alert("Please fill in both fields");
    return;
  }

  const newQuote = {
    text: textInput.value,
    category: categoryInput.value
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// ============================
// POPULATE CATEGORIES
// ============================
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

// ============================
// FILTER QUOTES
// ============================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayRandomQuote(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    displayRandomQuote(filtered);
  }
}

// ============================
// EXPORT TO JSON
// ============================
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ============================
// IMPORT FROM JSON
// ============================
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

// ============================
// SERVER SYNC (SIMULATION)
// ============================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server
async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Convert server posts to quotes format
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    // CONFLICT RESOLUTION → SERVER WINS
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    displayRandomQuote();

    notifyUser("Quotes synced with server. Server data applied.");

  } catch (error) {
    console.error("Server sync failed", error);
  }
}

// ============================
// USER NOTIFICATION
// ============================
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.background = "#ff6565";
  notification.style.color = "#fff";
  notification.style.padding = "10px";
  notification.style.margin = "10px 0";

  document.body.prepend(notification);

  setTimeout(() => notification.remove(), 4000);
}

// ============================
// EVENT LISTENERS
// ============================
newQuoteBtn.addEventListener("click", () => {
  filterQuotes();
});

// ============================
// INITIAL LOAD
// ============================
populateCategories();
displayRandomQuote();

// Periodic server sync (every 30 seconds)
setInterval(syncWithServer, 30000);
