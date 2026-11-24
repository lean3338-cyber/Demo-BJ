const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const estaAbierto = menu.classList.toggle("abierto");
    menuToggle.classList.toggle("activo", estaAbierto);
    menuToggle.setAttribute("aria-expanded", String(estaAbierto));
    menuToggle.setAttribute("aria-label", estaAbierto ? "Cerrar menú" : "Abrir menú");
  });

  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      menu.classList.remove("abierto");
      menuToggle.classList.remove("activo");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    });
  });
}

document.querySelectorAll(".seccion, .hero").forEach((elemento) => {
  elemento.classList.add("reveal");
});

const revelar = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
      revelar.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((elemento) => revelar.observe(elemento));

const seccionesNavegacion = document.querySelectorAll("main section[id]");
const enlacesNavegacion = document.querySelectorAll(".banner nav a");

const activarEnlace = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;

    enlacesNavegacion.forEach((enlace) => {
      enlace.classList.toggle(
        "activo",
        enlace.getAttribute("href") === `#${entrada.target.id}`
      );
    });
  });
}, { rootMargin: "-35% 0px -55%" });

seccionesNavegacion.forEach((seccion) => activarEnlace.observe(seccion));

document.querySelectorAll(".carousel-controles").forEach((controles) => {
  const carrusel = controles.previousElementSibling;
  const anterior = controles.querySelector(".carousel-anterior");
  const siguiente = controles.querySelector(".carousel-siguiente");

  const mover = (direccion) => {
    const tarjetas = carrusel.querySelectorAll(".card");
    const tarjetaActual = Array.from(tarjetas).find((tarjeta) => {
      const rectangulo = tarjeta.getBoundingClientRect();
      return rectangulo.left >= carrusel.getBoundingClientRect().left - 10;
    });
    let indice = tarjetaActual ? tarjetas.indexOf(tarjetaActual) : 0;
    indice = Math.min(tarjetas.length - 1, Math.max(0, indice + direccion));
    tarjetas[indice].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  };

  anterior.addEventListener("click", () => mover(-1));
  siguiente.addEventListener("click", () => mover(1));
});
