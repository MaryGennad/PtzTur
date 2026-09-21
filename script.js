// =====================================================
// NAVBAR
// =====================================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Активная ссылка в меню при скролле
const sections = d// =====================================================
// NAVBAR
// =====================================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Активная ссылка в меню при скролле
const sections = document.querySelectorAll('section, div[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

// Мобильное меню
document.querySelector('.mobile-toggle')?.addEventListener('click', function () {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'rgba(26,26,26,0.98)';
        navLinks.style.padding = '30px';
        navLinks.style.gap = '20px';
        navLinks.style.alignItems = 'center';
    }
});

// =====================================================
// ФИЛЬТРЫ
// =====================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.getAttribute('data-category');
        document.querySelectorAll('.route-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// =====================================================
// АНИМАЦИЯ ПОЯВЛЕНИЯ КАРТОЧЕК
// =====================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.route-card, .fade-in').forEach(el => observer.observe(el));

// =====================================================
// ПЛАВНЫЙ СКРОЛЛ
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        if (this.classList.contains('route-btn') ||
            this.classList.contains('tour-modal-btn') ||
            this.classList.contains('cta-btn')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// =====================================================
// МОДАЛКА "УЗНАТЬ ПОДРОБНЕЕ"
// =====================================================
const tourModal = document.getElementById('tourModal');
const tourModalOverlay = tourModal?.querySelector('.tour-modal-overlay');
const tourModalClose = tourModal?.querySelector('.tour-modal-close');
const tourModalBtn = tourModal?.querySelector('.tour-modal-btn');

// Клик по кнопке "Узнать подробнее" — открывает модалку
document.querySelectorAll('.route-card .route-btn-secondary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.route-card');
        openTourModal(card);
    });
});

// Клик по ФОТО карточки — открывает ЛАЙТБОКС
document.querySelectorAll('.route-card .route-image').forEach(imgBox => {
    imgBox.addEventListener('click', function () {
        const img = this.querySelector('img');
        if (!img) return;
        document.getElementById('lightboxImg').src = img.src;
        document.getElementById('lightboxImg').alt = img.alt;
        document.getElementById('imageLightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function openTourModal(card) {
    const img = card.querySelector('.route-image img');
    const tag = card.querySelector('.route-tag')?.textContent || '';
    const title = card.querySelector('h3')?.textContent || '';
    const price = card.querySelector('.route-price')?.textContent || '';

    // Краткое описание из карточки
    const shortDesc = card.querySelector('.route-info > p')?.textContent || '';

    // ПОЛНОЕ описание из скрытого блока
    const fullDesc = card.querySelector('.full-description');
    const fullBox = document.getElementById('tourModalFull');

    // Заполняем модалку
    document.querySelector('.tour-modal-image img').src = img.src;
    document.querySelector('.tour-modal-image img').alt = img.alt;
    document.querySelector('.tour-modal-tag').textContent = tag;
    document.querySelector('.tour-modal-title').textContent = title;
    document.querySelector('.tour-modal-description').textContent = shortDesc;

    // Детали (время + цена)
    let detailsHTML = '';
    card.querySelectorAll('.route-details span').forEach(detail => {
        detailsHTML += `<div class="detail-item">${detail.innerHTML}</div>`;
    });
    document.querySelector('.tour-modal-details').innerHTML = detailsHTML;
    document.querySelector('.tour-modal-price').innerHTML = price + '<small>стоимость экскурсии</small>';

    // ПОЛНОЕ описание (главное изменение!)
    if (fullBox && fullDesc) {
        fullBox.innerHTML = fullDesc.innerHTML;
    } else if (fullBox) {
        fullBox.innerHTML = '';
    }

    tourModalBtn.dataset.tourName = title;
    tourModalBtn.dataset.duration = card.querySelector('.route-details span:first-child')?.textContent.trim() || '';
tourModalBtn.dataset.price = price;
    tourModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTourModal() {
    tourModal.classList.remove('active');
    document.body.style.overflow = '';
    const fullBox = document.getElementById('tourModalFull');
    if (fullBox) fullBox.innerHTML = '';
}

tourModalOverlay?.addEventListener('click', closeTourModal);
tourModalClose?.addEventListener('click', closeTourModal);

// Кнопка "Забронировать" внутри модалки → открывает бронирование с выбранным туром
// tourModalBtn?.addEventListener('click', function (e) {
//     e.preventDefault();
//     const tourName = this.dataset.tourName || '';
//     closeTourModal();
//     setTimeout(() => openBookingModal(tourName), 300);
// });
tourModalBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    const t = this.dataset.tourName || '';
    const d = this.dataset.duration || '';
    const p = this.dataset.price || '';
    closeTourModal();
    setTimeout(() => openBookingModal(t, d, p), 300);
});

// =====================================================
// ЛАЙТБОКС (КЛИК ПО ФОТО)
// =====================================================
function closeLightbox() {
    document.getElementById('imageLightbox')?.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('imageLightbox')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);

// =====================================================
// МОДАЛКА БРОНИРОВАНИЯ
// =====================================================
const bookingModal = document.getElementById('bookingModal');
const bookingModalOverlay = bookingModal?.querySelector('.booking-modal-overlay');
const bookingClose = document.getElementById('bookingClose');
const bookingForm = document.getElementById('bookingForm');
const bookingTourSelect = document.getElementById('bookingTour');
const bookingDate = document.getElementById('bookingDate');

const today = new Date().toISOString().split('T')[0];
if (bookingDate) {
    bookingDate.min = today;
    bookingDate.value = today;
}

// Клик по кнопке "Забронировать" на карточке
// document.querySelectorAll('.route-card .route-btn-primary').forEach(btn => {
//     btn.addEventListener('click', function (e) {
//         e.preventDefault();
//         const card = this.closest('.route-card');
//         const title = card.querySelector('h3')?.textContent || '';
//         openBookingModal(title);
//     });
// });
// ========== КНОПКА "ЗАБРОНИРОВАТЬ" НА КАРТОЧКЕ ==========
document.querySelectorAll('.route-card .route-btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.route-card');
        const title = card.querySelector('h3')?.textContent.trim() || '';
        const desc = card.querySelector('.route-info > p')?.textContent.trim() || '';
        const duration = card.querySelector('.route-details span:first-child')?.textContent.trim() || '';
        const price = card.querySelector('.route-price')?.textContent.trim() || '';
        openBookingModal(title, duration, price, desc);
    });
});

