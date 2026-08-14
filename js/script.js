/* ==========================================================================
   SHUBHAM EVENTS PLANNER - INDIA EDITION
   External JavaScript (Pure DOM Logic, LocalStorage Auth & Event Bookings)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize LocalStorage Data Containers
  if (!localStorage.getItem('shubham_users')) {
    localStorage.setItem('shubham_users', JSON.stringify([]));
  }
  if (!localStorage.getItem('shubham_bookings')) {
    localStorage.setItem('shubham_bookings', JSON.stringify([]));
  }
  if (!localStorage.getItem('shubham_contacts')) {
    localStorage.setItem('shubham_contacts', JSON.stringify([]));
  }

  // Render Navbar State Based on Login Status
  renderNavbarState();

  // Route/Page Specific Handlers
  initHeroSlider();
  initSignupForm();
  initLoginForm();
  initProfilePage();
  initBookingForms();
  initContactForm();
  initBudgetEstimator();
});

/* --------------------------------------------------------------------------
   0. HERO FULLSCREEN AUTO SLIDER (3 SECONDS INTERVAL)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides || slides.length === 0) return;

  let currentSlide = 0;
  const slideInterval = 3000; // 3 seconds per slide

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, slideInterval);
}

/* --------------------------------------------------------------------------
   1. NAVBAR & AUTHENTICATION STATE
   -------------------------------------------------------------------------- */
function getCurrentUser() {
  const userJson = localStorage.getItem('shubham_current_user');
  return userJson ? JSON.parse(userJson) : null;
}

function renderNavbarState() {
  const currentUser = getCurrentUser();
  const authNavContainer = document.getElementById('authNavLinks');
  if (!authNavContainer) return;

  if (currentUser) {
    authNavContainer.innerHTML = `
      <li class="nav-item">
        <a class="nav-link text-gold" href="profile.html"><i class="ri-user-star-line"></i> ${currentUser.name.split(' ')[0]}'s Profile</a>
      </li>
      <li class="nav-item">
        <button class="btn btn-outline-gold btn-sm ms-2" id="navLogoutBtn">Logout</button>
      </li>
    `;
    const navLogoutBtn = document.getElementById('navLogoutBtn');
    if (navLogoutBtn) {
      navLogoutBtn.addEventListener('click', handleLogout);
    }
  } else {
    authNavContainer.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="login.html"><i class="ri-lock-line"></i> Login</a>
      </li>
      <li class="nav-item ms-lg-2">
        <a class="btn btn-gold btn-sm text-dark" href="signup.html">Register</a>
      </li>
    `;
  }
}

function handleLogout() {
  localStorage.removeItem('shubham_current_user');
  showToast('Logged out successfully!', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

/* --------------------------------------------------------------------------
   2. SIGNUP FUNCTIONALITY
   -------------------------------------------------------------------------- */
function initSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const phoneElem = document.getElementById('signupPhone');
    const phone = phoneElem ? phoneElem.value.trim() : '';
    const city = document.getElementById('signupCity').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'danger');
      return;
    }

    const privacyAgree = document.getElementById('signupPrivacyAgree');
    if (privacyAgree && !privacyAgree.checked) {
      showToast('Please agree to our Privacy Policy to register!', 'warning');
      return;
    }

    const users = JSON.parse(localStorage.getItem('shubham_users')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      showToast('An account with this email already exists!', 'danger');
      return;
    }

    const newUser = { name, email, phone, city, password, createdAt: new Date().toLocaleDateString() };
    users.push(newUser);
    localStorage.setItem('shubham_users', JSON.stringify(users));

    // Auto Login
    localStorage.setItem('shubham_current_user', JSON.stringify(newUser));
    showToast('Registration successful! Welcome to Shubham Events Planner.', 'success');

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   3. LOGIN FUNCTIONALITY
   -------------------------------------------------------------------------- */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('shubham_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      showToast('Invalid email or password!', 'danger');
      return;
    }

    localStorage.setItem('shubham_current_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`, 'success');

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   4. PROFILE PAGE MANAGEMENT
   -------------------------------------------------------------------------- */
function initProfilePage() {
  const profileSection = document.getElementById('profileSection');
  if (!profileSection) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Please log in to view your profile dashboard.', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
    return;
  }

  // Populate user data
  document.getElementById('profileNameDisplay').textContent = currentUser.name;
  document.getElementById('profileEmailDisplay').textContent = currentUser.email;
  document.getElementById('profilePhoneDisplay').textContent = currentUser.phone || 'Not provided';
  document.getElementById('profileCityDisplay').textContent = currentUser.city || 'India';

  // Fill Edit Form Fields
  document.getElementById('editName').value = currentUser.name;
  document.getElementById('editPhone').value = currentUser.phone || '';
  document.getElementById('editCity').value = currentUser.city || '';

  // Render Bookings List
  renderUserBookings(currentUser.email);

  // Profile Edit Submission
  const profileEditForm = document.getElementById('profileEditForm');
  if (profileEditForm) {
    profileEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedName = document.getElementById('editName').value.trim();
      const updatedPhone = document.getElementById('editPhone').value.trim();
      const updatedCity = document.getElementById('editCity').value.trim();

      currentUser.name = updatedName;
      currentUser.phone = updatedPhone;
      currentUser.city = updatedCity;

      // Update current user
      localStorage.setItem('shubham_current_user', JSON.stringify(currentUser));

      // Update users array
      const users = JSON.parse(localStorage.getItem('shubham_users')) || [];
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('shubham_users', JSON.stringify(users));
      }

      showToast('Profile updated successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    });
  }

  // Logout Button on Profile Page
  const profileLogoutBtn = document.getElementById('profileLogoutBtn');
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', handleLogout);
  }

  // Delete Account Confirmation Button Handler
  const confirmDeleteBtn = document.getElementById('confirmDeleteAccountBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', handleDeleteAccount);
  }
}

