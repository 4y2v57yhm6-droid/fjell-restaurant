// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function showMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `form-message ${isSuccess ? 'success' : 'error'}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'form-message';
        }, 3000);
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function initData() {
    let users = localStorage.getItem('fjell_users');
    if (!users) {
        const defaultUsers = [
            { id: 1, name: "Администратор", email: "admin@fjell.ru", password: "admin123", phone: "+7 (999) 000-00-00", isAdmin: true },
            { id: 2, name: "Анна Смирнова", email: "anna@test.ru", password: "123456", phone: "+7 (999) 111-22-33", isAdmin: false }
        ];
        localStorage.setItem('fjell_users', JSON.stringify(defaultUsers));
    }
    
    let events = localStorage.getItem('fjell_events');
    if (!events) {
        const defaultEvents = [
            { id: 1, title: "Вечер скандинавской музыки", date: "2026-05-20", time: "19:00", description: "Концерт народной музыки на хардингфеле", image: "assets/images/event-1.jpg" },
            { id: 2, title: "Сага о викингах", date: "2026-05-25", time: "20:00", description: "Вечер сказаний и мифов", image: "assets/images/event-2.jpg" },
            { id: 3, title: "Дегустация северных настоек", date: "2026-05-28", time: "18:00", description: "Дегустация 5 видов настоек", image: "assets/images/event-3.jpg" }
        ];
        localStorage.setItem('fjell_events', JSON.stringify(defaultEvents));
    }
    
    let bookings = localStorage.getItem('fjell_bookings');
    if (!bookings) {
        localStorage.setItem('fjell_bookings', JSON.stringify([]));
    }
    
    let currentUser = localStorage.getItem('fjell_currentUser');
    if (!currentUser || currentUser === 'null') {
        localStorage.setItem('fjell_currentUser', JSON.stringify(null));
    }
    
    updateNavButtons();
}

function updateNavButtons() {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    const loginBtn = document.getElementById('loginNavBtn');
    const profileBtn = document.getElementById('profileNavBtn');
    const mobileLogin = document.getElementById('mobileLoginLink');
    const mobileProfile = document.getElementById('mobileProfileLink');
    
    if (currentUser && currentUser.id) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'inline-block';
        if (mobileLogin) mobileLogin.style.display = 'none';
        if (mobileProfile) mobileProfile.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (profileBtn) profileBtn.style.display = 'none';
        if (mobileLogin) mobileLogin.style.display = 'block';
        if (mobileProfile) mobileProfile.style.display = 'none';
    }
}

// ========== БУРГЕР-МЕНЮ (РАБОТАЕТ НА ВСЕХ СТРАНИЦАХ) ==========
function initBurgerMenu() {
    // Находим все бургер-иконки и меню на странице
    const burgerIcons = document.querySelectorAll('.burger-icon');
    const mobileMenus = document.querySelectorAll('.mobile-menu');
    const closeBtns = document.querySelectorAll('.close-menu');
    
    // Функция открытия меню
    function openMenu(menu) {
        if (menu) {
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Функция закрытия меню
    function closeMenu(menu) {
        if (menu) {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Закрыть все меню
    function closeAllMenus() {
        mobileMenus.forEach(menu => {
            menu.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
    
    // Обработчики для иконок бургера
    burgerIcons.forEach((icon, index) => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const menu = mobileMenus[index];
            if (menu) {
                if (menu.classList.contains('active')) {
                    closeMenu(menu);
                } else {
                    closeAllMenus();
                    openMenu(menu);
                }
            }
        });
    });
    
    // Обработчики для кнопок закрытия
    closeBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const menu = mobileMenus[index];
            closeMenu(menu);
        });
    });
    
    // Закрытие при клике вне меню
    document.addEventListener('click', function(e) {
        mobileMenus.forEach(menu => {
            if (menu && menu.classList.contains('active')) {
                let isClickInside = false;
                burgerIcons.forEach(icon => {
                    if (icon.contains(e.target)) isClickInside = true;
                });
                if (menu.contains(e.target)) isClickInside = true;
                
                if (!isClickInside) {
                    closeMenu(menu);
                }
            }
        });
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllMenus();
        }
    });
}

