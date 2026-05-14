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

// ========== МАСКА ДЛЯ ТЕЛЕФОНА ==========
function phoneMask(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formattedValue = '';
    if (value.length > 0) {
        formattedValue = '+7';
        if (value.length > 1) {
            const code = value.slice(1, 4);
            formattedValue += ` (${code}`;
            if (value.length > 4) {
                const firstPart = value.slice(4, 7);
                formattedValue += `) ${firstPart}`;
                if (value.length > 7) {
                    const secondPart = value.slice(7, 9);
                    formattedValue += `-${secondPart}`;
                    if (value.length > 9) {
                        const thirdPart = value.slice(9, 11);
                        formattedValue += `-${thirdPart}`;
                    }
                }
            } else {
                formattedValue += `)`;
            }
        }
    }
    input.value = formattedValue;
}

function validatePhone(phone) {
    if (!phone || phone === '') return true;
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
}

function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('#bookingPhone, #regPhone, #profilePhone');
    phoneInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() { phoneMask(this); });
            input.addEventListener('focus', function() { if (this.value === '') this.value = '+7'; });
            input.addEventListener('blur', function() { if (this.value === '+7') this.value = ''; });
        }
    });
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
            { id: 1, title: "Вечер скандинавской музыки", date: "2026-05-15", time: "19:00", description: "Концерт народной музыки", fullDescription: "Полное описание события...", image: "assets/images/event-music.jpg" },
            { id: 2, title: "Сага о викингах", date: "2026-05-20", time: "20:00", description: "Вечер сказаний", fullDescription: "Полное описание события...", image: "assets/images/event-saga.jpg" },
            { id: 3, title: "Дегустация северных настоек", date: "2026-05-25", time: "18:00", description: "Дегустация 5 видов", fullDescription: "Полное описание события...", image: "assets/images/event-tasting.jpg" }
        ];
        localStorage.setItem('fjell_events', JSON.stringify(defaultEvents));
    }
    
    let news = localStorage.getItem('fjell_news');
    if (!news) {
        const defaultNews = [
            { id: 1, title: "Новый шеф-повар из Норвегии", date: "2026-03-15", excerpt: "Ларс Хансен присоединился к нашей команде!", fullText: "Полный текст новости...", image: "assets/images/news-chef.jpg", onMain: true },
            { id: 2, title: "Сезонное меню: весна 2026", date: "2026-03-01", excerpt: "Весеннее обновление меню!", fullText: "Полный текст новости...", image: "assets/images/news-spring.jpg", onMain: true },
            { id: 3, title: "Бронирование столов онлайн", date: "2026-02-20", excerpt: "Теперь бронировать стало проще!", fullText: "Полный текст новости...", image: "assets/images/news-booking.jpg", onMain: true }
        ];
        localStorage.setItem('fjell_news', JSON.stringify(defaultNews));
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
    
    const news = JSON.parse(localStorage.getItem('fjell_news') || '[]');
    const latestNews = news.filter(n => n.onMain).slice(0, 3);
    
    if (latestNews.length === 0) {
        newsGrid.innerHTML = '<p>Новостей пока нет</p>';
        return;
    }
    
    newsGrid.innerHTML = latestNews.map(item => `
        <div class="news-card" onclick="window.location.href='news.html'">
            <div class="news-image" style="background-image: url('${item.image}'); background-size: cover; height: 180px;"></div>
            <div class="news-content">
                <div class="news-date">${formatDate(item.date)}</div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-excerpt">${item.excerpt}</p>
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
    
    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p>Событий пока нет</p>';
        return;
    }
    
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
            if (phone && phone !== '+7' && !validatePhone(phone)) {
                showMessage('registerMessage', 'Введите номер в формате +7 (999) 123-45-67', false);
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
                    <p>📞 ${b.phone}</p>
                    <p>📝 ${b.notes || 'без пожеланий'}</p>
                    <span class="booking-status status-${b.status}">${getStatusText(b.status)}</span>
                    ${b.status === 'pending' ? `<button class="cancel-booking" data-id="${b.id}">Отменить бронь</button>` : ''}
                </div>
            `).join('');
            
            document.querySelectorAll('.cancel-booking').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    if (confirm('Отменить бронирование?')) {
                        let bookings = JSON.parse(localStorage.getItem('fjell_bookings') || '[]');
                        bookings = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
                        localStorage.setItem('fjell_bookings', JSON.stringify(bookings));
                        loadProfile();
                    }
                });
            });
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
        
        if (newPhone && !validatePhone(newPhone)) {
            showMessage('profileMessage', 'Введите номер в формате +7 (999) 123-45-67', false);
            return;
        }
        
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
        
        if (!name) {
            showMessage('bookingMessage', 'Введите имя', false);
            return;
        }
        if (!validatePhone(phone)) {
            showMessage('bookingMessage', 'Введите номер в формате +7 (999) 123-45-67', false);
            return;
        }
        if (!date || !time) {
            showMessage('bookingMessage', 'Выберите дату и время', false);
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
function renderNewsList() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    const news = JSON.parse(localStorage.getItem('fjell_news') || '[]');
    
    if (news.length === 0) {
        container.innerHTML = '<p>Новостей пока нет</p>';
        return;
    }
    
    container.innerHTML = news.map(item => `
        <div class="news-card" onclick="openNewsModal(${item.id})">
            <img class="news-card-image" src="${item.image}" alt="${item.title}" onerror="this.src='https://placehold.co/400x300/2C2C2C/D97C4A'">
            <div class="news-card-content">
                <div class="news-card-date">${formatDate(item.date)}</div>
                <h3 class="news-card-title">${item.title}</h3>
                <p class="news-card-excerpt">${item.excerpt}</p>
                <span class="news-card-link">Подробнее →</span>
            </div>
        </div>
    `).join('');
}

