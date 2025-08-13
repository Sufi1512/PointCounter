import React from 'react'
import { motion } from 'framer-motion'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Arcade Cohort 2025 (July - Dec) is Active!
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
        >
          <motion.span
            className="block"
            animate={{
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Track Your
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            animate={{
              textShadow: [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            Arcade Progress
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
        >
          Calculate points, track milestones, and stay motivated with your Google Cloud Skills Boost journey
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              y: -5,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <span className="relative z-10">Get Started</span>
          </motion.button>
          
          <motion.button 
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              y: -5,
              borderColor: "#3B82F6",
              color: "#3B82F6"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <span className="relative z-10">Learn More</span>
          </motion.button>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div 
            className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            whileHover={{ 
              scale: 1.05,
              y: -10,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
              animate={{
                textShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 10px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              1,000+
            </motion.div>
            <div className="text-gray-600 dark:text-gray-400">Users Tracked</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            whileHover={{ 
              scale: 1.05,
              y: -10,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)"
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div 
              className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2"
              animate={{
                textShadow: [
                  "0 0 10px rgba(139, 92, 246, 0.3)",
                  "0 0 20px rgba(139, 92, 246, 0.5)",
                  "0 0 10px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              50+
            </motion.div>
            <div className="text-gray-600 dark:text-gray-400">Skill Badges</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            whileHover={{ 
              scale: 1.05,
              y: -10,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)"
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.div 
              className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2"
              animate={{
                textShadow: [
                  "0 0 10px rgba(99, 102, 241, 0.3)",
                  "0 0 20px rgba(99, 102, 241, 0.5)",
                  "0 0 10px rgba(99, 102, 241, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              25+
            </motion.div>
            <div className="text-gray-600 dark:text-gray-400">Milestones</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 