// ========== ДАННЫЕ СОБЫТИЙ ==========
const eventsData = [
    {
        id: 1,
        title: "Вечер скандинавской музыки: Хардингфеле",
        date: "2026-05-20",
        time: "19:00",
        description: "Концерт норвежской народной музыки на национальном инструменте хардингфеле. Вас ждут завораживающие мелодии и атмосфера настоящего норвежского хутора.",
        fullDescription: "Хардингфеле — традиционная норвежская скрипка с симпатическими струнами. Этот вечер посвящён скандинавскому музыкальному наследию. В программе: традиционные мелодии, саги и танцы. Исполнитель — известный норвежский музыкант Ларс Ульрих, который специально приедет в наш ресторан. Продолжительность концерта — 1.5 часа. Вход свободный при заказе от 1500₽ на человека. Рекомендуем бронировать столики заранее!",
        image: "assets/images/event-music.jpg"
    },
    {
        id: 2,
        title: "Сага о викингах: вечер сказаний",
        date: "2026-05-25",
        time: "20:00",
        description: "Тематический вечер с рассказами о викингах, северных мифах и легендах. Погрузитесь в мир древних скандинавских саг!",
        fullDescription: "Погрузитесь в мир скандинавской мифологии! Сказитель расскажет древние саги о богах и героях, а шеф-повар приготовит блюда по рецептам эпохи викингов. В программе: истории о Торе, Одине и Локи, традиционные напитки и музыка на варгане. Начало в 20:00. Стоимость участия — 800₽ (включает угощение от шефа). Обязательна предварительная запись по телефону.",
        image: "assets/images/event-saga.jpg"
    },
    {
        id: 3,
        title: "Дегустация северных настоек",
        date: "2026-05-28",
        time: "18:00",
        description: "Дегустация 5 видов северных настоек: можжевеловая, брусничная, травяная и другие. Узнайте секреты скандинавских напитков!",
        fullDescription: "Узнайте секреты приготовления традиционных скандинавских настоек! В программе: дегустация 5 видов настоек (можжевеловая, брусничная, травяная, вересковая, имбирная), рассказ о травах и ягодах, закуски от шефа. Каждый участник получит буклет с рецептами. Начало в 18:00. Стоимость — 1200₽. Количество мест ограничено — до 15 человек. Запись обязательна!",
        image: "assets/images/event-tasting.jpg"
    }
];

// Сохраняем в localStorage
if (!localStorage.getItem('fjell_events')) {
    localStorage.setItem('fjell_events', JSON.stringify(eventsData));
}

// ========== КАЛЕНДАРЬ СОБЫТИЙ ==========
let currentCalendarDate = new Date();
let currentView = 'calendar';

function getEvents() {
    return JSON.parse(localStorage.getItem('fjell_events') || '[]');
}

