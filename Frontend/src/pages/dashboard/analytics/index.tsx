import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, Users, LinkIcon, Eye } from 'lucide-react'

interface Analytics {
  totalClicks: number
  uniqueVisitors: number
  clickGrowth: number
  visitorGrowth: number
  linkClicks: { title: string; clicks: number }[]
  dailyClicks: { date: string; clicks: number }[]
  topCountries: { country: string; clicks: number }[]
  devices: { device: string; percentage: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const { token } = useAuth()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/user/analytics?range=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        } else {
          throw new Error('Failed to fetch analytics')
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (token) {
      fetchAnalytics()
    }
  }, [token, timeRange])

  if (!analytics) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="space-y-8 p-8 bg-zinc-100 text-zinc-800 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Clicks"
          value={analytics.totalClicks}
          description="All-time link clicks"
          icon={<LinkIcon className="h-4 w-4" />}
          change={analytics.clickGrowth}
        />
        <MetricCard
          title="Total Links"
          value={analytics.linkClicks.length}
          description="Number of active links"
          icon={<LinkIcon className="h-4 w-4" />}
        />
        <MetricCard
          title="Unique Visitors"
          value={analytics.uniqueVisitors}
          description="Distinct users"
          icon={<Users className="h-4 w-4" />}
          change={analytics.visitorGrowth}
        />
        <MetricCard
          title="Avg. Click Rate"
          value={`${((analytics.totalClicks / (analytics.uniqueVisitors * analytics.linkClicks.length)) * 100).toFixed(2)}%`}
          description="Clicks per visitor per link"
          icon={<Eye className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-zinc-100 border-zinc-700">
            <CardHeader>
              <CardTitle>Click Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyClicks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: '#fff', border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-zinc-100 border-zinc-700">
              <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.linkClicks.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="title" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ background: '#fff', border: 'none' }} />
                    <Bar dataKey="clicks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-zinc-100 border-zinc-700">
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.devices}
                      dataKey="percentage"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {analytics.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: 'none' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links">
          <Card className="bg-zinc-100 border-zinc-700">
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.linkClicks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="title" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ background: '#fff', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography">
          <Card className="bg-zinc-100 border-zinc-700">
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topCountries} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" stroke="#888" />
                  <YAxis dataKey="country" type="category" stroke="#888" />
                  <Tooltip contentStyle={{ background: '#fff', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, description, icon, change }: { title: string, value: number | string, description: string, icon: React.ReactNode, change?: number }) {
  return (
    <Card className="bg-zinc-100 border-zinc-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-zinc-400">{description}</p>
        {change !== undefined && (
          <div className={`text-xs mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {Math.abs(change).toFixed(2)}% from last period
          </div>
        )}
      </CardContent>
    </Card>
  )
}

