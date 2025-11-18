// ==========================================
// Above Architects - Enhanced JavaScript
// ==========================================

(function () {
  'use strict';

  // ==========================================
  // 1. PAGE LOADER
  // ==========================================
  window.addEventListener('load', function () {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
      }, 800);
    }
  });

  // ==========================================
  // 2. SMOOTH SCROLL WITH OFFSET
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ==========================================
  // 3. NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 100) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

    // Hide navbar on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // Smooth navbar transition
  if (navbar) {
    navbar.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  }

  // ==========================================
  // 4. MOBILE MENU ENHANCEMENTS
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');

      // Animate icon
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isHidden ? 'hidden' : 'visible';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        document.body.style.overflow = 'visible';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target) &&
        !mobileMenu.classList.contains('hidden')
      ) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        document.body.style.overflow = 'visible';
      }
    });
  }

  // ==========================================
  // 5. IMAGE LAZY LOADING WITH INTERSECTION OBSERVER
  // ==========================================
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
          }
          img.classList.add('revealed');
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px',
    }
  );

  document.querySelectorAll('.image-reveal').forEach((img) => {
    imageObserver.observe(img);
  });

  // ==========================================
  // 6. FORM VALIDATION & ENHANCEMENT
  // ==========================================
  const forms = document.querySelectorAll('form');

  forms.forEach((form) => {
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
      // Real-time validation
      input.addEventListener('blur', () => {
        validateInput(input);
      });

      // Remove error on input
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          input.classList.remove('error');
          const errorMsg = input.parentElement.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      let isValid = true;

      inputs.forEach((input) => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Show success animation
        showFormSuccess(form);
      }
    });
  });

  function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');

    // Remove previous error
    input.classList.remove('error');
    const oldError = input.parentElement.querySelector('.error-message');
    if (oldError) oldError.remove();

    if (required && !value) {
      showError(input, 'This field is required');
      return false;
    }

    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
      }
    }

    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 10) {
        showError(input, 'Please enter a valid phone number');
        return false;
      }
    }

    return true;
  }

  function showError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  }

  function showFormSuccess(form) {
    const successMsg = document.createElement('div');
    successMsg.className =
      'fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in';
    successMsg.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-check-circle text-2xl"></i>
        <div>
          <p class="font-semibold">Message Sent!</p>
          <p class="text-sm opacity-90">We'll get back to you soon.</p>
        </div>
      </div>
    `;
    document.body.appendChild(successMsg);

    setTimeout(() => {
      successMsg.style.animation = 'slide-out 0.3s ease';
      setTimeout(() => successMsg.remove(), 300);
    }, 3000);
  }

  // ==========================================
  // 7. SCROLL PROGRESS INDICATOR
  // ==========================================
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #d4633f, #f39c12);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  });

  // ==========================================
  // 8. ANIMATE NUMBERS ON SCROLL (Stats Section)
  // ==========================================
  const animateNumbers = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.textContent.replace(/,/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            element.textContent = Math.floor(current).toLocaleString();
          }
        }, 16);

        observer.unobserve(element);
      }
    });
  };

  const numberObserver = new IntersectionObserver(animateNumbers, {
    threshold: 0.5,
  });

  document.querySelectorAll('[data-count]').forEach((el) => {
    el.setAttribute('data-count', el.textContent);
    numberObserver.observe(el);
  });

  // ==========================================
  // 9. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className =
    'back-to-top fixed bottom-20 right-4 sm:bottom-24 sm:right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl opacity-0 invisible transition-all duration-300 z-30 hover:bg-accent';
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // 10. PROJECT FILTER (if on projects page)
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach((b) => {
          b.classList.remove('active', 'bg-accent', 'text-white');
          b.classList.add('bg-white', 'text-primary');
        });
        btn.classList.add('active', 'bg-accent', 'text-white');
        btn.classList.remove('bg-white', 'text-primary');

        // Filter projects
        const filter = btn.getAttribute('data-filter');
        const projects = document.querySelectorAll('.project-item');

        projects.forEach((project) => {
          if (filter === 'all' || project.classList.contains(filter)) {
            project.style.display = 'block';
            project.style.animation = 'fadeIn 0.5s ease';
          } else {
            project.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================
  // 11. PARALLAX EFFECT
  // ==========================================
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  if (parallaxElements.length > 0 && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      parallaxElements.forEach((element) => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        element.style.transform = `translate3d(0, ${rate}px, 0)`;
      });
    });
  }

  // ==========================================
  // 12. TYPING EFFECT (Hero Section)
  // ==========================================
  const typingElement = document.querySelector('[data-typing]');
  if (typingElement) {
    const text = typingElement.textContent;
    typingElement.textContent = '';
    let index = 0;

    const typeWriter = () => {
      if (index < text.length) {
        typingElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 50);
      }
    };

    setTimeout(typeWriter, 500);
  }

  // ==========================================
  // 13. COPY TO CLIPBOARD
  // ==========================================
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });

  // ==========================================
  // 14. PERFORMANCE OPTIMIZATION
  // ==========================================
  // Debounce function for scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==========================================
  // 15. ACCESSIBILITY ENHANCEMENTS
  // ==========================================
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.querySelector('i').classList.add('fa-bars');
      mobileMenuBtn.querySelector('i').classList.remove('fa-times');
      document.body.style.overflow = 'visible';
    }
  });

  // Focus trap for mobile menu
  if (mobileMenu) {
    const focusableElements = mobileMenu.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // ==========================================
  // 16. CONSOLE BRANDING
  // ==========================================
  console.log(
    '%c🏛️ Above Architects',
    'font-size: 24px; font-weight: bold; color: #d4633f; font-family: Playfair Display, serif;'
  );
  console.log(
    '%cWebsite designed and developed with ❤️',
    'font-size: 12px; color: #2c3e50;'
  );
  console.log(
    '%c💼 Contact: abovearchitects@gmail.com',
    'font-size: 12px; color: #8b9d83;'
  );
})();
