import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, BookOpen, MessageCircle, Star } from 'lucide-react';
import { fetchSchools } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './RightSidebar.css';

const RightSidebar = () => {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const trendingModules = [
    { id: 1, title: 'Introduction to Programming', views: '2.3k', comments: 45 },
    { id: 2, title: 'Data Structures & Algorithms', views: '1.8k', comments: 38 },
    { id: 3, title: 'Database Systems', views: '1.5k', comments: 29 },
    { id: 4, title: 'Calculus I', views: '1.2k', comments: 22 },
    { id: 5, title: 'Linear Algebra', views: '980', comments: 18 },
  ];

  useEffect(() => {
    loadRecommended();
  }, []);

  const loadRecommended = async () => {
    try {
      const res = await fetchSchools(5);
      setRecommended(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-content">
        <div className="stats-card" style={{ border: 'none', background: 'var(--primary-indigo)', color: 'white', marginBottom: '2rem' }}>
          <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Premium Feature</h4>
          <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>MoroccoEdu Pro</p>
          <button style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: 'none', background: 'white', color: 'var(--primary-indigo)', fontWeight: 700, cursor: 'pointer' }}>
            Get Early Access
          </button>
        </div>

        <div className="trending-section glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div className="section-header" style={{ borderBottom: 'none' }}>
            <TrendingUp size={18} color="var(--accent)" />
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending Today</h3>
          </div>
          
          {trendingModules.map((module) => (
            <div key={module.id} className="trending-item" style={{ padding: '8px 0' }}>
              <div className="trending-title" style={{ fontSize: '0.85rem' }}>{module.title}</div>
              <div className="trending-meta" style={{ paddingLeft: '0', opacity: 0.5 }}>
                <span>{module.views} views</span>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-card" style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>Community Recommendations</h4>
          {recommended.map(school => (
            <div 
              key={school.id} 
              onClick={() => navigate(`/school/${school.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', cursor: 'pointer' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '10px' }}>
                {school.code?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-1)' }}>{school.code}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{school.city}</div>
              </div>
              <button style={{ padding: '4px 12px', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', fontSize: '0.75rem', fontWeight: 700 }}>Join</button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
