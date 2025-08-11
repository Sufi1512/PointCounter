import React from 'react'
import { motion } from 'framer-motion'

export const CohortAlert: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <h3 className="text-lg font-semibold">Arcade Cohort 2025 (July - Dec) is Active!</h3>
            <p className="text-blue-100 text-sm">Keep earning points and badges to climb the arcade page!</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium">
            ACTIVE NOW
          </div>
        </div>
      </div>
    </motion.div>
  )
} 