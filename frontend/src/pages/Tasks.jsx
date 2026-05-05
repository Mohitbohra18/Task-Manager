import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Calendar,
  User as UserIcon,
  Tag,
  Filter,
  Search,
  CheckCircle,
  X,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/tasks' : '/tasks/my-tasks';
      const response = await api.get(endpoint);
      if (response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (response.data.success) {
        setProjects(response.data.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.project) return alert('Please select a project');
    setFormLoading(true);
    try {
      const response = await api.post('/tasks', formData);
      if (response.data.success) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          project: '',
          priority: 'medium',
          dueDate: '',
          status: 'todo'
        });
        fetchTasks();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      if (response.data.success) {
        setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Todo', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'In Review', value: 'in-review' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Tasks</h1>
          <p className="text-brand-muted mt-1 font-medium">
            {user?.role === 'admin' ? 'Monitor and assign tasks across all projects.' : 'Manage your assigned tasks and update progress.'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl font-bold shadow-lg hover:bg-brand-muted transition-all transform active:scale-95"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">New Task</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-brand-muted/10 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1.5">Task Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    placeholder="E.g., Design System Update"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-dark mb-1.5">Project</label>
                    <select
                      required
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-dark mb-1.5">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1.5">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all h-24"
                    placeholder="Task details..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-brand-muted/10 hover:bg-brand-muted/20 text-brand-dark font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 py-3 px-4 bg-brand-primary hover:bg-brand-muted text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 transform active:scale-95 transition-all disabled:opacity-50"
                  >
                    {formLoading ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white/50 p-4 rounded-2xl border border-brand-muted/10">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/80 border border-brand-muted/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === s.value 
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' 
                  : 'bg-brand-muted/10 text-brand-muted hover:bg-brand-muted/20'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card group p-5 rounded-2xl border border-brand-muted/5 hover:border-brand-primary/30 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <button 
                    onClick={() => handleStatusUpdate(task._id, task.status === 'completed' ? 'todo' : 'completed')}
                    className={`mt-1 p-1 rounded-lg border-2 transition-all ${
                      task.status === 'completed' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-brand-muted/30 text-transparent hover:border-brand-primary group-hover:text-brand-primary/20'
                    }`}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <div className="min-w-0">
                    <h3 className={`font-bold text-brand-dark transition-all ${task.status === 'completed' ? 'line-through text-brand-muted' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted font-bold">
                        <Folder size={14} className="text-brand-primary" />
                        <span>{task.project?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted font-bold">
                        <Calendar size={14} />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted font-bold">
                        <UserIcon size={14} />
                        <span>{task.assignee?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-10 md:ml-0">
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {task.priority}
                  </div>
                  <div className="h-8 w-[1px] bg-brand-muted/10 hidden md:block"></div>
                  <select 
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                    className="bg-brand-muted/5 border-none text-xs font-bold text-brand-dark focus:ring-0 rounded-lg py-1 px-2 cursor-pointer hover:bg-brand-muted/10 transition-all"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button className="p-2 rounded-lg hover:bg-brand-muted/10 text-brand-muted opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-20 glass-card rounded-2xl border-dashed border-2 border-brand-muted/20">
            <CheckCircle2 size={48} className="text-brand-muted opacity-20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-dark">No tasks found</h3>
            <p className="text-brand-muted mt-2">Try different filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
