import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSchools, searchSchools, fetchCountries, fetchCitiesByCountry } from '../services/api';
import SearchBar from '../components/SearchBar';
import ResourceCard from '../components/Resource/ResourceCard';
import { Loader2, TrendingUp, Clock, Award, MapPin, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [resources, setResources] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('hot');
  
  // Filters
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [schoolsRes, countriesRes] = await Promise.all([
        fetchSchools(40),
        fetchCountries()
      ]);
      setSchools(schoolsRes.data);
      setCountries(countriesRes.data);
    } catch (err) {
      setError('Failed to connect to the educational network. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = async (countryId) => {
    setSelectedCountry(countryId);
    setSelectedCity('');
    if (countryId) {
      try {
        const res = await fetchCitiesByCountry(countryId);
        setCities(res.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCities([]);
    }
  };

  const filteredSchools = schools.filter(s => {
    if (selectedCity && s.city_id !== parseInt(selectedCity)) return false;
    return true;
  });

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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div className="glass" style={{ 
        padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 3rem)', 
        borderRadius: 'clamp(20px, 4vw, 40px)', 
        marginBottom: 'clamp(2rem, 5vw, 4rem)', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
        border: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Glow */}
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-1)' }}
        >
          Your Academic Journey,{' '}<span style={{ color: 'var(--accent)' }}>Simplified.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ color: 'var(--text-2)', fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}
        >
          Access courses, exams, and notes from all Moroccan universities in one elegant platform.
        </motion.p>

        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchBar onSearch={handleSearch} suggestions={schools.slice(0, 5)} />
          
          {/* Location Picker */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '140px' }}>
              <select 
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-1)', appearance: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              >
                <option value="">Select Country</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <Globe size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
              <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, pointerEvents: 'none' }} />
            </div>

            <div style={{ position: 'relative', flex: '1', minWidth: '140px' }}>
              <select 
                disabled={!selectedCountry}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-1)', appearance: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', opacity: selectedCountry ? 1 : 0.5 }}
              >
                <option value="">Select City</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
              <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Sort Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '28px',
        padding: '6px',
        background: 'var(--bg-2)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        width: 'fit-content',
        boxShadow: 'var(--shadow)'
      }}>
        <button 
          onClick={() => setSortBy('hot')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: sortBy === 'hot' ? 'var(--accent)' : 'transparent',
            color: sortBy === 'hot' ? 'var(--bg-1)' : 'var(--text-2)',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
            boxShadow: sortBy === 'hot' ? 'var(--shadow)' : 'none',
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
            background: sortBy === 'new' ? 'var(--accent)' : 'transparent',
            color: sortBy === 'new' ? 'var(--bg-1)' : 'var(--text-2)',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
            boxShadow: sortBy === 'new' ? 'var(--shadow)' : 'none',
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
            background: sortBy === 'top' ? 'var(--accent)' : 'transparent',
            color: sortBy === 'top' ? 'var(--bg-1)' : 'var(--text-2)',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease',
            boxShadow: sortBy === 'top' ? 'var(--shadow)' : 'none',
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
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: 'clamp(1rem, 3vw, 2rem)' }}>
          {filteredSchools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/school/${school.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="glass card-hover" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                    {school.code?.[0]}
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 700, opacity: 0.6 }}>
                    {school.type}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{school.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.5 }}>
                    <MapPin size={14} /> {school.city}
                  </div>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                      <Award size={14} /> {school.avg_rating}
                    </div>
                  </div>
                  <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Explore</button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredSchools.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
              <div style={{ fontSize: '100px', marginBottom: '20px' }}>📍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>No Schools in this selection</h3>
              <p style={{ opacity: 0.6 }}>Try selecting a different city or removing filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
