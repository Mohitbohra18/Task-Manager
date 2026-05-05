import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  MoreVertical, 
  UserPlus,
  Trash2,
  Search,
  MessageSquare,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamData, setTeamData] = useState({ name: '', description: '' });
  const [inviteData, setInviteData] = useState({ email: '', role: 'member' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      if (response.data.success) {
        setTeams(response.data.data.teams);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.post('/teams', teamData);
      if (response.data.success) {
        setIsModalOpen(false);
        setTeamData({ name: '', description: '' });
        fetchTeams();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.post(`/teams/${selectedTeam._id}/members`, inviteData);
      if (response.data.success) {
        setIsInviteModalOpen(false);
        setInviteData({ email: '', role: 'member' });
        fetchTeams();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openInviteModal = (team) => {
    setSelectedTeam(team);
    setIsInviteModalOpen(true);
    setError('');
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-brand-dark">Teams</h1>
          <p className="text-brand-muted mt-1 font-medium">Connect and collaborate with your project teams.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl font-bold shadow-lg hover:bg-brand-muted transition-all transform active:scale-95"
          >
            <Plus size={20} />
            <span>Create Team</span>
          </button>
        )}
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">Create New Team</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-muted/10 rounded-xl transition-all">
                  <X size={20} className="text-brand-muted" />
                </button>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-5">
                {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">{error}</div>}
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase tracking-widest px-1">Team Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-brand-muted/20 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-medium"
                    placeholder="Enter team name"
                    value={teamData.name}
                    onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-muted uppercase tracking-widest px-1">Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-brand-muted/20 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-medium resize-none"
                    placeholder="What is this team for?"
                    value={teamData.description}
                    onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <span>Create Team</span>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Teams List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTeams.map((team, index) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-brand-muted/10 bg-white/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-dark text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-dark">{team.name}</h2>
                  <p className="text-xs text-brand-muted font-bold uppercase tracking-wider">{team.members?.length} Members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-brand-muted/10 text-brand-muted transition-all">
                  <MessageSquare size={20} />
                </button>
                <button className="p-2 rounded-xl hover:bg-brand-muted/10 text-brand-muted transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 space-y-4">
              <p className="text-sm text-brand-muted font-medium mb-6">{team.description || 'No description provided for this team.'}</p>
              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Team Members</h3>
                {team.members?.map((member) => (
                  <div key={member.user?._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-muted/5 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs uppercase">
                        {member.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-dark">{member.user?.name}</p>
                        <p className="text-[10px] text-brand-muted font-bold uppercase">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                        member.role === 'lead' ? 'bg-brand-dark text-white' : 'bg-brand-muted/10 text-brand-muted'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="p-4 bg-brand-muted/5 border-t border-brand-muted/10 flex justify-end">
                <button 
                  onClick={() => openInviteModal(team)}
                  className="flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-dark transition-all"
                >
                  <UserPlus size={16} />
                  <span>Invite Member</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {/* Invite Member Modal */}
        <AnimatePresence>
          {isInviteModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-dark">Invite Member</h2>
                    <p className="text-xs text-brand-muted font-bold uppercase tracking-wider mt-1">To {selectedTeam?.name}</p>
                  </div>
                  <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-brand-muted/10 rounded-xl transition-all">
                    <X size={20} className="text-brand-muted" />
                  </button>
                </div>

                <form onSubmit={handleInviteMember} className="space-y-5">
                  {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">{error}</div>}
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-widest px-1">Member Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={18} />
                      <input
                        required
                        type="email"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-muted/20 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-medium"
                        placeholder="user@example.com"
                        value={inviteData.email}
                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-widest px-1">Role</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-brand-muted/20 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-medium bg-white"
                      value={inviteData.role}
                      onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    >
                      <option value="member">Member</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <span>Send Invite</span>}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {filteredTeams.length === 0 && (
          <div className="lg:col-span-2 text-center py-20 glass-card rounded-2xl border-dashed border-2 border-brand-muted/20">
            <Users size={48} className="text-brand-muted opacity-20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-dark">No teams found</h3>
            <p className="text-brand-muted mt-2">Create a team to start collaborating.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
