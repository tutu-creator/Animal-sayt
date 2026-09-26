/**
 * ==========================================================================
 * [SAYT ADI] - API Xidmət Modulu (Vanilla JS fetch inteqrasiyası)
 * ==========================================================================
 * 
 * BU FAYLIN MƏQSƏDİ:
 * Backend hələ hazır olmadığı üçün, bu modul həm real API üçün fetch() sorğularını
 * aydın TODO şərhləri ilə saxlayır, həm də backend işə düşənə qədər saytın
 * brauzerdə tam işlək qalması üçün mock verilənlər və localStorage ilə fallback edir.
 * 
 * BACKEND HAZIRLANDIQDA:
 * Aşağıdakı TODO şərhlərindəki real endpoint ünvanlarını aktivləşdirin.
 */

const API = {
  // Əsas server API baza ünvanı (Backend hazır olduqda buranı dəyişin)
  BASE_URL: '/api',

  /**
   * Yeni Elan / Bildiriş göndərmək (POST sorğusu)
   * @param {FormData} formData - Şəkillər və form məlumatları (type, animalType, description, location və s.)
   * @returns {Promise<Object>} Yaradılmış elan obyekti
   */
  async createReport(formData) {
    try {
      /*
       * =====================================================================
       * TODO: backend API ünvanı bura yazılacaq:
       * const response = await fetch(`${this.BASE_URL}/reports`, {
       *   method: 'POST',
       *   body: formData
       *   // Qeyd: FormData istifadə edildiyi üçün 'Content-Type' header-ini əl ilə yazmayın!
       * });
       * if (!response.ok) throw new Error('Server xətası: ' + response.status);
       * return await response.json();
       * =====================================================================
       */

      // BACKEND QOŞULANA QƏDƏR FALLBACK (Simulyasiya və LocalStorage):
      console.log("➡️ [API POST] Forma göndərilir (FormData obyekti):", Array.from(formData.entries()));

      // Şəkil fayllarını önizləmə URL-lərinə çevirək və ya default şəkil təyin edək
      const animalType = formData.get('animalType') || 'dog';
      const type = formData.get('type') || 'stray';
      let defaultImg = animalType === 'cat' ? 'images/cat-stray-1.jpg' : 'images/dog-stray-1.jpg';
      if (type === 'lost') {
        defaultImg = animalType === 'cat' ? 'images/cat-lost-1.jpg' : 'images/dog-lost-1.jpg';
      } else if (type === 'needs_help') {
        defaultImg = 'images/dog-needs-care-1.jpg';
      }

      // Əgər formda şəkil seçilibsə və DataURL önizləməsi varsa
      const previewImages = window.__lastUploadedPreviews && window.__lastUploadedPreviews.length > 0
        ? window.__lastUploadedPreviews
        : [defaultImg];

      const newListing = {
        id: "rep_" + Date.now(),
        type: formData.get('type') || 'stray',
        animalType: formData.get('animalType') || 'dog',
        title: formData.get('title') || `${animalType === 'dog' ? 'İt' : 'Pişik'} haqqında bildiriş`,
        petName: formData.get('petName') || '',
        breed: formData.get('breed') || '',
        age: formData.get('age') || '',
        color: formData.get('color') || '',
        lostDate: formData.get('lostDate') || '',
        observedDuration: formData.get('observedDuration') || '',
        conditions: formData.getAll('conditions[]') || [],
        description: formData.get('description') || '',
        location: {
          lat: parseFloat(formData.get('lat')) || 40.4093,
          lng: parseFloat(formData.get('lng')) || 49.8671,
          address: formData.get('address') || 'Bakı şəhəri'
        },
        imageUrls: previewImages,
        createdAt: new Date().toISOString(),
        contactInfo: formData.get('contactInfo') || '',
        status: 'active'
      };

      // Simulyasiya edilmiş şəbəkə gecikməsi (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));

      // LocalStorage-ə yaz
      saveListingToStorage(newListing);

      console.log("✅ [API POST] Elan uğurla qeydə alındı:", newListing);
      return { success: true, data: newListing };

    } catch (error) {
      console.error("❌ [API POST] Xəta baş verdi:", error);
      throw error;
    }
  },

  /**
   * Bütün elanları almaq (GET sorğusu)
   * @param {Object} filters - Filter parametrləri ({ type, animalType, search, sort })
   * @returns {Promise<Array>} Elanlar massivi
   */
  async fetchListings(filters = {}) {
    try {
      /*
       * =====================================================================
       * TODO: backend API ünvanı bura yazılacaq:
       * const queryParams = new URLSearchParams(filters).toString();
       * const response = await fetch(`${this.BASE_URL}/reports?${queryParams}`, {
       *   method: 'GET',
       *   headers: { 'Accept': 'application/json' }
       * });
       * if (!response.ok) throw new Error('Verilənlər alına bilmədi: ' + response.status);
       * return await response.json();
       * =====================================================================
       */

      // BACKEND QOŞULANA QƏDƏR FALLBACK:
      // Simulyasiya edilmiş gecikmə
      await new Promise(resolve => setTimeout(resolve, 300));

      let listings = getStoredListings();

      // Növə görə filterləmə (stray, lost, needs_help)
      if (filters.type && filters.type !== 'all') {
        listings = listings.filter(item => item.type === filters.type);
      }

      // Heyvan növünə görə filterləmə (dog, cat, other)
      if (filters.animalType && filters.animalType !== 'all') {
        listings = listings.filter(item => item.animalType === filters.animalType);
      }

      // Axtarış açar sözünə görə filterləmə (təsvir, ünvan, ad)
      if (filters.search && filters.search.trim() !== '') {
        const query = filters.search.trim().toLowerCase();
        listings = listings.filter(item => {
          const inDesc = item.description ? item.description.toLowerCase().includes(query) : false;
          const inTitle = item.title ? item.title.toLowerCase().includes(query) : false;
          const inAddr = item.location && item.location.address ? item.location.address.toLowerCase().includes(query) : false;
          const inPetName = item.petName ? item.petName.toLowerCase().includes(query) : false;
          return inDesc || inTitle || inAddr || inPetName;
        });
      }

      // Çeşidləmə (Ən yeni / Ən köhnə)
      if (filters.sort === 'oldest') {
        listings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else {
        // Standart: Ən yeni birinci
        listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return listings;

    } catch (error) {
      console.error("❌ [API GET] Elanları gətirərkən xəta:", error);
      return getStoredListings();
    }
  },

  /**
   * Tək bir elanın detalını almaq (GET sorğusu)
   * @param {string} id - Elanın unikal identifikasiya nömrəsi
   * @returns {Promise<Object>} Elan obyekti
   */
  async fetchListingById(id) {
    try {
      /*
       * =====================================================================
       * TODO: backend API ünvanı bura yazılacaq:
       * const response = await fetch(`${this.BASE_URL}/reports/${id}`);
       * if (!response.ok) throw new Error('Elan tapılmadı');
       * return await response.json();
       * =====================================================================
       */

      // BACKEND QOŞULANA QƏDƏR FALLBACK:
      await new Promise(resolve => setTimeout(resolve, 200));

      const listings = getStoredListings();
      const found = listings.find(item => String(item.id) === String(id));
      if (!found && listings.length > 0) {
        // Əgər ID tapılmazsa, demo məqsədilə ilk elanı göstərək
        return listings[0];
      }
      return found;

    } catch (error) {
      console.error(`❌ [API GET /reports/${id}] Xəta:`, error);
      return null;
    }
  },

  /**
   * Könüllülük / Əlaqə mesajı göndərmək (POST sorğusu)
   * @param {Object} data - { fullName, email, phone, subject, message }
   */
  async sendContactMessage(data) {
    /*
     * =====================================================================
     * TODO: backend API ünvanı bura yazılacaq:
     * const response = await fetch(`${this.BASE_URL}/contact`, {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(data)
     * });
     * return await response.json();
     * =====================================================================
     */
    console.log("➡️ [API Contact] Əlaqə mesajı göndərildi:", data);
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true };
  }
};