function handleDeleteAccount() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  // Remove user from registered users array
  const users = JSON.parse(localStorage.getItem('shubham_users')) || [];
  const updatedUsers = users.filter(u => u.email !== currentUser.email);
  localStorage.setItem('shubham_users', JSON.stringify(updatedUsers));

  // Remove associated bookings for this user
  const bookings = JSON.parse(localStorage.getItem('shubham_bookings')) || [];
  const updatedBookings = bookings.filter(b => b.userEmail !== currentUser.email);
  localStorage.setItem('shubham_bookings', JSON.stringify(updatedBookings));

  // Remove active session
  localStorage.removeItem('shubham_current_user');

  // Dismiss modal if open
  const modalEl = document.getElementById('deleteAccountModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
  }

  showToast('Your account and booking history have been permanently deleted.', 'danger');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

function renderUserBookings(userEmail) {
  const bookingListContainer = document.getElementById('userBookingsList');
  if (!bookingListContainer) return;

  const bookings = JSON.parse(localStorage.getItem('shubham_bookings')) || [];
  const myBookings = bookings.filter(b => b.userEmail === userEmail);

  if (myBookings.length === 0) {
    bookingListContainer.innerHTML = `
      <div class="text-center py-4">
        <i class="ri-calendar-event-line text-gold" style="font-size: 3rem;"></i>
        <p class="mt-2 text-muted">You have no active event bookings yet.</p>
        <a href="events.html" class="btn btn-gold btn-sm mt-2">Explore Event Packages</a>
      </div>
    `;
    return;
  }

  bookingListContainer.innerHTML = myBookings.map(b => `
    <div class="card custom-card mb-3 p-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <span class="badge bg-danger mb-1">${b.eventType}</span>
          <h5 class="mb-1 text-royal-red">${b.eventType} - ${b.city}</h5>
          <p class="mb-0 text-muted fs-7">
            <i class="ri-calendar-line"></i> Date: <strong>${b.date}</strong> | 
            <i class="ri-user-line"></i> Guests: <strong>${b.guests}</strong>
          </p>
        </div>
        <div class="text-end mt-2 mt-md-0">
          <span class="text-gold fw-bold fs-5">₹${Number(b.budget).toLocaleString('en-IN')}</span>
          <div><span class="badge bg-success mt-1">Confirmed</span></div>
        </div>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   5. BOOKING FORM HANDLERS
   -------------------------------------------------------------------------- */
function initBookingForms() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
      showToast('Please log in or signup before booking an event!', 'warning');
      setTimeout(() => window.location.href = 'login.html', 1200);
      return;
    }

    const eventType = document.getElementById('bookingEventType').value;
    const city = document.getElementById('bookingCity').value;
    const date = document.getElementById('bookingDate').value;
    const guests = document.getElementById('bookingGuests').value;
    const budget = document.getElementById('bookingBudget').value;

    const newBooking = {
      id: 'SE-' + Math.floor(100000 + Math.random() * 900000),
      userEmail: currentUser.email,
      userName: currentUser.name,
      eventType,
      city,
      date,
      guests,
      budget,
      status: 'Confirmed',
      timestamp: new Date().toLocaleString()
    };

    const bookings = JSON.parse(localStorage.getItem('shubham_bookings')) || [];
    bookings.push(newBooking);
    localStorage.setItem('shubham_bookings', JSON.stringify(bookings));

    showToast(`Booking submitted successfully! Order ID: ${newBooking.id}`, 'success');

    // Close Modal if using Bootstrap modal
    const modalEl = document.getElementById('bookingModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }

    bookingForm.reset();
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    const newContact = { name, email, phone, message, timestamp: new Date().toLocaleString() };
    const contacts = JSON.parse(localStorage.getItem('shubham_contacts')) || [];
    contacts.push(newContact);
    localStorage.setItem('shubham_contacts', JSON.stringify(contacts));

    showToast('Thank you! Your inquiry has been sent to Shubham Events team.', 'success');
    contactForm.reset();
  });
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE BUDGET ESTIMATOR
   -------------------------------------------------------------------------- */
function initBudgetEstimator() {
  const guestSlider = document.getElementById('calcGuestSlider');
  const guestDisplay = document.getElementById('calcGuestDisplay');
  const eventTypeSelect = document.getElementById('calcEventType');
  const outputPrice = document.getElementById('calcPriceOutput');

  if (!guestSlider || !outputPrice) return;

  const baseRates = {
    'Royal Wedding': 1500,
    'Sangeet & Mehendi': 800,
    'Haldi Celebration': 500,
    'Destination Wedding': 2500,
    'Corporate Gala': 1000
  };

  function updateEstimate() {
    const guests = parseInt(guestSlider.value, 10);
    if (guestDisplay) guestDisplay.textContent = `${guests} Guests`;

    const eventType = eventTypeSelect ? eventTypeSelect.value : 'Royal Wedding';
    const ratePerGuest = baseRates[eventType] || 1500;
    const totalEstimate = guests * ratePerGuest + 150000; // Venue setup base

    outputPrice.textContent = `₹${totalEstimate.toLocaleString('en-IN')}`;
  }

  guestSlider.addEventListener('input', updateEstimate);
  if (eventTypeSelect) eventTypeSelect.addEventListener('change', updateEstimate);

  updateEstimate();
}

/* --------------------------------------------------------------------------
   8. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container-custom');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container-custom';
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-${type} border-0 show shadow-lg mb-2`;
  toastEl.role = 'alert';
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body font-weight-bold">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.remove(), 400);
  }, 4000);
}
