// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Form submission handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // In a real implementation, you would send this data to a server
    alert(`Thanks for your message, ${name}! We'll get back to you soon.`);
    
    // Reset form
    this.reset();
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Mobile menu toggle functionality could be added here if needed in the future