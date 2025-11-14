// Variables globales
let edadUsuario = null;
let audioActivado = true;
let puntuacion = 0;
let nivelActual = 1;

// Datos de animales poco comunes
const animalesPocosConocidos = [
    { emoji: '🦦', nombre: 'Nutria Marina', sonidos: '¡Hola! Soy Nutria Marina 🦦' },
    { emoji: '🦔', nombre: 'Erizo', sonidos: '¡Hola! Soy Erizo 🦔' },
    { emoji: '🦜', nombre: 'Loro Gris', sonidos: '¡Hola! Soy Loro Gris 🦜' },
    { emoji: '🦭', nombre: 'Foca', sonidos: '¡Hola! Soy Foca 🦭' },
    { emoji: '🦘', nombre: 'Canguro', sonidos: '¡Hola! Soy Canguro 🦘' },
    { emoji: '🦒', nombre: 'Jirafa', sonidos: '¡Hola! Soy Jirafa 🦒' },
    { emoji: '🦜', nombre: 'Papagayo', sonidos: '¡Hola! Soy Papagayo 🦜' },
    { emoji: '🦧', nombre: 'Orangután', sonidos: '¡Hola! Soy Orangután 🦧' }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarCursor();
    cambiarCursor('bienvenida');
    hablar('¡Bienvenido al Mundo Curioso! Selecciona tu edad para comenzar.');
});

// Cursor personalizado
function inicializarCursor() {
    const cursor = document.getElementById('cursorPersonalizado');
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 24 + 'px';
        cursor.style.top = e.clientY - 24 + 'px';
    });
    
    document.addEventListener('click', function() {
        cursor.classList.add('cursor-click');
        setTimeout(() => cursor.classList.remove('cursor-click'), 200);
    });
}

// Sistema de audio
let cursorActual = '🦋'; // Estado inicial del cursor

function cambiarCursor(tema) {
    const cursor = document.getElementById('cursorPersonalizado');
    
    const temas = {
        'jardin': { emoji: '🦋', color: 'var(--aventura1-violeta)' },
        'burbujas': { emoji: '💎', color: 'var(--burbujas-azul-prim)' },
        'clasificacion': { emoji: '🎨', color: 'var(--clasif-rojo)' },
        'melodia': { emoji: '🎵', color: 'var(--melodia-dorado)' },
        'bienvenida': { emoji: '🌈', color: 'var(--aventura1-turquesa)' }
    };
    
    const nuevoTema = temas[tema] || temas['bienvenida'];
    cursor.textContent = nuevoTema.emoji;
    cursor.style.backgroundColor = nuevoTema.color;
    cursorActual = nuevoTema.emoji;
}

function hablar(texto) {
    if (!audioActivado) return;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        utterance.rate = edadUsuario ? (edadUsuario <= 4 ? 0.7 : 0.9) : 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

function toggleAudio() {
    audioActivado = !audioActivado;
    const btn = document.getElementById('btnAudio');
    btn.textContent = audioActivado ? '🔊' : '🔇';
    
    if (audioActivado) {
        hablar('Audio activado - Mundo Curioso');
    }
}

function reproducirSonido(frecuencia, duracion = 500) {
    if (!audioActivado) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frecuencia, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duracion / 1000);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duracion / 1000);
    } catch (error) {
        console.log('Audio no disponible');
    }
}

// Navegación
function mostrarPantalla(pantallaId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    
    // Mostrar la pantalla seleccionada
    document.getElementById(pantallaId).classList.add('activa');
    
    // Cambiar cursor según la pantalla
    const temaPantalla = {
        'bienvenida': 'bienvenida',
        'juegos': 'bienvenida',
        'jardin': 'jardin',
        'burbujas': 'burbujas',
        'clasificacion': 'clasificacion',
        'melodia': 'melodia'
    };
    cambiarCursor(temaPantalla[pantallaId]);
    
    // Feedback especial según la pantalla
    if (pantallaId === 'bienvenida') {
        // Sonido especial mágico cuando se usa el botón estrella
        reproducirSonido(523); // Do
        setTimeout(() => reproducirSonido(659), 150); // Mi
        setTimeout(() => reproducirSonido(784), 300); // Sol
        setTimeout(() => hablar('¡Volviendo al inicio! ¿Nueva aventura?'), 450);
    } else {
        // Sonido normal para otras navegaciones
        reproducirSonido(800);
    }
}

