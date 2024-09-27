'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase'  // Adjust the import path as necessary
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/main')
    } catch (error) {
      setError('Failed to log in. Please check your credentials.')
      console.error(error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/main')
    } catch (error) {
      setError('Failed to log in with Google.')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1920&q=80')"}}>
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-center space-x-4">
            <svg width="60" height="40" viewBox="0 0 60 40" className="text-green-700">
              <path d="M0 40 L15 0 L30 40 L45 0 L60 40 M15 40 L30 0 L45 40" fill="none" stroke="white" strokeWidth="8" />
              <path d="M0 40 L15 0 L30 40 L45 0 L60 40 M15 40 L30 0 L45 40" fill="currentColor" />
            </svg>
            <CardTitle className="text-3xl font-bold text-center text-green-700">Wellness Login</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Log In with Email'}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2">
            <Button onClick={handleGoogleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
              Log In with Google
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account? <Link href="/signup" className="text-green-600 hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}