// ========== ОТКРЫТИЕ МОДАЛКИ БРОНИРОВАНИЯ ==========
function openBookingModal(tourName = '', duration = '', price = '', description = '') {
    // Название и описание — подставляются ВСЕГДА
    const titleEl = document.getElementById('bookingTitle');
    const descEl = document.getElementById('bookingDescription');
    if (titleEl) titleEl.textContent = tourName || 'Индивидуальная заявка';
    if (descEl) descEl.textContent = description || 'Оставьте заявку, и мы свяжемся с вами для подтверждения бронирования.';

    // Время и цена
    const durEl = document.getElementById('bookingDuration');
    const priceEl = document.getElementById('bookingPrice');
    if (durEl) durEl.textContent = duration || '—';
    if (priceEl) priceEl.textContent = price || '—';

    // Автовыбор тура в списке
    if (bookingTourSelect) {
        let matched = false;
        if (tourName) {
            const match = Array.from(bookingTourSelect.options).find(opt =>
                opt.value && (opt.value === tourName || opt.value.includes(tourName) || tourName.includes(opt.value))
            );
            if (match) { bookingTourSelect.value = match.value; matched = true; }
        }
        if (!matched) bookingTourSelect.value = '';
    }

    bookingModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
// Клик по CTA-кнопке
document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        if (this.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
        }
        openBookingModal('');
    });
});