function seleccionarEdad(edad) {
    edadUsuario = edad;
    
    // Quitar selección de todas las tarjetas
    document.querySelectorAll('.tarjeta-seleccion').forEach(t => t.classList.remove('seleccionada'));
    
    // Seleccionar la tarjeta correspondiente
    const tarjetas = document.querySelectorAll('.tarjeta-seleccion');
    tarjetas[edad - 3].classList.add('seleccionada');
    
    // Mensaje personalizado por edad
    const mensajes = {
        3: '¡Perfecto! Estás en modo principiante. Todo será muy sencillo.',
        5: '¡Excelente! Estás en modo explorador. Aprenderás cosas nuevas.',
        7: '¡Genial! Estás en modo aventurero. Será un gran desafío.',
        9: '¡Increíble! Estás en modo experto. ¡Demuestra tu habilidad!'
    };
    
    hablar(mensajes[edad]);
    
    // Después de 2 segundos, ir a selección de juegos
    setTimeout(() => {
        mostrarPantalla('juegos');
        hablar('Ahora elige tu aventura favorita. ¡Diviértete!');
    }, 2000);
}

// Juego del Jardín Mágico
function iniciarJardin() {
    mostrarPantalla('jardin');
    const animalesContainer = document.getElementById('animalesJardin');
    animalesContainer.innerHTML = '';
    
    // Mostrar animales aleatorios
    const animalesMezclados = [...animalesPocosConocidos].sort(() => 0.5 - Math.random());
    const cantidadAnimales = edadUsuario <= 4 ? 3 : edadUsuario <= 6 ? 4 : 6;
    
    for (let i = 0; i < cantidadAnimales; i++) {
        const animal = animalesMezclados[i];
        const animalDiv = document.createElement('div');
        animalDiv.className = 'animal';
        animalDiv.textContent = animal.emoji;
        animalDiv.onclick = () => alimentarAnimal(animal);
        animalesContainer.appendChild(animalDiv);
    }
    
    hablar('¡Bienvenido al mundo de Animales Extravagantes! Toca cada animal para alimentarlo y cuidarlo.');
}

function alimentarAnimal(animal) {
    puntuacion += 10;
    actualizarProgreso('progresoJardin', puntuacion / 20);
    
    // Efecto visual
    mostrarCelebracion('⭐');
    hablar(`¡Excelente! Has alimentado al ${animal.nombre}. ${animal.sonidos}`);
    
    // Remover el animal después de alimentar
    event.target.style.opacity = '0';
    event.target.style.transform = 'scale(0)';
    
    // Completar cuando todos estén alimentados
    if (puntuacion >= 20) {
        setTimeout(() => {
            mostrarNotificacion('¡Felicitaciones! Has cuidado todos los animales 🌺');
            hablar('¡Felicitaciones! Has cuidado a todos los animales. ¡Eres increíble!');
            setTimeout(() => {
                mostrarPantalla('juegos');
                puntuacion = 0;
            }, 3000);
        }, 500);
    }
}

