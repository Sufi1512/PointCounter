import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// Components
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ProfileForm } from '@/components/landing/ProfileForm'
import { CohortAlert } from '@/components/landing/CohortAlert'
import { StatsPreview } from '@/components/landing/StatsPreview'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

// 3D Background Components
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { CubeAnimation } from '@/components/ui/CubeAnimation'
import { FloatingParticles } from '@/components/ui/FloatingParticles'

// Types
interface ProfileFormData {
  profileUrl: string
  isFacilitator: boolean
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const LandingPage: React.FC = () => {
  console.log('LandingPage component rendering...')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      profileUrl: '',
      isFacilitator: false
    }
  })

  const profileUrl = watch('profileUrl')

  const validateProfileUrl = (url: string): boolean | string => {
    if (!url) return 'Profile URL is required'
    
    const urlPattern = /^https:\/\/(www\.cloudskillsboost\.google|cloudskillsboost\.google\.com|www\.qwiklabs\.com)\/(public_profiles|profile|users)\/[a-zA-Z0-9-]+/
    
    if (!urlPattern.test(url)) {
      return 'Please enter a valid Google Cloud Skills Boost profile URL'
    }
    
    return true
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      
      // Show loading toast with better message
      const loadingToast = toast.loading('🔍 Analyzing your profile and calculating points...', {
        duration: 3000
      })
      
      // Navigate to dashboard with query parameters
      const params = new URLSearchParams({
        profileUrl: data.profileUrl,
        isFacilitator: data.isFacilitator.toString()
      })
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.dismiss(loadingToast)
      toast.success('🎉 Profile loaded successfully! Redirecting to dashboard...', {
        duration: 2000
      })
      
      // Small delay before navigation for better UX
      setTimeout(() => {
        navigate(`/dashboard?${params.toString()}`)
      }, 1000)
      
    } catch (error) {
      toast.error('❌ Failed to load profile. Please check your URL and try again.')
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <>
      {/* 3D Background Animations */}
      <AnimatedBackground />
      <CubeAnimation />
      <FloatingParticles />
      
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="relative"
      >
        {/* Hero Section */}
        <motion.div variants={fadeInUp}>
          <HeroSection />
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          
          {/* Cohort Alert */}
          <motion.div variants={fadeInUp}>
            <CohortAlert />
          </motion.div>

          {/* Features Section */}
          <motion.div variants={fadeInUp}>
            <FeaturesSection />
          </motion.div>

          {/* Stats Preview */}
          <motion.div variants={fadeInUp}>
            <StatsPreview />
          </motion.div>

          {/* Profile Form Section */}
          <motion.div 
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
            data-form-section
          >
            <div className="card-glass p-8 lg:p-12">
              <div className="text-center mb-8">
                <motion.h2 
                  className="text-3xl lg:text-4xl font-bold gradient-text mb-4"
                  variants={fadeInUp}
                >
                  Track Your Progress
                </motion.h2>
                <motion.p 
                  className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                  variants={fadeInUp}
                >
                  Enter your Google Cloud Skills Boost profile URL to get detailed analytics, 
                  progress tracking, and milestone insights.
                </motion.p>
              </div>

              <ProfileForm
                onSubmit={onSubmit}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                isValid={isValid}
                isLoading={isLoading}
                watch={watch}
                reset={reset}
              />

              {/* Enhanced Help Section */}
              <motion.div 
                variants={fadeInUp}
                className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center text-lg">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How to find your profile URL
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Step-by-step guide:</h5>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-3 list-decimal list-inside">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        <span>Visit <a href="https://www.cloudskillsboost.google/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 font-medium">Cloud Skills Boost</a></span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        <span>Sign in with your Google account</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        <span>Click your profile picture → "View Profile"</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">4.</span>
                        <span>Copy the URL from your browser's address bar</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Example URL format:</h5>
                    <div className="p-4 bg-blue-100 dark:bg-blue-800/30 rounded-lg border-l-4 border-blue-400">
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                        <strong>✅ Valid URL:</strong>
                      </p>
                      <code className="font-mono bg-blue-200 dark:bg-blue-700 px-3 py-2 rounded text-xs block break-all">
                        https://www.cloudskillsboost.google/public_profiles/12345678-90ab-cdef-1234-567890abcdef
                      </code>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        <strong>❌ Don't use:</strong> Image URLs, private profiles, or other domains
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Call to Action */}
          <motion.div 
            variants={fadeInUp}
            className="text-center"
          >
            <div className="card-glass p-8 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Ready to Start Your Journey?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Join thousands of learners in the Google Cloud Arcade program and unlock exclusive rewards, 
                track your progress, and compete with fellow cloud enthusiasts!
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Track Progress</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your learning journey with detailed analytics</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Earn Rewards</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unlock badges and compete for milestones</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Join Community</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect with fellow cloud learners worldwide</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://go.cloudskillsboost.google/arcade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  🎮 Visit Arcade
                </a>
                <a
                  href="https://rsvp.withgoogle.com/events/arcade-facilitator/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  📚 Learn More
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => {
            const formSection = document.querySelector('[data-form-section]');
            formSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="Quick Start - Enter Profile URL"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingOverlay 
          isVisible={isLoading}
          message="🔍 Analyzing your profile and calculating points..."
        />
      )}
    </>
  )
}