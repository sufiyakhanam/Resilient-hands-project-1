document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navBtn = document.querySelector('.nav-btn');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        if (navBtn) navBtn.classList.toggle('active');
        const isOpen = navLinks.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isOpen);
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .founder-card').forEach(element => {
        if (prefersReducedMotion) {
            element.classList.add('visible');
        } else {
            observer.observe(element);
        }
    });

    // Staggered animation for mission/vision cards
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.stagger-item');
                items.forEach((item, index) => {
                    if (prefersReducedMotion) {
                        item.classList.add('visible');
                    } else {
                        setTimeout(() => item.classList.add('visible'), index * 150);
                    }
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.mission-vision-grid').forEach(grid => {
        if (prefersReducedMotion) {
            grid.querySelectorAll('.stagger-item').forEach(item => item.classList.add('visible'));
        } else {
            staggerObserver.observe(grid);
        }
    });

    // Donation Envelope Interaction
    const envelope = document.getElementById('donationEnvelope');

    function openEnvelope() {
        if (!envelope || envelope.classList.contains('opened')) return;
        envelope.classList.add('opened');
        envelope.setAttribute('aria-expanded', 'true');
        envelope.setAttribute('aria-label', 'Donation envelope opened – payment details displayed');
    }

    if (envelope) {
        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEnvelope();
            }
        });

        if (prefersReducedMotion) {
            envelope.addEventListener('click', () => {
                document.querySelectorAll('.letter-message, .letter-content').forEach(el => {
                    el.style.opacity = '1';
                });
            });
        }
    }

    // Copy to Clipboard Buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            try {
                await navigator.clipboard.writeText(text);
                const originalText = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalText;
                }, 2000);
            } catch {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 2000);
            }
        });
    });

    // Auto-Navigation: Go to next page on scroll down
    const pageOrder = ['index.html', 'about.html', 'elders.html', 'donate.html', 'contact.html'];
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';
    const currentIndex = pageOrder.indexOf(currentPath);

    let isTransitioning = false;

    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50) {
            handleScrollDown();
        }
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 20) {
            handleScrollDown();
        }
    }, { passive: true });

    function handleScrollDown() {
        if (isTransitioning) return;

        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= documentHeight - 5) {
            if (currentIndex !== -1 && currentIndex < pageOrder.length - 1) {
                isTransitioning = true;

                const indicator = document.createElement('div');
                indicator.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Loading next page...';
                Object.assign(indicator.style, {
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--primary-brown)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: '9999',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500',
                    opacity: '0',
                    transition: 'opacity 0.3s ease'
                });
                document.body.appendChild(indicator);

                setTimeout(() => { indicator.style.opacity = '1'; }, 10);

                if (!prefersReducedMotion) {
                    document.body.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    setTimeout(() => {
                        document.body.style.opacity = '0';
                        document.body.style.transform = 'translateY(-20px)';
                    }, 300);
                }

                setTimeout(() => {
                    window.location.href = pageOrder[currentIndex + 1];
                }, prefersReducedMotion ? 100 : 900);
            }
        }
    }
});
