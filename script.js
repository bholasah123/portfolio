document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. STICKY HEADER & ACTIVE NAV LINK HIGHLIGHT
    // ----------------------------------------------------
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header background toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active state indicator for nav links
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 2. MOBILE NAVIGATION DRAWER
    // ----------------------------------------------------
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileNav = () => {
        mobileNavToggle.classList.toggle('open');
        mobileNavMenu.classList.toggle('open');
        document.body.classList.toggle('overflow-hidden');
    };

    mobileNavToggle.addEventListener('click', toggleMobileNav);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close navigation drawer on link click
            mobileNavToggle.classList.remove('open');
            mobileNavMenu.classList.remove('open');
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Close menu when resizing screen back to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNavMenu.classList.contains('open')) {
            mobileNavToggle.classList.remove('open');
            mobileNavMenu.classList.remove('open');
            document.body.classList.remove('overflow-hidden');
        }
    });

    // ----------------------------------------------------
    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // offset triggers slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ----------------------------------------------------
    // 4. PROJECTS FILTER SYSTEM
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons and add to clicked
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show matching card with fade-in scale animation
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide mismatching card smoothly
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ----------------------------------------------------
    // 5. CONTACT FORM VALIDATION & HANDLING
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const submitText = submitBtn.querySelector('span');
    const submitIcon = submitBtn.querySelector('i');

    // Real-time input validation on blur/input
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('invalid')) {
                validateInput(input);
            }
        });
    });

    const validateInput = (input) => {
        const value = input.value.trim();
        const parent = input.parentElement;
        let isValid = true;

        if (input.required && value === '') {
            isValid = false;
        } else if (input.type === 'email' && value !== '') {
            // Basic email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        if (isValid) {
            parent.classList.remove('invalid');
        } else {
            parent.classList.add('invalid');
        }

        return isValid;
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            return;
        }

        // Mock message sending state
        submitBtn.disabled = true;
        submitText.textContent = 'Sending Message...';
        submitIcon.className = 'fas fa-spinner fa-spin';
        formStatus.style.display = 'none';

        setTimeout(() => {
            // Mock success response
            submitBtn.disabled = false;
            submitText.textContent = 'Send Message';
            submitIcon.className = 'fas fa-paper-plane';
            
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            
            contactForm.reset();
        }, 1800);
    });
});
