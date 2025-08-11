import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
  PlayIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'

// Import API service and types
import { api, validateProfileUrl, formatDate } from '@/services/api'

export const DashboardPage: React.FC = () => {
  const [profileUrl, setProfileUrl] = useState('')
  const [isFacilitator, setIsFacilitator] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Query for user data
  const { 
    data: userData, 
    isLoading: isDataLoading, 
    error, 
    refetch 
  } = useQuery(
    ['userData', profileUrl, isFacilitator],
    () => api.fetchUserProfile(profileUrl, isFacilitator),
    {
      enabled: false, // Don't auto-fetch
      retry: false,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        toast.error(error.message || 'Failed to fetch profile data')
      },
      onSuccess: (data: any) => {
        console.log('✅ API Response Data:', data)
      }
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileUrl.trim()) {
      toast.error('Please enter a profile URL')
      return
    }

    if (!validateProfileUrl(profileUrl)) {
      toast.error('Please enter a valid SkillBoost profile URL')
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    
    try {
      await refetch()
      toast.success('Profile data fetched successfully!')
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast.error(error.message || 'Failed to fetch profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileUrl(e.target.value)
    if (hasSearched) {
      setHasSearched(false)
    }
  }

  // Show loading state or error
  if (isDataLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {isLoading ? 'Fetching profile data...' : 'Loading...'}
          </p>
        </div>
      </motion.div>
    )
  }

  // Show error state
  if (error && hasSearched) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-6">
              {error.message || 'An error occurred while fetching the profile data.'}
            </p>
            <button
              onClick={() => setHasSearched(false)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Show form if no data yet
  if (!userData && !hasSearched) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
    >
        <div className="max-w-4xl mx-auto">
        {/* Header */}
          <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
              Google Cloud Arcade Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
              Enter your SkillBoost profile URL to get started
          </motion.p>
        </div>

          {/* Profile URL Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SkillBoost Profile URL
                </label>
                <input
                  type="url"
                  id="profileUrl"
                  value={profileUrl}
                  onChange={handleUrlChange}
                  placeholder="https://www.cloudskillsboost.google/public_profiles/..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter the URL of your public SkillBoost profile
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isFacilitator}
                    onChange={(e) => setIsFacilitator(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    I am a facilitator
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Fetching Profile...' : 'Get My Dashboard'}
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                💡 How to find your profile URL:
              </h4>
              <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>1. Go to <a href="https://www.cloudskillsboost.google" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900 dark:hover:text-blue-100">Google Cloud Skills Boost</a></li>
                <li>2. Click your profile picture → "View Profile"</li>
                <li>3. Copy the URL from your browser's address bar</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Show dashboard with data
  if (userData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header with search again button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Google Cloud Arcade Dashboard
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600 dark:text-gray-400"
              >
                Welcome back, {userData.user_information.name}!
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setHasSearched(false)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Search Another Profile
            </motion.button>
          </div>

          {/* User Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
          >
            <div className="flex items-center space-x-6">
              <img
                src={userData.user_information.profile_image}
                alt={userData.user_information.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userData.user_information.name}
          </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Google Cloud Skills Boost Profile
                </p>
                <a
                  href={userData.user_information.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  View Profile →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Points Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Points</p>
                  <p className="text-3xl font-bold">{userData.points_data?.total_points || 0}</p>
                </div>
                <TrophyIcon className="w-12 h-12 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Skill Badges</p>
                  <p className="text-3xl font-bold">{userData.points_data?.skill_badges_points || 0}</p>
                </div>
                <StarIcon className="w-12 h-12 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Game Trivia</p>
                  <p className="text-3xl font-bold">{userData.points_data?.game_trivia_points || 0}</p>
                </div>
                <PuzzlePieceIcon className="w-12 h-12 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Milestone</p>
                  <p className="text-lg font-bold">{userData.points_data?.milestone || 'No Milestone'}</p>
                </div>
                <FireIcon className="w-12 h-12 text-orange-200" />
              </div>
            </div>
          </motion.div>

          {/* Badges Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Skill Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <AcademicCapIcon className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Skill Badges ({userData.badges?.skill_badge?.length || 0})
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.badges?.skill_badge?.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img src={badge.image} alt={badge.title} className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(badge.date)}</p>
                    </div>
                  </div>
                )) || <div className="text-gray-500 dark:text-gray-400 text-center py-4">No skill badges found</div>}
              </div>
            </div>

            {/* Game Trivia */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <PlayIcon className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Game Trivia ({userData.badges?.trivia_game?.length || 0})
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.badges?.trivia_game?.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img src={badge.image} alt={badge.title} className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(badge.date)}</p>
                    </div>
                  </div>
                )) || <div className="text-gray-500 dark:text-gray-400 text-center py-4">No game trivia found</div>}
              </div>
            </div>

            {/* Level Games */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <PuzzlePieceIcon className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Level Games ({userData.badges?.level_game?.length || 0})
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.badges?.level_game?.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img src={badge.image} alt={badge.title} className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(badge.date)}</p>
                    </div>
                  </div>
                )) || <div className="text-gray-500 dark:text-gray-400 text-center py-4">No level games found</div>}
              </div>
            </div>
          </motion.div>

          {/* Facilitator Milestone */}
          {isFacilitator && userData.facilitator_milestone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <CheckBadgeIcon className="w-8 h-8 text-white" />
                <h3 className="text-2xl font-bold text-white">
                  Facilitator Milestone (Aug 4 - Oct 6, 2025)
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Skill Badges in Facilitator Period */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2" />
                    Skill Badges ({userData.facilitator_milestone?.skill_badges?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {userData.facilitator_milestone?.skill_badges?.map((badge, index) => (
                      <div key={index} className="text-white/90 text-sm truncate">
                        • {badge.title}
                      </div>
                    )) || <div className="text-white/70 text-sm">No skill badges in this period</div>}
                  </div>
                </div>

                {/* Game Trivia in Facilitator Period */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Game Trivia ({userData.facilitator_milestone?.game_trivia?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {userData.facilitator_milestone?.game_trivia?.map((badge, index) => (
                      <div key={index} className="text-white/90 text-sm truncate">
                        • {badge.title}
                      </div>
                    )) || <div className="text-white/70 text-sm">No game trivia in this period</div>}
                  </div>
                </div>

                {/* Level Games in Facilitator Period */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <PuzzlePieceIcon className="w-5 h-5 mr-2" />
                    Level Games ({userData.facilitator_milestone?.level_games?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {userData.facilitator_milestone?.level_games?.length > 0 ? (
                      userData.facilitator_milestone.level_games.map((badge, index) => (
                        <div key={index} className="text-white/90 text-sm truncate">
                          • {badge.title}
                        </div>
                      ))
                    ) : (
                      <div className="text-white/70 text-sm">No level games yet</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Detailed Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Detailed Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userData.points_data?.normal_skill_badges_count || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Normal Badges</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {userData.points_data?.special_skill_badges_count || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Special Badges</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userData.points_data?.lab_free_count || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lab Free Courses</p>
              </div>
                            <div className="text-center">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {userData.points_data?.special_game_count || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Special Games</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return null
} 