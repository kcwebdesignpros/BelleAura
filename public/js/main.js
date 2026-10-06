/**
 * BelleAura Beauty Salon - Main JavaScript
 * Handles navigation, animations, FAQ, gallery filters, and form validation
 */

(function() {
  'use strict';

  // =============================================
  // MOBILE NAVIGATION TOGGLE
  // =============================================
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      const isOpen = navList.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navList.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navList.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =============================================
  // HEADER SCROLL EFFECT
  // =============================================
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // =============================================
  // SCROLL ANIMATIONS
  // =============================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements
    animatedElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // =============================================
  // FAQ ACCORDION
  // =============================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(function(question) {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isOpen = this.getAttribute('aria-expanded') === 'true';

      // Close all other FAQs
      faqQuestions.forEach(function(q) {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.classList.remove('open');
      });

      // Toggle current FAQ
      if (!isOpen) {
        this.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // =============================================
  // GALLERY FILTERS
  // =============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-masonry .gallery-item');

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      // Filter items
      galleryItems.forEach(function(item) {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          setTimeout(function() {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.style.opacity = '0';
          setTimeout(function() {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // =============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =============================================
  // FORM VALIDATION
  // =============================================
  const forms = document.querySelectorAll('.contact-form, .booking-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#e74c3c';
          showError(field, 'This field is required');
        } else {
          field.style.borderColor = '';
          clearError(field);
        }

        // Email validation
        if (field.type === 'email' && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            showError(field, 'Please enter a valid email address');
          }
        }

        // Phone validation
        if (field.type === 'tel' && field.value) {
          const phoneRegex = /^[\d\s\-\+\(\)]+$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            showError(field, 'Please enter a valid phone number');
          }
        }
      });

      if (isValid) {
        // Show success message (no backend - demo mode)
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.style.cssText = 'padding: 1rem; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; color: #155724; margin-top: 1rem; text-align: center;';
        successMessage.innerHTML = '<strong>Thank you!</strong> Your message has been received. We\'ll contact you within 24 hours.';

        form.innerHTML = '';
        form.appendChild(successMessage);

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  function showError(field, message) {
    clearError(field);
    const error = document.createElement('span');
    error.className = 'field-error';
    error.style.cssText = 'display: block; color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem;';
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  function clearError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  // =============================================
  // SET MIN DATE FOR BOOKING (today)
  // =============================================
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // =============================================
  // LAZY LOAD IMAGES (fallback for older browsers)
  // =============================================
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    }
  }

  // =============================================
  // ACTIVE NAV LINK BASED ON SCROLL POSITION
  // =============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a[href^="/"]');

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href === '/' + id || (id === 'main-content' && href === '/')) {
              // Could highlight active section link
            }
          });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(function(section) {
      sectionObserver.observe(section);
    });
  }

  // =============================================
  // STATS COUNTER ANIMATION
  // =============================================
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(stat) {
      statObserver.observe(stat);
    });
  }

  function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/[^0-9]/g, ''));
    const suffix = (hasPlus ? '+' : '') + (hasPercent ? '%' : '');

    if (isNaN(number)) return;

    let current = 0;
    const increment = Math.ceil(number / 60);
    const duration = 1500;
    const stepTime = duration / (number / increment);

    const timer = setInterval(function() {
      current += increment;
      if (current >= number) {
        current = number;
        clearInterval(timer);
      }
      element.textContent = current + suffix;
    }, stepTime);
  }

  // =============================================
  // TESTIMONIAL CAROUSEL
  // =============================================
  document.querySelectorAll('[data-carousel]').forEach(function(carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    if (!track) return;

    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    const cards = Array.prototype.slice.call(track.children);

    if (cards.length === 0) return;

    function step() {
      if (cards.length < 2) return track.clientWidth;
      const delta = cards[1].offsetLeft - cards[0].offsetLeft;
      if (delta > 0) return delta;
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return cards[0].offsetWidth + gap;
    }

    function perView() {
      const s = step();
      return s > 0 ? Math.max(1, Math.round(track.clientWidth / s)) : 1;
    }

    function pageCount() {
      return Math.max(1, cards.length - perView() + 1);
    }

    function buildDots() {
      if (!dotsWrap) return;
      const n = pageCount();
      if (dotsWrap.children.length === n) return;

      dotsWrap.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function() {
          track.scrollTo({ left: i * step(), behavior: 'smooth' });
          afterScroll();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function sync() {
      const max = track.scrollWidth - track.clientWidth;
      const x = track.scrollLeft;

      if (prevBtn) prevBtn.disabled = x <= 2;
      if (nextBtn) nextBtn.disabled = x >= max - 2;

      if (dotsWrap) {
        const idx = Math.round(x / (step() || 1));
        Array.prototype.forEach.call(dotsWrap.children, function(dot, i) {
          dot.classList.toggle('active', i === idx);
        });
      }
    }

    function afterScroll() {
      // Keep arrows/dots in sync promptly after a programmatic scroll,
      // not only via the (debounced) scroll event.
      window.clearTimeout(track._carouselSync);
      track._carouselSync = window.setTimeout(sync, 120);
      window.setTimeout(sync, 480);
    }

    function go(dir) {
      track.scrollBy({ left: dir * step(), behavior: 'smooth' });
      afterScroll();
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { go(1); });

    // Keyboard arrow support when the carousel region is focused
    track.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });

    let scrollTimer;
    track.addEventListener('scroll', function() {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(sync, 80);
    }, { passive: true });

    // Modern browsers fire scrollend when scrolling settles
    if ('onscrollend' in track) {
      track.addEventListener('scrollend', sync);
    }

    let resizeTimer;
    window.addEventListener('resize', function() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function() {
        buildDots();
        sync();
      }, 150);
    });

    buildDots();
    sync();
  });

  // =============================================
  // PREVENT CONSOLE LOGGING IN PRODUCTION
  // =============================================
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log = function() {};
    console.debug = function() {};
  }

  // =============================================
  // PERFORMANCE: PRELOAD CRITICAL IMAGES
  // =============================================
  const criticalImages = document.querySelectorAll('.hero img, .about-image img');
  criticalImages.forEach(function(img) {
    img.setAttribute('fetchpriority', 'high');
  });

})();