
const newQuoteButton = document.querySelector('#js-new-quote');
const answerButton = document.querySelector('#js-tweet');
const quoteTextElement = document.querySelector('#js-quote-text');
const answerTextElement = document.querySelector('#js-answer-text');


const endpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

function displayQuote(quoteData) {
  
  quoteTextElement.textContent = quoteData.question;
  
  answerTextElement.textContent = '';
}

function displayAnswer(quoteData) {
  answerTextElement.textContent = quoteData.answer;
}


async function getQuote() {
 
  console.log('Quote button was clicked');
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();
    
    
    console.log(json);
    
    
    displayQuote(json);
    
   
    newQuoteButton.quoteData = json;
    answerButton.quoteData = json;
    
  } catch(err) {
    
    console.log('Failed to fetch new quote');
    console.log(err);
    alert('Failed to fetch new quote');
  }
}


function showAnswer() {
  console.log('Answer button was clicked');
  if (answerButton.quoteData) {
    displayAnswer(answerButton.quoteData);
  }
}


newQuoteButton.addEventListener('click', getQuote);

answerButton.addEventListener('click', showAnswer);

getQuote();