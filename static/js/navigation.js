document.addEventListener('DOMContentLoaded', () => {
    // Handle navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('href');
            navigateTo(path);
        });
    });
});

function navigateTo(path) {
    // Update URL without page reload
    window.history.pushState({}, '', path);
    loadContent(path);
}

function loadContent(path) {
    fetch(path)
        .then(response => response.text())
        .then(html => {
            const content = document.getElementById('main-content');
            content.innerHTML = html;
        })
        .catch(error => console.error('Error loading content:', error));
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    loadContent(window.location.pathname);
});