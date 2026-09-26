/**
 * ==========================================================================
 * [SAYT ADI] - Forma İdarəetmə Modulu (Vanilla JS)
 * Şəkil yükləmə (önizləmə/drag-and-drop), Geolocation API və Validasiya
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initImageUploader();
  initGeolocationPicker();
  initFormValidationAndSubmit();
});

// Qlobal massiv: seçilmiş şəkillərin DataURL önizləmələri
window.__lastUploadedPreviews = [];
// Seçilmiş fayllar siyahısı (FormData üçün)
let selectedFiles = [];

/**
 * Şəkil yükləmə və Drag & Drop mexanizmi
 */
function initImageUploader() {
  const dropzone = document.querySelector('.upload-dropzone');
  const fileInput = document.querySelector('.upload-file-input');
  const previewGrid = document.querySelector('.upload-preview-grid');

  if (!dropzone || !fileInput || !previewGrid) return;

  // Drag over / Drag leave effektləri
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-active');
    }, false);
  });

  // Drop hadisəsi
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  // File input dəyişdikdə
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  function handleFiles(files) {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        window.showToast("Yalnız şəkil faylları (.jpg, .png, .webp) qəbul edilir", "error");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        window.showToast("Şəkil həcmi 10MB-dan çox ola bilməz", "error");
        return;
      }

      selectedFiles.push(file);

      // FileReader ilə önizləmə yarat
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        window.__lastUploadedPreviews.push(dataUrl);

        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
          <img src="${dataUrl}" alt="Önizləmə">
          <button type="button" class="preview-remove-btn" title="Şəkli sil">&times;</button>
        `;

        // Şəkli silmə düyməsi
        const removeBtn = previewItem.querySelector('.preview-remove-btn');
        removeBtn.addEventListener('click', () => {
          const index = window.__lastUploadedPreviews.indexOf(dataUrl);
          if (index > -1) {
            window.__lastUploadedPreviews.splice(index, 1);
            selectedFiles.splice(index, 1);
          }
          previewItem.remove();
        });

        previewGrid.appendChild(previewItem);
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Geolocation API ilə istifadəçinin koordinatlarını almaq
 */
function initGeolocationPicker() {
  const geoBtn = document.querySelector('.btn-geolocation');
  const addressInput = document.querySelector('#location-address');
  const latInput = document.querySelector('#location-lat');
  const lngInput = document.querySelector('#location-lng');
  const coordsBadge = document.querySelector('.coords-badge-row');
  const coordsText = document.querySelector('#coords-display-text');
  const mapDesc = document.querySelector('#map-coord-status');

  if (!geoBtn) return;

  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      window.showToast("Brauzeriniz məkan təyin etməni (Geolocation) dəstəkləmir", "error");
      return;
    }

    geoBtn.classList.add('loading');
    geoBtn.innerHTML = '<i class="fa-solid fa-spinner"></i> Təyin edilir...';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        geoBtn.classList.remove('loading');
        geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Məkanım təyin edildi';

        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;

        if (coordsBadge && coordsText) {
          coordsText.textContent = `Enlik: ${lat}, Uzunluq: ${lng} (Dəqiqlik: ~${Math.round(position.coords.accuracy)}m)`;
          coordsBadge.classList.add('show');
        }

        if (mapDesc) {
          mapDesc.innerHTML = `<strong>Təyin edilmiş koordinat:</strong> ${lat}, ${lng} <br><span style="color:var(--secondary); font-weight:600;"><i class="fa-solid fa-circle-check"></i> Xəritədə nöqtə qeydə alındı</span>`;
        }

        if (addressInput && !addressInput.value.trim()) {
          addressInput.value = `Cari GPS koordinatları (${lat}, ${lng})`;
        }

        window.showToast("Məkanınız uğurla təyin edildi!", "success");
      },
      (error) => {
        geoBtn.classList.remove('loading');
        geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Mənim məkanım';

        let errMessage = "Məkan təyin edilə bilmədi.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errMessage = "Məkan icazəsi rədd edildi. Zəhmət olmasa ünvanı əl ilə yazın.";
            break;
          case error.POSITION_UNAVAILABLE:
            errMessage = "Məkan məlumatı əlçatan deyil.";
            break;
          case error.TIMEOUT:
            errMessage = "Məkan sorğusu vaxtaşımına uğradı.";
            break;
        }
        window.showToast(errMessage, "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Forma Validasiyası və Göndərilməsi
 */
function initFormValidationAndSubmit() {
  const form = document.querySelector('.animal-report-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Validasiya yoxlanışı
    let isValid = true;
    clearErrors(form);

    // Heyvan növü
    const animalType = form.querySelector('input[name="animalType"]:checked');
    if (!animalType) {
      showError(form.querySelector('.animal-type-grid').parentElement, "Zəhmət olmasa heyvan növünü seçin");
      isValid = false;
    }

    // Ünvan / Məkan sahəsi
    const addressInput = form.querySelector('#location-address');
    if (addressInput && !addressInput.value.trim()) {
      showError(addressInput.parentElement, "Zəhmət olmasa heyvanın olduğu məkanı/ünvanı daxil edin");
      isValid = false;
    }

    // Təsvir sahəsi
    const descInput = form.querySelector('#description');
    if (descInput) {
      if (!descInput.value.trim()) {
        showError(descInput.parentElement, "Zəhmət olmasa ətraflı təsvir yazın");
        isValid = false;
      } else if (descInput.value.trim().length < 15) {
        showError(descInput.parentElement, "Təsvir ən azı 15 simvoldan ibarət olmalıdır");
        isValid = false;
      }
    }

    // İtmiş heyvan forması üçün sahibin əlaqə nömrəsi (MÜTLƏQ SAHƏ)
    const phoneInput = form.querySelector('#contactInfo');
    const isContactRequired = phoneInput && phoneInput.hasAttribute('required');
    if (isContactRequired) {
      if (!phoneInput.value.trim()) {
        showError(phoneInput.parentElement, "Əlaqə nömrəsi mütləq qeyd edilməlidir");
        isValid = false;
      } else if (!validatePhone(phoneInput.value.trim())) {
        showError(phoneInput.parentElement, "Düzgün nömrə formatı daxil edin (məs: +994 50 123 45 67)");
        isValid = false;
      }
    }

    // İtmiş heyvan adı (əgər sahə varsa)
    const petNameInput = form.querySelector('#petName');
    if (petNameInput && !petNameInput.value.trim()) {
      showError(petNameInput.parentElement, "Heyvanın adını qeyd edin");
      isValid = false;
    }

    // Əgər səhv varsa ilk səhvə skroll et
    if (!isValid) {
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 2. FormData hazırlanması
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Göndərilir...';

    try {
      const formData = new FormData(form);

      // Seçilmiş faylları əlavə et
      selectedFiles.forEach((file) => {
        formData.append('images[]', file);
      });

      // API-yə göndər (js/api.js içindəki fetch və fallback)
      const result = await API.createReport(formData);

      // Uğur modalını və ya toast bildirişini göstər
      showSuccessModal(result.data);

    } catch (err) {
      console.error(err);
      window.showToast("Göndərilərkən xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.", "error");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function showError(container, msg) {
    container.classList.add('has-error');
    let errElem = container.querySelector('.error-message');
    if (!errElem) {
      errElem = document.createElement('div');
      errElem.className = 'error-message';
      container.appendChild(errElem);
    }
    errElem.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
    errElem.style.display = 'flex';
  }

  function clearErrors(formContainer) {
    const errorContainers = formContainer.querySelectorAll('.has-error');
    errorContainers.forEach(el => el.classList.remove('has-error'));
    const messages = formContainer.querySelectorAll('.error-message');
    messages.forEach(m => m.style.display = 'none');
  }

  function validatePhone(phone) {
    // Sadə telefon yoxlanışı (minimum 7 rəqəm)
    const cleaned = phone.replace(/[^0-9]/g, '');
    return cleaned.length >= 7;
  }
}

/**
 * Uğurlu Göndərmə Modalı
 */
function showSuccessModal(listing) {
  let modalOverlay = document.querySelector('#form-success-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'form-success-modal';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="modal-card" style="text-align: center;">
      <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--success-light); color: var(--success); display: inline-flex; align-items: center; justify-content: center; font-size: 2.2rem; margin-bottom: 20px;">
        <i class="fa-solid fa-check"></i>
      </div>
      <h2 style="font-size: 1.6rem; margin-bottom: 12px; color: var(--text-main);">Bildirişiniz Uğurla Qəbul Edildi!</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 28px; line-height: 1.6;">
        Təşəkkür edirik! Məlumat qeydə alındı və saytın ümumi elanlar bazasına əlavə olundu. Bu sayədə heyvana köməklik göstərilməsi şansı artır.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="listings.html" class="btn btn-primary">
          <i class="fa-solid fa-list-ul"></i> Elanlara bax
        </a>
        <a href="index.html" class="btn btn-outline">
          <i class="fa-solid fa-house"></i> Ana səhifə
        </a>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
}
