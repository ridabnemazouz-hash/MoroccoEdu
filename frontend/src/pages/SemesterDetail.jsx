import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModulesBySemester } from '../services/api';
import { ArrowLeft, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const SemesterDetail = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const res = await getModulesBySemester(semesterId);
        setModules(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadModules();
  }, [semesterId]);

  if (loading) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ paddingTop: '4rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Modules</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {modules.map(module => (
          <div
            key={module.id}
            onClick={() => navigate(`/module/${module.id}`)}
            className="glass"
            style={{ padding: '2rem', borderRadius: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Package size={40} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{module.name}</h3>
            {module.code && <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '0.5rem' }}>Code: {module.code}</p>}
            {module.description && <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{module.description}</p>}
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
          No modules available yet.
        </div>
      )}
    </motion.div>
  );
};

export default SemesterDetail;
