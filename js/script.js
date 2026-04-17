document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    const donationForm = document.querySelector('#donation-form');
    const contactForm = document.querySelector('#contact-form');

    function handleValidation(form, fields) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            let valid = true;

            fields.forEach(field => {
                const input = form.querySelector(`[name="${field.name}"]`);
                const message = form.querySelector(`#${field.name}-error`);
                const value = input.value.trim();
                let error = '';

                if (!value) {
                    error = field.requiredMessage;
                } else if (field.pattern && !field.pattern.test(value)) {
                    error = field.errorMessage;
                }

                if (error) {
                    valid = false;
                    message.textContent = error;
                    input.classList.add('input-error');
                } else {
                    message.textContent = '';
                    input.classList.remove('input-error');
                }
            });

            if (valid) {
                form.reset();
                const successText = form.querySelector('.form-success');
                if (successText) {
                    successText.textContent = 'Thank you. Your information has been collected successfully.';
                    setTimeout(() => {
                        successText.textContent = '';
                    }, 4500);
                }
            }
        });
    }

    if (donationForm) {
        handleValidation(donationForm, [
            { name: 'amount', requiredMessage: 'Enter donation amount.' },
            { name: 'name', requiredMessage: 'Enter your full name.' },
            { name: 'phone', requiredMessage: 'Enter your phone number.', pattern: /^[0-9]{7,15}$/, errorMessage: 'Phone must be numeric and at least 7 digits.' },
            { name: 'address', requiredMessage: 'Enter your address.' }
        ]);
    }

    if (contactForm) {
        handleValidation(contactForm, [
            { name: 'name', requiredMessage: 'Enter your full name.' },
            { name: 'email', requiredMessage: 'Enter your email address.', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMessage: 'Enter a valid email address.' },
            { name: 'message', requiredMessage: 'Enter your message.' }
        ]);
    }

    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            if (location.pathname === link.pathname && location.hostname === link.hostname) {
                const targetId = link.hash.slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            }
        });
    });
});