import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageCircle, Eye, Share2, FileText, Video, Image, StickyNote } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addReaction } from '../../services/api';
import { toast } from 'react-toastify';
import './ResourceCard.css';

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(resource.likes || 0);
  const [dislikes, setDislikes] = useState(resource.dislikes || 0);
  const [userReaction, setUserReaction] = useState(null);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={14} />;
      case 'video': return <Video size={14} />;
      case 'image': return <Image size={14} />;
      case 'note': return <StickyNote size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      toast.error('Please login to react');
      return;
    }

    try {
      await addReaction(resource.id, type);
      
      if (userReaction === type) {
        setUserReaction(null);
        if (type === 'like') setLikes(prev => prev - 1);
        if (type === 'dislike') setDislikes(prev => prev - 1);
      } else {
        if (userReaction === 'like') setLikes(prev => prev - 1);
        if (userReaction === 'dislike') setDislikes(prev => prev - 1);
        
        setUserReaction(type);
        if (type === 'like') setLikes(prev => prev + 1);
        if (type === 'dislike') setDislikes(prev => prev + 1);
      }
    } catch (err) {
      toast.error('Failed to add reaction');
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div className="resource-card" onClick={() => navigate(`/resource/${resource.id}`)}>
      <div className="vote-section">
        <button 
          className={`vote-btn like ${userReaction === 'like' ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleReaction('like'); }}
        >
          <ThumbsUp size={18} />
        </button>
        <span className="vote-count">{likes - dislikes}</span>
        <button 
          className={`vote-btn dislike ${userReaction === 'dislike' ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleReaction('dislike'); }}
        >
          <ThumbsDown size={18} />
        </button>
      </div>

      <div className="card-content">
        <div className="card-header">
          <div className="author-avatar">{getInitials(resource.author_name)}</div>
          <span className="author-name">{resource.author_name}</span>
          <span>•</span>
          <span className="timestamp">{timeAgo(resource.created_at)}</span>
        </div>

        <h3 className="card-title">{resource.title}</h3>
        
        {resource.description && (
          <p className="card-description">{resource.description}</p>
        )}

        <div className={`resource-badge ${resource.type}`}>
          {getTypeIcon(resource.type)}
          {resource.type}
        </div>

        {resource.file_url && resource.type === 'image' && (
          <div className="file-preview">
            <img src={resource.file_url} alt={resource.title} />
          </div>
        )}

        {resource.file_url && resource.type === 'video' && (
          <div className="file-preview">
            <video controls>
              <source src={resource.file_url} type="video/mp4" />
            </video>
          </div>
        )}

        <div className="card-actions">
          <button className="action-btn" onClick={(e) => e.stopPropagation()}>
            <MessageCircle size={16} />
            {resource.comment_count || 0} Comments
          </button>
          <button className="action-btn">
            <Eye size={16} />
            {resource.views || 0} Views
          </button>
          <button className="action-btn">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
