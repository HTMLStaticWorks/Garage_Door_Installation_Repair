// ProLift Garage Doors - Global JavaScript Module

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
    hamburgerBtn.addEventListener('click', () => {
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
  // 14. SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }
});