// Juego de Burbujas
function iniciarBurbujas() {
    mostrarPantalla('burbujas');
    puntuacion = 0;
    
    const coloresBurbujas = [
        '#60A5FA', '#F472B6', '#FB923C', '#3B82F6',
        '#10B981', '#FACC15', '#EF4444', '#8B5CF6'
    ];
    
    const area = document.getElementById('areaBurbujas');
    area.innerHTML = '';
    
    // Crear burbujas
    for (let i = 0; i < 8; i++) {
        const burbuja = document.createElement('div');
        burbuja.className = 'burbuja';
        burbuja.style.backgroundColor = coloresBurbujas[i % coloresBurbujas.length];
        burbuja.style.position = 'absolute';
        burbuja.style.left = (Math.random() * 320) + 'px';
        burbuja.style.top = (Math.random() * 220) + 'px';
        burbuja.onclick = () => pincharBurbuja(burbuja);
        area.appendChild(burbuja);
    }
    
    hablar('¡Pincha las burbujas que aparecen! ¡Cada burbuja te dará puntos!');
}

function pincharBurbuja(burbuja) {
    puntuacion += 5;
    actualizarProgreso('progresoBurbujas', puntuacion / 40);
    
    // Efecto de explosión
    burbuja.style.transform = 'scale(1.5)';
    burbuja.style.opacity = '0';
    burbuja.style.transition = 'all 300ms ease';
    
    mostrarCelebracion('💥');
    reproducirSonido(1000);
    hablar('¡Excelente! Has pinchado una burbuja.');
    
    // Remover después de la animación
    setTimeout(() => {
        burbuja.remove();
    }, 300);
    
    if (puntuacion >= 40) {
        setTimeout(() => {
            mostrarNotificacion('¡Perfecto! Has pinchado todas las burbujas 💎');
            hablar('¡Increíble! Has pinchado todas las burbujas. ¡Eres un experto!');
            setTimeout(() => {
                mostrarPantalla('juegos');
                puntuacion = 0;
            }, 3000);
        }, 500);
    }
}

// Juego de Clasificación
function iniciarClasificacion() {
    mostrarPantalla('clasificacion');
    puntuacion = 0;
    
    const colores = ['🔴', '🟡', '🔵', '🟢'];
    const nombresColores = ['Rojo', 'Amarillo', 'Azul', 'Verde'];
    const coloresHex = ['#EF4444', '#FACC15', '#2563EB', '#10B981'];
    
    // Crear zonas de clasificación
    const area = document.getElementById('areaClasificacion');
    area.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const zona = document.createElement('div');
        zona.className = 'elemento-clasif';
        zona.style.backgroundColor = coloresHex[i];
        zona.style.opacity = '0.3';
        zona.style.borderStyle = 'solid';
        zona.textContent = colores[i];
        zona.ondragover = (e) => e.preventDefault();
        zona.ondrop = (e) => {
            const elementoId = e.dataTransfer.getData('text');
            clasificarElemento(elementoId, i);
        };
        area.appendChild(zona);
    }
    
    // Crear elementos a clasificar
    const elementos = document.getElementById('elementosClasificar');
    elementos.innerHTML = '';
    
    const cantidadElementos = edadUsuario <= 4 ? 4 : edadUsuario <= 6 ? 6 : 8;
    
    for (let i = 0; i < cantidadElementos; i++) {
        const colorCorrecto = Math.floor(Math.random() * 4);
        const elemento = document.createElement('div');
        elemento.className = 'elemento-clasif';
        elemento.draggable = true;
        elemento.textContent = colores[colorCorrecto];
        elemento.style.backgroundColor = coloresHex[colorCorrecto];
        elemento.id = `elemento-${i}`;
        elemento.ondragstart = (e) => {
            e.dataTransfer.setData('text', elemento.id);
            e.dataTransfer.setData('color', colorCorrecto);
        };
        elementos.appendChild(elemento);
    }
    
    hablar('Arrastra cada elemento a su color correspondiente. ¡Sé cuidadoso!');
}

