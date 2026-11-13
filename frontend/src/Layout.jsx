import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingLegalIcons from '@/components/FloatingLegalIcons';
import LawUpdatesBanner from '@/components/LawUpdatesBanner';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[rgb(var(--page-background))] text-white relative pb-10">
      <style>{`
        body {
          background-color: rgb(var(--page-background));
        }

        .gradient-text {
          background: linear-gradient(120deg, rgb(var(--brand-300)) 0%, rgb(var(--brand-400)) 45%, rgb(var(--brand-highlight)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-glow {
          background: radial-gradient(ellipse at center, rgb(var(--brand-500) / 0.12) 0%, transparent 70%);
        }

        .card-glow {
          box-shadow: 0 0 60px rgb(var(--brand-500) / 0.08);
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