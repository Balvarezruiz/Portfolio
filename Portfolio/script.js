document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('main#content');

  // Navegación SPA
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      const page = link.dataset.page;
      loadContent(page);
      history.pushState({ page }, null, `#${page}`);
      toggleSlideMenu(true);
    }
  });

  const initialPage = window.location.hash.substring(1) || 'home';
  loadContent(initialPage);

  window.addEventListener('popstate', (e) => {
    const page = e.state?.page || 'home';
    loadContent(page);
  });

  function loadContent(page) {
    fetch(`components/${page}.html`)
      .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar la página');
        return response.text();
      })
      .then(html => {
        content.innerHTML = html;

        // Eliminar botones si ya existen
        const existente = document.querySelector('.nav-buttons');
        if (existente) existente.remove();

        const footer = document.querySelector('footer');
        if (!footer || !footer.parentNode) return;

        // Lógica de botones por página
        if (page === 'home') {
       const conocemeBtn = document.createElement('div');
      conocemeBtn.className = 'nav-buttons btn-conoceme-wrapper';
      conocemeBtn.innerHTML = `<button class="btn-conoceme">¡Conoceme!</button>`;
      footer.parentNode.insertBefore(conocemeBtn, footer);

       document.querySelector('.btn-conoceme').onclick = () => {
        loadContent('about');
      history.pushState({ page: 'about' }, null, '#about');
  };

        } else if (['about', 'projects', 'contact'].includes(page)) {
          const navButtons = document.createElement('div');
          navButtons.className = 'nav-buttons';
          navButtons.innerHTML = `
            <button id="btn-prev">Página Anterior</button>
            <button id="btn-next">Página Siguiente</button>
          `;
          footer.parentNode.insertBefore(navButtons, footer);
          updateNavButtons(page);
        }

        // Activar funciones por página
        if (page === 'galeria') initGaleria();
        if (page === 'projects') setupProjectClicks();
        if (page === 'proyecto2') initTareas();
        if (page === 'proyecto3') initCalculadora();
        if (page === 'sobre') initToggleInfoBoxes();
        if (page === 'contact') initFormularioContacto();
      })
      .catch(err => {
        content.innerHTML = '<p>Error al cargar la página.</p>';
        console.error(err);
      });
  }

  function updateNavButtons(currentPage) {
    const paginasNavegables = ['home', 'about', 'projects', 'contact'];
    const currentIndex = paginasNavegables.indexOf(currentPage);
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + paginasNavegables.length) % paginasNavegables.length;
    const nextIndex = (currentIndex + 1) % paginasNavegables.length;

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnPrev) {
      btnPrev.onclick = () => {
        const page = paginasNavegables[prevIndex];
        loadContent(page);
        history.pushState({ page }, null, `#${page}`);
      };
    }

    if (btnNext) {
      btnNext.onclick = () => {
        const page = paginasNavegables[nextIndex];
        loadContent(page);
        history.pushState({ page }, null, `#${page}`);
      };
    }
  }
});

  // formulario contacto
