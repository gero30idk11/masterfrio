/* ============================================================
   MASTER FRÍO — script.js
   Funcionalidades:
   1. Header con fondo al hacer scroll
   2. Menú móvil
   3. Reveal de secciones al hacer scroll (IntersectionObserver)
   4. Contadores animados en el Hero
   5. Escarcha ambiental generada dinámicamente
   6. Año automático en el footer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. HEADER AL HACER SCROLL ---------- */
  const encabezado = document.getElementById('encabezado');
  const alHacerScroll = () => {
    if (window.scrollY > 40) {
      encabezado.classList.add('encabezado--activo');
    } else {
      encabezado.classList.remove('encabezado--activo');
    }
  };
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

  /* ---------- 2. MENÚ MÓVIL ---------- */
  const botonMenu = document.getElementById('botonMenu');
  const navPrincipal = document.getElementById('navPrincipal');

  botonMenu.addEventListener('click', () => {
    const abierto = navPrincipal.classList.toggle('activo');
    botonMenu.classList.toggle('activo', abierto);
    botonMenu.setAttribute('aria-expanded', abierto);
  });

  // Cierra el menú móvil al elegir una opción
  navPrincipal.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      navPrincipal.classList.remove('activo');
      botonMenu.classList.remove('activo');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. REVEAL AL HACER SCROLL ---------- */
  const elementosRevelar = document.querySelectorAll('.revelar');

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementosRevelar.forEach((el) => observador.observe(el));
  } else {
    // Fallback: si el navegador no soporta IntersectionObserver, mostrar todo
    elementosRevelar.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 4. CONTADORES ANIMADOS DEL HERO ---------- */
  const contadores = document.querySelectorAll('[data-contador]');

  const animarContador = (elemento) => {
    const meta = parseInt(elemento.dataset.contador, 10);
    const duracion = 1600;
    const inicio = performance.now();

    const paso = (ahora) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const facilitado = 1 - Math.pow(1 - progreso, 3); // ease-out cubic
      elemento.textContent = Math.round(meta * facilitado);
      if (progreso < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  if ('IntersectionObserver' in window && contadores.length) {
    const observadorContadores = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          animarContador(entrada.target);
          observadorContadores.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.6 });
    contadores.forEach((c) => observadorContadores.observe(c));
  }

  /* ---------- 5. ESCARCHA AMBIENTAL (fondo del hero) ---------- */
  const contenedorEscarcha = document.querySelector('.hero__escarcha');
  if (contenedorEscarcha) {
    const totalParticulas = 18;
    for (let i = 0; i < totalParticulas; i++) {
      const particula = document.createElement('span');
      const tamano = Math.random() * 90 + 30; // 30px a 120px
      particula.style.width = `${tamano}px`;
      particula.style.height = `${tamano}px`;
      particula.style.left = `${Math.random() * 100}%`;
      particula.style.top = `${Math.random() * 100}%`;
      particula.style.animationDelay = `${Math.random() * 10}s`;
      particula.style.animationDuration = `${10 + Math.random() * 10}s`;
      contenedorEscarcha.appendChild(particula);
    }
  }

  /* ---------- 6. AÑO AUTOMÁTICO EN EL FOOTER ---------- */
  const anioActual = document.getElementById('anioActual');
  if (anioActual) anioActual.textContent = new Date().getFullYear();

  /* ---------- 7. CARRUSEL DE FONDO DEL HERO ---------- */
  const carrusel = document.getElementById('heroCarrusel');
  const pistaCarrusel = document.getElementById('heroCarruselPista');
  const contenedorPuntos = document.getElementById('heroCarruselPuntos');

  if (carrusel && pistaCarrusel && contenedorPuntos) {
    const diapositivas = Array.from(pistaCarrusel.children);
    let indiceActual = 0;
    const duracionAuto = 5000;

    // Genera los puntos de navegación dinámicamente
    diapositivas.forEach((_, indice) => {
      const punto = document.createElement('button');
      punto.type = 'button';
      punto.classList.add('hero-carrusel__punto');
      punto.setAttribute('aria-label', `Ir a la imagen ${indice + 1}`);
      if (indice === 0) punto.classList.add('activo');
      punto.addEventListener('click', () => irADiapositiva(indice));
      contenedorPuntos.appendChild(punto);
    });

    const puntos = Array.from(contenedorPuntos.children);

    const actualizarCarrusel = () => {
      pistaCarrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
      puntos.forEach((punto, indice) => {
        punto.classList.toggle('activo', indice === indiceActual);
      });
    };

    const irADiapositiva = (indice) => {
      indiceActual = (indice + diapositivas.length) % diapositivas.length;
      actualizarCarrusel();
    };

    const irASiguiente = () => irADiapositiva(indiceActual + 1);

    actualizarCarrusel();
    setInterval(irASiguiente, duracionAuto);
  }

});
