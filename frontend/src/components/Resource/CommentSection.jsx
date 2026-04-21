import React, { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Trash2, Reply, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const CommentSection = ({ resourceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadComments();
  }, [resourceId]);

  const loadComments = async () => {
    try {
      const res = await getComments(resourceId);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, parentId = null) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to comment');
    
    try {
      await addComment(resourceId, newComment, parentId);
      setNewComment('');
      setReplyTo(null);
      loadComments();
      toast.success('Comment posted');
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      loadComments();
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div style={{ marginLeft: isReply ? '2rem' : '0', marginBottom: '1.5rem', opacity: 1 }}>
      <div className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }}>
              {comment.user_name?.[0]}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.user_name}</span>
            <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          {user?.id === comment.user_id && (
            <button onClick={() => handleDelete(comment.id)} style={{ color: '#EF4444', opacity: 0.6, cursor: 'pointer' }} title="Delete">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.5, opacity: 0.9 }}>{comment.content}</p>
        {!isReply && isAuthenticated && (
          <button 
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
          >
            <Reply size={12} /> Reply
          </button>
        )}
      </div>

      {replyTo === comment.id && (
        <form onSubmit={(e) => handleSubmit(e, comment.id)} style={{ marginTop: '0.5rem', marginLeft: '2rem', display: 'flex', gap: '0.5rem' }}>
          <input 
            autoFocus
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a reply..."
            style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'inherit' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            <Send size={14} />
          </button>
        </form>
      )}

      {comment.replies?.map(reply => (
        <CommentItem key={reply.id} comment={reply} isReply={true} />
      ))}
    </div>
  );

  if (loading) return <div>Loading comments...</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Comments ({comments.length})
      </h3>

      <form onSubmit={(e) => handleSubmit(e)} style={{ marginBottom: '2rem' }}>
        <textarea
          value={replyTo === null ? newComment : ''}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? "Add a public comment..." : "Login to join the discussion"}
          disabled={!isAuthenticated}
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'inherit', minHeight: '80px', resize: 'vertical' }}
        />
        {isAuthenticated && (
          <button type="submit" style={{ marginTop: '0.5rem', padding: '0.6rem 2rem', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Post
          </button>
        )}
      </form>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p style={{ opacity: 0.4, textAlign: 'center', padding: '2rem' }}>No comments yet. Start the conversation!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
