// ==================== DATA & STATE ====================
let currentUser = null;
let tasks = [];
let currentEditId = null;
let currentView = 'home';

// ==================== AUTHENTICATION ====================
function showAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('hidden');
    
    let html = '';
    if (mode === 'login') {
        html = `
            <div class="modal bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <div class="p-8 text-center bg-blue-600">
                    <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-4">📋</div>
                    <h2 class="text-2xl font-bold text-white">Welcome Back</h2>
                    <p class="text-blue-100 mt-1">Sign in to continue to Tasker</p>
                </div>
                <div class="p-8 space-y-5">
                    <div id="auth-error" class="hidden p-3 rounded-xl bg-red-100 text-red-600 text-sm font-medium text-center"></div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input id="auth-email" type="email" placeholder="name@example.com" 
                               onkeyup="if(event.key==='Enter') handleLogin()"
                               class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <input id="auth-password" type="password" placeholder="••••••••" 
                               onkeyup="if(event.key==='Enter') handleLogin()"
                               class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all">
                    </div>
                    <button onclick="handleLogin()" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">Sign In</button>
                    <p class="text-center text-gray-600 dark:text-gray-400">
                        Don't have an account? <a href="#" onclick="showAuthModal('register')" class="text-blue-600 font-bold hover:underline">Create one</a>
                    </p>
                </div>
            </div>
        `;
    } else {
        html = `
            <div class="modal bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md mx-4 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <div class="p-8 text-center bg-purple-600">
                    <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-4">✨</div>
                    <h2 class="text-2xl font-bold text-white">Get Started</h2>
                    <p class="text-purple-100 mt-1">Create your free Tasker account</p>
                </div>
                <div class="p-8 space-y-4">
                    <div id="auth-error" class="hidden p-3 rounded-xl bg-red-100 text-red-600 text-sm font-medium text-center"></div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input id="reg-name" type="text" placeholder="Jessavie" 
                               onkeyup="if(event.key==='Enter') handleRegister()"
                               class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input id="reg-email" type="email" placeholder="name@example.com" 
                               onkeyup="if(event.key==='Enter') handleRegister()"
                               class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input id="reg-password" type="password" placeholder="••••••••" 
                               onkeyup="if(event.key==='Enter') handleRegister()"
                               class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all">
                    </div>
                    <button onclick="handleRegister()" class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">Create Account</button>
                    <p class="text-center text-gray-600 dark:text-gray-400">
                        Already have an account? <a href="#" onclick="showAuthModal('login')" class="text-purple-600 font-bold hover:underline">Sign in</a>
                    </p>
                </div>
            </div>
        `;
    }
    modal.innerHTML = html;
    
    // Auto-focus the first input field
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function showAuthError(msg) {
    const errorDiv = document.getElementById('auth-error');
    if (errorDiv) {
        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');
    }
}

function handleLogin() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) return showAuthError("Please fill in all fields");
    
    const users = JSON.parse(localStorage.getItem('tasker_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('tasker_session', JSON.stringify(user));
        document.getElementById('auth-modal').classList.add('hidden');
        loadData();
        navigateTo('home');
    } else {
        showAuthError("Invalid email or password");
    }
}

function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    
    if (!name || !email || !password) return showAuthError("Please fill in all fields");
    if (!email.includes('@')) return showAuthError("Please enter a valid email");
    if (password.length < 6) return showAuthError("Password must be at least 6 characters");
    
    const users = JSON.parse(localStorage.getItem('tasker_users') || '[]');
    if (users.some(u => u.email === email)) return showAuthError("Email already registered");
    
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('tasker_users', JSON.stringify(users));
    
    alert("Account created! Please sign in.");
    showAuthModal('login');
}

