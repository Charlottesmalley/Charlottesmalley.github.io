// DOM Elements
const quoteText = document.getElementById('quoteText');
const authorText = document.getElementById('authorText');
const movieText = document.getElementById('movieText');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const themeToggle = document.getElementById('themeToggle');
const copyBtn = document.getElementById('copyBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const movieSelect = document.getElementById('movieSelect');

// Variables
let currentQuote = '';
let currentAuthor = '';
let currentMovie = '';
let favorites = JSON.parse(localStorage.getItem('disneyQuoteFavorites')) || [];

// Disney Quotes Collection
const disneyQuotes = [
    {
        quote: "The past can hurt. But the way I see it, you can either run from it or learn from it.",
        character: "Rafiki",
        movie: "The Lion King",
        category: "lion_king",
    },
    {
        quote: "Oh yes, the past can hurt. But you can either run from it, or learn from it.",
        character: "Rafiki",
        movie: "The Lion King",
        category: "lion_king",
    },
    {
        quote: "Hakuna Matata! It means no worries for the rest of your days.",
        character: "Timon",
        movie: "The Lion King",
        category: "lion_king",
    },
    {
        quote: "Like so many things, it's not what's outside, but what's inside that counts.",
        character: "Merchant",
        movie: "Aladdin",
        category: "aladdin",
    },
    {
        quote: "Today is a good day to try.",
        character: "Quasimodo",
        movie: "The Hunchback of Notre Dame",
        category: "other",
    },
    {
        quote: "The flower that blooms in adversity is the most rare and beautiful of all.",
        character: "The Emperor",
        movie: "Mulan",
        category: "mulan",
    },
    {
        quote: "Some people are worth melting for.",
        character: "Olaf",
        movie: "Frozen",
        category: "frozen",
    },
    {
        quote: "The only way to get what you want in this world is through hard work.",
        character: "Tiana",
        movie: "The Princess and the Frog",
        category: "other",
    },
    {
        quote: "I am Moana of Motunui. You will board my boat, sail across the sea, and restore the heart of Te Fiti.",
        character: "Moana",
        movie: "Moana",
        category: "moana",
    },
    {
        quote: "Remember who you are.",
        character: "Mufasa",
        movie: "The Lion King",
        category: "lion_king",
    },
    {
        quote: "To infinity and beyond!",
        character: "Buzz Lightyear",
        movie: "Toy Story",
        category: "toy_story",
    },
    {
        quote: "You've got a friend in me.",
        character: "Woody",
        movie: "Toy Story",
        category: "toy_story",
    },
    {
        quote: "The very things that hold you down are going to lift you up.",
        character: "Timothy Mouse",
        movie: "Dumbo",
        category: "other",
    },
    {
        quote: "No matter how your heart is grieving, if you keep on believing, the dream that you wish will come true.",
        character: "Cinderella",
        movie: "Cinderella",
        category: "other",
    },
    {
        quote: "The problem is not the problem. The problem is your attitude about the problem.",
        character: "Jack Sparrow",
        movie: "Pirates of the Caribbean",
        category: "other",
    },
    {
        quote: "Sometimes the right path is not the easiest one.",
        character: "Grandmother Willow",
        movie: "Pocahontas",
        category: "other",
    },
    {
        quote: "Venture outside your comfort zone. The rewards are worth it.",
        character: "Rapunzel",
        movie: "Tangled",
        category: "other",
    },
    {
        quote: "Let it go, let it go!",
        character: "Elsa",
        movie: "Frozen",
        category: "frozen",
    },
    {
        quote: "The seaweed is always greener in somebody else's lake.",
        character: "Sebastian",
        movie: "The Little Mermaid",
        category: "other",
    }
];

// Check if a quote is in favorites
function isInFavorites(quote, character) {
    return favorites.some(fav => fav.quote === quote && fav.character === character);
}

// Update favorite button state
function updateFavoriteButton() {
    if (isInFavorites(currentQuote, currentAuthor)) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favoriteBtn.title = "Remove from favorites";
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.title = "Add to favorites";
    }
}

// Toggle theme between light and dark
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Function to get a random quote
function getRandomQuote() {
    // Filter quotes based on selection
    const selectedMovie = movieSelect.value;
    let filteredQuotes = disneyQuotes;
    
    if (selectedMovie) {
        filteredQuotes = disneyQuotes.filter(quote => quote.category === selectedMovie);
        // If no quotes found for the selected category, use all quotes
        if (filteredQuotes.length === 0) {
            filteredQuotes = disneyQuotes;
        }
    }
    
    // Get random quote from filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
}

// Function to display a new quote
function displayQuote() {
    // Show loading spinner
    loadingSpinner.style.display = 'flex';
    quoteText.classList.add('fade');
    authorText.classList.add('fade');
    movieText.classList.add('fade');
    
    // Simulate loading to demonstrate spinner
    setTimeout(() => {
        const quoteData = getRandomQuote();
        
        // Save current quote info
        currentQuote = quoteData.quote;
        currentAuthor = quoteData.character;
        currentMovie = quoteData.movie;
        
        // Update quote content
        quoteText.textContent = quoteData.quote;
        authorText.textContent = `- ${quoteData.character}`;
        movieText.textContent = quoteData.movie;
        
        // Hide loading spinner and show quote
        loadingSpinner.style.display = 'none';
        quoteText.classList.remove('fade');
        authorText.classList.remove('fade');
        movieText.classList.remove('fade');
        
        // Update favorite button
        updateFavoriteButton();
    }, 800); // 800ms delay to show loading effect
}

// Event Listeners
newQuoteBtn.addEventListener('click', displayQuote);

// Copy quote to clipboard
copyBtn.addEventListener('click', () => {
    if (currentQuote && currentAuthor) {
        const textToCopy = `"${currentQuote}" - ${currentAuthor} (${currentMovie})`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Change icon temporarily to show success
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-clipboard"></i>';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
});

// Add/remove from favorites
favoriteBtn.addEventListener('click', () => {
    if (currentQuote && currentAuthor) {
        const index = favorites.findIndex(fav => 
            fav.quote === currentQuote && fav.character === currentAuthor
        );
        
        if (index === -1) {
            // Add to favorites
            favorites.push({
                quote: currentQuote,
                character: currentAuthor,
                movie: currentMovie
            });
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            favoriteBtn.title = "Remove from favorites";
        } else {
            // Remove from favorites
            favorites.splice(index, 1);
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            favoriteBtn.title = "Add to favorites";
        }
        
        // Save to localStorage
        localStorage.setItem('disneyQuoteFavorites', JSON.stringify(favorites));
    }
});

// Handle movie selection change
movieSelect.addEventListener('change', displayQuote);

// Get initial quote when page loads
window.addEventListener('DOMContentLoaded', displayQuote);