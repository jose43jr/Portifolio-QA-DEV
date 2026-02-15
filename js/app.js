// Main Application Script

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio QA Loaded');

    // 0. Navbar Scroll Effect (Glassmorphism)
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Hamburger Animation
            hamburger.classList.toggle('toggle');
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                hamburger.classList.remove('toggle');

                navLinks.forEach((link) => {
                    link.style.animation = '';
                });
            });
        });
    }

    // 1. Loader Logic
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000); // 1s simulating delay or wait for content
    }

    // 2. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }

        // Parallax Effect for Hero Video (Simple)
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo && scrollTop < 600) {
            heroVideo.style.transform = `translateY(${scrollTop * 0.4}px)`;
        }
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Staggered Scroll Animation (High-End)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all immediate children that are cards/items
                const children = entry.target.children;

                // Add class to parent to trigger potential parent animations
                entry.target.classList.add('visible');

                // Stagger children
                Array.from(children).forEach((child, index) => {
                    // Add the base transition class if not present
                    child.classList.add('fade-up-element');

                    // Delay based on index (e.g., 100ms * index)
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 150);
                });

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Targets to animate (Grids)
    const staggerGrids = document.querySelectorAll('.qualities-grid, .skills-grid, .projects-grid, .video-grid, .testimonials-grid, .timeline');
    staggerGrids.forEach(grid => {
        // Ensure children are hidden initially
        Array.from(grid.children).forEach(child => {
            child.classList.add('fade-up-element');
        });
        staggerObserver.observe(grid);
    });

    // Simple Fade In for Section Titles and standard text
    // This observer is now used for elements that don't have children to stagger,
    // but still need a simple fade-in effect.
    const simpleFadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                simpleFadeObserver.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.1 });

    // Apply simple fade to section titles and other non-staggered elements
    document.querySelectorAll('.reveal-text, .about-text, .section-title, .fade-in').forEach(el => {
        simpleFadeObserver.observe(el);
    });
});

// Modal Logic V2 (Video Tag)
function openModal(videoPath) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');

    // Set source
    player.src = videoPath;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Attempt play
    player.play().catch(e => console.log('Autoplay prevented', e));
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');

    player.pause();
    player.currentTime = 0;
    player.src = ""; // Clear source

    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on Escape key
// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// --- High-End Tech Effects ---

// 4. Spotlight Effect (Bento Grid Style)
document.querySelectorAll('.skill-card, .project-card, .video-card').forEach(card => {
    card.classList.add('spotlight-card'); // Add CSS class dynamically

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 5. Scramble Text Effect (Hacker/Tech Vibe)
const chars = '!<>-_\\/[]{}—=+*^?#________';

function scrambleText(element) {
    const originalText = element.dataset.value;
    let iterations = 0;

    const interval = setInterval(() => {
        element.innerText = originalText
            .split('')
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        if (iterations >= originalText.length) {
            clearInterval(interval);
        }

        iterations += 1 / 3; // Controls speed
    }, 30);
}

// Apply scramble to specific elements (Logo or Headers)
const logoSpan = document.querySelector('.logo .text-accent');
if (logoSpan) {
    logoSpan.classList.add('scramble-text');
    logoSpan.dataset.value = logoSpan.innerText;

    logoSpan.addEventListener('mouseover', () => scrambleText(logoSpan));
}

// 6. Magnetic Buttons (High-End UX)
// Select buttons to apply the effect
const magneticButtons = document.querySelectorAll('.btn, .btn-link, .nav-links a');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Strength of magnetic effect (higher divisor = weaker pull)
        const xMove = x / 3;
        const yMove = y / 3;

        btn.style.transform = `translate(${xMove}px, ${yMove}px)`;
        btn.classList.add('magnetic-active');
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.classList.remove('magnetic-active');

        // Add a small bounce effect via CSS transition on release
        setTimeout(() => {
            btn.style.transform = '';
        }, 300);
    });
});