function renderCalendar() {
    const container = document.getElementById('calendarDays');
    if (!container) return;
    
    const currentMonthSpan = document.getElementById('currentMonth');
    if (currentMonthSpan) {
        currentMonthSpan.textContent = currentCalendarDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    }
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    const daysInMonth = lastDay.getDate();
    
    const events = getEvents();
    const eventsByDate = {};
    events.forEach(event => {
        const eventDate = new Date(event.date);
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
            const dayKey = eventDate.getDate();
            if (!eventsByDate[dayKey]) eventsByDate[dayKey] = [];
            eventsByDate[dayKey].push(event);
        }
    });
    
    let html = '';
    for (let i = 0; i < startDay; i++) {
        html += `<div class="calendar-day other-month"></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const hasEvent = eventsByDate[day] && eventsByDate[day].length > 0;
        html += `<div class="calendar-day ${hasEvent ? 'event-day' : ''}" data-day="${day}" data-month="${month}" data-year="${year}">${day}</div>`;
    }
    container.innerHTML = html;
    
    document.querySelectorAll('.calendar-day.event-day').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            const day = parseInt(dayEl.dataset.day);
            const eventsOfDay = eventsByDate[day] || [];
            if (eventsOfDay.length > 0) {
                openEventModal(eventsOfDay[0].id);
            }
        });
    });
}

function renderEventsList() {
    const container = document.getElementById('eventsList');
    if (!container) return;
    
    const events = getEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureEvents = events.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (futureEvents.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:50px;">Нет предстоящих событий</div>';
        return;
    }
    
    container.innerHTML = futureEvents.map(event => `
        <div class="event-item" onclick="openEventModal(${event.id})">
            <div class="event-item-image" style="background-image: url('${event.image}'); background-size: cover; background-position: center;"></div>
            <div class="event-item-content">
                <h3 class="event-item-title">${escapeHtml(event.title)}</h3>
                <p class="event-item-date">${formatDate(event.date)} в ${event.time}</p>
                <p class="event-item-desc">${escapeHtml(event.description)}</p>
            </div>
        </div>
    `).join('');
}

function switchView(view) {
    currentView = view;
    const calendarView = document.getElementById('calendarView');
    const listView = document.getElementById('listView');
    const btns = document.querySelectorAll('.view-btn');
    
    btns.forEach(btn => {
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    if (view === 'calendar') {
        calendarView.style.display = 'block';
        listView.style.display = 'none';
        renderCalendar();
    } else {
        calendarView.style.display = 'none';
        listView.style.display = 'block';
        renderEventsList();
    }
}

function initCalendar() {
    const prev = document.getElementById('prevMonth');
    const next = document.getElementById('nextMonth');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    if (prev) {
        prev.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        });
    }
    if (next) {
        next.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        });
    }
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    renderCalendar();
}

window.openEventModal = function(eventId) {
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    if (!modal) return;
    
    document.getElementById('modalTitle').textContent = event.title;
    document.getElementById('modalDate').textContent = `${formatDate(event.date)} в ${event.time}`;
    const modalImg = document.getElementById('modalImage');
    if (modalImg) modalImg.src = event.image;
    document.getElementById('modalDescription').textContent = event.fullDescription || event.description;
    
    modal.classList.add('active');
    modal.dataset.currentEventId = eventId;
    
    // Обновляем кнопку избранного
    updateFavoriteButton(eventId);
    
    // Закрытие
    const closeBtn = modal.querySelector('.event-modal-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
    
    // Кнопка избранного
    const favBtn = document.getElementById('markFavoriteBtn');
    if (favBtn) {
        favBtn.onclick = () => {
            if (addToFavorites(eventId)) {
                updateFavoriteButton(eventId);
            }
        };
    }
};

// Запуск календаря на странице афиши
if (document.querySelector('.events-page')) {
    initCalendar();
}

// ========== ФИЛЬТРАЦИЯ МЕНЮ ==========
function initMenuFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length === 0) return;
    
    const menuItems = document.querySelectorAll('.menu-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ========== ВХОД/РЕГИСТРАЦИЯ ==========
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const users = JSON.parse(localStorage.getItem('fjell_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('fjell_currentUser', JSON.stringify(user));
                showMessage('loginMessage', 'Вход выполнен успешно!', true);
                setTimeout(() => {
                    if (user.isAdmin) {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'profile.html';
                    }
                }, 1000);
            } else {
                showMessage('loginMessage', 'Неверный email или пароль', false);
            }
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            
            if (!name || !email || !password) {
                showMessage('registerMessage', 'Заполните все обязательные поля', false);
                return;
            }
            if (password !== confirm) {
                showMessage('registerMessage', 'Пароли не совпадают', false);
                return;
            }
            if (password.length < 6) {
                showMessage('registerMessage', 'Пароль должен быть не менее 6 символов', false);
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('fjell_users') || '[]');
            if (users.some(u => u.email === email)) {
                showMessage('registerMessage', 'Пользователь с таким email уже существует', false);
                return;
            }
            
            const newUser = {
                id: users.length + 1,
                name: name,
                email: email,
                password: password,
                phone: phone,
                isAdmin: false
            };
            users.push(newUser);
            localStorage.setItem('fjell_users', JSON.stringify(users));
            localStorage.setItem('fjell_currentUser', JSON.stringify(newUser));
            showMessage('registerMessage', 'Регистрация успешна!', true);
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        });
    }
}

function initLogout() {
    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnMobile, #adminLogout');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.setItem('fjell_currentUser', JSON.stringify(null));
                window.location.href = 'index.html';
            });
        }
    });
}

// ========== ЛИЧНЫЙ КАБИНЕТ ==========
function getStatusText(status) {
    const statuses = { 'confirmed': 'Подтверждено', 'pending': 'Ожидает', 'cancelled': 'Отменено', 'completed': 'Выполнено' };
    return statuses[status] || status;
}

function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser || !currentUser.id) {
        window.location.href = 'login.html';
        return;
    }
    
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    
    if (profileName) profileName.value = currentUser.name || '';
    if (profileEmail) profileEmail.value = currentUser.email || '';
    if (profilePhone) profilePhone.value = currentUser.phone || '';
    
    const bookings = JSON.parse(localStorage.getItem('fjell_bookings') || '[]');
    const userBookings = bookings.filter(b => b.email === currentUser.email);
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookingsList) {
        if (userBookings.length === 0) {
            bookingsList.innerHTML = '<p>У вас пока нет бронирований</p>';
        } else {
            bookingsList.innerHTML = userBookings.map(b => `
                <div class="booking-card">
                    <h4>Бронирование от ${formatDate(b.date)}</h4>
                    <p>📅 ${formatDate(b.date)} в ${b.time}</p>
                    <p>👥 ${b.guests} гостей</p>
                    <p>📝 ${b.notes || 'без пожеланий'}</p>
                    <span class="booking-status status-${b.status}">${getStatusText(b.status)}</span>
                </div>
            `).join('');
        }
    }
}

function initProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
        if (!currentUser) return;
        
        const newName = document.getElementById('profileName').value;
        const newPhone = document.getElementById('profilePhone').value;
        
        const users = JSON.parse(localStorage.getItem('fjell_users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            users[userIndex].phone = newPhone;
            localStorage.setItem('fjell_users', JSON.stringify(users));
            localStorage.setItem('fjell_currentUser', JSON.stringify(users[userIndex]));
            showMessage('profileMessage', 'Профиль обновлён!', true);
        }
    });
}

function initProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabId = tab.dataset.tab;
            document.querySelectorAll('.profile-content').forEach(c => c.classList.remove('active'));
            const target = document.getElementById(`${tabId}Tab`);
            if (target) target.classList.add('active');
        });
    });
}

// ========== БРОНИРОВАНИЕ ==========
function initBookingForm() {
    // Внутри initBookingForm, после получения значений
const name = document.getElementById('bookingName').value;
const phone = document.getElementById('bookingPhone').value;
const email = document.getElementById('bookingEmail').value;
const guests = document.getElementById('bookingGuests').value;
const date = document.getElementById('bookingDate').value;
const time = document.getElementById('bookingTime').value;
const notes = document.getElementById('bookingNotes').value;

if (!name) {
    showMessage('bookingMessage', 'Введите имя', false);
    return;
}

if (!validatePhone(phone)) {
    showMessage('bookingMessage', 'Введите номер телефона в формате +7 (999) 123-45-67', false);
    return;
}

if (!date || !time) {
    showMessage('bookingMessage', 'Выберите дату и время', false);
    return;
}

// ========== ГАЛЕРЕЯ ==========
const galleryImages = [
    { id: 1, src: "assets/images/interior-1.jpg", category: "interior", title: "Основной зал с камином" },
    { id: 2, src: "assets/images/interior-2.jpg", category: "interior", title: "Веранда Fjell" },
    { id: 3, src: "assets/images/interior-3.jpg", category: "interior", title: "Скандинавский стиль" },
    { id: 4, src: "assets/images/dish-1.jpg", category: "dishes", title: "Гравлакс с соусом" },
    { id: 5, src: "assets/images/dish-2.jpg", category: "dishes", title: "Оленина с брусникой" },
    { id: 6, src: "assets/images/dish-3.jpg", category: "dishes", title: "Кладдкака с мороженым" },
    { id: 7, src: "assets/images/view-1.jpg", category: "view", title: "Вид на озеро" },
    { id: 8, src: "assets/images/view-2.jpg", category: "view", title: "Вид из окна" },
    { id: 9, src: "assets/images/view-3.jpg", category: "view", title: "Зимний пейзаж" }
];

let currentGalleryFilter = 'all';
let currentImageIndex = 0;

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    let filtered = galleryImages;
    if (currentGalleryFilter !== 'all') {
        filtered = galleryImages.filter(img => img.category === currentGalleryFilter);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center;">Фотографий в этой категории пока нет</p>';
        return;
    }
    
    grid.innerHTML = filtered.map((img, idx) => `
        <div class="gallery-item" data-index="${idx}">
            <img src="${img.src}" alt="${img.title}" onerror="this.src='https://placehold.co/400x300/2C2C2C/D97C4A?text=Fjell'">
            <div class="gallery-item-overlay">
                <p class="gallery-item-title">${img.title}</p>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            openGalleryModal(idx, currentGalleryFilter);
        });
    });
}

