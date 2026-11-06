import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingLegalIcons from '@/components/FloatingLegalIcons';
import LawUpdatesBanner from '@/components/LawUpdatesBanner';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative pb-10">
      <style>{`
        :root {
          --color-primary: #f59e0b;
          --color-primary-dark: #d97706;
          --color-bronze: #cd7f32;
          --color-copper: #b87333;
        }
        
        body {
          background-color: #0a0a0f;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b87333 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-glow {
          background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
        }
        
        .card-glow {
          box-shadow: 0 0 60px rgba(245, 158, 11, 0.1);
        }
      `}</style>
      
      <FloatingLegalIcons />
      <Navbar />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
      <LawUpdatesBanner />
    </div>
  );
}