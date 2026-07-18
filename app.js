const HAS_GSAP = typeof window.gsap !== "undefined";
const HAS_SCROLLTRIGGER = HAS_GSAP && typeof window.ScrollTrigger !== "undefined";

if (HAS_SCROLLTRIGGER) {
  gsap.registerPlugin(ScrollTrigger);
}

const WEDDING_DATE = new Date("2027-02-14T17:00:00");
const GALLERY_IMAGES = ["DSC00317.jpg", "DSC00380.jpg", "DSC00403.jpg"];
const POST_WEDDING_FOLDER = "post-boda/";

const translations = {
  es: {
    openInvitation: "Abrir invitación",
    weddingDay: "Nuestro gran día",
    heroPhrase: "Dos historias, un mismo destino.",
    weddingDate: "14 de febrero de 2027",
    startExperience: "Comenzar",
    countdownKicker: "Cuenta regresiva",
    countdownTitle: "Cada segundo nos acerca",
    days: "Días",
    hours: "Horas",
    minutes: "Minutos",
    seconds: "Segundos",
    galleryKicker: "Galería",
    galleryTitle: "Nuestra historia en luz",
    itineraryKicker: "Itinerario",
    itineraryTitle: "Un día para recordar",
    dressKicker: "Código de vestimenta",
    dressTitle: "Elegancia atemporal",
    men: "Hombres",
    women: "Mujeres",
    menDress: "Traje oscuro o tonos neutros, camisa clara y zapatos formales.",
    womenDress: "Vestido largo o midi en tonos suaves; accesorios delicados.",
    locationKicker: "Ubicación",
    locationTitle: "Nos vemos aquí",
    venueLabel: "Lugar",
    openMaps: "Abrir en Google Maps",
    rsvpKicker: "Confirmación",
    rsvpTitle: "Confirma tu asistencia",
    rsvpHint: "Nombre, acompañantes y mensaje para los novios",
    albumKicker: "Álbum posterior",
    albumTitle: "Recuerdos de nuestra celebración",
    albumLocked: "Las fotografías estarán disponibles después de la boda.",
    thanks: "Gracias por acompañarnos.",
    itinerary: [
      { time: "16:30", title: "Ceremonia", desc: "Intercambio de votos en el jardín principal." },
      { time: "18:00", title: "Cóctel", desc: "Brindis y aperitivos en la terraza." },
      { time: "19:30", title: "Recepción", desc: "Bienvenida oficial con música en vivo." },
      { time: "20:30", title: "Cena", desc: "Menú de autor cuidadosamente seleccionado." },
      { time: "22:00", title: "Baile", desc: "Celebración bajo las luces." }
    ]
  },
  en: {
    openInvitation: "Open invitation",
    weddingDay: "Our wedding day",
    heroPhrase: "Two stories, one destiny.",
    weddingDate: "February 14, 2027",
    startExperience: "Begin",
    countdownKicker: "Countdown",
    countdownTitle: "Every second brings us closer",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    galleryKicker: "Gallery",
    galleryTitle: "Our story in light",
    itineraryKicker: "Itinerary",
    itineraryTitle: "A day to remember",
    dressKicker: "Dress code",
    dressTitle: "Timeless elegance",
    men: "Men",
    women: "Women",
    menDress: "Dark or neutral suit, light shirt and formal shoes.",
    womenDress: "Long or midi dress in soft tones, with delicate accessories.",
    locationKicker: "Location",
    locationTitle: "Meet us here",
    venueLabel: "Venue",
    openMaps: "Open in Google Maps",
    rsvpKicker: "RSVP",
    rsvpTitle: "Confirm your attendance",
    rsvpHint: "Name, number of guests and message for the couple",
    albumKicker: "After wedding album",
    albumTitle: "Memories from our celebration",
    albumLocked: "The photos will be available after the wedding.",
    thanks: "Thank you for being with us.",
    itinerary: [
      { time: "4:30 PM", title: "Ceremony", desc: "Vows exchange in the main garden." },
      { time: "6:00 PM", title: "Cocktail", desc: "Toast and appetizers on the terrace." },
      { time: "7:30 PM", title: "Reception", desc: "Official welcome with live music." },
      { time: "8:30 PM", title: "Dinner", desc: "Curated signature menu." },
      { time: "10:00 PM", title: "Dance", desc: "Celebration under the lights." }
    ]
  }
};

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

