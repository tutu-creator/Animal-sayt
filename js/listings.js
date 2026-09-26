/**
 * ==========================================================================
 * [SAYT ADI] - Elanlar Siyahısı Modulu (listings.html)
 * Filterləmə, axtarış, çeşidləmə və dinamik kartların render edilməsi
 * ==========================================================================
 */

let allLoadedListings = [];
let currentFilterState = {
  type: 'all',
  animalType: 'all',
  search: '',
  sort: 'newest'
};

const ITEMS_PER_PAGE = 6;
let visibleCount = ITEMS_PER_PAGE;

document.addEventListener('DOMContentLoaded', () => {
  initUrlParams();
  initFilterControls();
  loadAndRenderListings();
});

/**
 * URL-dən ilkin parametrləri oxumaq (məsələn: listings.html?type=lost)
 */
function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const animalParam = params.get('animalType');

  if (typeParam) currentFilterState.type = typeParam;
  if (animalParam) currentFilterState.animalType = animalParam;
}

/**
 * Filter elementlərinə listener-lərin qoyulması
 */
function initFilterControls() {
  const typePills = document.querySelectorAll('.filter-pill[data-type]');
  const animalSelect = document.querySelector('#filter-animal-type');
  const searchInput = document.querySelector('#filter-search-input');
  const sortSelect = document.querySelector('#filter-sort-select');
  const resetBtn = document.querySelector('#btn-reset-filters');
  const loadMoreBtn = document.querySelector('#btn-load-more');

  // Aktiv pill-i təyin et
  typePills.forEach(pill => {
    if (pill.dataset.type === currentFilterState.type) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }

    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilterState.type = pill.dataset.type;
      visibleCount = ITEMS_PER_PAGE;
      loadAndRenderListings();
    });
  });

  // Heyvan növü seçimi
  if (animalSelect) {
    if (currentFilterState.animalType !== 'all') {
      animalSelect.value = currentFilterState.animalType;
    }
    animalSelect.addEventListener('change', () => {
      currentFilterState.animalType = animalSelect.value;
      visibleCount = ITEMS_PER_PAGE;
      loadAndRenderListings();
    });
  }

  // Axtarış sahəsi (Debounce ilə)
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentFilterState.search = e.target.value;
        visibleCount = ITEMS_PER_PAGE;
        loadAndRenderListings();
      }, 300);
    });
  }

  // Çeşidləmə
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentFilterState.sort = sortSelect.value;
      loadAndRenderListings();
    });
  }

  // Filterləri sıfırla düyməsi
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }

  // Daha çox yüklə
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += ITEMS_PER_PAGE;
      renderListingsGrid(allLoadedListings);
    });
  }
}

function resetAllFilters() {
  currentFilterState = {
    type: 'all',
    animalType: 'all',
    search: '',
    sort: 'newest'
  };

  const searchInput = document.querySelector('#filter-search-input');
  if (searchInput) searchInput.value = '';

  const animalSelect = document.querySelector('#filter-animal-type');
  if (animalSelect) animalSelect.value = 'all';

  const sortSelect = document.querySelector('#filter-sort-select');
  if (sortSelect) sortSelect.value = 'newest';

  const typePills = document.querySelectorAll('.filter-pill[data-type]');
  typePills.forEach(p => {
    p.classList.toggle('active', p.dataset.type === 'all');
  });

  visibleCount = ITEMS_PER_PAGE;
  loadAndRenderListings();
}

/**
 * API-dən elanları çəkib render etmək
 */
async function loadAndRenderListings() {
  const gridContainer = document.querySelector('#listings-container');
  const emptyContainer = document.querySelector('#empty-state-container');
  const countEl = document.querySelector('#listings-total-count');
  const loadMoreBtn = document.querySelector('#btn-load-more');

  if (!gridContainer) return;

  // Yüklənmə skeleti göstər
  gridContainer.innerHTML = Array(3).fill('<div class="skeleton-card"></div>').join('');
  if (emptyContainer) emptyContainer.style.display = 'none';
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';

  try {
    const data = await API.fetchListings(currentFilterState);
    allLoadedListings = data || [];

    if (countEl) {
      countEl.textContent = allLoadedListings.length;
    }

    if (allLoadedListings.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyContainer) emptyContainer.style.display = 'block';
      return;
    }

    renderListingsGrid(allLoadedListings);

  } catch (error) {
    console.error("Elanlar gətirilərkən xəta:", error);
    gridContainer.innerHTML = `<div style="text-align:center;padding:40px;grid-column:1/-1;">Elanlar yüklənərkən xəta baş verdi.</div>`;
  }
}

/**
 * Kartları DOM-a yerləşdirmək
 */
function renderListingsGrid(listings) {
  const gridContainer = document.querySelector('#listings-container');
  const loadMoreBtn = document.querySelector('#btn-load-more');
  const countDisplay = document.querySelector('#visible-count-text');

  if (!gridContainer) return;

  const slice = listings.slice(0, visibleCount);

  gridContainer.innerHTML = slice.map(item => createListingCardHtml(item)).join('');

  if (loadMoreBtn) {
    if (visibleCount < listings.length) {
      loadMoreBtn.style.display = 'inline-flex';
      if (countDisplay) {
        countDisplay.textContent = `Göstərilir: ${slice.length} / ${listings.length} elan`;
      }
    } else {
      loadMoreBtn.style.display = 'none';
      if (countDisplay) {
        countDisplay.textContent = `Bütün ${listings.length} elan göstərildi`;
      }
    }
  }
}

/**
 * Tək bir elan kartının HTML şablonu
 */
function createListingCardHtml(item) {
  const imgUrl = (item.imageUrls && item.imageUrls[0]) ? item.imageUrls[0] : 'images/hero-pets.jpg';
  const typeBadge = window.getTypeBadge(item.type);
  const animalBadge = window.getAnimalBadge(item.animalType);
  const timeFormatted = window.formatRelativeTime(item.createdAt);
  const address = item.location && item.location.address ? item.location.address : 'Bakı';

  let title = item.title || 'Heyvan haqqında elan';
  if (item.type === 'lost' && item.petName) {
    title = `İtkin: ${item.petName} (${title})`;
  }

  return `
    <article class="listing-card" data-id="${item.id}">
      <div class="listing-card-media">
        <img src="${imgUrl}" alt="${title}" loading="lazy" onerror="this.src='images/hero-pets.jpg'">
        <div class="card-badges-top">
          ${typeBadge}
          ${animalBadge}
        </div>
      </div>
      <div class="listing-card-body">
        <div class="card-meta-row">
          <span><i class="fa-regular fa-clock"></i> ${timeFormatted}</span>
          <span>#${item.id}</span>
        </div>
        <h3 class="listing-card-title" title="${title}">${title}</h3>
        <p class="listing-card-desc">${item.description || 'Əlavə qeyd yoxdur.'}</p>
        <div class="listing-card-location">
          <i class="fa-solid fa-location-dot"></i>
          <span title="${address}">${address}</span>
        </div>
        <div class="listing-card-footer">
          <a href="listing-detail.html?id=${item.id}" class="btn btn-outline btn-sm btn-block">
            <span>Ətraflı bax</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}
