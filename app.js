/**
 * Dt. Emre Atasoy - Trabzon Diş Kliniği
 * İstemci Tarafı Dinamik Etkileşimler & WhatsApp Yönlendirici
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initBeforeAfterSlider();
  initTreatmentFilters();
  initReviewsFilter();
  initLanguageSwitcher();
  initToothScrollAnimation();
});

/* ==========================================================================
   1. Mobil Menü Kontrolü
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Menü dışına veya linke tıklandığında menüyü kapat
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   2. SSS Akordeon Mantığı (Google FAQ Uyumlu)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // İsteğe bağlı: Tek tek açılması için diğerlerini kapat
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        if (!isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });
}

/* ==========================================================================
   3. Öncesi / Sonrası (Before-After) İnteraktif Kaydırıcı
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-slider-container');
  const beforeEl = document.querySelector('.ba-before');
  const handle = document.querySelector('.ba-slider-handle');

  if (!container || !beforeEl || !handle) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;

    // Sınırlar içinde tut (yüzde 5 ile 95 arası)
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;

    beforeEl.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Fare Olayları
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  // Dokunmatik Ekran (Mobil) Olayları
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });
}

/* ==========================================================================
   4. Tedavi Kategori Filtresi
   ========================================================================== */
function initTreatmentFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn, .filter-chip');
  const cards = document.querySelectorAll('.treatment-card, .treatment-card-v2');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-filter') || btn.getAttribute('data-category');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Google Haritalar Yorum Filtreleme & Genişletme Mantığı
   ========================================================================== */
function initReviewsFilter() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');
  const toggleBtn = document.getElementById('btnToggleReviews');

  if (!reviewCards.length) return;

  let isExpanded = false;
  let activeFilter = 'all';

  function applyFilterAndVisibility() {
    reviewCards.forEach(card => {
      const hasText = card.getAttribute('data-has-text') === 'true';
      const isGuide = card.getAttribute('data-is-guide') === 'true';
      const isExtra = card.classList.contains('review-extra-card');

      let matchesFilter = true;
      if (activeFilter === 'written') {
        matchesFilter = hasText;
      } else if (activeFilter === 'guide') {
        matchesFilter = isGuide;
      } else if (activeFilter === 'stars') {
        matchesFilter = true;
      }

      if (!matchesFilter) {
        card.style.display = 'none';
      } else {
        if (isExtra && !isExpanded && activeFilter === 'all') {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
        }
      }
    });

    if (toggleBtn) {
      if (activeFilter !== 'all') {
        toggleBtn.style.display = 'none';
      } else {
        toggleBtn.style.display = 'inline-flex';
        const btnText = toggleBtn.querySelector('.btn-toggle-text');
        if (btnText) {
          btnText.textContent = isExpanded 
            ? 'Daha Az Değerlendirme Göster' 
            : 'Diğer 5 Yıldızlı Puanlamaları Göster (12 Değerlendirme)';
        }
        if (isExpanded) {
          toggleBtn.classList.add('is-expanded');
        } else {
          toggleBtn.classList.remove('is-expanded');
        }
      }
    }
  }

  // Initial render: show top written reviews, hide extra cards
  applyFilterAndVisibility();

  // Filter button clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      applyFilterAndVisibility();
    });
  });

  // Toggle button click
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      applyFilterAndVisibility();
      if (!isExpanded) {
        const reviewsSection = document.getElementById('yorumlar');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}

/* ==========================================================================
   5. Çok Dilli Çeviri Sistemi (i18n: TR / EN / AR) & Dil Değiştirici
   ========================================================================== */
let currentSiteLang = 'tr';

const TRANSLATIONS = {
  tr: {
    // Top Bar
    top_address: "Trabzon Meydan • Doktorlar İşhanı Kat:4 No:40",
    top_hours: "Pzt - Cmt: 09:00 - 19:00",
    
    // Header & Nav
    brand_title: "Dt. Emre <span>Atasoy</span>",
    brand_subtitle: "Trabzon Diş Kliniği",
    nav_home: "Ana Sayfa",
    nav_treatments: "Tedavilerimiz",
    nav_doctor: "Hekimimiz",
    nav_reviews: "Yorumlar (5.0 ★)",
    nav_location: "Ortahisar / Ulaşım",
    nav_blog: "Blog & Rehber",
    nav_contact: "İletişim",
    nav_lang_title: "Dil Seçimi / Language / اللغة",
    nav_wp_btn: "WhatsApp Randevu",
    nav_phone_btn: "Randevu Al",
    
    // Hero
    hero_badge: "Trabzon Meydan • Ağız ve Diş Sağlığı Kliniği",
    hero_reviews_count: "23 Google Yorumu",
    hero_title: "Doğal ve Kusursuz Bir Gülüş İçin <span class=\"highlight\">Modern Diş Hekimliği</span>",
    hero_desc: "Trabzon Meydan Doktorlar İşhanı'ndaki modern kliniğimizde; ileri teknoloji, koruyucu hekimlik ve kişiye özel estetik yaklaşımla ağrısız, steril ve konforlu tedaviler sunuyoruz.",
    hero_btn_wp: "WhatsApp İle Randevu Al",
    hero_btn_call: "Randevu Al",
    hero_btn_treatments: "Tedavilerimizi Keşfedin",
    hero_feat_0_stat: "5.0 / 5.0 ★",
    hero_feat_0_text: "23 Google İncelemesi (%100 Memnuniyet)",
    hero_feat_1_stat: "20+ Yıl",
    hero_feat_1_text: "Klinik Tecrübe & Güven",
    hero_feat_2_stat: "B-Sınıfı Otoklav",
    hero_feat_2_text: "Tam Sterilizasyon Garantisi",
    hero_feat_3_stat: "Trabzon Meydan",
    hero_feat_3_text: "Merkezi & Kolay Ulaşım",
    
    // Muayenehane Vitrini (Overlay)
    clinic_badge: "Trabzon Meydan • Modern Muayenehane Standartları",
    clinic_title: "Yüksek Hijyen, İleri Teknoloji ve <span class=\"highlight-text\">Huzurlu Klinik Ortamı</span>",
    clinic_desc: "Trabzon Meydan Doktorlar İşhanı'ndaki modern kliniğimizde; B-Sınıfı otoklav sterilizasyonu, dijital görüntüleme sistemleri ve hasta konforu odaklı tedavi alanımızla hizmetinizdeyiz.",
    clinic_pill_1: "B-Sınıfı Otoklav & %100 Steril Cerrahi Standartlar",
    clinic_pill_2: "Dijital Radyoloji & Hassas Görüntüleme",
    clinic_pill_3: "Ağrısız & Stresten Uzak Konforlu Tedavi",
    clinic_btn_all: "Tüm Tedavi Hizmetlerimizi İnceleyin (15 Branş) →",
    clinic_btn_wp: "WhatsApp Randevu Al",
    clinic_btn_call: "İletişime Geçin",
    clinic_pop_title: "Popüler Tedaviler:",
    tag_implant: "İmplant",
    tag_zirconia: "Zirkonyum",
    tag_smile: "Gülüş Tasarımı",
    tag_canal: "Kanal Tedavisi",
    tag_aligner: "Şeffaf Plak",
    tag_wisdom: "20'lik Diş",
    
    // 3D Diş Animasyonu
    tooth_tag: "İnteraktif 3D Diş Mimarisi & Restorasyon Aşamaları",
    tooth_title: "Doğal Diş Anatomisi ve <span class=\"highlight\">Adım Adım Tedavi</span>",
    tooth_sub: "Aşağı kaydırarak dişin katmanlarını, biyolojik yapısını ve modern restorasyon sürecini inceleyin.",
    tooth_label_focus: "Klinik Odak:",
    tooth_label_approach: "Yaklaşımımız:",
    
    // Hekim Bölümü
    doc_tag: "Hekimimiz & Yaklaşımımız",
    doc_name: "Dt. Emre Atasoy",
    doc_badge: "Diş Hekimi • Trabzon Meydan Doktorlar İşhanı Kat:4 No:40",
    doc_bio: "Trabzon Meydan'daki kliniğimizde; her hastamızı etik ve koruyucu hekimlik ilkeleriyle karşılıyor, gereksiz işlemlerden kaçınarak şeffaf ve bilimsel bir tedavi süreci yürütüyoruz.",
    cred_1_title: "Kişiye Özel Tedavi Planı",
    cred_1_desc: "Detaylı ağız içi muayene, dijital görüntüleme ve şeffaf süreç yönetimi.",
    cred_2_title: "B-Sınıfı Otoklav & Sterilizasyon",
    cred_2_desc: "Her hasta için otoklavlı ve tek kullanımlık steril cerrahi aletler.",
    cred_3_title: "Ağrısız & Konforlu Tedavi",
    cred_3_desc: "Korku ve endişeyi ortadan kaldıran modern anestezi ve hasta odaklı yaklaşım.",
    doc_btn_about: "Hekimimiz & Klinik Standartları Hakkında →",
    doc_btn_randevu: "Muayene Randevusu Al",
    
    // Google Haritalar Yorumları
    reviews_tag: "Google Haritalar Doğrulanmış Yorumlar",
    reviews_title: "Hastalarımızın Deneyimleri & <span class=\"highlight\">Google Yorumları</span>",
    reviews_desc: "Trabzon Meydan kliniğimizde tedavi olan hastalarımızın Google Haritalar üzerinde paylaştığı bağımsız ve %100 doğrulanmış değerlendirmeler.",
    reviews_btn_google: "Google Haritalar'da Gör",
    reviews_btn_write: "Google'da Yorum Yaz",
    
    // Lokasyon & Ulaşım
    loc_tag: "Trabzon Merkez Lokasyon",
    loc_title: "Kliniğimize Ulaşım",
    loc_desc: "Trabzon Meydan Parkı'na 1 dakika yürüme mesafesinde, Doktorlar İşhanı Kat:4'te kolayca ulaşabileceğiniz merkezi konumdayız.",
    loc_addr_label: "Klinik Adresimiz:",
    loc_addr_text: "Kemerkaya mah. Meydan hamam sok. Doktorlar işhanı Kat:4 No:40, 61030 Ortahisar / Trabzon",
    loc_phone_label: "Klinik Sabit Hat:",
    loc_wp_label: "WhatsApp & Randevu:",
    loc_btn_wp: "WhatsApp İle Randevu Al",
    loc_btn_guide: "Ulaşım Rehberi & Harita",
    
    // SSS (FAQ)
    faq_tag: "Merak Edilenler",
    faq_title: "Sıkça Sorulan Sorular",
    faq_desc: "Trabzon'da diş tedavisi, implant, zirkonyum ve randevu süreçleri hakkında hastalarımızın en çok yönelttiği sorular ve yanıtları.",
    faq_q1: "Trabzon'da muayene ve randevu süreci nasıl işliyor?",
    faq_a1: "Kliniğimize <strong>0532 775 52 78</strong> nolu WhatsApp hattımızdan gün ve saat tercihinizi yazarak anında randevu oluşturabilirsiniz. İlk muayenede detaylı ağız içi kontrol ve gerekiyorsa röntgen değerlendirmesi yapılarak size en uygun tedavi planı ve bütçe şeffafça paylaşılır.",
    faq_q2: "İmplant tedavisi ağrılı mıdır, ne kadar sürede tamamlanır?",
    faq_a2: "İmplant cerrahisi gelişmiş lokal anestezi altında tamamen acısız ve konforlu şekilde uygulanır; işlem sırasında herhangi bir ağrı hissetmezsiniz. Titanyum vidanın çene kemiğine yerleştirilmesi genellikle 15-20 dakika sürer. Kemik kaynaşmasının ardından kalıcı porselen veya zirkonyum dişiniz takılır.",
    faq_q3: "Zirkonyum kaplama ile klasik porselen kaplama arasındaki fark nedir?",
    faq_a3: "Zirkonyum kaplamalar metal içermez; ışık geçirgenliği doğal diş minesiyle neredeyse aynıdır ve diş etlerinde zamanla morarma/gri yansıma yapmaz. Klasik porselenler ise metal alt yapılı olduğundan daha çok arka azı dişlerde tercih edilirken, zirkonyum özellikle ön bölge ve estetik gülüş tasarımında altın standarttır.",
    faq_q4: "20'lik diş mutlaka çekilmeli midir?",
    faq_a4: "Ağızda düzgün sürmüş, temizlenebilen ve çevre dişlere baskı yapmayan 20'lik dişlerin çekilmesine gerek yoktur. Ancak gömülü kalan, komşu dişi çürüten, kist oluşturan veya çene arkında çapraşıklığa yol açan 20'lik dişlerin çekilmesi diş ve çene sağlığı açısından elzemdir.",
    faq_q5: "Şeffaf plak tedavisi mi yoksa klasik diş teli mi tercih edilmelidir?",
    faq_a5: "Şeffaf plaklar (telsiz ortodonti) dışarıdan bakıldığında fark edilmez, yemek yerken ve diş fırçalarken çıkarılabilir, sosyal hayatta büyük konfor sağlar. Klasik diş telleri ise ileri derecedeki iskeletsel çene anomalilerinde veya çok karmaşık vakalarda hekim tercihine göre önerilmektedir.",
    
    // Blog
    blog_tag: "Ağız ve Diş Sağlığı Rehberi",
    blog_title: "Bilgilendirici Blog Makalelerimiz",
    blog_desc: "Doğru bilinen yanlışlar, modern tedavi yöntemleri ve diş sağlığınızı korumanın bilimsel yolları.",
    blog_badge_1: "İmplant",
    blog_badge_2: "Estetik",
    blog_badge_3: "Endodonti",
    blog_meta_1: "📅 Güncel Rehber • Dt. Emre Atasoy",
    blog_meta_2: "📅 Karşılaştırma • Dt. Emre Atasoy",
    blog_meta_3: "📅 Tedavi Rehberi • Dt. Emre Atasoy",
    blog_t1: "İmplant Nedir? Ne Kadar Dayanır ve Sonrası Nelere Dikkat Edilmeli?",
    blog_d1: "İmplant tedavisinin aşamaları, ömrü, çene kemiğine uyumu ve operasyon sonrası iyileşme sürecinde dikkat edilmesi gereken kritik kurallar.",
    blog_t2: "Zirkonyum mu Porselen mi? Hangisi Sizin İçin Daha Doğru?",
    blog_d2: "Estetik beklentiler, diş eti uyumu, dayanıklılık ve maliyet açısından zirkonyum kaplama ile metal destekli porselenin ayrıntılı kıyaslaması.",
    blog_t3: "Kanal Tedavisi Ne Kadar Sürer? Ağrılı mıdır?",
    blog_d3: "Kanal tedavisi hakkında en çok merak edilen sorular, seans süreleri ve dişin çekilmeden uzun yıllar ağızda tutulma imkanı.",
    blog_read: "Makaleyi Oku →",
    blog_all_btn: "Tüm Blog Yazılarını & Hasta Rehberlerini İnceleyin (9 Makale) →",
    
    // Footer
    footer_desc: "Trabzon Ortahisar Meydan'da bilimsel ilkeler, yüksek sterilizasyon standartları ve hasta odaklı yaklaşımla ağız ve diş sağlığı hizmeti sunuyoruz.",
    footer_col_treatments: "Tedavilerimiz",
    footer_col_quicklinks: "Hızlı Bağlantılar",
    footer_col_hours: "Çalışma Saatleri",
    footer_hours_text: "Pazartesi – Cumartesi: 09:00 – 19:00<br />Pazar: Kapalı",
    footer_wp_btn: "WhatsApp Randevu Hattı",
    footer_legal: "<strong>Yasal Bilgilendirme:</strong> Bu sitede yer alan tüm içerik ve açıklamalar yalnızca kullanıcıları bilgilendirme amaçlı hazırlanmıştır. 1219 sayılı Tababet ve Şuabatı San'atlarının Tarzı İcrasına Dair Kanun ve Sağlık Bakanlığı mevzuatı gereğince tanı ve tedavi niteliği taşımaz. Kesin tanı ve kişiye özel tedavi için lütfen hekim muayenesine başvurunuz.",
    footer_copy: "© 2026 Dt. Emre Atasoy - Trabzon Diş Hekimi. Tüm Hakları Saklıdır.",
    footer_sitemap: "Site Haritası",
    
    // Mobile Action Bar
    mobile_call: "Hemen Ara",
    mobile_wp: "WhatsApp Randevu",
    
    // Toast
    toast_msg: "Site dili Türkçe (TR) olarak güncellendi.",

    // Tedaviler Sayfası & Kartlar
    page_treatments_title: "Ağız ve Diş Sağlığı Tedavi Hizmetlerimiz",
    page_treatments_desc: "Trabzon Meydan Doktorlar İşhanı'ndaki modern kliniğimizde Dt. Emre Atasoy tarafından uygulanan 15 uzman diş tedavisi, klinik endikasyonları, avantajları ve hasta süreçleri.",
    btn_detail_process: "Detaylı Bilgi & Süreç →",
    cb_banner_title: "Hangi Tedavinin Size Uygun Olduğundan Emin Değil misiniz?",
    cb_banner_desc: "Dt. Emre Atasoy kliniğinde dijital radyolojik inceleme ve detaylı hekim muayenesi sonrasında size en uygun tedavi planı şeffaf maliyet tablosu ile birlikte oluşturulur. Doğrudan WhatsApp veya telefonla randevu alabilirsiniz.",
    cb_badge_loc: "📍 Ortahisar Meydan Kat:4",
    cb_badge_mat: "🛡️ CE / FDA Onaylı Materyal",
    cb_badge_anes: "⚡ Ağrısız Lokal Anestezi",
    cb_card_title: "Hemen Randevu & Fiyat Bilgisi Alın",
    cb_card_hours: "<strong>Çalışma Saatleri:</strong> Pzt - Cmt: 09:00 - 19:00<br /><span style=\"font-size:0.84rem; color:#94A3B8;\">Trabzon Meydan • Doktorlar İşhanı Kat:4 No:40</span>",
    cb_btn_wp: "WhatsApp'tan Yazın",
    cb_btn_call: "📞 0462 323 35 92",
    
    // 15 Tedavi Kartı Çevirileri
    tc_1_badge: "İmplantoloji",
    tc_1_title: "İmplant Tedavisi",
    tc_1_desc: "Kaybedilen doğal dişlerin yerine çene kemiğine yerleştirilen, doku dostu saf titanyum vidalarla uygulanan kalıcı diş kökü tedavisidir.",
    tc_1_p1: "✓ Ağrısız & Acısız Lokal Anestezi",
    tc_1_p2: "✓ Sertifikalı Saf Titanyum Vidalar",
    tc_1_p3: "✓ Doğal Çiğneme ve Konfor",

    tc_2_badge: "Estetik Diş Hekimliği",
    tc_2_title: "Zirkonyum Kaplama",
    tc_2_desc: "Metal altyapı içermeyen, ışık geçirgenliği doğal diş minesiyle birebir örtüşen premium kaplama yöntemidir. Diş etinde morarma yapmaz.",
    tc_2_p1: "✓ Metal Desteksiz Doğal Görünüm",
    tc_2_p2: "✓ Diş Etinde Renk Değişimi Yapmaz",
    tc_2_p3: "✓ Yüksek Çiğneme ve Kırılma Direnci",

    tc_3_badge: "Endodonti",
    tc_3_title: "Kanal Tedavisi",
    tc_3_desc: "Derin çürük veya travma sonucu iltihaplanan diş sinirinin ağrısız temizlenip biyolojik dolgu materyalleriyle kapatılarak dişin kurtarılmasıdır.",
    tc_3_p1: "✓ Doğal Dişi Ağızda Koruma",
    tc_3_p2: "✓ Dijital Apeks Bulucu Hassasiyeti",
    tc_3_p3: "✓ Ağrısız Tek Seans Konforu",

    tc_4_badge: "Estetik & Hollywood Smile",
    tc_4_title: "Gülüş Tasarımı",
    tc_4_desc: "Hastanın yüz hatları, dudak çizgisi ve ten rengi analiz edilerek kişiye özel planlanan multi-disipliner Hollywood gülüşü estetiğidir.",
    tc_4_p1: "✓ Kişiye Özel Dijital Simülasyon",
    tc_4_p2: "✓ Altın Oran Yüz Uyumlu Tasarım",
    tc_4_p3: "✓ Doğal ve Çekici Gülümseme",

    tc_5_badge: "Ağız ve Çene Cerrahisi",
    tc_5_title: "20'lik Diş Çekimi",
    tc_5_desc: "Gömülü veya yarı gömülü kalarak komşu dişleri sıkıştıran, ağrı ve apse yapan yirmi yaş dişlerinin cerrahi yöntemle ağrısız çekilmesidir.",
    tc_5_p1: "✓ Komşu Dişleri Koruyan Yaklaşım",
    tc_5_p2: "✓ Konforlu Cerrahi Lokal Anestezi",
    tc_5_p3: "✓ Hızlı Post-Operatif İyileşme",

    tc_6_badge: "Telsiz Ortodonti",
    tc_6_title: "Şeffaf Plak Tedavisi",
    tc_6_desc: "Geleneksel metal braketler olmadan, dışarıdan fark edilmeyen şeffaf aligner plaklarla diş çapraşıklıklarını düzelten konforlu yöntemdir.",
    tc_6_p1: "✓ Dışarıdan Neredeyse Görünmez",
    tc_6_p2: "✓ Yemek Yerken Çıkarılabilme",
    tc_6_p3: "✓ Ağız İçi Batma ve Yara Yapmaz",

    tc_7_badge: "Bleaching Estetiği",
    tc_7_title: "Diş Beyazlatma (Bleaching)",
    tc_7_desc: "Çay, kahve ve sigara lekelenmelerini klinik ortamında ofis tipi özel lazer jelleriyle mineye zarar vermeden 3-4 ton açan estetik işlemdir.",
    tc_7_p1: "✓ Tek Seansta 3-4 Ton Açılma",
    tc_7_p2: "✓ Mineye Zarar Vermeyen Formül",
    tc_7_p3: "✓ Uzun Süreli Beyazlık Güvencesi",

    tc_8_badge: "Ortodonti",
    tc_8_title: "Diş Teli (Ortodonti)",
    tc_8_desc: "Çapraşık diş dizilimleri, çene darlığı ve kapanış bozukluklarını estetik porselen veya metal braketlerle kalıcı olarak düzelten uzmanlık alanıdır.",
    tc_8_p1: "✓ Doğru Kapanış & Çiğneme Fonksiyonu",
    tc_8_p2: "✓ Şeffaf Seramik Braket Seçeneği",
    tc_8_p3: "✓ Kalıcı ve Dengeli Çene Yapısı",

    tc_9_badge: "Restoratif Diş Tedavisi",
    tc_9_title: "Estetik Kompozit Dolgu",
    tc_9_desc: "Çürüyen veya kırılan diş dokusunun temizlenerek diş rengine birebir uyumlu nano-hibrit kompozit dolgu materyalleriyle restore edilmesidir.",
    tc_9_p1: "✓ Doğal Diş Rengiyle Birebir Uyum",
    tc_9_p2: "✓ Ağrısız Hızlı Uygulama Protokolü",
    tc_9_p3: "✓ Dayanıklı Nano-Kompozit Malzeme",

    tc_10_badge: "Periodontoloji",
    tc_10_title: "Diş Eti Tedavisi",
    tc_10_desc: "Diş eti kanaması, çekilmesi ve periodontitis kaynaklı kemik erimelerini durduran derin küretaj ve lazer destekli diş eti sağlığı tedavisidir.",
    tc_10_p1: "✓ Kanama ve Ağız Kokusunu Giderme",
    tc_10_p2: "✓ Kemik Kaybını ve Sallanmayı Önleme",
    tc_10_p3: "✓ Sağlıklı Pembe Diş Eti Görünümü",

    tc_11_badge: "Pedodonti",
    tc_11_title: "Çocuk Diş Hekimliği",
    tc_11_desc: "0-13 yaş grubu çocuklarda süt ve daimi dişlerin korunması, fissür örtücü, florür uygulamaları ve diş hekimi fobisini önleyen sıcak klinik yaklaşımıdır.",
    tc_11_p1: "✓ Korkusuz & Sevgi Dolu İletişim",
    tc_11_p2: "✓ Koruyucu Flor & Fissür Örtücü",
    tc_11_p3: "✓ Erken Ortodontik Takip",

    tc_12_badge: "Yaprak Porselen",
    tc_12_title: "Porselen Lamine Diş",
    tc_12_desc: "Diş yüzeyinde minimum aşındırma ile uygulanan, tırnak kalınlığında ultra ince porselen yaprakçıklarla kusursuz ön diş estetiği sağlar.",
    tc_12_p1: "✓ Minimum Diş Aşındırması (0.3mm)",
    tc_12_p2: "✓ Mükemmel Işık Geçirgenliği",
    tc_12_p3: "✓ Leke Tutmayan Pürüzsüz Yüzey",

    tc_13_badge: "Protetik Diş Tedavisi",
    tc_13_title: "Protez Diş Tedavisi",
    tc_13_desc: "Çoklu diş kayıplarında sabit köprüler, hassas tutuculu çıtçıtlı protezler veya total damak protezleriyle çiğneme fonksiyonunun geri kazandırılmasıdır.",
    tc_13_p1: "✓ Yüksek Çiğneme ve Konuşma Gücü",
    tc_13_p2: "✓ Düşmeyen Hassas Tutuculu Seçenekler",
    tc_13_p3: "✓ Doğal Ağız Anatomisine Uyum",

    tc_14_badge: "Sabit Kron Protez",
    tc_14_title: "Porselen Kaplama",
    tc_14_desc: "Aşırı madde kaybına uğramış dişlerin güçlendirilmesi için uygulanan dayanıklı, ekonomik ve estetik diş kaplama alternatifidir.",
    tc_14_p1: "✓ Kırılgan Dişleri Güçlendirme",
    tc_14_p2: "✓ Kanıtlanmış Uzun Ömürlü Yapı",
    tc_14_p3: "✓ Bütçe Dostu Estetik Çözüm",

    tc_15_badge: "Cerrahi Çekim",
    tc_15_title: "Diş Çekimi (Atraumatik)",
    tc_15_desc: "Kurtarılması mümkün olmayan enfekte dişlerin çevre kemik dokusu korunarak travmasız (atraumatik) teknikle ağrısız çekilmesidir.",
    tc_15_p1: "✓ Doku Dostu & Kemik Koruyucu",
    tc_15_p2: "✓ Ağrısız Lokal Anestezi",
    tc_15_p3: "✓ İmplant Altyapısını Koruma"
  },

  en: {
    // Top Bar
    top_address: "Trabzon Square • Doktorlar Business Center Fl:4 No:40",
    top_hours: "Mon - Sat: 09:00 - 19:00",
    
    // Header & Nav
    brand_title: "Dr. Emre <span>Atasoy</span>",
    brand_subtitle: "Trabzon Dental Clinic",
    nav_home: "Home",
    nav_treatments: "Treatments",
    nav_doctor: "Our Dentist",
    nav_reviews: "Reviews (5.0 ★)",
    nav_location: "Location & Access",
    nav_blog: "Blog & Guide",
    nav_contact: "Contact",
    nav_lang_title: "Select Language / Dil Seçimi / اللغة",
    nav_wp_btn: "WhatsApp Booking",
    nav_phone_btn: "Randevu Al",
    
    // Hero
    hero_badge: "Trabzon Square • Oral & Dental Health Clinic",
    hero_reviews_count: "23 Google Reviews",
    hero_title: "Modern Dentistry for a <span class=\"highlight\">Natural & Perfect Smile</span>",
    hero_desc: "At our modern dental clinic in Trabzon Square, Doktorlar Business Center; we offer painless, sterile, and comfortable treatments with advanced dental technology and personalized care.",
    hero_btn_wp: "Book via WhatsApp",
    hero_btn_call: "Book Appointment",
    hero_btn_treatments: "Explore Our Treatments",
    hero_feat_0_stat: "5.0 / 5.0 ★",
    hero_feat_0_text: "23 Google Reviews (100% Satisfaction)",
    hero_feat_1_stat: "20+ Years",
    hero_feat_1_text: "Clinical Experience & Trust",
    hero_feat_2_stat: "Class-B Autoclave",
    hero_feat_2_text: "100% Sterilization Guarantee",
    hero_feat_3_stat: "Trabzon Square",
    hero_feat_3_text: "Central & Easy Access",
    
    // Muayenehane Vitrini (Overlay)
    clinic_badge: "Trabzon Square • Modern Clinic Standards",
    clinic_title: "High Hygiene, Advanced Technology & <span class=\"highlight-text\">Peaceful Clinic Atmosphere</span>",
    clinic_desc: "At our modern practice in Trabzon Square; we welcome you with Class-B autoclave sterilization, digital imaging systems, and patient-first comfortable dental suites.",
    clinic_pill_1: "Class-B Autoclave & 100% Sterile Surgical Standards",
    clinic_pill_2: "Digital Radiology & High-Precision Imaging",
    clinic_pill_3: "Painless & Stress-Free Comfortable Treatment",
    clinic_btn_all: "Explore All Dental Treatments (15 Fields) →",
    clinic_btn_wp: "Book on WhatsApp",
    clinic_btn_call: "Contact Us",
    clinic_pop_title: "Popular Treatments:",
    tag_implant: "Dental Implant",
    tag_zirconia: "Zirconia Crown",
    tag_smile: "Smile Design",
    tag_canal: "Root Canal",
    tag_aligner: "Clear Aligners",
    tag_wisdom: "Wisdom Tooth",
    
    // 3D Diş Animasyonu
    tooth_tag: "Interactive 3D Tooth Architecture & Restoration Stages",
    tooth_title: "Natural Tooth Anatomy & <span class=\"highlight\">Step-by-Step Care</span>",
    tooth_sub: "Scroll down to explore the layers, biological architecture, and modern restorative stages of the tooth.",
    tooth_label_focus: "Clinical Focus:",
    tooth_label_approach: "Our Approach:",
    
    // Hekim Bölümü
    doc_tag: "Our Dentist & Philosophy",
    doc_name: "Dr. Emre Atasoy",
    doc_badge: "Dentist • Trabzon Square Doktorlar Business Center Fl:4 No:40",
    doc_bio: "In our clinic at Trabzon Square, we greet every patient with ethical and preventive care standards, avoiding unnecessary interventions and ensuring a transparent, scientific journey.",
    cred_1_title: "Personalized Treatment Plan",
    cred_1_desc: "Detailed oral examination, digital diagnostics, and transparent case management.",
    cred_2_title: "Class-B Autoclave Sterilization",
    cred_2_desc: "Autoclaved and single-use sterile surgical instruments for every single patient.",
    cred_3_title: "Painless & Comfortable Care",
    cred_3_desc: "Modern local anesthesia and gentle patient-focused methods eliminating fear.",
    doc_btn_about: "About Our Dentist & Clinic Standards →",
    doc_btn_randevu: "Book a Consultation",
    
    // Google Maps Reviews
    reviews_tag: "Google Maps Verified Patient Reviews",
    reviews_title: "Patient Experiences & <span class=\"highlight\">Google Reviews</span>",
    reviews_desc: "Independent, 100% verified testimonials and reviews shared on Google Maps by patients treated at our Trabzon Meydan clinic.",
    reviews_btn_google: "View on Google Maps",
    reviews_btn_write: "Write a Review",
    
    // Lokasyon & Ulaşım
    loc_tag: "Central Trabzon Location",
    loc_title: "Getting to Our Clinic",
    loc_desc: "Conveniently situated 1 minute walk from Trabzon Meydan Park, on the 4th floor of Doktorlar Business Center.",
    loc_addr_label: "Our Clinic Address:",
    loc_addr_text: "Kemerkaya Mah. Meydan Hamam Sok. Doktorlar Business Center Fl:4 No:40, 61030 Ortahisar / Trabzon",
    loc_phone_label: "Clinic Landline:",
    loc_wp_label: "WhatsApp & Booking:",
    loc_btn_wp: "Book via WhatsApp",
    loc_btn_guide: "Access Guide & Map",
    
    // SSS (FAQ)
    faq_tag: "Common Questions",
    faq_title: "Frequently Asked Questions",
    faq_desc: "Answers to our patients' most frequent inquiries about dental implants, zirconia crowns, and consultations in Trabzon.",
    faq_q1: "How does the examination and booking process work in Trabzon?",
    faq_a1: "You can instantly request an appointment by messaging our WhatsApp line at <strong>+90 532 775 52 78</strong> with your preferred date and time. During your first consultation, comprehensive oral checks and digital X-rays are conducted to outline a clear, transparent treatment plan.",
    faq_q2: "Is dental implant treatment painful, and how long does it take?",
    faq_a2: "Implant surgery is conducted completely painlessly under advanced local anesthesia; you feel zero discomfort. Inserting the titanium implant typically takes only 15-20 minutes. After bone osseointegration, custom permanent zirconia or porcelain crowns are placed.",
    faq_q3: "What is the difference between zirconia and traditional porcelain crowns?",
    faq_a3: "Zirconia crowns are 100% metal-free; their natural light translucency matches tooth enamel and prevents dark grey gum discolorations over time. While metal-porcelain was commonly used for molars, zirconia is now the world standard for aesthetic smile makeovers.",
    faq_q4: "Do wisdom teeth always need to be removed?",
    faq_a4: "Wisdom teeth that erupt properly, align comfortably, and can be maintained clean do not require removal. However, impacted wisdom teeth causing pressure, adjacent decay, or orthodontic crowding should be safely extracted.",
    faq_q5: "Should I choose clear aligners or traditional metal braces?",
    faq_a5: "Clear aligners (invisible orthodontics) are virtually undetectable, removable during meals and brushing, and offer high aesthetic comfort. Metal braces may still be indicated for severe skeletal malocclusions following a clinical evaluation.",
    
    // Blog
    blog_tag: "Dental Health Guide",
    blog_title: "Informative Dental Articles",
    blog_desc: "Myths, modern treatment options, and science-backed ways to maintain a healthy and vibrant smile.",
    blog_badge_1: "Implant",
    blog_badge_2: "Aesthetics",
    blog_badge_3: "Endodontics",
    blog_meta_1: "📅 Current Guide • Dr. Emre Atasoy",
    blog_meta_2: "📅 Comparison • Dr. Emre Atasoy",
    blog_meta_3: "📅 Treatment Guide • Dr. Emre Atasoy",
    blog_t1: "What is a Dental Implant? Lifespan & Crucial Post-Op Instructions",
    blog_d1: "Key stages of dental implants, osseointegration, longevity, and essential care rules during recovery.",
    blog_t2: "Zirconia or Porcelain? Which One is Right for You?",
    blog_d2: "In-depth comparison between zirconia crowns and porcelain in terms of aesthetics, gum health, and durability.",
    blog_t3: "How Long Does Root Canal Therapy Take? Is It Painful?",
    blog_d3: "Everything you need to know about root canal procedures, session lengths, and preserving your natural teeth.",
    blog_read: "Read Article →",
    blog_all_btn: "Explore All Articles & Patient Guides (9 Articles) →",
    
    // Footer
    footer_desc: "Delivering modern oral and dental healthcare in Trabzon Square with scientific rigor, highest sterilization, and patient-centered hospitality.",
    footer_col_treatments: "Our Treatments",
    footer_col_quicklinks: "Quick Links",
    footer_col_hours: "Working Hours",
    footer_hours_text: "Monday – Saturday: 09:00 – 19:00<br />Sunday: Closed",
    footer_wp_btn: "WhatsApp Booking Line",
    footer_legal: "<strong>Legal Notice:</strong> All content on this website is for patient education and informational purposes only. In accordance with medical regulations, it does not constitute clinical diagnosis or treatment. Please book an in-person consultation with our dentist for accurate diagnosis.",
    footer_copy: "© 2026 Dr. Emre Atasoy - Trabzon Dentist. All Rights Reserved.",
    footer_sitemap: "Sitemap",
    
    // Mobile Action Bar
    mobile_call: "Call Now",
    mobile_wp: "WhatsApp",
    
    // Toast
    toast_msg: "Site language set to English (EN).",

    // Treatments Page & Cards
    page_treatments_title: "Our Oral & Dental Health Treatment Services",
    page_treatments_desc: "15 specialized dental treatments, clinical indications, benefits and patient care processes performed by Dr. Emre Atasoy at our modern clinic in Trabzon Square Doktorlar Business Center.",
    btn_detail_process: "Detailed Info & Procedure →",
    cb_banner_title: "Not Sure Which Treatment is Best for You?",
    cb_banner_desc: "At Dr. Emre Atasoy's clinic, a customized treatment plan along with transparent cost estimates is prepared following digital radiology and thorough dental examination. You can book an appointment directly via WhatsApp or phone.",
    cb_badge_loc: "📍 Ortahisar Square Fl:4",
    cb_badge_mat: "🛡️ CE / FDA Approved Materials",
    cb_badge_anes: "⚡ Painless Local Anesthesia",
    cb_card_title: "Get Appointment & Pricing Info Now",
    cb_card_hours: "<strong>Working Hours:</strong> Mon - Sat: 09:00 - 19:00<br /><span style=\"font-size:0.84rem; color:#94A3B8;\">Trabzon Square • Doktorlar Business Center Fl:4 No:40</span>",
    cb_btn_wp: "Message on WhatsApp",
    cb_btn_call: "📞 0462 323 35 92",

    // 15 Treatment Cards Translations
    tc_1_badge: "Implantology",
    tc_1_title: "Dental Implant Treatment",
    tc_1_desc: "Permanent tooth root treatment applied with biocompatible pure titanium screws placed into the jawbone to replace lost natural teeth.",
    tc_1_p1: "✓ Painless Local Anesthesia",
    tc_1_p2: "✓ Certified Pure Titanium Implants",
    tc_1_p3: "✓ Natural Chewing & Comfort",

    tc_2_badge: "Aesthetic Dentistry",
    tc_2_title: "Zirconia Crown",
    tc_2_desc: "A premium metal-free crown solution whose light translucency perfectly matches natural enamel. Prevents dark gum edges.",
    tc_2_p1: "✓ Metal-Free Natural Look",
    tc_2_p2: "✓ No Gum Discoloration",
    tc_2_p3: "✓ High Chewing & Fracture Resistance",

    tc_3_badge: "Endodontics",
    tc_3_title: "Root Canal Treatment",
    tc_3_desc: "Saving the tooth by painlessly cleaning inflamed pulp caused by deep decay or trauma and sealing it with biocompatible fillings.",
    tc_3_p1: "✓ Preserving Natural Teeth",
    tc_3_p2: "✓ Digital Apex Locator Precision",
    tc_3_p3: "✓ Painless Single-Session Comfort",

    tc_4_badge: "Aesthetics & Hollywood Smile",
    tc_4_title: "Smile Design",
    tc_4_desc: "A multidisciplinary Hollywood smile aesthetic tailored individually by analyzing facial contours, lip line, and skin tone.",
    tc_4_p1: "✓ Personalized Digital Simulation",
    tc_4_p2: "✓ Golden Ratio Facial Harmony",
    tc_4_p3: "✓ Natural & Radiant Smile",

    tc_5_badge: "Oral & Maxillofacial Surgery",
    tc_5_title: "Wisdom Tooth Extraction",
    tc_5_desc: "Painless surgical extraction of impacted or semi-impacted wisdom teeth causing crowding, pain, or recurrent abscesses.",
    tc_5_p1: "✓ Safeguarding Adjacent Teeth",
    tc_5_p2: "✓ Comfortable Surgical Local Anesthesia",
    tc_5_p3: "✓ Rapid Post-OperATIVE Recovery",

    tc_6_badge: "Wireless Orthodontics",
    tc_6_title: "Clear Aligner Treatment",
    tc_6_desc: "A discreet, comfortable method straightening crooked teeth using nearly invisible removable aligners without metal brackets.",
    tc_6_p1: "✓ Virtually Invisible Appearance",
    tc_6_p2: "✓ Removable During Meals",
    tc_6_p3: "✓ No Mouth Irritation or Wounds",

    tc_7_badge: "Bleaching Aesthetics",
    tc_7_title: "Teeth Whitening (Bleaching)",
    tc_7_desc: "An in-office clinical procedure lightening teeth by 3-4 shades safely without harming enamel, removing tea, coffee, and tobacco stains.",
    tc_7_p1: "✓ 3-4 Shades Lighter in 1 Session",
    tc_7_p2: "✓ Enamel-Safe Clinical Formula",
    tc_7_p3: "✓ Long-Lasting Bright Results",

    tc_8_badge: "Orthodontics",
    tc_8_title: "Dental Braces (Orthodontics)",
    tc_8_desc: "Orthodontic specialty permanently correcting crowded teeth, narrow jaws, and malocclusions using aesthetic ceramic or metal brackets.",
    tc_8_p1: "✓ Correct Bite & Chewing Function",
    tc_8_p2: "✓ Ceramic Aesthetic Brackets Option",
    tc_8_p3: "✓ Balanced & Lasting Jaw Anatomy",

    tc_9_badge: "Restorative Dentistry",
    tc_9_title: "Aesthetic Composite Filling",
    tc_9_desc: "Restoring decayed or chipped tooth structure with tooth-colored nano-hybrid composite materials matching natural shades perfectly.",
    tc_9_p1: "✓ Seamless Tooth-Shade Match",
    tc_9_p2: "✓ Painless Rapid Protocol",
    tc_9_p3: "✓ Durable Nano-Composite Material",

    tc_10_badge: "Periodontology",
    tc_10_title: "Gum Disease Treatment",
    tc_10_desc: "Deep curettage and laser-supported therapy stopping gum bleeding, recession, and bone loss caused by periodontitis.",
    tc_10_p1: "✓ Eliminates Bleeding & Halitosis",
    tc_10_p2: "✓ Halts Bone Loss & Mobility",
    tc_10_p3: "✓ Healthy Pink Gum Appearance",

    tc_11_badge: "Pediatric Dentistry",
    tc_11_title: "Pediatric Dentistry",
    tc_11_desc: "Protecting primary and permanent teeth in ages 0-13 with fluoride, fissure sealants, and a warm approach preventing dental phobia.",
    tc_11_p1: "✓ Fear-Free Caring Atmosphere",
    tc_11_p2: "✓ Preventive Fluoride & Sealants",
    tc_11_p3: "✓ Early Orthodontic Monitoring",

    tc_12_badge: "Porcelain Laminate",
    tc_12_title: "Porcelain Laminate Veneers",
    tc_12_desc: "Ultra-thin fingernail-thickness porcelain shells bonded with minimal tooth preparation (0.3mm) for flawless anterior smile beauty.",
    tc_12_p1: "✓ Minimal Tooth Prep (0.3mm)",
    tc_12_p2: "✓ Natural Light Translucency",
    tc_12_p3: "✓ Stain-Resistant Glazed Surface",

    tc_13_badge: "Prosthetic Dentistry",
    tc_13_title: "Dentures & Prosthetics",
    tc_13_desc: "Restoring chewing and speech in multiple missing teeth using fixed bridges, precision-attachment snap dentures, or full dentures.",
    tc_13_p1: "✓ Restored Chewing & Speech Power",
    tc_13_p2: "✓ Secure Precision-Attachment Fit",
    tc_13_p3: "✓ Anatomical Natural Gum Fit",

    tc_14_badge: "Fixed Crown Prosthesis",
    tc_14_title: "Porcelain Crown",
    tc_14_desc: "A durable, budget-friendly, and aesthetic crown option applied to strengthen heavily damaged or fragile teeth.",
    tc_14_p1: "✓ Reinforcing Fragile Teeth",
    tc_14_p2: "✓ Clinically Proven Longevity",
    tc_14_p3: "✓ Budget-Friendly Aesthetic Choice",

    tc_15_badge: "Surgical Extraction",
    tc_15_title: "Tooth Extraction (Atraumatic)",
    tc_15_desc: "Painless extraction of non-restorable infected teeth preserving surrounding alveolar bone using gentle atraumatic techniques.",
    tc_15_p1: "✓ Bone-Preserving Atraumatic Care",
    tc_15_p2: "✓ Painless Local Anesthesia",
    tc_15_p3: "✓ Preserves Site for Future Implants"
  },

  ar: {
    // Top Bar
    top_address: "ميدان طرابزون • مجمع الأطباء، الطابق 4 رقم 40",
    top_hours: "الإثنين - السبت: 09:00 - 19:00",
    
    // Header & Nav
    brand_title: "د. إمري <span>أطاسوي</span>",
    brand_subtitle: "عيادة طب الأسنان في طرابزون",
    nav_home: "الرئيسية",
    nav_treatments: "العلاجات",
    nav_doctor: "طبيبنا",
    nav_reviews: "التقييمات (★ 5.0)",
    nav_location: "الموقع والوصول",
    nav_blog: "المدونة والدليل",
    nav_contact: "اتصل بنا",
    nav_lang_title: "اختيار اللغة / Language / Dil Seçimi",
    nav_wp_btn: "حجز عبر واتساب",
    nav_phone_btn: "Randevu Al",
    
    // Hero
    hero_badge: "ميدان طرابزون • عيادة صحة الفم والأسنان",
    hero_reviews_count: "23 تقييماً على جوجل",
    hero_title: "طب الأسنان الحديث من أجل <span class=\"highlight\">ابتسامة طبيعية ومثالية</span>",
    hero_desc: "في عيادتنا الحديثة بميدان طرابزون في مجمع الأطباء؛ نقدم علاجات متطورة وغير مؤلمة ومعقمة بالكامل، بأحدث أجهزة طب الأسنان ونهج علاجي تجميلي مخصص لكل مريض.",
    hero_btn_wp: "احجز موعدك عبر واتساب",
    hero_btn_call: "احجز موعداً",
    hero_btn_treatments: "اكتشف خدمات العلاج",
    hero_feat_0_stat: "★ 5.0 / 5.0",
    hero_feat_0_text: "23 تقييماً على جوجل (رضا 100%)",
    hero_feat_1_stat: "+20 عاماً",
    hero_feat_1_text: "خبرة سريرية وثقة",
    hero_feat_2_stat: "أوتوكلاف فئة B",
    hero_feat_2_text: "ضمان تعقيم كامل 100%",
    hero_feat_3_stat: "ميدان طرابزون",
    hero_feat_3_text: "موقع مركزي وسهل الوصول",
    
    // Muayenehane Vitrini (Overlay)
    clinic_badge: "ميدان طرابزون • معايير العيادة الحديثة",
    clinic_title: "أعلى معايير النظافة والتقنية في <span class=\"highlight-text\">بيئة سريرية مريحة وهادئة</span>",
    clinic_desc: "في عيادتنا المتطورة في ميدان طرابزون؛ نضمن لكم أقصى درجات الأمان الطبي والتعقيم بأجهزة الأوتوكلاف فئة B والتصوير الرقمي عالي الدقة لراحتكم التامة.",
    clinic_pill_1: "أوتوكلاف فئة B ومعايير جراحية معقمة 100%",
    clinic_pill_2: "أشعة رقمية وتصوير دقيق عالي الوضوح",
    clinic_pill_3: "علاج مريح بدون ألم وبعيد عن أي قلق",
    clinic_btn_all: "استكشف جميع خدمات طب الأسنان (15 قسماً) ←",
    clinic_btn_wp: "حجز موعد واتساب",
    clinic_btn_call: "تواصل معنا",
    clinic_pop_title: "العلاجات الأكثر طلباً:",
    tag_implant: "زراعة الأسنان",
    tag_zirconia: "تيجان الزيركون",
    tag_smile: "ابتسامة هوليوود",
    tag_canal: "علاج الجذور",
    tag_aligner: "التقويم الشفاف",
    tag_wisdom: "خلع ضرس العقل",
    
    // 3D Diş Animasyonu
    tooth_tag: "هندسة الأسنان التفاعلية ثلاثية الأبعاد ومراحل الترميم",
    tooth_title: "تشريح الأسنان الطبيعي و <span class=\"highlight\">العلاج خطوة بخطوة</span>",
    tooth_sub: "قم بالتمرير للأسفل لاستكشاف طبقات السن الطبيعية وهندستها ومراحل الترميم التجميلي الحديث.",
    tooth_label_focus: "التركيز السريري:",
    tooth_label_approach: "نهجنا الطبي:",
    
    // Hekim Bölümü
    doc_tag: "طبيبنا ونهجنا الطبي",
    doc_name: "د. إمري أطاسوي",
    doc_badge: "طبيب أسنان • ميدان طرابزون مجمع الأطباء ط:4 رقم:40",
    doc_bio: "في عيادتنا بميدان طرابزون، نستقبل كل مريض وفق أعلى المعايير الأخلاقية والطبية الوقائية، مع تجنب التدخلات غير الضرورية وتقديم خطة علاج علمية شفافة.",
    cred_1_title: "خطة علاج مخصصة لكل مريض",
    cred_1_desc: "فحص فموي دقيق، تصوير بالأشعة الرقمية وخطة واضحة وموثوقة.",
    cred_2_title: "تعقيم فئة B بالأوتوكلاف",
    cred_2_desc: "أدوات جراحية معقمة ومستلزمات أحادية الاستخدام لكل مريض على حدة.",
    cred_3_title: "علاج مريح وبدون ألم",
    cred_3_desc: "تخدير موضعي متطور يضمن علاجاً مريحاً خالياً من التوتر والخوف.",
    doc_btn_about: "عن الطبيب ومعايير العيادة ←",
    doc_btn_randevu: "احجز موعد استشارة",
    
    // Google Maps Reviews
    reviews_tag: "تقييمات موثقة من خرائط جوجل",
    reviews_title: "تجارب مرضانا و <span class=\"highlight\">تقييمات جوجل</span>",
    reviews_desc: "مراجعات وتقييمات موثقة ومستقلة 100% شاركها مرضانا على خرائط جوجل بعد علاجهم في عيادتنا بميدان طرابزون.",
    reviews_btn_google: "عرض على خرائط جوجل",
    reviews_btn_write: "اكتب تقييمك",
    
    // Lokasyon & Ulaşım
    loc_tag: "موقع مركزي في قلب طرابزون",
    loc_title: "الوصول إلى عيادتنا",
    loc_desc: "موقع استراتيجي على بعد دقيقة واحدة سيراً من حديقة ميدان طرابزون، في مجمع الأطباء الطابق 4.",
    loc_addr_label: "عنوان العيادة:",
    loc_addr_text: "حي كيمركايا، زقاق ميدان حمام، مجمع الأطباء الطابق 4 رقم 40، أورتاحصار / طرابزون",
    loc_phone_label: "الهاتف الثابت:",
    loc_wp_label: "واتساب والمواعيد:",
    loc_btn_wp: "احجز موعدك عبر واتساب",
    loc_btn_guide: "دليل الوصول والخريطة",
    
    // SSS (FAQ)
    faq_tag: "الأسئلة الشائعة",
    faq_title: "الأسئلة الأكثر تكراراً",
    faq_desc: "إجابات شاملة على أكثر استفسارات المرضى حول زراعة الأسنان، تيجان الزيركون وتصميم الابتسامة في طرابزون.",
    faq_q1: "كيف تسير مرحلة الفحص وحجز الموعد في طرابزون؟",
    faq_a1: "يمكنكم حجز موعد بكل سهولة عبر مراسلة خط الواتساب <strong>+90 532 775 52 78</strong> مع تحديد اليوم والوقت المفضلين. في الفحص الأول يتم تقييم شامل للفم وإجراء صور الأشعة لتحديد أفضل خطة علاج وتكلفة واضحة.",
    faq_q2: "هل جراحة زراعة الأسنان مؤلمة وكم من الوقت تستغرق؟",
    faq_a2: "تتم جراحة الزرع تحت تأثير تخدير موضعي متطور وبشكل مريح تماماً دون الشعور بأي ألم. يستغرق وضع برغي التيتانيوم 15-20 دقيقة، وبعد الاندماج العظمي يتم تركيب تيجان الزيركون الدائمة.",
    faq_q3: "ما هو الفرق بين تيجان الزيركون والبورسلين المعدني التقليدي؟",
    faq_a3: "تيجان الزيركون خالية تماماً من المعادن؛ وتطابق شفافية ولون الأسنان الطبيعية ولا تسبب أي سواد أو تلون في اللثة. الزيركون هو الخيار الأفضل والأكثر أماناً لجمال الأسنان الأمامية وتصميم الابتسامة.",
    faq_q4: "هل يجب خلع أضراس العقل دائماً؟",
    faq_a4: "أضراس العقل التي تظهر في موضعها السليم دون التسبب في ضغط على الأسنان المجاورة لا تحتاج للخلع. أما في حال كانت منطمرة أو تسبب التهابات أو تسوساً فيوصى بخلعها جراحياً.",
    faq_q5: "أيهما أفضل: التقويم الشفاف أم التقويم المعدني التقليدي؟",
    faq_a5: "التقويم الشفاف غير مرئي تماماً ويمكن نزعه أثناء الأكل وتنظيف الأسنان مما يمنح راحة عالية. بينما يُفضل التقويم المعدني للحالات المستعصية والتشوهات الفكية المعقدة.",
    
    // Blog
    blog_tag: "دليل صحة الفم والأسنان",
    blog_title: "مقالاتنا الطبية التثقيفية",
    blog_desc: "حقائق طبية، أساليب علاجية حديثة وإرشادات علمية للحفاظ على صحة وجمال أسنانك.",
    blog_badge_1: "زراعة الأسنان",
    blog_badge_2: "تجميل الأسنان",
    blog_badge_3: "علاج الجذور",
    blog_meta_1: "📅 دليل معتمد • د. إمري أطاسوي",
    blog_meta_2: "📅 مقارنة طبية • د. إمري أطاسوي",
    blog_meta_3: "📅 دليل علاجي • د. إمري أطاسوي",
    blog_t1: "ما هي زراعة الأسنان؟ كم تدوم وأهم النصائح بعد العملية؟",
    blog_d1: "مراحل زراعة الأسنان، عمرها الافتراضي، الاندماج العظمي وأهم الإرشادات بعد العملية للشفاء السريع.",
    blog_t2: "الزيركون أم البورسلين؟ أيهما الخيار الأنسب لابتسامتك؟",
    blog_d2: "مقارنة شاملة بين تيجان الزيركون والبورسلين المعدني من حيث المظهر الطبيعي، صحة اللثة والمتانة.",
    blog_t3: "كم يستغرق علاج عصب الأسنان؟ وهل هو مؤلم؟",
    blog_d3: "أهم الأسئلة الشائعة حول علاج قنوات الجذور، عدد الجلسات وكيفية إنقاذ السن الطبيعي لسنوات طويلة.",
    blog_read: "اقرأ المقال ←",
    blog_all_btn: "تصفح جميع المقالات وأدلة المرضى (9 مقالات) ←",
    
    // Footer
    footer_desc: "نقدم خدمات طب وجراحة الفم والأسنان في ميدان طرابزون وفق أحدث المعايير العلمية وأعلى درجات التعقيم والرعاية الطبية الفائقة.",
    footer_col_treatments: "علاجاتنا",
    footer_col_quicklinks: "روابط سريعة",
    footer_col_hours: "ساعات العمل",
    footer_hours_text: "الإثنين – السبت: 09:00 – 19:00<br />الأحد: مغلق",
    footer_wp_btn: "خط حجز المواعيد عبر واتساب",
    footer_legal: "<strong>إشعار قانوني:</strong> تم إعداد كافة المحتويات والمعلومات الواردة في هذا الموقع لأغراض تثقيفية وإعلامية فقط ولا تعتبر تشخيصاً أو علاجاً طبياً. للحصول على تشخيص دقيق وخطة علاج مخصصة يرجى مراجعة الطبيب المختص.",
    footer_copy: "© 2026 د. إمري أطاسوي - عيادة طب الأسنان في طرابزون. جميع الحقوق محفوظة.",
    footer_sitemap: "خريطة الموقع",
    
    // Mobile Action Bar
    mobile_call: "اتصل الآن",
    mobile_wp: "حجز واتساب",
    
    // Toast
    toast_msg: "تم تغيير لغة الموقع إلى العربية (AR).",

    // Treatments Page & Cards
    page_treatments_title: "خدمات علاج ورعاية الفم والأسنان",
    page_treatments_desc: "15 علاجاً متخصصاً لطب الأسنان ودواعي العلاج السريري والمزايا ومراحل العلاج التي يقدمها د. إمري أطاسوي في عيادتنا الحديثة بميدان طرابزون.",
    btn_detail_process: "التفاصيل والمعلومات ←",
    cb_banner_title: "لست متأكداً من العلاج الأنسب لحالتك؟",
    cb_banner_desc: "في عيادة د. إمري أطاسوي، يتم إعداد خطة علاج مخصصة مع جدول تكاليف شفاف بعد الفحص بالأشعة الرقمية والفحص السريري الدقيق. يمكنك حجز موعدك مباشرة عبر واتساب أو الهاتف.",
    cb_badge_loc: "📍 ميدان أورتاحصار ط:4",
    cb_badge_mat: "🛡️ مواد معتمدة من CE و FDA",
    cb_badge_anes: "⚡ تخدير موضعي مريح وبدون ألم",
    cb_card_title: "احصل على موعد ومعلومات الأسعار فوراً",
    cb_card_hours: "<strong>ساعات العمل:</strong> الإثنين - السبت: 09:00 - 19:00<br /><span style=\"font-size:0.84rem; color:#94A3B8;\">ميدان طرابزون • مجمع الأطباء ط:4 رقم:40</span>",
    cb_btn_wp: "تواصل عبر واتساب",
    cb_btn_call: "📞 0462 323 35 92",

    // 15 Treatment Cards Translations
    tc_1_badge: "زراعة الأسنان",
    tc_1_title: "علاج وزراعة الأسنان",
    tc_1_desc: "علاج دائم لجذور الأسنان المفقودة باستخدام براغي من التيتانيوم النقي المتوافق حيوياً والمثبت في عظم الفك.",
    tc_1_p1: "✓ تخدير موضعي مريح وبدون ألم",
    tc_1_p2: "✓ غرسات تيتانيوم نقي معتمدة ومضمونة",
    tc_1_p3: "✓ مضغ طبيعي وراحة كاملة",

    tc_2_badge: "طب الأسنان التجميلي",
    tc_2_title: "تيجان الزيركون",
    tc_2_desc: "حل تلبيس متميز خالٍ تماماً من المعادن، يطابق شفافية مينا الأسنان الطبيعية ولا يسبب اسوداداً في اللثة.",
    tc_2_p1: "✓ مظهر طبيعي بدون أي معادن",
    tc_2_p2: "✓ لا يسبب أي تغير في لون اللثة",
    tc_2_p3: "✓ مقاومة عالية للمضغ والكسر",

    tc_3_badge: "علاج الجذور",
    tc_3_title: "علاج قنوات الجذور",
    tc_3_desc: "إنقاذ السن عبر تنظيف العصب الملتهب بدون ألم الناتج عن التسوس العميق وحشوه بمواد حيوية معقمة.",
    tc_3_p1: "✓ الحفاظ على الأسنان الطبيعية",
    tc_3_p2: "✓ دقة فائقة بجهاز تحديد الذروة الرقمي",
    tc_3_p3: "✓ علاج مريح وبدون ألم في جلسة واحدة",

    tc_4_badge: "التجميل وابتسامة هوليوود",
    tc_4_title: "تصميم الابتسامة",
    tc_4_desc: "تصميم ابتسامة هوليوود مخصصة لكل مريض بعد تحليل ملامح الوجه وخط الشفاه ولون البشرة.",
    tc_4_p1: "✓ محاكاة رقمية مخصصة للابتسامة",
    tc_4_p2: "✓ تناسق مع النسبة الذهبية للوجه",
    tc_4_p3: "✓ ابتسامة جذابة وطبيعية",

    tc_5_badge: "جراحة الفم والفكين",
    tc_5_title: "خلع ضرس العقل",
    tc_5_desc: "خلع جراحي غير مؤلم لأضراس العقل المنطمرة أو شبه المنطمرة التي تسبب ضغطاً أو ألماً أو التهابات.",
    tc_5_p1: "✓ حماية الأسنان المجاورة",
    tc_5_p2: "✓ تخدير موضعي جراحي مريح",
    tc_5_p3: "✓ سرعة التعافي بعد الجراحة",

    tc_6_badge: "التقويم الشفاف",
    tc_6_title: "علاج التقويم الشفاف",
    tc_6_desc: "طريقة مريحة وغير مرئية لتعديل اصطفاف الأسنان باستخدام قوالب تقويم شفافة وقابلة للإزالة بدون أقواس معدنية.",
    tc_6_p1: "✓ غير مرئي تقريباً أثناء الارتداء",
    tc_6_p2: "✓ سهولة النزع أثناء تناول الطعام",
    tc_6_p3: "✓ لا يسبب أي تقرحات أو خدوش بالفم",

    tc_7_badge: "تبييض الأسنان",
    tc_7_title: "تبييض الأسنان الاحترافي",
    tc_7_desc: "إجراء سريري لتفتيح لون الأسنان بمقدار 3-4 درجات بأمان ودون الإضرار بالمينا، لإزالة تصبغات الشاي والقهوة والتدخين.",
    tc_7_p1: "✓ تفتيح 3-4 درجات في جلسة واحدة",
    tc_7_p2: "✓ تركيبة آمنة تماماً على مينا الأسنان",
    tc_7_p3: "✓ نتائج بياض تدوم طويلاً",

    tc_8_badge: "تقويم الأسنان",
    tc_8_title: "تقويم الأسنان التقليدي",
    tc_8_desc: "تخصص تقويم الأسنان لتصحيح التزاحم وضيق الفك وسوء الإطباق باستخدام حاصرات خزفية تجميلية أو معدنية متينة.",
    tc_8_p1: "✓ إطباق سليم ووظيفة مضغ مثالية",
    tc_8_p2: "✓ خيار الحاصرات الخزفية الشفافة",
    tc_8_p3: "✓ بنية فكية متوازنة ودائمة",

    tc_9_badge: "طب الأسنان الترميمي",
    tc_9_title: "حشوة الكومبوزيت التجميلية",
    tc_9_desc: "ترميم الأسنان المتسوسة أو المكسورة بحشوات النانو هايبرد التجميلية المطابقة للون الأسنان الطبيعي بدقة عالية.",
    tc_9_p1: "✓ تطابق تام مع لون السن الطبيعي",
    tc_9_p2: "✓ بروتوكول سريع وبدون أي ألم",
    tc_9_p3: "✓ مواد نانو كومبوزيت عالية المتانة",

    tc_10_badge: "أمراض اللثة",
    tc_10_title: "علاج أمراض اللثة",
    tc_10_desc: "علاج متقدم بالموجات والليزر والتقليح العميق لوقف نزيف اللثة وتراجعها وتآكل العظام المحيطة بالأسنان.",
    tc_10_p1: "✓ إيقاف النزيف والتخلص من رائحة الفم",
    tc_10_p2: "✓ منع تآكل العظام وتخلخل الأسنان",
    tc_10_p3: "✓ استعادة المظهر الوردي الصحي للثة",

    tc_11_badge: "طب أسنان الأطفال",
    tc_11_title: "طب أسنان الأطفال",
    tc_11_desc: "العناية بأسنان الأطفال اللبنية والدائمة من سن 0-13 عاماً، وتطبيق الفلورايد وسدادات الشقوق بنهج ودي يزيل الخوف.",
    tc_11_p1: "✓ تواصل ودود يزيل الخوف من طبيب الأسنان",
    tc_11_p2: "✓ فلورايد وقائي وسدادات شقوق للأسنان",
    tc_11_p3: "✓ متابعة مبكرة لنمو الفكين والأسنان",

    tc_12_badge: "عدسات البورسلين",
    tc_12_title: "فينير وعدسات الأسنان",
    tc_12_desc: "رقائق خزفية فائقة الرقة بسماكة الظفر تثبت على السن بأقل قدر من البرد (0.3 مم) لمنح ابتسامة أمامية ساحرة.",
    tc_12_p1: "✓ الحد الأدنى من برد الأسنان (0.3 مم)",
    tc_12_p2: "✓ شفافية مثالية تحاكي الأسنان الطبيعية",
    tc_12_p3: "✓ سطح أملس مقاوم للبقع والتصبغات",

    tc_13_badge: "تعويضات الأسنان",
    tc_13_title: "أطقم وتعويضات الأسنان",
    tc_13_desc: "استعادة وظائف المضغ والنطق في حالات فقدان الأسنان المتعدد باستخدام الجسور الثابتة أو الأطقم الدقيقة أو الأطقم الكاملة.",
    tc_13_p1: "✓ استعادة قوة المضغ والنطق السليم",
    tc_13_p2: "✓ خيارات تثبيت دقيقة ومحكمة بدون حركة",
    tc_13_p3: "✓ تطابق تام مع البنية التشريحية للفم",

    tc_14_badge: "التيجان الثابتة",
    tc_14_title: "تيجان البورسلين",
    tc_14_desc: "حل تلبيس متين واقتصادي وتجميلي يُستخدم لتقوية الأسنان المعرضة لتلف كبير أو فقدان كمية من بنيتها.",
    tc_14_p1: "✓ تقوية الأسنان الضعيفة والمعالجة",
    tc_14_p2: "✓ بنية متينة ذات عمر افتراضي طويل",
    tc_14_p3: "✓ حل اقتصادي وتجميلي مناسب",

    tc_15_badge: "الخلع الجراحي",
    tc_15_title: "خلع الأسنان (بدون رضح)",
    tc_15_desc: "خلع غير مؤلم للأسنان الميؤوس من علاجها باستخدام تقنيات لطيفة تحافظ على سلامة العظم المحيط لتمهيد الزرع.",
    tc_15_p1: "✓ تقنية لطيفة تحافظ على النسيج العظمي",
    tc_15_p2: "✓ تخدير موضعي كامل وبدون أي ألم",
    tc_15_p3: "✓ حماية موقع السن لزراعة مستقبلية ناجحة"
  }
};

/* ==========================================================================
   Tüm Alt Sayfalar İçin Evrensel Dinamik Çeviri Sözlüğü (EN / AR)
   ========================================================================== */
const UNIVERSAL_TRANSLATIONS = {
  en: {
    "Ana Sayfa": "Home",
    "Tedavilerimiz": "Treatments",
    "Tedaviler": "Treatments",
    "Hekimimiz": "Our Dentist",
    "Yorumlar (5.0 ★)": "Reviews (5.0 ★)",
    "Ortahisar / Ulaşım": "Location & Access",
    "Blog & Rehber": "Blog & Guide",
    "İletişim": "Contact",
    "WhatsApp Randevu": "WhatsApp Booking",
    "Dil Seçimi / Language / اللغة": "Select Language / Dil Seçimi / اللغة",
    "📍 Trabzon Meydan • Doktorlar İşhanı Kat:4 No:40": "📍 Trabzon Square • Doktorlar Business Center Fl:4 No:40",
    "Trabzon Meydan • Doktorlar İşhanı Kat:4 No:40": "Trabzon Square • Doktorlar Business Center Fl:4 No:40",
    "🕒 Pzt - Cmt: 09:00 - 19:00": "🕒 Mon - Sat: 09:00 - 19:00",
    "Pzt - Cmt: 09:00 - 19:00": "Mon - Sat: 09:00 - 19:00",
    "Hekimimiz & Klinik Standartlarımız": "Our Dentist & Clinic Standards",
    "Trabzon ve İlçelerinden Kliniğimize Ulaşım Rehberi": "Access Guide to Our Clinic from Trabzon & Districts",
    "Trabzon İlçeleri Diş Tedavisi Ulaşım Rehberi": "Trabzon Districts Dental Access Guide",
    "Ağız ve Diş Sağlığı Rehberi": "Oral & Dental Health Guide",
    "Ağız ve Diş Sağlığı Bilgilendirme Merkezi": "Oral & Dental Health Information Center",
    "Ağız ve Diş Sağlığı Tedavi Hizmetlerimiz": "Our Oral & Dental Health Treatment Services",
    "Dt. Emre Atasoy Kimdir?": "Who is Dr. Emre Atasoy?",
    "İletişim & Konum": "Contact & Location",
    "İletişim & Klinik Randevu": "Contact & Clinic Appointments",
    "İletişim ve Trabzon Meydan Kliniğimize Ulaşım": "Contact & Access to Our Trabzon Square Clinic",
    "Trabzon Meydan Doktorlar İşhanı'ndaki modern kliniğimizde Dt. Emre Atasoy tarafından uygulanan 15 uzman diş tedavisi, klinik endikasyonları, avantajları ve hasta süreçleri.": "15 specialized dental treatments, clinical indications, benefits and patient care processes performed by Dr. Emre Atasoy at our modern clinic in Trabzon Square Doktorlar Business Center.",
    "Trabzon Ortahisar Meydan'da bilimsel ilkeler, yüksek sterilizasyon standartları ve hasta odaklı hekimlik anlayışıyla hizmet veriyoruz.": "Delivering modern oral healthcare in Trabzon Ortahisar Square with scientific principles, high sterilization standards, and patient-centered dentistry.",
    "Randevu almak, adres tarifi sormak veya diş tedavileriniz hakkında bilgi edinmek için bize telefon veya WhatsApp hattımızdan kolayca ulaşabilirsiniz.": "Easily reach us by phone or WhatsApp to book an appointment, ask for directions, or learn about our dental treatments.",
    "Ortahisar, Akçaabat, Yomra, Arsin, Maçka, Sürmene, Of ve Vakfıkebir'den Trabzon Meydan'daki kliniğimize nasıl kolayca gelebilirsiniz? Randevu planlaması ve ulaşım detayları.": "How to conveniently visit our clinic in Trabzon Square from Ortahisar, Akçaabat, Yomra, Arsin, Maçka, Sürmene, Of, and Vakfıkebir? Appointment scheduling and transit details.",
    "Diş tedavileri hakkında doğru bilinen yanlışlar, bilimsel öneriler ve merak edilen tüm soruların yanıtları.": "Common myths, scientific recommendations, and answers to all your questions about dental treatments.",
    "Trabzon Meydan Doktorlar İşhanı Kat:4'teki kliniğimize kolayca ulaşabilir, WhatsApp veya telefon üzerinden anında randevu alabilirsiniz.": "Easily reach our clinic at Trabzon Square Doktorlar Business Center Fl:4, and instantly book an appointment via WhatsApp or phone.",
    "İmplant Tedavisi": "Dental Implant Treatment",
    "Zirkonyum Kaplama": "Zirconia Crown",
    "Kanal Tedavisi": "Root Canal",
    "Gülüş Tasarımı": "Smile Design",
    "20'lik Diş Çekimi": "Wisdom Tooth Extraction",
    "Şeffaf Plak Tedavisi": "Clear Aligner Treatment",
    "Diş Beyazlatma (Bleaching)": "Teeth Whitening (Bleaching)",
    "Diş Teli (Ortodonti)": "Dental Braces (Orthodontics)",
    "Estetik Kompozit Dolgu": "Aesthetic Composite Filling",
    "Diş Eti Tedavisi": "Gum Disease Treatment",
    "Çocuk Diş Hekimliği": "Pediatric Dentistry",
    "Porselen Lamine Diş": "Porcelain Laminate Veneers",
    "Protez Diş Tedavisi": "Dentures & Prosthetics",
    "Porselen Kaplama": "Porcelain Crown",
    "Diş Çekimi (Atraumatik)": "Tooth Extraction (Atraumatic)",
    "İmplant Tedavisi & Uygulama Rehberi": "Dental Implant Treatment & Procedure Guide",
    "Zirkonyum Diş Kaplama & Estetik Gülüş": "Zirconia Dental Crowns & Aesthetic Smile",
    "Zirkonyum Kaplama & Doğal Gülüş Estetiği": "Zirconia Crowns & Natural Smile Aesthetics",
    "Kanal Tedavisi (Endodonti) & Diş Kurtarma": "Root Canal Therapy (Endodontics) & Tooth Preservation",
    "Şeffaf Plak Tedavisi (Telsiz Ortodonti)": "Clear Aligner Treatment (Invisible Orthodontics)",
    "Gülüş Tasarımı (Hollywood Smile)": "Smile Design (Hollywood Smile)",
    "Gülüş Tasarımı (Hollywood Smile) & Doğal Estetik": "Smile Design (Hollywood Smile) & Natural Aesthetics",
    "20'lik Diş Çekimi (Gömülü Diş Operasyonu)": "Wisdom Tooth Extraction (Impacted Surgery)",
    "20'lik Diş Çekimi & Gömülü Diş Tedavisi": "Wisdom Tooth Extraction & Impacted Surgery",
    "Diş Beyazlatma (Ofis Tipi Bleaching)": "Teeth Whitening (In-Office Bleaching)",
    "Diş Beyazlatma (Bleaching) Tedavisi": "Teeth Whitening (Bleaching) Treatment",
    "Diş Teli Tedavisi (Ortodonti)": "Braces Treatment (Orthodontics)",
    "Estetik Kompozit Diş Dolgusu": "Aesthetic Composite Dental Filling",
    "Diş Dolgusu & Estetik Bonding Tedavisi": "Dental Fillings & Aesthetic Bonding Treatment",
    "Diş Eti Tedavisi (Periodontoloji)": "Gum Disease Treatment (Periodontology)",
    "Diş Eti Tedavisi & Pembe Estetik": "Gum Treatment & Pink Aesthetics",
    "Çocuk Diş Hekimliği (Pedodonti)": "Pediatric Dentistry (Children)",
    "Porselen Lamine Diş (Yaprak Porselen)": "Porcelain Laminate Veneers",
    "Lamine Diş (Lamina Veneer - Yaprak Porselen)": "Porcelain Laminate Veneers (Dental Veneers)",
    "Protez Diş Tedavisi (Hareketli & Sabit)": "Dental Prosthetics (Removable & Fixed)",
    "Protez Diş Tedavisi & Sabit Diş Köprüleri": "Dental Prosthetics & Fixed Bridges",
    "Porselen Diş Kaplama (Metal Destekli)": "Porcelain Dental Crowns (Metal-Supported)",
    "Porselen Diş Kaplama Tedavisi": "Porcelain Dental Crown Treatment",
    "Diş Çekimi (Atraumatik Cerrahi Çekim)": "Tooth Extraction (Atraumatic Surgical Extraction)",
    "Diş Çekimi & Travmasız Cerrahi": "Tooth Extraction & Atraumatic Surgery",
    "Doğal dişinizi aratmayan çiğneme konforu ve estetik görünüm. Trabzon Meydan'da Dt. Emre Atasoy güvencesiyle acısız, steril ve sertifikalı titanyum implant uygulamaları.": "Natural chewing comfort and flawless aesthetics matching your real teeth. Painless, sterile, certified titanium implant treatments in Trabzon Square by Dr. Emre Atasoy.",
    "Metal desteksiz, ışık geçirgenliği yüksek ve diş etiyle %100 biyolojik uyumlu zirkonyum porselen kaplama ile hayalinizdeki doğal gülüşe kavuşun.": "Attain your ideal natural smile with metal-free, high-translucency, and 100% biocompatible zirconia porcelain crowns.",
    "Derin çürük ve iltihaplı dişlerinizi çekilmekten kurtaran, tek seansta ağrısız ve modern döner alet sistemleriyle uygulanan kök kanal tedavisi rehberi.": "Save decayed and inflamed teeth from extraction with painless, modern rotary-assisted single-session root canal therapy.",
    "Yüz hatlarınıza, ten renginize ve dudak formunuza özel olarak tasarlanan estetik, simetrik ve doğal ışıltılı gülüşler.": "Aesthetic, symmetrical, and naturally radiant smiles custom-designed for your facial features, skin tone, and lip contours.",
    "Gömülü, yarı gömülü veya çapraşıklığa neden olan yirmi yaş dişlerinin çevre dokulara zarar vermeden ağrısız cerrahi çekim süreci.": "Painless surgical extraction of impacted or crowded wisdom teeth safeguarding adjacent nerves and surrounding tissues.",
    "Telsiz, dışarıdan fark edilmeyen şeffaf plaklar (telsiz ortodonti) ile konforlu, estetik ve hızlı diş düzeltme tedavisi.": "Comfortable, discreet, and fast teeth straightening with virtually invisible clear aligners (wireless orthodontics).",
    "Klinik ortamında uygulanan güvenli ofis tipi lazerli beyazlatma ile sararan dişlerinizi 3-4 ton açın, ışıldayan bir gülüşe kavuşun.": "Lighten discolored teeth by 3-4 shades with clinical in-office whitening safely protecting enamel for a radiant smile.",
    "Çapraşık dişler ve çene kapanış bozuklukları için metal ve estetik seramik braketlerle kalıcı ortodonti tedavisi.": "Permanent orthodontic correction for crowded teeth and malocclusion using aesthetic ceramic and metal brackets.",
    "Çürük veya kırık dişlerinizi doğal diş rengiyle birebir uyumlu nano-kompozit estetik dolgu ile ağrısız ve tek seansta restore edin.": "Painlessly restore decayed or fractured teeth in a single session with tooth-colored nano-composite aesthetic fillings.",
    "Diş eti kanaması, çekilmesi ve iltihaplanmaları için kliniğimizde uygulanan derin temizlik, küretaj ve lazer destekli pembe estetik tedavileri.": "Deep scaling, curettage, and laser-assisted pink aesthetics treating gum bleeding, recession, and inflammation.",
    "Çocuklarda korkusuz, eğlenceli ve koruyucu diş hekimliği: Süt dişi tedavileri, florür, fissür örtücü ve travma yönetimi.": "Gentle, fear-free pediatric dentistry: primary tooth care, protective fluoride, fissure sealants, and trauma management.",
    "Minimum diş aşındırması ile uygulanan yaprak porselen (lamina veneer) sayesinde hayalinizdeki kusursuz ön diş estetiğine kavuşun.": "Achieve flawless anterior aesthetics with minimal tooth preparation using ultra-thin porcelain laminate veneers.",
    "Eksik dişlerin tamamlanmasında kullanılan sabit porselen köprüler, damak protezler ve hassas tutuculu modern protez çözümleri.": "Complete your smile with fixed porcelain bridges, precision-attachment dentures, and modern prosthetic dental solutions.",
    "Aşırı madde kaybı olan dişlerin korunması ve çiğneme fonksiyonunun geri kazandırılması için dayanıklı metal destekli porselen kaplama.": "Durable porcelain crowns restoring chewing functionality and protecting teeth with extensive tooth structure loss.",
    "Kurtarılması mümkün olmayan enfekte veya kırık dişlerin çevre kemiğe zarar vermeden travmasız teknikle ağrısız çekimi.": "Gentle and painless extraction of non-restorable infected or fractured teeth while strictly preserving alveolar bone.",
    "İmplantoloji": "Implantology",
    "Estetik Diş Hekimliği": "Aesthetic Dentistry",
    "Endodonti": "Endodontics",
    "Estetik & Hollywood Smile": "Aesthetics & Hollywood Smile",
    "Ağız ve Çene Cerrahisi": "Oral & Maxillofacial Surgery",
    "Telsiz Ortodonti": "Wireless Orthodontics",
    "Bleaching Estetiği": "Bleaching Aesthetics",
    "Ortodonti": "Orthodontics",
    "Restoratif Diş Tedavisi": "Restorative Dentistry",
    "Periodontoloji": "Periodontology",
    "Pedodonti": "Pediatric Dentistry",
    "Yaprak Porselen": "Porcelain Laminate",
    "Protetik Diş Tedavisi": "Prosthetic Dentistry",
    "Sabit Kron Protez": "Fixed Crown Prosthesis",
    "Cerrahi Çekim": "Surgical Extraction",
    "✓ Ağrısız & Acısız Lokal Anestezi": "✓ Painless Local Anesthesia",
    "✓ Sertifikalı Saf Titanyum Vidalar": "✓ Certified Pure Titanium Implants",
    "✓ Doğal Çiğneme ve Konfor": "✓ Natural Chewing & Comfort",
    "✓ Metal Desteksiz Doğal Görünüm": "✓ Metal-Free Natural Look",
    "✓ Diş Etinde Renk Değişimi Yapmaz": "✓ No Gum Discoloration",
    "✓ Yüksek Çiğneme ve Kırılma Direnci": "✓ High Chewing & Fracture Resistance",
    "✓ Doğal Dişi Ağızda Koruma": "✓ Preserving Natural Teeth",
    "✓ Dijital Apeks Bulucu Hassasiyeti": "✓ Digital Apex Locator Precision",
    "✓ Ağrısız Tek Seans Konforu": "✓ Painless Single-Session Comfort",
    "✓ Kişiye Özel Dijital Simülasyon": "✓ Personalized Digital Simulation",
    "✓ Altın Oran Yüz Uyumlu Tasarım": "✓ Golden Ratio Facial Harmony",
    "✓ Doğal ve Çekici Gülümseme": "✓ Natural & Radiant Smile",
    "✓ Komşu Dişleri Koruyan Yaklaşım": "✓ Safeguarding Adjacent Teeth",
    "✓ Konforlu Cerrahi Lokal Anestezi": "✓ Comfortable Surgical Anesthesia",
    "✓ Hızlı Post-Operatif İyileşme": "✓ Rapid Post-Operative Recovery",
    "✓ Dışarıdan Neredeyse Görünmez": "✓ Virtually Invisible Appearance",
    "✓ Yemek Yerken Çıkarılabilme": "✓ Removable During Meals",
    "✓ Ağız İçi Batma ve Yara Yapmaz": "✓ No Mouth Irritation or Wounds",
    "✓ Tek Seansta 3-4 Ton Açılma": "✓ 3-4 Shades Lighter in 1 Session",
    "✓ Mineye Zarar Vermeyen Formül": "✓ Enamel-Safe Clinical Formula",
    "✓ Uzun Süreli Beyazlık Güvencesi": "✓ Long-Lasting Bright Results",
    "✓ Doğru Kapanış & Çiğneme Fonksiyonu": "✓ Correct Bite & Chewing Function",
    "✓ Şeffaf Seramik Braket Seçeneği": "✓ Ceramic Aesthetic Brackets Option",
    "✓ Kalıcı ve Dengeli Çene Yapısı": "✓ Balanced & Lasting Jaw Anatomy",
    "✓ Doğal Diş Rengiyle Birebir Uyum": "✓ Seamless Tooth-Shade Match",
    "✓ Ağrısız Hızlı Uygulama Protokolü": "✓ Painless Rapid Protocol",
    "✓ Dayanıklı Nano-Kompozit Malzeme": "✓ Durable Nano-Composite Material",
    "✓ Kanama ve Ağız Kokusunu Giderme": "✓ Eliminates Bleeding & Halitosis",
    "✓ Kemik Kaybını ve Sallanmayı Önleme": "✓ Halts Bone Loss & Mobility",
    "✓ Sağlıklı Pembe Diş Eti Görünümü": "✓ Healthy Pink Gum Appearance",
    "✓ Korkusuz & Sevgi Dolu İletişim": "✓ Fear-Free Caring Atmosphere",
    "✓ Koruyucu Flor & Fissür Örtücü": "✓ Preventive Fluoride & Sealants",
    "✓ Erken Ortodontik Takip": "✓ Early Orthodontic Monitoring",
    "✓ Minimum Diş Aşındırması (0.3mm)": "✓ Minimal Tooth Prep (0.3mm)",
    "✓ Mükemmel Işık Geçirgenliği": "✓ Natural Light Translucency",
    "✓ Leke Tutmayan Pürüzsüz Yüzey": "✓ Stain-Resistant Glazed Surface",
    "✓ Yüksek Çiğneme ve Konuşma Gücü": "✓ Restored Chewing & Speech Power",
    "✓ Düşmeyen Hassas Tutuculu Seçenekler": "✓ Secure Precision-Attachment Fit",
    "✓ Doğal Ağız Anatomisine Uyum": "✓ Anatomical Natural Gum Fit",
    "✓ Kırılgan Dişleri Güçlendirme": "✓ Reinforcing Fragile Teeth",
    "✓ Kanıtlanmış Uzun Ömürlü Yapı": "✓ Clinically Proven Longevity",
    "✓ Bütçe Dostu Estetik Çözüm": "✓ Budget-Friendly Aesthetic Choice",
    "✓ Doku Dostu & Kemik Koruyucu": "✓ Bone-Preserving Atraumatic Care",
    "✓ İmplant Altyapısını Koruma": "✓ Preserves Site for Future Implants",
    "Detaylı Bilgi & Süreç →": "Detailed Info & Procedure →",
    "Hemen Ara": "Call Now",
    "Hemen Randevu & Fiyat Bilgisi Alın": "Get Appointment & Pricing Info Now",
    "WhatsApp'tan Yazın": "Message on WhatsApp",
    "WhatsApp Randevu Al": "Book on WhatsApp",
    "WhatsApp Randevu Hattı": "WhatsApp Booking Line",
    "Makaleyi Oku →": "Read Article →",
    "Muayene Randevusu Alın": "Book a Consultation",
    "İmplant Muayenesi Alın": "Book Implant Consultation",
    "Hayalinizdeki Gülüşe Kavuşun": "Achieve Your Dream Smile",
    "Hızlı Randevu Alın": "Get a Quick Appointment",
    "İlçenizden Kolay Randevu": "Easy Booking from Your District",
    "Hangi Tedavinin Size Uygun Olduğundan Emin Değil misiniz?": "Not Sure Which Treatment is Best for You?",
    "📍 Ortahisar Meydan Kat:4": "📍 Ortahisar Square Fl:4",
    "🛡️ CE / FDA Onaylı Materyal": "🛡️ CE / FDA Approved Materials",
    "⚡ Ağrısız Lokal Anestezi": "⚡ Painless Local Anesthesia",
    "Tümü": "All",
    "Mesleki Yaklaşım ve Felsefemiz": "Professional Approach & Philosophy",
    "Diş hekimliği yalnızca dişlerin tedavisini yapmak değil; hastanın korku ve kaygılarını anlayarak ona en konforlu ve ağrısız deneyimi yaşatmaktır. <strong>Dt. Emre Atasoy</strong>, 20 yılı aşkın mesleki kariyeri boyunca estetik diş hekimliği, implant cerrahisi, endodonti ve gülüş tasarımı alanlarındaki modern gelişmeleri yakından takip ederek Trabzon'daki kliniğinde uygulamaktadır.": "Dentistry is not merely treating teeth; it is about understanding patient fears and anxieties to deliver the most comfortable, pain-free clinical experience. Throughout his 20+ year medical career, <strong>Dr. Emre Atasoy</strong> has closely embraced modern advancements in aesthetic dentistry, implant surgery, endodontics, and smile design at his Trabzon clinic.",
    "<strong>Önce Koruyucu Diş Hekimliği:</strong> Kliniğimizde temel ilkemiz, doğal diş dokusunu azami ölçüde korumaktır. Kurtarılması mümkün olan hiçbir diş çekilmez; kanal tedavisi, estetik dolgu ve koruyucu yöntemlerle dişe ömür kazandırılır.": "<strong>Preventive Dentistry First:</strong> Our primary principle is to preserve natural tooth structure to the utmost degree. No tooth that can be saved is extracted; longevity is restored through root canal treatment, aesthetic fillings, and preventive care.",
    "Klinik Hijyen ve Sterilizasyon Standartlarımız": "Clinic Hygiene & Sterilization Standards",
    "Kliniğimizde çapraz enfeksiyon riskini tamamen ortadan kaldıran <strong>B sınıfı medikal otoklav cihazları</strong> ile tüm cerrahi ve el aletleri her hasta öncesinde basınçlı buhar altında sterilize edilmekte ve özel ambalajlarda saklanmaktadır. Tek kullanımlık sarf malzemeler (iğne uçları, bardaklar, örtüler, eldivenler vb.) her hastada yenisiyle değiştirilir.": "At our clinic, all surgical and hand instruments are sterilized under pressurized steam using <strong>Class B medical autoclaves</strong> that completely eliminate cross-infection risks, and are stored in individual sterile pouches. Disposable supplies (needle tips, cups, bibs, gloves, etc.) are replaced anew for every single patient.",
    "Kullandığımız Teknolojik Altyapı": "Our Technological Infrastructure",
    "<strong>Dijital Radyoloji:</strong> Minimum radyasyon dozuyla anında net görüntü veren dijital röntgen sistemleri.": "<strong>Digital Radiology:</strong> Modern digital X-ray imaging providing instant, crisp diagnostics with minimal radiation dose.",
    "<strong>Apeks Bulucu & Endomotor:</strong> Kanal tedavisinde kök ucunu milimetrik tespit ederek tedavi başarısını maksimize eden teknoloji.": "<strong>Apex Locator & Endomotor:</strong> Technology maximizing root canal success through millimetric precision apex detection.",
    "<strong>Ağrısız Anestezi:</strong> İğne acısını hissettirmeyen özel lokal anestezi protokolleri.": "<strong>Painless Anesthesia:</strong> Advanced local anesthesia protocols eliminating injection discomfort.",
    "<strong>Uluslararası Sertifikalı Malzemeler:</strong> Yalnızca FDA ve CE onaylı dünya standartlarında implant ve zirkonyum bloklar.": "<strong>Internationally Certified Materials:</strong> Exclusively FDA and CE approved world-class implants and zirconia blocks.",
    "Dt. Emre Atasoy ile birebir görüşmek ve diş sağlığınızı planlamak için WhatsApp'tan doğrudan yazabilirsiniz.": "Contact us directly via WhatsApp to consult in person with Dr. Emre Atasoy and plan your dental care.",
    "Dt. Emre Atasoy ile gülüş analizi planlamak ve randevu almak için WhatsApp üzerinden hemen bize ulaşın.": "Contact us via WhatsApp right now to schedule a smile analysis and book an appointment with Dr. Emre Atasoy.",
    "Dt. Emre Atasoy ile çene yapınıza en uygun implant planlamasını konuşmak ve randevu almak için hemen iletişime geçin.": "Contact us now to discuss the best implant plan for your jaw structure with Dr. Emre Atasoy and book an appointment.",
    "Dt. Emre Atasoy ile görüşmek ve implant tedaviniz hakkında net bilgi almak için WhatsApp'tan yazabilirsiniz.": "Message us on WhatsApp to speak with Dr. Emre Atasoy and receive clear information regarding dental implant treatments.",
    "📍 Resmi Klinik Adresimiz:": "📍 Official Clinic Address:",
    "Kemerkaya mah. Meydan hamam sok. Doktorlar işhanı Kat:4 No:40, 61030 Trabzon Merkez / Trabzon": "Kemerkaya Mah. Meydan Hamam Sok. Doktorlar Business Center Fl:4 No:40, 61030 Ortahisar / Trabzon",
    "Ortahisar": "Ortahisar",
    "Trabzon Meydan Parkı": "Trabzon Square Park",
    "Doktorlar İşhanı": "Doktorlar Business Center",
    "Hamam Sokak": "Hamam Street",
    "Sabit Hat:": "Landline:",
    "Doğrudan WhatsApp Destek & Randevu:": "Direct WhatsApp Support & Appointments:",
    "WhatsApp'tan Hemen Mesaj Yazın": "Send a Message on WhatsApp Now",
    "Trabzon Meydan Merkezi Lokasyon Avantajımız": "Our Central Trabzon Square Location Advantage",
    "Kliniğimiz, Trabzon'un tam merkezinde yer alan <strong>Kemerkaya Mahallesi, Meydan Hamam Sokak, Doktorlar İşhanı Kat:4 No:40</strong> adresindedir. Trabzon Meydan Parkı'na yalnızca 1 dakikalık yürüme mesafesinde olmamız, Trabzon'un tüm ilçelerinden kalkan dolmuş ve otobüslerle aktarmasız ve çok hızlı ulaşım imkanı sağlamaktadır.": "Our clinic is located right in the center of Trabzon at <strong>Kemerkaya Mah., Meydan Hamam Sok., Doktorlar Business Center Fl:4 No:40</strong>. Being just 1 minute on foot from Trabzon Square Park allows direct, fast transit via minibuses and buses departing from all districts.",
    "<strong>İlçelerden Gelen Hastalarımız İçin Özel Randevu Planlaması:</strong> Of, Vakfıkebir, Sürmene gibi mesafeli ilçelerden gelen hastalarımızın mağdur olmaması için randevularını tek seansta birden fazla işlemi tamamlayacak şekilde (aynı gün muayene + röntgen + dolgu/çekim/ölçü) koordine ediyoruz.": "<strong>Special Scheduling for District Patients:</strong> For patients traveling from distant districts like Of, Vakfıkebir, and Sürmene, we coordinate appointments to complete multiple steps in a single session (same-day consultation + X-ray + fillings/extraction/impression).",
    "İlçelere Göre Ulaşım Rehberi": "Transit Guide by District",
    "1. Ortahisar Diş Hekimi Arayan Hastalarımız": "1. Patients Seeking Dentist in Ortahisar",
    "Ortahisar ilçe merkezinde; Uzun Sokak, Maraş Caddesi, Kunduracılar ve Tanjant yoluna birkaç adımlık mesafedeyiz. Meydan'daki katlı otoparklar ve yol üzeri park alanları sayesinde özel aracınızla da kolayca gelebilirsiniz.": "In central Ortahisar, we are within walking distance of Uzun Sokak, Maraş Street, Kunduracılar, and the Tanjant road. Multi-story car parks and street parking around the Square make visiting by car hassle-free.",
    "2. Akçaabat Diş Hekimi Arayan Hastalarımız": "2. Patients Seeking Dentist from Akçaabat",
    "Akçaabat merkezden kalkan sahil dolmuşları veya belediye otobüsleri doğrudan Trabzon Meydan son durağına gelmektedir. Yolculuk ortalama <strong>15-20 dakika</strong> sürmektedir. Meydan durağında inip Hamam Sokak'a 2 dakika yürüyerek Doktorlar İşhanı'na ulaşabilirsiniz.": "Coastal minibuses and city buses departing from central Akçaabat arrive directly at the Trabzon Square final stop. The trip takes approximately <strong>15-20 minutes</strong>. Simply walk 2 minutes towards Hamam Street to reach Doktorlar Business Center.",
    "3. Yomra ve Kaşüstü Diş Hekimi Arayan Hastalarımız": "3. Patients Seeking Dentist from Yomra & Kaşüstü",
    "Yomra ve Kaşüstü bölgesinden hareket eden dolmuşlar sahil veya Tanjant güzergahı üzerinden doğrudan Meydan Parkı'na ulaşır (ortalama <strong>12-15 dakika</strong>). Kliniğimiz dolmuş iniş noktasının hemen arkasındadır.": "Minibuses from Yomra and Kaşüstü travel via the coastal road or Tanjant straight to Square Park (approx. <strong>12-15 minutes</strong>). Our clinic is located right behind the drop-off point.",
    "4. Arsin ve Sürmene Diş Hekimi Arayan Hastalarımız": "4. Patients Seeking Dentist from Arsin & Sürmene",
    "Arsin ve Sürmene ilçe dolmuşları doğrudan Çömlekçi / Meydan ana terminaline yolcu taşımaktadır. Zirkonyum ve implant gibi estetik tedavilerinizde seans saatleri ilçenizin dolmuş saatlerine göre esnek olarak ayarlanır.": "Minibuses from Arsin and Sürmene arrive directly at the Çömlekçi / Square main terminal. For aesthetic treatments like zirconia and implants, appointment times are flexibly scheduled around minibus timetables.",
    "5. Maçka Diş Hekimi Arayan Hastalarımız": "5. Patients Seeking Dentist from Maçka",
    "Maçka dolmuşları doğrudan Trabzon merkez köprüaltı / Meydan bölgesine ulaşmaktadır (ortalama <strong>25 dakika</strong>). Aynı gün içinde muayene ve diş tedavisi planlaması yapılabilir.": "Maçka minibuses reach Trabzon central Square / underbridge area directly (approx. <strong>25 minutes</strong>). Consultations and dental treatments can be completed on the same day.",
    "6. Vakfıkebir, Çarşıbaşı ve Beşikdüzü Diş Hekimi Arayan Hastalarımız": "6. Patients Seeking Dentist from Vakfıkebir, Çarşıbaşı & Beşikdüzü",
    "Batı ilçelerimizden sahil yolu dolmuşlarıyla yaklaşık <strong>35-45 dakikada</strong> Trabzon Meydan'a ulaşmak mümkündür.": "From the western districts, Trabzon Square can be reached via coastal minibuses in approximately <strong>35-45 minutes</strong>.",
    "7. Of ve Çaykara Diş Hekimi Arayan Hastalarımız": "7. Patients Seeking Dentist from Of & Çaykara",
    "Doğu Karadeniz sahil yolu üzerinden Of dolmuşları ile yaklaşık <strong>45 dakikada</strong> kliniğimize ulaşabilirsiniz. Gülüş tasarımı veya implant tedavisi için gelen hastalarımıza özel kombine seanslar oluşturulur.": "You can reach our clinic in about <strong>45 minutes</strong> via Of minibuses along the Black Sea coastal highway. Special combined sessions are arranged for patients traveling for smile design or implants.",
    "Kliniğimizin Tam Konumu ve İletişim": "Exact Location & Contact Details",
    "<strong>Adres:</strong> Kemerkaya Mah. Meydan Hamam Sok. Doktorlar İşhanı Kat:4 No:40, 61030 Ortahisar / Trabzon<br /> <strong>Telefon (Sabit):</strong> 0462 323 35 92<br /> <strong>WhatsApp Randevu:</strong> 0532 775 52 78": "<strong>Address:</strong> Kemerkaya Mah. Meydan Hamam Sok. Doktorlar Business Center Fl:4 No:40, 61030 Ortahisar / Trabzon<br /> <strong>Phone (Landline):</strong> 0462 323 35 92<br /> <strong>WhatsApp Booking:</strong> 0532 775 52 78",
    "<strong>Adres:</strong> Kemerkaya Mah. Meydan Hamam Sok. Doktorlar İşhanı Kat:4 No:40, 61030 Ortahisar / Trabzon<br> <strong>Telefon (Sabit):</strong> 0462 323 35 92<br> <strong>WhatsApp Randevu:</strong> 0532 775 52 78": "<strong>Address:</strong> Kemerkaya Mah. Meydan Hamam Sok. Doktorlar Business Center Fl:4 No:40, 61030 Ortahisar / Trabzon<br> <strong>Phone (Landline):</strong> 0462 323 35 92<br> <strong>WhatsApp Booking:</strong> 0532 775 52 78",
    "Hangi ilçeden geleceğinizi WhatsApp üzerinden iletin, randevunuzu geliş saatinize göre en uygun şekilde planlayalım.": "Let us know which district you are arriving from via WhatsApp, and we will tailor your appointment time to your travel schedule.",
    "İmplant Nedir? Ne Kadar Dayanır ve Sonrası Nelere Dikkat Edilmeli?": "What is a Dental Implant? How Long Does It Last & Post-Care Tips?",
    "İmplant cerrahisinin ömrü, başarı oranı ve operasyon sonrası iyileşmeyi hızlandıran önemli tavsiyeler.": "Dental implant lifespan, success rates, and essential recommendations accelerating post-surgical recovery.",
    "Zirkonyum mu Porselen mi? Hangisi Tercih Edilmeli?": "Zirconia or Porcelain? Which One Should You Choose?",
    "Işık geçirgenliği, diş eti uyumu, dayanıklılık ve maliyet farklarıyla kaplama seçimi rehberi.": "A complete crown selection guide comparing translucency, gum harmony, durability, and cost differences.",
    "Kanal Tedavisi Ne Kadar Sürer? Ağrılı mıdır?": "How Long Does Root Canal Treatment Take? Is It Painful?",
    "Kanal tedavisinin kaç seans sürdüğü, işlem esnasında ağrı hissedilip hissedilmeyeceği ve dişin ömrü.": "How many sessions root canals take, whether discomfort is felt during the procedure, and tooth longevity.",
    "20'lik Diş Ne Zaman Çekilmeli?": "When Should Wisdom Teeth Be Extracted?",
    "Hangi 20 yaş dişlerinin çekilmesi gerektiği, gömülü dişlerin zararları ve çekim sonrası dikkat edilecekler.": "Which wisdom teeth need extraction, the risks of impacted teeth, and post-operative recovery guidance.",
    "Diş Taşı Neden Oluşur ve Nasıl Temizlenir?": "Why Does Tartar Form and How Is It Cleaned?",
    "Tartar oluşumunun nedenleri, temizliğin diş minesi üzerindeki etkisi ve ağız kokusuyla ilişkisi.": "Causes of tartar buildup, scaling impact on tooth enamel, and its direct connection to bad breath.",
    "Diş Beyazlatma Nasıl Yapılır? Kalıcı mıdır?": "How Is Teeth Whitening Done? Is It Permanent?",
    "Ofis tipi lazerli beyazlatma ile ev tipi plakların farkı ve beyazlığın korunma yöntemleri.": "Differences between in-office laser whitening and at-home trays, plus how to maintain long-lasting brightness.",
    "Diş Eti Çekilmesi Neden Olur ve Nasıl Önlenir?": "Why Does Gum Recession Occur and How to Prevent It?",
    "Yanlış fırçalama, genetik faktörler ve diş eti hastalıklarının çekilmeye etkisi ve tedavi yolları.": "Improper brushing, genetics, and periodontal diseases leading to gum recession, plus clinical treatment paths.",
    "Diş Ağrısına Ne İyi Gelir? Kırılan Dişe Ne Yapılır?": "What Relieves Toothache? What to Do with a Broken Tooth?",
    "Gece başlayan ani diş ağrısında evde yapılabilecek ilk yardım ve kırılan diş parçasının korunması.": "Emergency first aid for sudden nighttime toothache and how to safely preserve a broken tooth fragment.",
    "Şeffaf Plak mı Diş Teli mi? Hangisi Daha Avantajlı?": "Clear Aligners or Braces? Which One Is More Advantageous?",
    "Konfor, tedavi süresi, estetik ve fiyat bakımından şeffaf plak ve klasik tel karşılaştırması.": "Comparing clear aligners and traditional braces in terms of comfort, duration, aesthetics, and pricing.",
    "İmplant": "Implant",
    "Estetik Diş": "Aesthetic Dentistry",
    "Çene Cerrahisi": "Oral Surgery",
    "Ağız Hijyeni": "Oral Hygiene",
    "Beyazlatma": "Whitening",
    "Diş Eti": "Gum Health",
    "Acil Diş": "Emergency Dental",
    "📅 Rehber": "📅 Guide",
    "📅 Karşılaştırma": "📅 Comparison",
    "📅 Tedavi Süreci": "📅 Process",
    "📅 Cerrahi Bilgi": "📅 Surgery",
    "📅 Koruyucu Bakım": "📅 Preventive",
    "📅 Estetik Rehber": "📅 Aesthetic",
    "📅 Periodontoloji": "📅 Periodontology",
    "📅 Acil Rehber": "📅 Emergency",
    "Dt. Emre Atasoy": "Dr. Emre Atasoy",
    "Gülüş Tasarımı Nedir?": "What is Smile Design?",
    "İmplant Tedavisi Nedir?": "What is Dental Implant Treatment?",
    "İmplant Tedavisi Nedir? Nasıl Uygulanır?": "What is Dental Implant Treatment? How is it Performed?",
    "Zirkonyum Kaplama Nedir?": "What is a Zirconia Crown?",
    "Kanal Tedavisi Nedir?": "What is Root Canal Treatment?",
    "20'lik Diş Çekimi Nedir?": "What is Wisdom Tooth Extraction?",
    "Şeffaf Plak Tedavisi Nedir?": "What is Clear Aligner Treatment?",
    "Diş Beyazlatma Nedir?": "What is Teeth Whitening?",
    "Diş Teli Tedavisi Nedir?": "What is Braces Treatment?",
    "Diş Dolgusu Nedir?": "What is Dental Filling?",
    "Diş Eti Tedavisi Nedir?": "What is Gum Disease Treatment?",
    "Çocuk Diş Hekimliği Nedir?": "What is Pediatric Dentistry?",
    "Lamine Diş Nedir?": "What are Porcelain Veneers?",
    "Protez Diş Tedavisi Nedir?": "What is Dental Prosthetic Treatment?",
    "Porselen Kaplama Nedir?": "What is Porcelain Crown Treatment?",
    "Diş Çekimi Nedir?": "What is Tooth Extraction?",
    "Gülüş Tasarımında Hangi İşlemler Yapılır?": "What Procedures Are Involved in Smile Design?",
    "Gülüş Tasarımı Ne Kadar Sürer?": "How Long Does Smile Design Take?",
    "İmplant Tedavisi Kimlere Uygulanabilir?": "Who is Eligible for Dental Implants?",
    "İmplant Tedavisi Aşamaları ve Süreç": "Stages and Timeline of Implant Treatment",
    "İmplant Sonrası İyileşme ve Bakım": "Recovery and Care After Implant Surgery",
    "Tedavi Süreci ve Aşamaları": "Treatment Process & Stages",
    "Tedavinin Avantajları": "Advantages of Treatment",
    "Kimler İçin Uygundur?": "Who is It Suitable For?",
    "Sıkça Sorulan Sorular": "Frequently Asked Questions",
    "İmplant operasyonu ağrılı mıdır?": "Is the implant surgery painful?",
    "Trabzon implant fiyatları neye göre belirlenir?": "How are dental implant prices determined in Trabzon?",
    "Kaybedilen doğal dişlerin yerine çene kemiğine yerleştirilen, doku dostu saf titanyum vidalarla uygulanan kalıcı diş kökü tedavisidir.": "Permanent tooth root treatment applied with biocompatible pure titanium screws placed into the jawbone to replace lost natural teeth.",
    "Metal altyapı içermeyen, ışık geçirgenliği doğal diş minesiyle birebir örtüşen premium kaplama yöntemidir. Diş etinde morarma yapmaz.": "A premium metal-free crown solution whose light translucency perfectly matches natural enamel. Prevents dark gum edges.",
    "Derin çürük veya travma sonucu iltihaplanan diş sinirinin ağrısız temizlenip biyolojik dolgu materyalleriyle kapatılarak dişin kurtarılmasıdır.": "Saving the tooth by painlessly cleaning inflamed pulp caused by deep decay or trauma and sealing it with biocompatible fillings.",
    "Hastanın yüz hatları, dudak çizgisi ve ten rengi analiz edilerek kişiye özel planlanan multi-disipliner Hollywood gülüşü estetiğidir.": "A multidisciplinary Hollywood smile aesthetic tailored individually by analyzing facial contours, lip line, and skin tone.",
    "Gömülü veya yarı gömülü kalarak komşu dişleri sıkıştıran, ağrı ve apse yapan yirmi yaş dişlerinin cerrahi yöntemle ağrısız çekilmesidir.": "Painless surgical extraction of impacted or semi-impacted wisdom teeth causing crowding, pain, or recurrent abscesses.",
    "Geleneksel metal braketler olmadan, dışarıdan fark edilmeyen şeffaf aligner plaklarla diş çapraşıklıklarını düzelten konforlu yöntemdir.": "A discreet, comfortable method straightening crooked teeth using nearly invisible removable aligners without metal brackets.",
    "Çay, kahve ve sigara lekelenmelerini klinik ortamında ofis tipi özel lazer jelleriyle mineye zarar vermeden 3-4 ton açan estetik işlemdir.": "An in-office clinical procedure lightening teeth by 3-4 shades safely without harming enamel, removing tea, coffee, and tobacco stains.",
    "Çapraşık diş dizilimleri, çene darlığı ve kapanış bozukluklarını estetik porselen veya metal braketlerle kalıcı olarak düzelten uzmanlık alanıdır.": "Orthodontic specialty permanently correcting crowded teeth, narrow jaws, and malocclusions using aesthetic ceramic or metal brackets.",
    "Çürüyen veya kırılan diş dokusunun temizlenerek diş rengine birebir uyumlu nano-hibrit kompozit dolgu materyalleriyle restore edilmesidir.": "Restoring decayed or chipped tooth structure with tooth-colored nano-hybrid composite materials matching natural shades perfectly.",
    "Diş eti kanaması, çekilmesi ve periodontitis kaynaklı kemik erimelerini durduran derin küretaj ve lazer destekli diş eti sağlığı tedavisidir.": "Deep curettage and laser-supported therapy stopping gum bleeding, recession, and bone loss caused by periodontitis.",
    "0-13 yaş grubu çocuklarda süt ve daimi dişlerin korunması, fissür örtücü, florür uygulamaları ve diş hekimi fobisini önleyen sıcak klinik yaklaşımıdır.": "Protecting primary and permanent teeth in ages 0-13 with fluoride, fissure sealants, and a warm approach preventing dental phobia.",
    "Diş yüzeyinde minimum aşındırma ile uygulanan, tırnak kalınlığında ultra ince porselen yaprakçıklarla kusursuz ön diş estetiği sağlar.": "Ultra-thin fingernail-thickness porcelain shells bonded with minimal tooth preparation (0.3mm) for flawless anterior smile beauty.",
    "Çoklu diş kayıplarında sabit köprüler, hassas tutuculu çıtçıtlı protezler veya total damak protezleriyle çiğneme fonksiyonunun geri kazandırılmasıdır.": "Restoring chewing and speech in multiple missing teeth using fixed bridges, precision-attachment snap dentures, or full dentures.",
    "Aşırı madde kaybına uğramış dişlerin güçlendirilmesi için uygulanan dayanıklı, ekonomik ve estetik diş kaplama alternatifidir.": "A durable, budget-friendly, and aesthetic crown option applied to strengthen heavily damaged or fragile teeth.",
    "Kurtarılması mümkün olmayan enfekte dişlerin çevre kemik dokusu korunarak travmasız (atraumatik) teknikle ağrısız çekilmesidir.": "Painless extraction of non-restorable infected teeth preserving surrounding alveolar bone using gentle atraumatic techniques.",
    "© 2026 Dt. Emre Atasoy - Trabzon Diş Kliniği. Tüm Hakları Saklıdır.": "© 2026 Dr. Emre Atasoy - Trabzon Dental Clinic. All Rights Reserved.",
    "© 2026 Dt. Emre Atasoy - Trabzon Diş Kliniği.": "© 2026 Dr. Emre Atasoy - Trabzon Dental Clinic.",
    "<strong>Yasal Bilgilendirme:</strong> Bu sitedeki içerikler yalnızca bilgilendirme amaçlıdır; tanı ve tedavi niteliği taşımaz. Kişiye özel tedavi için lütfen hekim muayenesine başvurunuz.": "<strong>Legal Notice:</strong> The content on this website is for informational purposes only and does not constitute medical diagnosis or treatment. Please consult our dentist for individual diagnosis and care.",
    "Blog": "Blog",
    "Yazan: Dt. Emre Atasoy • Trabzon Diş Hekimi": "Written by: Dr. Emre Atasoy • Trabzon Dentist",
    "Diş Ağrısı & Kırık Diş": "Toothache & Broken Tooth",
    "Diş Beyazlatma": "Teeth Whitening",
    "Diş Eti Çekilmesi": "Gum Recession",
    "Diş Taşı Temizliği": "Dental Scaling & Cleaning",
    "İmplant Nedir?": "What is an Implant?",
    "Kanal Tedavisi Rehberi": "Root Canal Guide",
    "Şeffaf Plak mı Diş Teli mi?": "Clear Aligners or Braces?",
    "Zirkonyum mu Porselen mi?": "Zirconia or Porcelain?",
    "Her 20'lik Diş Çekilmeli midir?": "Does Every Wisdom Tooth Need to Be Extracted?",
    "Hangi Durumlarda Çekim Zorunludur?": "In Which Cases Is Extraction Mandatory?",
    "Hayır. Çene kemiğinde yeterli yer bularak düzgün sürmüş, karşı çenedeki dişle düzgün kapanış yapan ve fırçalanabilen 20'lik dişlerin çekilmesine kesinlikle gerek yoktur.": "No. Wisdom teeth that have erupted properly with adequate jaw space, bite properly against the opposing tooth, and can be kept clean do not need to be extracted at all.",
    "Kliniğimizdeki çekim prosedürünü incelemek için: <a href=\"../tedaviler/trabzon-20lik-dis-cekimi.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon 20'lik Diş Çekimi Sayfası →</a>": "To review our extraction procedure: <a href=\"../tedaviler/trabzon-20lik-dis-cekimi.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Wisdom Tooth Extraction Page →</a>",
    "<strong>Yarı Gömülü Kalma ve Diş Eti İltihabı:</strong> Dişin sadece bir kısmı çıkmışsa, üzerindeki diş eti cebinde yemek artıkları birikir ve perikoronitis (şiddetli apse ve çene kilitlenmesi) yaratır.": "<strong>Partially Impacted & Gum Infection:</strong> If only part of the tooth has erupted, food debris collects under the gum flap, triggering pericoronitis (severe abscess and jaw lock).",
    "<strong>Önündeki Dişi Çürütme:</strong> 20'lik diş öne doğru yatık sürdüğünde, komşu 2. azı dişin kökünü baskıyla eritir veya temizlenemeyen aralıkta derin çürük oluşturur.": "<strong>Decaying Adjacent Teeth:</strong> When a wisdom tooth erupts angled forward, pressure resorbs the adjacent molar root or causes deep decay in the uncleansable gap.",
    "<strong>Ortodontik Çapraşıklık Riski:</strong> Çenedeki dişleri öne iterek ön grup dişlerin çapraşıklaşmasına neden oluyorsa.": "<strong>Risk of Orthodontic Crowding:</strong> If it pushes adjacent teeth forward, causing crowding in anterior teeth.",
    "<strong>Kist ve Tümör Oluşumu:</strong> Gömülü dişin etrafındaki dokuda kistik lezyon saptanmışsa.": "<strong>Cyst & Tumor Formation:</strong> If a cystic lesion is detected in the tissue surrounding an impacted tooth.",
    "20'lik Diş Kontrolü": "Wisdom Tooth Checkup",
    "Panoramik röntgen ile 20'lik dişlerinizin konumunu değerlendirmek için WhatsApp'tan hemen randevu alın.": "Book an appointment via WhatsApp now to evaluate your wisdom teeth positioning with a panoramic X-ray.",
    "Gece Başlayan Şiddetli Diş Ağrısında Ne Yapılmalı?": "What to Do for Severe Nighttime Toothache?",
    "Diş Kırıldığında Ne Yapılmalı?": "What to Do When a Tooth Breaks?",
    "Travma veya sert bir cisim ısırma sonucu dişiniz kırıldıysa; kırılan parçayı bulun ve <strong>bir miktar süt veya hastanın kendi tükürüğü içinde</strong> muhafaza ederek en geç 1-2 saat içinde kliniğimize gelin. Çoğu zaman kırılan parça estetik bonding ile yerine yeniden yapıştırılabilmektedir.": "If your tooth is fractured due to trauma or biting hard objects, locate the broken fragment and preserve it in <strong>a small amount of milk or the patient's own saliva</strong>, reaching our clinic within 1–2 hours. In most cases, the piece can be aesthetically bonded back into place.",
    "Ağzınızı ılık tuzlu su veya karbonatlı su ile nazikçe çalkalayarak diş aralarındaki yemek artıklarını temizleyin.": "Gently rinse your mouth with warm salt water or baking soda solution to clear food residues between teeth.",
    "Diş aralarında sıkışmış besinleri diş ipi yardımıyla çıkarın.": "Remove any trapped food particles between teeth using dental floss.",
    "<strong>Sakın Yapmayın:</strong> Ağrıyan dişin üzerine kesinlikle kolonya, aspirin, alkol veya tütün basmayın! Bu maddeler diş etinde kimyasal yanık oluşturarak ağrıyı katbekat artırır.": "<strong>Never Do This:</strong> Do not place cologne, aspirin, alcohol, or tobacco directly on the aching tooth! These substances cause severe chemical burns on gum tissue, worsening the pain.",
    "Hekiminizin önereceği güvenli bir ağrı kesici alarak vakit kaybetmeden kliniğimize başvurun.": "Take a safe pain reliever recommended by your healthcare provider and visit our clinic promptly.",
    "Acil Diş Randevusu": "Emergency Dental Booking",
    "Acil diş ağrısı veya kırık diş durumunda doğrudan WhatsApp hattımıza yazarak hızlı randevu alabilirsiniz.": "In case of urgent toothache or broken teeth, write directly to our WhatsApp line for an emergency appointment.",
    "Klinik Tipi Diş Beyazlatma Nasıl Yapılır?": "How Is In-Office Teeth Whitening Performed?",
    "Beyazlık Ne Kadar Süre Kalıcıdır?": "How Long Does the Whitening Result Last?",
    "Klinik ortamında uygulanan profesyonel beyazlatma işleminde önce diş etleri özel koruyucu bariyer ile izole edilir. Ardından diş minesi üzerine hidrojen peroksit bazlı medikal jel sürülür ve özel ışık kaynağıyla 15'er dakikalık seanslar halinde aktive edilir. İşlem toplam 45-60 dakikada biter.": "In professional clinical whitening, gums are first isolated with a protective barrier. Then, a hydrogen peroxide medical gel is applied to enamel and activated with a specialized light source in 15-minute cycles. The procedure takes approximately 45–60 minutes.",
    "Elde edilen beyazlık hastanın beslenme alışkanlıklarına göre <strong>1 ila 3 yıl</strong> arasında korunur. İşlem sonrasındaki ilk 48 saat \"beyaz diyet\" (çay, kahve, salça, kırmızı şarap, sigara tüketmeme) kuralına uyulması kalıcılık için çok kritiktir.": "The whitening effect is maintained for <strong>1 to 3 years</strong> depending on dietary habits. Following a \"white diet\" (avoiding tea, coffee, tomato paste, red wine, and smoking) for the first 48 hours is critical for lasting results.",
    "Işıltılı Bir Gülüş İçin": "For a Radiant Smile",
    "Klinik tipi diş beyazlatma fiyatı ve randevusu için WhatsApp hattımızdan bize ulaşabilirsiniz.": "Contact our WhatsApp line for in-office teeth whitening pricing and appointments.",
    "Diş Eti Çekilmesinin Başlıca Nedenleri": "Main Causes of Gum Recession",
    "Diş Eti Çekilmesi Nasıl Tedavi Edilir?": "How Is Gum Recession Treated?",
    "Öncelikle çekilmeye yol açan neden ortadan kaldırılır (diş taşı temizliği, doğru fırçalama eğitimi veya gece plağı uygulaması). İleri vakalarda ise açığa çıkan kök yüzeyleri bağ dokusu greftleri veya pembe estetik uygulamalarıyla kapatılarak hassasiyet giderilir.": "First, the underlying cause is eliminated (scaling, brushing technique guidance, or night guards). In advanced cases, exposed roots are covered with connective tissue grafts or pink aesthetic surgery to eliminate sensitivity.",
    "<strong>Sert ve Yanlış Diş Fırçalama:</strong> Dişleri yatay ve aşırı bastırarak fırçalamak diş etini aşındırarak geriye çeker.": "<strong>Aggressive & Improper Brushing:</strong> Brushing horizontally with excessive pressure abrades and recedes gum tissue.",
    "<strong>Periodontal İltihap (Diş Taşları):</strong> Temizlenmeyen diş taşları kemiği eriterek diş etinin de aşağıya çekilmesine sebep olur.": "<strong>Periodontal Inflammation (Calculus):</strong> Uncleaned tartar degrades bone, causing the overlying gum tissue to recede.",
    "<strong>Diş Sıkma ve Gıcırdatma (Bruksizm):</strong> Aşırı yük altında kalan diş köklerinde mikro çatlaklar ve diş eti çekilmeleri başlar.": "<strong>Teeth Grinding & Clenching (Bruxism):</strong> Excessive forces on roots initiate micro-fractures and gum recession.",
    "<strong>Genetik Faktörler:</strong> İnce diş eti biyotipi çekilmeye daha yatkındır.": "<strong>Genetic Factors:</strong> Thin gum biotypes are inherently more prone to recession.",
    "Diş Eti Muayenesi": "Gum Health Consultation",
    "Kök hassasiyetiniz veya diş eti çekilmeniz varsa erken müdahale için WhatsApp'tan randevu alın.": "If you have root sensitivity or gum recession, book via WhatsApp for early preventive intervention.",
    "Diş Taşı (Tartar) Nedir?": "What is Dental Calculus (Tartar)?",
    "Diş Taşı Temizliği Diş Minesine Zarar Verir mi?": "Does Dental Scaling Harm Tooth Enamel?",
    "Temizlik Yapılmazsa Ne Olur?": "What Happens if Tartar is Not Cleaned?",
    "Yemeklerden sonra diş yüzeyinde biriken bakteri plağı düzenli fırçalanmadığında tükürükteki kalsiyum ve minerallerle birleşerek kireçleşir. Sertleşen bu yapıya <strong>diş taşı (tartar)</strong> denir. Diş taşı oluştuktan sonra artık normal diş fırçasıyla çıkarılamaz; mutlaka hekim müdahalesi gerekir.": "Plaque accumulated on tooth surfaces after meals calcifies with saliva minerals if not brushed away regularly. This hardened deposit is called <strong>tartar (calculus)</strong>. Once formed, it cannot be removed with a standard toothbrush; professional clinical scaling is required.",
    "Toplumda en sık rastlanan yanlış inanışlardan biri temizliğin mineyi çizdiği veya dişleri araladığı iddiasıdır. <strong>Bu tamamen yanlıştır.</strong> Ultrasonik cihazlar sadece titreşim ve su püskürterek dişe yapışmış yabancı kireç tabakasını döker; diş minesine dokunmaz ve zarar vermez.": "One common myth claims scaling scratches enamel or creates gaps between teeth. <strong>This is completely false.</strong> Ultrasonic devices use micro-vibrations and water spray solely to dislodge foreign calcified deposits without touching or abrading tooth enamel.",
    "Temizlenmeyen diş taşları diş etinin altına doğru ilerleyerek diş eti cebi oluşturur, kemiği eritir ve dişlerin sallanıp dökülmesine yol açar. Bu nedenle her bireyin <strong>6 ayda bir</strong> diş taşı temizliği yaptırması önerilir.": "Uncleaned tartar advances beneath the gumline, creating periodontal pockets, eroding alveolar bone, and eventually loosening teeth. Therefore, routine scaling every <strong>6 months</strong> is strongly advised.",
    "Diş Taşı Temizliği Randevusu": "Dental Scaling Appointment",
    "Daha ferah bir nefes ve sağlıklı diş etleri için kliniğimizden hemen temizlik randevusu alın.": "Book an appointment now for fresher breath and healthier gums.",
    "Dental İmplant Ne Kadar Dayanır?": "How Long Does a Dental Implant Last?",
    "İmplant Sonrası Nelere Dikkat Edilmeli?": "Post-Operative Care After Implants",
    "Eksik dişler sadece estetik bir kayıp yaratmakla kalmaz; çiğneme dengesini bozar, komşu dişlerin boşluğa devrilmesine neden olur ve zamanla çene kemiğinin erimesine yol açar. Günümüzde eksik diş tedavisinde altın standart <strong>dental implant</strong> uygulamalarıdır.": "Missing teeth cause more than aesthetic loss; they disrupt chewing balance, tilt neighboring teeth, and cause jawbone resorption over time. Today, the gold standard in tooth replacement is <strong>dental implants</strong>.",
    "İmplantlar dokuyla %100 uyumlu titanyum materyalden üretilir ve kemikle biyolojik olarak kaynaşır. Literatür verileri ve klinik deneyimlerimiz göstermektedir ki, iyi bir ağız hijyeni ve düzenli hekim kontrolleri sağlandığında implantların başarı oranı <strong>%98'in üzerindedir</strong> ve çoğu hastada <strong>ömür boyu</strong> sorunsuz hizmet verir.": "Implants are made from 100% biocompatible titanium that integrates naturally with bone. Clinical data and our experience demonstrate a success rate <strong>exceeding 98%</strong> with good oral hygiene and checkups, lasting <strong>a lifetime</strong> for most patients.",
    "Trabzon Meydan'daki kliniğimizde implant tedavilerimiz hakkında detaylı bilgi ve muayene için bize ulaşabilirsiniz: <a href=\"../tedaviler/trabzon-implant.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon İmplant Tedavisi Detayları →</a>": "Contact us for detailed information and examination regarding dental implants at our Trabzon Square clinic: <a href=\"../tedaviler/trabzon-implant.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Dental Implant Details →</a>",
    "<strong>İlk 24 Saat:</strong> Sıcak gıdalardan kaçınılmalı, soğuk veya ılık yumuşak yiyecekler tercih edilmelidir. Tükürme veya pipetle içme yapılmamalıdır.": "<strong>First 24 Hours:</strong> Avoid hot foods; choose cold or lukewarm soft foods. Avoid spitting or using straws.",
    "<strong>Sigara Kullanımı:</strong> İyileşme döneminde sigara kemik kaynaşmasını olumsuz etkilediğinden kesinlikle ara verilmelidir.": "<strong>Smoking:</strong> Strictly abstain from smoking during recovery as it severely impairs osseointegration.",
    "<strong>Ağız Temizliği:</strong> Ertesi günden itibaren dikişli bölgeyi zedelemeden dişler nazikçe fırçalanmalı ve hekimin önerdiği gargaralar kullanılmalıdır.": "<strong>Oral Hygiene:</strong> Brush teeth gently from the next day avoiding sutures, and use prescribed mouthwash.",
    "<strong>İlaç Tedavisi:</strong> Reçete edilen antibiyotik ve ağrı kesiciler saatlerine uygun olarak eksiksiz tüketilmelidir.": "<strong>Medication:</strong> Take prescribed antibiotics and analgesics on time without skipping doses.",
    "İmplant Hakkında Soru Sorun": "Ask About Dental Implants",
    "Kendi durumunuza özel implant süreci ve fiyatları hakkında WhatsApp'tan Dt. Emre Atasoy kliniğine danışın.": "Consult Dr. Emre Atasoy clinic on WhatsApp regarding personalized implant timelines and pricing.",
    "Kanal Tedavisi Ağrılı mıdır?": "Is Root Canal Treatment Painful?",
    "Kanal Tedavisi Kaç Seans Sürer?": "How Many Sessions Does Root Canal Take?",
    "Halk arasında kanal tedavisinin çok acı verici olduğu yönünde yaygın bir inanış vardır; oysa bu durum gerçeği yansıtmaz. Kanal tedavisi, tam tersine hastayı diş ağrısından kurtaran işlemdir. Gelişmiş lokal anestezi altında yapıldığından <strong>tedavi sırasında hiçbir ağrı hissedilmez</strong>.": "There is a common misconception that root canal therapy is agonizing; however, this is far from reality. Root canal therapy actually relieves the patient's pain. Performed under advanced local anesthesia, <strong>no pain is felt during treatment</strong>.",
    "Gelişen teknoloji, dijital apeks bulucular ve döner alet sistemleri sayesinde günümüzde çoğu kanal tedavisi <strong>tek seansta (yaklaşık 45-60 dakika)</strong> başarıyla tamamlanmaktadır. Ancak kök ucunda kist veya yoğun apse olan vakalarda kanala ilaç konularak 1 hafta sonra 2. seansta kapatma yapılabilir.": "Modern apex locators and rotary systems allow most root canal therapies to be completed successfully in <strong>a single session (about 45–60 minutes)</strong>. For severe infections or cysts, medicament is placed in the canals and sealed in a second session after one week.",
    "Trabzon Meydan'daki kliniğimizde kanal tedavisi hakkında detaylı bilgi için: <a href=\"../tedaviler/trabzon-kanal-tedavisi.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Kanal Tedavisi Sayfası →</a>": "For detailed info on root canal treatment at our Trabzon Square clinic: <a href=\"../tedaviler/trabzon-kanal-tedavisi.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Root Canal Page →</a>",
    "Diş Ağrınız mı Var?": "Do You Have Toothache?",
    "Kanal tedavisi randevusu almak için WhatsApp hattımıza hemen yazabilirsiniz.": "Message our WhatsApp line right now to book a root canal appointment.",
    "Ortodontide Karşılaştırma: Şeffaf Plak vs Metal Diş Teli": "Orthodontic Comparison: Clear Aligners vs Metal Braces",
    "Çapraşık diş tedavisinde son yıllarda şeffaf plakların popülaritesi hızla artmıştır. Peki sizin için hangisi daha uygun?": "Clear aligners have rapidly surged in popularity for treating crowded teeth. But which option is right for you?",
    "<strong>Şeffaf Plak:</strong> Dışarıdan tamamen görünmezdir; yetişkin hastalar için iş ve sosyal hayatta büyük konfor sağlar.<br /> <strong>Diş Teli:</strong> Metal braketler belirgin şekilde görünür; porselen braketler daha estetiktir ancak yine de bir miktar fark edilir.": "<strong>Clear Aligners:</strong> Completely discreet from the outside, offering great convenience in work and social life.<br /> <strong>Braces:</strong> Metal brackets are visibly noticeable; ceramic brackets offer better aesthetics but remain visible.",
    "<strong>Şeffaf Plak:</strong> Dışarıdan tamamen görünmezdir; yetişkin hastalar için iş ve sosyal hayatta büyük konfor sağlar.<br> <strong>Diş Teli:</strong> Metal braketler belirgin şekilde görünür; porselen braketler daha estetiktir ancak yine de bir miktar fark edilir.": "<strong>Clear Aligners:</strong> Completely discreet from the outside, offering great convenience in work and social life.<br> <strong>Braces:</strong> Metal brackets are visibly noticeable; ceramic brackets offer better aesthetics but remain visible.",
    "<strong>Şeffaf Plak:</strong> Yemek yerken çıkarılır; yiyecek kısıtlaması (elma ısırma, kuruyemiş vb.) yoktur. Fırçalama ve diş ipi kullanımı son derece pratiktir.<br /> <strong>Diş Teli:</strong> Sert ve yapışkan yiyecekler telleri koparabildiği için yasaktır; braket aralarını temizlemek özel fırçalar gerektirir.": "<strong>Clear Aligners:</strong> Removed during meals with no food restrictions (biting apples, nuts, etc.). Daily brushing and flossing are effortless.<br /> <strong>Braces:</strong> Hard and sticky foods are restricted to avoid breaking wires; cleaning requires specialized interdental brushes.",
    "<strong>Şeffaf Plak:</strong> Yemek yerken çıkarılır; yiyecek kısıtlaması (elma ısırma, kuruyemiş vb.) yoktur. Fırçalama ve diş ipi kullanımı son derece pratiktir.<br> <strong>Diş Teli:</strong> Sert ve yapışkan yiyecekler telleri koparabildiği için yasaktır; braket aralarını temizlemek özel fırçalar gerektirir.": "<strong>Clear Aligners:</strong> Removed during meals with no food restrictions (biting apples, nuts, etc.). Daily brushing and flossing are effortless.<br> <strong>Braces:</strong> Hard and sticky foods are restricted to avoid breaking wires; cleaning requires specialized interdental brushes.",
    "Hafif ve orta derece çapraşıklıklarda estetik ve konfor arayan hastalarımıza <strong>Şeffaf Plak</strong> önerirken, ileri derecedeki iskeletsel çene problemlerinde <strong>klasik diş telleri</strong> daha uygun bir çözüm olabilmektedir.": "For mild to moderate crowding where aesthetics and comfort matter, we recommend <strong>Clear Aligners</strong>, while severe skeletal bite discrepancies may require <strong>traditional braces</strong>.",
    "Kliniğimizdeki şeffaf plak tedavisi hakkında daha fazla bilgi: <a href=\"../tedaviler/trabzon-seffaf-plak.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Şeffaf Plak Sayfası →</a>": "Learn more about clear aligner treatment at our clinic: <a href=\"../tedaviler/trabzon-seffaf-plak.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Clear Aligners Page →</a>",
    "Ortodonti Değerlendirmesi": "Orthodontic Evaluation",
    "Hangi yöntemin sizin için uygun olduğunu öğrenmek için WhatsApp'tan fotoğrafınızı iletebilir veya muayene randevusu alabilirsiniz.": "Send photos via WhatsApp or book an appointment to find out which method suits you best.",
    "Zirkonyum ve Klasik Porselen Arasındaki Temel Farklar": "Core Differences Between Zirconia and Traditional Porcelain",
    "Diş kaplaması yaptırmak isteyen hastalarımızın en sık sorduğu soru şudur: <em>\"Zirkonyum mu yaptırmalıyım, yoksa klasik porselen mi?\"</em>": "Patients considering dental crowns most frequently ask: <em>\"Should I choose zirconia crowns or traditional porcelain?\"</em>",
    "Klasik porselenlerin alt yapısında gri metal alaşım bulunur. Bu metal ışığı geçirmez ve dişin mat görünmesine neden olur. <strong>Zirkonyum</strong> ise beyaz renkli ve ışık geçirgen bir mineraldir. Bu sayede doğal diş minesi gibi parıldar.": "Traditional porcelain uses a gray metal substructure which blocks light, causing a dull appearance. <strong>Zirconia</strong> is a naturally white, light-transmitting mineral that sparkles just like natural tooth enamel.",
    "Metal destekli kaplamalarda zamanla diş eti çekilirse diş eti sınırında koyu renkli gri metal hattı açığa çıkar. Zirkonyumda ise metal bulunmadığından diş eti çekilse dahi doğal beyazlık korunur.": "In metal-based crowns, if gums recede over time, a dark gray metal line becomes visible. Zirconia is 100% metal-free, ensuring natural aesthetics even if gums recede.",
    "Ön dişlerde estetik bir gülüş tasarımı hedefleniyorsa <strong>Zirkonyum</strong> mutlak tavsiyemizdir. Arka çiğneme bölgesinde ise bütçeye göre hem zirkonyum hem de klasik porselen tercih edilebilir.": "For aesthetic smile makeovers on anterior teeth, <strong>Zirconia</strong> is our unconditional recommendation. For posterior molars, both zirconia and porcelain are suitable options depending on budget.",
    "Kliniğimizdeki zirkonyum uygulamalarını incelemek için: <a href=\"../tedaviler/trabzon-zirkonyum-kaplama.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Zirkonyum Kaplama Sayfası →</a>": "To explore our zirconia procedures: <a href=\"../tedaviler/trabzon-zirkonyum-kaplama.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Zirconia Crowns Page →</a>",
    "Hangi Kaplama Size Uygun?": "Which Crown is Right for You?",
    "Ağız yapınıza en uygun diş kaplama türünü belirlemek için WhatsApp'tan hemen randevu oluşturun.": "Book an appointment now via WhatsApp to determine the ideal crown for your dental needs.",
    "Çene kemiğine baskı yapan, iltihaba yol açan veya gömülü kalan 20 yaş dişlerinin ağrısız ve cerrahi uzmanlıkla çekilmesi.": "Painless, expert surgical extraction of wisdom teeth causing jaw pressure, recurring infections, or remaining impacted.",
    "20'lik Dişler Neden Sorun Yaratır?": "Why Do Wisdom Teeth Cause Problems?",
    "20'lik Diş Çekimi Ağrılı mıdır?": "Is Wisdom Tooth Extraction Painful?",
    "Çekim Sonrası Nelere Dikkat Edilmeli?": "Post-Extraction Care & Instructions",
    "20 yaş dişleri (üçüncü azı dişleri) insan çenesinde en son süren dişlerdir. Çoğu zaman çene kavisinde yeterli yer bulunmadığı için diş kemik içinde gömülü kalır, eğri sürer veya yarı gömülü kalarak diş eti cebinde sürekli enfeksiyon (perikoronitis) ve şiddetli ağrı yaratır.": "Wisdom teeth (third molars) are the last teeth to erupt in the human jaw. Due to limited arch space, they often remain impacted in bone, erupt sideways, or remain semi-impacted, causing chronic gum infection (pericoronitis) and acute pain.",
    "Kliniğimizde uygulanan güçlü lokal anestezi sayesinde operasyon tamamen ağrısızdır. Hekimimiz kemik ve çevre dokulara saygılı mikro cerrahi teknikleri kullandığı için işlem sonrası şişlik ve ağrı minimum seviyede tutulur.": "Thanks to modern local anesthetics administered at our clinic, the procedure is completely painless. Our dentist applies minimally invasive microsurgical techniques to protect bone and soft tissue, minimizing post-operative swelling and discomfort.",
    "Çekim bölgesine konulan tampon gazlı bez 30-45 dakika sıkıca ısırılmalıdır.": "Bite firmly on the gauze pad placed over the extraction site for 30–45 minutes.",
    "Tükürme yapılmamalı ve pipetle içecek tüketilmemelidir (kan pıhtısının korunması için).": "Avoid spitting and do not drink through a straw (to preserve the critical blood clot).",
    "İlk 24 saat sıcak banyo ve sıcak yemeklerden kaçınılmalı, dışarıdan soğuk kompres uygulanmalıdır.": "Avoid hot baths and steaming meals during the first 24 hours, and apply cold compresses externally.",
    "20'lik Diş Ağrısı Çekmeyin": "Do Not Suffer from Wisdom Tooth Pain",
    "Röntgen kontrolü ve acısız çekim randevusu için doğrudan WhatsApp hattımızdan bize yazın.": "Message our WhatsApp line directly for an X-ray evaluation and painless extraction appointment.",
    "Çocuklarımızın diş hekimi korkusu yaşamadan, eğlenceli ve güvenli bir ortamda sağlıklı diş gelişiminin takip edilmesi.": "Monitoring our children's healthy dental development in a comforting, friendly atmosphere without dental anxiety.",
    "Koruyucu Çocuk Diş Hekimliği": "Preventive Pediatric Dentistry",
    "Kliniğimizde Uygulanan Çocuk Diş Tedavileri": "Pediatric Dental Treatments at Our Clinic",
    "Süt dişleri, çocuğun beslenmesi ve konuşması kadar altından gelecek kalıcı dişlerin yerini tutan doğal yer tutuculardır. Bu nedenle \"nasıl olsa düşecek\" diyerek süt dişleri ihmal edilmemelidir.": "Baby teeth are vital not only for nutrition and speech development but also as natural space maintainers for permanent teeth. Therefore, they should never be neglected assuming \"they will fall out anyway\".",
    "<strong>Fissür Örtücü (Diş Aşısı):</strong> Azı dişlerinin çiğneme yüzeyindeki derin girintilerin özel koruyucu reçine ile kapatılarak çürük oluşumunun engellenmesi.": "<strong>Fissure Sealant (Dental Shield):</strong> Sealing deep grooves on molar chewing surfaces with a protective resin to prevent cavity formation.",
    "<strong>Lokal Flor Uygulaması:</strong> Diş minelerini asitlere karşı güçlendiren koruyucu florlama.": "<strong>Topical Fluoride Application:</strong> Professional fluoride treatment reinforcing enamel resistance against acids and decay.",
    "<strong>Süt Dişi Dolgusu ve Kanal Tedavisi (Amputasyon):</strong> Çürük süt dişlerinin düşme vaktine kadar ağızda sağlıklı kalması için yapılan tedaviler.": "<strong>Baby Tooth Fillings & Pulpotomy:</strong> Treatments ensuring decayed primary teeth remain healthy and functional until their natural exfoliation time.",
    "Çocuğunuz İçin Randevu Alın": "Book an Appointment for Your Child",
    "Korkusuz ve şefkatli bir diş muayenesi için Dt. Emre Atasoy kliniğine WhatsApp'tan randevu yazabilirsiniz.": "Contact Dr. Emre Atasoy's clinic via WhatsApp for a gentle, fear-free pediatric dental checkup.",
    "Çay, kahve ve sigara lekelerine veda edin. Klinik ortamında güvenli ve kalıcı beyazlatma ile bembeyaz bir gülüş.": "Say goodbye to tea, coffee, and smoking stains. Achieve a sparkling white smile with safe, lasting clinical whitening.",
    "Diş Beyazlatma Nedir ve Nasıl Uygulanır?": "What is Teeth Whitening & How is it Done?",
    "Diş Beyazlatma Diş Minesine Zarar Verir mi?": "Does Teeth Whitening Damage Enamel?",
    "<strong>Klinik tipi diş beyazlatma (office bleaching)</strong>, diş hekimi gözetiminde diş minesine özel beyazlatıcı jel sürülüp özel ışık cihazıyla aktive edilmesiyle uygulanır. Ortalama 45-60 dakikalık tek seansta diş tonu 3 ila 6 ton açılır.": "<strong>In-office teeth whitening</strong> is performed under dentist supervision by applying a specialized medical gel to enamel and activating it with a laser light source. Tooth shade brightens 3 to 6 tones in a single 45–60 minute session.",
    "Uzman diş hekimi kontrolünde yapılan profesyonel beyazlatma işlemlerinde diş minesine hiçbir zarar gelmez. Piyasada satılan kontrolsüz beyazlatıcı tozlar ve aşındırıcı macunlar yerine klinik beyazlatma tercih edilmelidir.": "Professional whitening performed under specialist dentist supervision causes zero damage to tooth enamel. Safe clinical whitening should always be preferred over unregulated abrasive powders and charcoal pastes.",
    "Bembeyaz Bir Gülüş İçin": "For a Pearly White Smile",
    "Klinik tipi diş beyazlatma seansı ve fiyat bilgisi için WhatsApp hattımızdan bilgi alabilirsiniz.": "Contact our WhatsApp line for clinical whitening session details and pricing information.",
    "Diş Çekimi": "Tooth Extraction",
    "Diş hekimliğinde her zaman dişi korumak esastır; ancak kurtarılamayacak duruma gelen dişlerin çevre kemiğe zarar vermeden konforlu çekimi.": "Preserving natural teeth is always our priority; however, non-restorable teeth are extracted comfortably without compromising surrounding bone.",
    "Hangi Durumlarda Diş Çekimi Yapılır?": "When is Tooth Extraction Required?",
    "Diş Çekimi Sırasında Acı Hissedilir mi?": "Is Any Pain Felt During Tooth Extraction?",
    "Kanal tedavisi veya dolgu ile kurtarılamayacak kadar ileri derecede harabiyete uğramış dişler, kemik desteğini tamamen yitirmiş sallanan dişler veya ortodontik tedavi amacıyla hekim tarafından çekilmesi zorunlu görülen dişlerde çekim uygulanır.": "Extraction is indicated for teeth severely damaged beyond endodontic or restorative repair, mobile teeth with advanced bone loss, or cases mandated by orthodontic treatment planning.",
    "Modern anestezikler sayesinde işlem tamamen ağrısızdır. Hekimimiz çekim bölgesindeki kemik yuvasını koruyarak işlem yaptığı için, gelecekte o bölgeye yapılacak bir implant tedavisinin başarısı da garanti altına alınır.": "With modern local anesthetics, the extraction is completely painless. Our dentist preserves the alveolar bone socket, guaranteeing optimal foundations for future dental implants.",
    "Diş Çekimi & Muayene": "Tooth Extraction & Examination",
    "Şiddetli diş ağrınız için hemen kliniğimize ulaşın ve WhatsApp üzerinden acil randevu alın.": "Reach out to our clinic immediately for severe tooth pain and schedule an emergency appointment via WhatsApp.",
    "Diş Dolgusu & Bonding": "Dental Filling & Bonding",
    "Doğal diş renginizle tam uyumlu ışınlı kompozit dolgular ve tek seansta diş aralıklarını kapatan estetik bonding.": "Light-cured composite fillings matched perfectly to your tooth shade, and single-session aesthetic bonding closing gaps.",
    "Kompozit Diş Dolgusu Nedir?": "What is Composite Dental Filling?",
    "Estetik Bonding (Kompozit Lamine) Nedir?": "What is Aesthetic Bonding (Composite Veneer)?",
    "Çürük, kırık veya aşınma nedeniyle diş dokusunda oluşan madde kayıplarının, dişin doğal rengi ve anatomisine birebir uygun ışınlı kompozit reçinelerle doldurulması işlemidir. Kliniğimizde kesinlikle eski tip cıvalı siyah amalgam dolgular kullanılmamakta, tamamıyla estetik beyaz dolgular tercih edilmektedir.": "Restoring tooth structure lost due to decay, fractures, or wear using light-cured composite resins perfectly matched to natural anatomy and shade. Our clinic strictly avoids outdated mercury amalgam fillings in favor of aesthetic biocompatible white restorations.",
    "Ön dişler arasındaki boşlukların (diastema), diş kırıklarının ve şekil bozukluklarının dişte hiçbir aşındırma yapılmadan kompozit malzeme ile kat kat şekillendirilerek düzeltilmesidir. Tek seansta ve anında sonuç verir.": "Correcting anterior gaps (diastema), fractures, and contour irregularities without tooth reduction by layering high-grade aesthetic composite. Achieves instant, beautiful results in a single visit.",
    "Dolgu & Bonding Randevusu": "Filling & Bonding Appointment",
    "Çürük dişlerinizi ilerlemeden tedavi ettirmek veya bonding ile gülüşünüzü yenilemek için WhatsApp'tan yazın.": "Message via WhatsApp to treat cavities early or renew your smile with aesthetic composite bonding.",
    "Diş eti kanamalarını, çekilmeleri ve kötü ağız kokusunu durduran periodontoloji tedavileri ile simetrik pembe diş eti estetiği.": "Periodontal treatments halting bleeding gums, recession, and halitosis, combined with symmetrical pink gum aesthetics.",
    "Diş Eti Hastalıkları (Gingivitis ve Periodontitis)": "Gum Diseases (Gingivitis & Periodontitis)",
    "Kliniğimizde Uygulanan Diş Eti Tedavileri": "Periodontal Treatments at Our Clinic",
    "Sağlıklı diş eti açık pembe renktedir, portakal kabuğu gibi pürtüklü bir dokuya sahiptir ve fırçalarken kanamaz. Fırçalama sırasında kanama, diş eti hastalığının ilk alarmıdır. Tedavi edilmediğinde çene kemiğine yayılır ve dişlerin sallanarak dökülmesine yol açar.": "Healthy gums are light pink with an orange-peel stippling texture and do not bleed when brushed. Bleeding during brushing is the primary sign of gum disease. Left untreated, infection spreads to alveolar bone, causing tooth mobility and tooth loss.",
    "<strong>Detertraj (Diş Taşı Temizliği):</strong> Ultrasonik cihazlarla bakteri plaklarının temizlenmesi.": "<strong>Scaling (Calculus Removal):</strong> Ultrasonic removal of harmful bacterial plaque and hardened tartar.",
    "<strong>Küretaj (Derin Kök Yüzeyi Düzleştirmesi):</strong> Diş eti cebi altındaki iltihaplı dokuların anestezi altında temizlenmesi.": "<strong>Curettage (Root Planing):</strong> Deep debridement of infected subgingival pocket tissue under gentle local anesthesia.",
    "<strong>Gingivektomi (Pembe Estetik):</strong> Gülerken çok fazla görünen diş etlerinin lazer veya mikromimari ile estetik olarak kısaltılması.": "<strong>Gingivectomy (Pink Aesthetics):</strong> Laser contouring of excessive gum show (gummy smile) to achieve a harmonious smile line.",
    "Diş Eti Sağlığınızı Koruyun": "Protect Your Gum Health",
    "Kanamalı diş etleriniz için erken teşhis ve tedavi randevusu almak üzere WhatsApp'tan bize yazın.": "Contact us via WhatsApp for an early diagnosis and treatment appointment for bleeding or inflamed gums.",
    "Diş Teli Tedavisi": "Orthodontic Braces Treatment",
    "Diş ve çene çapraşıklıklarını kalıcı olarak düzelten, çiğneme sağlığını ve estetik dizilimi sağlayan klasik ve estetik braket sistemleri.": "Traditional and aesthetic bracket systems permanently resolving dental crowding, bite misalignments, and chewing efficiency.",
    "Ortodontik Diş Teli Tedavisi Nedir?": "What is Orthodontic Braces Treatment?",
    "Diş Teli İçin Yaş Sınırı Var mıdır?": "Is There an Age Limit for Braces?",
    "Dişlerin çene kemiği üzerindeki hatalı konumlanmalarını, aralıklarını ve alt-üst çene kapanış bozukluklarını düzeltmek için uygulanan uzmanlık alanıdır. Metal braketlerin yanı sıra estetik görünüm isteyen hastalarımız için şeffaf safir/porselen braket seçenekleri mevcuttur.": "The specialized dental discipline dedicated to correcting malpositioned teeth, gaps, and jaw relationship disharmonies. In addition to robust metal brackets, aesthetic clear sapphire and ceramic bracket options are available.",
    "Hayır, diş teli tedavisinde yaş sınırı yoktur. Sağlıklı diş eti ve kemik dokusuna sahip her yetişkine başarıyla ortodontik tedavi uygulanabilmektedir.": "No, there is no age limit for orthodontic treatment. Any adult with healthy periodontal tissue and bone support can achieve excellent orthodontic alignment.",
    "Ortodonti Muayenesi": "Orthodontic Consultation",
    "Diş çapraşıklığı ve tel tedavisi hakkında bilgi almak için WhatsApp'tan hemen randevu oluşturun.": "Schedule a consultation via WhatsApp to learn more about orthodontic alignment and braces options.",
    "<strong>Gülüş tasarımı</strong>, hastanın yüz oranları, dudak çizgisi, cinsiyeti, ten rengi ve beklentileri dikkate alınarak estetik açıdan kusursuz bir gülüşün hedeflendiği multidisipliner bir tedavidir. Bu süreçte gereksinimlere göre <strong>zirkonyum kaplama</strong>, <strong>lamina porselen (yaprak diş)</strong>, <strong>diş beyazlatma</strong> ve <strong>diş eti estetiği (pembe estetik)</strong> bir arada uygulanır.": "<strong>Smile design</strong> is a multidisciplinary aesthetic procedure creating a harmonious smile tailored to facial proportions, lip line, gender, skin tone, and personal desires. Treatments such as <strong>zirconia crowns</strong>, <strong>porcelain veneers</strong>, <strong>teeth whitening</strong>, and <strong>gingival contouring (pink aesthetics)</strong> are artfully combined.",
    "Planlanan işlemlerin türüne göre süreç genellikle <strong>4 ila 7 gün</strong> arasında, 2-3 seansta tamamlanır. Dijital tasarım aşamasında hasta dişlerinin bitmiş halini henüz başlamadan prova etme imkanına sahiptir.": "Depending on the planned procedures, treatment is typically completed in <strong>4 to 7 days</strong> across 2–3 sessions. Through digital smile design, patients can preview and approve their final smile before treatment begins.",
    "<strong>Doğallık Önceliğimizdir:</strong> Gülüş tasarımı yapay ve tek tip beyaz dişler demek değildir. Dt. Emre Atasoy kliniğinde hedefimiz yüzünüze en çok yakışan, doğal anatominizi tamamlayan ve özgüveninizi yükselten kişiselleştirilmiş bir gülüş oluşturmaktır.": "<strong>Natural Aesthetics is Our Priority:</strong> A smile makeover never means artificial, unnaturally uniform teeth. At Dr. Emre Atasoy's clinic, our goal is a bespoke smile that enhances your unique facial beauty and elevates your confidence.",
    "<strong>Pembe Estetik (Gingivektomi):</strong> Gülerken diş etlerinin aşırı görünmesi (gummy smile) durumunda diş eti seviyelendirmesi yapılır.": "<strong>Pink Aesthetics (Gingivectomy):</strong> Laser gum contouring for gummy smiles to achieve symmetrical, balanced gingival margins.",
    "<strong>Lamina Veneer veya Zirkonyum:</strong> Diş boyutları, formları ve eksiklikleri estetik porselenlerle restore edilir.": "<strong>Porcelain Veneers or Zirconia:</strong> Restoring tooth proportions, contours, and alignment with high-translucency aesthetic ceramics.",
    "<strong>Diş Beyazlatma (Bleaching):</strong> Kendi doğal dişlerin rengi birkaç ton açılarak homojenlik sağlanır.": "<strong>Teeth Whitening (Bleaching):</strong> Brightening natural teeth shades to achieve overall color harmony.",
    "<strong>Kompozit Bonding:</strong> Küçük diş aralıkları ve kırıklar tek seansta estetik kompozit reçinelerle düzeltilir.": "<strong>Composite Bonding:</strong> Correcting minor gaps and chips seamlessly in a single clinical visit.",
    "<strong>Dental implant</strong>, çeşitli nedenlerle kaybedilen doğal dişlerin kök fonksiyonunu üstlenmek üzere çene kemiğine yerleştirilen, dokuyla %100 biyolojik uyumlu saf titanyum vidalardır. Trabzon Meydan Doktorlar İşhanı'ndaki kliniğimizde Dt. Emre Atasoy tarafından uygulanan implant tedavileri, komşu sağlam dişlere hiçbir zarar vermeden eksik diş problemini kalıcı olarak çözer.": "<strong>Dental implants</strong> are 100% biocompatible pure titanium screws placed into the jawbone to replicate missing tooth roots. Implant treatments performed by Dr. Emre Atasoy at our clinic in Trabzon Square solve missing teeth permanently without altering neighboring healthy teeth.",
    "Genel sağlık durumu cerrahi müdahaleye engel olmayan, çene kemiği gelişimi tamamlanmış (18 yaş ve üzeri) ve yeterli kemik hacmine sahip herkese implant tedavisi uygulanabilir. Kemik erimesi olan vakalarda ise <strong>kemik grefti (kemik tozu)</strong> veya <strong>sinüs lifting</strong> yöntemleriyle kemik hacmi güçlendirilerek başarıyla implant yerleştirilmektedir.": "Implants can be placed in any candidate aged 18+ with mature jawbone anatomy and acceptable general health. For patients with bone resorption, <strong>bone grafting</strong> or <strong>sinus lifting</strong> procedures rebuild bone volume for successful implantation.",
    "İmplant operasyonundan sonraki ilk 24 saat çok sıcak yiyecek ve içeceklerden kaçınılmalı, sigara kullanılmamalı ve hekim tarafından reçete edilen ilaçlar düzenli alınmalıdır. Ağız hijyenine (diş fırçalama, arayüz fırçası ve diş ipi) dikkat edildiğinde implantlar bir ömür boyu kendi dişiniz gibi güvenle kullanılır.": "For the first 24 hours post-surgery, avoid hot drinks and smoking, and take prescribed medications diligently. With meticulous oral hygiene (brushing, interdental brushes, and flossing), implants can last a lifetime just like natural teeth.",
    "<strong>Önemli Avantaj:</strong> Geleneksel köprü protezlerinde olduğu gibi komşu sağlam dişlerin küçültülmesine veya kesilmesine gerek kalmaz. İmplant bağımsız bir diş kökü gibi işlev görür ve çene kemiğindeki erimeyi durdurur.": "<strong>Key Advantage:</strong> Unlike conventional bridges, adjacent natural teeth do not require trimming or reduction. The implant acts as an independent root, preventing progressive jawbone resorption.",
    "<strong>Detaylı Muayene & Dijital Röntgen:</strong> Çene kemiğinizin kalınlığı, sinir kanalları ve anatomik yapısı incelenir; kişiye özel tedavi planı hazırlanır.": "<strong>Detailed Exam & Digital Imaging:</strong> Jawbone thickness, nerve pathways, and bone density are evaluated to formulate a tailored treatment plan.",
    "<strong>Ağrısız Cerrahi Yerleşim:</strong> Lokal anestezi uygulanır. Hasta hiçbir ağrı veya acı hissetmeden titanyum vida çene kemiğine yerleştirilir (yaklaşık 15-20 dakika).": "<strong>Painless Surgical Placement:</strong> Local anesthesia is administered. The titanium screw is seated in jawbone without any discomfort (approx. 15–20 minutes).",
    "<strong>Kemik Kaynaşma Süreci (Osteointegrasyon):</strong> İmplantın çene kemiğiyle tam bir bütün oluşturması için genellikle 2-3 ay beklenir. Bu süreçte hastanın konforu için geçici dişler takılabilir.": "<strong>Osseointegration (Healing Period):</strong> A healing phase of 2–3 months allows the implant to fully fuse with bone. Temporary teeth can be placed for patient comfort during this period.",
    "<strong>Kalıcı Zirkonyum / Porselen Dişin Takılması:</strong> Kaynaşma tamamlandıktan sonra dijital ölçü alınır ve laboratuvarda hazırlanan estetik zirkonyum veya porselen kuron implant üzerine sabitlenir.": "<strong>Final Crown Placement:</strong> Once osseointegration is complete, digital impressions are taken and an aesthetic zirconia or porcelain crown is permanently attached.",
    "Şiddetli diş ağrısı, gece zonklaması veya derin çürüklerde kendi doğal dişinizi çekilmekten kurtaran ağrısız ve konforlu kanal tedavisi.": "Painless, comfortable root canal therapy saving your natural tooth from extraction in cases of deep decay, nighttime throbbing, or trauma.",
    "Kanal Tedavisi Nedir ve Ne Zaman Gereklidir?": "What is Root Canal Therapy & When is it Needed?",
    "Hangi Belirtiler Kanal Tedavisi İhtiyacını Gösterir?": "What Symptoms Indicate Root Canal Treatment?",
    "Kanal Tedavisi Aşamaları ve Uygulama": "Root Canal Stages & Procedure",
    "<strong>Kanal tedavisi (endodonti)</strong>, dişin en iç tabakasında bulunan damar ve sinir paketinin (pulpa) çürük veya travma nedeniyle iltihaplanması durumunda uygulanan tedavidir. Enfekte olmuş doku temizlenir, kök kanalları genişletilip dezenfekte edilir ve özel dolgu maddeleriyle hermetik (sızdırmaz) şekilde doldurulur.": "<strong>Root canal treatment (endodontics)</strong> is indicated when the inner dental pulp (blood vessels and nerves) becomes inflamed due to deep decay or physical trauma. Infected tissue is cleared, canals are shaped and sterilized, then hermetically sealed with biocompatible materials.",
    "<strong>Dişinizi Çektirmeyin!</strong> Kendi doğal dişiniz ağız sağlığınız için en kıymetli hazinedir. Zamanında yapılan bir kanal tedavisi sayesinde dişinizi çektirmeden ömür boyu ağızda tutabilirsiniz.": "<strong>Do Not Extract Your Tooth!</strong> Your natural tooth is irreplaceable for oral health. Timely root canal therapy allows you to retain your natural tooth functional and symptom-free for a lifetime.",
    "Özellikle geceleri artan, kendiliğinden başlayan şiddetli zonklayıcı diş ağrısı": "Severe, spontaneous throbbing toothache that intensifies especially at night",
    "Sıcak ve soğuk gıdalara karşı uzun süre geçmeyen keskin hassasiyet": "Prolonged, sharp sensitivity lingering after hot and cold food intake",
    "Dişe dokunulduğunda veya çiğneme yapıldığında şiddetli baskı ağrısı": "Acute pain upon tapping, biting, or chewing on the affected tooth",
    "Diş etinde sivilce benzeri fistül oluşması ve iltihap akıntısı": "Pimple-like gum fistula accompanied by recurring pus discharge",
    "Travma sonucu dişin canlılığını kaybetmesi ve renginin kararması": "Dark discoloration of tooth structure following trauma and nerve devitalization",
    "<strong>Anestezi & İzolasyon:</strong> İşlem yapılacak diş ve çevre dokular uyuşturulur; hasta tamamen rahatlatılır.": "<strong>Anesthesia & Isolation:</strong> Complete numbness is achieved with gentle local anesthesia, keeping the patient comfortable.",
    "<strong>Çürüğün Temizlenmesi & Pulpa Odasının Açılması:</strong> Dişteki tüm çürük doku temizlenir ve kök kanallarına ulaşılır.": "<strong>Caries Removal & Pulp Access:</strong> All decayed tooth structure is cleared and entry into pulp chambers is created.",
    "<strong>Kök Kanallarının Temizlenmesi & Şekillendirilmesi:</strong> Döner alet sistemleri (endomotor) ve apeks bulucu dijital cihazlarla kanal boyu tam ölçülerek bakterilerden arındırılır.": "<strong>Canal Shaping & Disinfection:</strong> Canals are mapped with digital apex locators and mechanized rotary files, then thoroughly irrigated to eliminate bacteria.",
    "<strong>Kanal Dolumu ve Üst Restorasyon:</strong> Kanallar biyouyumlu güta-perka ile doldurulur; dişin üzerine dayanıklı estetik dolgu veya zirkonyum kaplama yapılarak tedavi tamamlanır.": "<strong>Obturation & Final Restoration:</strong> Canals are sealed with gutta-percha, and the crown is restored with a composite filling or zirconia crown.",
    "Diş Ağrısı Beklemez!": "Toothache Cannot Wait!",
    "Şiddetli diş ağrınız varsa veya kanal tedavisi hakkında görüş almak istiyorsanız hemen WhatsApp randevu hattımızdan iletişime geçin.": "If you are experiencing acute tooth pain or need endodontic consultation, contact our WhatsApp booking line right away.",
    "Lamine Diş (Lamina Veneer)": "Porcelain Veneers (Laminates)",
    "Doğal diş dokusuna neredeyse hiç dokunmadan sadece ön yüzeye uygulanan ultra ince, şeffaf ve kusursuz estetik kaplamalar.": "Ultra-thin, translucent, and flawless porcelain shells bonded to anterior tooth surfaces with minimal preparation.",
    "Lamine Diş (Yaprak Porselen) Nedir?": "What are Porcelain Veneers (Laminates)?",
    "Lamine Dişin Avantajları": "Advantages of Porcelain Veneers",
    "<strong>Lamina veneer</strong>, dişin sadece ön yüzeyinden yaklaşık 0.3 - 0.7 mm kadar çok ince bir tabaka kaldırılarak ya da bazı vakalarda hiç aşındırma yapılmadan (prepless) özel porselen yaprakçıkların dişe yapıştırılması işlemidir.": "<strong>Porcelain veneers</strong> are paper-thin custom porcelain shells bonded to front tooth enamel after minimal shaving (0.3–0.7 mm) or even zero reduction (prepless veneers).",
    "Maksimum doku koruması sağlar; doğal dişinizin arkası tamamen sağlam kalır.": "Maximum tooth conservation: the back and structure of your natural tooth remain untouched.",
    "Işık geçirgenliği doğal diş minesiyle birebirdir.": "Light transmission perfectly matches natural dental enamel.",
    "Porselen yüzey pürüzsüz olduğu için kahve, çay ve sigara lekeleri tutmaz.": "Ultra-smooth glazed porcelain resists staining from coffee, tea, and tobacco.",
    "Lamine Diş Randevusu": "Porcelain Veneer Consultation",
    "Ön diş estetiğinde en zarif çözüm olan lamine diş için Dt. Emre Atasoy kliniğinden randevu alın.": "Book an appointment at Dr. Emre Atasoy's clinic for elegant, natural anterior porcelain veneers.",
    "Dayanıklı metal alt yapısıyla yüksek çiğneme kuvvetlerine dirençli, uzun ömürlü ve bütçe dostu porselen kaplamalar.": "Porcelain-fused-to-metal crowns providing high fracture resistance against masticatory forces, durability, and cost efficiency.",
    "Metal Destekli Porselen Kaplama Nedir?": "What is Porcelain-Fused-to-Metal (PFM) Crown?",
    "Metal destekli porselen kaplama, diş hekimliğinde uzun yıllardır güvenle uygulanan klasik bir protetik tedavidir. İç kısmında biyouyumlu metal alaşım bir iskelet, dış yüzeyinde ise diş renginde fırınlanmış estetik dental porselen yer alır. Özellikle arka azı dişlerde yüksek çiğneme kuvvetlerini karşılamak için mükemmel bir dayanıklılık sunar.": "Porcelain-fused-to-metal (PFM) crowns are a time-tested restorative solution featuring a biocompatible alloy framework overlaid with tooth-colored porcelain. They offer outstanding strength, particularly suited for posterior chewing teeth.",
    "Porselen Diş Muayenesi": "Porcelain Crown Checkup",
    "Kaplama tedavileri hakkında detaylı bilgi ve muayene randevusu almak için WhatsApp hattımıza yazabilirsiniz.": "Message our WhatsApp line for detailed crown restoration options and consultation booking.",
    "Protez Diş & Köprü": "Dentures & Fixed Bridges",
    "Çoklu veya tam diş eksikliklerinde rahat çiğneme, net konuşma ve estetik yüz dolgunluğu sağlayan protez çözümleri.": "Prosthetic solutions restoring comfortable chewing, articulate speech, and youthful facial fullness in multiple or full tooth loss.",
    "Protez Diş Çeşitleri": "Types of Dental Prostheses",
    "<strong>Sabit Protezler (Köprü ve Kuron):</strong> Ağızda kalan sağlam dişlere veya implantlara tutturulan, hastanın kendisinin çıkaramadığı konforlu protezlerdir.": "<strong>Fixed Prostheses (Bridges & Crowns):</strong> Comfortable restorations securely cemented onto existing teeth or implants that cannot be removed by the patient.",
    "<strong>Hareketli Protezler (Total ve Parsiyel):</strong> Çok sayıda veya tüm dişlerini kaybetmiş hastalarda damağa oturan, temizlik için takılıp çıkarılabilen protezlerdir.": "<strong>Removable Dentures (Complete & Partial):</strong> Prostheses resting on the gum ridge that can be taken out for hygiene, ideal for extensive or full tooth loss.",
    "<strong>Hassas Bağlantılı (Çıtçıtlı) Protezler:</strong> Kancası dışarıdan görünmeyen estetik hareketli protezlerdir.": "<strong>Precision-Attachment Dentures:</strong> Removable dentures featuring hidden internal attachments without visible unsightly metal clasps.",
    "Protez Diş Muayenesi": "Dentures Consultation",
    "Eksik dişleriniz için sabit köprü veya hareketli protez seçeneklerini hekimimizle değerlendirin.": "Consult with our dentist to explore the optimal fixed bridge or removable denture solutions for your missing teeth.",
    "Metal braketler olmadan, dışarıdan kimsenin fark edemeyeceği şeffaf plaklar ile düzgün diş dizilimi ve konforlu tedavi.": "Achieve straight teeth and superior comfort with virtually invisible clear aligners without traditional metal brackets.",
    "Şeffaf Plakların Avantajları": "Advantages of Clear Aligners",
    "<strong>Şeffaf plak tedavisi</strong>, diş çapraşıklıklarını ve aralıklarını düzeltmek için metal teller yerine kişiye özel üretilen şeffaf kalıpların kullanıldığı modern ortodontik yöntemdir. Plaklar dışarıdan neredeyse görünmez ve sosyal hayatta maksimum estetik rahatlık sağlar.": "<strong>Clear aligner therapy</strong> is a modern orthodontic technique using custom-designed clear plastic trays instead of metal wires to align teeth. Aligners are virtually invisible, offering unmatched aesthetic discretion in daily life.",
    "<strong>Görünmezlik:</strong> Karşınızdaki kişi dikkatlice bakmadıkça plak taktığınızı fark edemez.": "<strong>Invisibility:</strong> People around you will hardly notice you are wearing orthodontic trays.",
    "<strong>Yemek Yerken Çıkarabilme:</strong> İstenilen her yiyecek serbestçe yenebilir, ardından dişler fırçalanıp plak geri takılır.": "<strong>Removable During Meals:</strong> Enjoy any food freely without restrictions, brush teeth, and reinsert the trays easily.",
    "<strong>Yara ve Batma Olmaz:</strong> Tel veya braket batması gibi dudak/yanak yaraları yaşanmaz.": "<strong>No Irritation:</strong> Smooth medical-grade plastic prevents painful sores or cuts on lips and cheeks.",
    "Şeffaf Plak Muayenesi": "Clear Aligner Assessment",
    "Dişlerinizin şeffaf plak tedavisine uygunluğunu öğrenmek için WhatsApp'tan hemen randevu oluşturun.": "Schedule a consultation via WhatsApp to determine if clear aligners are ideal for your dental smile goals.",
    "Metal desteksiz, ışığı doğal diş gibi geçiren, diş etiyle tam uyumlu ve dayanıklı zirkonyum porselen diş kaplamaları Trabzon Meydan'da.": "Metal-free, naturally translucent, biocompatible, and durable zirconia dental crowns in Trabzon Square.",
    "Zirkonyum Diş Kaplama Nedir?": "What is Zirconia Crown Restoration?",
    "Zirkonyum Kaplama Hangi Durumlarda Uygulanır?": "When is Zirconia Recommended?",
    "Zirkonyum Kaplama Tedavi Süreci ve Aşamaları": "Zirconia Crown Treatment Workflow",
    "Zirkonyum Kaplamanın Bakımı": "Caring for Zirconia Crowns",
    "<strong>Zirkonyum kaplama</strong>, klasik porselen dişlerin alt yapısında kullanılan gri metal yerine beyaz renkli zirkonyum dioksit alaşımının kullanıldığı ileri teknoloji bir estetik restorasyondur. Işık geçirgenliği doğal diş minesine çok yakın olduğu için yapay durmaz, güldüğünüzde mat veya donuk bir görünüm oluşturmaz.": "<strong>Zirconia crowns</strong> utilize white-hued zirconium dioxide instead of traditional gray metal frameworks. With light transmission mimicking natural tooth enamel, they never look flat, opaque, or artificial when smiling.",
    "Zirkonyum kaplamalar tıpkı doğal dişler gibi günde iki kez fırçalanmalı, diş ipi ve hekimin tavsiye ettiği arayüz fırçalarıyla düzenli temizlenmelidir. 6 ayda bir yapılan rutin diş hekimi kontrolleri kaplamaların ömrünü on yıllarca uzatır.": "Zirconia crowns require regular twice-daily brushing, flossing, and interdental care just like natural teeth. Routine checkups every 6 months preserve crown longevity for decades.",
    "<strong>Neden Zirkonyum Tercih Edilmeli?</strong> Metal alerjisi riski taşımaz, sıcak ve soğuk iletkenliği çok düşüktür, diş eti çekilmesinde kök kenarında gri koyuluk yapmaz ve çürük/renklenmiş dişleri mükemmel şekilde örter.": "<strong>Why Choose Zirconia?</strong> Zero risk of metal allergy, low thermal conductivity, no gray margin discoloration even if gums recede, and superb coverage of heavily discolored teeth.",
    "Aşırı madde kaybı veya geniş dolgusu olan dişlerin restorasyonunda": "Restoring teeth with extensive decay, large fillings, or weakened coronal walls",
    "Kanal tedavisi sonrasında kırılma riski taşıyan dişlerin güçlendirilmesinde": "Reinforcing endodontically treated teeth vulnerable to occlusal fracture",
    "Beyazlatma ile açılamayan ileri derecedeki antibiyotik veya flor renklenmelerinde": "Covering severe tetracycline or fluorosis discolorations uncorrectable by bleaching",
    "Hafif çapraşık veya aralıklı (diastema) dişlerin ortodonti istemeyen hastalarda düzeltilmesinde": "Correcting mild crowding or spacing in patients seeking alternatives to braces",
    "İmplant üstü sabit kuron ve köprü protezlerinde": "Fabricating high-strength implant-supported single crowns and multi-unit bridges",
    "Hollywood Smile ve estetik gülüş tasarımında": "Creating Hollywood Smile makeovers and personalized aesthetic smile designs",
    "<strong>Muayene ve Hazırlık:</strong> Dişler lokal anestezi altında minimum düzeyde törpülenerek hazırlanır. Hastaya hemen geçici kaplamalar takılır; hasta kliniğimizden dişsiz ayrılmaz.": "<strong>Preparation & Temporary Crowns:</strong> Teeth receive conservative preparation under local anesthesia. Provisional crowns are seated immediately so you never leave without teeth.",
    "<strong>Hassas Ölçü Alımı:</strong> Dişlerin mikrometrik hassasiyette ölçüsü alınır ve renk seçimi hastanın ten/dudak tonuna göre belirlenir.": "<strong>Digital / High-Precision Impressions:</strong> High-precision impressions are taken and custom tooth shade is matched to your facial characteristics.",
    "<strong>Laboratuvar CAD/CAM Üretimi:</strong> Bilgisayar destekli tasarım cihazlarıyla zirkonyum bloklar mikron düzeyinde kazınarak estetik form verilir.": "<strong>CAD/CAM Robotic Milling:</strong> Zirconia blocks are sculpted with sub-millimeter precision using computer-aided manufacturing.",
    "<strong>Uyum Provası ve Sabitleme:</strong> Hazırlanan kaplamaların ağız içi uyumu, çiğneme kapanışı ve estetiği kontrol edildikten sonra özel yapıştırıcılarla kalıcı olarak dişe sabitlenir.": "<strong>Try-in & Final Cementation:</strong> Fit, occlusion, and aesthetics are verified in the mouth before permanent bonding with dental cements.",
    "Gülüşünüzü Zirkonyum ile Yenileyin": "Renew Your Smile with Zirconia",
    "Dt. Emre Atasoy kliniğinde zirkonyum kaplama hakkında detaylı bilgi ve muayene randevusu almak için hemen WhatsApp'tan yazın.": "Message via WhatsApp for detailed information and a consultation appointment for zirconia crowns at Dr. Emre Atasoy's clinic."
  },
  ar: {
    "Ana Sayfa": "الرئيسية",
    "Tedavilerimiz": "العلاجات",
    "Tedaviler": "العلاجات",
    "Hekimimiz": "طبيبنا",
    "Yorumlar (5.0 ★)": "التقييمات (★ 5.0)",
    "Ortahisar / Ulaşım": "الموقع والوصول",
    "Blog & Rehber": "المدونة والدليل",
    "İletişim": "اتصل بنا",
    "WhatsApp Randevu": "حجز عبر واتساب",
    "Dil Seçimi / Language / اللغة": "اختيار اللغة / Language / Dil Seçimi",
    "📍 Trabzon Meydan • Doktorlar İşhanı Kat:4 No:40": "📍 ميدان طرابزون • مجمع الأطباء، الطابق 4 رقم 40",
    "Trabzon Meydan • Doktorlar İşhanı Kat:4 No:40": "ميدان طرابزون • مجمع الأطباء، الطابق 4 رقم 40",
    "🕒 Pzt - Cmt: 09:00 - 19:00": "🕒 الإثنين - السبت: 09:00 - 19:00",
    "Pzt - Cmt: 09:00 - 19:00": "الإثنين - السبت: 09:00 - 19:00",
    "Hekimimiz & Klinik Standartlarımız": "طبيبنا ومعايير العيادة",
    "Trabzon ve İlçelerinden Kliniğimize Ulaşım Rehberi": "دليل الوصول إلى عيادتنا من مديريات طرابزون",
    "Trabzon İlçeleri Diş Tedavisi Ulaşım Rehberi": "دليل الوصول لطب الأسنان من مديريات طرابزون",
    "Ağız ve Diş Sağlığı Rehberi": "دليل صحة الفم والأسنان",
    "Ağız ve Diş Sağlığı Bilgilendirme Merkezi": "مركز معلومات وتوعية صحة الفم والأسنان",
    "Ağız ve Diş Sağlığı Tedavi Hizmetlerimiz": "خدمات علاج ورعاية الفم والأسنان",
    "Dt. Emre Atasoy Kimdir?": "من هو د. إمري أطاسوي؟",
    "İletişim & Konum": "الاتصال والموقع",
    "İletişim & Klinik Randevu": "الاتصال وحجز المواعيد",
    "İletişim ve Trabzon Meydan Kliniğimize Ulaşım": "الاتصال والوصول إلى عيادتنا بميدان طرابزون",
    "Trabzon Meydan Doktorlar İşhanı'ndaki modern kliniğimizde Dt. Emre Atasoy tarafından uygulanan 15 uzman diş tedavisi, klinik endikasyonları, avantajları ve hasta süreçleri.": "15 علاجاً متخصصاً لطب الأسنان ودواعي العلاج السريري والمزايا ومراحل العلاج التي يقدمها د. إمري أطاسوي في عيادتنا الحديثة بميدان طرابزون.",
    "Trabzon Ortahisar Meydan'da bilimsel ilkeler, yüksek sterilizasyon standartları ve hasta odaklı hekimlik anlayışıyla hizmet veriyoruz.": "نقدم خدمات طب وجراحة الأسنان في ميدان أورتاحصار بطرابزون وفق أحدث المعايير العلمية وأعلى درجات التعقيم والرعاية الفائقة.",
    "Randevu almak, adres tarifi sormak veya diş tedavileriniz hakkında bilgi edinmek için bize telefon veya WhatsApp hattımızdan kolayca ulaşabilirsiniz.": "يمكنكم التواصل معنا بسهولة عبر الهاتف أو الواتساب لحجز موعد، أو الاستفسار عن العنوان، أو معرفة تفاصيل العلاجات.",
    "Ortahisar, Akçaabat, Yomra, Arsin, Maçka, Sürmene, Of ve Vakfıkebir'den Trabzon Meydan'daki kliniğimize nasıl kolayca gelebilirsiniz? Randevu planlaması ve ulaşım detayları.": "كيفية الوصول بسهولة إلى عيادتنا في ميدان طرابزون من أورتاحصار، أكشابات، يومرا، أرسين، ماتشكا، سورمنة، أوف ووقف كبير؟ تفاصيل النقل والمواعيد.",
    "Diş tedavileri hakkında doğru bilinen yanlışlar, bilimsel öneriler ve merak edilen tüm soruların yanıtları.": "تصحيح المفاهيم الخاطئة، نصائح علمية وإجابات شاملة على كافة الاستفسارات حول علاجات الأسنان.",
    "Trabzon Meydan Doktorlar İşhanı Kat:4'teki kliniğimize kolayca ulaşabilir, WhatsApp veya telefon üzerinden anında randevu alabilirsiniz.": "يمكنكم الوصول بسهولة لعيادتنا في مجمع الأطباء الطابق 4 بميدان طرابزون، وحجز موعدكم فوراً عبر واتساب أو الهاتف.",
    "İmplant Tedavisi": "علاج وزراعة الأسنان",
    "Zirkonyum Kaplama": "تيجان الزيركون",
    "Kanal Tedavisi": "علاج الجذور",
    "Gülüş Tasarımı": "تصميم الابتسامة",
    "20'lik Diş Çekimi": "خلع ضرس العقل",
    "Şeffaf Plak Tedavisi": "علاج التقويم الشفاف",
    "Diş Beyazlatma (Bleaching)": "تبييض الأسنان (Bleaching)",
    "Diş Teli (Ortodonti)": "تقويم الأسنان التقليدي",
    "Estetik Kompozit Dolgu": "حشوة الكومبوزيت التجميلية",
    "Diş Eti Tedavisi": "علاج أمراض اللثة",
    "Çocuk Diş Hekimliği": "طب أسنان الأطفال",
    "Porselen Lamine Diş": "فينير وعدسات الأسنان الخزفية",
    "Protez Diş Tedavisi": "أطقم وتعويضات الأسنان",
    "Porselen Kaplama": "تيجان البورسلين",
    "Diş Çekimi (Atraumatik)": "خلع الأسنان (بدون رضح)",
    "İmplant Tedavisi & Uygulama Rehberi": "دليل علاج وزراعة الأسنان",
    "Zirkonyum Diş Kaplama & Estetik Gülüş": "تيجان الزيركون وتصميم الابتسامة التجميلية",
    "Zirkonyum Kaplama & Doğal Gülüş Estetiği": "تيجان الزيركون وتجميل الابتسامة الطبيعية",
    "Kanal Tedavisi (Endodonti) & Diş Kurtarma": "علاج قنوات الجذور وإنقاذ الأسنان الطبيعية",
    "Şeffaf Plak Tedavisi (Telsiz Ortodonti)": "التقويم الشفاف (تقويم الأسنان غير المرئي)",
    "Gülüş Tasarımı (Hollywood Smile)": "تصميم الابتسامة (ابتسامة هوليوود)",
    "Gülüş Tasarımı (Hollywood Smile) & Doğal Estetik": "تصميم الابتسامة (هوليوود سمايل) والجمال الطبيعي",
    "20'lik Diş Çekimi (Gömülü Diş Operasyonu)": "خلع ضرس العقل (جراحة الأسنان المنطمرة)",
    "20'lik Diş Çekimi & Gömülü Diş Tedavisi": "خلع أضراس العقل وجراحة الأسنان المنطمرة",
    "Diş Beyazlatma (Ofis Tipi Bleaching)": "تبييض الأسنان في العيادة",
    "Diş Beyazlatma (Bleaching) Tedavisi": "علاج تبييض الأسنان بالعيادة",
    "Diş Teli Tedavisi (Ortodonti)": "علاج تقويم الأسنان",
    "Estetik Kompozit Diş Dolgusu": "حشوات الأسنان التجميلية المركبة",
    "Diş Dolgusu & Estetik Bonding Tedavisi": "حشوات الأسنان والترميم التجميلي",
    "Diş Eti Tedavisi (Periodontoloji)": "علاج أمراض اللثة",
    "Diş Eti Tedavisi & Pembe Estetik": "علاج اللثة وتجميل الابتسامة اللثوية",
    "Çocuk Diş Hekimliği (Pedodonti)": "طب أسنان الأطفال",
    "Porselen Lamine Diş (Yaprak Porselen)": "عدسات وفينير الأسنان الخزفية",
    "Lamine Diş (Lamina Veneer - Yaprak Porselen)": "عدسات اللومينير والفينير (رقائق البورسلين)",
    "Protez Diş Tedavisi (Hareketli & Sabit)": "أطقم وتعويضات الأسنان الثابتة والمتحركة",
    "Protez Diş Tedavisi & Sabit Diş Köprüleri": "تعويضات الأسنان والجسور الثابتة",
    "Porselen Diş Kaplama (Metal Destekli)": "تيجان البورسلين المدعومة بالمعدن",
    "Porselen Diş Kaplama Tedavisi": "علاج وتلبيس الأسنان بالبورسلين",
    "Diş Çekimi (Atraumatik Cerrahi Çekim)": "خلع الأسنان الجراحي اللطيف",
    "Diş Çekimi & Travmasız Cerrahi": "خلع الأسنان والجراحة اللطيفة غير الرضحية",
    "Doğal dişinizi aratmayan çiğneme konforu ve estetik görünüm. Trabzon Meydan'da Dt. Emre Atasoy güvencesiyle acısız, steril ve sertifikalı titanyum implant uygulamaları.": "راحة مضغ ومظهر طبيعي يماثل أسنانك الحقيقية. زراعة تيتانيوم معتمدة ومعقمة وبدون ألم بميدان طرابزون بإشراف د. إمري أطاسوي.",
    "Metal desteksiz, ışık geçirgenliği yüksek ve diş etiyle %100 biyolojik uyumlu zirkonyum porselen kaplama ile hayalinizdeki doğal gülüşe kavuşun.": "احصل على ابتسامتك الطبيعية المثالية بتيجان الزيركون الخالية من المعادن وذات الشفافية العالية والتوافق التام مع اللثة.",
    "Derin çürük ve iltihaplı dişlerinizi çekilmekten kurtaran, tek seansta ağrısız ve modern döner alet sistemleriyle uygulanan kök kanal tedavisi rehberi.": "دليلك لإنقاذ الأسنان المسوسة والملتهبة من الخلع عبر علاج الجذور الآلي الحديث وبدون ألم في جلسة واحدة.",
    "Yüz hatlarınıza, ten renginize ve dudak formunuza özel olarak tasarlanan estetik, simetrik ve doğal ışıltılı gülüşler.": "ابتسامة متناسقة ومشرقة مصممة خصيصاً لتناسب ملامح وجهك ولون بشرتك وشكل شفتيك.",
    "Gömülü, yarı gömülü veya çapraşıklığa neden olan yirmi yaş dişlerinin çevre dokulara zarar vermeden ağrısız cerrahi çekim süreci.": "جراحة خلع مريحة وغير مؤلمة لأضراس العقل المنطمرة وشبه المنطمرة مع حماية كاملة للأنسجة المحيطة.",
    "Telsiz, dışarıdan fark edilmeyen şeffaf plaklar (telsiz ortodonti) ile konforlu, estetik ve hızlı diş düzeltme tedavisi.": "تصحيح مريح وسريع لانتظام الأسنان باستخدام قوالب التقويم الشفافة غير المرئية وبدون أسلاك معدنية.",
    "Klinik ortamında uygulanan güvenli ofis tipi lazerli beyazlatma ile sararan dişlerinizi 3-4 ton açın, ışıldayan bir gülüşe kavuşun.": "تفتيح لون الأسنان بمقدار 3-4 درجات بأمان تام في العيادة باستخدام أحدث تقنيات التبييض لابتسامة براقة.",
    "Çapraşık dişler ve çene kapanış bozuklukları için metal ve estetik seramik braketlerle kalıcı ortodonti tedavisi.": "علاج تقويم دائم لتزاحم الأسنان وسوء الإطباق باستخدام حاصرات خزفية تجميلية أو معدنية متينة.",
    "Çürük veya kırık dişlerinizi doğal diş rengiyle birebir uyumlu nano-kompozit estetik dolgu ile ağrısız ve tek seansta restore edin.": "ترميم الأسنان المتسوسة أو المكسورة في جلسة واحدة بدون ألم باستخدام حشوات النانو كومبوزيت التجميلية.",
    "Diş eti kanaması, çekilmesi ve iltihaplanmaları için kliniğimizde uygulanan derin temizlik, küretaj ve lazer destekli pembe estetik tedavileri.": "علاجات متطورة للثة تشمل التنظيف العميق والتقليح والليزر لعلاج النزيف والتراجع واستعادة صحة اللثة.",
    "Çocuklarda korkusuz, eğlenceli ve koruyucu diş hekimliği: Süt dişi tedavileri, florür, fissür örtücü ve travma yönetimi.": "طب أسنان الأطفال الودود والخالي من الخوف: علاج الأسنان اللبنية، وتطبيق الفلورايد، وسدادات الشقوق.",
    "Minimum diş aşındırması ile uygulanan yaprak porselen (lamina veneer) sayesinde hayalinizdeki kusursuz ön diş estetiğine kavuşun.": "تمتع بجمال الأسنان الأمامية عبر عدسات اللومينير والفينير فائقة الرقة مع الحفاظ الأقصى على بنية السن.",
    "Eksik dişlerin tamamlanmasında kullanılan sabit porselen köprüler, damak protezler ve hassas tutuculu modern protez çözümleri.": "تعويض الأسنان المفقودة بالجسور الخزفية الثابتة، وأطقم الأسنان الدقيقة، والحلول التعويضية الحديثة.",
    "Aşırı madde kaybı olan dişlerin korunması ve çiğneme fonksiyonunun geri kazandırılması için dayanıklı metal destekli porselen kaplama.": "تيجان البورسلين المتينة لحماية الأسنان شديدة التضرر واستعادة وظيفة المضغ بكفاءة عالية.",
    "Kurtarılması mümkün olmayan enfekte veya kırık dişlerin çevre kemiğe zarar vermeden travmasız teknikle ağrısız çekimi.": "خلع لطيف وغير مؤلم للأسنان الميؤوس منها والمكسورة مع الحفاظ التام على عظام الفك لتمهيد الزرع.",
    "İmplantoloji": "زراعة الأسنان",
    "Estetik Diş Hekimliği": "طب الأسنان التجميلي",
    "Endodonti": "علاج الجذور",
    "Estetik & Hollywood Smile": "التجميل وابتسامة هوليوود",
    "Ağız ve Çene Cerrahisi": "جراحة الفم والفكين",
    "Telsiz Ortodonti": "التقويم الشفاف",
    "Bleaching Estetiği": "تبييض الأسنان",
    "Ortodonti": "تقويم الأسنان",
    "Restoratif Diş Tedavisi": "طب الأسنان الترميمي",
    "Periodontoloji": "أمراض اللثة",
    "Pedodonti": "طب أسنان الأطفال",
    "Yaprak Porselen": "عدسات البورسلين",
    "Protetik Diş Tedavisi": "تعويضات الأسنان",
    "Sabit Kron Protez": "التيجان الثابتة",
    "Cerrahi Çekim": "الخلع الجراحي",
    "✓ Ağrısız & Acısız Lokal Anestezi": "✓ تخدير موضعي مريح وبدون ألم",
    "✓ Sertifikalı Saf Titanyum Vidalar": "✓ غرسات تيتانيوم نقي معتمدة ومضمونة",
    "✓ Doğal Çiğneme ve Konfor": "✓ مضغ طبيعي وراحة كاملة",
    "✓ Metal Desteksiz Doğal Görünüm": "✓ مظهر طبيعي بدون أي معادن",
    "✓ Diş Etinde Renk Değişimi Yapmaz": "✓ لا يسبب أي تغير في لون اللثة",
    "✓ Yüksek Çiğneme ve Kırılma Direnci": "✓ مقاومة عالية للمضغ والكسر",
    "✓ Doğal Dişi Ağızda Koruma": "✓ الحفاظ على الأسنان الطبيعية",
    "✓ Dijital Apeks Bulucu Hassasiyeti": "✓ دقة فائقة بجهاز تحديد الذروة الرقمي",
    "✓ Ağrısız Tek Seans Konforu": "✓ علاج مريح وبدون ألم في جلسة واحدة",
    "✓ Kişiye Özel Dijital Simülasyon": "✓ محاكاة رقمية مخصصة للابتسامة",
    "✓ Altın Oran Yüz Uyumlu Tasarım": "✓ تناسق مع النسبة الذهبية للوجه",
    "✓ Doğal ve Çekici Gülümseme": "✓ ابتسامة جذابة وطبيعية",
    "✓ Komşu Dişleri Koruyan Yaklaşım": "✓ حماية الأسنان المجاورة",
    "✓ Konforlu Cerrahi Lokal Anestezi": "✓ تخدير موضعي جراحي مريح",
    "✓ Hızlı Post-Operatif İyileşme": "✓ سرعة التعافي بعد الجراحة",
    "✓ Dışarıdan Neredeyse Görünmez": "✓ غير مرئي تقريباً أثناء الارتداء",
    "✓ Yemek Yerken Çıkarılabilme": "✓ سهولة النزع أثناء تناول الطعام",
    "✓ Ağız İçi Batma ve Yara Yapmaz": "✓ لا يسبب أي تقرحات أو خدوش بالفم",
    "✓ Tek Seansta 3-4 Ton Açılma": "✓ تفتيح 3-4 درجات في جلسة واحدة",
    "✓ Mineye Zarar Vermeyen Formül": "✓ تركيبة آمنة تماماً على مينا الأسنان",
    "✓ Uzun Süreli Beyazlık Güvencesi": "✓ نتائج بياض تدوم طويلاً",
    "✓ Doğru Kapanış & Çiğneme Fonksiyonu": "✓ إطباق سليم ووظيفة مضغ مثالية",
    "✓ Şeffaf Seramik Braket Seçeneği": "✓ خيار الحاصرات الخزفية الشفافة",
    "✓ Kalıcı ve Dengeli Çene Yapısı": "✓ بنية فكية متوازنة ودائمة",
    "✓ Doğal Diş Rengiyle Birebir Uyum": "✓ تطابق تام مع لون السن الطبيعي",
    "✓ Ağrısız Hızlı Uygulama Protokolü": "✓ بروتوكول سريع وبدون أي ألم",
    "✓ Dayanıklı Nano-Kompozit Malzeme": "✓ مواد نانو كومبوزيت عالية المتانة",
    "✓ Kanama ve Ağız Kokusunu Giderme": "✓ إيقاف النزيف والتخلص من رائحة الفم",
    "✓ Kemik Kaybını ve Sallanmayı Önleme": "✓ منع تآكل العظام وتخلخل الأسنان",
    "✓ Sağlıklı Pembe Diş Eti Görünümü": "✓ استعادة المظهر الوردي الصحي للثة",
    "✓ Korkusuz & Sevgi Dolu İletişim": "✓ تواصل ودود يزيل الخوف من طبيب الأسنان",
    "✓ Koruyucu Flor & Fissür Örtücü": "✓ فلورايد وقائي وسدادات شقوق للأسنان",
    "✓ Erken Ortodontik Takip": "✓ متابعة مبكرة لنمو الفكين والأسنان",
    "✓ Minimum Diş Aşındırması (0.3mm)": "✓ الحد الأدنى من برد الأسنان (0.3 مم)",
    "✓ Mükemmel Işık Geçirgenliği": "✓ شفافية مثالية تحاكي الأسنان الطبيعية",
    "✓ Leke Tutmayan Pürüzsüz Yüzey": "✓ سطح أملس مقاوم للبقع والتصبغات",
    "✓ Yüksek Çiğneme ve Konuşma Gücü": "✓ استعادة قوة المضغ والنطق السليم",
    "✓ Düşmeyen Hassas Tutuculu Seçenekler": "✓ خيارات تثبيت دقيقة ومحكمة بدون حركة",
    "✓ Doğal Ağız Anatomisine Uyum": "✓ تطابق تام مع البنية التشريحية للفم",
    "✓ Kırılgan Dişleri Güçlendirme": "✓ تقوية الأسنان الضعيفة والمعالجة",
    "✓ Kanıtlanmış Uzun Ömürlü Yapı": "✓ بنية متينة ذات عمر افتراضي طويل",
    "✓ Bütçe Dostu Estetik Çözüm": "✓ حل اقتصادي وتجميلي مناسب",
    "✓ Doku Dostu & Kemik Koruyucu": "✓ تقنية لطيفة تحافظ على النسيج العظمي",
    "✓ İmplant Altyapısını Koruma": "✓ حماية موقع السن لزراعة مستقبلية ناجحة",
    "Detaylı Bilgi & Süreç →": "التفاصيل والمعلومات ←",
    "Hemen Ara": "اتصل الآن",
    "Hemen Randevu & Fiyat Bilgisi Alın": "احصل على موعد ومعلومات الأسعار فوراً",
    "WhatsApp'tan Yazın": "تواصل عبر واتساب",
    "WhatsApp Randevu Al": "حجز موعد واتساب",
    "WhatsApp Randevu Hattı": "خط حجز المواعيد عبر واتساب",
    "Makaleyi Oku →": "اقرأ المقال ←",
    "Muayene Randevusu Alın": "احجز موعد استشارة",
    "İmplant Muayenesi Alın": "احجز فحص زراعة الأسنان",
    "Hayalinizdeki Gülüşe Kavuşun": "احصل على ابتسامة أحلامك",
    "Hızlı Randevu Alın": "احجز موعداً سريعاً",
    "İlçenizden Kolay Randevu": "حجز موعد ميسر من مديريتك",
    "Hangi Tedavinin Size Uygun Olduğundan Emin Değil misiniz?": "لست متأكداً من العلاج الأنسب لحالتك؟",
    "📍 Ortahisar Meydan Kat:4": "📍 ميدان أورتاحصار ط:4",
    "🛡️ CE / FDA Onaylı Materyal": "🛡️ مواد معتمدة من CE و FDA",
    "⚡ Ağrısız Lokal Anestezi": "⚡ تخدير موضعي مريح وبدون ألم",
    "Tümü": "الكل",
    "Mesleki Yaklaşım ve Felsefemiz": "النهج المهني وفلسفتنا الطبية",
    "Diş hekimliği yalnızca dişlerin tedavisini yapmak değil; hastanın korku ve kaygılarını anlayarak ona en konforlu ve ağrısız deneyimi yaşatmaktır. <strong>Dt. Emre Atasoy</strong>, 20 yılı aşkın mesleki kariyeri boyunca estetik diş hekimliği, implant cerrahisi, endodonti ve gülüş tasarımı alanlarındaki modern gelişmeleri yakından takip ederek Trabzon'daki kliniğinde uygulamaktadır.": "طب الأسنان ليس مجرد معالجة للأسنان فقط، بل هو تفهم لمخاوف وقلق المريض لمنحه تجربة علاجية مريحة وخالية من الألم. طوال مسيرته المهنية التي تزيد عن 20 عاماً، يواكب <strong>د. إمري أطاسوي</strong> أحدث التطورات في تجميل الأسنان وزراعتها وعلاج العصب وتصميم الابتسامة ويطبقها في عيادته بطرابزون.",
    "<strong>Önce Koruyucu Diş Hekimliği:</strong> Kliniğimizde temel ilkemiz, doğal diş dokusunu azami ölçüde korumaktır. Kurtarılması mümkün olan hiçbir diş çekilmez; kanal tedavisi, estetik dolgu ve koruyucu yöntemlerle dişe ömür kazandırılır.": "<strong>طب الأسنان الوقائي أولاً:</strong> مبدؤنا الأساسي هو الحفاظ على بنية السن الطبيعية لأقصى درجة ممكنة. لا يتم خلع أي سن يمكن إنقاذه؛ بل يتم الحفاظ عليه بعلاج الجذور والحشوات التجميلية والرعاية الوقائية.",
    "Klinik Hijyen ve Sterilizasyon Standartlarımız": "معايير النظافة والتعقيم في العيادة",
    "Kliniğimizde çapraz enfeksiyon riskini tamamen ortadan kaldıran <strong>B sınıfı medikal otoklav cihazları</strong> ile tüm cerrahi ve el aletleri her hasta öncesinde basınçlı buhar altında sterilize edilmekte ve özel ambalajlarda saklanmaktadır. Tek kullanımlık sarf malzemeler (iğne uçları, bardaklar, örtüler, eldivenler vb.) her hastada yenisiyle değiştirilir.": "في عيادتنا، يتم تعقيم جميع الأدوات الجراحية واليدوية تحت ضغط البخار بأحدث <strong>أجهزة الأوتوكلاف الطبية من الفئة B</strong> للقضاء التام على مخاطر انتقال العدوى، وتُحفظ في أكياس تعقيم فردية. وتُستبدل المواد الاستهلاكية ذات الاستخدام الواحد لكل مريض بشكل منفصل.",
    "Kullandığımız Teknolojik Altyapı": "البنية التقنية المتطورة في عيادتنا",
    "<strong>Dijital Radyoloji:</strong> Minimum radyasyon dozuyla anında net görüntü veren dijital röntgen sistemleri.": "<strong>الأشعة الرقمية:</strong> أنظمة تصوير بالأشعة الرقمية تمنح تشخيصاً فورياً فائق الوضوح بأقل جرعة إشعاعية ممكنة.",
    "<strong>Apeks Bulucu & Endomotor:</strong> Kanal tedavisinde kök ucunu milimetrik tespit ederek tedavi başarısını maksimize eden teknoloji.": "<strong>محدد الذروة والمحرك الآلي:</strong> تقنية تضمن أعلى نسب نجاح لعلاج الجذور بتحديد نهاية الجذر بدقة ميليمترية.",
    "<strong>Ağrısız Anestezi:</strong> İğne acısını hissettirmeyen özel lokal anestezi protokolleri.": "<strong>تخدير موضعي بدون ألم:</strong> بروتوكولات تخدير متطورة تزيل ألم الوخز وتمنح راحة تامة.",
    "<strong>Uluslararası Sertifikalı Malzemeler:</strong> Yalnızca FDA ve CE onaylı dünya standartlarında implant ve zirkonyum bloklar.": "<strong>مواد معتمدة دولياً:</strong> غرسات وزيركون معتمدة حصرياً من هيئات CE و FDA العالمية.",
    "Dt. Emre Atasoy ile birebir görüşmek ve diş sağlığınızı planlamak için WhatsApp'tan doğrudan yazabilirsiniz.": "يمكنكم التواصل مباشرة عبر واتساب للتشاور مع د. إمري أطاسوي وتخطيط علاج أسنانكم.",
    "Dt. Emre Atasoy ile gülüş analizi planlamak ve randevu almak için WhatsApp üzerinden hemen bize ulaşın.": "تواصل معنا فوراً عبر واتساب لتحديد موعد تحليل الابتسامة واستشارة د. إمري أطاسوي.",
    "Dt. Emre Atasoy ile çene yapınıza en uygun implant planlamasını konuşmak ve randevu almak için hemen iletişime geçin.": "تواصل معنا فوراً لمناقشة أنسب خطة زراعة لبنية فكك مع د. إمري أطاسوي وحجز موعدك.",
    "Dt. Emre Atasoy ile görüşmek ve implant tedaviniz hakkında net bilgi almak için WhatsApp'tan yazabilirsiniz.": "راسلنا عبر واتساب للتحدث مع د. إمري أطاسوي والحصول على استشارة واضحة حول زراعة الأسنان.",
    "📍 Resmi Klinik Adresimiz:": "📍 عنوان العيادة الرسمي:",
    "Kemerkaya mah. Meydan hamam sok. Doktorlar işhanı Kat:4 No:40, 61030 Trabzon Merkez / Trabzon": "حي كيمركايا، زقاق ميدان حمام، مجمع الأطباء الطابق 4 رقم 40، 61030 أورتاحصار / طرابزون",
    "Ortahisar": "أورتاحصار",
    "Trabzon Meydan Parkı": "حديقة ميدان طرابزون",
    "Doktorlar İşhanı": "مجمع الأطباء",
    "Hamam Sokak": "شارع الحمام",
    "Sabit Hat:": "الهاتف الأرضي:",
    "Doğrudan WhatsApp Destek & Randevu:": "دعم واتساب والمواعيد مباشرة:",
    "WhatsApp'tan Hemen Mesaj Yazın": "أرسل رسالة عبر واتساب الآن",
    "Trabzon Meydan Merkezi Lokasyon Avantajımız": "ميزة موقعنا المركزي في قلب ميدان طرابزون",
    "Kliniğimiz, Trabzon'un tam merkezinde yer alan <strong>Kemerkaya Mahallesi, Meydan Hamam Sokak, Doktorlar İşhanı Kat:4 No:40</strong> adresindedir. Trabzon Meydan Parkı'na yalnızca 1 dakikalık yürüme mesafesinde olmamız, Trabzon'un tüm ilçelerinden kalkan dolmuş ve otobüslerle aktarmasız ve çok hızlı ulaşım imkanı sağlamaktadır.": "تقع عيادتنا في قلب مركز طرابزون: <strong>حي كيمركايا، زقاق ميدان حمام، مجمع الأطباء، الطابق 4 رقم 40</strong>. يبعد موقعنا دقيقة واحدة سيراً على الأقدام عن حديقة الميدان، مما يتيح وصولاً سريعاً ومباشراً بالحافلات والدولموش من جميع المديريات.",
    "<strong>İlçelerden Gelen Hastalarımız İçin Özel Randevu Planlaması:</strong> Of, Vakfıkebir, Sürmene gibi mesafeli ilçelerden gelen hastalarımızın mağdur olmaması için randevularını tek seansta birden fazla işlemi tamamlayacak şekilde (aynı gün muayene + röntgen + dolgu/çekim/ölçü) koordine ediyoruz.": "<strong>تنظيم مواعيد مخصص للمرضى القادمين من المديريات:</strong> لراحة المرضى القادمين من مناطق أبعد كأوف وواقف كبير وسورميني، ننسق المواعيد لإنجاز عدة مراحل في جلسة واحدة (فحص + أشعة + حشو/خلع/أخذ مقاسات في نفس اليوم).",
    "İlçelere Göre Ulaşım Rehberi": "دليل المواصلات بحسب المديريات",
    "1. Ortahisar Diş Hekimi Arayan Hastalarımız": "1. المرضى الباحثون عن طبيب أسنان في أورتاحصار",
    "Ortahisar ilçe merkezinde; Uzun Sokak, Maraş Caddesi, Kunduracılar ve Tanjant yoluna birkaç adımlık mesafedeyiz. Meydan'daki katlı otoparklar ve yol üzeri park alanları sayesinde özel aracınızla da kolayca gelebilirsiniz.": "في مركز أورتاحصار، نحن على بعد خطوات قليلة من شارع أوزون، شارع مرعش، كوندوراجيلار وطريق تانجانت. كما تتوفر مواقف سيارات طابقية وسطحية بالميدان لتسهيل الوصول بسيارتكم الخاصة.",
    "2. Akçaabat Diş Hekimi Arayan Hastalarımız": "2. المرضى الباحثون عن طبيب أسنان من أكشابات",
    "Akçaabat merkezden kalkan sahil dolmuşları veya belediye otobüsleri doğrudan Trabzon Meydan son durağına gelmektedir. Yolculuk ortalama <strong>15-20 dakika</strong> sürmektedir. Meydan durağında inip Hamam Sokak'a 2 dakika yürüyerek Doktorlar İşhanı'na ulaşabilirsiniz.": "تنطلق حافلات الدولموش الساحلية وباصات البلدية من وسط أكشابات مباشرة إلى المحطة الأخيرة بميدان طرابزون (تستغرق الرحلة حوالي <strong>15-20 دقيقة</strong>). عند النزول، يبعد مجمع الأطباء دقيقتين سيراً باتجاه شارع الحمام.",
    "3. Yomra ve Kaşüstü Diş Hekimi Arayan Hastalarımız": "3. المرضى الباحثون عن طبيب أسنان من يومرا وكاش أوستو",
    "Yomra ve Kaşüstü bölgesinden hareket eden dolmuşlar sahil veya Tanjant güzergahı üzerinden doğrudan Meydan Parkı'na ulaşır (ortalama <strong>12-15 dakika</strong>). Kliniğimiz dolmuş iniş noktasının hemen arkasındadır.": "تصل حافلات يومرا وكاش أوستو عبر الطريق الساحلي أو التانجانت مباشرة إلى حديقة الميدان (حوالي <strong>12-15 دقيقة</strong>)، وتقع عيادتنا خلف نقطة النزول مباشرة.",
    "4. Arsin ve Sürmene Diş Hekimi Arayan Hastalarımız": "4. المرضى الباحثون عن طبيب أسنان من أرسين وسورميني",
    "Arsin ve Sürmene ilçe dolmuşları doğrudan Çömlekçi / Meydan ana terminaline yolcu taşımaktadır. Zirkonyum ve implant gibi estetik tedavilerinizde seans saatleri ilçenizin dolmuş saatlerine göre esnek olarak ayarlanır.": "تنقل حافلات أرسين وسورميني الركاب مباشرة إلى محطة تشوملكتشي / الميدان المركزية. وفي علاجات الزيركون والزراعة، يتم تنسيق مواعيد الجلسات بمرونة وفقاً لجداول الحافلات.",
    "5. Maçka Diş Hekimi Arayan Hastalarımız": "5. المرضى الباحثون عن طبيب أسنان من ماتشكا",
    "Maçka dolmuşları doğrudan Trabzon merkez köprüaltı / Meydan bölgesine ulaşmaktadır (ortalama <strong>25 dakika</strong>). Aynı gün içinde muayene ve diş tedavisi planlaması yapılabilir.": "تصل حافلات ماتشكا مباشرة إلى منطقة الميدان / كوبرو ألتي (حوالي <strong>25 دقيقة</strong>)، ويمكن إجراء الفحص وبدء العلاج في اليوم ذاته.",
    "6. Vakfıkebir, Çarşıbaşı ve Beşikdüzü Diş Hekimi Arayan Hastalarımız": "6. المرضى الباحثون عن طبيب أسنان من واقف كبير وتشارشي باشي وبيشيك دوزو",
    "Batı ilçelerimizden sahil yolu dolmuşlarıyla yaklaşık <strong>35-45 dakikada</strong> Trabzon Meydan'a ulaşmak mümkündür.": "يمكن الوصول بسهولة إلى ميدان طرابزون من المديريات الغربية عبر حافلات الطريق الساحلي في غضون <strong>35-45 دقيقة</strong> تقريباً.",
    "7. Of ve Çaykara Diş Hekimi Arayan Hastalarımız": "7. المرضى الباحثون عن طبيب أسنان من أوف وتشاي كارا",
    "Doğu Karadeniz sahil yolu üzerinden Of dolmuşları ile yaklaşık <strong>45 dakikada</strong> kliniğimize ulaşabilirsiniz. Gülüş tasarımı veya implant tedavisi için gelen hastalarımıza özel kombine seanslar oluşturulur.": "يمكنكم الوصول إلى العيادة في حوالي <strong>45 دقيقة</strong> عبر حافلات أوف على الطريق الساحلي. ونخصص جلسات مجمعة للمرضى القادمين لتصميم الابتسامة أو الزراعة.",
    "Kliniğimizin Tam Konumu ve İletişim": "موقع العيادة بالتفصيل ومعلومات الاتصال",
    "<strong>Adres:</strong> Kemerkaya Mah. Meydan Hamam Sok. Doktorlar İşhanı Kat:4 No:40, 61030 Ortahisar / Trabzon<br /> <strong>Telefon (Sabit):</strong> 0462 323 35 92<br /> <strong>WhatsApp Randevu:</strong> 0532 775 52 78": "<strong>العنوان:</strong> حي كيمركايا، زقاق ميدان حمام، مجمع الأطباء الطابق 4 رقم 40، أورتاحصار / طرابزون<br /> <strong>الهاتف الأرضي:</strong> 0462 323 35 92<br /> <strong>واتساب المواعيد:</strong> 0532 775 52 78",
    "<strong>Adres:</strong> Kemerkaya Mah. Meydan Hamam Sok. Doktorlar İşhanı Kat:4 No:40, 61030 Ortahisar / Trabzon<br> <strong>Telefon (Sabit):</strong> 0462 323 35 92<br> <strong>WhatsApp Randevu:</strong> 0532 775 52 78": "<strong>العنوان:</strong> حي كيمركايا، زقاق ميدان حمام، مجمع الأطباء الطابق 4 رقم 40، أورتاحصار / طرابزون<br> <strong>الهاتف الأرضي:</strong> 0462 323 35 92<br> <strong>واتساب المواعيد:</strong> 0532 775 52 78",
    "Hangi ilçeden geleceğinizi WhatsApp üzerinden iletin, randevunuzu geliş saatinize göre en uygun şekilde planlayalım.": "أخبرنا عبر واتساب بالمديرية أو المنطقة التي ستأتي منها، وسنقوم بتنسيق موعدك بالطريقة الأنسب لوقت وصولك.",
    "İmplant Nedir? Ne Kadar Dayanır ve Sonrası Nelere Dikkat Edilmeli?": "ما هي زراعة الأسنان؟ كم تدوم وأهم النصائح والإرشادات بعد العملية؟",
    "İmplant cerrahisinin ömrü, başarı oranı ve operasyon sonrası iyileşmeyi hızlandıran önemli tavsiyeler.": "معدلات نجاح زراعة الأسنان، عمرها الافتراضي، وأهم التوصيات لتسريع الشفاء بعد الجراحة.",
    "Zirkonyum mu Porselen mi? Hangisi Tercih Edilmeli?": "الزيركون أم البورسلين؟ أيهما الخيار الأنسب لأسنانك؟",
    "Işık geçirgenliği, diş eti uyumu, dayanıklılık ve maliyet farklarıyla kaplama seçimi rehberi.": "دليل شامل لاختيار التيجان يقارن بين الشفافية، والتوافق مع اللثة، والمتانة، وفروق التكلفة.",
    "Kanal Tedavisi Ne Kadar Sürer? Ağrılı mıdır?": "كم يستغرق علاج عصب الأسنان؟ وهل الإجراء مؤلم؟",
    "Kanal tedavisinin kaç seans sürdüğü, işlem esnasında ağrı hissedilip hissedilmeyeceği ve dişin ömrü.": "عدد الجلسات المطلوبة لعلاج الجذور، وهل تشعر بأي ألم أثناء الإجراء، ومدى استمرار السن المعالج.",
    "20'lik Diş Ne Zaman Çekilmeli?": "متى يجب خلع ضرس العقل؟",
    "Hangi 20 yaş dişlerinin çekilmesi gerektiği, gömülü dişlerin zararları ve çekim sonrası dikkat edilecekler.": "حالات ضرورة خلع أضراس العقل، وأضرار الأسنان المنطمرة، والتعليمات المهمة بعد العملية.",
    "Diş Taşı Neden Oluşur ve Nasıl Temizlenir?": "لماذا يتكون جير الأسنان وكيف يتم تنظيفه؟",
    "Tartar oluşumunun nedenleri, temizliğin diş minesi üzerindeki etkisi ve ağız kokusuyla ilişkisi.": "أسباب تراكم الجير والتكلسات، وتأثير التنظيف على مينا الأسنان وعلاقته برائحة الفم.",
    "Diş Beyazlatma Nasıl Yapılır? Kalıcı mıdır?": "كيف يتم تبييض الأسنان؟ وهل نتائجه دائمة؟",
    "Ofis tipi lazerli beyazlatma ile ev tipi plakların farkı ve beyazlığın korunma yöntemleri.": "الفرق بين التبييض الليزري في العيادة والقوالب المنزلية، وطرق الحفاظ على بياض دائم.",
    "Diş Eti Çekilmesi Neden Olur ve Nasıl Önlenir?": "ما هي أسباب تراجع اللثة وكيف تتم الوقاية منه؟",
    "Yanlış fırçalama, genetik faktörler ve diş eti hastalıklarının çekilmeye etkisi ve tedavi yolları.": "أثر التفريش الخاطئ والعوامل الوراثية وأمراض اللثة على الانحسار والخيارات العلاجية المتاحة.",
    "Diş Ağrısına Ne İyi Gelir? Kırılan Dişe Ne Yapılır?": "ما الذي يسكن ألم الأسنان؟ وما العمل عند انكسار السن؟",
    "Gece başlayan ani diş ağrısında evde yapılabilecek ilk yardım ve kırılan diş parçasının korunması.": "الإسعافات الأولية لألم الأسنان المفاجئ ليلاً وكيفية الحفاظ على قطعة السن المكسورة حتى مراجعة الطبيب.",
    "Şeffaf Plak mı Diş Teli mi? Hangisi Daha Avantajlı?": "التقويم الشفاف أم التقويم المعدني؟ أيهما أفضل وأكثر فائدة؟",
    "Konfor, tedavi süresi, estetik ve fiyat bakımından şeffaf plak ve klasik tel karşılaştırması.": "مقارنة شاملة بين القوالب الشفافة والتقويم السلكي الكلاسيكي من حيث الراحة، المدة، المظهر والتكلفة.",
    "İmplant": "زراعة الأسنان",
    "Estetik Diş": "تجميل الأسنان",
    "Çene Cerrahisi": "جراحة الفم والفكين",
    "Ağız Hijyeni": "صحة الفم والأسنان",
    "Beyazlatma": "تبييض الأسنان",
    "Diş Eti": "صحة اللثة",
    "Acil Diş": "طوارئ الأسنان",
    "📅 Rehber": "📅 دليل",
    "📅 Karşılaştırma": "📅 مقارنة",
    "📅 Tedavi Süreci": "📅 مسار العلاج",
    "📅 Cerrahi Bilgi": "📅 معلومات جراحية",
    "📅 Koruyucu Bakım": "📅 عناية وقائية",
    "📅 Estetik Rehber": "📅 دليل تجميلي",
    "📅 Periodontoloji": "📅 علاج اللثة",
    "📅 Acil Rehber": "📅 دليل الطوارئ",
    "Dt. Emre Atasoy": "د. إمري أطاسوي",
    "Gülüş Tasarımı Nedir?": "ما هو تصميم الابتسامة؟",
    "İmplant Tedavisi Nedir?": "ما هي زراعة الأسنان؟",
    "İmplant Tedavisi Nedir? Nasıl Uygulanır?": "ما هي زراعة الأسنان وكيف يتم تطبيقها؟",
    "Zirkonyum Kaplama Nedir?": "ما هي تيجان الزيركون؟",
    "Kanal Tedavisi Nedir?": "ما هو علاج الجذور؟",
    "20'lik Diş Çekimi Nedir?": "ما هو خلع ضرس العقل؟",
    "Şeffaf Plak Tedavisi Nedir?": "ما هو علاج التقويم الشفاف؟",
    "Diş Beyazlatma Nedir?": "ما هو تبييض الأسنان؟",
    "Diş Teli Tedavisi Nedir?": "ما هو علاج تقويم الأسنان؟",
    "Diş Dolgusu Nedir?": "ما هي حشوة الأسنان؟",
    "Diş Eti Tedavisi Nedir?": "ما هو علاج أمراض اللثة؟",
    "Çocuk Diş Hekimliği Nedir?": "ما هو طب أسنان الأطفال؟",
    "Lamine Diş Nedir?": "ما هي عدسات الأسنان (اللومينير)؟",
    "Protez Diş Tedavisi Nedir?": "ما هي تعويضات الأسنان الاصطناعية؟",
    "Porselen Kaplama Nedir?": "ما هي تيجان البورسلين؟",
    "Diş Çekimi Nedir?": "ما هو خلع الأسنان؟",
    "Gülüş Tasarımında Hangi İşlemler Yapılır?": "ما هي الإجراءات المتبعة في تصميم الابتسامة؟",
    "Gülüş Tasarımı Ne Kadar Sürer?": "كم يستغرق تصميم الابتسامة؟",
    "İmplant Tedavisi Kimlere Uygulanabilir?": "لمن تناسب زراعة الأسنان؟",
    "İmplant Tedavisi Aşamaları ve Süreç": "مراحل وخطوات زراعة الأسنان",
    "İmplant Sonrası İyileşme ve Bakım": "الشفاء والعناية بعد زراعة الأسنان",
    "Tedavi Süreci ve Aşamaları": "مراحل وخطوات العلاج",
    "Tedavinin Avantajları": "مزايا العلاج",
    "Kimler İçin Uygundur?": "لمن يناسب هذا العلاج؟",
    "Sıkça Sorulan Sorular": "الأسئلة الشائعة",
    "İmplant operasyonu ağrılı mıdır?": "هل عملية زراعة الأسنان مؤلمة؟",
    "Trabzon implant fiyatları neye göre belirlenir?": "على أي أساس تتحدد أسعار زراعة الأسنان في طرابزون؟",
    "Kaybedilen doğal dişlerin yerine çene kemiğine yerleştirilen, doku dostu saf titanyum vidalarla uygulanan kalıcı diş kökü tedavisidir.": "علاج دائم لجذور الأسنان المفقودة باستخدام براغي من التيتانيوم النقي المتوافق حيوياً والمثبت في عظم الفك.",
    "Metal altyapı içermeyen, ışık geçirgenliği doğal diş minesiyle birebir örtüşen premium kaplama yöntemidir. Diş etinde morarma yapmaz.": "حل تلبيس متميز خالٍ تماماً من المعادن، يطابق شفافية مينا الأسنان الطبيعية ولا يسبب اسوداداً في اللثة.",
    "Derin çürük veya travma sonucu iltihaplanan diş sinirinin ağrısız temizlenip biyolojik dolgu materyalleriyle kapatılarak dişin kurtarılmasıdır.": "إنقاذ السن عبر تنظيف العصب الملتهب بدون ألم الناتج عن التسوس العميق وحشوه بمواد حيوية معقمة.",
    "Hastanın yüz hatları, dudak çizgisi ve ten rengi analiz edilerek kişiye özel planlanan multi-disipliner Hollywood gülüşü estetiğidir.": "تصميم ابتسامة هوليوود مخصصة لكل مريض بعد تحليل ملامح الوجه وخط الشفاه ولون البشرة.",
    "Gömülü veya yarı gömülü kalarak komşu dişleri sıkıştıran, ağrı ve apse yapan yirmi yaş dişlerinin cerrahi yöntemle ağrısız çekilmesidir.": "خلع جراحي غير مؤلم لأضراس العقل المنطمرة أو شبه المنطمرة التي تسبب ضغطاً أو ألماً أو التهابات.",
    "Geleneksel metal braketler olmadan, dışarıdan fark edilmeyen şeffaf aligner plaklarla diş çapraşıklıklarını düzelten konforlu yöntemdir.": "طريقة مريحة وغير مرئية لتعديل اصطفاف الأسنان باستخدام قوالب تقويم شفافة وقابلة للإزالة بدون أقواس معدنية.",
    "Çay, kahve ve sigara lekelenmelerini klinik ortamında ofis tipi özel lazer jelleriyle mineye zarar vermeden 3-4 ton açan estetik işlemdir.": "إجراء سريري لتفتيح لون الأسنان بمقدار 3-4 درجات بأمان ودون الإضرار بالمينا، لإزالة تصبغات الشاي والقهوة والتدخين.",
    "Çapraşık diş dizilimleri, çene darlığı ve kapanış bozukluklarını estetik porselen veya metal braketlerle kalıcı olarak düzelten uzmanlık alanıdır.": "تخصص تقويم الأسنان لتصحيح التزاحم وضيق الفك وسوء الإطباق باستخدام حاصرات خزفية تجميلية أو معدنية متينة.",
    "Çürüyen veya kırılan diş dokusunun temizlenerek diş rengine birebir uyumlu nano-hibrit kompozit dolgu materyalleriyle restore edilmesidir.": "ترميم الأسنان المتسوسة أو المكسورة بحشوات النانو هايبرد التجميلية المطابقة للون الأسنان الطبيعي بدقة عالية.",
    "Diş eti kanaması, çekilmesi ve periodontitis kaynaklı kemik erimelerini durduran derin küretaj ve lazer destekli diş eti sağlığı tedavisidir.": "علاج متقدم بالموجات والليزر والتقليح العميق لوقف نزيف اللثة وتراجعها وتآكل العظام المحيطة بالأسنان.",
    "0-13 yaş grubu çocuklarda süt ve daimi dişlerin korunması, fissür örtücü, florür uygulamaları ve diş hekimi fobisini önleyen sıcak klinik yaklaşımıdır.": "العناية بأسنان الأطفال اللبنية والدائمة من سن 0-13 عاماً، وتطبيق الفلورايد وسدادات الشقوق بنهج ودي يزيل الخوف.",
    "Diş yüzeyinde minimum aşındırma ile uygulanan, tırnak kalınlığında ultra ince porselen yaprakçıklarla kusursuz ön diş estetiği sağlar.": "رقائق خزفية فائقة الرقة بسماكة الظفر تثبت على السن بأقل قدر من البرد (0.3 مم) لمنح ابتسامة أمامية ساحرة.",
    "Çoklu diş kayıplarında sabit köprüler, hassas tutuculu çıtçıtlı protezler veya total damak protezleriyle çiğneme fonksiyonunun geri kazandırılmasıdır.": "استعادة وظائف المضغ والنطق في حالات فقدان الأسنان المتعدد باستخدام الجسور الثابتة أو الأطقم الدقيقة أو الأطقم الكاملة.",
    "Aşırı madde kaybına uğramış dişlerin güçlendirilmesi için uygulanan dayanıklı, ekonomik ve estetik diş kaplama alternatifidir.": "حل تلبيس متين واقتصادي وتجميلي يُستخدم لتقوية الأسنان المعرضة لتلف كبير أو فقدان كمية من بنيتها.",
    "Kurtarılması mümkün olmayan enfekte dişlerin çevre kemik dokusu korunarak travmasız (atraumatik) teknikle ağrısız çekilmesidir.": "خلع غير مؤلم للأسنان الميؤوس من علاجها باستخدام تقنيات لطيفة تحافظ على سلامة العظم المحيط لتمهيد الزرع.",
    "© 2026 Dt. Emre Atasoy - Trabzon Diş Kliniği. Tüm Hakları Saklıdır.": "© 2026 د. إمري أطاسوي - عيادة طب الأسنان في طرابزون. جميع الحقوق محفوظة.",
    "© 2026 Dt. Emre Atasoy - Trabzon Diş Kliniği.": "© 2026 د. إمري أطاسوي - عيادة طب الأسنان في طرابزون.",
    "<strong>Yasal Bilgilendirme:</strong> Bu sitedeki içerikler yalnızca bilgilendirme amaçlıdır; tanı ve tedavi niteliği taşımaz. Kişiye özel tedavi için lütfen hekim muayenesine başvurunuz.": "<strong>إشعار قانوني:</strong> محتوى هذا الموقع مخصص للأغراض التثقيفية والإعلامية فقط ولا يعتبر تشخيصاً أو علاجاً طبياً. للحصول على تشخيص مخصص يرجى مراجعة الطبيب المختص.",
    "Blog": "المدونة",
    "Yazan: Dt. Emre Atasoy • Trabzon Diş Hekimi": "بقلم: د. إمري أطاسوي • طبيب أسنان في طرابزون",
    "Diş Ağrısı & Kırık Diş": "ألم الأسنان والسن المكسور",
    "Diş Beyazlatma": "تبييض الأسنان",
    "Diş Eti Çekilmesi": "انحسار اللثة",
    "Diş Taşı Temizliği": "تنظيف جير الأسنان",
    "İmplant Nedir?": "ما هي زراعة الأسنان؟",
    "Kanal Tedavisi Rehberi": "دليل علاج الجذور",
    "Şeffaf Plak mı Diş Teli mi?": "التقويم الشفاف أم المعدني؟",
    "Zirkonyum mu Porselen mi?": "الزيركون أم البورسلين؟",
    "Her 20'lik Diş Çekilmeli midir?": "هل يجب خلع كل ضرس عقل؟",
    "Hangi Durumlarda Çekim Zorunludur?": "في أي الحالات يكون الخلع ضرورياً؟",
    "Hayır. Çene kemiğinde yeterli yer bularak düzgün sürmüş, karşı çenedeki dişle düzgün kapanış yapan ve fırçalanabilen 20'lik dişlerin çekilmesine kesinlikle gerek yoktur.": "كلا. أضراس العقل التي بزغت بشكل سليم مع وجود مساحة كافية في الفك وتطابق إطباقي مناسب مع الفك المقابل ويمكن تنظيفها بالفرشاة لا داعي لخلعها إطلاقاً.",
    "Kliniğimizdeki çekim prosedürünü incelemek için: <a href=\"../tedaviler/trabzon-20lik-dis-cekimi.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon 20'lik Diş Çekimi Sayfası →</a>": "للاطلاع على إجراءات الخلع في عيادتنا: <a href=\"../tedaviler/trabzon-20lik-dis-cekimi.html\" style=\"color: var(--primary); font-weight: bold;\">صفحة خلع ضرس العقل في طرابزون ←</a>",
    "<strong>Yarı Gömülü Kalma ve Diş Eti İltihabı:</strong> Dişin sadece bir kısmı çıkmışsa, üzerindeki diş eti cebinde yemek artıkları birikir ve perikoronitis (şiddetli apse ve çene kilitlenmesi) yaratır.": "<strong>الانطمار الجزئي والتهاب اللثة:</strong> إذا بزغ جزء من السن فقط، تتراكم بقايا الطعام تحت نسيج اللثة مسببة التهاب حوائط التاج (خراج مؤلم وصعوبة فتح الفم).",
    "<strong>Önündeki Dişi Çürütme:</strong> 20'lik diş öne doğru yatık sürdüğünde, komşu 2. azı dişin kökünü baskıyla eritir veya temizlenemeyen aralıkta derin çürük oluşturur.": "<strong>تسوس السن المجاور:</strong> عندما يبزغ ضرس العقل بميلان نحو الأمام، يضغط على جذر الضرس المجاور أو يسبب تسوساً عميقاً يصعب تنظيفه.",
    "<strong>Ortodontik Çapraşıklık Riski:</strong> Çenedeki dişleri öne iterek ön grup dişlerin çapraşıklaşmasına neden oluyorsa.": "<strong>خطر تزاحم الأسنان:</strong> إذا كان يضغط على الأسنان للأمام مسبباً اعوجاج وتزاحم الأسنان الأمامية.",
    "<strong>Kist ve Tümör Oluşumu:</strong> Gömülü dişin etrafındaki dokuda kistik lezyon saptanmışsa.": "<strong>تشكل الأكياس والأورام:</strong> في حال اكتشاف كيس أو آفة حول السن المنطمر بالأشعة.",
    "20'lik Diş Kontrolü": "فحص أضراس العقل",
    "Panoramik röntgen ile 20'lik dişlerinizin konumunu değerlendirmek için WhatsApp'tan hemen randevu alın.": "احجز موعدك عبر واتساب الآن لتقييم وضعية ضرس العقل بدقة عبر الأشعة البانورامية.",
    "Gece Başlayan Şiddetli Diş Ağrısında Ne Yapılmalı?": "ما العمل عند حدوث ألم شديد ومفاجئ في الأسنان ليلاً؟",
    "Diş Kırıldığında Ne Yapılmalı?": "ما الإجراء الصحيح عند انكسار السن؟",
    "Travma veya sert bir cisim ısırma sonucu dişiniz kırıldıysa; kırılan parçayı bulun ve <strong>bir miktar süt veya hastanın kendi tükürüğü içinde</strong> muhafaza ederek en geç 1-2 saat içinde kliniğimize gelin. Çoğu zaman kırılan parça estetik bonding ile yerine yeniden yapıştırılabilmektedir.": "إذا انكسر سنك بسبب صدمة أو قضم طعام صلب، ابحث عن القطعة المكسورة واحفظها في <strong>قليل من الحليب أو لعاب المريض نفسه</strong> وتوجه لعيادتنا خلال ساعة إلى ساعتين. غالباً ما يمكن إعادة لصق القطعة بتقنية البوندينج التجميلية.",
    "Ağzınızı ılık tuzlu su veya karbonatlı su ile nazikçe çalkalayarak diş aralarındaki yemek artıklarını temizleyin.": "تمضمض بلطف بالماء الدافئ والملح لتنظيف بقايا الطعام العالقة بين الأسنان.",
    "Diş aralarında sıkışmış besinleri diş ipi yardımıyla çıkarın.": "أزل أي بقايا طعام محشورة بين الأسنان باستخدام خيط الأسنان الطبي.",
    "<strong>Sakın Yapmayın:</strong> Ağrıyan dişin üzerine kesinlikle kolonya, aspirin, alkol veya tütün basmayın! Bu maddeler diş etinde kimyasal yanık oluşturarak ağrıyı katbekat artırır.": "<strong>تحذير هام:</strong> لا تضع الكولونيا أو الأسبرين أو الكحول أو التبغ مباشرة على السن المؤلم! فهذه المواد تسبب حروقاً كيميائية للثة وتزيد الألم سوءاً.",
    "Hekiminizin önereceği güvenli bir ağrı kesici alarak vakit kaybetmeden kliniğimize başvurun.": "تناول مسكناً آمناً للألم واستشر طبيب الأسنان في العيادة دون تأخير.",
    "Acil Diş Randevusu": "حجز طوارئ الأسنان",
    "Acil diş ağrısı veya kırık diş durumunda doğrudan WhatsApp hattımıza yazarak hızlı randevu alabilirsiniz.": "في حالات ألم الأسنان الحاد أو كسر السن، تواصل مباشرة عبر واتساب لحجز موعد طارئ وسريع.",
    "Klinik Tipi Diş Beyazlatma Nasıl Yapılır?": "كيف يتم تبييض الأسنان في العيادة؟",
    "Beyazlık Ne Kadar Süre Kalıcıdır?": "كم من الوقت يدوم بياض الأسنان؟",
    "Klinik ortamında uygulanan profesyonel beyazlatma işleminde önce diş etleri özel koruyucu bariyer ile izole edilir. Ardından diş minesi üzerine hidrojen peroksit bazlı medikal jel sürülür ve özel ışık kaynağıyla 15'er dakikalık seanslar halinde aktive edilir. İşlem toplam 45-60 dakikada biter.": "في التبييض السريري الاحترافي، تُعزل اللثة أولاً بحاجز واقٍ خاص. ثم يُوضع جل بيروكسيد الهيدروجين الطبي على مينا الأسنان ويُفعل بضوء خاص على جلسات مدة كل منها 15 دقيقة، ويستغرق الإجراء كاملاً 45-60 دقيقة.",
    "Elde edilen beyazlık hastanın beslenme alışkanlıklarına göre <strong>1 ila 3 yıl</strong> arasında korunur. İşlem sonrasındaki ilk 48 saat \"beyaz diyet\" (çay, kahve, salça, kırmızı şarap, sigara tüketmeme) kuralına uyulması kalıcılık için çok kritiktir.": "يدوم البياض المحقق ما بين <strong>سنة إلى 3 سنوات</strong> حسب عادات المريض الغذائية. ومن الضروري اتباع \"الحمية البيضاء\" خلال أول 48 ساعة بتجنب الشاي والقهوة والصلصات والتدخين لضمان دوام النتيجة.",
    "Işıltılı Bir Gülüş İçin": "لابتسامة ناصعة ومشرقة",
    "Klinik tipi diş beyazlatma fiyatı ve randevusu için WhatsApp hattımızdan bize ulaşabilirsiniz.": "تواصل معنا عبر واتساب لمعرفة أسعار تبييض الأسنان بالعيادة وحجز موعدك.",
    "Diş Eti Çekilmesinin Başlıca Nedenleri": "الأسباب الرئيسية لانحسار اللثة",
    "Diş Eti Çekilmesi Nasıl Tedavi Edilir?": "كيف يُعالج تراجع اللثة؟",
    "Öncelikle çekilmeye yol açan neden ortadan kaldırılır (diş taşı temizliği, doğru fırçalama eğitimi veya gece plağı uygulaması). İleri vakalarda ise açığa çıkan kök yüzeyleri bağ dokusu greftleri veya pembe estetik uygulamalarıyla kapatılarak hassasiyet giderilir.": "أولاً يُعالج السبب الجذري (تنظيف الجير، تصحيح طريقة التفريش أو واقي الأسنان الليلي). وفي الحالات المتقدمة، تُغطى جذور الأسنان المكشوفة بطعوم اللثة أو التجميل الوردي لإزالة الحساسية.",
    "<strong>Sert ve Yanlış Diş Fırçalama:</strong> Dişleri yatay ve aşırı bastırarak fırçalamak diş etini aşındırarak geriye çeker.": "<strong>التفريش الخاطئ والقاسي:</strong> تفريش الأسنان أفقياً وبضغط مفرط يؤدي لتآكل اللثة وتراجعها للخلف.",
    "<strong>Periodontal İltihap (Diş Taşları):</strong> Temizlenmeyen diş taşları kemiği eriterek diş etinin de aşağıya çekilmesine sebep olur.": "<strong>التهابات اللثة والجير:</strong> يؤدي تراكم الجير إلى ذوبان العظم المحيط وتراجع اللثة تدريجياً.",
    "<strong>Diş Sıkma ve Gıcırdatma (Bruksizm):</strong> Aşırı yük altında kalan diş köklerinde mikro çatlaklar ve diş eti çekilmeleri başlar.": "<strong>صرير وكز الأسنان (Bruxism):</strong> يسبب الضغط المفرط على الجذور شروخاً دقيقة وانحساراً في اللثة.",
    "<strong>Genetik Faktörler:</strong> İnce diş eti biyotipi çekilmeye daha yatkındır.": "<strong>عوامل وراثية:</strong> اللثة الرقيقة تكون أكثر عرضة للانحسار والتراجع طبيعياً.",
    "Diş Eti Muayenesi": "فحص وعلاج اللثة",
    "Kök hassasiyetiniz veya diş eti çekilmeniz varsa erken müdahale için WhatsApp'tan randevu alın.": "إذا كنت تعاني من حساسية الجذور أو تراجع اللثة، احجز موعدك عبر واتساب للتدخل المبكر.",
    "Diş Taşı (Tartar) Nedir?": "ما هو جير الأسنان (التكلسات)؟",
    "Diş Taşı Temizliği Diş Minesine Zarar Verir mi?": "هل يضر تنظيف الجير بمينا الأسنان؟",
    "Temizlik Yapılmazsa Ne Olur?": "ماذا يحدث في حال إهمال تنظيف الجير؟",
    "Yemeklerden sonra diş yüzeyinde biriken bakteri plağı düzenli fırçalanmadığında tükürükteki kalsiyum ve minerallerle birleşerek kireçleşir. Sertleşen bu yapıya <strong>diş taşı (tartar)</strong> denir. Diş taşı oluştuktan sonra artık normal diş fırçasıyla çıkarılamaz; mutlaka hekim müdahalesi gerekir.": "تتحد طبقة البلاك البكتيرية بعد الوجبات مع معادن اللعاب وتتكلس إذا لم تُنظف بانتظام، وتسمى هذه الرواسب الصلبة <strong>جير الأسنان (الترسبات الكلسية)</strong>. بمجرد تكون الجير، لا يمكن إزالته بفرشاة الأسنان العادية بل يحتاج لتدخل الطبيب المختص.",
    "Toplumda en sık rastlanan yanlış inanışlardan biri temizliğin mineyi çizdiği veya dişleri araladığı iddiasıdır. <strong>Bu tamamen yanlıştır.</strong> Ultrasonik cihazlar sadece titreşim ve su püskürterek dişe yapışmış yabancı kireç tabakasını döker; diş minesine dokunmaz ve zarar vermez.": "من الشائعات الخاطئة أن تنظيف الجير يخدش المينا أو يباعد بين الأسنان. <strong>وهذا غير صحيح تماماً.</strong> فأجهزة الموجات فوق الصوتية تعتمد على الاهتزاز ورذاذ الماء لإزالة التكلسات الخارجية فقط دون المساس بمينا الأسنان.",
    "Temizlenmeyen diş taşları diş etinin altına doğru ilerleyerek diş eti cebi oluşturur, kemiği eritir ve dişlerin sallanıp dökülmesine yol açar. Bu nedenle her bireyin <strong>6 ayda bir</strong> diş taşı temizliği yaptırması önerilir.": "يتوغل الجير غير المعالج تحت اللثة مكوناً جيوباً لثوية ويؤدي لتآكل العظم وتخلخل الأسنان وسقوطها. لذا يُوصى بتنظيف الجير دورياً <strong>كل 6 أشهر</strong>.",
    "Diş Taşı Temizliği Randevusu": "موعد تنظيف الجير",
    "Daha ferah bir nefes ve sağlıklı diş etleri için kliniğimizden hemen temizlik randevusu alın.": "احجز موعداً الآن في عيادتنا لنَفَس منعش ولثة صحية خالية من الالتهابات.",
    "Dental İmplant Ne Kadar Dayanır?": "كم يدوم زرع الأسنان؟",
    "İmplant Sonrası Nelere Dikkat Edilmeli?": "تعليمات ما بعد زراعة الأسنان",
    "Eksik dişler sadece estetik bir kayıp yaratmakla kalmaz; çiğneme dengesini bozar, komşu dişlerin boşluğa devrilmesine neden olur ve zamanla çene kemiğinin erimesine yol açar. Günümüzde eksik diş tedavisinde altın standart <strong>dental implant</strong> uygulamalarıdır.": "فقدان الأسنان لا يقتصر على المظهر التجميلي فقط، بل يخل بتوازن المضغ ويؤدي لميلان الأسنان المجاورة وتآكل عظام الفك بمرور الوقت. وتعتبر <strong>زراعة الأسنان</strong> اليوم المعيار الذهبي لتعويض الأسنان.",
    "İmplantlar dokuyla %100 uyumlu titanyum materyalden üretilir ve kemikle biyolojik olarak kaynaşır. Literatür verileri ve klinik deneyimlerimiz göstermektedir ki, iyi bir ağız hijyeni ve düzenli hekim kontrolleri sağlandığında implantların başarı oranı <strong>%98'in üzerindedir</strong> ve çoğu hastada <strong>ömür boyu</strong> sorunsuz hizmet verir.": "تُصنع الغرسات من التيتانيوم المتوافق حيوياً بنسبة 100% وتلتحم طبيعياً بالعظم. وتؤكد البيانات السريرية أن نسبة نجاح الزرع <strong>تتجاوز 98%</strong> مع العناية الجيدة بنظافة الفم، وتخدم المريض <strong>مدى الحياة</strong> في معظم الحالات.",
    "Trabzon Meydan'daki kliniğimizde implant tedavilerimiz hakkında detaylı bilgi ve muayene için bize ulaşabilirsiniz: <a href=\"../tedaviler/trabzon-implant.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon İmplant Tedavisi Detayları →</a>": "للحصول على معلومات مفصلة وفحص سريري لزراعة الأسنان في عيادتنا بميدان طرابزون: <a href=\"../tedaviler/trabzon-implant.html\" style=\"color: var(--primary); font-weight: bold;\">تفاصيل زراعة الأسنان في طرابزون ←</a>",
    "<strong>İlk 24 Saat:</strong> Sıcak gıdalardan kaçınılmalı, soğuk veya ılık yumuşak yiyecekler tercih edilmelidir. Tükürme veya pipetle içme yapılmamalıdır.": "<strong>أول 24 ساعة:</strong> تجنب الأطعمة الساخنة وتناول الأطعمة الباردة أو الدافئة الطرية. تجنب البصق أو الشرب بالقشة.",
    "<strong>Sigara Kullanımı:</strong> İyileşme döneminde sigara kemik kaynaşmasını olumsuz etkilediğinden kesinlikle ara verilmelidir.": "<strong>التدخين:</strong> يجب الامتناع التام عن التدخين أثناء مرحلة الشفاء لأنه يعيق اندماج الغرسة بالعظم.",
    "<strong>Ağız Temizliği:</strong> Ertesi günden itibaren dikişli bölgeyi zedelemeden dişler nazikçe fırçalanmalı ve hekimin önerdiği gargaralar kullanılmalıdır.": "<strong>نظافة الفم:</strong> نظف أسنانك بلطف بدءاً من اليوم التالي دون المساس بموقع الغرز واستخدم الغسول الطبي الموصوف.",
    "<strong>İlaç Tedavisi:</strong> Reçete edilen antibiyotik ve ağrı kesiciler saatlerine uygun olarak eksiksiz tüketilmelidir.": "<strong>الأدوية:</strong> تناول المضادات الحيوية والمسكنات الموصوفة في مواعيدها المحددة بدقة.",
    "İmplant Hakkında Soru Sorun": "استفسر عن زراعة الأسنان",
    "Kendi durumunuza özel implant süreci ve fiyatları hakkında WhatsApp'tan Dt. Emre Atasoy kliniğine danışın.": "استشر عيادة د. إمري أطاسوي عبر واتساب لمعرفة تكلفة وخطة زراعة الأسنان المناسبة لحالتك.",
    "Kanal Tedavisi Ağrılı mıdır?": "هل علاج عصب الأسنان مؤلم؟",
    "Kanal Tedavisi Kaç Seans Sürer?": "كم جلسة يستغرق علاج الجذور؟",
    "Halk arasında kanal tedavisinin çok acı verici olduğu yönünde yaygın bir inanış vardır; oysa bu durum gerçeği yansıtmaz. Kanal tedavisi, tam tersine hastayı diş ağrısından kurtaran işlemdir. Gelişmiş lokal anestezi altında yapıldığından <strong>tedavi sırasında hiçbir ağrı hissedilmez</strong>.": "هناك اعتقاد شائع بأن علاج العصب مؤلم للغاية، لكن هذا غير صحيح. فعلاج الجذور يهدف لإنقاذ السن وتخليص المريض من الألم، وبفضل التخدير الموضعي المتطور <strong>لا يشعر المريض بأي ألم أثناء الإجراء</strong>.",
    "Gelişen teknoloji, dijital apeks bulucular ve döner alet sistemleri sayesinde günümüzde çoğu kanal tedavisi <strong>tek seansta (yaklaşık 45-60 dakika)</strong> başarıyla tamamlanmaktadır. Ancak kök ucunda kist veya yoğun apse olan vakalarda kanala ilaç konularak 1 hafta sonra 2. seansta kapatma yapılabilir.": "بفضل محددات الذروة الرقمية والمحركات الآلية الحديثة، يُنجز معظم علاج العصب بنجاح في <strong>جلسة واحدة (45-60 دقيقة)</strong>. أما في حالات الخراج الشديد فيوضع دواء معقم داخل القناة ويُغلق السن في جلسة ثانية بعد أسبوع.",
    "Trabzon Meydan'daki kliniğimizde kanal tedavisi hakkında detaylı bilgi için: <a href=\"../tedaviler/trabzon-kanal-tedavisi.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Kanal Tedavisi Sayfası →</a>": "للمزيد من المعلومات حول علاج الجذور في عيادتنا بميدان طرابزون: <a href=\"../tedaviler/trabzon-kanal-tedavisi.html\" style=\"color: var(--primary); font-weight: bold;\">صفحة علاج الجذور في طرابزون ←</a>",
    "Diş Ağrınız mı Var?": "هل تعاني من ألم في الأسنان؟",
    "Kanal tedavisi randevusu almak için WhatsApp hattımıza hemen yazabilirsiniz.": "راسلنا فوراً عبر خط الواتساب لحجز موعد علاج عصب الأسنان.",
    "Ortodontide Karşılaştırma: Şeffaf Plak vs Metal Diş Teli": "مقارنة تقويم الأسنان: القوالب الشفافة مقابل التقويم المعدني",
    "Çapraşık diş tedavisinde son yıllarda şeffaf plakların popülaritesi hızla artmıştır. Peki sizin için hangisi daha uygun?": "حظيت قوالب التقويم الشفاف بشعبية واسعة في علاج تزاحم الأسنان مؤخراً، فما هو الخيار الأنسب لك؟",
    "<strong>Şeffaf Plak:</strong> Dışarıdan tamamen görünmezdir; yetişkin hastalar için iş ve sosyal hayatta büyük konfor sağlar.<br /> <strong>Diş Teli:</strong> Metal braketler belirgin şekilde görünür; porselen braketler daha estetiktir ancak yine de bir miktar fark edilir.": "<strong>التقويم الشفاف:</strong> غير مرئي تماماً من الخارج، ويوفر راحة وثقة كبيرة للبالغين في العمل والحياة الاجتماعية.<br /> <strong>التقويم السلكي:</strong> الحاصرات المعدنية بارزة وظاهرة؛ والخزفية أكثر جمالاً لكنها تظل مرئية نوعاً ما.",
    "<strong>Şeffaf Plak:</strong> Dışarıdan tamamen görünmezdir; yetişkin hastalar için iş ve sosyal hayatta büyük konfor sağlar.<br> <strong>Diş Teli:</strong> Metal braketler belirgin şekilde görünür; porselen braketler daha estetiktir ancak yine de bir miktar fark edilir.": "<strong>التقويم الشفاف:</strong> غير مرئي تماماً من الخارج، ويوفر راحة وثقة كبيرة للبالغين في العمل والحياة الاجتماعية.<br> <strong>التقويم السلكي:</strong> الحاصرات المعدنية بارزة وظاهرة؛ والخزفية أكثر جمالاً لكنها تظل مرئية نوعاً ما.",
    "<strong>Şeffaf Plak:</strong> Yemek yerken çıkarılır; yiyecek kısıtlaması (elma ısırma, kuruyemiş vb.) yoktur. Fırçalama ve diş ipi kullanımı son derece pratiktir.<br /> <strong>Diş Teli:</strong> Sert ve yapışkan yiyecekler telleri koparabildiği için yasaktır; braket aralarını temizlemek özel fırçalar gerektirir.": "<strong>التقويم الشفاف:</strong> يُنزع أثناء الأكل دون قيود غذائية (قضم التفاح والمكسرات). والتفريش واستخدام الخيط عملي للغاية.<br /> <strong>التقويم السلكي:</strong> يُمنع تناول الأطعمة الصلبة واللزجة لتجنب كسر الأسلاك، ويتطلب تنظيفاً بفرش خاصة.",
    "<strong>Şeffaf Plak:</strong> Yemek yerken çıkarılır; yiyecek kısıtlaması (elma ısırma, kuruyemiş vb.) yoktur. Fırçalama ve diş ipi kullanımı son derece pratiktir.<br> <strong>Diş Teli:</strong> Sert ve yapışkan yiyecekler telleri koparabildiği için yasaktır; braket aralarını temizlemek özel fırçalar gerektirir.": "<strong>التقويم الشفاف:</strong> يُنزع أثناء الأكل دون قيود غذائية (قضم التفاح والمكسرات). والتفريش واستخدام الخيط عملي للغاية.<br> <strong>التقويم السلكي:</strong> يُمنع تناول الأطعمة الصلبة واللزجة لتجنب كسر الأسلاك، ويتطلب تنظيفاً بفرش خاصة.",
    "Hafif ve orta derece çapraşıklıklarda estetik ve konfor arayan hastalarımıza <strong>Şeffaf Plak</strong> önerirken, ileri derecedeki iskeletsel çene problemlerinde <strong>klasik diş telleri</strong> daha uygun bir çözüm olabilmektedir.": "في حالات التزاحم البسيطة والمتوسطة، ننصح بـ <strong>التقويم الشفاف</strong> للمظهر التجميلي والراحة، بينما قد يكون <strong>التقويم التقليدي</strong> الأنسب لمشاكل الفكين الهيكلية المعقدة.",
    "Kliniğimizdeki şeffaf plak tedavisi hakkında daha fazla bilgi: <a href=\"../tedaviler/trabzon-seffaf-plak.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Şeffaf Plak Sayfası →</a>": "للمزيد حول التقويم الشفاف في عيادتنا: <a href=\"../tedaviler/trabzon-seffaf-plak.html\" style=\"color: var(--primary); font-weight: bold;\">صفحة التقويم الشفاف بطرابزون ←</a>",
    "Ortodonti Değerlendirmesi": "تقييم تقويم الأسنان",
    "Hangi yöntemin sizin için uygun olduğunu öğrenmek için WhatsApp'tan fotoğrafınızı iletebilir veya muayene randevusu alabilirsiniz.": "لمعرفة الطريقة الأنسب لحالتك، أرسل صور أسنانك عبر واتساب أو احجز موعداً للمعاينة.",
    "Zirkonyum ve Klasik Porselen Arasındaki Temel Farklar": "الفروق الجوهرية بين تيجان الزيركون والبورسلين التقليدي",
    "Diş kaplaması yaptırmak isteyen hastalarımızın en sık sorduğu soru şudur: <em>\"Zirkonyum mu yaptırmalıyım, yoksa klasik porselen mi?\"</em>": "أكثر سؤال يطرحه مرضانا عند الرغبة في تلبيس الأسنان: <em>\"هل أختار تيجان الزيركون أم البورسلين التقليدي؟\"</em>",
    "Klasik porselenlerin alt yapısında gri metal alaşım bulunur. Bu metal ışığı geçirmez ve dişin mat görünmesine neden olur. <strong>Zirkonyum</strong> ise beyaz renkli ve ışık geçirgen bir mineraldir. Bu sayede doğal diş minesi gibi parıldar.": "يحتوي البورسلين التقليدي على معدن رمادي يعيق مرور الضوء ويجعل السن باهتاً. أما <strong>الزيركون</strong> فهو معدن أبيض شفاف يمرر الضوء ويمنح لمعاناً طبيعياً كالمينا الحقيقية.",
    "Metal destekli kaplamalarda zamanla diş eti çekilirse diş eti sınırında koyu renkli gri metal hattı açığa çıkar. Zirkonyumda ise metal bulunmadığından diş eti çekilse dahi doğal beyazlık korunur.": "في التيجان المعدنية، إذا تراجعت اللثة بمرور الوقت يظهر خط رمادي داكن عند حافة السن. بينما الزيركون خالٍ تماماً من المعادن ويحافظ على البياض الطبيعي دائماً.",
    "Ön dişlerde estetik bir gülüş tasarımı hedefleniyorsa <strong>Zirkonyum</strong> mutlak tavsiyemizdir. Arka çiğneme bölgesinde ise bütçeye göre hem zirkonyum hem de klasik porselen tercih edilebilir.": "لتجميل الأسنان الأمامية وتصميم الابتسامة، ننصح بـ <strong>الزيركون</strong> كخيار مثالي، بينما في الأضراس الخلفية يمكن الاختيار بين الزيركون والبورسلين حسب الميزانية.",
    "Kliniğimizdeki zirkonyum uygulamalarını incelemek için: <a href=\"../tedaviler/trabzon-zirkonyum-kaplama.html\" style=\"color: var(--primary); font-weight: bold;\">Trabzon Zirkonyum Kaplama Sayfası →</a>": "للاطلاع على تطبيقات الزيركون في عيادتنا: <a href=\"../tedaviler/trabzon-zirkonyum-kaplama.html\" style=\"color: var(--primary); font-weight: bold;\">صفحة تيجان الزيركون في طرابزون ←</a>",
    "Hangi Kaplama Size Uygun?": "ما هو التاج الأنسب لأسنانك؟",
    "Ağız yapınıza en uygun diş kaplama türünü belirlemek için WhatsApp'tan hemen randevu oluşturun.": "احجز موعدك فوراً عبر واتساب لتحديد أفضل نوع تلبيس مناسب لبنية أسنانك.",
    "Çene kemiğine baskı yapan, iltihaba yol açan veya gömülü kalan 20 yaş dişlerinin ağrısız ve cerrahi uzmanlıkla çekilmesi.": "خلع جراحي دقيق وغير مؤلم لأضراس العقل المنطمرة أو المسببة للالتهابات والضغط على عظام الفك.",
    "20'lik Dişler Neden Sorun Yaratır?": "لماذا تسبب أضراس العقل مشاكل؟",
    "20'lik Diş Çekimi Ağrılı mıdır?": "هل خلع ضرس العقل مؤلم؟",
    "Çekim Sonrası Nelere Dikkat Edilmeli?": "تعليمات ما بعد خلع الضرس",
    "20 yaş dişleri (üçüncü azı dişleri) insan çenesinde en son süren dişlerdir. Çoğu zaman çene kavisinde yeterli yer bulunmadığı için diş kemik içinde gömülü kalır, eğri sürer veya yarı gömülü kalarak diş eti cebinde sürekli enfeksiyon (perikoronitis) ve şiddetli ağrı yaratır.": "أضراس العقل هي آخر الأسنان بزوغاً في الفك. وفي كثير من الأحيان، بسبب ضيق المساحة في الفك، يبقى الضرس منطمراً في العظم أو ينمو مائلاً، مسبباً التهاباً مزمناً في اللثة (التهاب حوائط التاج) وآلاماً شديدة.",
    "Kliniğimizde uygulanan güçlü lokal anestezi sayesinde operasyon tamamen ağrısızdır. Hekimimiz kemik ve çevre dokulara saygılı mikro cerrahi teknikleri kullandığı için işlem sonrası şişlik ve ağrı minimum seviyede tutulur.": "بفضل التخدير الموضعي الفعال في عيادتنا، يكون الإجراء غير مؤلم تماماً. ويستخدم طبيبنا تقنيات جراحية دقيقة تحافظ على العظام والأنسجة المحيطة لتقليل التورم والألم بعد العملية.",
    "Çekim bölgesine konulan tampon gazlı bez 30-45 dakika sıkıca ısırılmalıdır.": "يجب العض بقوة على قطعة الشاش المعقمة فوق مكان الخلع لمدة 30 إلى 45 دقيقة.",
    "Tükürme yapılmamalı ve pipetle içecek tüketilmemelidir (kan pıhtısının korunması için).": "تجنب البصق تماماً ولا تستخدم الماصة لشرب السوائل (للحفاظ على الخثرة الدموية).",
    "İlk 24 saat sıcak banyo ve sıcak yemeklerden kaçınılmalı, dışarıdan soğuk kompres uygulanmalıdır.": "تجنب الاستحمام بالماء الساخن وتناول الأطعمة الساخنة خلال أول 24 ساعة، مع وضع كمادات باردة خارجياً.",
    "20'lik Diş Ağrısı Çekmeyin": "تخلص من آلام ضرس العقل",
    "Röntgen kontrolü ve acısız çekim randevusu için doğrudan WhatsApp hattımızdan bize yazın.": "تواصل معنا مباشرة عبر واتساب لتقييم الأشعة وحجز موعد خلع مريح وبدون ألم.",
    "Çocuklarımızın diş hekimi korkusu yaşamadan, eğlenceli ve güvenli bir ortamda sağlıklı diş gelişiminin takip edilmesi.": "متابعة نمو أسنان أطفالنا في بيئة آمنة وودودة تزيل الخوف وتضمن صحة الفم والأسنان.",
    "Koruyucu Çocuk Diş Hekimliği": "طب أسنان الأطفال الوقائي",
    "Kliniğimizde Uygulanan Çocuk Diş Tedavileri": "علاجات أسنان الأطفال في عيادتنا",
    "Süt dişleri, çocuğun beslenmesi ve konuşması kadar altından gelecek kalıcı dişlerin yerini tutan doğal yer tutuculardır. Bu nedenle \"nasıl olsa düşecek\" diyerek süt dişleri ihmal edilmemelidir.": "تعتبر الأسنان اللبنية ضرورية لتغذية الطفل ونطقه، فضلاً عن كونها حافظات مسافة طبيعية للأسنان الدائمة. لذلك لا ينبغي إهمالها ظناً بأنها ستسقط لاحقاً.",
    "<strong>Fissür Örtücü (Diş Aşısı):</strong> Azı dişlerinin çiğneme yüzeyindeki derin girintilerin özel koruyucu reçine ile kapatılarak çürük oluşumunun engellenmesi.": "<strong>سدادات الشقوق (حماية الأسنان):</strong> إغلاق الشقوق العميقة في أسطح الأضراس بمادة راتنجية واقية لمنع تسوس الأسنان.",
    "<strong>Lokal Flor Uygulaması:</strong> Diş minelerini asitlere karşı güçlendiren koruyucu florlama.": "<strong>تطبيق الفلورايد الموضعي:</strong> جلسات فلورايد طبية لتقوية مينا الأسنان وحمايتها من الأحماض والتسوس.",
    "<strong>Süt Dişi Dolgusu ve Kanal Tedavisi (Amputasyon):</strong> Çürük süt dişlerinin düşme vaktine kadar ağızda sağlıklı kalması için yapılan tedaviler.": "<strong>حشوات الأسنان اللبنية وبتر العصب:</strong> معالجات للحفاظ على صحة الأسنان اللبنية حتى موعد تبديلها الطبيعي.",
    "Çocuğunuz İçin Randevu Alın": "احجز موعداً لطفلك",
    "Korkusuz ve şefkatli bir diş muayenesi için Dt. Emre Atasoy kliniğine WhatsApp'tan randevu yazabilirsiniz.": "يمكنك مراسلتنا عبر واتساب لحجز فحص لطيف وخالٍ من الخوف لطفلك في عيادة د. إمري أطاسوي.",
    "Çay, kahve ve sigara lekelerine veda edin. Klinik ortamında güvenli ve kalıcı beyazlatma ile bembeyaz bir gülüş.": "ودع تصبغات الشاي والقهوة والتدخين. ابتسامة ناصعة البياض مع جلسات تبييض آمنة وفعالة داخل العيادة.",
    "Diş Beyazlatma Nedir ve Nasıl Uygulanır?": "ما هو تبييض الأسنان وكيف يتم تطبيقه؟",
    "Diş Beyazlatma Diş Minesine Zarar Verir mi?": "هل يضر تبييض الأسنان بطبقة المينا؟",
    "<strong>Klinik tipi diş beyazlatma (office bleaching)</strong>, diş hekimi gözetiminde diş minesine özel beyazlatıcı jel sürülüp özel ışık cihazıyla aktive edilmesiyle uygulanır. Ortalama 45-60 dakikalık tek seansta diş tonu 3 ila 6 ton açılır.": "<strong>تبييض الأسنان بالعيادة</strong> يتم تحت إشراف الطبيب بوضع جل مبيض خاص على المينا وتنشيطه بضوء خاص، ليفتح لون الأسنان بمقدار 3 إلى 6 درجات في جلسة واحدة مدتها 45-60 دقيقة.",
    "Uzman diş hekimi kontrolünde yapılan profesyonel beyazlatma işlemlerinde diş minesine hiçbir zarar gelmez. Piyasada satılan kontrolsüz beyazlatıcı tozlar ve aşındırıcı macunlar yerine klinik beyazlatma tercih edilmelidir.": "جلسات التبييض السريرية المعتمدة بإشراف طبيب الأسنان لا تضر بمينا الأسنان مطلقاً. ويجب دائماً تفضيل التبييض الطبي على المساحيق الكاشطة المنتشرة تجارياً.",
    "Bembeyaz Bir Gülüş İçin": "لابتسامة ناصعة البياض",
    "Klinik tipi diş beyazlatma seansı ve fiyat bilgisi için WhatsApp hattımızdan bilgi alabilirsiniz.": "تواصل معنا عبر واتساب للاستفسار عن جلسات وأسعار تبييض الأسنان بالعيادة.",
    "Diş Çekimi": "خلع الأسنان",
    "Diş hekimliğinde her zaman dişi korumak esastır; ancak kurtarılamayacak duruma gelen dişlerin çevre kemiğe zarar vermeden konforlu çekimi.": "الحفاظ على السن الطبيعي هو أولويتنا دائماً؛ ولكن عند تعذر إنقاذ السن، يتم خلعه براحة تامة ودون الإضرار بالعظم المحيط.",
    "Hangi Durumlarda Diş Çekimi Yapılır?": "متى يلزم خلع السن؟",
    "Diş Çekimi Sırasında Acı Hissedilir mi?": "هل تشعر بأي ألم أثناء خلع السن؟",
    "Kanal tedavisi veya dolgu ile kurtarılamayacak kadar ileri derecede harabiyete uğramış dişler, kemik desteğini tamamen yitirmiş sallanan dişler veya ortodontik tedavi amacıyla hekim tarafından çekilmesi zorunlu görülen dişlerde çekim uygulanır.": "يتم اللجوء للخلع في حالات الأسنان المتآكلة بشدة والتي لا يمكن علاجها بالحشو أو سحب العصب، أو الأسنان المتحركة بسبب فقدان العظم، أو لأغراض تقويم الأسنان.",
    "Modern anestezikler sayesinde işlem tamamen ağrısızdır. Hekimimiz çekim bölgesindeki kemik yuvasını koruyarak işlem yaptığı için, gelecekte o bölgeye yapılacak bir implant tedavisinin başarısı da garanti altına alınır.": "بفضل تقنيات التخدير الحديثة، يكون الإجراء خالياً من الألم تماماً. كما يحرص طبيبنا على الحفاظ على تجويف العظم لضمان نجاح أي زراعة مستقبلية.",
    "Diş Çekimi & Muayene": "فحص وخلع الأسنان",
    "Şiddetli diş ağrınız için hemen kliniğimize ulaşın ve WhatsApp üzerinden acil randevu alın.": "تواصل مع عيادتنا فوراً لحالات ألم الأسنان الحاد واحجز موعداً طارئاً عبر واتساب.",
    "Diş Dolgusu & Bonding": "حشو الأسنان والبوندينج",
    "Doğal diş renginizle tam uyumlu ışınlı kompozit dolgular ve tek seansta diş aralıklarını kapatan estetik bonding.": "حشوات كمبوزيت ضوئية مطابقة للون الأسنان تماماً، وتجميل الفراغات بالبوندينج في جلسة واحدة.",
    "Kompozit Diş Dolgusu Nedir?": "ما هو حشو الكمبوزيت التجميلي؟",
    "Estetik Bonding (Kompozit Lamine) Nedir?": "ما هو البوندينج التجميلي (الفينير المركب)؟",
    "Çürük, kırık veya aşınma nedeniyle diş dokusunda oluşan madde kayıplarının, dişin doğal rengi ve anatomisine birebir uygun ışınlı kompozit reçinelerle doldurulması işlemidir. Kliniğimizde kesinlikle eski tip cıvalı siyah amalgam dolgular kullanılmamakta, tamamıyla estetik beyaz dolgular tercih edilmektedir.": "ترميم الأجزاء التالفة من السن الناتجة عن التسوس أو الكسور باستخدام راتنجات كمبوزيت تجميلية تتطابق مع لون وتشريح السن. نحن لا نستخدم حشوات الزئبق الفضية القديمة مطلقاً.",
    "Ön dişler arasındaki boşlukların (diastema), diş kırıklarının ve şekil bozukluklarının dişte hiçbir aşındırma yapılmadan kompozit malzeme ile kat kat şekillendirilerek düzeltilmesidir. Tek seansta ve anında sonuç verir.": "إصلاح الفراغات بين الأسنان الأمامية والكسور دون الحاجة إلى برد الأسنان، بتطبيق طبقات الكمبوزيت التجميلية بدقة للحصول على نتيجة فورية في جلسة واحدة.",
    "Dolgu & Bonding Randevusu": "موعد الحشو والبوندينج",
    "Çürük dişlerinizi ilerlemeden tedavi ettirmek veya bonding ile gülüşünüzü yenilemek için WhatsApp'tan yazın.": "راسلنا عبر واتساب لعلاج التسوس مبكراً أو تجديد ابتسامتك بتقنية البوندينج التجميلي.",
    "Diş eti kanamalarını, çekilmeleri ve kötü ağız kokusunu durduran periodontoloji tedavileri ile simetrik pembe diş eti estetiği.": "علاجات اللثة لوقف النزيف والانحسار ورائحة الفم الكريهة، مع تجميل وتنسيق اللثة الوردية.",
    "Diş Eti Hastalıkları (Gingivitis ve Periodontitis)": "أمراض اللثة (التهاب اللثة والتهاب دواعم السن)",
    "Kliniğimizde Uygulanan Diş Eti Tedavileri": "علاجات اللثة المتوفرة في عيادتنا",
    "Sağlıklı diş eti açık pembe renktedir, portakal kabuğu gibi pürtüklü bir dokuya sahiptir ve fırçalarken kanamaz. Fırçalama sırasında kanama, diş eti hastalığının ilk alarmıdır. Tedavi edilmediğinde çene kemiğine yayılır ve dişlerin sallanarak dökülmesine yol açar.": "اللثة السليمة تكون وردية فاتحة وذات ملمس ناعم ولا تنزف أثناء التفريش. النزيف هو أول مؤشر على مرض اللثة، وإذا لم يُعالج يمتد لعظام الفك مما يؤدي لتخلخل الأسنان وسقوطها.",
    "<strong>Detertraj (Diş Taşı Temizliği):</strong> Ultrasonik cihazlarla bakteri plaklarının temizlenmesi.": "<strong>تنظيف الجير:</strong> إزالة البلاك والتكلسات الجيرية بالأجهزة فوق الصوتية المتطورة.",
    "<strong>Küretaj (Derin Kök Yüzeyi Düzleştirmesi):</strong> Diş eti cebi altındaki iltihaplı dokuların anestezi altında temizlenmesi.": "<strong>التقليح العميق (الكشط):</strong> تنظيف الجيوب اللثة العميقة وإزالة الأنسجة المصابة تحت التخدير الموضعي.",
    "<strong>Gingivektomi (Pembe Estetik):</strong> Gülerken çok fazla görünen diş etlerinin lazer veya mikromimari ile estetik olarak kısaltılması.": "<strong>تجميل اللثة بالليزر:</strong> تعديل وتنسيق اللثة الظاهرة بشكل مفرط (الابتسامة اللثوية) لتحقيق تناسق جمالي.",
    "Diş Eti Sağlığınızı Koruyun": "حافظ على صحة لثتك",
    "Kanamalı diş etleriniz için erken teşhis ve tedavi randevusu almak üzere WhatsApp'tan bize yazın.": "تواصل معنا عبر واتساب لحجز موعد فحص مبكر وعلاج لنزيف والتهابات اللثة.",
    "Diş Teli Tedavisi": "علاج تقويم الأسنان",
    "Diş ve çene çapraşıklıklarını kalıcı olarak düzelten, çiğneme sağlığını ve estetik dizilimi sağlayan klasik ve estetik braket sistemleri.": "أنظمة تقويم كلاسيكية وشفافة لتعديل اعوجاج الأسنان وتحسين وظائف الإطباق والمظهر الجمالي بشكل دائم.",
    "Ortodontik Diş Teli Tedavisi Nedir?": "ما هو علاج تقويم الأسنان؟",
    "Diş Teli İçin Yaş Sınırı Var mıdır?": "هل يوجد عمر محدد لتقويم الأسنان؟",
    "Dişlerin çene kemiği üzerindeki hatalı konumlanmalarını, aralıklarını ve alt-üst çene kapanış bozukluklarını düzeltmek için uygulanan uzmanlık alanıdır. Metal braketlerin yanı sıra estetik görünüm isteyen hastalarımız için şeffaf safir/porselen braket seçenekleri mevcuttur.": "تخصص طب الأسنان المعني بتصحيح سوء تموضع الأسنان والفراغات ومشاكل إطباق الفكين. نوفر حاصرات معدنية قوية بالإضافة إلى حاصرات خزفية وشفافة لمظهر غير ملفت.",
    "Hayır, diş teli tedavisinde yaş sınırı yoktur. Sağlıklı diş eti ve kemik dokusuna sahip her yetişkine başarıyla ortodontik tedavi uygulanabilmektedir.": "كلا، لا يوجد حد أقصى للعمر في تقويم الأسنان. يمكن علاج أي شخص بالغ بنجاح طالما أن اللثة وعظام الفك تتمتعان بصحة جيدة.",
    "Ortodonti Muayenesi": "فحص واستشارة التقويم",
    "Diş çapraşıklığı ve tel tedavisi hakkında bilgi almak için WhatsApp'tan hemen randevu oluşturun.": "احجز موعداً عبر واتساب لمعرفة تفاصيل علاج وتكلفة تقويم الأسنان.",
    "<strong>Gülüş tasarımı</strong>, hastanın yüz oranları, dudak çizgisi, cinsiyeti, ten rengi ve beklentileri dikkate alınarak estetik açıdan kusursuz bir gülüşün hedeflendiği multidisipliner bir tedavidir. Bu süreçte gereksinimlere göre <strong>zirkonyum kaplama</strong>, <strong>lamina porselen (yaprak diş)</strong>, <strong>diş beyazlatma</strong> ve <strong>diş eti estetiği (pembe estetik)</strong> bir arada uygulanır.": "<strong>تصميم الابتسامة</strong> هو إجراء تجميلي متكامل يهدف لمنحك ابتسامة مثالية تتوافق مع ملامح وجهك، خط الشفاه، لون البشرة وتطلعاتك الشخصية، من خلال الجمع بين <strong>تيجان الزيركون</strong>، <strong>عدسات الفينير</strong>، <strong>تبييض الأسنان</strong> و<strong>تجميل اللثة</strong>.",
    "Planlanan işlemlerin türüne göre süreç genellikle <strong>4 ila 7 gün</strong> arasında, 2-3 seansta tamamlanır. Dijital tasarım aşamasında hasta dişlerinin bitmiş halini henüz başlamadan prova etme imkanına sahiptir.": "تكتمل الخطة العلاجية عادة خلال <strong>4 إلى 7 أيام</strong> على مدار 2-3 جلسات. ويتيح التصميم الرقمي للمريض معاينة النتيجة النهائية والموافقة عليها قبل البدء.",
    "<strong>Doğallık Önceliğimizdir:</strong> Gülüş tasarımı yapay ve tek tip beyaz dişler demek değildir. Dt. Emre Atasoy kliniğinde hedefimiz yüzünüze en çok yakışan, doğal anatominizi tamamlayan ve özgüveninizi yükselten kişiselleştirilmiş bir gülüş oluşturmaktır.": "<strong>الطبيعية هي أولويتنا:</strong> تصميم الابتسامة لا يعني أسناناً بيضاء مصطنعة وموحدة. في عيادة د. إمري أطاسوي هدفنا ابتكار ابتسامة طبيعية متناغمة تعزز ثقتك بنفسك وتبرز جمال وجهك الفريد.",
    "<strong>Pembe Estetik (Gingivektomi):</strong> Gülerken diş etlerinin aşırı görünmesi (gummy smile) durumunda diş eti seviyelendirmesi yapılır.": "<strong>التجميل الوردي (قص اللثة):</strong> تسوية وتنسيق مستوى اللثة بالليزر لعلاج الابتسامة اللثوية.",
    "<strong>Lamina Veneer veya Zirkonyum:</strong> Diş boyutları, formları ve eksiklikleri estetik porselenlerle restore edilir.": "<strong>الفينير أو الزيركون:</strong> استعادة حجم الأسنان وشكلها الجمالي بمواد خزفية عالية النفاذية للضوء.",
    "<strong>Diş Beyazlatma (Bleaching):</strong> Kendi doğal dişlerin rengi birkaç ton açılarak homojenlik sağlanır.": "<strong>تبييض الأسنان:</strong> تفتيح لون الأسنان الطبيعية لتحقيق تناسق لوني كامل مع الابتسامة الجديدة.",
    "<strong>Kompozit Bonding:</strong> Küçük diş aralıkları ve kırıklar tek seansta estetik kompozit reçinelerle düzeltilir.": "<strong>البوندينج التجميلي:</strong> معالجة الشقوق البسيطة والفراغات الصغيرة في جلسة واحدة.",
    "<strong>Dental implant</strong>, çeşitli nedenlerle kaybedilen doğal dişlerin kök fonksiyonunu üstlenmek üzere çene kemiğine yerleştirilen, dokuyla %100 biyolojik uyumlu saf titanyum vidalardır. Trabzon Meydan Doktorlar İşhanı'ndaki kliniğimizde Dt. Emre Atasoy tarafından uygulanan implant tedavileri, komşu sağlam dişlere hiçbir zarar vermeden eksik diş problemini kalıcı olarak çözer.": "<strong>زراعة الأسنان</strong> هي براغي من التيتانيوم النقي المتوافق حيوياً بنسبة 100%، تُثبت في عظام الفك لتقوم بوظيفة جذور الأسنان المفقودة. ويعالج د. إمري أطاسوي في طرابزون حالات فقدان الأسنان بشكل دائم دون المساس بالأسنان المجاورة السليمة.",
    "Genel sağlık durumu cerrahi müdahaleye engel olmayan, çene kemiği gelişimi tamamlanmış (18 yaş ve üzeri) ve yeterli kemik hacmine sahip herkese implant tedavisi uygulanabilir. Kemik erimesi olan vakalarda ise <strong>kemik grefti (kemik tozu)</strong> veya <strong>sinüs lifting</strong> yöntemleriyle kemik hacmi güçlendirilerek başarıyla implant yerleştirilmektedir.": "يمكن إجراء الزراعة لأي شخص يبلغ 18 عاماً فما فوق وتسمح حالته الصحية العامة وتتوفر لديه كثافة عظمية مناسبة. وفي حالات تراجع العظم، يتم دعم الفك بـ <strong>طعوم العظام (بودرة العظم)</strong> أو <strong>رفع الجيوب الأنفية</strong> بنجاح.",
    "İmplant operasyonundan sonraki ilk 24 saat çok sıcak yiyecek ve içeceklerden kaçınılmalı, sigara kullanılmamalı ve hekim tarafından reçete edilen ilaçlar düzenli alınmalıdır. Ağız hijyenine (diş fırçalama, arayüz fırçası ve diş ipi) dikkat edildiğinde implantlar bir ömür boyu kendi dişiniz gibi güvenle kullanılır.": "خلال أول 24 ساعة بعد العملية، يجب تجنب المشروبات الساخنة والتدخين والالتزام بالأدوية الموصوفة. ومع العناية الفموية المنتظمة، تدوم الزرعات مدى الحياة تماماً مثل أسنانك الطبيعية.",
    "<strong>Önemli Avantaj:</strong> Geleneksel köprü protezlerinde olduğu gibi komşu sağlam dişlerin küçültülmesine veya kesilmesine gerek kalmaz. İmplant bağımsız bir diş kökü gibi işlev görür ve çene kemiğindeki erimeyi durdurur.": "<strong>ميزة كبرى:</strong> على عكس الجسور التقليدية، لا حاجة لبرد أو تصغير الأسنان المجاورة السليمة. تعمل الزرعة كجذر مستقل وتمنع ذوبان عظام الفك.",
    "<strong>Detaylı Muayene & Dijital Röntgen:</strong> Çene kemiğinizin kalınlığı, sinir kanalları ve anatomik yapısı incelenir; kişiye özel tedavi planı hazırlanır.": "<strong>فحص تفصيلي وأشعة رقمية:</strong> تقييم سماكة عظام الفك ومسارات الأعصاب بدقة لوضع خطة علاجية مخصصة.",
    "<strong>Ağrısız Cerrahi Yerleşim:</strong> Lokal anestezi uygulanır. Hasta hiçbir ağrı veya acı hissetmeden titanyum vida çene kemiğine yerleştirilir (yaklaşık 15-20 dakika).": "<strong>تثبيت جراحي بدون ألم:</strong> يُطبق التخدير الموضعي وتُثبت زرعة التيتانيوم في عظام الفك دون أن يشعر المريض بأي ألم (خلال 15-20 دقيقة).",
    "<strong>Kemik Kaynaşma Süreci (Osteointegrasyon):</strong> İmplantın çene kemiğiyle tam bir bütün oluşturması için genellikle 2-3 ay beklenir. Bu süreçte hastanın konforu için geçici dişler takılabilir.": "<strong>مرحلة الالتحام العظمي:</strong> فترة تمتد من شهرين إلى 3 أشهر ليلتحم التيتانيوم بالكامل مع عظم الفك، مع إمكانية تركيب أسنان مؤقتة لراحة المريض.",
    "<strong>Kalıcı Zirkonyum / Porselen Dişin Takılması:</strong> Kaynaşma tamamlandıktan sonra dijital ölçü alınır ve laboratuvarda hazırlanan estetik zirkonyum veya porselen kuron implant üzerine sabitlenir.": "<strong>تركيب تاج الزيركون النهائي:</strong> بعد اكتمال الالتحام، تؤخذ قياسات رقمية دقيقة لتثبيت تاج الزيركون أو الخزف التجميلي الدائم فوق الزرعة.",
    "Şiddetli diş ağrısı, gece zonklaması veya derin çürüklerde kendi doğal dişinizi çekilmekten kurtaran ağrısız ve konforlu kanal tedavisi.": "علاج جذور مريح وبدون ألم لإنقاذ سنك الطبيعي من الخلع في حالات التسوس العميق وآلام النبض الليلية.",
    "Kanal Tedavisi Nedir ve Ne Zaman Gereklidir?": "ما هو علاج الجذور ومتى يلزم؟",
    "Hangi Belirtiler Kanal Tedavisi İhtiyacını Gösterir?": "ما هي أعراض الحاجة لعلاج الجذور؟",
    "Kanal Tedavisi Aşamaları ve Uygulama": "مراحل وخطوات علاج قنوات الجذور",
    "<strong>Kanal tedavisi (endodonti)</strong>, dişin en iç tabakasında bulunan damar ve sinir paketinin (pulpa) çürük veya travma nedeniyle iltihaplanması durumunda uygulanan tedavidir. Enfekte olmuş doku temizlenir, kök kanalları genişletilip dezenfekte edilir ve özel dolgu maddeleriyle hermetik (sızdırmaz) şekilde doldurulur.": "<strong>علاج الجذور (سحب العصب)</strong> هو إجراء يُطبق عند التهاب حزمة الأعصاب والأوعية الدموية في لب السن بسبب التسوس أو الرضوض. يتم تنظيف الأنسجة الملتهبة وتعقيم القنوات ثم حشوها بإحكام بمواد متوافقة حيوياً.",
    "<strong>Dişinizi Çektirmeyin!</strong> Kendi doğal dişiniz ağız sağlığınız için en kıymetli hazinedir. Zamanında yapılan bir kanal tedavisi sayesinde dişinizi çektirmeden ömür boyu ağızda tutabilirsiniz.": "<strong>لا تخلع سنك!</strong> سنك الطبيعي هو أغلى ما تملك لصحة فمك. فبفضل علاج الجذور في الوقت المناسب، يمكنك الحفاظ على سنك في فمك مدى الحياة.",
    "Özellikle geceleri artan, kendiliğinden başlayan şiddetli zonklayıcı diş ağrısı": "ألم نابض وحاد في السن يزداد شدة خاصة أثناء الليل ويبدأ تلقائياً",
    "Sıcak ve soğuk gıdalara karşı uzun süre geçmeyen keskin hassasiyet": "حساسية حادة ومستمرة تدوم لفترة طويلة بعد تناول الأطعمة الساخنة أو الباردة",
    "Dişe dokunulduğunda veya çiğneme yapıldığında şiddetli baskı ağrısı": "ألم شديد عند الضغط على السن أو أثناء المضغ وتلامس الأسنان",
    "Diş etinde sivilce benzeri fistül oluşması ve iltihap akıntısı": "ظهور دمل يشبه الحبة على اللثة مع خروج إفرازات صديدية",
    "Travma sonucu dişin canlılığını kaybetmesi ve renginin kararması": "موت عصب السن وتغير لونه إلى الداكن إثر التعرض لضربة أو صدمة",
    "<strong>Anestezi & İzolasyon:</strong> İşlem yapılacak diş ve çevre dokular uyuşturulur; hasta tamamen rahatlatılır.": "<strong>التخدير والعزل:</strong> تخدير موضعي تام للسن والأنسجة المحيطة لضمان راحة المريض واسترخائه التام.",
    "<strong>Çürüğün Temizlenmesi & Pulpa Odasının Açılması:</strong> Dişteki tüm çürük doku temizlenir ve kök kanallarına ulaşılır.": "<strong>إزالة التسوس وفتح حجرة اللب:</strong> تنظيف كافة الأجزاء المسوسة والوصول إلى مداخل قنوات الجذور.",
    "<strong>Kök Kanallarının Temizlenmesi & Şekillendirilmesi:</strong> Döner alet sistemleri (endomotor) ve apeks bulucu dijital cihazlarla kanal boyu tam ölçülerek bakterilerden arındırılır.": "<strong>تنظيف وتشكيل القنوات:</strong> استخدام أجهزة قياس الذروة الإلكترونية والمبارد الدوارة الحديثة لتعقيم القنوات من البكتيريا.",
    "<strong>Kanal Dolumu ve Üst Restorasyon:</strong> Kanallar biyouyumlu güta-perka ile doldurulur; dişin üzerine dayanıklı estetik dolgu veya zirkonyum kaplama yapılarak tedavi tamamlanır.": "<strong>حشو القنوات والترميم:</strong> حشو القنوات بمادة الجوتا بيركا الطبية وتغطية السن بحشوة تجميلية متينة أو تاج زيركون.",
    "Diş Ağrısı Beklemez!": "ألم الأسنان لا ينتظر!",
    "Şiddetli diş ağrınız varsa veya kanal tedavisi hakkında görüş almak istiyorsanız hemen WhatsApp randevu hattımızdan iletişime geçin.": "إذا كنت تعاني من ألم حاد في الأسنان أو ترغب في استشارة حول علاج العصب، تواصل فوراً عبر واتساب.",
    "Lamine Diş (Lamina Veneer)": "عدسات الأسنان (الفينير)",
    "Doğal diş dokusuna neredeyse hiç dokunmadan sadece ön yüzeye uygulanan ultra ince, şeffaf ve kusursuz estetik kaplamalar.": "رقائق خزفية فائقة الرقة والشفافية تثبت على السطح الأمامي للأسنان مع الحفاظ التام على بنية السن الطبيعي.",
    "Lamine Diş (Yaprak Porselen) Nedir?": "ما هي عدسات الأسنان (الفينير الخزفي)؟",
    "Lamine Dişin Avantajları": "مميزات عدسات الأسنان (الفينير)",
    "<strong>Lamina veneer</strong>, dişin sadece ön yüzeyinden yaklaşık 0.3 - 0.7 mm kadar çok ince bir tabaka kaldırılarak ya da bazı vakalarda hiç aşındırma yapılmadan (prepless) özel porselen yaprakçıkların dişe yapıştırılması işlemidir.": "<strong>الفينير (عدسات الأسنان)</strong> هو إجراء يتم فيه برد طبقة متناهية الصغر (0.3 - 0.7 مم) من المينا الأمامية أو بدون برد إطلاقاً، وتثبيت رقائق الخزف الفاخرة على السن.",
    "Maksimum doku koruması sağlar; doğal dişinizin arkası tamamen sağlam kalır.": "أقصى درجات الحفاظ على الأسنان: الجزء الخلفي والداخلي من سنك الطبيعي يظل سليماً بنسبة 100%.",
    "Işık geçirgenliği doğal diş minesiyle birebirdir.": "نفاذية الضوء مطابقة تماماً لمينا الأسنان الطبيعية دون مظهر مصطنع.",
    "Porselen yüzey pürüzsüz olduğu için kahve, çay ve sigara lekeleri tutmaz.": "سطح الخزف المصقول والناعم لا يلتقط تصبغات القهوة والشاي والتدخين أبداً.",
    "Lamine Diş Randevusu": "حجز موعد عدسات الفينير",
    "Ön diş estetiğinde en zarif çözüm olan lamine diş için Dt. Emre Atasoy kliniğinden randevu alın.": "احجز موعدك في عيادة د. إمري أطاسوي للحصول على أرقى حلول تجميل الأسنان الأمامية بعدسات الفينير.",
    "Dayanıklı metal alt yapısıyla yüksek çiğneme kuvvetlerine dirençli, uzun ömürlü ve bütçe dostu porselen kaplamalar.": "تيجان البورسلين المدعمة بالمعدن لتحمل قوى المضغ العالية مع متانة طويلة الأمد وتكلفة اقتصادية.",
    "Metal Destekli Porselen Kaplama Nedir?": "ما هو تلبيس البورسلين المدعم بالمعدن؟",
    "Metal destekli porselen kaplama, diş hekimliğinde uzun yıllardır güvenle uygulanan klasik bir protetik tedavidir. İç kısmında biyouyumlu metal alaşım bir iskelet, dış yüzeyinde ise diş renginde fırınlanmış estetik dental porselen yer alır. Özellikle arka azı dişlerde yüksek çiğneme kuvvetlerini karşılamak için mükemmel bir dayanıklılık sunar.": "البورسلين المدعم بالمعدن هو علاج تعويضي كلاسيكي موثوق به منذ عقود، يتكون من هيكل معدني متوافق حيوياً مغطى بطبقة خزفية بلون الأسنان. يوفر قوة فائقة ومثالية للأضراس الخلفية.",
    "Porselen Diş Muayenesi": "فحص تيجان البورسلين",
    "Kaplama tedavileri hakkında detaylı bilgi ve muayene randevusu almak için WhatsApp hattımıza yazabilirsiniz.": "راسلنا عبر واتساب لمعرفة تفاصيل علاجات التيجان وحجز موعد الفحص والاستشارة.",
    "Protez Diş & Köprü": "أطقم وجسور الأسنان التعويضية",
    "Çoklu veya tam diş eksikliklerinde rahat çiğneme, net konuşma ve estetik yüz dolgunluğu sağlayan protez çözümleri.": "حلول تركيبات تعويضية متطورة لاستعادة راحة المضغ، النطق السليم، وامتلاء ملامح الوجه عند فقدان الأسنان.",
    "Protez Diş Çeşitleri": "أنواع تركيبات الأسنان التعويضية",
    "<strong>Sabit Protezler (Köprü ve Kuron):</strong> Ağızda kalan sağlam dişlere veya implantlara tutturulan, hastanın kendisinin çıkaramadığı konforlu protezlerdir.": "<strong>التركيبات الثابتة (الجسور والتيجان):</strong> تركيبات مريحة تُثبت على الأسنان السليمة أو الزرعات ولا يمكن للمريض نزعها.",
    "<strong>Hareketli Protezler (Total ve Parsiyel):</strong> Çok sayıda veya tüm dişlerini kaybetmiş hastalarda damağa oturan, temizlik için takılıp çıkarılabilen protezlerdir.": "<strong>الأطقم المتحركة (الكاملة والجزئية):</strong> أطقم تستند على اللثة للمرضى الذين فقدوا معظم أو كل أسنانهم، قابلة للنزع للتنظيف.",
    "<strong>Hassas Bağlantılı (Çıtçıtlı) Protezler:</strong> Kancası dışarıdan görünmeyen estetik hareketli protezlerdir.": "<strong>الأطقم الدقيقة (المثبتة بنقاط ارتكاز مخفية):</strong> أطقم متحركة بدون مشابك معدنية ظاهرة لمنح مظهر تجميلي فائق.",
    "Protez Diş Muayenesi": "فحص واستشارة التركيبات",
    "Eksik dişleriniz için sabit köprü veya hareketli protez seçeneklerini hekimimizle değerlendirin.": "ناقش مع طبيبنا خيارات الجسور الثابتة أو الأطقم التعويضية المناسبة لحالتك.",
    "Metal braketler olmadan, dışarıdan kimsenin fark edemeyeceği şeffaf plaklar ile düzgün diş dizilimi ve konforlu tedavi.": "اصطفاف مستقيم للأسنان وعلاج مريح باستخدام قوالب تقويم شفافة وغير مرئية بدون أسلاك معدنية.",
    "Şeffaf Plakların Avantajları": "مميزات التقويم الشفاف (الإنفزلاين)",
    "<strong>Şeffaf plak tedavisi</strong>, diş çapraşıklıklarını ve aralıklarını düzeltmek için metal teller yerine kişiye özel üretilen şeffaf kalıpların kullanıldığı modern ortodontik yöntemdir. Plaklar dışarıdan neredeyse görünmez ve sosyal hayatta maksimum estetik rahatlık sağlar.": "<strong>التقويم الشفاف</strong> هو أسلوب تقويمي حديث يستخدم قوالب شفافة مصممة رقمياً خصيصاً لكل مريض بدلاً من الأسلاك المعدنية لتعديل الأسنان براحة وأناقة غير ملحوظة.",
    "<strong>Görünmezlik:</strong> Karşınızdaki kişi dikkatlice bakmadıkça plak taktığınızı fark edemez.": "<strong>غير مرئي تقريباً:</strong> لا يمكن لأحد ملاحظة ارتدائك لقوالب التقويم في حياتك اليومية.",
    "<strong>Yemek Yerken Çıkarabilme:</strong> İstenilen her yiyecek serbestçe yenebilir, ardından dişler fırçalanıp plak geri takılır.": "<strong>إمكانية النزع أثناء الأكل:</strong> تناول ما يحلو لك من أطعمة بحرية، ثم فرّش أسنانك وأعد ارتداء القالب.",
    "<strong>Yara ve Batma Olmaz:</strong> Tel veya braket batması gibi dudak/yanak yaraları yaşanmaz.": "<strong>راحة تامة بدون جروح:</strong> خلو القوالب من الأسلاك والمعدن يحمي الشفاه والخدود من التقرحات والخدوش.",
    "Şeffaf Plak Muayenesi": "استشارة التقويم الشفاف",
    "Dişlerinizin şeffaf plak tedavisine uygunluğunu öğrenmek için WhatsApp'tan hemen randevu oluşturun.": "احجز موعدك عبر واتساب لمعرفة مدى ملاءمة التقويم الشفاف لابتسامتك.",
    "Metal desteksiz, ışığı doğal diş gibi geçiren, diş etiyle tam uyumlu ve dayanıklı zirkonyum porselen diş kaplamaları Trabzon Meydan'da.": "تيجان زيركون تجميلية متينة وخالية من المعادن، تنقل الضوء كالسن الطبيعي ومتوافقة تماماً مع اللثة في ميدان طرابزون.",
    "Zirkonyum Diş Kaplama Nedir?": "ما هي تيجان الزيركون للأسنان؟",
    "Zirkonyum Kaplama Hangi Durumlarda Uygulanır?": "متى يُنصح باختيار تيجان الزيركون؟",
    "Zirkonyum Kaplama Tedavi Süreci ve Aşamaları": "مراحل وخطوات تركيب تيجان الزيركون",
    "Zirkonyum Kaplamanın Bakımı": "طرق العناية بتيجان الزيركون",
    "<strong>Zirkonyum kaplama</strong>, klasik porselen dişlerin alt yapısında kullanılan gri metal yerine beyaz renkli zirkonyum dioksit alaşımının kullanıldığı ileri teknoloji bir estetik restorasyondur. Işık geçirgenliği doğal diş minesine çok yakın olduğu için yapay durmaz, güldüğünüzde mat veya donuk bir görünüm oluşturmaz.": "<strong>تلبيس الزيركون</strong> هو ترميم تجميلي متطور يعتمد على أكسيد الزركونيوم الأبيض بدلاً من المعدن الرمادي القديم. ونظراً لنفاذية الضوء المماثلة لمينا الأسنان، يمنحك مظهراً طبيعياً مشرقاً دون أي بهتان.",
    "Zirkonyum kaplamalar tıpkı doğal dişler gibi günde iki kez fırçalanmalı, diş ipi ve hekimin tavsiye ettiği arayüz fırçalarıyla düzenli temizlenmelidir. 6 ayda bir yapılan rutin diş hekimi kontrolleri kaplamaların ömrünü on yıllarca uzatır.": "تعتني بتيجان الزيركون كما تعتني بأسنانك الطبيعية بالتفريش مرتين يومياً واستخدام خيط الأسنان والفرشاة بينية. والفحص الدوري كل 6 أشهر يحافظ على متانتها لعقود طويلة.",
    "<strong>Neden Zirkonyum Tercih Edilmeli?</strong> Metal alerjisi riski taşımaz, sıcak ve soğuk iletkenliği çok düşüktür, diş eti çekilmesinde kök kenarında gri koyuluk yapmaz ve çürük/renklenmiş dişleri mükemmel şekilde örter.": "<strong>لماذا تختار الزيركون؟</strong> خالٍ من خطر حساسية المعادن، ناقليته للحرارة والبرودة منخفضة جداً، لا يسبب خطاً رمادياً عند حافة اللثة في حال انحسارها، ويغطي الأسنان المصطبغة بامتياز.",
    "Aşırı madde kaybı veya geniş dolgusu olan dişlerin restorasyonunda": "ترميم الأسنان التي تعاني من فقدان كبير في بنيتها أو تحتوي على حشوات ضخمة",
    "Kanal tedavisi sonrasında kırılma riski taşıyan dişlerin güçlendirilmesinde": "تقوية وحماية الأسنان المعالجة عصبياً والمعرضة للكسر تحت ضغط المضغ",
    "Beyazlatma ile açılamayan ileri derecedeki antibiyotik veya flor renklenmelerinde": "تغطية التصبغات العميقة المستعصية على التبييض (مثل تصبغات التتراسيكلين والفلور)",
    "Hafif çapraşık veya aralıklı (diastema) dişlerin ortodonti istemeyen hastalarda düzeltilmesinde": "تعديل اعوجاج الأسنان البسيط أو إغلاق الفراغات لمن لا يرغب في تقويم الأسنان",
    "İmplant üstü sabit kuron ve köprü protezlerinde": "صناعة التيجان والجسور الثابتة فائقة المتانة والمثبتة فوق زرعات الأسنان",
    "Hollywood Smile ve estetik gülüş tasarımında": "تصميم ابتسامة هوليوود الساحرة وتجميل الابتسامة المخصص للوجه",
    "<strong>Muayene ve Hazırlık:</strong> Dişler lokal anestezi altında minimum düzeyde törpülenerek hazırlanır. Hastaya hemen geçici kaplamalar takılır; hasta kliniğimizden dişsiz ayrılmaz.": "<strong>الفحص والتحضير:</strong> يُبرد السن بالحد الأدنى تحت التخدير الموضعي، وتُركب تيجان مؤقتة فوراً حتى لا يغادر المريض بدون أسنان.",
    "<strong>Hassas Ölçü Alımı:</strong> Dişlerin mikrometrik hassasiyette ölçüsü alınır ve renk seçimi hastanın ten/dudak tonuna göre belirlenir.": "<strong>أخذ المقاسات الدقيقة:</strong> أخذ طبعة رقمية دقيقة وتحديد درجة اللون المناسبة لبشرتك وشفتيك.",
    "<strong>Laboratuvar CAD/CAM Üretimi:</strong> Bilgisayar destekli tasarım cihazlarıyla zirkonyum bloklar mikron düzeyinde kazınarak estetik form verilir.": "<strong>تصنيع CAD/CAM الدقيق:</strong> نحت كتل الزيركون بأجهزة حاسوبية فائقة الدقة لإعطاء الشكل التشريحي الجذاب.",
    "<strong>Uyum Provası ve Sabitleme:</strong> Hazırlanan kaplamaların ağız içi uyumu, çiğneme kapanışı ve estetiği kontrol edildikten sonra özel yapıştırıcılarla kalıcı olarak dişe sabitlenir.": "<strong>البروفة والتثبيت النهائي:</strong> تجربة التيجان في الفم للتأكد من الإطباق والشكل التجميلي قبل لصقها دائماً بمواد طبية خاصة.",
    "Gülüşünüzü Zirkonyum ile Yenileyin": "جدد ابتسامتك مع تيجان الزيركون",
    "Dt. Emre Atasoy kliniğinde zirkonyum kaplama hakkında detaylı bilgi ve muayene randevusu almak için hemen WhatsApp'tan yazın.": "راسلنا فوراً عبر واتساب لمعرفة كافة التفاصيل وحجز موعد استشارة لتيجان الزيركون في عيادة د. إمري أطاسوي."
  }
};

function applyUniversalPageTranslation(lang) {
  const trans = UNIVERSAL_TRANSLATIONS[lang];

  // 1. Selector bazlı evrensel çeviri
  const selectors = [
    '.nav-menu .nav-link',
    '.top-bar-item',
    '.breadcrumb-nav a',
    '.breadcrumb-nav span',
    '.page-hero-title',
    '.page-hero-subtitle',
    '.treatment-v2-badge',
    '.treatment-v2-title',
    '.treatment-v2-desc',
    '.v2-pill',
    '.btn-v2-detail',
    '.cb-badge',
    '.cb-card-title',
    '.cb-btn-wp',
    '.cb-btn-call',
    '.contact-banner-info h3',
    '.contact-banner-info p',
    '.legal-notice',
    '.footer-bottom > div:first-child',
    '.footer-bottom a',
    '.mobile-btn-call',
    '.mobile-btn-wp',
    '.cta-box-widget h3',
    '.cta-box-widget p',
    '.btn-widget-wp',
    '.btn-widget-call',
    '.blog-badge',
    '.blog-meta span',
    '.blog-card-title',
    '.blog-card-desc',
    '.blog-read-more',
    '.filter-tab-btn',
    '.filter-chip',
    '.btn-whatsapp-nav',
    '.article-content h2',
    '.article-content h3',
    '.article-content p',
    '.article-callout',
    '.article-content ul li',
    '.article-content ol li',
    '.faq-question span:first-child',
    '.faq-answer',
    '.address-highlight-box > div:first-child',
    '.address-text',
    '.district-badge',
    '.contact-quick-item div > div',
    '.btn-primary-hero',
    '.nav-lang-title'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));
  elements.forEach(el => {
    if (el.hasAttribute('data-i18n') || el.querySelector('[data-i18n]')) return;

    if (!el.hasAttribute('data-tr-orig')) {
      el.setAttribute('data-tr-orig', el.innerHTML);
    }

    const origHtml = el.getAttribute('data-tr-orig');
    const cleanHtml = origHtml.replace(/\s+/g, ' ').trim();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = origHtml;
    const cleanOrigText = tempDiv.textContent.replace(/\s+/g, ' ').trim();
    const cleanText = el.textContent.replace(/\s+/g, ' ').trim();

    if (lang === 'tr') {
      el.innerHTML = origHtml;
    } else if (trans) {
      if (trans[origHtml]) {
        el.innerHTML = trans[origHtml];
      } else if (trans[cleanHtml]) {
        el.innerHTML = trans[cleanHtml];
      } else if (trans[cleanOrigText]) {
        el.innerHTML = trans[cleanOrigText];
      } else if (trans[cleanText]) {
        el.innerHTML = trans[cleanText];
      }
    }
  });

  // 2. Özel Çalışma Saatleri Kartı (tedaviler/index.html)
  const cbHours = document.querySelector('.cb-card-hours');
  if (cbHours && !cbHours.hasAttribute('data-i18n')) {
    if (!cbHours.hasAttribute('data-tr-orig')) {
      cbHours.setAttribute('data-tr-orig', cbHours.innerHTML);
    }
    if (lang === 'tr') {
      cbHours.innerHTML = cbHours.getAttribute('data-tr-orig');
    } else if (lang === 'en') {
      cbHours.innerHTML = '<strong>Working Hours:</strong> Mon - Sat: 09:00 - 19:00<br /><span style="font-size:0.84rem; color:#94A3B8;">Trabzon Square • Doktorlar Business Center Fl:4 No:40</span>';
    } else if (lang === 'ar') {
      cbHours.innerHTML = '<strong>ساعات العمل:</strong> الإثنين - السبت: 09:00 - 19:00<br /><span style="font-size:0.84rem; color:#94A3B8;">ميدان طرابزون • مجمع الأطباء ط:4 رقم:40</span>';
    }
  }
}


function initLanguageSwitcher() {
  const dropdowns = document.querySelectorAll('.lang-dropdown');
  
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.lang-btn');
    if (!btn) return;
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    const items = dropdown.querySelectorAll('.lang-menu-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = item.getAttribute('data-lang');
        setLanguage(lang);
        dropdown.classList.remove('open');
      });
    });
  });

  // Mobile drawer language buttons
  const navLangBtns = document.querySelectorAll('.nav-lang-btn');
  navLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdowns.forEach(d => d.classList.remove('open'));
  });

  // Load saved language on init
  const savedLang = localStorage.getItem('site_lang') || 'tr';
  setLanguage(savedLang, false);
}

function setLanguage(lang, showToast = true) {
  if (!TRANSLATIONS[lang]) lang = 'tr';
  currentSiteLang = lang;
  localStorage.setItem('site_lang', lang);

  // Update HTML lang & dir
  document.documentElement.lang = lang;
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  // Update top-bar dropdown display
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    if (lang === 'tr') {
      btn.innerHTML = `<span>🇹🇷 TR</span> <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`;
    } else if (lang === 'en') {
      btn.innerHTML = `<span>🇬🇧 EN</span> <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`;
    } else if (lang === 'ar') {
      btn.innerHTML = `<span>🇸🇦 AR</span> <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`;
    }
  });

  // Update active states in menus
  document.querySelectorAll('.lang-menu-item').forEach(item => {
    if (item.getAttribute('data-lang') === lang) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  document.querySelectorAll('.nav-lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Apply translations to all [data-i18n] elements
  const dict = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Evrensel dinamik çeviriciyi alt sayfalar ve diğer öğeler için çalıştır
  applyUniversalPageTranslation(lang);

  // Update WhatsApp links with appropriate language message
  updateWhatsAppLinks(lang);

  // Sync Tooth 3D Scroll animation texts
  if (typeof window.updateToothAnimationLanguage === 'function') {
    window.updateToothAnimationLanguage();
  }

  // Show Toast
  if (showToast) {
    showLanguageToast(dict.toast_msg);
  }
}

function updateWhatsAppLinks(lang) {
  const phone = '905327755278';
  let message = 'Merhaba Dt. Emre Atasoy kliniği, randevu almak istiyorum.';
  if (lang === 'en') {
    message = 'Hello Dr. Emre Atasoy Clinic, I would like to book a dental consultation in Trabzon.';
  } else if (lang === 'ar') {
    message = 'مرحبا عيادة د. إمري أطاسوي في طرابزون، أود حجز موعد استشارة لطب الأسنان.';
  }
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll('.btn-whatsapp-nav, .btn-primary-hero, .btn-overlay-wp, .mobile-btn-wp, .footer-col .btn-whatsapp-nav').forEach(a => {
    if (a.tagName === 'A' && a.href.includes('wa.me')) {
      a.href = url;
    }
  });
}

function showLanguageToast(msg) {
  let toast = document.getElementById('lang-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lang-toast';
    toast.style.cssText = 'position:fixed;bottom:85px;left:50%;transform:translateX(-50%);background:#0B192C;color:white;padding:12px 24px;border-radius:30px;font-size:0.88rem;font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,0.35);z-index:9999;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;gap:10px;animation:langToastFade 0.3s ease;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🌐</span> ${msg}`;
  toast.style.display = 'flex';
  setTimeout(() => {
    if (toast) toast.style.display = 'none';
  }, 3200);
}

/* ==========================================================================
   6. Dinamik WhatsApp Yönlendirici Yardımcısı
   ========================================================================== */
window.openWhatsApp = function(procedureName) {
  const phone = '905327755278';
  let message = 'Merhaba Dt. Emre Atasoy kliniği, bilgi ve muayene randevusu almak istiyorum.';

  if (currentSiteLang === 'en') {
    message = procedureName 
      ? `Hello Dr. Emre Atasoy Clinic, I would like information and an appointment regarding ${procedureName}.`
      : 'Hello Dr. Emre Atasoy Clinic, I would like to book a dental consultation in Trabzon.';
  } else if (currentSiteLang === 'ar') {
    message = procedureName
      ? `مرحبا عيادة د. إمري أطاسوي، أود الاستفسار وحجز موعد بخصوص علاج ${procedureName}.`
      : 'مرحبا عيادة د. إمري أطاسوي في طرابزون، أود حجز موعد استشارة لطب الأسنان.';
  } else if (procedureName) {
    message = `Merhaba Dt. Emre Atasoy kliniği, ${procedureName} tedavisi hakkında bilgi ve randevu almak istiyorum.`;
  }

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank');
};

/* ==========================================================================
   7. Apple-Style Scroll-Driven Diş Anatomisi & Restorasyon Animasyonu
   ========================================================================== */
function initToothScrollAnimation() {
  const track = document.getElementById('dis-anatomisi');
  const canvas = document.getElementById('toothCanvas');
  if (!track || !canvas) return;

  const ctx = canvas.getContext('2d');
  const totalFrames = 300;
  const frameImages = new Array(totalFrames + 1);
  let currentRenderedFrame = 1;
  let isTicking = false;

  // 5 Aşamalı İçerik Bilgileri (TR / EN / AR - 5 Adımda %20 Eşit Aralıklar)
  const STEPS_DATA_I18N = {
    tr: [
      {
        step: '01 / 05',
        percent: '%20',
        badge: '1. Aşama • Mine & Çiğneme',
        title: '1. Doğal Diş Mimarisi ve Anatomisi',
        desc: 'Diş minesi ve dentin katmanlarının anatomik yapısı. Dış zırh vazifesi gören mine dokusu çiğneme kuvvetlerine karşı dişi korur.',
        focus: 'Mine & Çiğneme Yüzeyi',
        approach: 'Doğal Doku Analizi'
      },
      {
        step: '02 / 05',
        percent: '%40',
        badge: '2. Aşama • Pulpa & Canlılık',
        title: '2. Pulpa ve Sinir Kökü Koruması',
        desc: 'Dişin canlılığını ve beslenmesini sağlayan damar-sinir demeti (pulpa). Koruyucu hekimlikte temel amaç bu dokunun sağlığını sürdürmektir.',
        focus: 'Endodontik Canlılık',
        approach: 'Biyolojik İzolasyon'
      },
      {
        step: '03 / 05',
        percent: '%60',
        badge: '3. Aşama • Zirkonyum Kapak',
        title: '3. Mikron Hassasiyetinde Kaplama',
        desc: 'Dişin formunu ve ışık geçirgenliğini birebir taklit eden, dijital CAD/CAM ile sıfır hata toleransıyla üretilen estetik zirkonyum kaplama.',
        focus: 'CAD/CAM Hassasiyeti',
        approach: 'Estetik Gülüş Dizaynı'
      },
      {
        step: '04 / 05',
        percent: '%80',
        badge: '4. Aşama • Lazer Bonding',
        title: '4. Biyouyumlu Entegrasyon & Bonding',
        desc: 'Gelişmiş yapıştırma teknolojisi ve biyouyumlu materyallerle restorasyonun dişe sızıntısız ve basınca dayanıklı kenar uyumuyla bağlanması.',
        focus: 'Moleküler Bağlantı',
        approach: 'Sıfır Kenar Sızıntısı'
      },
      {
        step: '05 / 05',
        percent: '%100',
        badge: '5. Aşama • Tam Restorasyon',
        title: '5. Doğal ve Kusursuz Diş Bütünlüğü',
        desc: 'Doğal dişten ayırt edilemeyen, tam çiğneme kuvvetine ve estetik parlaklığa kavuşmuş nihai diş sağlığı restorasyonu.',
        focus: 'Nihai Restorasyon',
        approach: 'Ömür Boyu Konfor & Estetik'
      }
    ],
    en: [
      {
        step: '01 / 05',
        percent: '20%',
        badge: 'Stage 1 • Enamel & Chewing',
        title: '1. Natural Tooth Architecture & Anatomy',
        desc: 'Anatomical layering of enamel and dentin. Enamel serves as a protective outer shield against daily masticatory forces.',
        focus: 'Enamel & Occlusal Plane',
        approach: 'Natural Tissue Analysis'
      },
      {
        step: '02 / 05',
        percent: '40%',
        badge: 'Stage 2 • Pulp & Vitality',
        title: '2. Pulp & Root Nerve Protection',
        desc: 'The neurovascular bundle (pulp) providing vitality and nutrition. Preserving this vital core is the cornerstone of preventive dentistry.',
        focus: 'Endodontic Vitality',
        approach: 'Biological Isolation'
      },
      {
        step: '03 / 05',
        percent: '60%',
        badge: 'Stage 3 • Zirconia Crown',
        title: '3. Micron-Precision Aesthetic Crown',
        desc: 'High-translucency zirconia crown crafted with digital CAD/CAM technology, matching the exact hue and light dynamics of natural enamel.',
        focus: 'CAD/CAM Precision',
        approach: 'Aesthetic Smile Design'
      },
      {
        step: '04 / 05',
        percent: '80%',
        badge: 'Stage 4 • Laser Bonding',
        title: '4. Biocompatible Integration & Bonding',
        desc: 'Seamless, pressure-resistant adhesive bonding with biocompatible resin matrices, ensuring zero micro-leakage and long-term durability.',
        focus: 'Molecular Adhesion',
        approach: 'Zero Marginal Leakage'
      },
      {
        step: '05 / 05',
        percent: '100%',
        badge: 'Stage 5 • Full Restoration',
        title: '5. Flawless Natural Tooth Integrity',
        desc: 'A complete clinical and aesthetic restoration indistinguishable from natural dentition, offering lifelong comfort and full chewing function.',
        focus: 'Final Restoration',
        approach: 'Lifelong Comfort & Beauty'
      }
    ],
    ar: [
      {
        step: '01 / 05',
        percent: '20%',
        badge: 'المرحلة 1 • المينا والمضغ',
        title: '1. البنية الطبيعية وتشريح السن',
        desc: 'التمايز التشريحي لطبقات المينا والعاج. يعمل نسيج المينا كدرع واقٍ يحمي السن من قوى وضغوط المضغ اليومية.',
        focus: 'طبقة المينا وسطح المضغ',
        approach: 'تحليل الأنسجة الطبيعية'
      },
      {
        step: '02 / 05',
        percent: '40%',
        badge: 'المرحلة 2 • اللب والحيوية',
        title: '2. حماية اللب والعصب الجذري',
        desc: 'الحزمة الوعائية العصبية (لب السن) المسؤولة عن تغذية وحيوية السن. الحفاظ على هذه الأنسجة هو جوهر طب الأسنان الوقائي.',
        focus: 'الحيوية اللبية والوقاية',
        approach: 'العزل الحيوي المعقم'
      },
      {
        step: '03 / 05',
        percent: '60%',
        badge: 'المرحلة 3 • تاج الزيركون',
        title: '3. تاج زيركون بدقة الميكرون',
        desc: 'تاج زيركون عالي الشفافية ومطابق تماماً للمينا الطبيعية، مصمم ومصنّع رقمياً بواسطة CAD/CAM بدون أدنى هامش خطأ.',
        focus: 'دقة CAD/CAM الرقمية',
        approach: 'تصميم الابتسامة التجميلية'
      },
      {
        step: '04 / 05',
        percent: '80%',
        badge: 'المرحلة 4 • الربط بالليزر',
        title: '4. الترابط والتكامل الحيوي المتقن',
        desc: 'تثبيت التاج بتقنيات لصق متطورة ومواد متوافقة حيوياً تضمن إغلاقاً حفافياً محكماً ومقاوماً للضغط دون أي تسريب مجهري.',
        focus: 'الترابط الجزيئي المحكم',
        approach: 'انعدام التسرب الحفافي'
      },
      {
        step: '05 / 05',
        percent: '100%',
        badge: 'المرحلة 5 • ترميم كامل',
        title: '5. تكامل السن الطبيعي والمثالي',
        desc: 'ترميم نهائي متكامل لا يمكن تمييزه عن السن الطبيعي، يعيد القوة الكاملة للمضغ والبريق التجميلي الدائم لمدى الحياة.',
        focus: 'الترميم النهائي الشامل',
        approach: 'راحة وجمال يدومان مدى الحياة'
      }
    ]
  };

  let currentScrollProgress = 0;

  // UI Elementleri
  const progressFill = document.getElementById('scrollProgressFill');
  const canvasBadgeText = document.getElementById('canvasProgressText');
  const canvasFrameText = document.getElementById('canvasFrameText');
  const stepPillNumber = document.getElementById('stepPillNumber');
  const stepPillPercent = document.getElementById('stepPillPercent');
  const stepCardTitle = document.getElementById('stepCardTitle');
  const stepCardDesc = document.getElementById('stepCardDesc');
  const stepMetaFocus = document.getElementById('stepMetaFocus');
  const stepMetaApproach = document.getElementById('stepMetaApproach');
  const stepButtons = document.querySelectorAll('.btn-step-item');

  function getFramePath(index) {
    const num = String(index).padStart(3, '0');
    return `images/dis-animasyon/ezgif-frame-${num}.jpg`;
  }

  // İlk kareyi derhal yükle ve çiz
  const firstImg = new Image();
  firstImg.src = getFramePath(1);
  firstImg.onload = () => {
    frameImages[1] = firstImg;
    renderFrame(1);
  };

  // Arka planda kademeli ön yükleme (Önce ana adımlar, sonra tamamı)
  function preloadImages() {
    const keyFrames = [1, 60, 120, 180, 240, 300];
    keyFrames.forEach(i => {
      if (!frameImages[i]) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => { frameImages[i] = img; };
      }
    });

    let idx = 2;
    function loadNextBatch() {
      const batchSize = 8;
      for (let b = 0; b < batchSize && idx <= totalFrames; b++, idx++) {
        if (!frameImages[idx]) {
          const img = new Image();
          img.src = getFramePath(idx);
          img.onload = () => { frameImages[idx] = img; };
        }
      }
      if (idx <= totalFrames) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadNextBatch);
        } else {
          setTimeout(loadNextBatch, 40);
        }
      }
    }
    setTimeout(loadNextBatch, 80);
  }
  preloadImages();

  function renderFrame(frameNum) {
    frameNum = Math.max(1, Math.min(totalFrames, Math.round(frameNum)));
    let img = frameImages[frameNum];

    // En yakın yüklü kareye sığın
    if (!img || !img.complete) {
      for (let offset = 1; offset <= 25; offset++) {
        if (frameImages[frameNum - offset] && frameImages[frameNum - offset].complete) {
          img = frameImages[frameNum - offset];
          break;
        }
        if (frameImages[frameNum + offset] && frameImages[frameNum + offset].complete) {
          img = frameImages[frameNum + offset];
          break;
        }
      }
    }

    if (img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentRenderedFrame = frameNum;
    } else {
      const loadImg = new Image();
      loadImg.src = getFramePath(frameNum);
      loadImg.onload = () => {
        frameImages[frameNum] = loadImg;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(loadImg, 0, 0, canvas.width, canvas.height);
        currentRenderedFrame = frameNum;
      };
    }
  }

  function updateUI(progress) {
    currentScrollProgress = progress;
    const frame = Math.min(totalFrames, Math.max(1, Math.round(progress * (totalFrames - 1)) + 1));
    renderFrame(frame);

    // Aktif Adım Belirleme (1'den 5'e, her biri %20)
    let stepIndex = Math.min(4, Math.floor(progress * 5));
    if (progress >= 0.96) stepIndex = 4;
    
    const activeLang = currentSiteLang || 'tr';
    const stepsList = STEPS_DATA_I18N[activeLang] || STEPS_DATA_I18N.tr;
    const data = stepsList[stepIndex];

    const percentInt = Math.max(5, Math.round(progress * 100));
    const percentStr = (activeLang === 'tr') ? `%${percentInt}` : `${percentInt}%`;

    if (progressFill) progressFill.style.width = percentInt + '%';
    if (canvasBadgeText) canvasBadgeText.textContent = percentStr + ' • ' + data.badge;
    if (canvasFrameText) canvasFrameText.textContent = `Kare: ${frame} / ${totalFrames}`;

    if (stepPillNumber) stepPillNumber.textContent = data.step;
    if (stepPillPercent) stepPillPercent.textContent = percentStr;
    if (stepCardTitle) stepCardTitle.textContent = data.title;
    if (stepCardDesc) stepCardDesc.textContent = data.desc;
    if (stepMetaFocus) stepMetaFocus.textContent = data.focus;
    if (stepMetaApproach) stepMetaApproach.textContent = data.approach;

    stepButtons.forEach((btn, idx) => {
      if (idx === stepIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Dışarıdan dil değiştiğinde animasyon kartlarını güncelleme fonksiyonu
  window.updateToothAnimationLanguage = function() {
    updateUI(currentScrollProgress);
  };

  // Scroll Olayı Dinleyicisi (Masaüstü ve Mobil Uyumlu)
  function onScroll() {
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - window.innerHeight;
    let progress = 0;

    if (trackHeight > 0) {
      const scrolled = -rect.top;
      progress = Math.max(0, Math.min(1, scrolled / trackHeight));
    } else {
      // Mobilde auto-height durumu için viewport kaydırma pozisyonuna göre hesapla
      const windowH = window.innerHeight || document.documentElement.clientHeight;
      const totalDist = windowH + (rect.height || 400);
      const currentDist = windowH - rect.top;
      progress = Math.max(0, Math.min(1, currentDist / totalDist));
    }

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        updateUI(progress);
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Butonlara Tıklama (Doğrudan ilgili adıma anında geçiş & masaüstünde pürüzsüz kaydırma)
  stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'), 10);
      const targetRatio = (step - 1) / 4;
      
      // Mobilde ve tıklamalarda anında UI ve canvas güncelle
      updateUI(targetRatio);

      const trackHeight = track.offsetHeight - window.innerHeight;
      if (trackHeight > 0) {
        const trackTop = track.getBoundingClientRect().top + window.scrollY;
        const targetScroll = trackTop + (targetRatio * trackHeight);

        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mouse Wheel ile Her Scroll'da %20 İlerletme (5 Scroll'da Tamamlanma)
  let wheelTimeout = null;
  const stickyContainer = track.querySelector('.tooth-scroll-sticky');
  
  if (stickyContainer) {
    stickyContainer.addEventListener('wheel', (e) => {
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight - window.innerHeight;
      
      // Sadece ekranın içine kilitlendiğinde adım desteği ver
      if (rect.top <= 2 && rect.bottom >= window.innerHeight - 2) {
        const scrolled = -rect.top;
        const currentProgress = Math.max(0, Math.min(1, scrolled / trackHeight));
        
        // En baştaysa ve yukarı kaydırıyorsa veya en sondaysa ve aşağı kaydırıyorsa doğal akışa devret
        if ((currentProgress <= 0.02 && e.deltaY < 0) || (currentProgress >= 0.98 && e.deltaY > 0)) {
          return;
        }

        e.preventDefault();
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 260);

        // Her scroll %20 hareket etsin (5 adımda tamamlanma mantığı)
        const stepDelta = e.deltaY > 0 ? 0.20 : -0.20;
        const newProgress = Math.max(0, Math.min(1, Math.round((currentProgress + stepDelta) * 5) / 5));
        
        const trackTop = track.getBoundingClientRect().top + window.scrollY;
        const targetScroll = trackTop + (newProgress * trackHeight);
        
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }, { passive: false });
  }
}

