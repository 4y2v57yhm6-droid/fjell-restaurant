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
            { id: 1, title: "Вечер скандинавской музыки", date: "2026-05-15", time: "19:00", description: "Концерт народной музыки", image: "assets/images/event-music.jpg", fullDescription: "Полное описание события..." },
            { id: 2, title: "Сага о викингах", date: "2026-05-20", time: "20:00", description: "Вечер сказаний", image: "assets/images/event-saga.jpg", fullDescription: "Полное описание события..." },
            { id: 3, title: "Дегустация северных настоек", date: "2026-05-25", time: "18:00", description: "Дегустация 5 видов", image: "assets/images/event-tasting.jpg", fullDescription: "Полное описание события..." }
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

// ========== БУРГЕР-МЕНЮ ==========
function initBurgerMenu() {
    const burgerIcon = document.getElementById('burgerIcon');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    if (burgerIcon && mobileMenu) {
        burgerIcon.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.add('active');
            document.body.classList.add('menu-open');
        });
    }
    
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && !burgerIcon.contains(e.target)) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
}

// ========== НОВОСТИ НА ГЛАВНОЙ ==========
function loadLatestNews() {
    const newsGrid = document.getElementById('latestNewsGrid');
    if (!newsGrid) return;
    
    const newsArray = [
        { id: 1, title: "Новый шеф-повар из Норвегии", date: "2026-03-15", excerpt: "Ларс Хансен присоединился к нашей команде!", image: "assets/images/news-chef.jpg" },
        { id: 2, title: "Сезонное меню: весна 2026", date: "2026-03-01", excerpt: "Весеннее обновление меню!", image: "assets/images/news-spring.jpg" },
        { id: 3, title: "Бронирование столов онлайн", date: "2026-02-20", excerpt: "Теперь бронировать стало проще!", image: "assets/images/news-booking.jpg" }
    ];
    
    newsGrid.innerHTML = newsArray.map(news => `
        <div class="news-card" onclick="window.location.href='news.html'">
            <div class="news-image" style="background-image: url('${news.image}'); background-size: cover; height: 180px;"></div>
            <div class="news-content">
                <div class="news-date">${formatDate(news.date)}</div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <a href="news.html" class="news-link">Читать далее →</a>
            </div>
        </div>
    `).join('');
}

// ========== ПРЕДПРОСМОТР СОБЫТИЙ ==========
function loadEventsPreview() {
    const container = document.getElementById('eventsPreview');
    if (!container) return;
    
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    const upcomingEvents = events.slice(0, 3);
    
    container.innerHTML = upcomingEvents.map(event => `
        <div class="event-preview-card" onclick="window.location.href='events.html'">
            <div class="event-preview-image" style="background-image: url('${event.image}'); background-size: cover; height: 160px;"></div>
            <div class="event-preview-content">
                <h4 class="event-preview-title">${event.title}</h4>
                <p class="event-preview-date">${formatDate(event.date)} в ${event.time}</p>
            </div>
        </div>
    `).join('');
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
                    if (user.isAdmin) window.location.href = 'admin.html';
                    else window.location.href = 'profile.html';
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
                phone: phone || '',
                isAdmin: false
            };
            users.push(newUser);
            localStorage.setItem('fjell_users', JSON.stringify(users));
            localStorage.setItem('fjell_currentUser', JSON.stringify(newUser));
            showMessage('registerMessage', 'Регистрация успешна!', true);
            setTimeout(() => window.location.href = 'profile.html', 1000);
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
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (currentUser && currentUser.id && !currentUser.isAdmin) {
        const nameInput = document.getElementById('bookingName');
        const phoneInput = document.getElementById('bookingPhone');
        const emailInput = document.getElementById('bookingEmail');
        if (nameInput) nameInput.value = currentUser.name || '';
        if (phoneInput) phoneInput.value = currentUser.phone || '';
        if (emailInput) emailInput.value = currentUser.email || '';
    }
    
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('bookingName').value;
        const phone = document.getElementById('bookingPhone').value;
        const email = document.getElementById('bookingEmail').value;
        const guests = document.getElementById('bookingGuests').value;
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const notes = document.getElementById('bookingNotes').value;
        
        if (!name || !phone || !date || !time) {
            showMessage('bookingMessage', 'Заполните все обязательные поля', false);
            return;
        }
        
        const bookings = JSON.parse(localStorage.getItem('fjell_bookings') || '[]');
        const newBooking = {
            id: bookings.length + 1,
            name: name,
            phone: phone,
            email: email || '',
            guests: parseInt(guests),
            date: date,
            time: time,
            notes: notes,
            status: 'pending'
        };
        bookings.push(newBooking);
        localStorage.setItem('fjell_bookings', JSON.stringify(bookings));
        showMessage('bookingMessage', 'Бронирование отправлено!', true);
        form.reset();
        if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
    });
}

