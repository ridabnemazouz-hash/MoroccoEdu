import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleDetail, getResourcesByModule, getComments, addComment, addReaction } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, FileText, Video, Image, StickyNote, ThumbsUp, ThumbsDown, MessageCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isProfessor } = useAuth();
  const [module, setModule] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadData();
  }, [moduleId]);

  const loadData = async () => {
    try {
      const [moduleRes, resourcesRes] = await Promise.all([
        getModuleDetail(moduleId),
        getResourcesByModule(moduleId)
      ]);
      setModule(moduleRes.data);
      setResources(resourcesRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (resourceId, type) => {
    if (!isAuthenticated) {
      toast.error('Please login to react');
      return;
    }
    try {
      await addReaction(resourceId, type);
      loadData();
    } catch (err) {
      toast.error('Failed to add reaction');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentText.trim()) return;

    try {
      // Find first resource to comment on (or create a general comment endpoint)
      if (resources.length > 0) {
        await addComment(resources[0].id, commentText);
        setCommentText('');
        toast.success('Comment added');
      }
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={32} />;
      case 'video': return <Video size={32} />;
      case 'image': return <Image size={32} />;
      case 'note': return <StickyNote size={32} />;
      default: return <FileText size={32} />;
    }
  };

  if (loading) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Loading...</div>;
  if (!module) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Module not found</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ paddingTop: '4rem' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="glass" style={{ padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{module.name}</h1>
        {module.description && <p style={{ opacity: 0.7, fontSize: '1.1rem', marginBottom: '1rem' }}>{module.description}</p>}
        <div style={{ display: 'flex', gap: '2rem', opacity: 0.6, flexWrap: 'wrap' }}>
          <span>School: {module.school_name}</span>
          <span>Field: {module.field_name}</span>
          <span>Semester: {module.semester_name}</span>
        </div>
      </div>

      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Resources ({resources.length})</h2>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
        {resources.map(resource => (
          <div key={resource.id} className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-color)' }}>{getTypeIcon(resource.type)}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{resource.title}</h3>
                {resource.description && <p style={{ opacity: 0.7, marginBottom: '1rem' }}>{resource.description}</p>}
                <div style={{ display: 'flex', gap: '1rem', opacity: 0.6, fontSize: '0.9rem', flexWrap: 'wrap' }}>
                  <span>By: {resource.author_name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Eye size={14} /> {resource.views}</span>
                  <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button onClick={() => handleReaction(resource.id, 'like')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>
                    <ThumbsUp size={16} /> {resource.likes}
                  </button>
                  <button onClick={() => handleReaction(resource.id, 'dislike')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'inherit', cursor: 'pointer' }}>
                    <ThumbsDown size={16} /> {resource.dislikes}
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                    <MessageCircle size={16} /> {resource.comment_count}
                  </span>
                </div>

                {resource.file_url && (
                  <a href={resource.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--accent-color)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
                    View {resource.type.toUpperCase()}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="glass" style={{ padding: '3rem', borderRadius: '16px', textAlign: 'center', opacity: 0.7 }}>
          <MessageCircle size={48} style={{ marginBottom: '1rem' }} />
          <p>No resources uploaded yet.</p>
          {isProfessor && <p style={{ marginTop: '0.5rem' }}>As a professor, you can upload resources for this module.</p>}
        </div>
      )}

      <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Discussion</h3>
        <form onSubmit={handleComment}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={isAuthenticated ? "Write a comment..." : "Login to comment"}
            disabled={!isAuthenticated}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'inherit', minHeight: '100px', resize: 'vertical' }}
          />
          <button type="submit" disabled={!isAuthenticated || !commentText.trim()} style={{ marginTop: '1rem', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', background: 'var(--accent-color)', color: 'white', fontWeight: 600, cursor: !isAuthenticated ? 'not-allowed' : 'pointer' }}>
            Post Comment
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ModuleDetail;
