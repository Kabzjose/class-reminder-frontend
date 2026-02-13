import { useEffect, useState } from "react";
import ClassForm from "./components/ClassForm";
import Timetable from "./components/Timetable";
import Login from "./components/Login";
import Register from "./components/Register";
import { getClasses, saveClass, deleteClass, updateClass } from "./utils/storage";
import { requestNotificationPermission } from "./utils/notification";
import { startReminderEngine } from "./utils/reminderEngine";

function App() {
  const [classes, setClasses] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState("All");
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      loadClasses();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          startReminderEngine();
        }
      });
    }
  }, [isAuthenticated]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const classesData = await getClasses();
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (error) {
      console.error('Failed to load classes:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    loadClasses();
  };

  const handleRegister = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowRegister(false);
    loadClasses();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setClasses([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleSave = async (classData) => {
    try {
      await saveClass(classData);
      await loadClasses();
    } catch (error) {
      alert('Failed to save class: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClass(id);
        await loadClasses();
      } catch (error) {
        alert('Failed to delete class: ' + error.message);
      }
    }
  };

  const handleEdit = (classData) => {
    setEditingClass(classData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (updatedClass) => {
    try {
      await updateClass(updatedClass);
      await loadClasses();
      setEditingClass(null);
    } catch (error) {
      alert('Failed to update class: ' + error.message);
    }
  };

  // Initial loading state
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          {/* Dark mode toggle for auth pages */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {showRegister ? (
            <Register 
              onRegister={handleRegister}
              onSwitchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <Login 
              onLogin={handleLogin}
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    );
  }

  // Loading classes state
  if (loading) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 text-lg">Loading your classes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filtering logic
  const filteredClasses = Array.isArray(classes) ? classes.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = filterDay === "All" || c.days.includes(filterDay);
    return matchesSearch && matchesDay;
  }) : [];

  // Next Class + Countdown Logic
  const getTodayName = () => new Date().toLocaleDateString("en-US", { weekday: "long" });
  
  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const now = new Date();
  const today = getTodayName();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const upcomingClasses = classes
    .filter((c) => c.days && c.days.includes(today))
    .map((c) => ({
      ...c,
      startMinutes: timeToMinutes(c.startTime),
    }))
    .filter((c) => c.startMinutes > currentMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const nextClass = upcomingClasses[0] || null;
  let countdown = null;

  if (nextClass) {
    const diff = nextClass.startMinutes - currentMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    countdown = `${hours}h ${minutes}m`;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        
        {/* Enhanced Navbar */}
        <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo & Title */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Class Reminder
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Stay organized, never miss a class</p>
                </div>
              </div>
              
              {/* User Info & Actions */}
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Classes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Classes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{classes.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Today's Classes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Classes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {classes.filter(c => c.days && c.days.includes(today)).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Today</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {upcomingClasses.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Next Class Card */}
          {nextClass ? (
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-grid-white/10"></div>
              </div>
              
              <div className="relative p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wider">
                        Up Next
                      </span>
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                      {nextClass.name}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 text-white/90">
                      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{nextClass.startTime} – {nextClass.endTime}</span>
                      </div>
                      {nextClass.venue && (
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">{nextClass.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-xl">
                    <p className="text-xs uppercase font-bold text-white/80 text-center mb-2">Starts In</p>
                    <p className="text-5xl font-mono font-bold text-white text-center drop-shadow-lg">
                      {countdown}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-lg border border-green-200 dark:border-gray-600 text-center">
              <div className="flex flex-col items-center space-y-3">
                <svg className="w-16 h-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">All Done for Today!</h3>
                <p className="text-gray-600 dark:text-gray-300">No more classes scheduled. Time to relax!</p>
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingClass ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
                <span>{editingClass ? "Edit Class" : "Add New Class"}</span>
              </h3>
            </div>
            <div className="p-6">
              <ClassForm
                onSave={handleSave}
                onUpdate={handleUpdate}
                editingClass={editingClass}
              />
            </div>
          </div>

          {/* Search & Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by class name..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 cursor-pointer font-medium"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
              >
                <option value="All">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
          </div>

          {/* Timetable */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Weekly Schedule</span>
              </h3>
            </div>
            <Timetable
              classes={filteredClasses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

        </div>

        {/* Footer */}
        <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2025 Class Reminder. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;