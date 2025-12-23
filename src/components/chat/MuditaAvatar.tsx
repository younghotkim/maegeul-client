/**
 * MuditaAvatar Component
 * Animated organic cell-like avatar representing Mudita Bot's emotional presence
 * Inspired by living organisms - breathing, pulsing, and morphing
 */

import React from 'react';
import { motion } from 'framer-motion';

interface MuditaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  showStatus?: boolean;
}

const sizeMap = {
  sm: { container: 'w-8 h-8', core: 'w-6 h-6', nucleus: 'w-2 h-2' },
  md: { container: 'w-10 h-10', core: 'w-7 h-7', nucleus: 'w-2.5 h-2.5' },
  lg: { container: 'w-16 h-16', core: 'w-12 h-12', nucleus: 'w-4 h-4' },
  xl: { container: 'w-20 h-20', core: 'w-14 h-14', nucleus: 'w-5 h-5' },
};

export const MuditaAvatar: React.FC<MuditaAvatarProps> = ({
  size = 'sm',
  isActive = false,
  showStatus = false,
}) => {
  const sizes = sizeMap[size];

  return (
    <div className={`relative ${sizes.container} flex items-center justify-center`}>
      {/* Outer membrane - organic breathing effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(168,85,247,0.1) 70%, transparent 100%)',
        }}
        animate={{
          scale: isActive ? [1, 1.5, 1.3, 1.6, 1] : [1, 1.25, 1.15, 1.3, 1],
          opacity: isActive ? [0.6, 0.2, 0.4, 0.1, 0.6] : [0.4, 0.2, 0.3, 0.15, 0.4],
          borderRadius: ['50%', '48%', '52%', '47%', '50%'],
        }}
        transition={{
          duration: isActive ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary membrane - offset timing for organic feel */}
      <motion.div
        className="absolute inset-1 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(139,92,246,0.2) 60%, transparent 100%)',
        }}
        animate={{
          scale: isActive ? [1, 1.3, 1.15, 1.35, 1] : [1, 1.15, 1.08, 1.2, 1],
          opacity: isActive ? [0.7, 0.3, 0.5, 0.2, 0.7] : [0.5, 0.3, 0.4, 0.25, 0.5],
          borderRadius: ['50%', '52%', '48%', '53%', '50%'],
        }}
        transition={{
          duration: isActive ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.15,
        }}
      />

      {/* Core cell body - morphing organic shape */}
      <motion.div
        className={`relative ${sizes.core} rounded-full shadow-lg overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)',
        }}
        animate={{
          scale: isActive ? [1, 1.08, 0.98, 1.05, 1] : [1, 1.03, 0.99, 1.02, 1],
          borderRadius: isActive 
            ? ['50%', '47% 53% 52% 48%', '52% 48% 47% 53%', '48% 52% 53% 47%', '50%']
            : ['50%', '49% 51% 50% 50%', '51% 49% 50% 50%', '50% 50% 51% 49%', '50%'],
        }}
        transition={{
          duration: isActive ? 1.2 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner cytoplasm glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating organelles */}
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
          style={{ top: '20%', left: '25%' }}
          animate={{
            x: isActive ? [0, 3, -2, 4, 0] : [0, 2, -1, 2, 0],
            y: isActive ? [0, -3, 2, -4, 0] : [0, -1, 1, -2, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.5, 0.8, 0.6, 0.7, 0.5],
          }}
          transition={{
            duration: isActive ? 1.8 : 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute w-1 h-1 rounded-full bg-white/40"
          style={{ top: '60%', left: '65%' }}
          animate={{
            x: isActive ? [0, -4, 2, -3, 0] : [0, -2, 1, -1, 0],
            y: isActive ? [0, 2, -3, 3, 0] : [0, 1, -1, 2, 0],
            scale: [1, 0.8, 1.3, 0.9, 1],
            opacity: [0.4, 0.7, 0.5, 0.6, 0.4],
          }}
          transition={{
            duration: isActive ? 2 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />

        {/* Nucleus - the heart of the cell */}
        <motion.div
          className={`absolute ${sizes.nucleus} rounded-full`}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(233,213,255,0.7) 100%)',
            boxShadow: '0 0 10px rgba(168,85,247,0.5)',
          }}
          animate={{
            scale: isActive ? [1, 1.3, 0.9, 1.2, 1] : [1, 1.1, 0.95, 1.05, 1],
            opacity: isActive ? [0.9, 1, 0.8, 1, 0.9] : [0.8, 0.9, 0.75, 0.85, 0.8],
          }}
          transition={{
            duration: isActive ? 0.8 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Energy ripple when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(255,255,255,0.3)',
            }}
            animate={{
              scale: [0.5, 1.2],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.div>

      {/* Online status indicator */}
      {showStatus && (
        <motion.div
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

export default MuditaAvatar;
