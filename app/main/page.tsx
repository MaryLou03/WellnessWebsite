'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth, database } from '../../firebase'  // Adjust the path as necessary
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, push, onValue, off } from 'firebase/database'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, FileText, Upload, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const wellnessActivities = [
  "Walking",
  "Running",
  "Biking",
  "Swimming",
  "Yoga",
  "Meditation",
  "Weight Training",
  "Dancing",
  "Hiking",
  "Pilates"
]

export default function WellnessWebsite() {
  const [user, setUser] = useState<{ displayName: string | null, email: string | null }>({ displayName: null, email: null })
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [parsedText, setParsedText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [activities, setActivities] = useState<{[key: string]: {checked: boolean, hours: number}}>
    (Object.fromEntries(wellnessActivities.map(activity => [activity, {checked: false, hours: 0}])))
  const [userActivities, setUserActivities] = useState<any[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '', isError: false })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError('')
    } else {
      setFile(null)
      setError('Please select a valid PDF file.')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    setError('')
    setParsedText('')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setParsedText('This is a sample parsed text from the PDF. In a real application, this would be the actual content extracted from the uploaded PDF file.')
    } catch (err) {
      setError('An error occurred while parsing the PDF. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivityChange = (activity: string, checked: boolean) => {
    setActivities(prev => ({...prev, [activity]: {...prev[activity], checked}}))
  }

  const handleHoursChange = (activity: string, hours: number) => {
    setActivities(prev => ({...prev, [activity]: {...prev[activity], hours}}))
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || 'User',
          email: currentUser.email || 'No email provided'
        })

        const userActivitiesRef = ref(database, 'userActivities/' + currentUser.email?.replace('.',','))
        onValue(userActivitiesRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const activitiesArray = Object.entries(data).map(([key, value]) => ({
              id: key,
              ...value as any
            }))
            setUserActivities(activitiesArray)
          } else {
            setUserActivities([])
          }
        })
      } else {
        setUser({ displayName: null, email: null })
        setUserActivities([])
        router.push('/')
      }
    })
        // Cleanup subscription on unmount
        return () => {
          unsubscribe()
          const userActivitiesRef = ref(database, 'userActivities/' + user.email?.replace('.',','))
          off(userActivitiesRef, 'value')
        }
      }, [router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser({ displayName: null, email: null })
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSubmit = async () => {
    if (!user.email) {
      setModalContent({
        title: 'Error',
        message: 'Please sign in to submit data.',
        isError: true
      })
      setShowModal(true)
      return
    }

    const userActivitiesRef = ref(database, 'userActivities/' + user.email.replace('.',','))
    
    try {
      await push(userActivitiesRef, {
        activities: activities,
        timestamp: new Date().toISOString()
      })
      setModalContent({
        title: 'Success',
        message: 'Data submitted successfully!',
        isError: false
      })
    } catch (error) {
      console.error('Error submitting data:', error)
      setModalContent({
        title: 'Error',
        message: 'Error submitting data. Please try again.',
        isError: true
      })
    } finally {
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1920&q=80')"}}>
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-center space-x-4">
            <svg width="60" height="40" viewBox="0 0 60 40" className="text-green-700">
              <path d="M0 40 L15 0 L30 40 L45 0 L60 40 M15 40 L30 0 L45 40" fill="none" stroke="white" strokeWidth="8" />
              <path d="M0 40 L15 0 L30 40 L45 0 L60 40 M15 40 L30 0 L45 40" fill="currentColor" />
            </svg>
            <CardTitle className="text-3xl font-bold text-center text-green-700">Wellness Website</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 bg-white/60 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-600">User Profile</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" alt="User's profile picture" />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user.displayName || 'User Name'}</h3>
                  <p className="text-sm text-gray-500">{user.email || 'user@example.com'}</p>
                </div>
              </div>
              <Button onClick={handleSignOut} variant="outline" className="text-red-600 border-red-600 hover:bg-red-100">
                Sign Out
              </Button>
    </div>
</div>

          <div className="border rounded-lg p-4 bg-white/60 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Weekly Activities</h2>
            <div className="grid grid-cols-2 gap-4">
              {wellnessActivities.map((activity) => (
                <div key={activity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={activity}
                      checked={activities[activity].checked}
                      onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                    />
                    <Label htmlFor={activity}>{activity}</Label>
                  </div>
                  <div className="flex items-center space-x-2 w-1/2">
                    <Slider
                      disabled={!activities[activity].checked}
                      value={[activities[activity].hours]}
                      onValueChange={(value) => handleHoursChange(activity, value[0])}
                      max={20}
                      step={0.5}
                      className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-green-500"
                    />
                    <span className="w-12 text-sm">{activities[activity].hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-white/60 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Medical Records</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button onClick={handleUpload} disabled={!file || isLoading}>
                  {isLoading ? 'Parsing...' : 'Upload & Parse'}
                  {!isLoading && <Upload className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {parsedText && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      <FileText className="inline mr-2 h-5 w-4" />
                      Parsed Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{parsedText}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-white/60 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Your Activities</h2>
            {userActivities.length > 0 ? (
              <ul className="space-y-2">
                {userActivities.map((activity, index) => (
                  <li key={activity.id} className="bg-white p-2 rounded shadow">
                    <p className="font-semibold">Submission {index + 1}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(activity.timestamp).toLocaleString()}</p>
                    <ul className="ml-4 list-disc">
                      {Object.entries(activity.activities).map(([name, details]:[string, any]) => (
                        details.checked && (
                          <li key={name}>
                            {name}: {details.hours} hours
                          </li>
                        )
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No previousactivities found.</p>
            )}
          </div>
                       
          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Submit Activities
          </Button>
        
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className={modalContent.isError ? "text-red-600" : "text-green-600"}>
                  {modalContent.isError ? <AlertCircle className="inline mr-2" /> : <CheckCircle className="inline mr-2" />}
                  {modalContent.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{modalContent.message}</p>
                <Button onClick={closeModal} className="mt-4 w-full">
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        </CardContent>
      </Card>
    </div>
  )
}