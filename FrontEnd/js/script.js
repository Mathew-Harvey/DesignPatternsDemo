document.addEventListener('DOMContentLoaded', () => {
    // Example of JavaScript to add class to navigation based on current page
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.global-nav a');
  
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  });
  

  