'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    return regex.test(password)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSigningUp(true)

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.')
      setIsSigningUp(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setIsSigningUp(false)
      return
    }

    // Simulate sign-up process
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Simulated successful sign-up
    setSuccess(true)
    setIsSigningUp(false)
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
            <CardTitle className="text-3xl font-bold text-center text-green-700">Wellness Sign Up</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <p className="text-xs text-gray-600">
              Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.
            </p>
            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 bg-green-100 text-green-800 border-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your account has been created successfully!</AlertDescription>
            </Alert>
          )}
          
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account? <Link href=".." className="text-green-600 hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}