let currentLang = "es";

function preloadImages(srcList) {
  return Promise.all(
    srcList.map((src) => new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = resolve;
    }))
  );
}

function splitTextAnimation() {
  qsa(".split-text").forEach((node) => {
    const text = node.textContent.trim();
    node.textContent = "";
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      node.appendChild(span);
    });
  });
}

function animateHeroText() {
  if (!HAS_GSAP) return;
  qsa(".split-text").forEach((node) => {
    gsap.fromTo(
      node.children,
      { y: 55, opacity: 0, filter: "blur(7px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.035, ease: "power3.out", duration: 1.15, delay: 0.2 }
    );
  });
}

function buildGallery(images, targetId) {
  const container = qs(targetId);
  container.innerHTML = "";
  images.forEach((src, index) => {
    const button = document.createElement("button");
    button.className = "masonry-item reveal-item";
    button.type = "button";
    button.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = `Audel y Luna ${index + 1}`;

    button.appendChild(img);
    button.addEventListener("click", () => openLightbox(src));
    container.appendChild(button);
  });
}

function buildItinerary() {
  const wrap = qs("#itineraryCards");
  wrap.innerHTML = "";
  translations[currentLang].itinerary.forEach((item) => {
    const card = document.createElement("article");
    card.className = "timeline-card reveal-item";
    card.innerHTML = `
      <p class="timeline-time">${item.time}</p>
      <div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    `;
    wrap.appendChild(card);
  });
}

function updateI18n() {
  const dict = translations[currentLang];
  qsa("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) node.textContent = dict[key];
  });
  document.documentElement.lang = currentLang;
  buildItinerary();
}

function setLanguage(lang) {
  currentLang = lang;
  qsa(".lang-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
  updateI18n();
}

function startCountdown() {
  const refs = {
    days: qs("#days"),
    hours: qs("#hours"),
    minutes: qs("#minutes"),
    seconds: qs("#seconds")
  };

  const tick = () => {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    if (diff <= 0) {
      Object.values(refs).forEach((node) => {
        node.textContent = "00";
      });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    refs.days.textContent = String(days).padStart(2, "0");
    refs.hours.textContent = String(hours).padStart(2, "0");
    refs.minutes.textContent = String(minutes).padStart(2, "0");
    refs.seconds.textContent = String(seconds).padStart(2, "0");
  };

  tick();
  setInterval(tick, 1000);
}

function openLightbox(src) {
  const lightbox = qs("#lightbox");
  const img = qs("#lightboxImage");
  img.src = src;
  lightbox.classList.remove("hidden");
  if (!HAS_GSAP) return;
  gsap.fromTo(img, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" });
}

function closeLightbox() {
  const lightbox = qs("#lightbox");
  if (!HAS_GSAP) {
    lightbox.classList.add("hidden");
    return;
  }
  gsap.to("#lightboxImage", { scale: 0.95, opacity: 0, duration: 0.45, onComplete: () => lightbox.classList.add("hidden") });
}

function initScrollReveal() {
  if (!HAS_SCROLLTRIGGER) {
    qsa(".reveal-item").forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
      item.style.filter = "none";
    });
    return;
  }

  qsa(".reveal-item").forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 40, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 86%"
        }
      }
    );
  });

  gsap.to(".hero-bg", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5
    }
  });
}

