import React, { useState, useEffect } from 'react';
import { getProfessorDashboard, deleteResource } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Eye, ThumbsUp, Plus, Trash2, ExternalLink, Loader2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfessorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await getProfessorDashboard();
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await deleteResource(resourceId);
      toast.success('Resource deleted');
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to delete resource');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--accent)' }}><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Professor Dashboard</h1>
          <p style={{ opacity: 0.6 }}>Welcome back, {user?.name}. Manage your contributions here.</p>
        </div>
        <Link to="/upload" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Plus size={20} /> New Resource
        </Link>
      </div>

      {/* Analytics Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '16px' }}>
             <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{data?.stats?.total_uploads}</div>
            <div style={{ opacity: 0.5, fontSize: '0.9rem', fontWeight: 600 }}>Total Lessons</div>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '1rem', background: 'rgba(34,197,94,0.1)', color: '#22C55E', borderRadius: '16px' }}>
             <Eye size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{data?.stats?.total_views}</div>
            <div style={{ opacity: 0.5, fontSize: '0.9rem', fontWeight: 600 }}>Total Views</div>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', borderRadius: '16px' }}>
             <ThumbsUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{data?.stats?.total_likes}</div>
            <div style={{ opacity: 0.5, fontSize: '0.9rem', fontWeight: 600 }}>Student Likes</div>
          </div>
        </div>
      </div>

      {/* Content Management */}
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BookOpen size={24} color="var(--accent)" /> Your Resources
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: 0.5, fontSize: '0.85rem' }}>
                <th style={{ padding: '1rem' }}>Resource Name</th>
                <th style={{ padding: '1rem' }}>Module</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Engagement</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentResources?.map(resource => (
                <tr key={resource.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.95rem' }}>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 700 }}>{resource.title}</td>
                  <td style={{ padding: '1.5rem 1rem', opacity: 0.7 }}>{resource.module_name}</td>
                  <td style={{ padding: '1.5rem 1rem' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {resource.type}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', opacity: 0.6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {resource.views}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                       <button 
                        onClick={() => navigate(`/module/${resource.module_id}`)}
                        style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none' }}
                       >
                        <ExternalLink size={18} />
                       </button>
                       <button 
                        onClick={() => handleDelete(resource.id)}
                        style={{ color: '#EF4444', cursor: 'pointer', background: 'none', border: 'none' }}
                       >
                        <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.recentResources?.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', opacity: 0.4 }}>
                    You haven't uploaded any resources yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfessorDashboard;
