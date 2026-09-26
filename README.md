# [SAYT ADI] - Sahibsiz və İtmiş Heyvanlara Dəstək Platforması (Frontend)

Azərbaycanda (Bakı və regionlarda) küçədə yaşayan sahibsiz it və pişiklərə kömək etmək, itmiş ev heyvanlarını ailələrinə qovuşdurmaq və qayğıya/qidalanmaya ehtiyacı olan heyvanları bildirmək üçün hazırlanmış müasir, responsiv və təmiz **Vanilla HTML, CSS və JavaScript** veb tətbiqi.

---

## 📁 Layihənin Qovluq Strukturu

```text
Cats/
├── index.html                  # Ana səhifə (Hero, 3 əsas funksiya, son elanlar, statistika)
├── report-stray.html           # 1. Sahibsiz heyvan bildirişi forması
├── report-lost.html            # 2. İtmiş ev heyvanı elanı forması
├── report-needs-help.html      # 3. "Bu heyvana qayğı lazımdır" bildirişi forması
├── listings.html               # Bütün elanlar siyahısı (Filterlər, axtarış, çeşidləmə)
├── listing-detail.html         # Elan detalı (ID parametri, xəritə, əlaqə və paylaşma)
├── about.html                  # Haqqımızda, Missiya, FAQ və Könüllü/Əlaqə forması
├── favicon.svg                 # Pəncə loqolu SVG favicon
├── css/
│   ├── style.css               # Əsas dizayn sistemi (rənglər, tipoqrafiya, kartlar, header, footer)
│   ├── forms.css               # Formalar, drag-and-drop uploader, Geolocation, xəritə və inputlar
│   └── responsive.css          # Mobil/Planşet optimallaşdırması, alt sabit idarə paneli
├── js/
│   ├── api.js                  # fetch() sorğuları, aydın TODO şərhləri və fallback mexanizmi
│   ├── mock-data.js            # Realist Azərbaycan məkanları ilə ilkin demo verilənləri & LocalStorage
│   ├── main.js                 # Header menyusu, mobil menyu, qlobal Toast bildirişləri, köməkçilər
│   ├── forms.js                # Şəkil önizləmə/silmə, Geolocation API və form validasiyası
│   ├── listings.js             # Elanlar səhifəsi üçün filterləmə, canlı axtarış, çeşidləmə və səhifələmə
│   └── detail.js               # listing-detail.html üçün URL ID oxunması, render, paylaşma və modal
└── images/                     # Realist fotoşəkillər (hero, küçə itləri, pişikləri, itmiş ev heyvanları)
    ├── hero-pets.jpg
    ├── dog-stray-1.jpg
    ├── cat-stray-1.jpg
    ├── dog-lost-1.jpg
    ├── cat-lost-1.jpg
    └── dog-needs-care-1.jpg
```

---

## 🚀 Saytı Necə İşə Salmaq Olar?

Layihə heç bir kənar kitabxanadan (React, Vue, Node.js, Webpack, npm və s.) asılı deyil. Bütün fayllar saf **HTML5, CSS3 və Vanilla JavaScript** ilə yazılmışdır.

### Üsul 1: Birbaşa Brauzerdə Açmaq
`index.html` faylını siçanla iki dəfə klikləyərək istənilən brauzerdə (Google Chrome, Safari, Edge, Firefox) aça bilərsiniz.

### Üsul 2: Sadə Lokal Server ilə Açmaq (Tövsiyə olunur)
Terminal və ya komanda sətrində layihə qovluğuna daxil olub aşağıdakı əmrlərdən birini icra edin:

```bash
# Python 3 ilə:
python3 -m http.server 8080

# və ya Node http-server ilə (əgər varsa):
npx serve .
```
Brauzerdə `http://localhost:8080` ünvanını açın.

---

## 🛠️ Backend Developer Üçün İnteqrasiya Bələdçisi

Backend hazır olana qədər layihə daxilində **LocalStorage və Mock Data fallback** mexanizmi qurulmuşdur. Yeni göndərilən elanlar dərhal yadda saxlanılır və siyahıda görünür.

Bütün server sorğuları tək bir faylda — `js/api.js` daxilində cəmlənmiş və aydın `TODO` şərhləri ilə qeyd edilmişdir:

### 1. Yeni Elan Göndərilməsi (`POST /api/reports`)
- **Fayl:** `js/api.js` -> `createReport(formData)`
- **Format:** `multipart/form-data` (şəkillər `images[]` şəklində ötürülür)
- **Göndərilən sahələr:**
  ```json
  {
    "type": "stray | lost | needs_help",
    "animalType": "dog | cat | other",
    "title": "Qısa başlıq",
    "description": "Ətraflı təsvir...",
    "address": "Bakı şəhəri, Yasamal r...",
    "lat": 40.3887,
    "lng": 49.8105,
    "contactInfo": "+994 50 123 45 67",
    "petName": "İtmiş heyvanın adı (əgər type=lost olarsa)",
    "breed": "Cinsi",
    "age": "Yaşı",
    "color": "Rəngi",
    "lostDate": "2026-09-24",
    "observedDuration": "Müşahidə müddəti (əgər type=needs_help olarsa)",
    "conditions[]": ["acdır", "susuzdur", "xəstədir"],
    "images[]": [File, File]
  }
  ```

### 2. Elanlar Siyahısının Alınması (`GET /api/reports`)
- **Fayl:** `js/api.js` -> `fetchListings(filters)`
- **Filter parametrləri:** `?type=stray&animalType=dog&search=Bakı&sort=newest`
- **Gözlənilən JSON cavab formatı:**
  ```json
  [
    {
      "id": "123",
      "type": "stray",
      "animalType": "dog",
      "title": "Bulvarda mehriban küçə iti",
      "description": "İnsanlara qarşı çox mehribandır...",
      "location": {
        "lat": 40.3582,
        "lng": 49.8351,
        "address": "Bakı şəhəri, Dənizkənarı Milli Park"
      },
      "imageUrls": ["images/dog-stray-1.jpg"],
      "createdAt": "2026-09-25T15:20:00Z",
      "contactInfo": "+994 50 234 56 78",
      "status": "active"
    }
  ]
  ```

### 3. Tək Bir Elanın Detalı (`GET /api/reports/:id`)
- **Fayl:** `js/api.js` -> `fetchListingById(id)`
- **Keçid:** `listing-detail.html?id=123`
- JavaScript URL parametrindən `id`-ni oxuyur və bu endpointi çağırır.

### 4. Əlaqə və Könüllülük Müraciəti (`POST /api/contact`)
- **Fayl:** `js/api.js` -> `sendContactMessage(data)`
- **Göndərilən sahələr:** `{ fullName, email, phone, purpose, message }`

---

## 🏷️ Sayt Adının Dəyişdirilməsi

Saytın adı sonradan təyin ediləcəyi üçün bütün kodlarda **`[SAYT ADI]`** vahid identifikatorundan istifadə edilmişdir.
Ad qətiləşdikdə mətni asanlıqla dəyişə bilərsiniz:
- HTML başlıqlarında: `<title>[SAYT ADI] - ...</title>`
- Header loqosunda: `<span class="logo-text-placeholder">[SAYT ADI]</span>`
- Footer hüquqlarında: `© 2026 [SAYT ADI]`

Layihə daxilində "Find & Replace" (Axtar və Əvəz et) edərək `[SAYT ADI]` ifadəsini istədiyiniz brend adı ilə dəyişməyiniz kifayətdir.

---

## ✨ Əsas Funksional Üstünlüklər

1. **Mobil Prioritetli (Mobile-First) Responsive Dizayn:**
   - Küçədə telefonla çəkiliş aparan istifadəçilər üçün aşağıda sürətli 1-klik naviqasiya paneli.
2. **Şəkil Yükləmə (Drag & Drop + Önizləmə):**
   - İstifadəçi faylı seçdikdə və ya atdıqda `FileReader` vasitəsilə dərhal foto önizləməsi və hər şəklin üzərində silmə düyməsi.
3. **Məkan və Geolocation API:**
   - Brauzerin daxili Geolocation API-si vasitəsilə 1 toxunuşla cari GPS enlik və uzunluq koordinatlarını təyin etmə.
   - Xəritə yer tutucusu (`#map-placeholder`) və Google Maps birbaşa inteqrasiya linkləri.
4. **Zəng və WhatsApp Birbaşa Keçidi:**
   - İtmiş heyvanı tapan şəxslər tək toxunuşla heyvan sahibinə zəng edə və ya avtomatik mesajla WhatsApp-da yaza bilər.
5. **Toast Bildiriş Sistemi:**
   - Əməliyyatların nəticəsi haqqında yumşaq və zövqlü vizual xəbərdarlıqlar (`showToast()`).
6. **Yüksək Keyfiyyətli Azərbaycan Məzmunu:**
   - Bakı (Yasamal, İçərişəhər, Gənclik, Bulvar, Montin) və ətraf ərazilərə uyğunlaşdırılmış təbii Azərbaycan dili mətnləri.