// ==================== LOCAL STORAGE ====================
function loadData() {
    const session = localStorage.getItem('tasker_session');
    if (!session) {
        showAuthModal('login');
        return;
    }
    
    document.getElementById('auth-modal').classList.add('hidden');
    currentUser = JSON.parse(session);
    document.getElementById('sidebar-name').textContent = currentUser.name;
    document.getElementById('sidebar-avatar').textContent = currentUser.name.charAt(0).toUpperCase();

    const savedTasks = localStorage.getItem(`tasker_tasks_${currentUser.email}`);
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        // Default tasks for new users
        tasks = [
            {
                id: 1,
                title: "Welcome to Tasker! 📋",
                desc: "This is your first task. Feel free to explore and add more!",
                dueDate: new Date().toISOString().split('T')[0],
                priority: "Medium",
                status: "Pending",
                category: "Personal",
                subtasks: []
            }
        ];
        saveData();
    }
    updateNotificationDot();
    navigateTo(currentView);
}

function saveData() {
    if (currentUser) {
        localStorage.setItem(`tasker_tasks_${currentUser.email}`, JSON.stringify(tasks));
    }
}

// ==================== RENDER FUNCTIONS ====================
function renderDashboard() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Calculate week range
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startStr = startOfWeek.toISOString().split('T')[0];
    const endStr = endOfWeek.toISOString().split('T')[0];

    const todayTasks = tasks.filter(t => t.dueDate === todayStr);
    const pending = tasks.filter(t => t.status !== "Completed").length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const thisWeekTasks = tasks.filter(t => t.dueDate >= startStr && t.dueDate <= endStr).length;

    let html = `
        <div class="max-w-7xl mx-auto">
            <h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Good morning, ${currentUser.name} 👋</h1>
            <p class="text-gray-600 dark:text-gray-300 mb-10 text-lg">Here's what's on your plate today</p>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div class="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Tasks</div>
                    <div class="text-5xl font-bold mt-2 text-gray-900 dark:text-white">${tasks.length}</div>
                </div>
                <div class="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending</div>
                    <div class="text-5xl font-bold mt-2 text-orange-500">${pending}</div>
                </div>
                <div class="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed</div>
                    <div class="text-5xl font-bold mt-2 text-emerald-500">${completed}</div>
                </div>
                <div class="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">This Week</div>
                    <div class="text-5xl font-bold mt-2 text-blue-500">${thisWeekTasks}</div>
                </div>
            </div>

            <div class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Today</h2>
                    <button onclick="navigateTo('tasks')" class="text-blue-600 text-sm font-semibold hover:text-blue-700">All tasks →</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="today-tasks">
                    ${todayTasks.length ? todayTasks.map(task => createTaskCard(task)).join('') : `
                        <div class="col-span-3 bg-white dark:bg-gray-900 rounded-3xl p-12 text-center text-gray-500 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-gray-800">
                            <p class="text-xl font-medium mb-2">No tasks due today</p>
                            <p class="text-base">Enjoy your day!</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function renderTasks() {
    let html = `
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
                <button onclick="showAddTaskModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-3xl flex items-center gap-2 font-medium transition-colors">
                    <i class="fa-solid fa-plus"></i> New Task
                </button>
            </div>
            <div class="space-y-3" id="task-list">
                ${tasks.map(task => `
                    <div class="bg-white dark:bg-gray-900 rounded-3xl p-4 md:p-6 flex gap-3 md:gap-6 items-center task-card shadow-sm border border-gray-100 dark:border-gray-800">
                        <input type="checkbox" ${task.status === 'Completed' ? 'checked' : ''} 
                               onchange="toggleComplete(${task.id})" class="w-5 h-5 md:w-6 md:h-6 accent-blue-600">
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-base md:text-lg truncate ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}">${task.title}</div>
                            <div class="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm mt-1 md:mt-2">
                                <span class="text-gray-600 dark:text-gray-400 flex items-center gap-1"><i class="fa-regular fa-calendar"></i>${task.dueDate}</span>
                                <span class="px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)} font-medium">${task.priority}</span>
                                <span class="text-gray-600 dark:text-gray-400 hidden sm:inline-flex items-center gap-1"><i class="fa-regular fa-tag"></i>${task.category}</span>
                            </div>
                        </div>
                        <div class="flex gap-1 md:gap-2">
                            <button onclick="editTask(${task.id}); event.stopImmediatePropagation()" class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl md:rounded-2xl transition-colors">
                                <i class="fa-solid fa-pen text-sm md:text-base"></i>
                            </button>
                            <button onclick="deleteTask(${task.id}); event.stopImmediatePropagation()" class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl md:rounded-2xl transition-colors">
                                <i class="fa-solid fa-trash text-sm md:text-base"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function renderCalendar() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthName = now.toLocaleString('default', { month: 'long' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = [];
    // Add empty slots for previous month
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const html = `
        <div class="max-w-5xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">${monthName} ${year}</h1>
                <div class="flex gap-2">
                    <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-3xl p-4 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
                <div class="min-w-[600px] grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-3xl overflow-hidden text-center">
                    ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="bg-white dark:bg-gray-900 py-3 md:py-4 font-semibold text-sm md:text-lg text-gray-700 dark:text-gray-300">${d}</div>`).join('')}
                    ${calendarDays.map((day, i) => {
                        if (day === null) return `<div class="bg-gray-50 dark:bg-gray-800/50 min-h-[80px] md:min-h-32 p-2"></div>`;
                        
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayTasks = tasks.filter(t => t.dueDate === dateStr);
                        
                        return `
                            <div class="bg-white dark:bg-gray-900 min-h-[80px] md:min-h-32 p-2 md:p-3 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer border-t border-gray-100 transition-colors">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="text-sm md:text-lg font-semibold ${day === now.getDate() ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-800 dark:text-white'}">${day}</span>
                                </div>
                                <div class="space-y-1">
                                    ${dayTasks.slice(0, 2).map(t => `
                                        <div class="text-[10px] md:text-xs truncate px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                                            ${t.title}
                                        </div>
                                    `).join('')}
                                    ${dayTasks.length > 2 ? `<div class="text-[10px] text-gray-400 font-medium">+${dayTasks.length - 2} more</div>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function renderReports() {
    const completed = tasks.filter(t => t.status === "Completed").length;
    const total = tasks.length;
    
    // Category data
    const cats = {};
    tasks.forEach(t => cats[t.category] = (cats[t.category] || 0) + 1);

    let html = `
        <div class="max-w-5xl mx-auto">
            <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Productivity Report</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 class="font-semibold text-xl mb-6 text-gray-900 dark:text-white">Completion Rate</h3>
                    <div class="relative h-[300px] flex items-center justify-center">
                        <canvas id="progressChart"></canvas>
                        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span class="text-4xl font-bold text-gray-900 dark:text-white">${total > 0 ? Math.round((completed/total)*100) : 0}%</span>
                            <span class="text-sm text-gray-500 font-medium">Done</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 class="font-semibold text-xl mb-6 text-gray-900 dark:text-white">Tasks by Category</h3>
                    <div class="space-y-4">
                        ${Object.keys(cats).length > 0 ? Object.keys(cats).map(cat => `
                            <div onclick="filterByCategory('${cat}')" class="group cursor-pointer">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">${cat}</span>
                                    <span class="text-sm text-gray-500">${cats[cat]} tasks</span>
                                </div>
                                <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style="width: ${(cats[cat]/total)*100}%"></div>
                                </div>
                            </div>
                        `).join('') : '<p class="text-gray-500 text-center py-10">No categories to display</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;

    if (total > 0) {
        setTimeout(() => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const textColor = isDarkMode ? '#9ca3af' : '#4b5563';

            new Chart(document.getElementById('progressChart'), {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Pending'],
                    datasets: [{ 
                        data: [completed, total - completed], 
                        backgroundColor: ['#10b981', '#f59e0b'],
                        hoverOffset: 4,
                        borderWidth: 0
                    }]
                },
                options: { 
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                color: textColor,
                                font: { size: 14, weight: '600' }
                            }
                        }
                    }
                }
            });
        }, 100);
    }
}

function renderProfile() {
    const html = `
        <div class="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <div class="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mx-auto flex items-center justify-center text-6xl mb-6">👩‍💼</div>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input id="profile-name" type="text" value="${currentUser.name}" class="w-full text-center text-2xl font-bold bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input id="profile-email" type="email" value="${currentUser.email}" class="w-full text-center text-lg bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300">
                </div>
            </div>
            <div class="mt-10 space-y-4">
                <button onclick="updateProfile()" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-semibold transition-colors">Update Profile</button>
                <button onclick="logout()" class="w-full py-4 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-3xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">Logout</button>
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function updateProfile() {
    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    
    if (name && email) {
        const oldEmail = currentUser.email;
        currentUser.name = name;
        currentUser.email = email;
        
        // Update session
        localStorage.setItem('tasker_session', JSON.stringify(currentUser));
        
        // Update users list
        const users = JSON.parse(localStorage.getItem('tasker_users') || '[]');
        const userIndex = users.findIndex(u => u.email === oldEmail);
        if (userIndex !== -1) {
            users[userIndex].name = name;
            users[userIndex].email = email;
            localStorage.setItem('tasker_users', JSON.stringify(users));
        }

        // If email changed, move tasks
        if (oldEmail !== email) {
            const savedTasks = localStorage.getItem(`tasker_tasks_${oldEmail}`);
            if (savedTasks) {
                localStorage.setItem(`tasker_tasks_${email}`, savedTasks);
                localStorage.removeItem(`tasker_tasks_${oldEmail}`);
            }
        }
        
        // Update sidebar and other UI elements
        document.getElementById('sidebar-name').textContent = name;
        document.getElementById('sidebar-avatar').textContent = name.charAt(0).toUpperCase();
        
        alert("Profile updated successfully!");
        navigateTo('profile');
    }
}

// ==================== NAVIGATION ====================
function renderAbout() {
    const html = `
        <div class="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">About My Daily Tasker</h1>
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
                My Daily Tasker is a simple, elegant task management application designed to help you organize your daily activities.
            </p>
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Features include:
            </p>
            <ul class="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 mb-6 space-y-3">
                <li>Create, edit, and delete tasks</li>
                <li>Set priorities and categories</li>
                <li>Track task completion</li>
                <li>View productivity reports</li>
            </ul>
            <p class="text-gray-500 dark:text-gray-400 text-base">Made with ❤️ for Jessavie</p>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function renderContact() {
    const html = `
        <div class="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Contact Us</h1>
            <div class="space-y-6">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center text-blue-600">
                        <i class="fa-solid fa-envelope text-2xl"></i>
                    </div>
                    <div>
                        <div class="font-semibold text-lg text-gray-900 dark:text-white">Email</div>
                        <div class="text-gray-600 dark:text-gray-400 text-base">jessaviesanoy@gmail.com</div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center text-blue-600">
                        <i class="fa-solid fa-phone text-2xl"></i>
                    </div>
                    <div>
                        <div class="font-semibold text-lg text-gray-900 dark:text-white">Phone</div>
                        <div class="text-gray-600 dark:text-gray-400 text-base">09468811866</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function navigateTo(page) {
    currentView = page;
    
    // Update Sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('nav-active'));
    const activeLink = document.getElementById(`nav-${page}`);
    if (activeLink) activeLink.classList.add('nav-active');

    // Update Mobile Nav
    document.querySelectorAll('[id^="mobile-nav-"]').forEach(link => {
        link.classList.remove('mobile-nav-active');
        link.classList.add('text-gray-500', 'dark:text-gray-400');
    });
    const activeMobileLink = document.getElementById(`mobile-nav-${page}`);
    if (activeMobileLink) {
        activeMobileLink.classList.add('mobile-nav-active');
        activeMobileLink.classList.remove('text-gray-500', 'dark:text-gray-400');
    }

    if (page === 'home') renderDashboard();
    else if (page === 'tasks') renderTasks();
    else if (page === 'calendar') renderCalendar();
    else if (page === 'reports') renderReports();
    else if (page === 'profile') renderProfile();
    else if (page === 'about') renderAbout();
    else if (page === 'contact') renderContact();
}

// ==================== TASK MODAL ====================
function showAddTaskModal() {
    currentEditId = null;
    const modalHTML = `
        <div class="modal bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg mx-4 shadow-2xl border border-gray-100 dark:border-gray-800">
            <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">New Task</h2>
                <button onclick="closeModal()" class="text-4xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">×</button>
            </div>
            <div class="p-6 space-y-6">
                <input id="task-title" type="text" placeholder="Task title" class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <textarea id="task-desc" rows="3" placeholder="Description" class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Due Date</label>
                        <input id="task-due" type="date" class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Priority</label>
                        <select id="task-priority" class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="High">High</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Category</label>
                        <select id="task-category" class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="School">School</option>
                            <option value="Health">Health</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Status</label>
                        <select id="task-status" class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
                
                <textarea id="task-subtasks" rows="4" placeholder="Subtasks (one per line)" class="w-full border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div class="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                <button onclick="closeModal()" class="flex-1 py-4 border border-gray-300 dark:border-gray-700 rounded-3xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button onclick="saveTask()" class="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-semibold transition-colors">Save Task</button>
            </div>
        </div>
    `;
    document.getElementById('task-modal').innerHTML = modalHTML;
    document.getElementById('task-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('task-modal').classList.add('hidden');
}

function saveTask() {
    const title = document.getElementById('task-title').value.trim();
    if (!title) return alert("Task title is required!");

    const subtasks = document.getElementById('task-subtasks').value
        .split('\n')
        .map(s => s.trim())
        .filter(s => s);

    if (currentEditId) {
        const task = tasks.find(t => t.id === currentEditId);
        if (task) {
            Object.assign(task, {
                title,
                desc: document.getElementById('task-desc').value,
                dueDate: document.getElementById('task-due').value,
                priority: document.getElementById('task-priority').value,
                category: document.getElementById('task-category').value,
                status: document.getElementById('task-status').value,
                subtasks
            });
        }
    } else {
        tasks.push({
            id: Date.now(),
            title,
            desc: document.getElementById('task-desc').value,
            dueDate: document.getElementById('task-due').value || '2026-05-10',
            priority: document.getElementById('task-priority').value,
            status: document.getElementById('task-status').value,
            category: document.getElementById('task-category').value,
            subtasks
        });
    }

    saveData();
    updateNotificationDot();
    closeModal();
    navigateTo(currentView);
}

// ==================== TASK OPERATIONS ====================
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditId = id;
    showAddTaskModal();

    setTimeout(() => {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.desc || '';
        document.getElementById('task-due').value = task.dueDate;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-category').value = task.category;
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-subtasks').value = task.subtasks ? task.subtasks.join('\n') : '';
    }, 100);
}

function deleteTask(id) {
    if (confirm("Delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveData();
        updateNotificationDot();
        navigateTo(currentView);
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === "Completed" ? "Pending" : "Completed";
        saveData();
        updateNotificationDot();
        navigateTo(currentView);
    }
}

// ==================== UTILITIES ====================
function getPriorityColor(prio) {
    if (prio === 'High') return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    if (prio === 'Medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
}

function createTaskCard(task) {
    return `
        <div onclick="editTask(${task.id})" class="task-card bg-white dark:bg-gray-900 rounded-3xl p-6 cursor-pointer shadow-sm border border-gray-100 dark:border-gray-800">
            <div class="flex justify-between items-start">
                <div class="font-semibold text-xl text-gray-900 dark:text-white">${task.title}</div>
                <span class="text-xs px-3 py-1 ${getPriorityColor(task.priority)} rounded-3xl font-medium">${task.priority}</span>
            </div>
            ${task.desc ? `<p class="text-base text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">${task.desc}</p>` : ''}
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
                <i class="fa-regular fa-calendar mr-1"></i>${task.dueDate} • <i class="fa-regular fa-tag mr-1"></i>${task.category}
            </div>
        </div>
    `;
}

function renderCategoryList() {
    const cats = {};
    tasks.forEach(t => cats[t.category] = (cats[t.category] || 0) + 1);

    let html = '';
    Object.keys(cats).forEach(cat => {
        html += `
            <div onclick="filterByCategory('${cat}')" class="flex justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer">
                <span>${cat}</span>
                <span class="text-xs bg-gray-200 dark:bg-gray-700 px-2.5 rounded-full">${cats[cat]}</span>
            </div>`;
    });
    document.getElementById('category-list').innerHTML = html;
}

function filterByCategory(cat) {
    const filtered = tasks.filter(t => t.category === cat);
    
    let html = `
        <div class="max-w-6xl mx-auto">
            <div class="flex items-center gap-4 mb-8">
                <button onclick="navigateTo('tasks')" class="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">${cat} Tasks</h1>
            </div>
            <div class="space-y-3" id="task-list">
                ${filtered.length ? filtered.map(task => `
                    <div class="bg-white dark:bg-gray-900 rounded-3xl p-4 md:p-6 flex gap-3 md:gap-6 items-center task-card shadow-sm border border-gray-100 dark:border-gray-800">
                        <input type="checkbox" ${task.status === 'Completed' ? 'checked' : ''} 
                               onchange="toggleComplete(${task.id})" class="w-5 h-5 md:w-6 md:h-6 accent-blue-600">
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-base md:text-lg truncate ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}">${task.title}</div>
                            <div class="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm mt-1 md:mt-2">
                                <span class="text-gray-600 dark:text-gray-400 flex items-center gap-1"><i class="fa-regular fa-calendar"></i>${task.dueDate}</span>
                                <span class="px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)} font-medium">${task.priority}</span>
                            </div>
                        </div>
                        <div class="flex gap-1 md:gap-2">
                            <button onclick="editTask(${task.id}); event.stopImmediatePropagation()" class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl md:rounded-2xl transition-colors">
                                <i class="fa-solid fa-pen text-sm md:text-base"></i>
                            </button>
                            <button onclick="deleteTask(${task.id}); event.stopImmediatePropagation()" class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-xl md:rounded-2xl transition-colors">
                                <i class="fa-solid fa-trash text-sm md:text-base"></i>
                            </button>
                        </div>
                    </div>
                `).join('') : `<p class="text-center text-gray-500 py-10">No tasks in this category yet.</p>`}
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function searchTasks() {
    const term = document.getElementById('search-input').value.toLowerCase().trim();
    if (!term) return navigateTo(currentView);

    const filtered = tasks.filter(t => 
        t.title.toLowerCase().includes(term) || 
        (t.desc && t.desc.toLowerCase().includes(term))
    );

    let html = `
        <div class="max-w-6xl mx-auto">
            <h1 class="text-2xl font-semibold mb-6">Results for "${term}"</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filtered.length ? filtered.map(t => createTaskCard(t)).join('') : `<p class="text-gray-400">No tasks found.</p>`}
            </div>
        </div>
    `;
    document.getElementById('main-content').innerHTML = html;
}

function toggleNotifications() {
    let panel = document.getElementById('notification-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'notification-panel';
        panel.className = 'fixed top-16 right-8 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl z-50 hidden overflow-hidden';
        document.body.appendChild(panel);
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const dueToday = tasks.filter(t => t.dueDate === today && t.status !== 'Completed');
    const dueTomorrow = tasks.filter(t => t.dueDate === tomorrow && t.status !== 'Completed');
    const overdue = tasks.filter(t => t.dueDate < today && t.status !== 'Completed');

    panel.classList.toggle('hidden');
    
    let html = `
        <div class="p-4 border-b border-gray-100 dark:border-gray-800 font-bold text-gray-900 dark:text-white flex justify-between items-center">
            <span>Notifications</span>
            <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">${dueToday.length + dueTomorrow.length + overdue.length}</span>
        </div>
        <div class="max-h-96 overflow-y-auto">
    `;

    if (overdue.length > 0) {
        html += overdue.map(t => `
            <div class="p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <div class="text-xs text-red-500 font-bold mb-1">⚠️ OVERDUE</div>
                <div class="text-sm font-semibold text-gray-900 dark:text-white">${t.title}</div>
                <div class="text-xs text-gray-500 mt-1">Was due on ${t.dueDate}</div>
            </div>
        `).join('');
    }

    if (dueToday.length > 0) {
        html += dueToday.map(t => `
            <div class="p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <div class="text-xs text-orange-500 font-bold mb-1">📅 DUE TODAY</div>
                <div class="text-sm font-semibold text-gray-900 dark:text-white">${t.title}</div>
            </div>
        `).join('');
    }

    if (dueTomorrow.length > 0) {
        html += dueTomorrow.map(t => `
            <div class="p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <div class="text-xs text-blue-500 font-bold mb-1">⏳ DUE TOMORROW</div>
                <div class="text-sm font-semibold text-gray-900 dark:text-white">${t.title}</div>
            </div>
        `).join('');
    }

    if (overdue.length === 0 && dueToday.length === 0 && dueTomorrow.length === 0) {
        html += `<div class="p-8 text-center text-gray-500 text-sm">All caught up! No urgent notifications.</div>`;
    }

    html += `</div>`;
    panel.innerHTML = html;

    // Close when clicking outside
    const closePanel = (e) => {
        if (!panel.contains(e.target) && !e.target.closest('button[onclick="toggleNotifications()"]')) {
            panel.classList.add('hidden');
            document.removeEventListener('click', closePanel);
        }
    };
    if (!panel.classList.contains('hidden')) {
        setTimeout(() => document.addEventListener('click', closePanel), 10);
    }
}

function updateNotificationDot() {
    const today = new Date().toISOString().split('T')[0];
    const overdueOrDue = tasks.some(t => t.dueDate <= today && t.status !== 'Completed');
    const dot = document.getElementById('notif-dot');
    if (dot) {
        if (overdueOrDue) dot.classList.remove('hidden');
        else dot.classList.add('hidden');
    }
}

// ==================== AUTH & INIT ====================
function initTheme() {
    const savedTheme = localStorage.getItem('tasker_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon(false);
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('tasker_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
    
    // Re-render current view to update components like charts if needed
    if (currentView === 'reports') {
        renderReports();
    }
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun text-xl' : 'fa-solid fa-moon text-xl';
    }
}

function logout() {
    if (confirm("Logout from My Daily Tasker?")) {
        localStorage.removeItem('tasker_session');
        window.location.reload();
    }
}

window.onload = function() {
    initTheme();
    loadData();
    updateNotificationDot();
    
    // Global functions
    window.navigateTo = navigateTo;
    window.showAddTaskModal = showAddTaskModal;
    window.closeModal = closeModal;
    window.saveTask = saveTask;
    window.editTask = editTask;
    window.deleteTask = deleteTask;
    window.toggleComplete = toggleComplete;
    window.searchTasks = searchTasks;
    window.toggleNotifications = toggleNotifications;
    window.logout = logout;
    window.filterByCategory = filterByCategory;
    window.updateProfile = updateProfile;
    window.showAuthModal = showAuthModal;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.toggleTheme = toggleTheme;
};