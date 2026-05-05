import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Folder, 
  MoreVertical, 
  Calendar, 
  User as UserIcon,
  Filter,
  Search,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  Settings,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    tags: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (response.data.success) {
        setProjects(response.data.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      const response = await api.post('/projects', payload);
      if (response.data.success) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          description: '',
          status: 'planning',
          priority: 'medium',
          startDate: new Date().toISOString().split('T')[0],
          tags: ''
        });
        fetchProjects();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Projects</h1>
          <p className="text-brand-muted mt-1 font-medium">Manage and monitor all your active team projects.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl font-bold shadow-lg hover:bg-brand-muted transition-all transform active:scale-95"
          >
            <Plus size={20} />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Create Project Modal */}
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
                <h2 className="text-2xl font-bold text-brand-dark">New Project</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-brand-muted/10 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1.5">Project Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    placeholder="E.g., Q3 Marketing Campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all h-24"
                    placeholder="Project goals and details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-dark mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-1.5">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-white/50 border border-brand-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    placeholder="marketing, design, q3"
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
                    {formLoading ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50 p-4 rounded-2xl border border-brand-muted/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/80 border border-brand-muted/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-brand-muted/10 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted hover:text-brand-dark'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-muted hover:text-brand-dark'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <div className="h-8 w-[1px] bg-brand-muted/10 mx-2"></div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-muted hover:text-brand-dark transition-all">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="popLayout">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="glass-card group hover:shadow-xl transition-all rounded-2xl flex flex-col overflow-hidden"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                      <Folder size={24} />
                    </div>
                    <button className="p-2 rounded-lg hover:bg-brand-muted/10 text-brand-muted opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{project.name}</h3>
                  <p className="text-sm text-brand-muted mt-2 line-clamp-2 font-medium leading-relaxed">{project.description || 'No description provided.'}</p>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-brand-muted/10 text-brand-muted text-[10px] font-bold rounded-lg uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-brand-muted/5 border-t border-brand-muted/10 flex items-center justify-between mt-auto">
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((member, i) => (
                      <div key={member._id} className="w-8 h-8 rounded-full border-2 border-white bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white uppercase" title={member.name}>
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {project.members?.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-brand-muted text-xs font-bold">
                    <Calendar size={14} />
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-muted/5 border-b border-brand-muted/10">
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Members</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-muted/5">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-white/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
                          <Folder size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-all">{project.name}</p>
                          <p className="text-xs text-brand-muted truncate max-w-[200px]">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        project.status === 'active' ? 'bg-green-100 text-green-600' : 
                        project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-brand-muted'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                      {project.owner?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-1">
                        {project.members?.slice(0, 3).map(m => (
                          <div key={m._id} className="w-6 h-6 rounded-full border border-white bg-brand-primary flex items-center justify-center text-[8px] font-bold text-white uppercase">{m.name.charAt(0)}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-brand-muted">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-brand-muted/10 text-brand-muted group-hover:text-brand-dark transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-2 border-brand-muted/20">
          <div className="w-16 h-16 bg-brand-muted/10 text-brand-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-brand-dark">No projects found</h3>
          <p className="text-brand-muted mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