// ========== МОДАЛКА БРОНИРОВАНИЯ (с временем и ценой) ==========
function openBookingModal(tourName = '', duration = '', price = '', description = '') {
 
    const titleEl = document.getElementById('bookingTitle');
    const descEl = document.getElementById('bookingDescription');
    if (titleEl) titleEl.textContent = tourName || 'Индивидуальная заявка';
    if (descEl) descEl.textContent = description || 'Оставьте заявку, и мы свяжемся с вами для подтверждения бронирования.';

    // Время и цена (уже работали)
    const durEl = document.getElementById('bookingDuration');
    const priceEl = document.getElementById('bookingPrice');
    if (durEl) durEl.textContent = duration || '—';
    if (priceEl) priceEl.textContent = price || '—';

    // Автовыбор тура в списке
    if (bookingTourSelect) {
        let matched = false;
        if (tourName) {
            const match = Array.from(bookingTourSelect.options).find(opt =>
                opt.value && (opt.value === tourName || opt.value.includes(tourName) || tourName.includes(opt.value))
            );
            if (match) { bookingTourSelect.value = match.value; matched = true; }
        }
        if (!matched) bookingTourSelect.value = '';
    }

    bookingModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Кнопка "Забронировать" на карточке — берём также время и цену
document.querySelectorAll('.route-card .route-btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.route-card');
        const title = card.querySelector('h3')?.textContent || '';
        const duration = card.querySelector('.route-details span:first-child')?.textContent.trim() || '';
        const price = card.querySelector('.route-price')?.textContent.trim() || '';
        openBookingModal(title, duration, price);
    });
});

function closeBookingModal() {
    bookingModal?.classList.remove('active');
    document.body.style.overflow = '';
}

bookingModalOverlay?.addEventListener('click', closeBookingModal);
bookingClose?.addEventListener('click', closeBookingModal);

// =====================================================
// ОТПРАВКА ФОРМЫ БРОНИРОВАНИЯ
// =====================================================
const BOOKING_CONFIG = {
    telegramBotToken: 'YOUR_BOT_TOKEN_HERE',
    telegramChatId: 'YOUR_CHAT_ID_HERE',
    whatsappNumber: '79212259399',  // Ваш номер телефона
    email: 'ptztur@yandex.ru'
};

// Маска телефона
const phoneInput = document.getElementById('bookingPhone');
phoneInput?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (!value.startsWith('7') && value.length > 0) value = '7' + value;

    let formatted = '';
    if (value.length > 0) formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
    if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
    if (value.length >= 7) formatted += '-' + value.slice(7, 11);
    if (value.length >= 11) formatted += '-' + value.slice(11, 13);

    e.target.value = formatted;
});

function validateBookingForm() {
    const tour = document.getElementById('bookingTour');
    const name = document.getElementById('bookingName');
    const phone = document.getElementById('bookingPhone');
    const date = document.getElementById('bookingDate');
    const consent = document.getElementById('bookingConsent');

    let isValid = true;
    [tour, name, phone, date].forEach(el => el?.classList.remove('error'));

    if (!tour?.value) { tour?.classList.add('error'); isValid = false; }
    if (!name?.value.trim()) { name?.classList.add('error'); isValid = false; }
    const phoneDigits = phone?.value.replace(/\D/g, '') || '';
    if (phoneDigits.length !== 11) { phone?.classList.add('error'); isValid = false; }
    if (!date?.value) { date?.classList.add('error'); isValid = false; }
    if (!consent?.checked) {
        alert('Пожалуйста, подтвердите согласие на обработку персональных данных.');
        isValid = false;
    }

    return isValid;
}

function getBookingMessage() {
    const tour = document.getElementById('bookingTour')?.value || '';
    const name = document.getElementById('bookingName')?.value || '';
    const phone = document.getElementById('bookingPhone')?.value || '';
    const date = document.getElementById('bookingDate')?.value || '';
    const people = document.getElementById('bookingPeople')?.value || '2';
    const comment = document.getElementById('bookingComment')?.value || '';

    const formattedDate = date ? new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : '';

    let message = `🎯 НОВАЯ ЗАЯВКА НА БРОНИРОВАНИЕ\n\n`;
    message += `🗺 Тур: ${tour}\n`;
    message += `👤 Имя: ${name}\n`;
    message += `📞 Телефон: ${phone}\n`;
    message += `📅 Дата: ${formattedDate}\n`;
    message += `👥 Человек: ${people}\n`;
    if (comment) message += `💬 Комментарий: ${comment}\n`;

    return message;
}

bookingForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateBookingForm()) return;

    const message = getBookingMessage();

    // Если Telegram настроен — отправляем туда
    if (BOOKING_CONFIG.telegramBotToken !== 'YOUR_BOT_TOKEN_HERE') {
        fetch(`https://api.telegram.org/bot${BOOKING_CONFIG.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: BOOKING_CONFIG.telegramChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        }).then(r => {
            if (r.ok) {
                showSuccessModal();
            } else {
                sendToWhatsApp(message);
            }
        }).catch(() => sendToWhatsApp(message));
    } else {
        // Telegram не настроен — открываем WhatsApp
        sendToWhatsApp(message);
    }
});

function sendToWhatsApp(message) {
    const url = `https://wa.me/${BOOKING_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showSuccessModal();
}

function showSuccessModal() {
    closeBookingModal();
    bookingForm?.reset();
    if (bookingDate) bookingDate.value = today;
    setTimeout(() => {
        document.getElementById('successModal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 500);
}

// =====================================================
// МОДАЛКА УСПЕХА
// =====================================================
const successModal = document.getElementById('successModal');
const successClose = document.getElementById('successClose');
const successModalOverlay = document.querySelector('.success-modal-overlay');

successClose?.addEventListener('click', () => {
    successModal?.classList.remove('active');
    document.body.style.overflow = '';
});

successModalOverlay?.addEventListener('click', () => {
    successModal?.classList.remove('active');
    document.body.style.overflow = '';
});

// =====================================================
// ESC — ЗАКРЫВАЕТ ВСЕ МОДАЛКИ
// =====================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTourModal();
        closeBookingModal();
        closeLightbox();
        successModal?.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Логотип: автоподбор рабочего пути
document.querySelectorAll('img[alt="ПТЗ ТУР"]').forEach(img => {
    const current = img.getAttribute('src');
    const paths = ['logoPTZTUR5.svg', '/logoPTZTUR5.svg', 'PtzTur/logoPTZTUR5.svg', 'PtzTur/img/logoPTZTUR5.svg']
        .filter(p => p !== current);
    let i = 0;
    img.addEventListener('error', function handler() {
        if (i < paths.length) img.src = paths[i++];
        else img.removeEventListener('error', handler);
    });
});ocument.querySelectorAll('section, div[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

// Мобильное меню
document.querySelector('.mobile-toggle')?.addEventListener('click', function () {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'rgba(26,26,26,0.98)';
        navLinks.style.padding = '30px';
        navLinks.style.gap = '20px';
        navLinks.style.alignItems = 'center';
    }
});

// =====================================================
// ФИЛЬТРЫ
// =====================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.getAttribute('data-category');
        document.querySelectorAll('.route-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// =====================================================
// АНИМАЦИЯ ПОЯВЛЕНИЯ КАРТОЧЕК
// =====================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.route-card, .fade-in').forEach(el => observer.observe(el));

// =====================================================
// ПЛАВНЫЙ СКРОЛЛ
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        if (this.classList.contains('route-btn') ||
            this.classList.contains('tour-modal-btn') ||
            this.classList.contains('cta-btn')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// =====================================================
// МОДАЛКА "УЗНАТЬ ПОДРОБНЕЕ"
// =====================================================
const tourModal = document.getElementById('tourModal');
const tourModalOverlay = tourModal?.querySelector('.tour-modal-overlay');
const tourModalClose = tourModal?.querySelector('.tour-modal-close');
const tourModalBtn = tourModal?.querySelector('.tour-modal-btn');

// Клик по кнопке "Узнать подробнее" — открывает модалку
document.querySelectorAll('.route-card .route-btn-secondary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.route-card');
        openTourModal(card);
    });
});

// Клик по ФОТО карточки — открывает ЛАЙТБОКС
document.querySelectorAll('.route-card .route-image').forEach(imgBox => {
    imgBox.addEventListener('click', function () {
        const img = this.querySelector('img');
        if (!img) return;
        document.getElementById('lightboxImg').src = img.src;
        document.getElementById('lightboxImg').alt = img.alt;
        document.getElementById('imageLightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function openTourModal(card) {
    const img = card.querySelector('.route-image img');
    const tag = card.querySelector('.route-tag')?.textContent || '';
    const title = card.querySelector('h3')?.textContent || '';
    const price = card.querySelector('.route-price')?.textContent || '';

    // Краткое описание из карточки
    const shortDesc = card.querySelector('.route-info > p')?.textContent || '';

    // ПОЛНОЕ описание из скрытого блока
    const fullDesc = card.querySelector('.full-description');
    const fullBox = document.getElementById('tourModalFull');

    // Заполняем модалку
    document.querySelector('.tour-modal-image img').src = img.src;
    document.querySelector('.tour-modal-image img').alt = img.alt;
    document.querySelector('.tour-modal-tag').textContent = tag;
    document.querySelector('.tour-modal-title').textContent = title;
    document.querySelector('.tour-modal-description').textContent = shortDesc;

    // Детали (время + цена)
    let detailsHTML = '';
    card.querySelectorAll('.route-details span').forEach(detail => {
        detailsHTML += `<div class="detail-item">${detail.innerHTML}</div>`;
    });
    document.querySelector('.tour-modal-details').innerHTML = detailsHTML;
    document.querySelector('.tour-modal-price').innerHTML = price + '<small>стоимость экскурсии</small>';

    // ПОЛНОЕ описание (главное изменение!)
    if (fullBox && fullDesc) {
        fullBox.innerHTML = fullDesc.innerHTML;
    } else if (fullBox) {
        fullBox.innerHTML = '';
    }

    tourModalBtn.dataset.tourName = title;
    tourModalBtn.dataset.duration = card.querySelector('.route-details span:first-child')?.textContent.trim() || '';
tourModalBtn.dataset.price = price;
    tourModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTourModal() {
    tourModal.classList.remove('active');
    document.body.style.overflow = '';
    const fullBox = document.getElementById('tourModalFull');
    if (fullBox) fullBox.innerHTML = '';
}

tourModalOverlay?.addEventListener('click', closeTourModal);
tourModalClose?.addEventListener('click', closeTourModal);

// Кнопка "Забронировать" внутри модалки → открывает бронирование с выбранным туром
// tourModalBtn?.addEventListener('click', function (e) {
//     e.preventDefault();
//     const tourName = this.dataset.tourName || '';
//     closeTourModal();
//     setTimeout(() => openBookingModal(tourName), 300);
// });
tourModalBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    const t = this.dataset.tourName || '';
    const d = this.dataset.duration || '';
    const p = this.dataset.price || '';
    closeTourModal();
    setTimeout(() => openBookingModal(t, d, p), 300);
});

// =====================================================
// ЛАЙТБОКС (КЛИК ПО ФОТО)
// =====================================================
function closeLightbox() {
    document.getElementById('imageLightbox')?.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('imageLightbox')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);

// =====================================================
// МОДАЛКА БРОНИРОВАНИЯ
// =====================================================
const bookingModal = document.getElementById('bookingModal');
const bookingModalOverlay = bookingModal?.querySelector('.booking-modal-overlay');
const bookingClose = document.getElementById('bookingClose');
const bookingForm = document.getElementById('bookingForm');
const bookingTourSelect = document.getElementById('bookingTour');
const bookingDate = document.getElementById('bookingDate');

const today = new Date().toISOString().split('T')[0];
if (bookingDate) {
    bookingDate.min = today;
    bookingDate.value = today;
}

// Клик по кнопке "Забронировать" на карточке
// document.querySelectorAll('.route-card .route-btn-primary').forEach(btn => {
//     btn.addEventListener('click', function (e) {
//         e.preventDefault();
//         const card = this.closest('.route-card');
//         const title = card.querySelector('h3')?.textContent || '';
//         openBookingModal(title);
//     });
// });
// ========== КНОПКА "ЗАБРОНИРОВАТЬ" НА КАРТОЧКЕ ==========
document.querySelectorAll('.route-card .route-btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.route-card');
        const title = card.querySelector('h3')?.textContent.trim() || '';
        const desc = card.querySelector('.route-info > p')?.textContent.trim() || '';
        const duration = card.querySelector('.route-details span:first-child')?.textContent.trim() || '';
        const price = card.querySelector('.route-price')?.textContent.trim() || '';
        openBookingModal(title, duration, price, desc);
    });
});

// ========== ОТКРЫТИЕ МОДАЛКИ БРОНИРОВАНИЯ ==========
function openBookingModal(tourName = '', duration = '', price = '', description = '') {
    // Название и описание — подставляются ВСЕГДА
    const titleEl = document.getElementById('bookingTitle');
    const descEl = document.getElementById('bookingDescription');
    if (titleEl) titleEl.textContent = tourName || 'Индивидуальная заявка';
    if (descEl) descEl.textContent = description || 'Оставьте заявку, и мы свяжемся с вами для подтверждения бронирования.';

    // Время и цена
    const durEl = document.getElementById('bookingDuration');
    const priceEl = document.getElementById('bookingPrice');
    if (durEl) durEl.textContent = duration || '—';
    if (priceEl) priceEl.textContent = price || '—';

    // Автовыбор тура в списке
    if (bookingTourSelect) {
        let matched = false;
        if (tourName) {
            const match = Array.from(bookingTourSelect.options).find(opt =>
                opt.value && (opt.value === tourName || opt.value.includes(tourName) || tourName.includes(opt.value))
            );
            if (match) { bookingTourSelect.value = match.value; matched = true; }
        }
        if (!matched) bookingTourSelect.value = '';
    }

    bookingModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
// Клик по CTA-кнопке
document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        if (this.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
        }
        openBookingModal('');
    });
});