function openGalleryModal(index, filter) {
    let filtered = galleryImages;
    if (filter !== 'all') filtered = galleryImages.filter(img => img.category === filter);
    currentImageIndex = index;
    const image = filtered[index];
    
    const modal = document.getElementById('galleryModal');
    if (modal) {
        document.getElementById('modalImage').src = image.src;
        document.getElementById('modalCaption').textContent = image.title;
        modal.classList.add('active');
        modal.dataset.filter = filter;
    }
}

function changeGalleryImage(direction) {
    const modal = document.getElementById('galleryModal');
    const filter = modal?.dataset.filter || 'all';
    let filtered = galleryImages;
    if (filter !== 'all' && filter !== 'undefined') filtered = galleryImages.filter(img => img.category === filter);
    
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = filtered.length - 1;
    if (newIndex >= filtered.length) newIndex = 0;
    currentImageIndex = newIndex;
    
    const image = filtered[newIndex];
    document.getElementById('modalImage').src = image.src;
    document.getElementById('modalCaption').textContent = image.title;
}

function initGallery() {
    const btns = document.querySelectorAll('.gallery-filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGalleryFilter = btn.dataset.filter;
            renderGallery();
        });
    });
    renderGallery();
    
    const modal = document.getElementById('galleryModal');
    const close = document.querySelector('.gallery-modal-close');
    const prev = document.getElementById('modalPrev');
    const next = document.getElementById('modalNext');
    
    if (close) close.onclick = () => modal.classList.remove('active');
    if (prev) prev.onclick = () => changeGalleryImage(-1);
    if (next) next.onclick = () => changeGalleryImage(1);
    if (modal) modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
    document.addEventListener('keydown', (e) => {
        if (modal?.classList.contains('active')) {
            if (e.key === 'ArrowLeft') changeGalleryImage(-1);
            if (e.key === 'ArrowRight') changeGalleryImage(1);
            if (e.key === 'Escape') modal.classList.remove('active');
        }
    });
}

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен');
    initData();
    initBurgerMenu();
    loadLatestNews();        // ← ДОБАВИЛИ ЭТУ СТРОКУ
    loadEventsPreview();
    initMenuFilters();
    initAuthForms();
    initLogout();
    initBookingForm();
    loadUserFavorites();
    initPhoneMask();
    
    if (document.getElementById('profileName')) {
        loadProfile();
        initProfileForm();
        initProfileTabs();
    }
    
    if (document.querySelector('.gallery-section')) {
        initGallery();
    }
    
    if (document.querySelector('.admin-section')) {
        initAdminPanel();
    }
    
    if (document.querySelector('.news-section')) {
        renderNewsList();
    }
    function loadUserFavorites() {
    console.log('loadUserFavorites вызвана');
    
    const container = document.getElementById('favoritesList');
    if (!container) {
        console.log('Контейнер favoritesList не найден');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser) {
        console.log('Нет пользователя');
        container.innerHTML = '<div class="empty-favorites">Войдите в аккаунт</div>';
        return;
    }
    
    const favorites = JSON.parse(localStorage.getItem('fjell_favorites') || '{}');
    const favoriteIds = favorites[currentUser.email] || [];
    
    console.log('ID избранного:', favoriteIds);
    
    if (favoriteIds.length === 0) {
        container.innerHTML = '<div class="empty-favorites">⭐ У вас пока нет избранных событий</div>';
        return;
    }
    
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    const favoriteEvents = events.filter(e => favoriteIds.includes(e.id));
    
    console.log('Найдено событий:', favoriteEvents.length);
    
    if (favoriteEvents.length === 0) {
        container.innerHTML = '<div class="empty-favorites">⭐ Избранные события не найдены</div>';
        return;
    }
    
    container.innerHTML = favoriteEvents.map(event => `
        <div class="favorite-event-card" onclick="openEventModal(${event.id})">
            <div class="favorite-event-info">
                <h4>${event.title}</h4>
                <p>${formatDate(event.date)} в ${event.time}</p>
            </div>
            <button class="remove-favorite" onclick="event.stopPropagation(); removeFromFavorites(${event.id}); loadUserFavorites();">✖ Удалить</button>
        </div>
    `).join('');
}
    // ========== НОВОСТИ НА ГЛАВНОЙ СТРАНИЦЕ ==========
