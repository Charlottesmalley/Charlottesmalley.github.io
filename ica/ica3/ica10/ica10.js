document.addEventListener('DOMContentLoaded', function() {
    // Get all elements we'll need
    const letters = document.querySelectorAll('.letter');
    const selectedLetterDisplay = document.getElementById('selected-letter');
    const colorBoxes = document.querySelectorAll('.color-box');
    const randomColorsButton = document.getElementById('random-colors');
    
    // Initialize variables
    let selectedLetter = null;
    
    // Set initial colors for all letters
    letters.forEach(letter => {
        letter.style.color = '#000000';
    });
    
    // Add click event listeners to all letters
    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            // Remove 'selected' class from all letters
            letters.forEach(l => l.classList.remove('selected'));
            
            // Add 'selected' class to clicked letter
            this.classList.add('selected');
            
            // Update selected letter display
            selectedLetter = this;
            selectedLetterDisplay.textContent = this.textContent;
            
            // Get the current color of the letter
            const computedStyle = window.getComputedStyle(this);
            const currentColor = computedStyle.color;
            
            // Convert RGB to hex
            const hexColor = rgbToHex(currentColor);
            
            // Highlight the matching color box if exists
            updateSelectedColorBox(hexColor);
        });
    });
    
    // Add click event listeners to all color boxes
    colorBoxes.forEach(box => {
        box.addEventListener('click', function() {
            // Only apply color if a letter is selected
            if (selectedLetter) {
                const color = this.getAttribute('data-color');
                
                // Apply color to selected letter
                selectedLetter.style.color = color;
                
                // Update selected color box
                colorBoxes.forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
    
    // Function to convert RGB string to Hex
    function rgbToHex(rgb) {
        // If already hex format, return as is
        if (rgb.startsWith('#')) {
            return rgb;
        }
        
        // Extract the RGB values
        const rgbValues = rgb.match(/\d+/g);
        if (rgbValues && rgbValues.length === 3) {
            return '#' + [rgbValues[0], rgbValues[1], rgbValues[2]].map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('').toUpperCase();
        }
        
        return '#000000'; // Default if parsing fails
    }
    
    // Function to update the selected color box based on hex color
    function updateSelectedColorBox(hexColor) {
        colorBoxes.forEach(box => {
            box.classList.remove('selected');
            if (box.getAttribute('data-color').toUpperCase() === hexColor.toUpperCase()) {
                box.classList.add('selected');
            }
        });
    }
    
    // Random colors for all letters
    randomColorsButton.addEventListener('click', function() {
        const availableColors = Array.from(colorBoxes).map(box => 
            box.getAttribute('data-color')
        );
        
        letters.forEach(letter => {
            // Select a random color from our palette
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            const randomColor = availableColors[randomIndex];
            
            letter.style.color = randomColor;
            
            // Update selected box if this letter is currently selected
            if (letter === selectedLetter) {
                updateSelectedColorBox(randomColor);
            }
        });
    });
});