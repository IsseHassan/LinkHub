'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/auth-context'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Settings {
  email: string;
  notifications: boolean;
  publicProfile: boolean;
}

interface UpdateSettingsData extends Settings {
  password?: string;
}

export default function SettingsPage() {
  const { token } = useAuth()
  const [settings, setSettings] = useState<Settings>({
    email: '',
    notifications: true,
    publicProfile: true
  })
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('https://link-hub-api.vercel.app/api/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);

    try {
      const updateData: UpdateSettingsData = {
        ...settings
      };

      if (password) {
        updateData.password = password;
      }

      const response = await fetch('https://link-hub-api.vercel.app/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update settings');
      }

      const data = await response.json();
      setSettings(data);
      setPassword('');
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update settings',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-zinc-800">Settings</h1>
      
      {error && (
        <Alert variant="destructive" className='max-w-2xl flex items-center'>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 max-w-2xl">
        <Card className='border shadow-none'>
          <CardHeader>
            <CardTitle className="text-zinc-800">Account Settings</CardTitle>
            <CardDescription className="text-zinc-400">Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-800">Email</Label>
              <Input
                id="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-amber-500">
                <AlertCircle className="w-4 h-4" />
                <p className="text-xs font-medium">Leave blank to keep the same password</p>
              </div>
              <Label htmlFor="password" className="text-zinc-800">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='border shadow-none'>
          <CardHeader>
            <CardTitle className="text-zinc-800">Notifications</CardTitle>
            <CardDescription className="text-zinc-400">Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
              />
              <Label htmlFor="notifications" className="text-zinc-800">Receive email notifications</Label>
            </div>
          </CardContent>
        </Card>

        <Card className='border shadow-none'>
          <CardHeader>
            <CardTitle className="text-zinc-800">Privacy</CardTitle>
            <CardDescription className="text-zinc-400">Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="publicProfile"
                checked={settings.publicProfile}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, publicProfile: checked }))}
              />
              <Label htmlFor="publicProfile" className="text-zinc-800">Make my profile public</Label>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  )
}

