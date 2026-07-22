import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Map, FileText, TrendingUp, Activity, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const stats = [
    { icon: Map, label: 'Total Properties', value: '12', color: 'bg-[#0F766E]' },
    { icon: FileText, label: 'Pending Transfers', value: '3', color: 'bg-[#38BDF8]' },
    { icon: TrendingUp, label: 'Completed', value: '45', color: 'bg-[#16A34A]' },
    { icon: Activity, label: 'Active Listings', value: '8', color: 'bg-[#334155]' },
  ];

  const recentProperties = [
    { id: 'SN-2023-4521', location: 'Block A, Survey 123', area: '2,500 sq ft', status: 'Verified' },
    { id: 'SN-2023-4522', location: 'Block B, Survey 124', area: '3,200 sq ft', status: 'Pending' },
    { id: 'SN-2023-4523', location: 'Block C, Survey 125', area: '1,800 sq ft', status: 'Verified' },
  ];

  const recentActivity = [
    { action: 'Property Registered', property: 'SN-2023-4521', time: '2 hours ago' },
    { action: 'Ownership Transfer', property: 'SN-2023-4520', time: '5 hours ago' },
    { action: 'Document Verified', property: 'SN-2023-4519', time: '1 day ago' },
    { action: 'Property Updated', property: 'SN-2023-4518', time: '2 days ago' },
  ];

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Dashboard</h1>
          <p className="text-[#64748B]">Welcome back! Here's an overview of your land registry activities.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-[#E2E8F0]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-semibold text-[#0F172A] mb-1">{stat.value}</p>
                  <p className="text-sm text-[#64748B]">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2">
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">GIS Map Overview</CardTitle>
                <CardDescription className="text-[#64748B]">
                  Interactive view of your registered properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-[#0F766E]/20 to-[#38BDF8]/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <Map className="w-32 h-32 text-[#0F766E]/30" />
                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-sm text-[#0F172A]">12 Properties</span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Link to="/search">
                      <Button size="sm" className="bg-[#0F766E] hover:bg-[#0F766E]/90">
                        View Full Map
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Properties */}
            <Card className="border-[#E2E8F0] mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#0F172A]">Your Properties</CardTitle>
                    <CardDescription className="text-[#64748B]">Recently registered land parcels</CardDescription>
                  </div>
                  <Link to="/search">
                    <Button variant="outline" size="sm" className="border-[#E2E8F0]">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProperties.map((property, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-[#0F172A]">{property.id}</p>
                        <p className="text-sm text-[#64748B]">{property.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#0F172A]">{property.area}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                          property.status === 'Verified'
                            ? 'bg-[#16A34A]/10 text-[#16A34A]'
                            : 'bg-[#38BDF8]/10 text-[#38BDF8]'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Recent Activity</CardTitle>
                <CardDescription className="text-[#64748B]">Latest transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-2 h-2 bg-[#0F766E] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0F172A]">{activity.action}</p>
                        <p className="text-sm text-[#64748B]">{activity.property}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-[#64748B]" />
                          <p className="text-xs text-[#64748B]">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-[#E2E8F0] mt-6">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/register">
                  <Button className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90" size="lg">
                    <FileText className="w-4 h-4 mr-2" />
                    Register New Property
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline" className="w-full border-[#E2E8F0]" size="lg">
                    <Map className="w-4 h-4 mr-2" />
                    Search Properties
                  </Button>
                </Link>
                <Link to="/verify">
                  <Button variant="outline" className="w-full border-[#E2E8F0]" size="lg">
                    <Activity className="w-4 h-4 mr-2" />
                    Verify Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
