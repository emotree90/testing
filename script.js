const hotels = [
  {
    name: 'Aria Grand Kyoto',
    city: 'Kyoto, Japan',
    destination: 'kyoto',
    price: 189,
    rating: 4.9,
    guests: 2,
    tags: ['Spa', 'Breakfast', 'River view'],
    image:
      'https://images.unsplash.com/photo-1501117716987-c8e2a0b9d1d0?auto=format&fit=crop&w=1200&q=80',
    summary: 'Riverside rooms with private spa access and a quiet central location.',
  },
  {
    name: 'Saffron Harbor Hotel',
    city: 'Barcelona, Spain',
    destination: 'barcelona',
    price: 224,
    rating: 4.8,
    guests: 3,
    tags: ['Terrace', 'Pool', 'City center'],
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    summary: 'A bright coastal stay with a rooftop terrace and easy metro access.',
  },
  {
    name: 'Luma Atlas Suites',
    city: 'Lisbon, Portugal',
    destination: 'lisbon',
    price: 159,
    rating: 4.7,
    guests: 2,
    tags: ['Breakfast', 'Co-work', 'Old town'],
    image:
      'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80',
    summary: 'Minimalist suites designed for long weekends and work trips alike.',
  },
  {
    name: 'Marina Sol Resort',
    city: 'Bali, Indonesia',
    destination: 'bali',
    price: 301,
    rating: 4.9,
    guests: 4,
    tags: ['Beach', 'Villa', 'Airport transfer'],
    image:
      'https://images.unsplash.com/photo-1505232070786-2d2fbc0f9f43?auto=format&fit=crop&w=1200&q=80',
    summary: 'Private villas surrounded by tropical gardens and ocean views.',
  },
  {
    name: 'Northline Atelier',
    city: 'Reykjavik, Iceland',
    destination: 'reykjavik',
    price: 274,
    rating: 4.8,
    guests: 2,
    tags: ['Aurora tour', 'Sauna', 'Design stay'],
    image:
      'https://images.unsplash.com/photo-1502920917128-1aa500764ce7?auto=format&fit=crop&w=1200&q=80',
    summary: 'A stylish base for northern lights nights and coastal day trips.',
  },
  {
    name: 'Citrine Skyline Hotel',
    city: 'Dubai, UAE',
    destination: 'dubai',
    price: 358,
    rating: 4.9,
    guests: 4,
    tags: ['Skyline', 'Rooftop', 'Late checkout'],
    image:
      'https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=1200&q=80',
    summary: 'High-floor rooms, panoramic dining, and an infinity pool overlook.',
  },
];

const state = {
  selectedHotel: hotels[0],
};

const hotelGrid = document.getElementById('hotel-grid');
const searchForm = document.getElementById('search-form');
const resultCount = document.getElementById('result-count');
const summaryName = document.getElementById('summary-name');
const summaryLocation = document.getElementById('summary-location');
const summaryNights = document.getElementById('summary-nights');
const summaryGuests = document.getElementById('summary-guests');
const summaryTotal = document.getElementById('summary-total');
const summaryHero = document.querySelector('.summary-hero');
const bookButton = document.getElementById('book-button');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const guestSelect = document.getElementById('guests');
const destinationInput = document.getElementById('destination');
const budgetSelect = document.getElementById('budget');

const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function defaultDates() {
  const today = new Date();
  const checkin = new Date(today);
  checkin.setDate(today.getDate() + 7);
  const checkout = new Date(checkin);
  checkout.setDate(checkin.getDate() + 2);
  return {
    checkin: formatDateForInput(checkin),
    checkout: formatDateForInput(checkout),
  };
}

