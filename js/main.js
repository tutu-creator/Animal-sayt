/**
 * ==========================================================================
 * [SAYT ADI] - Əsas UI və Köməkçi Skriptlər (Vanilla JS)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderNavigation();
  initMobileMenu();
  initHeaderDropdown();
  setActiveNavLink();
});

/**
 * Header menyusu və skroll effekti
 */
function initHeaderNavigation() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = 'none';
    }
  });
}

/**
 * Mobil menyu (Hamburger menu) açılıb-bağlanması
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  // Kənara klikləyəndə bağlamaq
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      navMenu.classList.remove('active');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/**
 * Header "Elan Yerləşdir" açılan menyusu (Dropdown)
 */
function initHeaderDropdown() {
  const toggleBtn = document.querySelector('.btn-post-dropdown-toggle');
  const menu = document.querySelector('.post-dropdown-menu');

  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
}

/**
 * Hazırkı səhifə linkinin aktiv edilməsi
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const page = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


/**
 * Qlobal Toast Bildiriş Sistemi
 * @param {string} message - Göstəriləcək mesaj
 * @param {'success'|'error'|'info'} type - Bildirişin növü
 * @param {number} duration - Ekranda qalma müddəti (ms)
 */
window.showToast = function(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '<i class="fa-solid fa-circle-info" style="color:var(--secondary)"></i>';
  if (type === 'success') {
    iconHtml = '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>';
  } else if (type === 'error') {
    iconHtml = '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger)"></i>';
  }

  toast.innerHTML = `
    ${iconHtml}
    <div style="flex:1;">${message}</div>
    <button style="background:none;border:none;color:var(--text-light);cursor:pointer;font-size:1.1rem;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  // Animasiya ilə göstər
  setTimeout(() => toast.classList.add('show'), 10);

  // Müddət bitəndə sil
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

/**
 * Tarixi Azərbaycan dilində oxunaqlı nisbi formata çevirir
 */
window.formatRelativeTime = function(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Bayaq';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} dəqiqə əvvəl`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} saat əvvəl`;
  if (diffSec < 172800) return 'Dünən';

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Elan növü üçün HTML Badge yaradır
 */
window.getTypeBadge = function(type) {
  switch (type) {
    case 'stray':
      return `<span class="badge badge-stray"><i class="fa-solid fa-paw"></i> Sahibsiz</span>`;
    case 'lost':
      return `<span class="badge badge-lost"><i class="fa-solid fa-bullhorn"></i> İtmiş Heyvan</span>`;
    case 'needs_help':
      return `<span class="badge badge-needs-help"><i class="fa-solid fa-heart-pulse"></i> Qayğı Lazımdır</span>`;
    default:
      return `<span class="badge"><i class="fa-solid fa-tag"></i> Elan</span>`;
  }
};

/**
 * Heyvan növü üçün ikon və ad
 */
window.getAnimalBadge = function(animalType) {
  switch (animalType) {
    case 'dog':
      return `<span class="badge badge-animal"><i class="fa-solid fa-dog"></i> İt</span>`;
    case 'cat':
      return `<span class="badge badge-animal"><i class="fa-solid fa-cat"></i> Pişik</span>`;
    default:
      return `<span class="badge badge-animal"><i class="fa-solid fa-dove"></i> Digər</span>`;
  }
};
