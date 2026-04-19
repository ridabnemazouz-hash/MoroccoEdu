import React, { useState, useEffect } from 'react';
import { fetchSchools, searchSchools, getResourcesByModule } from '../services/api';
import SearchBar from '../components/SearchBar';
import ResourceCard from '../components/Resource/ResourceCard';
import { Loader2, TrendingUp, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [schools, setSchools] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('hot');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schoolsData] = await Promise.all([
        fetchSchools(40)
      ]);
      setSchools(schoolsData.data);
      
      // For demo, we'll show a message that resources will appear after seeding
      setResources([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      loadData();
      return;
    }
    try {
      setLoading(true);
      const data = await searchSchools(query, 40);
      setSchools(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="gradient-text" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Welcome to MoroccoEdu
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '28px', lineHeight: 1.6 }}>
          Discover and share educational resources from Moroccan universities
        </p>
        <SearchBar onSearch={handleSearch} suggestions={schools.slice(0, 5)} />
      </div>

      {/* Sort Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '28px',
        padding: '6px',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        width: 'fit-content',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button 
          onClick={() => setSortBy('hot')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: sortBy === 'hot' ? 'var(--primary-gradient)' : 'transparent',
            color: sortBy === 'hot' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
            boxShadow: sortBy === 'hot' ? 'var(--shadow-md)' : 'none',
            transform: sortBy === 'hot' ? 'translateY(-1px)' : 'none'
          }}
        >
          <TrendingUp size={16} /> Hot
        </button>
        <button 
          onClick={() => setSortBy('new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: sortBy === 'new' ? 'var(--primary-gradient)' : 'transparent',
            color: sortBy === 'new' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
            boxShadow: sortBy === 'new' ? 'var(--shadow-md)' : 'none',
            transform: sortBy === 'new' ? 'translateY(-1px)' : 'none'
          }}
        >
          <Clock size={16} /> New
        </button>
        <button 
          onClick={() => setSortBy('top')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: sortBy === 'top' ? 'var(--primary-gradient)' : 'transparent',
            color: sortBy === 'top' ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
            boxShadow: sortBy === 'top' ? 'var(--shadow-md)' : 'none',
            transform: sortBy === 'top' ? 'translateY(-1px)' : 'none'
          }}
        >
          <Award size={16} /> Top
        </button>
      </div>

      {/* Content Feed */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--accent)" />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--danger)' }}>
          {error}
        </div>
      ) : resources.length > 0 ? (
        <AnimatePresence>
          {resources.map(resource => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResourceCard resource={resource} />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '64px 40px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>📚</div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
            No Resources Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
            Resources will appear here once professors start uploading educational content.<br />
            Browse schools and modules to explore the academic structure!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
