import axios, { AxiosResponse } from 'axios'

// API base URL
const API_BASE_URL = 'http://localhost:8000'

// Types for the API response
export interface UserInfo {
  name: string
  profile_image: string
  profile_url: string
}

export interface PointsData {
  game_points: number
  game_trivia_points: number
  skill_badges_points: number
  special_skill_badges_points: number
  normal_skill_badges_points: number
  special_skill_badges_count: number
  normal_skill_badges_count: number
  lab_free_count: number
  special_game_count: number
  milestone: string
  milestone_bonus: number
  facilitator_bonus: number
  total_points: number
}

export interface Badge {
  title: string
  image: string
  date: string
}

export interface Badges {
  level_game: Badge[]
  trivia_game: Badge[]
  skill_badge: Badge[]
  special_badges_1_point: Badge[]
  special_badges_2_points: Badge[]
}

export interface FacilitatorMilestone {
  skill_badges: Badge[]
  game_trivia: Badge[]
  level_games: Badge[]
  flash_games: Badge[]
  lab_free_courses: Badge[]
}

export interface ApiResponse {
  user_information: UserInfo
  points_data: PointsData
  badges: Badges
  facilitator_milestone: FacilitatorMilestone
}

export interface ApiError {
  detail: string
  status_code: number
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error)
    if (error.response) {
      console.error('Error details:', error.response.data)
    }
    return Promise.reject(error)
  }
)

// API functions
export const api = {
  // Fetch user profile information
  fetchUserProfile: async (profileUrl: string, isFacilitator: boolean = false): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get<ApiResponse>('/fetch-info', {
        params: {
          profile_url: profileUrl,
          is_facilitator: isFacilitator,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          throw new Error('Invalid profile URL. Please check the URL format.')
        } else if (error.response?.status === 404) {
          throw new Error('Profile not found. Please check the URL.')
        } else if (error.response?.status && error.response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        } else {
          throw new Error(error.response?.data?.detail || 'Failed to fetch profile data.')
        }
      }
      throw new Error('Network error. Please check your connection.')
    }
  },

  // Get API health status
  getHealth: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await apiClient.get('/')
      return response.data
    } catch (error) {
      throw new Error('API is not responding. Please check if the backend is running.')
    }
  },

  // Get API help/documentation
  getHelp: async (): Promise<string> => {
    try {
      const response = await apiClient.get('/help')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch API documentation.')
    }
  },
}

// Utility functions
export const validateProfileUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('cloudskillsboost.google') && 
           urlObj.pathname.includes('/public_profiles/')
  } catch {
    return false
  }
}

export const formatDate = (dateString: string): string => {
  try {
    // Handle various date formats from the API
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      // If it's not a standard date, try to parse the "Earned" format
      const match = dateString.match(/Earned (.+)/)
      if (match) {
        return match[1]
      }
      return dateString
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0
  return Math.min((current / total) * 100, 100)
}

export default api 