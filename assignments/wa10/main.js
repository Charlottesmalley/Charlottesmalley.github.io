// 1. COMPLETE VARIABLE AND FUNCTION DEFINITIONS
const customName = document.getElementById('customName');
const randomize = document.querySelector('#randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// 2. RAW TEXT STRINGS
const storyText = 'It was 94 fahrenheit outside, so :insertx: went for a hike. When they arrived :inserty:, they were shocked, then :insertz:. Bob spyed on them and joined in — :insertx: weighs 300 pounds, and it was a hot day.';

const insertX = ['Jimmy the slug', 'Anthoney Pinter', 'The King'];
const insertY = ['TJMAXX', 'Theta Xis Basement', 'porta potty'];
const insertZ = ['released gas loudly', 'fell asleep', 'transfromed into a stormtrooper'];

// 3. EVENT LISTENER AND PARTIAL FUNCTION DEFINITION
randomize.addEventListener('click', result);

function result() {
  // Create a new story based on the template
  let newStory = storyText;

  // Get random items from each array
  const xItem = randomValueFromArray(insertX);
  const yItem = randomValueFromArray(insertY);
  const zItem = randomValueFromArray(insertZ);

  // Replace placeholders with random values
  newStory = newStory.replaceAll(':insertx:', xItem);
  newStory = newStory.replaceAll(':inserty:', yItem);
  newStory = newStory.replaceAll(':insertz:', zItem);

  // Handle custom name replacement
  if (customName.value !== '') {
    const name = customName.value;
    newStory = newStory.replaceAll('Bob', name);
  }

  // Handle UK measurements conversion
  if (document.getElementById('uk').checked) {
    // Convert pounds to stone (1 stone = 14 pounds)
    const weight = Math.round(300 / 14) + ' stone';
    // Convert Fahrenheit to Celsius: (F - 32) * 5/9
    const temperature = Math.round((94 - 32) * 5 / 9) + ' centigrade';

    // Replace the measurement strings
    newStory = newStory.replaceAll('94 fahrenheit', temperature);
    newStory = newStory.replaceAll('300 pounds', weight);
  }

  // Display the story
  story.textContent = newStory;
  story.style.visibility = 'visible';
}

// Initialize the story area as hidden until a story is generated
story.style.visibility = 'hidden';