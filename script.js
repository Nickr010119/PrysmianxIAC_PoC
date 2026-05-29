/* -------------------------------------------------------------
   Portal de Evaluaciones - Prysmian & IAC
   Lógica de Interactividad & Efectos Visuales Premium
---------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar efectos interactivos
    initCard3DTilt();
    initKeyboardAccessibility();
});

// --- Función para copiar enlaces al portapapeles con Toast Feedback ---
function copyToClipboard(text, buttonElement) {
    if (!navigator.clipboard) {
        // Fallback para navegadores antiguos
        fallbackCopyToClipboard(text, buttonElement);
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            showCopySuccess(buttonElement);
        })
        .catch(err => {
            console.error('Error al copiar el enlace: ', err);
            showToast('No se pudo copiar el enlace automáticamente.', 'error');
        });
}

// Fallback de copiado
function fallbackCopyToClipboard(text, buttonElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Evitar scroll
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(buttonElement);
        } else {
            showToast('No se pudo copiar el enlace.', 'error');
        }
    } catch (err) {
        console.error('Error en fallback de copiado: ', err);
        showToast('Error al intentar copiar el enlace.', 'error');
    }

    document.body.removeChild(textArea);
}

// Mostrar estado de éxito en el botón de copiado
function showCopySuccess(button) {
    const icon = button.querySelector('i');
    
    // Cambiar icono a checkmark animado
    icon.className = 'fa-solid fa-check text-success';
    button.classList.add('copied');
    
    // Lanzar notificación flotante (Toast)
    showToast('¡Enlace copiado al portapapeles!', 'success');

    // Restaurar icono original después de 2 segundos
    setTimeout(() => {
        icon.className = 'fa-regular fa-copy';
        button.classList.remove('copied');
    }, 2000);
}

// --- Sistema de Notificaciones Flotantes (Toast) ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Crear el elemento de la notificación
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    
    // Icono correspondiente
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check toast-icon' : 'fa-solid fa-circle-exclamation toast-icon-error';
    
    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-destrucción controlada
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000);
}

// --- Sistema de Visualización de Códigos QR (Lightbox) ---
function openLightbox(imageSrc, titleText) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');

    if (!lightbox || !lightboxImg || !lightboxTitle) return;

    lightboxImg.src = imageSrc;
    lightboxTitle.textContent = titleText;
    
    lightbox.style.display = 'flex';
    
    // Permitir flujo de renderizado antes de añadir la clase activa para la transición
    requestAnimationFrame(() => {
        lightbox.classList.add('active');
    });

    // Bloquear scroll de la página de fondo
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    
    // Esperar a que termine la animación CSS (350ms) para ocultar
    setTimeout(() => {
        lightbox.style.display = 'none';
        // Restaurar scroll de la página
        document.body.style.overflow = '';
    }, 350);
}

// Accesibilidad mediante teclado (Cerrar lightbox con Escape)
function initKeyboardAccessibility() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        }
    });
}

// --- Efecto de Inclinación 3D Premium e Interactivo en las Tarjetas (Tilt Effect) ---
function initCard3DTilt() {
    const cards = document.querySelectorAll('.test-card');
    
    // Desactivar en dispositivos móviles para optimizar rendimiento y usabilidad táctil
    if (window.innerWidth <= 900) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            
            // Posición del mouse relativa a la tarjeta
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            // Normalizar valores (-0.5 a 0.5)
            const xc = x / cardRect.width - 0.5;
            const yc = y / cardRect.height - 0.5;
            
            // Grados máximos de rotación (sutil para mantener minimalismo)
            const maxRotation = 6; 
            
            const rotateX = yc * -maxRotation;
            const rotateY = xc * maxRotation;
            
            // Aplicar la transformación de rotación 3D y elevación
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        // Restaurar posición original suavemente al salir
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        // Limpiar transición cuando se vuelve a entrar para mantener el efecto en tiempo real
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}
