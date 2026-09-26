/**
 * ==========================================================================
 * [SAYT ADI] - Elan Detalı Modulu (listing-detail.html)
 * URL ID oxunması, ətraflı məlumatların render olunması, xəritə və əlaqə
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  loadListingDetail();
});

async function loadListingDetail() {
  const container = document.querySelector('#listing-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');

  if (!listingId) {
    showNotFound(container, "Elan nömrəsi qeyd olunmayıb.");
    return;
  }

  // Yüklənir vəziyyəti
  container.innerHTML = `
    <div style="text-align: center; padding: 100px 20px;">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary);"></i>
      <p style="margin-top: 16px; color: var(--text-muted); font-size: 1.1rem;">Elan məlumatları yüklənir...</p>
    </div>
  `;

  try {
    const item = await API.fetchListingById(listingId);

    if (!item) {
      showNotFound(container, "Axtardığınız elan tapılmadı və ya silinib.");
      return;
    }

    renderDetailContent(container, item);

  } catch (err) {
    console.error("Detalları yükləyərkən xəta:", err);
    showNotFound(container, "Elan məlumatlarını əldə etmək mümkün olmadı.");
  }
}

function showNotFound(container, message) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
      <h3>Elan Tapılmadı</h3>
      <p>${message}</p>
      <a href="listings.html" class="btn btn-primary">
        <i class="fa-solid fa-arrow-left"></i> Bütün elanlara qayıt
      </a>
    </div>
  `;
}

function renderDetailContent(container, item) {
  // Səhifə başlığını yenilə
  document.title = `${item.title || 'Elan Detalı'} - [SAYT ADI]`;

  const typeBadge = window.getTypeBadge(item.type);
  const animalBadge = window.getAnimalBadge(item.animalType);
  const timeFormatted = window.formatRelativeTime(item.createdAt);
  const images = (item.imageUrls && item.imageUrls.length > 0) ? item.imageUrls : ['images/hero-pets.jpg'];
  const mainImage = images[0];

  const address = item.location && item.location.address ? item.location.address : 'Bakı';
  const lat = item.location && item.location.lat ? item.location.lat : 40.4093;
  const lng = item.location && item.location.lng ? item.location.lng : 49.8671;
  const mapGoogleUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  // Əlaqə nömrəsi və WhatsApp linki
  const rawPhone = item.contactInfo || '';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const waUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Salam, [SAYT ADI] saytındakı "${item.title}" elanı ilə bağlı yazıram.`)}`
    : '#';

  // İtmiş heyvan xüsusi sahələri
  let lostDetailsHtml = '';
  if (item.type === 'lost') {
    lostDetailsHtml = `
      <div style="background-color: var(--accent-amber-light); border: 1.5px solid rgba(226, 140, 36, 0.3); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
        <h4 style="color: var(--accent-amber); font-size: 1.05rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-exclamation"></i> İtmiş Ev Heyvanı Haqqında Məlumatlar
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 0.92rem;">
          <div><strong>Adı:</strong> ${item.petName || 'Qeyd olunmayıb'}</div>
          <div><strong>Cinsi / Cinsiyyəti:</strong> ${item.breed || 'Məlum deyil'}</div>
          <div><strong>Yaşı:</strong> ${item.age || 'Məlum deyil'}</div>
          <div><strong>Rəngi:</strong> ${item.color || 'Məlum deyil'}</div>
          <div><strong>İtdiyi tarix:</strong> ${item.lostDate || 'Yaxın günlərdə'}</div>
        </div>
      </div>
    `;
  }

  // Qayğı lazım olan heyvan vəziyyət qeydləri
  let needsHelpDetailsHtml = '';
  if (item.type === 'needs_help') {
    const conditionsHtml = (item.conditions && item.conditions.length > 0)
      ? item.conditions.map(c => `<span style="background: var(--primary-light); color: var(--primary); padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">${c}</span>`).join(' ')
      : '<span style="color: var(--text-muted);">Qeyd olunmayıb</span>';

    needsHelpDetailsHtml = `
      <div style="background-color: var(--primary-light); border: 1.5px solid rgba(226, 88, 62, 0.25); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
        <h4 style="color: var(--primary); font-size: 1.05rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-hand-holding-heart"></i> Qayğı və Vəziyyət Qeydləri
        </h4>
        <div style="margin-bottom: 10px; font-size: 0.92rem;">
          <strong>Müşahidə müddəti:</strong> ${item.observedDuration || 'Bir neçə gündür'}
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <strong style="font-size: 0.92rem;">Vəziyyəti:</strong>
          ${conditionsHtml}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Naviqasiya Qayıt Linki -->
    <div style="margin-bottom: 24px;">
      <a href="listings.html" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-muted); font-size: 0.95rem;">
        <i class="fa-solid fa-arrow-left"></i> Bütün elanlara qayıt
      </a>
    </div>

    <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: start;" class="detail-layout-grid">
      <!-- SOL TƏRƏF: Şəkillər və Təsvir -->
      <div>
        <div style="background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-color); overflow: hidden; box-shadow: var(--shadow-md); margin-bottom: 24px;">
          <div style="position: relative; height: 420px; background-color: #000;">
            <img id="detail-main-img" src="${mainImage}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: contain;">
            <div style="position: absolute; top: 16px; left: 16px; display: flex; gap: 8px;">
              ${typeBadge}
              ${animalBadge}
            </div>
          </div>
          
          ${images.length > 1 ? `
            <div style="display: flex; gap: 10px; padding: 14px; background: var(--bg-subtle); overflow-x: auto;">
              ${images.map((img, i) => `
                <img src="${img}" onclick="document.getElementById('detail-main-img').src='${img}'" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid ${i === 0 ? 'var(--primary)' : 'transparent'};" />
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Elan Mətni və Məlumatlar -->
        <div style="background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 32px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: var(--text-light); font-size: 0.88rem;">
            <span><i class="fa-regular fa-clock"></i> Paylaşıldı: ${timeFormatted}</span>
            <span>Elan ID: #${item.id}</span>
          </div>

          <h1 style="font-size: 1.85rem; margin-bottom: 20px; line-height: 1.3;">${item.title}</h1>

          ${lostDetailsHtml}
          ${needsHelpDetailsHtml}

          <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--text-main);">Təsvir və Əlavə Qeydlər</h3>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; white-space: pre-line; margin-bottom: 24px;">
            ${item.description || 'Məlumat daxil edilməyib.'}
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap; padding-top: 20px; border-top: 1px solid var(--border-color);">
            <button type="button" class="btn btn-outline btn-sm" id="btn-share-listing">
              <i class="fa-solid fa-share-nodes"></i> Elanı Paylaş
            </button>
            <button type="button" class="btn btn-outline btn-sm" onclick="window.print()">
              <i class="fa-solid fa-print"></i> Çap et / PDF
            </button>
          </div>
        </div>
      </div>

      <!-- SAĞ TƏRƏF: Məkan, Əlaqə və Dəstək Paneli -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Məkan Kartı -->
        <div style="background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 28px; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.2rem; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> Məkan Məlumatı
          </h3>
          <p style="font-size: 0.98rem; color: var(--text-main); font-weight: 600; margin-bottom: 12px;">
            ${address}
          </p>
          <div style="background-color: var(--bg-subtle); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
            GPS: ${lat}, ${lng}
          </div>
          
          <!-- Xəritə Mockup -->
          <div class="map-placeholder-box" style="height: 170px; margin-bottom: 16px;">
            <div class="map-pattern"></div>
            <div class="map-placeholder-content" style="padding: 10px 16px;">
              <div class="map-pin-pulse" style="font-size: 1.5rem;"><i class="fa-solid fa-location-dot"></i></div>
              <div class="map-placeholder-title" style="font-size: 0.88rem;">${address.split(',')[0]}</div>
              <div class="map-placeholder-desc" style="font-size: 0.75rem;">Koordinatlar: ${lat}, ${lng}</div>
            </div>
          </div>

          <a href="${mapGoogleUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm btn-block">
            <i class="fa-solid fa-map-location-dot"></i> Google Maps-də aç
          </a>
        </div>

        <!-- Əlaqə və Kömək Kartı -->
        <div style="background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-color); padding: 28px; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.2rem; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-headset" style="color: var(--secondary);"></i> Əlaqə və Kömək
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">
            Bu heyvan haqqında məlumatınız varsa və ya kömək etmək istəyirsinizsə dərhal əlaqə saxlayın.
          </p>

          ${rawPhone ? `
            <div style="margin-bottom: 16px;">
              <a href="tel:${rawPhone}" class="btn btn-primary btn-block" style="margin-bottom: 10px;">
                <i class="fa-solid fa-phone"></i> Zəng et: ${rawPhone}
              </a>
              ${cleanPhone ? `
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-block">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp ilə yaz
                </a>
              ` : ''}
            </div>
          ` : `
            <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); text-align: center; color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">
              <i class="fa-solid fa-user-shield"></i> Bu elanda birbaşa telefon nömrəsi qeyd edilməyib. Əraziyə yaxınlaşaraq heyvana yerində dəstək ola bilərsiniz.
            </div>
          `}

          <button type="button" class="btn btn-outline btn-block" id="btn-open-help-modal">
            <i class="fa-solid fa-heart" style="color: var(--primary);"></i> Kömək etmək istəyirəm
          </button>
        </div>
      </div>
    </div>
  `;

  // Paylaşma düyməsi listener
  const shareBtn = document.querySelector('#btn-share-listing');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareData = {
        title: `${item.title} - [SAYT ADI]`,
        text: `Heyvan elanına baxın: ${item.title}`,
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(err => console.log('Paylaşma ləğv edildi', err));
      } else {
        // Linki buferə kopyala
        navigator.clipboard.writeText(window.location.href).then(() => {
          window.showToast("Elanın keçid linki kopyalandı!", "success");
        });
      }
    });
  }

  // Kömək modali açma düyməsi
  const helpModalBtn = document.querySelector('#btn-open-help-modal');
  if (helpModalBtn) {
    helpModalBtn.addEventListener('click', () => {
      openHelpModal(item);
    });
  }
}

function openHelpModal(item) {
  let modalOverlay = document.querySelector('#help-action-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'help-action-modal';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="modal-card">
      <button type="button" class="modal-close-btn" onclick="this.closest('.modal-overlay').classList.remove('active')">&times;</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--primary-light); color: var(--primary); display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 12px;">
          <i class="fa-solid fa-hand-holding-heart"></i>
        </div>
        <h3 style="font-size: 1.4rem;">Heyvana Dəstək Ol</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 6px;">"${item.title}" üçün necə kömək edə bilərsiniz?</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
        <div style="padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-page);">
          <strong>1. Məkanına yemək və su aparın</strong>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Qeyd olunan ünvana (${item.location.address}) yaxınlaşaraq təmiz su və quru yemək qoya bilərsiniz.</p>
        </div>
        <div style="padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-page);">
          <strong>2. Sosial şəbəkələrdə paylaşın</strong>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Bu elanın linkini dostlarınız və heyvansevər qruplarla bölüşün.</p>
        </div>
        <div style="padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-page);">
          <strong>3. Könüllü komandamızla əlaqə</strong>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Əgər heyvan xəstədirsə və ya daşınması lazımdırsa, könüllülərimizə yazın.</p>
        </div>
      </div>

      <div style="display: flex; gap: 12px;">
        <a href="about.html#contact-section" class="btn btn-primary btn-block">
          <i class="fa-solid fa-envelope"></i> Könüllülərə yaz
        </a>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
}
