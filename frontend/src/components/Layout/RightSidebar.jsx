import React from 'react';
import { TrendingUp, Users, BookOpen, MessageCircle } from 'lucide-react';
import './RightSidebar.css';

const RightSidebar = () => {
  const trendingModules = [
    { id: 1, title: 'Introduction to Programming', views: '2.3k', comments: 45 },
    { id: 2, title: 'Data Structures & Algorithms', views: '1.8k', comments: 38 },
    { id: 3, title: 'Database Systems', views: '1.5k', comments: 29 },
    { id: 4, title: 'Calculus I', views: '1.2k', comments: 22 },
    { id: 5, title: 'Linear Algebra', views: '980', comments: 18 },
  ];

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-content">
        <div className="trending-section">
          <div className="section-header">
            <TrendingUp size={20} color="var(--accent)" />
            <h3>Trending Modules</h3>
          </div>
          
          {trendingModules.map((module, index) => (
            <div key={module.id} className="trending-item">
              <div className="trending-item-header">
                <span className="trending-rank">{index + 1}</span>
                <span className="trending-title">{module.title}</span>
              </div>
              <div className="trending-meta">
                <span>{module.views} views</span>
                <span>{module.comments} comments</span>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-card">
          <h4>Platform Statistics</h4>
          <div className="stat-row">
            <span className="stat-label">Total Schools</span>
            <span className="stat-value">120+</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Resources</span>
            <span className="stat-value">5.2k</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Students</span>
            <span className="stat-value">12k</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Professors</span>
            <span className="stat-value">450</span>
          </div>
        </div>

        <div className="community-info">
          <h4>Welcome to MoroccoEdu</h4>
          <p>A social platform for Moroccan students to share and discover educational resources. Join the community today!</p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
