// ========== Navbar Scroll ==========
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== Filter Buttons ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.getAttribute('data-category');
        filterRoutes(category);
    });
});

function filterRoutes(category) {
    const routeGroups = document.querySelectorAll('.route-group');
    const routeCards = document.querySelectorAll('.route-card');

    if (category === 'all') {
        routeGroups.forEach(group => group.classList.remove('hidden'));
        routeCards.forEach(card => card.classList.remove('hidden'));
    } else {
        routeGroups.forEach(group => {
            if (group.getAttribute('data-group') === category) {
                group.classList.remove('hidden');
            } else {
                group.classList.add('hidden');
            }
        });
        routeCards.forEach(card => {
            const cats = card.getAttribute('data-category').split(' ');
            card.classList.toggle('hidden', !cats.includes(category));
        });
    }
}

// ========== Scroll Animations ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.route-card, .fade-in').forEach(el => observer.observe(el));

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        if (this.classList.contains('route-btn') || this.classList.contains('tour-modal-btn') || this.classList.contains('cta-btn')) {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== Active Nav Link ==========
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

// ========== Mobile Menu ==========
document.querySelector('.mobile-toggle').addEventListener('click', function () {
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

// ========== TOUR MODAL ==========
const tourModal = document.getElementById('tourModal');
const tourModalOverlay = document.querySelector('.tour-modal-overlay');
const tourModalClose = document.querySelector('.tour-modal-close');
const tourModalBtn = document.querySelector('.tour-modal-btn');

document.querySelectorAll('.route-card .route-image').forEach(imageBlock => {
    imageBlock.addEventListener('click', function () {
        const card = this.closest('.route-card');
        openTourModal(card);
    });
});

function openTourModal(card) {
    const img = card.querySelector('.route-image img');
    const tag = card.querySelector('.route-tag')?.textContent || '';
    const title = card.querySelector('h3')?.textContent || '';
    
    const fullDesc = card.querySelector('.full-description');
    const shortDesc = card.querySelector('.route-info p');
    const description = fullDesc ? fullDesc.innerHTML : (shortDesc ? shortDesc.textContent : '');
    
    const price = card.querySelector('.route-price')?.textContent || '';
    
    let detailsHTML = '';
    card.querySelectorAll('.route-details span').forEach(detail => {
        detailsHTML += `<div class="detail-item">${detail.innerHTML}</div>`;
    });

    document.querySelector('.tour-modal-image img').src = img.src;
    document.querySelector('.tour-modal-image img').alt = img.alt;
    document.querySelector('.tour-modal-tag').textContent = tag;
    document.querySelector('.tour-modal-title').textContent = title;
    document.querySelector('.tour-modal-description').innerHTML = description;
    document.querySelector('.tour-modal-details').innerHTML = detailsHTML;
    document.querySelector('.tour-modal-price').innerHTML = price + '<small>стоимость экскурсии</small>';
    
    tourModalBtn.dataset.tourName = title + ' — ' + price;
    tourModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeTourModal() {
    tourModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

tourModalOverlay.addEventListener('click', closeTourModal);
tourModalClose.addEventListener('click', closeTourModal);

tourModalBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const tourName = this.dataset.tourName || '';
    closeTourModal();
    setTimeout(() => openBookingModal(tourName), 300);
});

// ========== BOOKING MODAL ==========
const bookingModal = document.getElementById('bookingModal');
const bookingModalOverlay = document.querySelector('.booking-modal-overlay');
const bookingClose = document.getElementById('bookingClose');
const bookingForm = document.getElementById('bookingForm');
const bookingTourSelect = document.getElementById('bookingTour');
const bookingDate = document.getElementById('bookingDate');

const today = new Date().toISOString().split('T')[0];
bookingDate.min = today;
bookingDate.value = today;

function openBookingModal(tourName = '') {
    if (tourName) {
        const options = Array.from(bookingTourSelect.options);
        const match = options.find(opt => opt.value === tourName);
        if (match) {
            bookingTourSelect.value = tourName;
        } else {
            const tourNameOnly = tourName.split(' — ')[0].trim();
            const partialMatch = options.find(opt =>
                opt.value && opt.value.startsWith(tourNameOnly)
            );
            if (partialMatch) {
                bookingTourSelect.value = partialMatch.value;
            } else {
                bookingTourSelect.value = '';
            }
        }
    } else {
        bookingTourSelect.value = '';
    }

    bookingModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

bookingModalOverlay.addEventListener('click', closeBookingModal);
bookingClose.addEventListener('click', closeBookingModal);

document.querySelectorAll('.route-card .route-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.route-card');
        const title = card.querySelector('h3')?.textContent || '';
        const price = card.querySelector('.route-price')?.textContent || '';
        openBookingModal(title + ' — ' + price);
    });
});

