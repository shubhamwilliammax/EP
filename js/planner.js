/* ==========================================================================
   INTERACTIVE COST ESTIMATOR MODULE
   Dynamic Wedding & Event Budget Calculator
   ========================================================================== */

export function initCostEstimator() {
  const guestSlider = document.getElementById('guestSlider');
  const guestDisplay = document.getElementById('guestDisplay');
  const venueTypeSelect = document.getElementById('venueTypeSelect');
  const decorStyleSelect = document.getElementById('decorStyleSelect');
  const cateringStyleSelect = document.getElementById('cateringStyleSelect');
  const estimatedPriceValue = document.getElementById('estimatedPriceValue');

  if (!guestSlider || !estimatedPriceValue) return;

  // Base calculation parameters
  const venueBaseCosts = {
    palace: 45000,
    vineyard: 30000,
    beachfront: 35000,
    ballroom: 25000
  };

  const decorMultiplier = {
    opulent: 1.8,
    minimalist: 1.2,
    custom: 2.2
  };

  const cateringCostPerGuest = {
    haute: 250,
    michelin: 400,
    royal: 600
  };

  function calculateEstimate() {
    const guestCount = parseInt(guestSlider.value, 10);
    if (guestDisplay) guestDisplay.textContent = `${guestCount} Guests`;

    const venue = venueTypeSelect ? venueTypeSelect.value : 'palace';
    const decor = decorStyleSelect ? decorStyleSelect.value : 'opulent';
    const catering = cateringStyleSelect ? cateringStyleSelect.value : 'michelin';

    const baseVenue = venueBaseCosts[venue] || 35000;
    const decorMult = decorMultiplier[decor] || 1.5;
    const cateringTotal = (cateringCostPerGuest[catering] || 350) * guestCount;

    const rawTotal = (baseVenue + cateringTotal) * decorMult;
    const roundedTotal = Math.round(rawTotal / 1000) * 1000;

    // Animate Price Number Transition
    animateValue(estimatedPriceValue, getCurrentPriceNumber(estimatedPriceValue.textContent), roundedTotal, 600);
  }

  function getCurrentPriceNumber(str) {
    const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 50000 : num;
  }

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      obj.textContent = `$${current.toLocaleString()}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Event Listeners
  guestSlider.addEventListener('input', calculateEstimate);
  if (venueTypeSelect) venueTypeSelect.addEventListener('change', calculateEstimate);
  if (decorStyleSelect) decorStyleSelect.addEventListener('change', calculateEstimate);
  if (cateringStyleSelect) cateringStyleSelect.addEventListener('change', calculateEstimate);

  // Initial calculation
  calculateEstimate();
}
