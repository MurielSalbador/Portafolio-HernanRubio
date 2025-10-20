/* scripts.js
 - Animaciones: fade-in del hero, reveals con IntersectionObserver,
 - Galería: filtro por categoría y lightbox con prev/next.
 - Formularios: validación simple (no envío real).
*/

/* Helpers */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {

  // YEAR en footer
  $('#year').textContent = new Date().getFullYear();

  // HERO entrance animation
  requestAnimationFrame(() => {
    const title = document.querySelector('.hero-title');
    const sub = document.querySelector('.hero-sub');
    title.style.transition = 'opacity .6s ease, transform .6s ease';
    sub.style.transition = 'opacity .6s ease .08s, transform .6s ease .08s';
    title.style.opacity = 1;
    title.style.transform = 'translateY(0)';
    sub.style.opacity = 1;
    sub.style.transform = 'translateY(0)';
  });

  // Intersection Observer para revelar grid items y secciones
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.12 });

  // aplicar observer a grid items y secciones targeteadas
  $$('.grid-item').forEach((el, i) => {
    setTimeout(() => { observer.observe(el); }, 80 * i); // pequeño stagger
  });
  $$('.section-title, .about-text, .about-image').forEach(el => observer.observe(el));

  // FILTROS
  const filters = $$('.filter');
  const items = $$('.grid-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(it => {
        const cat = it.dataset.category;
        if (f === '*' || cat === f) {
          it.style.display = ''; // mostrar
          // force reflow then animate in
          requestAnimationFrame(() => { it.style.opacity = ''; it.style.transform = ''; });
        } else {
          it.style.display = 'none';
        }
      });
    });
  });

  // LIGHTBOX
  const lightbox = $('#lightbox');
  const lbImg = $('.lb-image', lightbox);
  const lbCaption = $('.lb-caption', lightbox);
  let currentIndex = -1;
  const gallery = $$('#gallery .grid-item');

  function openLightbox(index){
    const item = gallery[index];
    if(!item) return;
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbCaption.textContent = item.querySelector('figcaption')?.textContent || '';
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
    currentIndex = index;
    // pequeña animación
    lbImg.style.transform = 'scale(.96)';
    setTimeout(()=> lbImg.style.transform = 'scale(1)', 30);
  }
  function closeLightbox(){
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  function nextLightbox(){ openLightbox((currentIndex+1) % gallery.length); }
  function prevLightbox(){ openLightbox((currentIndex-1 + gallery.length) % gallery.length); }

  gallery.forEach((fig, i) => {
    fig.addEventListener('click', () => openLightbox(i));
  });

  $('.lb-close', lightbox).addEventListener('click', closeLightbox);
  $('.lb-next', lightbox).addEventListener('click', nextLightbox);
  $('.lb-prev', lightbox).addEventListener('click', prevLightbox);

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
  });

  // click fuera de la imagen cierra
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // FORM: validación simple
  const form = $('#contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    if (!name || !email || !message) {
      alert('Por favor completa todos los campos.');
      return;
    }
    // Aquí podrías hacer fetch a tu backend; por ahora mostramos confirmación
    form.reset();
    alert('Gracias — tu mensaje fue enviado (simulado).');
  });

  // MENU mobile simple
  const menuToggle = $('.menu-toggle');
  menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav');
    const shown = getComputedStyle(nav).display !== 'none';
    nav.style.display = shown ? 'none' : 'flex';
  });

  // Pequeña interacción hero: al hacer scroll, escala imagen para dar efecto parallax sutil
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    const diff = Math.min(0.08, sc / 2000);
    $('.hero-bg').style.transform = `scale(${1.05 + diff})`;
    lastScroll = sc;
  }, { passive: true });

});
