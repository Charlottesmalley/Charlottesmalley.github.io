const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');
const btn = document.querySelector('.dark');
const overlay = document.querySelector('.overlay');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Variable to track current image index
let currentIndex = 0;

/* Declaring the array of image filenames */
const images = ['pic1.jpg', `pic2.jpg`, `pic3.jpg`, `pic4.jpg`, `pic5.jpg`];
const alts = {
  'pic1.jpg' : 'nyc',
  'pic2.jpg' : 'hawaii',
  'pic3.jpg' : 'swan',
  'pic4.jpg' : 'pool',
  'pic5.jpg' : 'maya'
}

/* Looping through images */
for (let i = 0; i < images.length; i++) {
  const image = images[i];
  const newImage = document.createElement('img');
  newImage.setAttribute('src', `images/${image}`);
  newImage.setAttribute('alt', alts[image]);
  newImage.setAttribute('data-index', i);
  thumbBar.appendChild(newImage);
  
  // Set active class on first image initially
  if (i === 0) {
    newImage.classList.add('active');
  }
  
  newImage.addEventListener('click', e => {
    const clickedIndex = parseInt(e.target.getAttribute('data-index'));
    updateDisplayedImage(clickedIndex);
  });
}

/* Wiring up the Darken/Lighten button */
btn.addEventListener('click', () => {
  const btnClass = btn.getAttribute('class');
  if (btnClass === 'dark') {
    btn.setAttribute('class','light');
    btn.textContent = 'Lighten';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  } else {
    btn.setAttribute('class','dark');
    btn.textContent = 'Darken';
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
  }
});

/* Function to update displayed image */
function updateDisplayedImage(index) {
  // Update current index
  currentIndex = index;
  
  // Update displayed image
  displayedImage.src = `images/${images[index]}`;
  displayedImage.alt = alts[images[index]];
  
  // Update active thumbnail
  const thumbnails = thumbBar.querySelectorAll('img');
  thumbnails.forEach(thumb => {
    if (parseInt(thumb.getAttribute('data-index')) === index) {
      thumb.classList.add('active');
    } else {
      thumb.classList.remove('active');
    }
  });
}

/* Add event listeners for navigation buttons */
prevBtn.addEventListener('click', () => {
  let newIndex = currentIndex - 1;
  if (newIndex < 0) {
    newIndex = images.length - 1; // Loop back to the last image
  }
  updateDisplayedImage(newIndex);
});

nextBtn.addEventListener('click', () => {
  let newIndex = currentIndex + 1;
  if (newIndex >= images.length) {
    newIndex = 0; // Loop back to the first image
  }
  updateDisplayedImage(newIndex);
});

// Initialize with the first image
updateDisplayedImage(0);