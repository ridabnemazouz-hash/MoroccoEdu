import React, { useState, useEffect } from 'react';
import SchoolCard from '../components/SchoolCard';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks') || '[]'));

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (school) => {
    setBookmarks(prev => prev.filter(b => b.id !== school.id));
  };

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Saved Schools</h1>
        <p style={{ opacity: 0.6 }}>Your personal list of institutions you're interested in.</p>
      </header>

      {bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <HeartOff size={64} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
          <h3>No bookmarks yet</h3>
          <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Start exploring schools and save the ones you like!</p>
          <Link to="/" className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: 'pill', display: 'inline-block' }}>
            Browse Schools
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem',
          paddingBottom: '4rem'
        }}>
          <AnimatePresence>
            {bookmarks.map(school => (
              <motion.div
                key={school.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <SchoolCard 
                  school={school} 
                  isBookmarked={true}
                  onToggleBookmark={toggleBookmark}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Favorites;
