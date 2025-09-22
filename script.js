// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function toggleMobileMenu() {
    const isActive = hamburger.classList.contains('active');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Update ARIA attributes for accessibility
    hamburger.setAttribute('aria-expanded', !isActive);
    navMenu.setAttribute('aria-hidden', isActive);
}

hamburger.addEventListener('click', toggleMobileMenu);

// Keyboard navigation for hamburger menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
}));

// Close mobile menu when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        hamburger.focus();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeSlider = document.querySelector('.theme-slider');
const body = document.body;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.textContent = '🌙'; // Full moon for dark mode
    } else {
        themeIcon.textContent = '☀️'; // Sun for light mode
    }
}

// Function to update navbar background based on theme and scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const currentTheme = body.getAttribute('data-theme');
    const isScrolled = window.scrollY > 100;

    if (currentTheme === 'dark') {
        navbar.style.background = isScrolled
            ? 'rgba(26, 26, 46, 0.98)'
            : 'rgba(26, 26, 46, 0.95)';
    } else {
        navbar.style.background = isScrolled
            ? 'rgba(248, 249, 250, 0.98)'
            : 'rgba(248, 249, 250, 0.95)';
    }
}

// Initialize theme icon and toggle state
updateThemeIcon(currentTheme);
themeToggle.setAttribute('aria-pressed', currentTheme === 'light');

// Initialize navbar background
updateNavbarBackground();

// Theme toggle function
function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Add transition animation
    themeToggle.classList.add('transitioning');

    // Update theme
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Update navbar background immediately
    updateNavbarBackground();

    // Update ARIA attributes
    themeToggle.setAttribute('aria-pressed', newTheme === 'light');
    themeToggle.setAttribute('aria-label',
        `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);

    // Remove transition class after animation
    setTimeout(() => {
        themeToggle.classList.remove('transitioning');
    }, 600);

    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

// Theme toggle event listeners
themeToggle.addEventListener('click', toggleTheme);

// Keyboard support for theme toggle
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
    }
});

// Terminal typing animation
function typeCommand(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize terminal animation
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        setTimeout(() => {
            typeCommand(typingElement, 'sqlmap -u "target.com" --dbs', 80);
        }, 2000);
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// This will be handled by the consolidated function below

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize counter animations when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Enhanced form submission handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form-inner');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Enhanced validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg class="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
            `;
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Project card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Tool item hover effects
document.addEventListener('DOMContentLoaded', () => {
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(0, 212, 255, 0.1)';
            item.style.borderColor = 'var(--primary-color)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = 'var(--accent-bg)';
            item.style.borderColor = 'var(--border-color)';
        });
    });
});

// Throttled scroll handler for better performance
let ticking = false;

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    // Update navbar background
    updateNavbarBackground();

    // Parallax effect for hero section
    if (hero && scrolled < hero.offsetHeight) {
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    }

    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

// Optimized scroll event listener
window.addEventListener('scroll', requestTick, { passive: true });

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Terminal command cycling
document.addEventListener('DOMContentLoaded', () => {
    const commands = [
        'nmap -sS -O target.com',
        'sqlmap -u "target.com" --dbs',
        'nikto -h target.com',
        'gobuster dir -u target.com -w wordlist.txt',
        'hydra -l admin -P passwords.txt target.com ssh'
    ];

    let currentCommand = 0;
    const commandElement = document.querySelector('.typing');

    if (commandElement) {
        setInterval(() => {
            currentCommand = (currentCommand + 1) % commands.length;
            typeCommand(commandElement, commands[currentCommand], 60);
        }, 4000);
    }
});

// Dynamic skill progress bars
function createSkillBars() {
    const skillCategories = document.querySelectorAll('.skill-category');

    skillCategories.forEach(category => {
        const skills = category.querySelectorAll('li');
        skills.forEach((skill, index) => {
            // Only hide skills that are not currently visible
            const rect = skill.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight;

            if (!isVisible) {
                skill.style.opacity = '0';
                skill.style.transform = 'translateX(-20px)';
            }
            skill.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        });
    });
}

// Animate skills when they come into view
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skills = entry.target.querySelectorAll('li');
            skills.forEach(skill => {
                skill.style.opacity = '1';
                skill.style.transform = 'translateX(0)';
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// Enhanced scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.project-card, .skill-category, .stat-item, .experience-card, .certification-card, .tool-item'
    );

    animateElements.forEach((el, index) => {
        // Only hide elements that are below the fold
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight;

        if (!isVisible) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        }
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        // Make sure to observe each element
        observer.observe(el);
    });
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize all dynamic features
document.addEventListener('DOMContentLoaded', () => {
    createSkillBars();
    initScrollAnimations();
    updateActiveNavLink();

    // Observe skill categories for skill-specific animation (separate from main scroll animation)
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        skillsObserver.observe(category);
    });

    // Fallback: ensure all sections are visible after a short delay
    setTimeout(() => {
        const allElements = document.querySelectorAll('.experience-card, .certification-card, .skill-category, .project-card, .tool-item');
        allElements.forEach(el => {
            if (el.style.opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }, 1000);
});

