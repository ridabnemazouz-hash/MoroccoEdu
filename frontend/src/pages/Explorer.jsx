import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCountries, fetchSchools } from '../services/api';
import { Globe, Building2, GraduationCap, BookOpen, Calendar, Package, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Explorer = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map levels to their respective configurations
  const levelConfig = {
    countries: { title: 'Countries', icon: Globe, description: 'Explore higher education across the kingdom.', fetchData: fetchCountries },
    cities: { title: 'Major Cities', icon: Building2, description: 'Browse institutions by city.', fetchData: fetchCountries }, // Could use a custom endpoint or just list cities
    schools: { title: 'Schools & Universities', icon: GraduationCap, description: 'All institutions nationwide.', fetchData: fetchSchools },
    fields: { title: 'Academic Fields', icon: BookOpen, description: 'Select a school to explore its fields.', isTree: true },
    semesters: { title: 'Semesters', icon: Calendar, description: 'Select a field to browse semesters.', isTree: true },
    modules: { title: 'Modules', icon: Package, description: 'Dive into specific courses.', isTree: true }
  };

  const currentConfig = levelConfig[level] || levelConfig.countries;

  useEffect(() => {
    loadLevelData();
  }, [level]);

  const loadLevelData = async () => {
    setLoading(true);
    try {
      if (level === 'schools') {
        const res = await fetchSchools(100, 0); // Load many schools
        setData(res.data || []);
      } else if (level === 'countries' || level === 'cities') {
        const res = await fetchCountries();
        setData(res.data || []); // In a real app we'd fetch all unique cities from the db
      } else {
        // For tree-based views (fields, semesters, modules), we instruct the user to start from a school
        setData([]); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const Icon = currentConfig.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '16px' }}>
          <Icon size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>{currentConfig.title}</h1>
          <p style={{ color: 'var(--text-2)' }}>{currentConfig.description}</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
             <Loader2 className="animate-spin" size={40} color="var(--accent)" />
           </div>
        ) : currentConfig.isTree ? (
          <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Hierarchy Explorer</h3>
             <p style={{ color: 'var(--text-2)', maxWidth: '500px', margin: '0 auto 2rem' }}>
               Because {level} belong to specific institutions, you need to navigate through a school first to see its curriculum.
             </p>
             <button onClick={() => navigate('/explorer/schools')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
               Start with Schools <ArrowRight size={18} />
             </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {level === 'schools' && data.map(item => (
              <div key={item.id} className="glass card-hover" onClick={() => navigate(`/school/${item.id}`)} style={{ padding: '1.5rem', borderRadius: '16px', cursor: 'pointer' }}>
                <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{item.name}</h3>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{item.city}</span>
              </div>
            ))}
            
            {level === 'countries' && data.map(item => (
              <div key={item.id} className="glass card-hover" onClick={() => navigate('/')} style={{ padding: '1.5rem', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Globe size={20} color="var(--accent)" />
                <h3 style={{ fontWeight: 800 }}>{item.name}</h3>
              </div>
            ))}

            {level === 'cities' && (
              <div className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', borderRadius: '24px' }}>
                <p>Use the Location dropdown on the Home page to explore schools by City.</p>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>Go Home</button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Explorer;
