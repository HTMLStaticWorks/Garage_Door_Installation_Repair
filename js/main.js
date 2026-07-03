// ProLift - Global JavaScript Module

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME TOGGLE
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> <span>Light</span>';
      }
    } else {
      document.body.classList.remove('dark');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> <span>Dark</span>';
      }
    }
  };

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  }

  // ==========================================
  // 2. RTL TOGGLE
  // ==========================================
  const rtlToggleBtn = document.getElementById('rtl-toggle');
  
  const applyRTL = (isRTL) => {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      if (rtlToggleBtn) {
        rtlToggleBtn.innerHTML = '<i class="fa-solid fa-globe"></i> <span>LTR</span>';
      }
    } else {
      document.documentElement.removeAttribute('dir');
      if (rtlToggleBtn) {
        rtlToggleBtn.innerHTML = '<i class="fa-solid fa-globe"></i> <span>RTL</span>';
      }
    }
  };

  // Load saved RTL preference
  const savedRTL = localStorage.getItem('rtl') === 'true';
  applyRTL(savedRTL);

  if (rtlToggleBtn) {
    rtlToggleBtn.addEventListener('click', () => {
      const isCurrentlyRTL = document.documentElement.getAttribute('dir') === 'rtl';
      const newRTL = !isCurrentlyRTL;
      localStorage.setItem('rtl', newRTL);
      applyRTL(newRTL);
    });
  }

  // ==========================================
  // 3. ACTIVE NAV LINK
  // ==========================================
  const highlightActiveNavLink = () => {
    const path = window.location.pathname;
    let page = path.split('/').pop();
    if (!page || page === '') {
      page = 'index.html';
    }

    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === page) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  highlightActiveNavLink();

  // ==========================================
  // 4. HAMBURGER MENU
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navbarMenu = document.getElementById('navbar-menu');

  if (hamburgerBtn && navbarMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navbarMenu.classList.toggle('open');
      const isOpen = navbarMenu.classList.contains('open');
      hamburgerBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !navbarMenu.contains(e.target)) {
        navbarMenu.classList.remove('open');
        hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // ==========================================
  // 5. ANIMATED COUNTERS
  // ==========================================
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2000; // 2 seconds
          const stepTime = Math.max(Math.floor(duration / target), 10);
          let current = 0;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target.toLocaleString() + (counter.getAttribute('data-suffix') || '');
              clearInterval(timer);
            } else {
              counter.textContent = current.toLocaleString() + (counter.getAttribute('data-suffix') || '');
            }
          }, stepTime);

          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ==========================================
  // 6. TESTIMONIAL SLIDER (index.html)
  // ==========================================
  const sliderTrack = document.getElementById('slider-track');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (sliderTrack && slides.length > 0) {
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
      if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
      const dots = document.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const goToSlide = (index) => {
      currentSlide = (index + slideCount) % slideCount;
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      // In RTL, the translation direction is inverted
      const offset = isRTL ? (currentSlide * 100) : -(currentSlide * 100);
      sliderTrack.style.transform = `translateX(${offset}%)`;
      updateDots();
    };

    const nextSlide = () => {
      goToSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      goToSlide(currentSlide - 1);
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    // Auto-advance
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    startAutoPlay();
  }

  // ==========================================
  // 7. TYPEWRITER EFFECT (home1.html)
  // ==========================================
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const textArray = [
      "Installed Right the First Time",
      "Spring Repairs in Under 2 Hours",
      "Trusted by 15,000+ Homeowners"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    const type = () => {
      const currentWord = textArray[wordIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 50;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        // Pause at full word
        typeDelay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % textArray.length;
        typeDelay = 500;
      }

      setTimeout(type, typeDelay);
    };

    setTimeout(type, 1000);
  }

  // ==========================================
  // 8. JOB TRACKER WIDGET (home1.html)
  // ==========================================
  const trackerList = document.getElementById('tracker-list');
  if (trackerList) {
    const techs = [
      { id: "T1", name: "Mike R.", status: "En Route", statusClass: "status-enroute", detail: "ETA 12 min", zone: "Zone 3" },
      { id: "T2", name: "Dave S.", status: "On Job", statusClass: "status-onjob", detail: "Zone 3", zone: "Zone 3" },
      { id: "T3", name: "Carla M.", status: "Available", statusClass: "status-available", detail: "Zone 1", zone: "Zone 1" }
    ];

    const techNames = ["Mike R.", "Dave S.", "Carla M.", "John L.", "Steve P.", "Janet H."];
    const statuses = [
      { text: "Available", class: "status-available", detail: "Zone 2" },
      { text: "En Route", class: "status-enroute", detail: "ETA 15 min" },
      { text: "On Job", class: "status-onjob", detail: "Zone 4" }
    ];

    const updateTracker = () => {
      // Pick a random tech and change their status
      const randomIndex = Math.floor(Math.random() * techs.length);
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      techs[randomIndex].status = randomStatus.text;
      techs[randomIndex].statusClass = randomStatus.class;
      if (randomStatus.text === "En Route") {
        techs[randomIndex].detail = `ETA ${Math.floor(Math.random() * 25) + 3} min`;
      } else {
        techs[randomIndex].detail = randomStatus.detail;
      }

      // Re-render
      trackerList.innerHTML = '';
      techs.forEach(t => {
        const item = document.createElement('div');
        item.className = 'tracker-item';
        item.innerHTML = `
          <div class="tech-info">
            <div class="tech-avatar">${t.id}</div>
            <div class="tech-details">
              <h4>Tech #${t.id} — ${t.name}</h4>
              <p>${t.detail}</p>
            </div>
          </div>
          <span class="status-badge ${t.statusClass}">${t.status}</span>
        `;
        trackerList.appendChild(item);
      });
    };

    // Initial render
    updateTracker();
    // Set Interval
    setInterval(updateTracker, 4000);
  }

  // ==========================================
  // 9. PRICING TOGGLE (pricing.html)
  // ==========================================
  const pricingCheckbox = document.getElementById('pricing-checkbox');
  const priceLabels = document.querySelectorAll('.pricing-price-val');
  const periodLabels = document.querySelectorAll('.pricing-period');
  const switchLabelOneTime = document.getElementById('switch-one-time');
  const switchLabelMembership = document.getElementById('switch-membership');

  if (pricingCheckbox) {
    const plans = {
      oneTime: [
        { price: "$79", period: "/visit" },
        { price: "$149", period: "/visit" },
        { price: "$249", period: "/visit" }
      ],
      membership: [
        { price: "$19", period: "/mo" },
        { price: "$119", period: "/mo" }, // 20% off from 149 rounded
        { price: "$199", period: "/mo" }  // 20% off from 249 rounded
      ]
    };

    const updatePrices = (isMembership) => {
      const currentPlan = isMembership ? plans.membership : plans.oneTime;
      priceLabels.forEach((label, index) => {
        if (currentPlan[index]) {
          label.textContent = currentPlan[index].price;
        }
      });
      periodLabels.forEach((label, index) => {
        if (currentPlan[index]) {
          label.textContent = currentPlan[index].period;
        }
      });

      if (isMembership) {
        if (switchLabelMembership) switchLabelMembership.classList.add('active');
        if (switchLabelOneTime) switchLabelOneTime.classList.remove('active');
      } else {
        if (switchLabelOneTime) switchLabelOneTime.classList.add('active');
        if (switchLabelMembership) switchLabelMembership.classList.remove('active');
      }
    };

    pricingCheckbox.addEventListener('change', () => {
      updatePrices(pricingCheckbox.checked);
    });

    if (switchLabelOneTime) {
      switchLabelOneTime.addEventListener('click', () => {
        pricingCheckbox.checked = false;
        updatePrices(false);
      });
    }

    if (switchLabelMembership) {
      switchLabelMembership.addEventListener('click', () => {
        pricingCheckbox.checked = true;
        updatePrices(true);
      });
    }

    // Init
    updatePrices(false);
  }

  // ==========================================
  // 10. FAQ ACCORDION (services.html, pricing.html)
  // ==========================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const isActive = parent.classList.contains('active');
      
      // Close all other accordions
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  // ==========================================
  // 11. SIGN UP VALIDATION & PASSWORD METER (signup.html)
  // ==========================================
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    const fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      password: document.getElementById('password'),
      confirmPassword: document.getElementById('confirm-password')
    };

    const validators = {
      name: (val) => val.trim().length >= 3,
      email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      phone: (val) => /^\d{10}$/.test(val.replace(/\D/g, '')), // Matches exactly 10 digits
      password: (val) => val.length >= 8,
      confirmPassword: (val) => val === fields.password.value && val !== ""
    };

    const validateField = (fieldKey) => {
      const input = fields[fieldKey];
      const isValid = validators[fieldKey](input.value);
      if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
      } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
      }
      return isValid;
    };

    // Set real-time listeners
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        fields[key].addEventListener('input', () => {
          validateField(key);
          if (key === 'password') {
            checkPasswordStrength(fields.password.value);
            // Re-validate confirm if user changes password
            if (fields.confirmPassword.value !== "") {
              validateField('confirm-password');
            }
          }
        });
      }
    });

    // Password strength meter
    const strengthBar = document.getElementById('strength-bar');
    const checkPasswordStrength = (pwd) => {
      if (!strengthBar) return;
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;

      if (pwd.length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#e74c3c';
      } else if (score <= 1) {
        strengthBar.style.width = '25%';
        strengthBar.style.backgroundColor = '#e74c3c'; // Weak - Red
      } else if (score === 2) {
        strengthBar.style.width = '50%';
        strengthBar.style.backgroundColor = '#f1c40f'; // Fair - Yellow/Orange
      } else if (score === 3) {
        strengthBar.style.width = '75%';
        strengthBar.style.backgroundColor = '#3498db'; // Strong - Blue
      } else if (score === 4) {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#2ecc71'; // Very Strong - Green
      }
    };

    // Form submit blocker
    signupForm.addEventListener('submit', (e) => {
      let isFormValid = true;
      Object.keys(fields).forEach(key => {
        const isFieldValid = validateField(key);
        if (!isFieldValid) isFormValid = false;
      });

      if (!isFormValid) {
        e.preventDefault();
        alert('Please fill out all fields correctly before continuing.');
      } else {
        alert('Registration successful!');
      }
    });
  }

  // ==========================================
  // 11b. LOGIN VALIDATION (login.html)
  // ==========================================
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const emailField = document.getElementById('login-email');
    const passwordField = document.getElementById('login-password');

    const validateEmail = () => {
      const val = emailField.value;
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (isValid) {
        emailField.classList.remove('invalid');
        emailField.classList.add('valid');
      } else {
        emailField.classList.remove('valid');
        emailField.classList.add('invalid');
      }
      return isValid;
    };

    const validatePassword = () => {
      const val = passwordField.value;
      const isValid = val.length >= 8;
      if (isValid) {
        passwordField.classList.remove('invalid');
        passwordField.classList.add('valid');
      } else {
        passwordField.classList.remove('valid');
        passwordField.classList.add('invalid');
      }
      return isValid;
    };

    emailField.addEventListener('input', validateEmail);
    passwordField.addEventListener('input', validatePassword);

    loginForm.addEventListener('submit', (e) => {
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (!isEmailValid || !isPasswordValid) {
        e.preventDefault();
        alert('Please enter a valid email and password (minimum 8 characters).');
      } else {
        e.preventDefault();
        // Redirect directly to dashboard
        window.location.href = 'dashboard.html';
      }
    });
  }


  // ==========================================
  // 13. DASHBOARD CLOCK (dashboard.html)
  // ==========================================
  const dbClock = document.getElementById('db-clock');
  const dbDate = document.getElementById('db-date');
  if (dbClock && dbDate) {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // convert 0 to 12
      const formattedHours = String(hours).padStart(2, '0');

      dbClock.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dbDate.textContent = now.toLocaleDateString(undefined, options);
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // ==========================================
  // 14. SCROLL ANIMATIONS & STAGGER GRIDS
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
  
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.classList.contains('show')) return; // Already animated

          const parent = el.parentElement;
          if (parent && parent.classList.contains('stagger-grid')) {
            // Find all animatable siblings in the same grid
            const siblings = Array.from(parent.children).filter(child => 
              child.classList.contains('fade-in') || 
              child.classList.contains('fade-in-up') || 
              child.classList.contains('fade-in-left') || 
              child.classList.contains('fade-in-right') || 
              child.classList.contains('scale-in')
            );
            
            // Stagger animation trigger
            siblings.forEach((sib, index) => {
              if (!sib.classList.contains('show')) {
                setTimeout(() => {
                  sib.classList.add('show');
                }, index * 120); // 120ms stagger delay
              }
              fadeObserver.unobserve(sib);
            });
          } else {
            el.classList.add('show');
            fadeObserver.unobserve(el);
          }
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    // Initial check: filter out hero animations so they don't wait for scroll
    fadeElements.forEach(el => {
      // If it's inside a header/hero or top panel, animate it on page load
      const isHeroElement = el.closest('header') || el.closest('.split-hero-left') || el.closest('.split-hero-right');
      if (isHeroElement) {
        setTimeout(() => {
          el.classList.add('show');
        }, 150);
      } else if (!el.classList.contains('show')) {
        fadeObserver.observe(el);
      }
    });
  }

  // ==========================================
  // 15. BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backToTopBtn);

  const toggleBackToTopBtn = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        toggleBackToTopBtn();
        scrollTimeout = null;
      }, 100);
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // 15. DASHBOARD SIDEBAR SCROLL SPY & CLICK NAVIGATION
  // ==========================================
  const dbSidebarNav = document.querySelector('.db-sidebar-nav');
  if (dbSidebarNav) {
    const navItems = dbSidebarNav.querySelectorAll('.db-nav-item');
    const sections = document.querySelectorAll('#db-overview, #db-jobs, #db-analytics, #db-log');
    
    // Smooth scrolling when clicking sidebar links
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('href');
        if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            // Remove active from all and set on clicked
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Scroll to the element, account for header height if header is fixed/sticky on mobile
            const headerOffset = window.innerWidth <= 992 ? 80 : 20;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Scroll Spy: Update active link as user scrolls
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px' // Triggers active highlight when section is in the middle of the viewport
    });

    sections.forEach(section => spyObserver.observe(section));

    // Mobile/Tablet Hamburger Toggle
    const dbHamburgerBtn = document.getElementById('db-hamburger-btn');
    const dbSidebar = document.querySelector('.db-sidebar');
    const dbOverlay = document.getElementById('db-overlay');

    if (dbHamburgerBtn && dbSidebar && dbOverlay) {
      const toggleSidebar = (e) => {
        if (e) e.stopPropagation();
        dbSidebar.classList.toggle('open');
        dbOverlay.classList.toggle('active');
        const isOpen = dbSidebar.classList.contains('open');
        dbHamburgerBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      };

      dbHamburgerBtn.addEventListener('click', toggleSidebar);
      dbOverlay.addEventListener('click', toggleSidebar);

      // Close sidebar when clicking links on mobile
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= 992) {
            dbSidebar.classList.remove('open');
            dbOverlay.classList.remove('active');
            dbHamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
          }
        });
      });
    }
  }

  // ==========================================
  // 16. INTERACTIVE DIAGNOSTIC CENTER TAB CONTROLS
  // ==========================================
  const diagTabBtns = document.querySelectorAll('.diag-tab-btn');
  const diagDetailCards = document.querySelectorAll('.diag-detail-card');

  if (diagTabBtns.length > 0 && diagDetailCards.length > 0) {
    diagTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        // Deactivate all buttons
        diagTabBtns.forEach(b => b.classList.remove('active'));
        // Deactivate all cards
        diagDetailCards.forEach(c => c.classList.remove('active'));

        // Activate clicked button
        btn.classList.add('active');
        // Activate corresponding card
        const targetCard = document.getElementById(`diag-card-${target}`);
        if (targetCard) {
          targetCard.classList.add('active');
        }
      });
    });
  }
});