function initLuxuryCursor() {
  if (!HAS_GSAP) return;
  if (window.matchMedia("(max-width: 1024px), (pointer: coarse)").matches) return;
  const cursor = qs("#luxuryCursor");
  const dot = qs("#luxuryCursorDot");

  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    gsap.to(cursor, { x: clientX, y: clientY, duration: 0.2, opacity: 1, ease: "power3.out" });
    gsap.to(dot, { x: clientX, y: clientY, duration: 0.1, opacity: 1, ease: "none" });
  });

  qsa("a, button, .masonry-item").forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
}

async function discoverPostWeddingImages() {
  try {
    const response = await fetch(POST_WEDDING_FOLDER);
    if (!response.ok) return [];
    const html = await response.text();
    const hrefMatches = [...html.matchAll(/href="([^"]+)"/gi)];
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
    return hrefMatches
      .map((match) => match[1])
      .filter((href) => allowed.some((ext) => href.toLowerCase().endsWith(ext)))
      .map((href) => `${POST_WEDDING_FOLDER}${href.replace(/^.*[\\/]/, "")}`);
  } catch {
    return [];
  }
}

async function initPostWeddingAlbum() {
  const images = await discoverPostWeddingImages();
  const lock = qs("#postWeddingLock");
  const gallery = qs("#postWeddingGallery");
  if (!images.length) return;

  lock.classList.add("hidden");
  gallery.classList.remove("hidden");
  buildGallery(images, "#postWeddingGallery");
  if (HAS_SCROLLTRIGGER) ScrollTrigger.refresh();
}

function openBookExperience() {
  const gate = qs("#bookGate");
  if (!gate) return;
  if (!HAS_GSAP) {
    gate.remove();
    qs("#mainContent").style.opacity = "1";
    document.body.style.overflowY = "auto";
    animateHeroText();
    return;
  }
  const tl = gsap.timeline();
  tl.to(".book-cover-front", { rotateY: -172, duration: 1.95, ease: "power4.inOut" })
    .to(".book-shell", { rotateX: 8, y: -16, duration: 1.2, ease: "power3.inOut" }, "<")
    .to(gate, { opacity: 0, duration: 1.2, ease: "power3.inOut" }, "-=0.55")
    .to("#mainContent", { opacity: 1, duration: 1.4, ease: "power2.out", onStart: animateHeroText }, "-=0.8")
    .add(() => {
      gate.remove();
      document.body.style.overflowY = "auto";
    });
}

function hardUnlockPage() {
  const gate = qs("#bookGate");
  const preloader = qs("#preloader");
  if (gate) gate.remove();
  if (preloader) preloader.remove();
  qs("#mainContent").style.opacity = "1";
  document.body.style.overflowY = "auto";
}

async function init() {
  document.body.style.overflowY = "hidden";
  qs(".hero-bg").style.backgroundImage = `url('${GALLERY_IMAGES[0]}')`;
  splitTextAnimation();
  buildGallery(GALLERY_IMAGES, "#masonryGallery");
  buildItinerary();
  updateI18n();
  startCountdown();
  initLuxuryCursor();
  initScrollReveal();
  initPostWeddingAlbum();

  qsa(".lang-btn").forEach((btn) => btn.addEventListener("click", () => setLanguage(btn.dataset.lang)));
  qs("#startJourney").addEventListener("click", () => {
    document.querySelector("#gallerySection").scrollIntoView({ behavior: "smooth" });
  });

  qs("#openInvitation").addEventListener("click", openBookExperience);
  qs("#closeLightbox").addEventListener("click", closeLightbox);
  qs("#lightbox").addEventListener("click", (event) => {
    if (event.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  await preloadImages(GALLERY_IMAGES.slice(0, 2));
  if (!HAS_GSAP) {
    qs("#preloader").remove();
    return;
  }
  gsap.to("#preloader", { opacity: 0, duration: 0.8, delay: 0.25, onComplete: () => qs("#preloader").remove() });
}

init().catch(() => {
  hardUnlockPage();
});

setTimeout(() => {
  if (document.body.style.overflowY === "hidden") {
    hardUnlockPage();
  }
}, 8000);