// ========== МОДАЛКА БРОНИРОВАНИЯ (с временем и ценой) ==========
function openBookingModal(tourName = '', duration = '', price = '', description = '') {
 
    const titleEl = document.getElementById('bookingTitle');
    const descEl = document.getElementById('bookingDescription');
    if (titleEl) titleEl.textContent = tourName || 'Индивидуальная заявка';
    if (descEl) descEl.textContent = description || 'Оставьте заявку, и мы свяжемся с вами для подтверждения бронирования.';

    // Время и цена (уже работали)
    const durEl = document.getElementById('bookingDuration');
    const priceEl = document.getElementById('bookingPrice');
    if (durEl) durEl.textContent = duration || '—';
    if (priceEl) priceEl.textContent = price || '—';

    // Автовыбор тура в списке
    if (bookingTourSelect) {
        let matched = false;
        if (tourName) {
            const match = Array.from(bookingTourSelect.options).find(opt =>
                opt.value && (opt.value === tourName || opt.value.includes(tourName) || tourName.includes(opt.value))
            );
            if (match) { bookingTourSelect.value = match.value; matched = true; }
        }
        if (!matched) bookingTourSelect.value = '';
    }

    bookingModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Кнопка "Забронировать" на карточке — берём также время и цену
document.querySelectorAll('.route-card .route-btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.route-card');
        const title = card.querySelector('h3')?.textContent || '';
        const duration = card.querySelector('.route-details span:first-child')?.textContent.trim() || '';
        const price = card.querySelector('.route-price')?.textContent.trim() || '';
        openBookingModal(title, duration, price);
    });
});

