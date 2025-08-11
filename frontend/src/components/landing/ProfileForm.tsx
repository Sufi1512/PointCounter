import React from 'react'
import { motion } from 'framer-motion'

interface ProfileFormData {
  profileUrl: string
  isFacilitator: boolean
}

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void
  isLoading: boolean
  register: any
  handleSubmit: any
  errors: any
  isValid: boolean
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  onSubmit,
  isLoading,
  register,
  handleSubmit,
  errors,
  isValid
}) => {

  const validateProfileUrl = (url: string): boolean | string => {
    if (!url) return 'Profile URL is required'
    
    // Accept both cloudskillsboost.google and www.cloudskillsboost.google
    const urlPattern = /^https:\/\/(www\.)?cloudskillsboost\.google\/public_profiles\/[a-zA-Z0-9-]+/
    
    if (!urlPattern.test(url)) {
      return 'Please enter a valid Google Cloud Skills Boost profile URL'
    }
    
    return true
  }



  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Track Your Progress
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Enter your Google Cloud Skills Boost profile URL to get started
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile URL
              </label>
              <div className="relative">
                <input
                  {...register('profileUrl', {
                    validate: validateProfileUrl
                  })}
                  type="url"
                  id="profileUrl"
                  placeholder="https://www.cloudskillsboost.google/public_profiles/your-profile-id"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                    errors.profileUrl
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  disabled={isLoading}
                />
                {errors.profileUrl && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.profileUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('isFacilitator')}
                type="checkbox"
                id="isFacilitator"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                disabled={isLoading}
              />
              <label htmlFor="isFacilitator" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I am a facilitator (earn bonus points)
              </label>
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Profile'
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How to find your profile URL:
            </h3>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                Go to <a href="https://www.cloudskillsboost.google" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google Cloud Skills Boost</a>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                Click on your profile picture in the top right corner
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                Select "View Profile" from the dropdown menu
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
                Copy the URL from your browser's address bar
              </li>
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 