function clasificarElemento(elementoId, zonaColor) {
    const elemento = document.getElementById(elementoId);
    const colorCorrecto = parseInt(event.dataTransfer.getData('color'));
    
    if (colorCorrecto === zonaColor) {
        puntuacion += 5;
        actualizarProgreso('progresoClasificacion', puntuacion / 25);
        
        // Elemento correcto
        elemento.style.opacity = '0.5';
        elemento.style.pointerEvents = 'none';
        mostrarCelebracion('✅');
        hablar('¡Correcto! Has clasificado bien el elemento.');
        
        if (puntuacion >= 25) {
            setTimeout(() => {
                mostrarNotificacion('¡Excelente! Has clasificado todos los elementos 🎨');
                hablar('¡Fantástico! Has clasificado todos los elementos correctamente.');
                setTimeout(() => {
                    mostrarPantalla('juegos');
                    puntuacion = 0;
                }, 3000);
            }, 500);
        }
    } else {
        // Elemento incorrecto
        elemento.style.borderColor = '#EF4444';
        elemento.style.animation = 'shake 300ms ease-in-out';
        hablar('¡Ups! Intenta de nuevo. Recuerda el color correcto.');
    }
}

// Juego de Melodía
function iniciarMelodia() {
    mostrarPantalla('melodia');
    puntuacion = 0;
    
    const notas = [
        { emoji: '🎵', freq: 523, color: '#F59E0B' },
        { emoji: '🎶', freq: 659, color: '#FB7185' },
        { emoji: '🎼', freq: 784, color: '#D97706' },
        { emoji: '🎤', freq: 988, color: '#F9A8D4' }
    ];
    
    // Crear botones de notas
    const container = document.getElementById('notasMusicales');
    container.innerHTML = '';
    
    notas.forEach((nota, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-principal';
        btn.style.backgroundColor = nota.color;
        btn.innerHTML = `${nota.emoji} <span>Nota ${index + 1}</span>`;
        btn.onclick = () => tocarNota(nota.freq, index);
        container.appendChild(btn);
    });
    
    // Generar secuencia
    const secuencia = generarSecuencia();
    setTimeout(() => reproducirSecuencia(secuencia, notas), 1000);
    
    hablar('Escucha la secuencia de notas y luego repítela tocando los botones.');
}

function generarSecuencia() {
    const longitud = edadUsuario <= 4 ? 3 : edadUsuario <= 6 ? 4 : 5;
    const secuencia = [];
    
    for (let i = 0; i < longitud; i++) {
        secuencia.push(Math.floor(Math.random() * 4));
    }
    
    return secuencia;
}

function reproducirSecuencia(secuencia, notas) {
    secuencia.forEach((nota, index) => {
        setTimeout(() => {
            reproducirSonido(notas[nota].freq);
            // Efecto visual en el botón
            const botones = document.querySelectorAll('#notasMusicas .btn-principal');
            botones[nota].style.transform = 'scale(0.9)';
            setTimeout(() => {
                botones[nota].style.transform = 'scale(1)';
            }, 300);
        }, index * 1000);
    });
}

function tocarNota(frecuencia, indice) {
    reproducirSonido(frecuencia);
    // Aquí iría la lógica de comparar con la secuencia
    puntuacion += 5;
    actualizarProgreso('progresoMelodia', puntuacion / 25);
    
    if (puntuacion >= 25) {
        mostrarNotificacion('¡Perfecto! Has repetido la melodía 🎵');
        hablar('¡Increíble! Has reproducido la melodía correctamente.');
        setTimeout(() => {
            mostrarPantalla('juegos');
            puntuacion = 0;
        }, 3000);
    }
}

// Funciones auxiliares
function actualizarProgreso(elementoId, porcentaje) {
    const elemento = document.getElementById(elementoId);
    elemento.style.width = (porcentaje * 100) + '%';
}

function mostrarCelebracion(simbolo) {
    const celebracion = document.createElement('div');
    celebracion.className = 'celebracion';
    celebracion.textContent = simbolo;
    document.body.appendChild(celebracion);
    
    setTimeout(() => celebracion.remove(), 2000);
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => notificacion.remove(), 3000);
}