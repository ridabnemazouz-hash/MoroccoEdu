import React, { useState, useEffect } from 'react';
import { getTrendingResources } from '../services/api';
import { TrendingUp, FileText, Eye, ThumbsUp, Loader2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Trending = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      setLoading(true);
      const res = await getTrendingResources(20, 0); // top 20
      if (res.success) {
        setResources(res.data);
      }
    } catch (err) {
      toast.error('Failed to load trending resources');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index) => {
    if (index === 0) return '#FCD34D'; // Gold
    if (index === 1) return '#94A3B8'; // Silver
    if (index === 2) return '#B45309'; // Bronze
    return 'var(--accent)';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', marginBottom: '1.5rem' }}>
          <TrendingUp size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Trending Resources</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          The most popular and highly-rated study materials across all Moroccan universities.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <Loader2 className="animate-spin" size={40} color="var(--accent)" />
        </div>
      ) : resources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-2)', borderRadius: '20px' }}>
          <p style={{ color: 'var(--text-2)' }}>No trending resources found yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/module/${resource.module_id}`)}
                className="glass"
                style={{ 
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.border = '1px solid var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
                }}
              >
                {/* Ranking Number */}
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: index < 3 ? `${getRankColor(index)}22` : 'var(--bg-2)',
                  color: getRankColor(index),
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.2rem'
                }}>
                  #{index + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{resource.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-2)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> {resource.module_name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>• {resource.school_name}</span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-2)' }}>
                    <Eye size={18} style={{ marginBottom: '2px' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{resource.views}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#22C55E' }}>
                    <ThumbsUp size={18} style={{ marginBottom: '2px' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{resource.likes}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Trending;
