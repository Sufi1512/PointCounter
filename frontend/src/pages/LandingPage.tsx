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
      
      // Show loading toast
      const loadingToast = toast.loading('Analyzing your profile...')
      
      // Navigate to dashboard with query parameters
      const params = new URLSearchParams({
        profileUrl: data.profileUrl,
        isFacilitator: data.isFacilitator.toString()
      })
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.dismiss(loadingToast)
      toast.success('Profile loaded successfully!')
      
      navigate(`/dashboard?${params.toString()}`)
      
    } catch (error) {
      toast.error('Failed to load profile. Please try again.')
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <>

      
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

              {/* Help Section */}
              <motion.div 
                variants={fadeInUp}
                className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How to find your profile URL
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                  <li>Visit <a href="https://www.cloudskillsboost.google/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Cloud Skills Boost</a></li>
                  <li>Sign in and navigate to your profile page</li>
                  <li>Copy the URL from your browser's address bar</li>
                  <li>Paste it in the field above</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Example URL:</strong>
                    <br />
                    <code className="font-mono bg-blue-200 dark:bg-blue-700 px-2 py-1 rounded">
                      https://www.cloudskillsboost.google/public_profiles/12345678-90ab-cdef-1234-567890abcdef
                    </code>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            variants={fadeInUp}
            className="text-center"
          >
            <div className="card-glass p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of learners in the Google Cloud Arcade program and unlock exclusive rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://go.cloudskillsboost.google/arcade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Visit Arcade
                </a>
                <a
                  href="https://rsvp.withgoogle.com/events/arcade-facilitator/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Learn More
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingOverlay 
          isVisible={isLoading}
          message="Analyzing your profile..."
        />
      )}
    </>
  )
}