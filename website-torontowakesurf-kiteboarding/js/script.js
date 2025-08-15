// WeLoveKiteboarding Style Replica - Toronto Wakesurf JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenu = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hero Slider Functionality
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Event listeners for slider navigation
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Indicator navigation
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto-play slider
    setInterval(nextSlide, 6000);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate statistics on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const statisticsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(statNumber => {
                    const finalValue = statNumber.textContent.replace(/[^0-9]/g, '');
                    const suffix = statNumber.textContent.replace(/[0-9]/g, '');
                    let currentValue = 0;
                    const increment = Math.ceil(finalValue / 50);
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            statNumber.textContent = finalValue + suffix;
                            clearInterval(timer);
                        } else {
                            statNumber.textContent = currentValue + suffix;
                        }
                    }, 50);
                });
                statisticsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe stats section
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statisticsObserver.observe(statsSection);
    }

    // Fade in animation for elements
    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for fade-in animation
    const animateElements = document.querySelectorAll('.lesson-card, .location-card, .equipment-item, .event-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(el);
    });

    // Contact form handling
    const contactForm = document.querySelector('.booking-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data['lesson-type']) {
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
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Booking...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Lesson booked successfully! We\'ll contact you within 24 hours to confirm your session.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 10000;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            ${type === 'success' ? 'background: #27ae60;' : ''}
            ${type === 'error' ? 'background: #e74c3c;' : ''}
            ${type === 'info' ? 'background: #2980b9;' : ''}
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.lesson-card, .location-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }
        });
    });

    // Gallery image lightbox effect (simple version)
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            // Simple lightbox - you could integrate a more sophisticated one
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });
        });
    });

    // Weather widget update (mock data)
    function updateWeather() {
        const weatherItems = document.querySelectorAll('.weather-item span');
        if (weatherItems.length > 0) {
            // Mock weather update - in real implementation, you'd fetch from an API
            const mockData = [
                Math.round(Math.random() * 10 + 18) + '°C',
                Math.round(Math.random() * 20 + 5) + ' km/h',
                (Math.random() * 2 + 0.2).toFixed(1) + 'm',
                Math.round(Math.random() * 5 + 8) + 'km'
            ];
            
            weatherItems.forEach((item, index) => {
                if (mockData[index]) {
                    item.textContent = mockData[index];
                }
            });
        }
    }

    // Update weather every 5 minutes
    updateWeather();
    setInterval(updateWeather, 300000);

    // Smooth button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize any lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    console.log('Toronto Wakesurf - WeLoveKiteboarding Style Loaded Successfully! 🏄‍♂️');
});