function initFormularioContacto() {
  console.log("Formulario cargado");

  const form = document.getElementById("contact-form");
  if (!form) {
    console.warn("No se encontró el formulario");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Submit interceptado");

    emailjs.sendForm('service_rqowm55', 'template_t4nflac', form)
      .then(() => {
        alert("¡Gracias por contactarte! Te responderé pronto.");
        form.reset();
      })
      .catch(error => {
        alert("Error al enviar el mensaje: " + error.text);
        console.error(error);
      });
  });
}

  // Menú lateral 
  window.toggleSlideMenu = function (forceClose = false) {
    const menu = document.getElementById("menu");
    const layout = document.getElementById("layout");
    const icon = document.getElementById("menuIcon");

    const open = menu.style.width === "250px";
    if (open || forceClose) {
      menu.style.width = "0px";
      layout.style.marginLeft = "0px";
      icon.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
      menu.style.width = "250px";
      layout.style.marginLeft = "250px";
      icon.innerHTML = '<i class="fas fa-times"></i>';
    }
  };

  // Lightbox para galería
  function initGaleria() {
    const totalImagenes = 8;
    const galeria = document.querySelector('.galeria');
    let currentIndex = 0;

    for (let i = 1; i <= totalImagenes; i++) {
      const div = document.createElement('div');
      const img = document.createElement('img');
      img.src = `./assets/img${i}.jpg`;
      img.alt = `Imagen ${i}`;
      div.appendChild(img);
      galeria.appendChild(div);
    }

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const prevBtn = document.querySelector('.lightbox-btn.prev');
    const nextBtn = document.querySelector('.lightbox-btn.next');

    const cargarImagenes = () => Array.from(document.querySelectorAll('.galeria img'));
    let imagenes = cargarImagenes();

    function mostrarImagen(idx) {
      imagenes = cargarImagenes();
      currentIndex = (idx + imagenes.length) % imagenes.length;
      lightboxImg.src = imagenes[currentIndex].src;
    }

    galeria.addEventListener('click', function (e) {
      if (e.target.tagName === 'IMG') {
        imagenes = cargarImagenes();
        currentIndex = imagenes.indexOf(e.target);
        mostrarImagen(currentIndex);
        lightbox.classList.add('active');
      }
    });

    lightbox.addEventListener('click', function () {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
    });

    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      mostrarImagen(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      mostrarImagen(currentIndex + 1);
    });
  }

  // Proyectos//
  function setupProjectClicks() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      if (card.hasAttribute('data-project') && !card.hasAttribute('data-page')) {
        card.addEventListener('click', () => {
          const id = card.dataset.project;
          loadContent(`project-${id}`);
        });
      }
    });
  }

  //  Lista de Tareas
  function initTareas() {
    const inputTarea = document.getElementById('nuevaTarea');
    const btnAgregar = document.getElementById('agregar');
    const listaTareas = document.getElementById('listaTareas');

    let db;
    const DB_NAME = 'TareasDB';
    const STORE_NAME = 'tareas';
    const DB_VERSION = 1;

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = function (event) {
      console.error("Error al abrir la base de datos", event.target.error);
      listaTareas.innerHTML = '<li class="error">Error al cargar las tareas. Recarga la página.</li>';
    };

    request.onsuccess = function (event) {
      db = event.target.result;
      cargarTareas();
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true
      });
      objectStore.createIndex('texto', 'texto', { unique: false });
      objectStore.createIndex('completada', 'completada', { unique: false });
    };

    btnAgregar.addEventListener('click', agregarTarea);
    inputTarea.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') agregarTarea();
    });

    function agregarTarea() {
      const texto = inputTarea.value.trim();
      if (texto === '') return;

      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const tarea = {
        texto: texto,
        completada: false,
        fecha: new Date()
      };

      const request = store.add(tarea);

      request.onsuccess = function () {
        inputTarea.value = '';
        inputTarea.focus();
        cargarTareas();
      };
    }

    function cargarTareas() {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = function (event) {
        const tareas = event.target.result;
        renderizarTareas(tareas);
      };
    }

    function renderizarTareas(tareas) {
      if (tareas.length === 0) {
        listaTareas.innerHTML = '<li class="vacío">No hay tareas. ¡Añade alguna!</li>';
        return;
      }

      listaTareas.innerHTML = '';
      tareas.sort((a, b) => b.fecha - a.fecha);

      tareas.forEach(tarea => {
        const li = document.createElement('li');
        li.className = `tarea ${tarea.completada ? 'completada' : ''}`;
        li.dataset.id = tarea.id;

        const span = document.createElement('span');
        span.textContent = tarea.texto;

        const divAcciones = document.createElement('div');
        divAcciones.className = 'acciones';

        const btnCompletar = document.createElement('button');
        btnCompletar.textContent = tarea.completada ? '❌' : '✓';
        btnCompletar.onclick = () => toggleCompletada(tarea);

        const btnEditar = document.createElement('button');
        btnEditar.textContent = '✏️';
        btnEditar.className = 'editar';
        btnEditar.onclick = () => editarTarea(tarea);

        const btnGuardar = document.createElement('button');
        btnGuardar.textContent = '💾';
        btnGuardar.className = 'guardar';
        btnGuardar.onclick = () => guardarEdicion(tarea.id);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '🗑️';
        btnEliminar.className = 'eliminar';
        btnEliminar.onclick = () => eliminarTarea(tarea.id);

        divAcciones.appendChild(btnCompletar);
        divAcciones.appendChild(btnEditar);
        divAcciones.appendChild(btnGuardar);
        divAcciones.appendChild(btnEliminar);

        li.appendChild(span);
        li.appendChild(divAcciones);
        listaTareas.appendChild(li);
      });
    }

    function toggleCompletada(tarea) {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      tarea.completada = !tarea.completada;
      store.put(tarea).onsuccess = cargarTareas;
    }

    function editarTarea(tarea) {
      const li = document.querySelector(`li[data-id="${tarea.id}"]`);
      const span = li.querySelector('span');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = tarea.texto;
      input.className = 'edit-input';
      li.replaceChild(input, span);
      input.focus();
      li.querySelector('.editar').style.display = 'none';
      li.querySelector('.guardar').style.display = 'inline-block';

      input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') guardarEdicion(tarea.id);
      });
    }

    function guardarEdicion(id) {
      const li = document.querySelector(`li[data-id="${id}"]`);
      const input = li.querySelector('.edit-input');
      const nuevoTexto = input.value.trim();
      if (nuevoTexto === '') return eliminarTarea(id);

      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = function (event) {
        const tarea = event.target.result;
        if (tarea) {
          tarea.texto = nuevoTexto;
          tarea.fecha = new Date();
          store.put(tarea).onsuccess = cargarTareas;
        }
      };
    }

    function eliminarTarea(id) {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(id).onsuccess = cargarTareas;
    }
  }

  // Calculadora
  function initCalculadora() {
    function suma(a, b) { return a + b; }
    function resta(a, b) { return a - b; }
    function multiplicacion(a, b) { return a * b; }
    function division(a, b) { return a / b; }
    function porcentaje(a) { return a / 100; }
    function raiz(a) { return Math.sqrt(a); }

    const botones = document.querySelectorAll('.calculadora button');
    const inputSpan = document.querySelector('.calculadora .input');
    const resultado = document.querySelector('.calculadora .resultado');

    let inputActual = '';
    let operador = null;
    let a = null;
    let b = null;

    botones.forEach(boton => {
      boton.addEventListener('click', () => {
        const valor = boton.textContent;

        if (!isNaN(valor)) {
          inputActual += valor;
          inputSpan.textContent = inputActual;
        } else if (valor === '.') {
          if (!inputActual.includes('.')) {
            inputActual = inputActual === '' ? '0.' : inputActual + '.';
            inputSpan.textContent = inputActual;
          }
        } else if (valor === 'AC') {
          inputActual = '';
          operador = null;
          a = null;
          b = null;
          inputSpan.textContent = '';
          resultado.textContent = '';
        } else if (valor === 'CE') {
          inputActual = '';
          inputSpan.textContent = '';
        } else if (valor === '=') {
          if (operador && a !== null && inputActual !== '') {
            b = parseFloat(inputActual);
            let res;
            switch (operador) {
              case '+': res = suma(a, b); break;
              case '-': res = resta(a, b); break;
              case '*': res = multiplicacion(a, b); break;
              case '/': res = division(a, b); break;
              default: res = '';
            }
            resultado.textContent = res;
            inputSpan.textContent = '';
            inputActual = res.toString();
            operador = null;
            a = null;
            b = null;
          }
        } else if (valor === '%') {
          if (inputActual !== '') {
            a = parseFloat(inputActual);
            let res = porcentaje(a);
            resultado.textContent = res;
            inputActual = res.toString();
            inputSpan.textContent = '';
          }
        } else if (valor === '√') {
          if (inputActual !== '') {
            a = parseFloat(inputActual);
            let res = raiz(a);
            resultado.textContent = res;
            inputActual = res.toString();
            inputSpan.textContent = '';
          }
        } else {
          if (inputActual !== '') {
            a = parseFloat(inputActual);
            operador = valor;
            inputActual = '';
            inputSpan.textContent = operador + ' ';
          } else if (resultado.textContent !== '') {
            a = parseFloat(resultado.textContent);
            operador = valor;
            inputActual = '';
            resultado.textContent = '';
            inputSpan.textContent = a + ' ' + operador + ' ';
          }
        }
      });
    });
  }

