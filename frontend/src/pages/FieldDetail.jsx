import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSemestersByField } from '../services/api';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const FieldDetail = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [semRes, fieldRes] = await Promise.all([
          getSemestersByField(fieldId),
          Promise.resolve({ data: { name: 'Field' } }) // Simplified for now
        ]);
        setSemesters(semRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fieldId]);

  if (loading) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ paddingTop: '4rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Semesters</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {semesters.map(semester => (
          <div
            key={semester.id}
            onClick={() => navigate(`/semester/${semester.id}/modules`)}
            className="glass"
            style={{ padding: '2rem', borderRadius: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Calendar size={40} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{semester.name}</h3>
            <p style={{ opacity: 0.6 }}>Click to view modules</p>
          </div>
        ))}
      </div>

      {semesters.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
          No semesters available yet.
        </div>
      )}
    </motion.div>
  );
};

export default FieldDetail;
