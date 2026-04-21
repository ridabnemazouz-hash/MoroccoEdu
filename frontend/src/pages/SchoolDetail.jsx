import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, School, GraduationCap, Calendar, ShieldCheck, BookOpen, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchSchools, getFieldsBySchool, getSchoolReviews, addReview } from '../services/api';
import { toast } from 'react-toastify';

const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [fields, setFields] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  useEffect(() => {
    const loadSchool = async () => {
      try {
        const res = await fetchSchools(200);
        const item = res.data.find(s => s.id === parseInt(id));
        setSchool(item);
        
        // Load fields for this school
        const fieldsRes = await getFieldsBySchool(id);
        setFields(fieldsRes.data);

        // Load reviews
        const reviewsRes = await getSchoolReviews(id);
        setReviews(reviewsRes.data.reviews);
        setStats(reviewsRes.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSchool();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addReview(id, userRating, userComment);
      toast.success('Review submitted!');
      setUserComment('');
      // Refresh reviews
      const reviewsRes = await getSchoolReviews(id);
      setReviews(reviewsRes.data.reviews);
      setStats(reviewsRes.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Loading...</div>;
  if (!school) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>School not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container" 
      style={{ paddingTop: '4rem' }}
    >
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, marginBottom: '2rem' }}>
        <ArrowLeft size={18} />
        Back to search
      </button>

      <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ color: 'var(--accent-color)', fontWeight: 700, marginBottom: '1rem' }}>{school.code}</div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>{school.name}</h1>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', opacity: 0.7, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} />
                <span>{school.city}, Morocco</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <School size={20} />
                <span className="capitalize">{school.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} />
                <span>{school.is_public ? 'State-Owned (Public)' : 'Private Institution'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,191,0,0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,191,0,0.2)', width: 'fit-content' }}>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[1,2,3,4,5].map(star => (
                   <Star key={star} size={20} fill={star <= Math.round(stats.average) ? "#FFBF00" : "none"} color="#FFBF00" />
                ))}
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{stats.average}</span>
              <span style={{ opacity: 0.6 }}>({stats.count} reviews)</span>
            </div>
          </div>
        </div>

        <hr style={{ margin: '3rem 0', opacity: 0.1 }} />

        <div>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} />
            Available Fields of Study ({fields.length})
          </h3>
          
          {fields.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {fields.map(field => (
                <div
                  key={field.id}
                  onClick={() => navigate(`/field/${field.id}/semesters`) }
                  className="glass"
                  style={{ padding: '1.5rem', borderRadius: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <BookOpen size={32} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{field.name}</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{field.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', opacity: 0.7 }}>
              <p>No fields available yet. Check back later!</p>
            </div>
          )}
        </div>

        <hr style={{ margin: '3rem 0', opacity: 0.1 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={24} color="var(--accent-color)" />
              Student Reviews
            </h3>

            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map(review => (
                  <div key={review.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 700 }}>{review.user_name}</span>
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} fill={star <= review.rating ? "var(--accent-color)" : "none"} color="var(--accent-color)" />
                        ))}
                      </div>
                    </div>
                    <p style={{ opacity: 0.8, lineHeight: 1.5 }}>{review.comment}</p>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.5 }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px', opacity: 0.6 }}>
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', position: 'sticky', top: '100px' }}>
            <h4 style={{ marginBottom: '1.5rem' }}>Write a Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star size={24} fill={star <= userRating ? "#FFBF00" : "none"} color="#FFBF00" />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Your Comment</label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100px',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'inherit',
                    resize: 'none'
                  }}
                  placeholder="Share your thoughts..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SchoolDetail;
