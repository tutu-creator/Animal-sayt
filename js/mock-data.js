/**
 * [SAYT ADI] - İlkin Demo Verilənləri (Mock Data)
 * Azərbaycan (Bakı və regionlar) üzrə realist test elanları.
 * Backend hazır olmadığı zaman sistem bu verilənləri və localStorage-i oxuyur.
 */

const INITIAL_MOCK_LISTINGS = [
  {
    id: "1",
    type: "stray",
    animalType: "dog",
    title: "Dənizkənarı Bulvarda sakit və mehriban küçə iti",
    description: "Bulvar ərazisində dincələn, insanlara qarşı çox mehriban və sakit olan açıq qəhvəyi rəngli it. Təhlükəsizdir, yaxşı qidalanıb amma soyuq havalarda sığınacaq və ya isti yuva üçün qayğı göstərənlər baxa bilər.",
    location: {
      lat: 40.3582,
      lng: 49.8351,
      address: "Bakı şəhəri, Dənizkənarı Milli Park (Ağ şəhər bulvarına yaxın ərazi)"
    },
    imageUrls: ["images/dog-stray-1.jpg"],
    createdAt: "2026-09-25T15:20:00Z",
    contactInfo: "+994 50 234 56 78",
    status: "active"
  },
  {
    id: "2",
    type: "lost",
    animalType: "dog",
    title: "İTİB! Qızılı Retriever cinsli ev iti (Boynunda qırmızı xalta var)",
    petName: "Baddi",
    breed: "Golden Retriever",
    age: "2 yaş",
    color: "Qızılı / Sarı",
    lostDate: "2026-09-24",
    description: "Nizami küçəsi (Tarqovı) ərazisində axşam gəzintisi zamanı atəşfəşanlıq səsindən qorxaraq qaçıb. Boynunda qırmızı xalta var, çox ürkəkdir. Görənlərdən təcili zəng etmələri xahiş olunur. Mükafat veriləcək!",
    location: {
      lat: 40.3725,
      lng: 49.8415,
      address: "Bakı şəhəri, Səbail rayonu, Nizami küçəsi (Fəvvarələr meydanı yaxınlığı)"
    },
    imageUrls: ["images/dog-lost-1.jpg"],
    createdAt: "2026-09-25T11:45:00Z",
    contactInfo: "+994 55 987 65 43",
    status: "active"
  },
  {
    id: "3",
    type: "stray",
    animalType: "cat",
    title: "İçərişəhərdə qədim pilləkənlərdə sevimli sarı pişik",
    description: "İçərişəhərin tarixi küçələrində hər gün gördüyümüz çox sevimli, narıncı zolaqlı küçə pişiyi. Yemək veriləndə dərhal yaxınlaşır, insanları sevir. Qışa doğru onu himayəsinə götürmək istəyən olarsa əla olar.",
    location: {
      lat: 40.3661,
      lng: 49.8335,
      address: "Bakı şəhəri, İçərişəhər, Qız Qalası yaxınlığı, Asəf Zeynallı küçəsi"
    },
    imageUrls: ["images/cat-stray-1.jpg"],
    createdAt: "2026-09-24T18:10:00Z",
    contactInfo: "",
    status: "active"
  },
  {
    id: "4",
    type: "lost",
    animalType: "cat",
    title: "İTİB! Boz rəngli Britaniya qısatüklü (British Shorthair) pişiyi",
    petName: "Luna",
    breed: "British Shorthair",
    age: "1.5 yaş",
    color: "Boz / Kül rəngi",
    lostDate: "2026-09-23",
    description: "Gənclik metrosu yaxınlığında 1-ci mərtəbə pəncərəsindən həyətə düşüb və itkin düşüb. Qapalı ev pişiyidir, küçə həyatına öyrəşməyib və çox qorxaqdır. Gözləri kəhrəba/sarı rəngdədir.",
    location: {
      lat: 40.4005,
      lng: 49.8516,
      address: "Bakı şəhəri, Nərimanov rayonu, Atatürk prospekti, Gənclik m/s yaxınlığı"
    },
    imageUrls: ["images/cat-lost-1.jpg"],
    createdAt: "2026-09-24T09:30:00Z",
    contactInfo: "+994 70 555 44 33",
    status: "active"
  },
  {
    id: "5",
    type: "needs_help",
    animalType: "dog",
    title: "Aclıq və susuzluq çəkən yaşlı küçə iti təcili yemlənməyə ehtiyac duyur",
    observedDuration: "4-5 gündür",
    conditions: ["acdır", "susuzdur", "zəifdir", "yemək yemir"],
    description: "Binanın həyətindəki ağacın altında günlərdir yatır, çox arıqlayıb və taqətsizdir. Yaxınlıqdakı sakinlər su qoyublar amma qidalanmaya və baytar nəzarətinə ciddi ehtiyacı var. Könüllü komandamızdan və ya ərazidəki insanlardan baş çəkmələrini xahiş edirik.",
    location: {
      lat: 40.3887,
      lng: 49.8105,
      address: "Bakı şəhəri, Yasamal rayonu, İnşaatçılar metrosu yaxınlığı, Abbas Mirzə Şərifzadə küçəsi"
    },
    imageUrls: ["images/dog-needs-care-1.jpg"],
    createdAt: "2026-09-25T16:00:00Z",
    contactInfo: "+994 51 333 22 11",
    status: "active"
  },
  {
    id: "6",
    type: "stray",
    animalType: "dog",
    title: "Gənclik parkında təmiz və baxımlı görünən küçə iti",
    description: "Parkın kənarında gəzən, dinc xarakterli orta ölçülü it. İnsanlara quyruq bulayır, uşaqlarla dostdur. Qulağında klinika birkası (sterilizasiya nişanı) var.",
    location: {
      lat: 40.4022,
      lng: 49.8533,
      address: "Bakı şəhəri, Atatürk parkı, Ayna Sultanova heykəli ətrafı"
    },
    imageUrls: ["images/dog-stray-1.jpg"],
    createdAt: "2026-09-23T14:15:00Z",
    contactInfo: "",
    status: "active"
  }
];

// LocalStorage-dən verilənləri almaq və ya ilkin siyahını saxlamaq
function getStoredListings() {
  try {
    const localData = localStorage.getItem('site_animal_listings');
    if (!localData) {
      localStorage.setItem('site_animal_listings', JSON.stringify(INITIAL_MOCK_LISTINGS));
      return INITIAL_MOCK_LISTINGS;
    }
    return JSON.parse(localData);
  } catch (e) {
    console.warn("LocalStorage oxunarkən xəta baş verdi, ilkin verilənlər göstərilir:", e);
    return INITIAL_MOCK_LISTINGS;
  }
}

// Yeni elanı LocalStorage-ə əlavə etmək
function saveListingToStorage(newListing) {
  const current = getStoredListings();
  current.unshift(newListing); // Ən başa əlavə et
  try {
    localStorage.setItem('site_animal_listings', JSON.stringify(current));
  } catch (e) {
    console.error("LocalStorage-ə yazılarkən xəta:", e);
  }
  return newListing;
}
