'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  login as authLogin,
  logout as authLogout,
  getAuthToken,
  getAuthUser,
  clearAuthToken,
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from '@/utils/auth'

export interface UseAuthReturn {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize auth state on mount
  useEffect(() => {
    const token = getAuthToken()
    const authUser = getAuthUser()

    if (token && authUser) {
      setUser(authUser)
    }
    setIsHydrated(true)
  }, [])

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response: LoginResponse = await authLogin(credentials)

      if (response.status) {
        setUser(response.data.user)
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(errorMessage)
      console.error('[v0] Login failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await authLogout()
      setUser(null)
      clearAuthToken()
      router.push('/login')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      console.error('[v0] Logout failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    isAuthenticated: !!user && !!getAuthToken(),
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    clearError,
  }
}