function loadLatestNews() {
    const newsGrid = document.getElementById('latestNewsGrid');
    if (!newsGrid) {
        console.log('Элемент latestNewsGrid не найден');
        return;
    }
    
    console.log('Загрузка новостей на главную...');
    
    const newsData = [
        {
            id: 1,
            title: "Новый шеф-повар из Норвегии",
            date: "2026-03-15",
            excerpt: "Ларс Хансен, известный норвежский шеф-повар, присоединился к нашей команде.",
            image: "assets/images/news-chef.jpg"
        },
        {
            id: 2,
            title: "Сезонное меню: весна 2026",
            date: "2026-03-01",
            excerpt: "Весеннее обновление меню! Теперь у нас появились блюда из первых весенних трав.",
            image: "assets/images/news-spring.jpg"
        },
        {
            id: 3,
            title: "Бронирование столов онлайн",
            date: "2026-02-20",
            excerpt: "Теперь бронировать стол стало проще! Заполните форму на сайте.",
            image: "assets/images/news-booking.jpg"
        }
    ];
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    newsGrid.innerHTML = newsData.map(news => `
        <div class="news-card" onclick="window.location.href='news.html'">
            <div class="news-image" style="background-image: url('${news.image}'); background-size: cover; background-position: center; height: 180px;"></div>
            <div class="news-content">
                <div class="news-date">${formatDate(news.date)}</div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <a href="news.html" class="news-link">Читать далее →</a>
            </div>
        </div>
    `).join('');
    
    console.log('Новости на главной загружены');
}
    // ========== ПРЕДПРОСМОТР СОБЫТИЙ НА ГЛАВНОЙ ==========
function loadEventsPreview() {
    const container = document.getElementById('eventsPreview');
    if (!container) {
        console.log('Контейнер eventsPreview не найден на этой странице');
        return;
    }
    
    console.log('Загрузка превью событий...');
    
    // Получаем события из localStorage
    let events = localStorage.getItem('fjell_events');
    let eventsArray = [];
    
    if (events) {
        eventsArray = JSON.parse(events);
    } else {
        // Создаём события по умолчанию
        eventsArray = [
            { id: 1, title: "Вечер скандинавской музыки", date: "2026-05-15", time: "19:00", description: "Концерт народной музыки", image: "assets/images/event-music.jpg" },
            { id: 2, title: "Сага о викингах", date: "2026-05-20", time: "20:00", description: "Вечер сказаний и мифов", image: "assets/images/event-saga.jpg" },
            { id: 3, title: "Дегустация северных настоек", date: "2026-05-25", time: "18:00", description: "Дегустация 5 видов настоек", image: "assets/images/event-tasting.jpg" }
        ];
        localStorage.setItem('fjell_events', JSON.stringify(eventsArray));
    }
    
    // Берём первые 3 события
    const upcomingEvents = eventsArray.slice(0, 3);
    
    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p>Событий пока нет</p>';
        return;
    }
    
    // Форматируем дату
    function formatEventDate(dateString) {
        const date = new Date(dateString);
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    }
    
    container.innerHTML = upcomingEvents.map(event => `
        <div class="event-preview-card" onclick="window.location.href='events.html'">
            <div class="event-preview-image" style="background-image: url('${event.image}'); background-size: cover; background-position: center;"></div>
            <div class="event-preview-content">
                <h4 class="event-preview-title">${event.title}</h4>
                <p class="event-preview-date">${formatEventDate(event.date)} в ${event.time}</p>
            </div>
        </div>
    `).join('');
    
    console.log('Превью событий загружено');
}
});
// ========== НОВОСТИ (ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ) ==========

