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
const seccionesVisibles = new Set();

const activarEnlace = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      seccionesVisibles.add(entrada.target);
    } else {
      seccionesVisibles.delete(entrada.target);
    }
  });

  const seccionActual = Array.from(seccionesVisibles).sort(
    (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
  )[0];

  enlacesNavegacion.forEach((enlace) => {
    enlace.classList.toggle(
      "activo",
      Boolean(seccionActual) &&
        enlace.getAttribute("href") === `#${seccionActual.id}`
    );
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

const carrusel = document.querySelector(".carrusel-trabajos");
const listaTrabajos = carrusel.querySelector(".carrusel-lista");
const trabajos = listaTrabajos.querySelectorAll(".trabajo");
const contenedorPuntos = carrusel.querySelector(".carrusel-puntos");
const ventanaCarrusel = carrusel.querySelector(".carrusel-ventana");
const botonAnterior = carrusel.querySelector(".carrusel-anterior");
const botonSiguiente = carrusel.querySelector(".carrusel-siguiente");

let indiceActual = 0;
let intervaloCarrusel;
let mouseSobreCarrusel = false;
let inicioX = null;
let seDeslizo = false;

function mostrarTrabajo(indice) {
  indiceActual = (indice + trabajos.length) % trabajos.length;
  listaTrabajos.style.transform = `translateX(-${indiceActual * 100}%)`;

  contenedorPuntos.querySelectorAll(".punto-carrusel").forEach((punto, posicion) => {
    const estaActivo = posicion === indiceActual;
    punto.classList.toggle("activo", estaActivo);
    punto.setAttribute("aria-pressed", String(estaActivo));
  });
}

trabajos.forEach((_, indice) => {
  const punto = document.createElement("button");
  punto.type = "button";
  punto.className = "punto-carrusel";
  punto.setAttribute("aria-label", `Mostrar trabajo ${indice + 1}`);
  punto.addEventListener("click", () => {
    mostrarTrabajo(indice);
    iniciarAutoavance();
  });
  contenedorPuntos.appendChild(punto);
});

function iniciarAutoavance() {
  clearInterval(intervaloCarrusel);
  if (mouseSobreCarrusel) return;

  intervaloCarrusel = setInterval(() => {
    mostrarTrabajo(indiceActual + 1);
  }, 3500);
}

botonAnterior.addEventListener("click", () => {
  mostrarTrabajo(indiceActual - 1);
  iniciarAutoavance();
});

botonSiguiente.addEventListener("click", () => {
  mostrarTrabajo(indiceActual + 1);
  iniciarAutoavance();
});

carrusel.addEventListener("pointerenter", (evento) => {
  if (evento.pointerType !== "mouse") return;

  mouseSobreCarrusel = true;
  clearInterval(intervaloCarrusel);
});

carrusel.addEventListener("pointerleave", (evento) => {
  if (evento.pointerType !== "mouse") return;

  mouseSobreCarrusel = false;
  iniciarAutoavance();
});

ventanaCarrusel.addEventListener("pointerdown", (evento) => {
  inicioX = evento.clientX;
  seDeslizo = false;
});

ventanaCarrusel.addEventListener("pointerup", (evento) => {
  if (inicioX === null) return;

  const distancia = evento.clientX - inicioX;
  inicioX = null;

  if (Math.abs(distancia) < 50) return;

  seDeslizo = true;
  mostrarTrabajo(indiceActual + (distancia < 0 ? 1 : -1));
  iniciarAutoavance();
  setTimeout(() => {
    seDeslizo = false;
  }, 0);
});

ventanaCarrusel.addEventListener("pointercancel", () => {
  inicioX = null;
});

ventanaCarrusel.addEventListener("click", (evento) => {
  if (!seDeslizo) return;

  evento.preventDefault();
  evento.stopPropagation();
  seDeslizo = false;
}, true);

mostrarTrabajo(0);
iniciarAutoavance();

const visor = document.querySelector(".visor-imagen");
const imagenGrande = document.querySelector(".visor-imagen-grande");
const botonCerrar = document.querySelector(".visor-cerrar");

function abrirImagen(imagen) {
  imagenGrande.classList.remove("ampliada");
  imagenGrande.src = imagen.src;
  imagenGrande.alt = imagen.alt;
  visor.showModal();
}

imagenGrande.addEventListener("click", () => {
  imagenGrande.classList.toggle("ampliada");
});

document.querySelectorAll(".carrusel-lista .trabajo img").forEach((imagen) => {
  imagen.tabIndex = 0;
  imagen.setAttribute("role", "button");
  imagen.setAttribute("aria-label", `Ampliar: ${imagen.alt}`);

  imagen.addEventListener("click", () => {
    if (seDeslizo) return;
    abrirImagen(imagen);
  });

  imagen.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      abrirImagen(imagen);
    }
  });
});

botonCerrar.addEventListener("click", () => visor.close());

visor.addEventListener("click", (evento) => {
  if (evento.target === visor) visor.close();
});