function formatDateForInput(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateNights() {
  const checkin = parseDate(checkinInput.value);
  const checkout = parseDate(checkoutInput.value);
  if (!checkin || !checkout || checkout <= checkin) {
    return 2;
  }
  const diff = checkout.getTime() - checkin.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function matchesBudget(price, budget) {
  if (budget === 'any') {
    return true;
  }
  if (budget === 'under200') {
    return price < 200;
  }
  if (budget === '200to350') {
    return price >= 200 && price <= 350;
  }
  return price > 350;
}

function renderHotels(filteredHotels) {
  hotelGrid.innerHTML = '';

  if (!filteredHotels.length) {
    hotelGrid.innerHTML = `
      <div class="empty-state">
        <h3>No hotels match your search.</h3>
        <p>Try a different destination or relax the budget filter.</p>
      </div>
    `;
    return;
  }

  filteredHotels.forEach((hotel) => {
    const card = document.createElement('article');
    card.className = 'hotel-card';
    card.innerHTML = `
      <div class="hotel-media">
        <div class="hotel-image" style="background-image: linear-gradient(180deg, rgba(17, 22, 32, 0.12), rgba(17, 22, 32, 0.35)), url('${hotel.image}')"></div>
        <div class="hotel-meta">
          <span class="rating">★ ${hotel.rating}</span>
          <span class="location">${hotel.city}</span>
        </div>
      </div>
      <div class="hotel-body">
        <div>
          <div class="hotel-tags">
            ${hotel.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <h3>${hotel.name}</h3>
          <p>${hotel.summary}</p>
        </div>
        <div class="hotel-footer">
          <div class="price">
            <strong>${numberFormatter.format(hotel.price)}</strong>
            <span>per night · up to ${hotel.guests} guests</span>
          </div>
          <button class="button button-secondary hotel-action" type="button" data-hotel="${hotel.destination}">Book now</button>
        </div>
      </div>
    `;
    hotelGrid.appendChild(card);
  });

  hotelGrid.querySelectorAll('[data-hotel]').forEach((button) => {
    button.addEventListener('click', () => {
      const hotel = hotels.find((item) => item.destination === button.dataset.hotel);
      if (hotel) {
        selectHotel(hotel);
      }
    });
  });
}

function updateSummary() {
  const nights = calculateNights();
  const guests = Number(guestSelect.value);
  const total = state.selectedHotel.price * nights;

  summaryName.textContent = state.selectedHotel.name;
  summaryLocation.textContent = state.selectedHotel.city;
  summaryNights.textContent = String(nights);
  summaryGuests.textContent = String(guests);
  summaryTotal.textContent = numberFormatter.format(total);
  summaryHero.style.backgroundImage = `linear-gradient(180deg, rgba(17, 22, 32, 0.15), rgba(17, 22, 32, 0.35)), url('${state.selectedHotel.image}')`;
}

function selectHotel(hotel) {
  state.selectedHotel = hotel;
  updateSummary();
  const summarySection = document.querySelector('.booking-summary');
  summarySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function filterHotels(event) {
  if (event) {
    event.preventDefault();
  }

  const destination = destinationInput.value.trim().toLowerCase();
  const guests = Number(guestSelect.value);
  const budget = budgetSelect.value;

  const filtered = hotels.filter((hotel) => {
    const destinationMatches = !destination || hotel.name.toLowerCase().includes(destination) || hotel.city.toLowerCase().includes(destination) || hotel.destination.includes(destination);
    const guestsMatches = hotel.guests >= guests;
    const budgetMatches = matchesBudget(hotel.price, budget);
    return destinationMatches && guestsMatches && budgetMatches;
  });

  resultCount.textContent = `${filtered.length} stay${filtered.length === 1 ? '' : 's'} available`;
  renderHotels(filtered);
}

function syncDatesOnLoad() {
  const { checkin, checkout } = defaultDates();
  checkinInput.value = checkin;
  checkoutInput.value = checkout;
}

searchForm.addEventListener('submit', filterHotels);
checkinInput.addEventListener('change', updateSummary);
checkoutInput.addEventListener('change', updateSummary);
guestSelect.addEventListener('change', updateSummary);
destinationInput.addEventListener('input', () => {
  if (destinationInput.value.length === 0) {
    filterHotels();
  }
});
budgetSelect.addEventListener('change', filterHotels);
bookButton.addEventListener('click', () => {
  alert(`Reserved ${state.selectedHotel.name} for a ${calculateNights()} night stay.`);
});

syncDatesOnLoad();
renderHotels(hotels);
updateSummary();