window.openNewsModal = function(newsId) {
    const news = JSON.parse(localStorage.getItem('fjell_news') || '[]');
    const item = news.find(n => n.id === newsId);
    if (!item) return;
    
    const modal = document.getElementById('newsDetailModal');
    if (modal) {
        document.getElementById('detailTitle').textContent = item.title;
        document.getElementById('detailDate').textContent = formatDate(item.date);
        document.getElementById('detailImage').src = item.image;
        document.getElementById('detailContent').textContent = item.fullText || item.excerpt;
        modal.classList.add('active');
    }
};

window.closeNewsModal = function() {
    const modal = document.getElementById('newsDetailModal');
    if (modal) modal.classList.remove('active');
};

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('newsDetailModal');
        if (modal) modal.classList.remove('active');
        const galleryModal = document.getElementById('galleryModal');
        if (galleryModal) galleryModal.classList.remove('active');
        const eventModal = document.getElementById('eventModal');
        if (eventModal) eventModal.classList.remove('active');
    }
});

// ========== ГАЛЕРЕЯ ==========
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    const images = [
        { src: "assets/images/interior-1.jpg", category: "interior", title: "Основной зал с камином" },
        { src: "assets/images/interior-2.jpg", category: "interior", title: "Веранда Fjell" },
        { src: "assets/images/interior-3.jpg", category: "interior", title: "Скандинавский стиль" },
        { src: "assets/images/dish-1.jpg", category: "dishes", title: "Гравлакс" },
        { src: "assets/images/dish-2.jpg", category: "dishes", title: "Оленина" },
        { src: "assets/images/dish-3.jpg", category: "dishes", title: "Кладдкака" },
        { src: "assets/images/view-1.jpg", category: "view", title: "Вид на озеро" },
        { src: "assets/images/view-2.jpg", category: "view", title: "Вид из окна" },
        { src: "assets/images/view-3.jpg", category: "view", title: "Зимний пейзаж" }
    ];
    
    let currentFilter = 'all';
    
    function render() {
        let filtered = images;
        if (currentFilter !== 'all') {
            filtered = images.filter(img => img.category === currentFilter);
        }
        
        if (filtered.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align:center;">Фотографий нет</p>';
            return;
        }
        
        galleryGrid.innerHTML = filtered.map(img => `
            <div class="gallery-item" onclick="openGalleryImage('${img.src}', '${img.title}')">
                <img src="${img.src}" alt="${img.title}" onerror="this.src='https://placehold.co/400x300/2C2C2C/D97C4A'">
                <div class="gallery-item-overlay">
                    <p class="gallery-item-title">${img.title}</p>
                </div>
            </div>
        `).join('');
    }
    
    window.openGalleryImage = function(src, title) {
        const modal = document.getElementById('galleryModal');
        if (modal) {
            document.getElementById('modalImage').src = src;
            document.getElementById('modalCaption').textContent = title;
            modal.classList.add('active');
        }
    };
    
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });
    
    render();
    
    const modal = document.getElementById('galleryModal');
    const close = document.querySelector('.gallery-modal-close');
    if (close) close.onclick = () => modal.classList.remove('active');
    if (modal) modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
}

// ========== АФИША ==========
function initEvents() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    const daysInMonth = lastDay.getDate();
    
    let html = '';
    for (let i = 0; i < startDay; i++) {
        html += `<div class="calendar-day other-month"></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const hasEvent = events.some(e => new Date(e.date).getDate() === day);
        html += `<div class="calendar-day ${hasEvent ? 'event-day' : ''}">${day}</div>`;
    }
    calendarDays.innerHTML = html;
    
    // Список событий
    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const futureEvents = events.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (futureEvents.length === 0) {
            eventsList.innerHTML = '<p>Нет предстоящих событий</p>';
            return;
        }
        
        eventsList.innerHTML = futureEvents.map(e => `
            <div class="event-item" onclick="openEventModal(${e.id})">
                <div class="event-item-image" style="background-image: url('${e.image}');"></div>
                <div class="event-item-content">
                    <h3>${e.title}</h3>
                    <p>${formatDate(e.date)} в ${e.time}</p>
                    <p>${e.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Переключение между календарем и списком
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            document.getElementById('calendarView').style.display = view === 'calendar' ? 'block' : 'none';
            document.getElementById('listView').style.display = view === 'list' ? 'block' : 'none';
        });
    });
}

window.openEventModal = function(eventId) {
    const events = JSON.parse(localStorage.getItem('fjell_events') || '[]');
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    if (modal) {
        document.getElementById('modalTitle').textContent = event.title;
        document.getElementById('modalDate').textContent = `${formatDate(event.date)} в ${event.time}`;
        document.getElementById('modalImage').src = event.image;
        document.getElementById('modalDescription').textContent = event.fullDescription || event.description;
        modal.classList.add('active');
        
        const closeBtn = modal.querySelector('.event-modal-close');
        if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
    }
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
function loadUserFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    container.innerHTML = '<div class="empty-favorites">⭐ У вас пока нет избранных событий</div>';
}

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен');
    initData();
    initBurgerMenu();
    loadLatestNews();
    loadEventsPreview();
    initMenuFilters();
    initAuthForms();
    initLogout();
    initBookingForm();
    initPhoneMasks();
    initGallery();
    initEvents();
    
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
