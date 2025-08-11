import React from 'react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Users Tracked', value: '1,000+', color: 'blue' },
  { label: 'Skill Badges', value: '50+', color: 'purple' },
  { label: 'Milestones', value: '25+', color: 'green' }
]

const colorClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  green: 'text-green-600 dark:text-green-400'
}

export const StatsPreview: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          className="text-center"
        >
          <div className={`text-3xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses]} mb-2`}>
            {stat.value}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 