const newsData = [
    {
        id: 1,
        title: "Новый шеф-повар из Норвегии",
        date: "2026-03-15",
        excerpt: "Ларс Хансен, известный норвежский шеф-повар, присоединился к нашей команде. Он привёз аутентичные рецепты из Бергена.",
        fullText: "Мы рады представить вам нового шеф-повара - Ларса Хансена, который привёз с собой аутентичные рецепты из Бергена. Ларс имеет 15-летний опыт работы в лучших ресторанах Норвегии, Дании и Швеции. Его фирменное блюдо - лосось, приготовленный по старинному рецепту викингов. Приходите познакомиться с новой кухней уже на этой неделе! Также Ларс проведёт серию мастер-классов, где поделится секретами приготовления скандинавских деликатесов.",
        image: "assets/images/news-chef.jpg"
    },
    {
        id: 2,
        title: "Сезонное меню: весна 2026",
        date: "2026-03-01",
        excerpt: "Весеннее обновление меню! Теперь у нас появились блюда из первых весенних трав и молодых овощей.",
        fullText: "Весеннее обновление меню! Теперь у нас появились блюда из первых весенних трав и молодых овощей. Особенно рекомендуем: ризотто с диким чесноком и спаржей (890 руб.), салат с молодыми листьями одуванчика (590 руб.) и лёгкий крем-суп из крапивы (450 руб.). Шеф-повар Ларс лично разработал каждое новое блюдо. Новое меню действует с 1 марта по 31 мая.",
        image: "assets/images/news-spring.jpg"
    },
    {
        id: 3,
        title: "Бронирование столов онлайн",
        date: "2026-02-20",
        excerpt: "Теперь бронировать стол стало проще! Заполните форму на сайте, и мы подтвердим ваше бронирование.",
        fullText: "Теперь вы можете забронировать стол через наш сайт. Просто заполните форму на странице Контактов, и мы подтвердим ваше бронирование в течение 15 минут. Система позволяет выбрать дату, время и количество гостей (от 1 до 10 человек), а также оставить особые пожелания. Для зарегистрированных пользователей доступна история бронирований и возможность отмены.",
        image: "assets/images/news-booking.jpg"
    },
    {
        id: 4,
        title: "Скидка именинникам 20%",
        date: "2026-02-10",
        excerpt: "Отпразднуйте день рождения в Fjell со скидкой 20%! Предъявите документ, удостоверяющий личность.",
        fullText: "В свой день рождения получите скидку 20% на весь счёт! Предъявите документ, удостоверяющий личность. Акция действует в день рождения и в течение трёх дней после. Не забудьте заранее забронировать стол - в праздничные дни мест особенно много! Также в подарок - десерт от шефа с праздничной свечой и фотосессия в нашем уютном интерьере.",
        image: "assets/images/news-birthday.jpg"
    },
    {
        id: 5,
        title: "Новое крафтовое пиво из Исландии",
        date: "2026-02-05",
        excerpt: "В баре появилось 5 новых сортов крафтового пива от исландских пивоварен.",
        fullText: "Мы расширили нашу барную карту! Теперь у вас есть возможность попробовать 5 новых сортов крафтового пива из Исландии: Einstök (лёгкий лагер, 390 руб.), Úlfur (IPA с нотами цитруса, 490 руб.), Gæðingur (стаут с кофе и шоколадом, 550 руб.), Surtur (тёмный эль, 520 руб.), Freyja (пшеничное, 470 руб.). Каждое пиво подаётся с рекомендацией закуски от шефа.",
        image: "assets/images/news-beer.jpg"
    }
];

// Форматирование даты
function formatNewsDate(dateString) {
    const date = new Date(dateString);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Отображение списка новостей
function renderNewsList() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    container.innerHTML = newsData.map(news => `
        <div class="news-card" onclick="openNewsDetail(${news.id})">
            <img class="news-card-image" src="${news.image}" alt="${news.title}" onerror="this.src='https://placehold.co/400x300/2C2C2C/D97C4A?text=Fjell'">
            <div class="news-card-content">
                <div class="news-card-date">${formatNewsDate(news.date)}</div>
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-excerpt">${news.excerpt}</p>
                <span class="news-card-link">Подробнее →</span>
            </div>
        </div>
    `).join('');
}

// Открытие модального окна с полным текстом
window.openNewsDetail = function(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    const modal = document.getElementById('newsDetailModal');
    if (!modal) return;
    
    document.getElementById('detailTitle').textContent = news.title;
    document.getElementById('detailDate').textContent = formatNewsDate(news.date);
    const detailImg = document.getElementById('detailImage');
    if (detailImg) {
        detailImg.src = news.image;
        detailImg.onerror = () => detailImg.src = 'https://placehold.co/600x400/2C2C2C/D97C4A?text=Fjell';
    }
    document.getElementById('detailContent').textContent = news.fullText;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Закрытие модального окна
window.closeNewsModal = function() {
    const modal = document.getElementById('newsDetailModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Закрытие по клику вне окна
document.addEventListener('click', function(e) {
    const modal = document.getElementById('newsDetailModal');
    if (modal && modal.classList.contains('active')) {
        if (e.target === modal) {
            closeNewsModal();
        }
    }
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNewsModal();
    }
});

// Запуск новостей на странице news.html
if (document.querySelector('.news-section')) {
    renderNewsList();
}
// ========== АДМИН-ПАНЕЛЬ ==========

function initAdminPanel() {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        alert('Доступ запрещён! Требуются права администратора.');
        window.location.href = 'index.html';
        return;
    }
    
    // Приветствие
    const welcomeMsg = document.querySelector('.admin-welcome p');
    if (welcomeMsg) {
        welcomeMsg.innerHTML = `Добро пожаловать, ${currentUser.name}! 👋`;
    }
    
    loadAdminMenu();
    loadAdminEvents();
    loadAdminNews();
    loadAdminUsers();
    loadAdminBookings();
    updateAdminStats();
    initAdminTabs();
}

function initAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`tab${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`).classList.add('active');
        });
    });
}

