// Array of quote objects
const quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
  ];
  
  // Select DOM elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (quoteText === "" || quoteCategory === "") {
      alert("Please enter both quote text and category.");
      return;
    }
  
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });
  
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  
    alert("Quote added successfully!");
  }
  
  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  
  // Show an initial quote on page load
  showRandomQuote();
  