// ========== НОВОСТИ (СТРАНИЦА) ==========
const allNews = [
    { id: 1, title: "Новый шеф-повар из Норвегии", date: "2026-03-15", excerpt: "Ларс Хансен присоединился к нашей команде!", fullText: "Мы рады представить вам нового шеф-повара - Ларса Хансена, который привёз с собой аутентичные рецепты из Бергена. Ларс имеет 15-летний опыт работы...", image: "assets/images/news-chef.jpg" },
    { id: 2, title: "Сезонное меню: весна 2026", date: "2026-03-01", excerpt: "Весеннее обновление меню!", fullText: "Весеннее обновление меню! Теперь у нас появились блюда из первых весенних трав и молодых овощей...", image: "assets/images/news-spring.jpg" },
    { id: 3, title: "Бронирование столов онлайн", date: "2026-02-20", excerpt: "Теперь бронировать стало проще!", fullText: "Теперь вы можете забронировать стол через наш сайт. Просто заполните форму...", image: "assets/images/news-booking.jpg" },
    { id: 4, title: "Скидка именинникам 20%", date: "2026-02-10", excerpt: "Отпразднуйте день рождения в Fjell со скидкой 20%!", fullText: "В свой день рождения получите скидку 20% на весь счёт!", image: "assets/images/news-birthday.jpg" },
    { id: 5, title: "Новое крафтовое пиво из Исландии", date: "2026-02-05", excerpt: "В баре появилось 5 новых сортов!", fullText: "Мы расширили нашу барную карту! Теперь у вас есть возможность попробовать 5 новых сортов...", image: "assets/images/news-beer.jpg" }
];

function renderNewsList() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    container.innerHTML = allNews.map(news => `
        <div class="news-card" onclick="openNewsModal(${news.id})">
            <img class="news-card-image" src="${news.image}" alt="${news.title}" onerror="this.src='https://placehold.co/400x300/2C2C2C/D97C4A?text=Fjell'">
            <div class="news-card-content">
                <div class="news-card-date">${formatDate(news.date)}</div>
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-excerpt">${news.excerpt}</p>
                <span class="news-card-link">Подробнее →</span>
            </div>
        </div>
    `).join('');
}

window.openNewsModal = function(newsId) {
    const news = allNews.find(n => n.id === newsId);
    if (!news) return;
    
    const modal = document.getElementById('newsDetailModal');
    if (modal) {
        document.getElementById('detailTitle').textContent = news.title;
        document.getElementById('detailDate').textContent = formatDate(news.date);
        document.getElementById('detailImage').src = news.image;
        document.getElementById('detailContent').textContent = news.fullText;
        modal.classList.add('active');
    }
};

window.closeNewsModal = function() {
    const modal = document.getElementById('newsDetailModal');
    if (modal) modal.classList.remove('active');
};

// ========== АДМИН-ПАНЕЛЬ ==========
function initAdminPanel() {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        alert('Доступ запрещён!');
        window.location.href = 'index.html';
        return;
    }
    console.log('Админ-панель загружена');
}

// ========== ИЗБРАННЫЕ СОБЫТИЯ ==========
function getUserFavorites() {
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    if (!currentUser) return [];
    const favorites = JSON.parse(localStorage.getItem('fjell_favorites') || '{}');
    return favorites[currentUser.email] || [];
}

function loadUserFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    const favorites = getUserFavorites();
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    const favoriteEvents = events.filter(e => favorites.includes(e.id));
    
    if (favoriteEvents.length === 0) {
        container.innerHTML = '<div class="empty-favorites">⭐ У вас пока нет избранных событий</div>';
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

function removeFromFavorites(eventId) {
    let favorites = getUserFavorites();
    favorites = favorites.filter(id => id !== eventId);
    const currentUser = JSON.parse(localStorage.getItem('fjell_currentUser'));
    const allFavorites = JSON.parse(localStorage.getItem('fjell_favorites') || '{}');
    allFavorites[currentUser.email] = favorites;
    localStorage.setItem('fjell_favorites', JSON.stringify(allFavorites));
    loadUserFavorites();
}

// ========== ЗАПУСК ==========
    initCalendar();      // ← ДОБАВИТЬ для афиши
    initGallery();       // ← ДОБАВИТЬ для галереи
    
    if (document.getElementById('profileName')) {
        loadProfile();
        initProfileForm();
        initProfileTabs();
        loadUserFavorites();
    }
    
    if (document.querySelector('.news-section')) {
        renderNewsList();
    }
    
    if (document.querySelector('.admin-section')) {
        initAdminPanel();
    }
});
    // ========== КАЛЕНДАРЬ СОБЫТИЙ (АФИША) ==========

let currentCalendarDate = new Date();

function getEvents() {
    return JSON.parse(localStorage.getItem('fjell_events') || '[]');
}

function renderCalendar() {
    const container = document.getElementById('calendarDays');
    if (!container) return;
    
    const monthSpan = document.getElementById('currentMonth');
    if (monthSpan) {
        monthSpan.textContent = currentCalendarDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
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
        html += `<div class="calendar-day ${hasEvent ? 'event-day' : ''}" data-day="${day}">${day}</div>`;
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
            <div class="event-item-image" style="background-image: url('${event.image}');"></div>
            <div class="event-item-content">
                <h3 class="event-item-title">${event.title}</h3>
                <p class="event-item-date">${formatDate(event.date)} в ${event.time}</p>
                <p class="event-item-desc">${event.description}</p>
            </div>
        </div>
    `).join('');
}

function switchView(view) {
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
        if (calendarView) calendarView.style.display = 'block';
        if (listView) listView.style.display = 'none';
        renderCalendar();
    } else {
        if (calendarView) calendarView.style.display = 'none';
        if (listView) listView.style.display = 'block';
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
    const events = getEvents();
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
    
    const closeBtn = modal.querySelector('.event-modal-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
    
    const favBtn = document.getElementById('markFavoriteBtn');
    if (favBtn) {
        favBtn.onclick = () => {
            addToFavorites(event.id);
            alert('Событие добавлено в избранное!');
        };
    }
};

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
    if (filter !== 'all' && filter !== 'undefined') {
        filtered = galleryImages.filter(img => img.category === filter);
    }
    
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
});
