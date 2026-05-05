import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  BarChart3, 
  Calendar,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const overview = stats?.overview || {};

  const statCards = [
    { label: 'Total Projects', value: overview.totalProjects || 0, icon: BarChart3, color: 'bg-blue-500' },
    { label: 'Active Tasks', value: overview.pendingTasks || 0, icon: Clock, color: 'bg-brand-primary' },
    { label: 'Completed', value: overview.completedTasks || 0, icon: CheckCircle2, color: 'bg-green-500' },
    { label: 'Total Tasks', value: overview.totalTasks || 0, icon: ChevronRight, color: 'bg-brand-dark' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Dashboard Overview</h1>
          <p className="text-brand-muted mt-1 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl font-bold shadow-lg shadow-brand-dark/20 hover:bg-brand-muted transition-all transform active:scale-95">
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform`} />
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted uppercase tracking-wider">{card.label}</p>
                <h3 className="text-2xl font-bold text-brand-dark mt-1">{card.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-dark">Recent Tasks</h2>
            <button className="text-sm font-bold text-brand-primary hover:text-brand-dark transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {stats?.recentTasks?.length > 0 ? (
              stats.recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-4 rounded-xl border border-brand-muted/10 hover:bg-white/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{task.title}</p>
                      <p className="text-xs text-brand-muted font-medium mt-1">{task.project?.name} • Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-brand-muted font-medium">No recent tasks found.</p>
            )}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="glass-card rounded-2xl p-6 border-l-4 border-red-500/50">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-red-500" size={24} />
            <h2 className="text-xl font-bold text-brand-dark">Urgent / Overdue</h2>
          </div>
          <div className="space-y-4">
            {stats?.overdueTasks?.length > 0 ? (
              stats.overdueTasks.map((task) => (
                <div key={task._id} className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex flex-col gap-2">
                  <p className="font-bold text-brand-dark text-sm">{task.title}</p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-red-600 uppercase tracking-tight">
                    <span>{task.project?.name}</span>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <CheckCircle2 size={48} className="text-green-500 opacity-20" />
                <p className="text-brand-muted font-bold text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