function closeBookingModal() {
    bookingModal?.classList.remove('active');
    document.body.style.overflow = '';
}

bookingModalOverlay?.addEventListener('click', closeBookingModal);
bookingClose?.addEventListener('click', closeBookingModal);

// =====================================================
// ОТПРАВКА ФОРМЫ БРОНИРОВАНИЯ
// =====================================================
const BOOKING_CONFIG = {
    telegramBotToken: 'YOUR_BOT_TOKEN_HERE',
    telegramChatId: 'YOUR_CHAT_ID_HERE',
    whatsappNumber: '79212259399',  // Ваш номер телефона
    email: 'ptztur@yandex.ru'
};

// Маска телефона
const phoneInput = document.getElementById('bookingPhone');
phoneInput?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (!value.startsWith('7') && value.length > 0) value = '7' + value;

    let formatted = '';
    if (value.length > 0) formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
    if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
    if (value.length >= 7) formatted += '-' + value.slice(7, 11);
    if (value.length >= 11) formatted += '-' + value.slice(11, 13);

    e.target.value = formatted;
});

function validateBookingForm() {
    const tour = document.getElementById('bookingTour');
    const name = document.getElementById('bookingName');
    const phone = document.getElementById('bookingPhone');
    const date = document.getElementById('bookingDate');
    const consent = document.getElementById('bookingConsent');

    let isValid = true;
    [tour, name, phone, date].forEach(el => el?.classList.remove('error'));

    if (!tour?.value) { tour?.classList.add('error'); isValid = false; }
    if (!name?.value.trim()) { name?.classList.add('error'); isValid = false; }
    const phoneDigits = phone?.value.replace(/\D/g, '') || '';
    if (phoneDigits.length !== 11) { phone?.classList.add('error'); isValid = false; }
    if (!date?.value) { date?.classList.add('error'); isValid = false; }
    if (!consent?.checked) {
        alert('Пожалуйста, подтвердите согласие на обработку персональных данных.');
        isValid = false;
    }

    return isValid;
}

