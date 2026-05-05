import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  User,
  Loader2,
  Folder,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ projects: [], tasks: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const response = await api.get(`/search?query=${searchQuery}`);
          if (response.data.success) {
            setSearchResults(response.data.data);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Notifications Logic (Mocking some based on tasks)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/dashboard');
        if (response.data.success) {
          const overdue = response.data.data.overdueTasks || [];
          const notices = overdue.map(t => ({
            id: t._id,
            title: 'Task Overdue!',
            message: `"${t.title}" was due on ${new Date(t.dueDate).toLocaleDateString()}`,
            type: 'alert'
          }));
          setNotifications(notices);
          setUnreadCount(notices.length);
        }
      } catch (error) {
        console.error('Notification error:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Teams', path: '/teams', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-brand-light font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg">
              <CheckSquare size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskMaster</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                      : 'text-brand-primary/60 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-semibold">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile Summary */}
          <div className="p-4 mt-auto">
            <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center font-bold text-white uppercase shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-xs text-brand-primary/60 truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-brand-primary/60 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-brand-muted/10 flex items-center justify-between px-4 lg:px-8 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-brand-muted/10 text-brand-dark lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative flex-1 hidden md:block">
              <div className="flex items-center gap-2 bg-brand-muted/5 border border-brand-muted/10 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                <Search size={18} className="text-brand-muted" />
                <input 
                  type="text" 
                  placeholder="Search projects or tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSearchResults(true)}
                  className="bg-transparent border-none focus:outline-none text-sm w-full"
                />
                {isSearching && <Loader2 size={16} className="animate-spin text-brand-primary" />}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl shadow-2xl p-4 z-[60] max-h-[400px] overflow-y-auto"
                  >
                    {searchResults.projects.length === 0 && searchResults.tasks.length === 0 ? (
                      <p className="text-center py-4 text-sm text-brand-muted font-bold">No results found for "{searchQuery}"</p>
                    ) : (
                      <div className="space-y-4">
                        {searchResults.projects.length > 0 && (
                          <div>
                            <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2 px-2">Projects</h3>
                            {searchResults.projects.map(p => (
                              <button 
                                key={p._id}
                                onClick={() => { navigate('/projects'); setShowSearchResults(false); }}
                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-brand-muted/10 text-left transition-all"
                              >
                                <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                                  <Folder size={16} />
                                </div>
                                <span className="text-sm font-bold text-brand-dark">{p.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {searchResults.tasks.length > 0 && (
                          <div>
                            <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2 px-2">Tasks</h3>
                            {searchResults.tasks.map(t => (
                              <button 
                                key={t._id}
                                onClick={() => { navigate('/tasks'); setShowSearchResults(false); }}
                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-brand-muted/10 text-left transition-all"
                              >
                                <div className="w-8 h-8 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center">
                                  <CheckSquare size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-brand-dark">{t.title}</p>
                                  <p className="text-[10px] text-brand-muted font-medium uppercase">{t.project?.name}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowSearchResults(false); }}
                className={`p-2 rounded-xl transition-all ${showNotifications ? 'bg-brand-primary text-white' : 'hover:bg-brand-muted/10 text-brand-muted'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl p-4 z-[60]"
                  >
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h3 className="text-sm font-bold text-brand-dark">Notifications</h3>
                      <button onClick={() => setUnreadCount(0)} className="text-[10px] font-bold text-brand-primary hover:underline">Mark all as read</button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-center py-8 text-xs text-brand-muted font-medium">No new notifications</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-3 rounded-xl bg-red-50/50 border border-red-100/50 flex gap-3">
                            <div className="mt-1 text-red-500"><AlertTriangle size={16} /></div>
                            <div>
                              <p className="text-xs font-bold text-brand-dark">{n.title}</p>
                              <p className="text-[10px] text-brand-muted font-medium mt-1">{n.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-[1px] bg-brand-muted/10 hidden md:block"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-brand-muted/5 p-1 rounded-xl transition-all">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-brand-dark leading-none">{user?.name}</p>
                <p className="text-xs text-brand-muted font-medium mt-1">Lead Developer</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-muted/20 flex items-center justify-center overflow-hidden">
                <User size={20} className="text-brand-dark" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