function loadAdminMenu() {
    const container = document.getElementById('adminMenuList');
    if (!container) return;
    
    const menuItems = [
        { name: "Гравлакс", price: 890, category: "Закуски" },
        { name: "Смёрброд с креветками", price: 750, category: "Закуски" },
        { name: "Оленина с брусничным соусом", price: 1850, category: "Горячее" },
        { name: "Лосось с соусом из укропа", price: 1450, category: "Горячее" },
        { name: "Кладдкака", price: 520, category: "Десерты" },
        { name: "Аквавит", price: 450, category: "Напитки" }
    ];
    
    container.innerHTML = menuItems.map(item => `
        <div class="admin-item">
            <div class="admin-item-info">
                <div class="admin-item-title">${item.name}</div>
                <div class="admin-item-meta">${item.category} • ${item.price} ₽</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" onclick="alert('Редактировать: ${item.name}')">✏️</button>
                <button class="admin-delete" onclick="alert('Удалить: ${item.name}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function loadAdminEvents() {
    const container = document.getElementById('adminEventsList');
    if (!container) return;
    
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-message">📭 Событий пока нет</div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="admin-item">
            <div class="admin-item-info">
                <div class="admin-item-title">${event.title}</div>
                <div class="admin-item-meta">${event.date} в ${event.time}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" onclick="alert('Редактировать: ${event.title}')">✏️</button>
                <button class="admin-delete" onclick="alert('Удалить: ${event.title}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function loadAdminNews() {
    const container = document.getElementById('adminNewsList');
    if (!container) return;
    
    const news = JSON.parse(localStorage.getItem('fjell_news') || '[]');
    
    if (news.length === 0) {
        container.innerHTML = '<div class="empty-message">📭 Новостей пока нет</div>';
        return;
    }
    
    container.innerHTML = news.map(item => `
        <div class="admin-item">
            <div class="admin-item-info">
                <div class="admin-item-title">${item.title}</div>
                <div class="admin-item-meta">${item.date}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" onclick="alert('Редактировать: ${item.title}')">✏️</button>
                <button class="admin-delete" onclick="alert('Удалить: ${item.title}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function loadAdminUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    
    const users = JSON.parse(localStorage.getItem('fjell_users') || '[]');
    const regularUsers = users.filter(u => !u.isAdmin);
    
    if (regularUsers.length === 0) {
        container.innerHTML = '<div class="empty-message">👥 Пользователей пока нет</div>';
        return;
    }
    
    container.innerHTML = regularUsers.map(user => `
        <div class="admin-item">
            <div class="admin-item-info">
                <div class="admin-item-title">${user.name}</div>
                <div class="admin-item-meta">${user.email} • ${user.phone || 'телефон не указан'}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-delete" onclick="alert('Заблокировать: ${user.name}')">🔒</button>
            </div>
        </div>
    `).join('');
}

function loadAdminBookings() {
    const container = document.getElementById('adminBookingsList');
    if (!container) return;
    
    const bookings = JSON.parse(localStorage.getItem('fjell_bookings') || '[]');
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="empty-message">📅 Бронирований пока нет</div>';
        return;
    }
    
    container.innerHTML = bookings.map(booking => `
        <div class="admin-item">
            <div class="admin-item-info">
                <div class="admin-item-title">${booking.name} • ${booking.guests} чел.</div>
                <div class="admin-item-meta">${booking.date} в ${booking.time} • ${booking.phone}</div>
                <div class="admin-item-meta" style="color: #f1c40f;">Статус: ${booking.status === 'pending' ? '⏳ Ожидает' : '✅ Подтверждено'}</div>
            </div>
            <div class="admin-item-actions">
                <select class="admin-status-select" data-id="${booking.id}">
                    <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Ожидает</option>
                    <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Подтвердить</option>
                    <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Выполнено</option>
                    <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Отменить</option>
                </select>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.admin-status-select').forEach(select => {
        select.addEventListener('change', function() {
            const bookingId = parseInt(this.dataset.id);
            const newStatus = this.value;
            let bookings = JSON.parse(localStorage.getItem('fjell_bookings') || '[]');
            bookings = bookings.map(b => {
                if (b.id === bookingId) return { ...b, status: newStatus };
                return b;
            });
            localStorage.setItem('fjell_bookings', JSON.stringify(bookings));
            loadAdminBookings();
            updateAdminStats();
        });
    });
}

function updateAdminStats() {
    const menuCount = 6;
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    const news = JSON.parse(localStorage.getItem('fjell_news') || '[]');
    const users = JSON.parse(localStorage.getItem('fjell_users') || '[]');
    const bookings = JSON.parse(localStorage.getItem('fjell_bookings') || '[]');
    
    document.getElementById('statMenu') && (document.getElementById('statMenu').textContent = menuCount);
    document.getElementById('statEvents') && (document.getElementById('statEvents').textContent = events.length);
    document.getElementById('statNews') && (document.getElementById('statNews').textContent = news.length);
    document.getElementById('statUsers') && (document.getElementById('statUsers').textContent = users.filter(u => !u.isAdmin).length);
    document.getElementById('statBookings') && (document.getElementById('statBookings').textContent = bookings.length);
}

// Запуск админки
if (document.querySelector('.admin-page')) {
    initAdminPanel();
}
// ========== ИЗБРАННЫЕ СОБЫТИЯ ==========

// Получить избранное текущего пользователя
function getUserFavorites() {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser) return [];
    
    const favorites = JSON.parse(localStorage.getItem('fjell_favorites') || '{}');
    return favorites[currentUser.email] || [];
}

// Сохранить избранное текущего пользователя
function saveUserFavorites(favorites) {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser) return;
    
    const allFavorites = JSON.parse(localStorage.getItem('fjell_favorites') || '{}');
    allFavorites[currentUser.email] = favorites;
    localStorage.setItem('fjell_favorites', JSON.stringify(allFavorites));
}

// Добавить событие в избранное
function addToFavorites(eventId) {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser) {
        showFavoriteMessage('Войдите в личный кабинет, чтобы добавлять в избранное', false);
        return false;
    }
    
    let favorites = getUserFavorites();
    if (!favorites.includes(eventId)) {
        favorites.push(eventId);
        saveUserFavorites(favorites);
        showFavoriteMessage('✓ Событие добавлено в избранное!', true);
        return true;
    } else {
        showFavoriteMessage('Это событие уже в избранном', false);
        return false;
    }
}

// Удалить событие из избранного
function removeFromFavorites(eventId) {
    let favorites = getUserFavorites();
    favorites = favorites.filter(id => id !== eventId);
    saveUserFavorites(favorites);
    showFavoriteMessage('Событие удалено из избранного', true);
    
    // Обновляем отображение в профиле
    if (document.querySelector('.profile-section')) {
        loadUserFavorites();
    }
}

// Проверить, в избранном ли событие
function isEventFavorite(eventId) {
    const favorites = getUserFavorites();
    return favorites.includes(eventId);
}

// Показать сообщение
function showFavoriteMessage(message, isSuccess) {
    const msgDiv = document.getElementById('favoriteMessage');
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = `favorite-message ${isSuccess ? 'success' : 'error'}`;
        setTimeout(() => {
            msgDiv.textContent = '';
            msgDiv.className = 'favorite-message';
        }, 3000);
    } else {
        alert(message);
    }
}

// Обновить кнопку избранного в модальном окне
function updateFavoriteButton(eventId) {
    const btn = document.getElementById('markFavoriteBtn');
    if (!btn) return;
    
    if (isEventFavorite(eventId)) {
        btn.innerHTML = '★ В избранном';
        btn.classList.add('active');
    } else {
        btn.innerHTML = '⭐ В избранное';
        btn.classList.remove('active');
    }
}
// ========== МАСКА ДЛЯ ТЕЛЕФОНА ==========

function phoneMask(input) {
    // Удаляем все не-цифры
    let value = input.value.replace(/\D/g, '');
    
    // Ограничиваем длину (11 цифр для российского номера)
    if (value.length > 11) value = value.slice(0, 11);
    
    // Применяем маску +7 (XXX) XXX-XX-XX
    let formattedValue = '';
    
    if (value.length > 0) {
        // Начинаем с +7
        formattedValue = '+7';
        
        if (value.length > 1) {
            // Код оператора (3 цифры)
            const code = value.slice(1, 4);
            formattedValue += ` (${code}`;
            
            if (value.length > 4) {
                // Первая часть номера (3 цифры)
                const firstPart = value.slice(4, 7);
                formattedValue += `) ${firstPart}`;
                
                if (value.length > 7) {
                    // Вторая часть (2 цифры)
                    const secondPart = value.slice(7, 9);
                    formattedValue += `-${secondPart}`;
                    
                    if (value.length > 9) {
                        // Третья часть (2 цифры)
                        const thirdPart = value.slice(9, 11);
                        formattedValue += `-${thirdPart}`;
                    }
                } else if (value.length > 4) {
                    formattedValue += `) ${firstPart}`;
                }
            } else {
                formattedValue += `)`;
            }
        }
    }
    
    input.value = formattedValue;
}

// Инициализация маски для телефона
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('#bookingPhone, #regPhone, #profilePhone');
    
    phoneInputs.forEach(input => {
        if (input) {
            // При вводе
            input.addEventListener('input', function(e) {
                phoneMask(this);
            });
            
            // При фокусе, если поле пустое - ставим +7
            input.addEventListener('focus', function() {
                if (this.value === '') {
                    this.value = '+7';
                }
            });
            
            // При потере фокуса, если остался только +7 - очищаем
            input.addEventListener('blur', function() {
                if (this.value === '+7') {
                    this.value = '';
                }
            });
        }
    });
}

// Валидация телефона перед отправкой
function validatePhone(phone) {
    // Проверяем, что телефон соответствует формату +7 (XXX) XXX-XX-XX
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
}
