import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/contexts/auth-context'

interface Analytics {
  totalClicks: number;
  linkClicks: { title: string; clicks: number }[];
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const {token} = useAuth()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/user/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-zinc-800">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>All-time link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics?.totalClicks || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Links</CardTitle>
            <CardDescription>Number of links in your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics?.linkClicks.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Link</CardTitle>
            <CardDescription>Link with the most clicks</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.linkClicks.length ? (
              <p className="text-2xl font-bold">
                {analytics.linkClicks.reduce((max, link) => link.clicks > max.clicks ? link : max).title}
              </p>
            ) : (
              <p className="text-2xl font-bold">N/A</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Clicks per Link</CardTitle>
            <CardDescription>Average clicks across all links</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics?.linkClicks.length
                ? (analytics.totalClicks / analytics.linkClicks.length).toFixed(2)
                : '0'}
            </p>
          </CardContent>
        </Card>
      </div>
      {analytics && analytics?.linkClicks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Link Performance</CardTitle>
          </CardHeader>
          <CardContent className="w-full aspect-[2/1]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.linkClicks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/dashboard/profile">Edit Profile</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard/analytics">View Detailed Analytics</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard/settings">Settings</Link>
        </Button>
      </div>
    </div>
  )
}