function getBookingMessage() {
    const tour = document.getElementById('bookingTour')?.value || '';
    const name = document.getElementById('bookingName')?.value || '';
    const phone = document.getElementById('bookingPhone')?.value || '';
    const date = document.getElementById('bookingDate')?.value || '';
    const people = document.getElementById('bookingPeople')?.value || '2';
    const comment = document.getElementById('bookingComment')?.value || '';

    const formattedDate = date ? new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : '';

    let message = `🎯 НОВАЯ ЗАЯВКА НА БРОНИРОВАНИЕ\n\n`;
    message += `🗺 Тур: ${tour}\n`;
    message += `👤 Имя: ${name}\n`;
    message += `📞 Телефон: ${phone}\n`;
    message += `📅 Дата: ${formattedDate}\n`;
    message += `👥 Человек: ${people}\n`;
    if (comment) message += `💬 Комментарий: ${comment}\n`;

    return message;
}

bookingForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateBookingForm()) return;

    const message = getBookingMessage();

    // Если Telegram настроен — отправляем туда
    if (BOOKING_CONFIG.telegramBotToken !== 'YOUR_BOT_TOKEN_HERE') {
        fetch(`https://api.telegram.org/bot${BOOKING_CONFIG.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: BOOKING_CONFIG.telegramChatId,
                text: message,
                parse_mode: 'Markdown'
            })
        }).then(r => {
            if (r.ok) {
                showSuccessModal();
            } else {
                sendToWhatsApp(message);
            }
        }).catch(() => sendToWhatsApp(message));
    } else {
        // Telegram не настроен — открываем WhatsApp
        sendToWhatsApp(message);
    }
});

function sendToWhatsApp(message) {
    const url = `https://wa.me/${BOOKING_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showSuccessModal();
}

function showSuccessModal() {
    closeBookingModal();
    bookingForm?.reset();
    if (bookingDate) bookingDate.value = today;
    setTimeout(() => {
        document.getElementById('successModal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 500);
}

// =====================================================
// МОДАЛКА УСПЕХА
// =====================================================
const successModal = document.getElementById('successModal');
const successClose = document.getElementById('successClose');
const successModalOverlay = document.querySelector('.success-modal-overlay');

successClose?.addEventListener('click', () => {
    successModal?.classList.remove('active');
    document.body.style.overflow = '';
});

successModalOverlay?.addEventListener('click', () => {
    successModal?.classList.remove('active');
    document.body.style.overflow = '';
});

// =====================================================
// ESC — ЗАКРЫВАЕТ ВСЕ МОДАЛКИ
// =====================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTourModal();
        closeBookingModal();
        closeLightbox();
        successModal?.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Логотип: автоподбор рабочего пути
document.querySelectorAll('img[alt="ПТЗ ТУР"]').forEach(img => {
    const current = img.getAttribute('src');
    const paths = ['logoPTZTUR5.svg', '/logoPTZTUR5.svg', 'PtzTur/logoPTZTUR5.svg', 'PtzTur/img/logoPTZTUR5.svg']
        .filter(p => p !== current);
    let i = 0;
    img.addEventListener('error', function handler() {
        if (i < paths.length) img.src = paths[i++];
        else img.removeEventListener('error', handler);
    });
});
