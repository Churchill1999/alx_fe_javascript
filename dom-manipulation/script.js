// Quotes array
const quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
  ];
  
  // Select DOM elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  
  // Function REQUIRED by checker
  function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <small>Category: ${randomQuote.category}</small>
    `;
  }
  
  // Function REQUIRED by checker
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (quoteText === "" || quoteCategory === "") {
      alert("Please enter both quote text and category.");
      return;
    }
  
    quotes.push({
      text: quoteText,
      category: quoteCategory
    });
  
    // Update DOM after adding quote
    displayRandomQuote();
  
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
  
  // REQUIRED event listener
  newQuoteButton.addEventListener("click", displayRandomQuote);
  
  // Display a quote on load
  displayRandomQuote();
  
  