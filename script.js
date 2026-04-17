document.addEventListener('DOMContentLoaded', () => {
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

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if(navBtn) navBtn.classList.toggle('active');
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // Donation Amount Selection
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');

    if (amountBtns.length > 0) {
        amountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(e.target.dataset.amount !== 'custom') {
                    amountBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    if(customAmountInput) customAmountInput.value = e.target.dataset.amount;
                }
            });
        });
    }

    // Auto-Navigation: Go to next page on scroll down
    const pageOrder = ['index.html', 'about.html', 'elders.html', 'donate.html', 'contact.html'];
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if(currentPath === '' || currentPath === '/') currentPath = 'index.html';
    const currentIndex = pageOrder.indexOf(currentPath);

    let isTransitioning = false;
    
    // Add touch support for mobile swipe-to-next-page
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, {passive: true});
    
    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        if(touchStartY - touchEndY > 50) {
            handleScrollDown();
        }
    }, {passive: true});

    // Mouse wheel support
    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 20) {
            handleScrollDown();
        }
    }, {passive: true});
    
    function handleScrollDown() {
        if (isTransitioning) return;
        
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // If we are at the very bottom of the document
        if (scrollPosition >= documentHeight - 5) {
            if (currentIndex !== -1 && currentIndex < pageOrder.length - 1) {
                isTransitioning = true;
                
                // Add indicator UI
                const indicator = document.createElement('div');
                indicator.innerHTML = `<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Loading next page...`;
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
                
                // Trigger reflow to ensure it fades in
                setTimeout(() => { indicator.style.opacity = '1'; }, 10);
                
                // Visual transition
                document.body.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    document.body.style.opacity = '0';
                    document.body.style.transform = 'translateY(-20px)';
                }, 300);
                
                setTimeout(() => {
                    window.location.href = pageOrder[currentIndex + 1];
                }, 900);
            }
        }
    }
});
