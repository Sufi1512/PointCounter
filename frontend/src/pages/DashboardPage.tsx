import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from 'react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
import { api, validateProfileUrl, formatDate, Badge } from '@/services/api'

export const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [profileUrl, setProfileUrl] = useState('')
  const [isFacilitator, setIsFacilitator] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  // Get URL parameters on component mount
  useEffect(() => {
    const urlProfileUrl = searchParams.get('profileUrl')
    const urlIsFacilitator = searchParams.get('isFacilitator') === 'true'
    
    if (urlProfileUrl) {
      setProfileUrl(urlProfileUrl)
      setIsFacilitator(urlIsFacilitator)
      setHasSearched(true)
    }
  }, [searchParams])

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
      enabled: Boolean(profileUrl) && hasSearched, // Auto-fetch when we have URL params
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

  const handleSearchAnother = () => {
    // Clear React Query cache
    queryClient.removeQueries(['userData'])
    queryClient.clear()
    
    // Reset all state
    setProfileUrl('')
    setIsFacilitator(false)
    setHasSearched(false)
    setIsLoading(false)
    
    // Don't navigate - just reset the form to allow searching another profile
  }

  const handleCardClick = (cardType: string) => {
    if (expandedCard === cardType) {
      setExpandedCard(null)
    } else {
      setExpandedCard(cardType)
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

  // Show form if no data yet or if user wants to search another
  if (!userData || !hasSearched) {
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
              {userData ? 'Search Another Profile' : 'Google Cloud Arcade Dashboard'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400"
          >
              {userData ? 'Enter another SkillBoost profile URL to search' : 'Enter your SkillBoost profile URL to get started'}
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
                {isLoading ? 'Fetching Profile...' : (userData ? 'Search Profile' : 'Get My Dashboard')}
              </button>
            </form>

            {/* Back to Home/Back to Dashboard Button */}
            <div className="mt-6 text-center">
              {userData ? (
                <button
                  onClick={() => setHasSearched(true)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  ← Back to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  ← Back to Home
                </button>
              )}
            </div>

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
          {/* Enhanced Header with search again button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center sm:justify-start mb-3"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Arcade Dashboard
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600 dark:text-gray-400"
              >
                🎉 Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{userData.user_information.name}</span>!
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-gray-500 dark:text-gray-500 mt-1"
              >
                Track your progress and unlock achievements in the Google Cloud Arcade program
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => window.open(userData.user_information.profile_url, '_blank')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                </svg>
                View Profile
              </button>
              <button
              onClick={() => setHasSearched(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Another
              </button>
            </motion.div>
          </div>

          {/* Enhanced User Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-xl p-6 mb-8 border border-blue-100 dark:border-blue-800"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
              <img
                src={userData.user_information.profile_image}
                alt={userData.user_information.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userData.user_information.name}
          </h2>
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Active Learner
                  </span>
                  {userData.points_data?.milestone !== "No Milestone Achieved" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      {userData.points_data?.milestone}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Google Cloud Skills Boost Profile • Total Points: <span className="font-semibold text-blue-600 dark:text-blue-400">{userData.points_data?.total_points || 0}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                <a
                  href={userData.user_information.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    </svg>
                    View Profile
                  </a>
                  <button
                    onClick={handleSearchAnother}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Another
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animated Points Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Points Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Total Points card is the main focus, other cards are stacked behind
              </p>
            </div>
            
            <div className="relative">
              {/* Total Points Card - Main Focus Card (Always Large & Prominent) */}
              <motion.div 
                layout
                className="relative z-30 mb-8 bg-white dark:bg-gray-900 rounded-3xl p-2"
              >
                <motion.div 
                  layout
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-blue-100 text-lg font-medium mb-2">🏆 Total Points</p>
                      <motion.p 
                        layout
                        className="text-6xl font-bold"
                      >
                        {userData.points_data?.total_points || 0}
                      </motion.p>
                      <p className="text-blue-200 text-lg mt-2">Your Arcade Score</p>
                    </div>
                    <div className="w-24 h-24 bg-blue-400/20 rounded-full flex items-center justify-center">
                      <TrophyIcon className="w-16 h-16 text-blue-200" />
                    </div>
                  </div>
                  
                  {/* Always Visible Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-400/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-100">
                        {userData.points_data?.skill_badges_points || 0}
                      </div>
                      <div className="text-sm text-blue-200">Skill Badges</div>
                    </div>
                    <div className="text-center p-4 bg-blue-400/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-100">
                        {userData.points_data?.game_trivia_points || 0}
                      </div>
                      <div className="text-sm text-blue-200">Game Trivia</div>
                    </div>
                    <div className="text-center p-4 bg-blue-400/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-100">
                        {userData.points_data?.flash_game_points || 0}
                      </div>
                      <div className="text-sm text-blue-200">Flash Games</div>
                    </div>
                    <div className="text-center p-4 bg-blue-400/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-100">
                        {userData.points_data?.milestone_bonus || 0}
                      </div>
                      <div className="text-sm text-blue-200">Milestone Bonus</div>
                    </div>
                  </div>
                  
                  {/* Next Milestone Info */}
                  <div className="mt-6 text-center">
                    <p className="text-blue-100 text-lg">
                      Next milestone at: <span className="font-semibold">100 points</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Other Cards - Stacked Behind Total Points */}
              <div className="relative z-20">
                {/* Stack all cards behind Total Points with layered positioning */}
                <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ 
                  transform: 'translateY(-80px)',
                  top: '60%',
                  left: '0',
                  right: '0'
                }}>
                  {/* Add depth layers with different z-indices */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-800 opacity-30 rounded-3xl" style={{ zIndex: -1 }}></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-200 dark:to-gray-700 opacity-20 rounded-3xl" style={{ zIndex: -2 }}></div>
                  {/* Skill Badges Card - Back Layer */}
                  <motion.div 
                    layout
                    onClick={() => handleCardClick('skill')}
                    className="relative cursor-pointer transition-all duration-500"
                  >
                    <motion.div 
                      layout
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 opacity-60 hover:opacity-100 filter blur-[0.5px] hover:blur-none"
                    >
              <div className="flex items-center justify-between">
                <div>
                          <p className="text-purple-100 text-sm font-medium mb-1">⭐ Skill Badges</p>
                          <motion.p 
                            layout
                            className="text-4xl font-bold"
                          >
                            {userData.points_data?.skill_badges_points || 0}
                          </motion.p>
                          <p className="text-purple-200 text-xs mt-1">Knowledge Points</p>
                </div>
                        <div className="w-16 h-16 bg-purple-400/20 rounded-full flex items-center justify-center">
                          <StarIcon className="w-10 h-10 text-purple-200" />
              </div>
            </div>
            
                      {/* Expanded Content */}
                      <motion.div
                        initial={false}
                        animate={{ 
                          opacity: expandedCard === 'skill' ? 1 : 0,
                          height: expandedCard === 'skill' ? 'auto' : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {expandedCard === 'skill' && (
                          <div className="mt-6 pt-6 border-t border-purple-400/30">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-3 bg-purple-400/20 rounded-lg">
                                <div className="text-2xl font-bold text-purple-100">
                                  {userData.points_data?.normal_skill_badges_count || 0}
                                </div>
                                <div className="text-xs text-purple-200">Normal Badges</div>
                              </div>
                              <div className="text-center p-3 bg-purple-400/20 rounded-lg">
                                <div className="text-2xl font-bold text-purple-100">
                                  {userData.points_data?.special_skill_badges_count || 0}
                                </div>
                                <div className="text-xs text-purple-200">Special Badges</div>
                              </div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="text-purple-100 text-sm">
                                Total badges earned: <span className="font-semibold">{userData.badges?.skill_badge?.length || 0}</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Game Trivia Card - Back Layer */}
                  <motion.div 
                    layout
                    onClick={() => handleCardClick('trivia')}
                    className="relative cursor-pointer transition-all duration-500"
                  >
                    <motion.div 
                      layout
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 opacity-60 hover:opacity-100 filter blur-[0.5px] hover:blur-none"
                    >
              <div className="flex items-center justify-between">
                <div>
                          <p className="text-green-100 text-sm font-medium mb-1">🧩 Game Trivia</p>
                          <motion.p 
                            layout
                            className="text-4xl font-bold"
                          >
                            {userData.points_data?.game_trivia_points || 0}
                          </motion.p>
                          <p className="text-green-200 text-xs mt-1">Weekly Challenges</p>
                </div>
                        <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center">
                          <PuzzlePieceIcon className="w-10 h-10 text-green-200" />
              </div>
            </div>
            
                      {/* Expanded Content */}
                      <motion.div
                        initial={false}
                        animate={{ 
                          opacity: expandedCard === 'trivia' ? 1 : 0,
                          height: expandedCard === 'trivia' ? 'auto' : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {expandedCard === 'trivia' && (
                          <div className="mt-6 pt-6 border-t border-green-400/30">
                            <div className="text-center p-3 bg-green-400/20 rounded-lg">
                              <div className="text-2xl font-bold text-green-100">
                                {userData.badges?.trivia_game?.length || 0}
                              </div>
                              <div className="text-xs text-green-200">Trivia Games Completed</div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="text-green-100 text-sm">
                                Weekly challenges completed successfully
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Milestone Card - Back Layer */}
                  <motion.div 
                    layout
                    onClick={() => handleCardClick('milestone')}
                    className="relative cursor-pointer transition-all duration-500"
                  >
                    <motion.div 
                      layout
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 opacity-60 hover:opacity-100 filter blur-[0.5px] hover:blur-none"
                    >
              <div className="flex items-center justify-between">
                <div>
                          <p className="text-orange-100 text-sm font-medium mb-1">🔥 Milestone</p>
                          <motion.p 
                            layout
                            className="text-lg font-bold"
                          >
                            {userData.points_data?.milestone || 'No Milestone'}
                          </motion.p>
                          <p className="text-orange-200 text-xs mt-1">Achievement Status</p>
                </div>
                        <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center">
                          <FireIcon className="w-10 h-10 text-orange-200" />
              </div>
            </div>
            
                      {/* Expanded Content */}
                      <motion.div
                        initial={false}
                        animate={{ 
                          opacity: expandedCard === 'milestone' ? 1 : 0,
                          height: expandedCard === 'milestone' ? 'auto' : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {expandedCard === 'milestone' && (
                          <div className="mt-6 pt-6 border-t border-orange-400/30">
                            <div className="text-center p-3 bg-orange-400/20 rounded-lg">
                              <div className="text-2xl font-bold text-orange-100">
                                {userData.points_data?.milestone_bonus || 0}
                              </div>
                              <div className="text-xs text-orange-200">Bonus Points</div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="text-orange-100 text-sm">
                                {userData.points_data?.milestone === "No Milestone Achieved" 
                                  ? "Keep earning points to unlock your first milestone!"
                                  : `Congratulations! You've earned ${userData.points_data?.milestone_bonus || 0} bonus points!`
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Flash Games Card - Back Layer */}
                  <motion.div 
                    layout
                    onClick={() => handleCardClick('flash')}
                    className="relative cursor-pointer transition-all duration-500"
                  >
                    <motion.div 
                      layout
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 opacity-60 hover:opacity-100 filter blur-[0.5px] hover:blur-none"
                    >
              <div className="flex items-center justify-between">
                <div>
                          <p className="text-indigo-100 text-sm font-medium mb-1">⚡ Flash Games</p>
                          <motion.p 
                            layout
                            className="text-4xl font-bold"
                          >
                            {userData.points_data?.flash_game_points || 0}
                          </motion.p>
                          <p className="text-indigo-200 text-xs mt-1">Special Rewards</p>
                </div>
                        <div className="w-16 h-16 bg-indigo-400/20 rounded-full flex items-center justify-center">
                          <StarIcon className="w-10 h-10 text-indigo-200" />
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      <motion.div
                        initial={false}
                        animate={{ 
                          opacity: expandedCard === 'flash' ? 1 : 0,
                          height: expandedCard === 'flash' ? 'auto' : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {expandedCard === 'flash' && (
                          <div className="mt-6 pt-6 border-t border-indigo-400/30">
                            <div className="text-center p-3 bg-indigo-400/20 rounded-lg">
                              <div className="text-2xl font-bold text-indigo-100">
                                {userData.badges?.flash_games?.length || 0}
                              </div>
                              <div className="text-xs text-indigo-200">Flash Games Completed</div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="text-indigo-100 text-sm">
                                Special arcade games with bonus points
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Lab Courses Card - Back Layer */}
                  <motion.div 
                    layout
                    onClick={() => handleCardClick('lab')}
                    className="relative cursor-pointer transition-all duration-500"
                  >
                    <motion.div 
                      layout
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 opacity-60 hover:opacity-100 filter blur-[0.5px] hover:blur-none"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-teal-100 text-sm font-medium mb-1">📚 Lab Courses</p>
                          <motion.p 
                            layout
                            className="text-4xl font-bold"
                          >
                            {userData.badges?.lab_free_courses?.length || 0}
                          </motion.p>
                          <p className="text-teal-200 text-xs mt-1">Free Learning</p>
                        </div>
                        <div className="w-16 h-16 bg-teal-400/20 rounded-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-teal-200" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      <motion.div
                        initial={false}
                        animate={{ 
                          opacity: expandedCard === 'lab' ? 1 : 0,
                          height: expandedCard === 'lab' ? 'auto' : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {expandedCard === 'lab' && (
                          <div className="mt-6 pt-6 border-t border-teal-400/30">
                            <div className="text-center p-3 bg-teal-400/20 rounded-lg">
                              <div className="text-2xl font-bold text-teal-100">
                                {userData.points_data?.lab_free_count || 0}
                              </div>
                              <div className="text-xs text-teal-200">Lab Courses Count</div>
                            </div>
                            <div className="mt-4 text-center">
                              <p className="text-teal-100 text-sm">
                                Free courses with hands-on labs completed
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress & Achievement Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Bar */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Progress Overview
                </h3>
                
                <div className="space-y-4">
                  {/* Total Points Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Points</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {userData.points_data?.total_points || 0} / 100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min((userData.points_data?.total_points || 0) / 100 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Next Milestone */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🎯 Next Milestone</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {userData.points_data?.milestone === "No Milestone Achieved" 
                        ? "You're on your way to Milestone 1! Keep earning points to unlock achievements."
                        : `Great job! You've achieved ${userData.points_data?.milestone}. Keep going for the next level!`
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {userData.badges?.skill_badge?.length || 0}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">Skill Badges</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {userData.badges?.game_trivia?.length || 0}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Trivia Games</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {userData.badges?.level_game?.length || 0}
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Level Games</div>
                  </div>
                  
                  <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {userData.badges?.lab_free_courses?.length || 0}
                    </div>
                    <div className="text-sm text-teal-700 dark:text-teal-300">Lab Courses</div>
                  </div>
                </div>
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
                {userData.badges?.skill_badge?.map((badge: Badge, index: number) => (
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
                {userData.badges?.trivia_game?.map((badge: Badge, index: number) => (
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <PuzzlePieceIcon className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Level Games ({userData.badges?.level_game?.length || 0})
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.badges?.level_game?.map((badge: Badge, index: number) => (
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

          {/* Flash Games Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Flash Games ({userData.badges?.flash_games?.length || 0})
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Special arcade games with bonus points - Total: {userData.points_data?.flash_game_points || 0} points
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.badges?.flash_games?.map((badge: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    {badge.image ? (
                      <img 
                        src={badge.image} 
                        alt={badge.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                        <StarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          {badge.title.toLowerCase().includes('extraskillestrial') ? '+2 Points' : '+1 Point'}
                        </p>
                        {badge.date && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            • {badge.date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <div className="text-gray-500 dark:text-gray-400 text-center py-4">No flash games found</div>}
              </div>
            </div>
          </motion.div>

          {/* Special Badges Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Special Badges
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                These badges provide bonus points and special recognition
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Special Badges 1 Point */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <StarIcon className="w-8 h-8 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Special Badges - 1 Point ({userData.special_badges_1_point?.length || 0})
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.special_badges_1_point?.map((badge: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    {badge.image ? (
                      <img 
                        src={badge.image} 
                        alt={badge.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center">
                        <StarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">+1 Point</p>
                        {badge.date && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            • {badge.date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <div className="text-gray-500 dark:text-gray-400 text-center py-4">No special badges found</div>}
              </div>
            </div>

            {/* Special Badges 2 Points */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <FireIcon className="w-8 h-8 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Special Game Badges - 2 Points ({userData.special_badges_2_points?.length || 0})
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.special_badges_2_points?.map((badge: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    {badge.image ? (
                      <img 
                        src={badge.image} 
                        alt={badge.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                        <FireIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">+2 Points</p>
                        {badge.date && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            • {badge.date}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <div className="text-gray-500 dark:text-gray-400 text-center py-4">No special game badges found</div>}
              </div>
            </div>
            </div>
          </motion.div>

          {/* Lab Free Courses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Lab Free Courses ({userData.badges?.lab_free_courses?.length || 0})
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Free courses completed with hands-on labs and practical experience
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userData.badges?.lab_free_courses?.map((badge: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                    {badge.image ? (
                      <img 
                        src={badge.image} 
                        alt={badge.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </p>
                      {badge.date && (
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1">
                          {formatDate(badge.date)}
                        </p>
                      )}
                    </div>
                  </div>
                )) || <div className="text-gray-500 dark:text-gray-400 text-center py-4">No lab free courses found</div>}
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
                    {userData.facilitator_milestone?.skill_badges?.map((badge: Badge, index: number) => (
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
                    {userData.facilitator_milestone?.game_trivia?.map((badge: Badge, index: number) => (
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
                      userData.facilitator_milestone.level_games.map((badge: Badge, index: number) => (
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