import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { uploadResource, getModuleDetail } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Video, Image, StickyNote, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const UploadResource = () => {
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  const navigate = useNavigate();
  const { isProfessor, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    file: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to upload resources');
      navigate('/login');
      return;
    }
    if (moduleId) {
      loadModule();
    }
  }, [moduleId]);

  const loadModule = async () => {
    try {
      const res = await getModuleDetail(moduleId);
      setModule(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file && formData.type !== 'note') {
      return toast.error('Please select a file');
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    if (formData.file) data.append('file', formData.file);

    try {
      await uploadResource(moduleId, data);
      toast.success('Resource uploaded successfully!');
      navigate(`/module/${moduleId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: 'pdf', label: 'PDF/Lesson', icon: <FileText size={20} /> },
    { id: 'video', label: 'Video', icon: <Video size={20} /> },
    { id: 'image', label: 'Image', icon: <Image size={20} /> },
    { id: 'note', label: 'Quick Note', icon: <StickyNote size={20} /> }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ padding: '4rem 0' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, marginBottom: '2rem', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Upload Resource</h1>
        <p style={{ opacity: 0.6, marginBottom: '3rem' }}>
          Sharing resources helps the whole MoroccoEdu community. {module ? `Uploading to: ${module.name}` : ''}
        </p>

        <form onSubmit={handleSubmit} className="glass" style={{ padding: '3rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Resource Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {types.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t.id })}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: formData.type === t.id ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)',
                    background: formData.type === t.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.icon}
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Calculus II - Summary of Integrals"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description (Optional)</label>
            <textarea
              placeholder="Provide some context about this resource..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'inherit', minHeight: '100px', resize: 'vertical' }}
            />
          </div>

          {formData.type !== 'note' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>File Attachment</label>
              <div 
                style={{ 
                  border: '2px dashed rgba(255,255,255,0.1)', 
                  borderRadius: '16px', 
                  padding: '3rem', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                <Upload size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                {formData.file ? (
                  <p style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{formData.file.name}</p>
                ) : (
                  <>
                    <p style={{ fontWeight: 600 }}>Drop your file here or click to browse</p>
                    <p style={{ opacity: 0.4, fontSize: '0.8rem', marginTop: '0.5rem' }}>Supporting PDF, JPG, PNG, MP4. Max size 10MB.</p>
                  </>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '1.2rem', 
              borderRadius: '16px', 
              background: 'var(--accent-color)', 
              color: 'white', 
              border: 'none', 
              fontWeight: 800, 
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
            {loading ? 'Uploading to cloud...' : 'Complete Upload'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UploadResource;
