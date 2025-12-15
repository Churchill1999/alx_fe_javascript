// ============================
// INITIAL DATA
// ============================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "Code is poetry.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ============================
// SAVE TO LOCAL STORAGE
// ============================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ============================
// DISPLAY RANDOM QUOTE
// ============================
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>${quote.category}</small>
  `;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// ============================
// FETCH QUOTES FROM SERVER
// ============================
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

// ============================
// POST QUOTE TO SERVER (MOCK)
// ============================
async function postQuoteToServer(quote) {
  await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  });
}

// ============================
// SYNC QUOTES (SERVER WINS)
// ============================
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution → SERVER DATA OVERRIDES LOCAL
  quotes = serverQuotes;
  saveQuotes();
  displayRandomQuote();

  notifyUser("Quotes synced from server. Server data applied.");
}

// ============================
// USER NOTIFICATION
// ============================
function notifyUser(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#ff6565";
  note.style.color = "#fff";
  note.style.padding = "10px";
  note.style.marginBottom = "10px";

  document.body.prepend(note);
  setTimeout(() => note.remove(), 4000);
}

// ============================
// ADD QUOTE
// ============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) return;

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote);
  displayRandomQuote();
}

// ============================
// EVENT LISTENERS
// ============================
newQuoteBtn.addEventListener("click", displayRandomQuote);

// ============================
// INITIAL LOAD
// ============================
displayRandomQuote();

// ============================
// PERIODIC SERVER SYNC
// ============================
setInterval(syncQuotes, 30000);
