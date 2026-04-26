import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="login-container flex-center"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="login-card"
      >
        <div className="login-title" style={{ fontSize: '2.5rem' }}>BJP Vikas Aghadi</div>
        <div className="login-subtitle">Uchagaon Grampanchayat Election 2026</div>
        
        <div style={{ marginBottom: '2rem' }}>
          <img 
            src="/poster.jpeg" 
            alt="Election Poster" 
            style={{ maxWidth: '100%', maxHeight: '50vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }} 
          />
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Enter <ArrowRight size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Login;
