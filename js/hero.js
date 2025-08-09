document.addEventListener('DOMContentLoaded', () => {
    // --- Fade-in on Scroll Animation ---
    let observer;
    function observeFadeInElements() {
        const fadeInElements = document.querySelectorAll('.fade-in');
        if (observer) observer.disconnect();
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        fadeInElements.forEach(el => observer.observe(el));
    }

    observeFadeInElements();
});