document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        openBookingModal('');
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('successModal')?.classList.contains('active')) {
            document.getElementById('successModal').classList.remove('active');
            document.body.classList.remove('modal-open');
        } else if (bookingModal.classList.contains('active')) {
            closeBookingModal();
        } else if (tourModal.classList.contains('active')) {
            closeTourModal();
        }
    }
});

// ========== ОТПРАВКА ФОРМЫ ==========
const successModal = document.getElementById('successModal');
const successClose = document.getElementById('successClose');
const successModalOverlay = document.querySelector('.success-modal-overlay');

const BOOKING_CONFIG = {
    telegramBotToken: 'YOUR_BOT_TOKEN_HERE',
    telegramChatId: 'YOUR_CHAT_ID_HERE',
    whatsappNumber: '79999999999',
    email: 'info@ptztur.ru'
};

// По умолчанию всегда Telegram (выбор канала скрыт из UI)
let currentChannel = 'telegram';

/* 
// ========== ВЫБОР КАНАЛА СВЯЗИ (скрыто, можно вернуть позже) ==========
document.querySelectorAll('.booking-submit-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        currentChannel = this.dataset.channel;
    });
});
*/

// Маска телефона
const phoneInput = document.getElementById('bookingPhone');
phoneInput.addEventListener('input', function (e) {
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

// Валидация (email убран из обязательных полей)
function validateBookingForm() {
    const tour = document.getElementById('bookingTour');
    const name = document.getElementById('bookingName');
    const phone = document.getElementById('bookingPhone');
    const date = document.getElementById('bookingDate');

    let isValid = true;
    [tour, name, phone, date].forEach(el => el.classList.remove('error'));

    if (!tour.value) { tour.classList.add('error'); isValid = false; }
    if (!name.value.trim()) { name.classList.add('error'); isValid = false; }

    const phoneDigits = phone.value.replace(/\D/g, '');
    if (phoneDigits.length !== 11) { phone.classList.add('error'); isValid = false; }

    if (!date.value) { date.classList.add('error'); isValid = false; }

    return isValid;
}

// Формирование сообщения (email убран)
function getBookingMessage() {
    const tour = document.getElementById('bookingTour').value;
    const name = document.getElementById('bookingName').value;
    const phone = document.getElementById('bookingPhone').value;
    // const email = document.getElementById('bookingEmail').value; // скрыто
    const date = document.getElementById('bookingDate').value;
    const people = document.getElementById('bookingPeople').value;
    const comment = document.getElementById('bookingComment').value;

    const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    let message = `🎯 НОВАЯ ЗАЯВКА НА БРОНИРОВАНИЕ\n\n`;
    message += `🗺 Тур: ${tour}\n`;
    message += ` Имя: ${name}\n`;
    message += `📞 Телефон: ${phone}\n`;
    // if (email) message += `📧 Email: ${email}\n`; // скрыто
    message += `📅 Дата: ${formattedDate}\n`;
    message += ` Человек: ${people}\n`;
    if (comment) message += `💬 Комментарий: ${comment}\n`;

    return message;
}

// Отправка формы
bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateBookingForm()) return;

    const message = getBookingMessage();
    const tour = document.getElementById('bookingTour').value;

    // Всегда отправляем через Telegram (выбор канала скрыт)
    if (BOOKING_CONFIG.telegramBotToken === 'YOUR_BOT_TOKEN_HERE') {
        // Если токен не настроен — открываем WhatsApp как запасной вариант
        sendToWhatsApp(message);
        return;
    }

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
            closeBookingModal();
            bookingForm.reset();
            document.getElementById('bookingDate').value = today;
            successModal.classList.add('active');
            document.body.classList.add('modal-open');
        } else {
            alert('Ошибка отправки. Попробуйте другой способ связи.');
        }
    }).catch(() => {
        alert('Ошибка отправки. Попробуйте другой способ связи.');
    });

    /*
    // ========== АЛЬТЕРНАТИВНЫЕ КАНАЛЫ (скрыто, можно вернуть позже) ==========
    if (currentChannel === 'whatsapp') {
        sendToWhatsApp(message);
    } else if (currentChannel === 'email') {
        const subject = `Заявка на тур: ${tour}`;
        const body = message;
        window.location.href = `mailto:${BOOKING_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        closeBookingModal();
        bookingForm.reset();
        document.getElementById('bookingDate').value = today;
        setTimeout(() => {
            successModal.classList.add('active');
            document.body.classList.add('modal-open');
        }, 500);
    }
    */
});

function sendToWhatsApp(message) {
    const url = `https://wa.me/${BOOKING_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    closeBookingModal();
    bookingForm.reset();
    document.getElementById('bookingDate').value = today;
    setTimeout(() => {
        successModal.classList.add('active');
        document.body.classList.add('modal-open');
    }, 500);
}

successClose.addEventListener('click', () => {
    successModal.classList.remove('active');
    document.body.classList.remove('modal-open');
});

successModalOverlay.addEventListener('click', () => {
    successModal.classList.remove('active');
    document.body.classList.remove('modal-open');
});