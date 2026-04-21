import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleDetail, getResourcesByModule, addReaction } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, FileText, Video, Image, StickyNote, ThumbsUp, ThumbsDown, MessageCircle, Eye, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import CommentSection from '../components/Resource/CommentSection';

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isProfessor } = useAuth();
  const [module, setModule] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSummary, setExpandedSummary] = useState(null);

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
      loadData(); // Refresh to get new counts
    } catch (err) {
      toast.error('Failed to add reaction');
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

  // Mock AI Summary Generator
  const getAiSummary = (resource) => {
    const keywords = resource.title.split(' ');
    const mainTopic = keywords.length > 2 ? `${keywords[0]} ${keywords[1]}` : resource.title;
    return `This ${resource.type.toUpperCase()} resource provides an in-depth exploration of ${mainTopic}. It covers essential concepts shared in the ${module.name} curriculum, focusing on ${resource.description ? resource.description.slice(0, 50) + '...' : 'practical applications and theoretical foundations'}. Ideal for exam preparation and conceptual clarity.`;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--accent-color)' }}>Loading module data...</div>;
  if (!module) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Module not found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingBottom: '5rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, margin: '2rem 0', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
      >
        <ArrowLeft size={18} /> Back to Semesters
      </button>

      <div className="glass" style={{ padding: '3rem', borderRadius: '32px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>{module.name}</h1>
            <div style={{ display: 'flex', gap: '1.5rem', opacity: 0.5, fontSize: '0.9rem', flexWrap: 'wrap', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GraduationCap size={16} /> {module.school_name}</span>
              <span>•</span>
              <span>{module.field_name}</span>
              <span>•</span>
              <span>{module.semester_name}</span>
            </div>
          </div>
          {isProfessor && (
            <button 
              onClick={() => navigate(`/upload?moduleId=${moduleId}`)}
              style={{ padding: '1rem 2rem', borderRadius: '16px', background: 'var(--accent-color)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Upload Material
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-1)' }}>Study Materials ({resources.length})</h2>
          
          {resources.map(resource => (
            <div key={resource.id} className="glass" style={{ padding: '2rem', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ color: 'var(--accent-color)', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', height: 'fit-content' }}>
                  {getTypeIcon(resource.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>{resource.title}</h3>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button 
                        onClick={() => setExpandedSummary(expandedSummary === resource.id ? null : resource.id)}
                        style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-color)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        <Sparkles size={14} /> AI Summary
                      </button>
                      {resource.file_url && (
                        <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                          Open
                        </a>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedSummary === resource.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', margin: '1rem 0', border: '1px dashed var(--accent-color)' }}
                      >
                        <div style={{ padding: '1.2rem', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-2)' }}>
                          <div style={{ fontWeight: 800, color: 'var(--accent-color)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            <Sparkles size={12} /> Antigravity AI Analysis
                          </div>
                          {getAiSummary(resource)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p style={{ opacity: 0.7, marginBottom: '1.5rem', lineHeight: 1.5 }}>{resource.description || 'No description provided.'}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleReaction(resource.id, 'like')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.6 }}>
                          <ThumbsUp size={16} /> <span style={{ fontSize: '0.9rem' }}>{resource.likes}</span>
                        </button>
                        <button onClick={() => handleReaction(resource.id, 'dislike')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.6 }}>
                          <ThumbsDown size={16} /> <span style={{ fontSize: '0.9rem' }}>{resource.dislikes}</span>
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.4, fontSize: '0.9rem' }}>
                        <Eye size={16} /> {resource.views} views
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.5, fontWeight: 500 }}>
                      Uploaded by <span style={{ color: 'var(--text-1)' }}>{resource.author_name}</span>
                    </div>
                  </div>

                  <CommentSection resourceId={resource.id} />
                </div>
              </div>
            </div>
          ))}

          {resources.length === 0 && (
            <div className="glass" style={{ padding: '5rem 3rem', borderRadius: '32px', textAlign: 'center', opacity: 0.6 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📂</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Empty Module shelf</h3>
              <p>No resources have been shared here yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar Space */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Module Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.5 }}>Level</span>
                <span style={{ fontWeight: 600 }}>{module.semester_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.5 }}>Field</span>
                <span style={{ fontWeight: 600 }}>{module.field_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleDetail;
