import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BookOpen, Heart, Globe, School } from 'lucide-react';
import './SchoolCard.css';

const SchoolCard = ({ school, isBookmarked, onToggleBookmark }) => {
  return (
    <div className="school-card glass">
      <div className="card-header">
        <div className="code-badge">{school.code}</div>
        <button 
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleBookmark(school);
          }}
        >
          <Heart size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <Link to={`/school/${school.id}`} className="card-body">
        <h3 className="school-name">{school.name}</h3>
        <div className="school-info">
          <div className="info-item">
            <MapPin size={16} />
            <span>{school.city}</span>
          </div>
          <div className="info-item">
            <School size={16} />
            <span className="capitalize">{school.type}</span>
          </div>
        </div>

        <div className="badges">
          <span className={`badge ${school.is_public ? 'public' : 'private'}`}>
            {school.is_public ? 'Public' : 'Private'}
          </span>
          <span className="badge type">{school.short_name}</span>
        </div>
      </Link>
    </div>
  );
};

export default SchoolCard;
