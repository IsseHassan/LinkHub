'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, LinkIcon, Upload, Camera, Plus } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { nanoid } from 'nanoid';

interface Link {
  id: string
  title: string
  url: string
  shortUrl: string
}

interface Memory {
  id: string
  title: string
  imageUrl: string
}

interface Theme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
}

interface Profile {
  displayName: string
  bio: string
  avatar: string
  links: Link[]
  memories: Memory[]
  theme: string
}

const themes: Theme[] = [
  { id: '1', name: 'Default', primaryColor: 'bg-black/5', secondaryColor: 'bg-zinc-900' },
  { id: '2', name: 'Dark Blue', primaryColor: 'bg-blue-950/25', secondaryColor: 'bg-blue-900' },
  { id: '3', name: 'Dark Green', primaryColor: 'bg-green-950/25', secondaryColor: 'bg-green-900' },
  { id: '4', name: 'Dark Purple', primaryColor: 'bg-purple-950/25', secondaryColor: 'bg-purple-900' },
]

export default function ProfileEditor() {
  const { token } = useAuth()
  const [profile, setProfile] = useState<Profile>({
    displayName: '',
    bio: '',
    avatar: '/placeholder.svg',
    links: [],
    memories: [],
    theme: 'Default'
  })
  const [uniqueLink, setUniqueLink] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://link-hub-api.vercel.app/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setUniqueLink(`http://localhost:5173/profile?username=${data.displayName}`);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('https://link-hub-api.vercel.app/api/profile/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(prev => ({ ...prev, avatar: data.imageUrl }))
          toast({
            title: "Success",
            description: "Profile picture updated successfully.",
          })
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
      }
    }
  }


  const onMemoryDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('https://link-hub-api.vercel.app/api/profile/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          const newMemory = {
            id: Math.random().toString(),
            title: file.name,
            imageUrl: data.imageUrl
          }
          setProfile(prev => ({
            ...prev,
            memories: [...prev.memories, newMemory]
          }))
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [token])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onMemoryDrop,
    accept: { 'image/*': [] }
  })

  const addLink = () => {
    const shortUrl = nanoid(8)
    const newLink = {
      id: Math.random().toString(),
      title: '',
      url: '',
      shortUrl: shortUrl
    }
    setProfile(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }))
  }

  const removeLink = (id: string) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }))
  }

  const updateLink = (id: string, field: 'title' | 'url', value: string) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeMemory = (id: string) => {
    setProfile(prev => ({
      ...prev,
      memories: prev.memories.filter(memory => memory.id !== id)
    }))
  }

  const updateMemoryTitle = (id: string, title: string) => {
    setProfile(prev => ({
      ...prev,
      memories: prev.memories.map(memory => 
        memory.id === id ? { ...memory, title } : memory
      )
    }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('https://link-hub-api.vercel.app/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const copyUniqueLink = () => {
    navigator.clipboard.writeText(uniqueLink)
    toast({
      title: "Copied!",
      description: "Unique link copied to clipboard.",
    })
  }

  return (
    <div className={`min-h-screen p-6 ${themes.find(theme => theme.name === profile.theme)?.primaryColor} rounded-lg`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Edit Profile</h1>
          <Button 
            onClick={handleSaveProfile}
            className="bg-zinc-600 hover:bg-zinc-700"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-zinc-100 border-0">
            <CardHeader>
              <CardTitle className="text-xl text-black">Profile Information</CardTitle>
              <CardDescription>Customize your public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative w-32 h-32 group cursor-pointer border-2 border-zinc-500/15 rounded-full overflow-hidden">
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Display Name</label>
                <Input 
                  value={profile.displayName}
                  onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  className="border border-zinc-700/15"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-800">Bio</label>
                <Textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="border border-zinc-700/15 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Unique Link</label>
                <div className="flex"
                id='uniqueLink'
                >
                  <Input value={uniqueLink} readOnly className="border border-zinc-700/15" />
                  <Button onClick={copyUniqueLink} className="ml-2 bg-zinc-600 hover:bg-zinc-700">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2" id='theme-selector'>
                <label className="text-sm font-medium text-zinc-800">Theme</label>
                <Select
                    value={profile.theme} // Fallback to empty string if profile.theme is undefined or empty
                    onValueChange={(theme) => setProfile(prev => ({ ...prev, theme }))}
                  >
                    <SelectTrigger className="border border-zinc-700/15">
                      <SelectValue placeholder="Select a theme" className="text-zinc-800" />
                    </SelectTrigger>
                    <SelectContent className="h-40 overflow-y-auto">
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.name}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-zinc-100 border-0">
              <CardHeader>
                <CardTitle className="text-xl text-black">Social Links</CardTitle>
                <CardDescription>Connect your online presence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" id='social-links'>
                {profile.links.map(link => (
                  <div key={link.id} className="flex gap-3 items-center"
                    id='link'
                  >
                    <LinkIcon className="h-4 w-4 text-zinc-400" />
                    <Input
                      placeholder="Title"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                      className="border border-zinc-700/15"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      className="border border-zinc-700/15" 
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(link.id)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-zinc-400 border-2 border-zinc-800/50 hover:text-white hover:bg-zinc-800"
                  onClick={addLink}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-100 border-0">
              <CardHeader>
                <CardTitle className="text-xl text-black">Photo Gallery</CardTitle>
                <CardDescription>Share your memorable moments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4"
                id='client'
                >
                  {profile.memories.map(memory => (

                    <div key={memory.id} className="relative group">
                      <img 
                        src={memory.imageUrl} 
                        alt={memory.title} 
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 border border-zinc-500 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMemory(memory.id)}
                          className="text-white hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={memory.title}
                        onChange={(e) => updateMemoryTitle(memory.id, e.target.value)}
                        className="absolute bottom-2 left-2 right-2 bg-black/50 border-0 text-white placeholder-white/70"
                        placeholder="Add a title"
                      />
                    </div>
                  ))}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg aspect-video flex items-center justify-center cursor-pointer transition-colors
                      ${isDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
                  >
                    <input {...getInputProps()} />
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-zinc-400" />
                      <p className="text-sm text-zinc-400">
                        {isDragActive ? 'Drop images here' : 'Drag images or click to upload'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

