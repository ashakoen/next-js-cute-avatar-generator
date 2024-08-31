'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Star, Sparkles, Upload, Download } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

// Mock API function
const mockGenerateAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Sending request to:', '/api/generate-avatar');
    const response = await fetch('/api/generate-avatar', {
      method: 'POST',
      body: formData
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.avatarUrl;
  } catch (error) {
    console.error('Error generating avatar:', error);
    throw error;
  }
};

export default function AvatarGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarCount, setAvatarCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Cleanup function to revoke object URL when component unmounts or file changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
      setAvatarUrl(null) // Reset avatar when new file is selected
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      setIsProcessing(true)
      try {
        const generatedAvatarUrl = await mockGenerateAvatar(file)
        setAvatarUrl(generatedAvatarUrl)
        setAvatarCount(prevCount => prevCount + 1)
        toast({
          title: "Yay! Your cute avatar is ready! 🎉",
          description: "Take a look at your adorable new self!",
          duration: 5000,
        })
      } catch (error) {
        toast({
          title: "Uh-oh! Something went wrong 😢",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
          duration: 5000,
        })
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleDownload = () => {
    if (avatarUrl) {
      fetch(avatarUrl)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = `cute-avatar-${avatarCount}.png`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          toast({
            title: "Woohoo! Avatar downloaded! 🌟",
            description: "Your cuteness is now saved forever!",
            duration: 3000,
          })
        })
        .catch(() => {
          toast({
            title: "Oops! Download hiccup! 🙈",
            description: "Please try downloading again.",
            variant: "destructive",
            duration: 3000,
          })
        })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 p-4">
      <Card className="w-full max-w-md mx-auto border-4 border-pink-300 rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <CardHeader className="bg-gradient-to-r from-pink-300 to-purple-300 text-white p-6">
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <Heart className="w-6 h-6 mr-2 text-red-400 animate-pulse" />
            Create Your Cute Avatar
            <Heart className="w-6 h-6 ml-2 text-red-400 animate-pulse" />
          </CardTitle>
          <CardDescription className="text-pink-100 text-center">Upload a photo and we'll turn it into an adorable animated avatar!</CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-b from-purple-100 to-pink-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="picture" className="text-purple-700 font-semibold block">Upload your photo</Label>
              <div className="flex items-center space-x-2 bg-white rounded-lg p-2 border-2 border-pink-300">
                <Button
                  type="button"
                  onClick={() => document.getElementById('picture')?.click()}
                  className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-semibold flex items-center"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Browse
                </Button>
                <span className="text-sm text-gray-500 truncate flex-1">
                  {file ? file.name : 'No file selected'}
                </span>
              </div>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {(preview || avatarUrl) && (
              <div className="mt-4 relative">
                <div className="w-full pb-[100%] relative overflow-hidden rounded-lg border-4 border-purple-300">
                  <img 
                    src={avatarUrl || preview} 
                    alt={avatarUrl ? "Your cute avatar" : "Preview"} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-pink-200 bg-opacity-70 rounded-lg">
                    <div className="animate-spin">
                      <Star className="w-12 h-12 text-yellow-400" />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex space-x-2">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-full transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                disabled={!file || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Creating Magic...
                  </>
                ) : avatarCount > 0 ? (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Create Another!
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Create Cute Avatar
                  </>
                )}
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  onClick={handleDownload}
                  className="bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-full transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <Download className="w-5 h-5" />
                  <span className="sr-only">Download Avatar</span>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
