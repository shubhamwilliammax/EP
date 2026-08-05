/* ==========================================================================
   VIP CONSULTATION BOOKING & TOAST MODULE
   ========================================================================== */

export function initBookingModal() {
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('bookingForm');

  if (!bookingModal) return;

  // Open Modal logic
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Modal logic
  const closeModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });

  // Form Submit Handler
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('bookingName');
      const emailInput = document.getElementById('bookingEmail');
      const eventTypeInput = document.getElementById('bookingEventType');

      if (!nameInput.value || !emailInput.value) {
        showToast('Please fill in all required fields.', 'warning');
        return;
      }

      // Simulate sending consultation request
      showToast(`Thank you, ${nameInput.value}! Your VIP Consultation request has been received. Our luxury director will reach out within 24 hours.`, 'success');
      bookingForm.reset();
      closeModal();
    });
  }
}

export function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconClass = type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill';
  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div>
      <h5 style="margin-bottom:0.2rem; color:var(--clr-gold-primary); font-family:var(--ff-subheading); text-transform:uppercase; letter-spacing:0.1em;">${type.toUpperCase()}</h5>
      <p style="font-size:0.9rem; color:var(--clr-text-primary); margin:0;">${message}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
