import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  displayName: string
}

interface AuthState {
  user: User | null
  token: string | null
  expiresAt: number | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ 
    user: null, 
    token: null, 
    expiresAt: null 
  })
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const { user, token, expiresAt } = JSON.parse(storedAuth)
        
        // Check if token has expired
        if (expiresAt && Date.now() >= expiresAt) {
          localStorage.removeItem('auth')
        } else {
          setAuthState({ user, token, expiresAt })
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      localStorage.removeItem('auth')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update localStorage whenever auth state changes
  useEffect(() => {
    if (authState.token) {
      localStorage.setItem('auth', JSON.stringify(authState))
    } else {
      localStorage.removeItem('auth')
    }
  }, [authState])

  // Check token expiration periodically
  useEffect(() => {
    const checkExpiration = () => {
      if (authState.expiresAt && Date.now() >= authState.expiresAt) {
        setAuthState({ user: null, token: null, expiresAt: null })
      }
    }

    const interval = setInterval(checkExpiration, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [authState.expiresAt])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const { token, user, expiresInTime } = await response.json()
      const expiresAt = Date.now() + expiresInTime * 1000 // Convert to milliseconds


      setAuthState({ user, token, expiresAt })

      return user
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      const { token, user, expiresInTime } = await response.json()
      const expiresAt = Date.now() + expiresInTime * 1000 // Convert to milliseconds

      setAuthState({ user, token, expiresAt })
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error 
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setAuthState({ user: null, token: null, expiresAt: null })
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: !!authState.token,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

