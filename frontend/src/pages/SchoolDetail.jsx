import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSchools, getFieldsBySchool } from '../services/api';
import { ArrowLeft, MapPin, School, GraduationCap, Calendar, ShieldCheck, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchool = async () => {
      try {
        const res = await fetchSchools(200);
        const item = res.data.find(s => s.id === parseInt(id));
        setSchool(item);
        
        // Load fields for this school
        const fieldsRes = await getFieldsBySchool(id);
        setFields(fieldsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSchool();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Loading...</div>;
  if (!school) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>School not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container" 
      style={{ paddingTop: '4rem' }}
    >
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, marginBottom: '2rem' }}>
        <ArrowLeft size={18} />
        Back to search
      </button>

      <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ color: 'var(--accent-color)', fontWeight: 700, marginBottom: '1rem' }}>{school.code}</div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>{school.name}</h1>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', opacity: 0.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} />
                <span>{school.city}, Morocco</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <School size={20} />
                <span className="capitalize">{school.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} />
                <span>{school.is_public ? 'State-Owned (Public)' : 'Private Institution'}</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '3rem 0', opacity: 0.1 }} />

        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} />
            Available Fields of Study ({fields.length})
          </h3>
          
          {fields.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {fields.map(field => (
                <div
                  key={field.id}
                  onClick={() => navigate(`/field/${field.id}/semesters`) }
                  className="glass"
                  style={{ padding: '1.5rem', borderRadius: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <BookOpen size={32} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{field.name}</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{field.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', opacity: 0.7 }}>
              <p>No fields available yet. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SchoolDetail;
