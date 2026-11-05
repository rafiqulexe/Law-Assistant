import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Gavel, BookOpen, FileText, Shield, Scroll, Landmark, Award, Briefcase, Building2, FileCheck } from 'lucide-react';

const icons = [
  { Icon: Scale, delay: 0, x: '5%', y: '15%' },
  { Icon: Gavel, delay: 0.5, x: '85%', y: '20%' },
  { Icon: BookOpen, delay: 1, x: '10%', y: '70%' },
  { Icon: FileText, delay: 1.5, x: '90%', y: '65%' },
  { Icon: Shield, delay: 2, x: '15%', y: '45%' },
  { Icon: Scroll, delay: 2.5, x: '80%', y: '40%' },
  { Icon: Landmark, delay: 3, x: '8%', y: '85%' },
  { Icon: Award, delay: 3.5, x: '88%', y: '80%' },
  { Icon: Briefcase, delay: 0.8, x: '25%', y: '25%' },
  { Icon: Building2, delay: 1.8, x: '75%', y: '55%' },
  { Icon: FileCheck, delay: 2.8, x: '30%', y: '60%' },
  { Icon: Scale, delay: 3.3, x: '70%', y: '30%' },
];

export default function FloatingLegalIcons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.15, 0.35, 0.15],
            scale: [0.8, 1, 0.8],
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon 
            className="text-amber-500/40" 
            size={Math.random() * 30 + 40}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}