import React from 'react'
import { motion } from 'framer-motion'

export const CubeAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* 3D Rotating Cube */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Front face */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 border border-blue-300/50"
          style={{
            transform: 'translateZ(16px)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Back face */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-500/30 border border-purple-300/50"
          style={{
            transform: 'translateZ(-16px) rotateY(180deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Right face */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-green-400/30 to-blue-500/30 border border-green-300/50"
          style={{
            transform: 'translateX(16px) rotateY(90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Left face */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 border border-yellow-300/50"
          style={{
            transform: 'translateX(-16px) rotateY(-90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Top face */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-red-400/30 to-pink-500/30 border border-red-300/50"
          style={{
            transform: 'translateY(-16px) rotateX(90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Bottom face */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 border border-indigo-300/50"
          style={{
            transform: 'translateY(16px) rotateX(-90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </motion.div>

      {/* Second smaller cube */}
      <motion.div
        className="absolute top-3/4 right-1/4 w-20 h-20"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        animate={{
          rotateX: [0, -360],
          rotateY: [0, -360],
          rotateZ: [0, -360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
      >
        {/* Front face */}
        <div
          className="absolute w-20 h-20 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 border border-cyan-300/50"
          style={{
            transform: 'translateZ(10px)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Back face */}
        <div
          className="absolute w-20 h-20 bg-gradient-to-br from-teal-400/40 to-green-500/40 border border-teal-300/50"
          style={{
            transform: 'translateZ(-10px) rotateY(180deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Right face */}
        <div
          className="absolute w-20 h-20 bg-gradient-to-br from-emerald-400/40 to-teal-500/40 border border-emerald-300/50"
          style={{
            transform: 'translateX(10px) rotateY(90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Left face */}
        <div
          className="absolute w-20 h-20 bg-gradient-to-br from-lime-400/40 to-emerald-500/40 border border-lime-300/50"
          style={{
            transform: 'translateX(-10px) rotateY(-90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Top face */}
        <div
          className="absolute w-20 h-20 bg-gradient-to-br from-amber-400/40 to-orange-500/40 border border-amber-300/50"
          style={{
            transform: 'translateY(-10px) rotateX(90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Bottom face */}
        <div
          className="absolute w-20 h-20 bg-gradient-to-br from-orange-400/40 to-red-500/40 border border-orange-300/50"
          style={{
            transform: 'translateY(10px) rotateX(-90deg)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </motion.div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-lg"
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-lg"
        animate={{
          x: [50, -50, 50],
          y: [-30, 30, -30],
          scale: [1, 0.8, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
    </div>
  )
} 