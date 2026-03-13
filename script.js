document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky Navbar & Scroll Progress
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 80;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link highlighting
        highlightActiveLink();
    };

    window.addEventListener('scroll', handleScroll);

    // Mobile Menu Overlay
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    //  Intersection Observer for Reveal Animations 
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the stats section, trigger counter
                if (entry.target.classList.contains('community-stats')) {
                    animateCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Staggered Reveal for Cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Stats Counter Animation
    const animateCounters = () => {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.innerText);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.innerText = Math.ceil(current) + (stat.innerText.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + (stat.innerText.includes('+') ? '+' : '');
                }
            };
            updateCount();
        });
    };

    // Smooth Scrolling with Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Link Highlight
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    const highlightActiveLink = () => {
        let current = '';
        const navHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - navHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.style.color = '';
            item.classList.remove('active-link');
            if (item.getAttribute('href').slice(1) === current) {
                item.style.color = 'var(--primary)';
            }
        });
    };

    // Contact Form Submission (Premium Feedback)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalContent = btn.innerHTML;
            
            // Loading state
            btn.disabled = true;
            btn.innerHTML = '<i data-lucide="loader-2" class="icon-sm spin"></i> Sending...';
            lucide.createIcons(); // Re-render icons

            // Simulate API call
            setTimeout(() => {      
                btn.innerHTML = '<i data-lucide="check-circle" class="icon-sm"></i> Message Sent!';
                btn.style.backgroundColor = '#10B981'; // Success green
                lucide.createIcons();
                
                contactForm.reset();
                
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalContent;
                    btn.style.backgroundColor = '';
                    lucide.createIcons();
                }, 3000);
            }, 1500);
        });
    }

    // Initialize initial state
    handleScroll();
});
