import { useState } from 'react';
import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Map, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PropertySearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const properties = [
    {
      id: 'SN-2023-4521',
      location: 'Block A, Survey 123, District North',
      area: '2,500 sq ft',
      owner: '0x7a3f...9b2c',
      status: 'Verified',
      lat: '28.7041',
      lon: '77.1025'
    },
    {
      id: 'SN-2023-4522',
      location: 'Block B, Survey 124, District Central',
      area: '3,200 sq ft',
      owner: '0x8b4c...1a3d',
      status: 'Pending',
      lat: '28.7051',
      lon: '77.1035'
    },
    {
      id: 'SN-2023-4523',
      location: 'Block C, Survey 125, District South',
      area: '1,800 sq ft',
      owner: '0x9c5d...2b4e',
      status: 'Verified',
      lat: '28.7061',
      lon: '77.1045'
    },
  ];

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Property Search</h1>
          <p className="text-[#64748B]">Search and explore registered land parcels using Survey Number or Property ID</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map View */}
          <div className="lg:col-span-2">
            <Card className="border-[#E2E8F0] mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <Input
                      placeholder="Search by Survey Number or Property ID..."
                      className="pl-10 h-12 border-[#E2E8F0]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="bg-[#0F766E] hover:bg-[#0F766E]/90 h-12 px-8">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">GIS Map View</CardTitle>
                <CardDescription className="text-[#64748B]">
                  Click on parcels to view details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-[#0F766E]/20 to-[#38BDF8]/20 rounded-xl relative overflow-hidden">
                  <Map className="w-32 h-32 text-[#0F766E]/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                  {/* Property Markers */}
                  <div className="absolute top-1/4 left-1/3 group cursor-pointer">
                    <div className="w-8 h-8 bg-[#0F766E] rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <p className="text-sm font-medium text-[#0F172A]">SN-2023-4521</p>
                      <p className="text-xs text-[#64748B]">2,500 sq ft</p>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 group cursor-pointer">
                    <div className="w-8 h-8 bg-[#38BDF8] rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <p className="text-sm font-medium text-[#0F172A]">SN-2023-4522</p>
                      <p className="text-xs text-[#64748B]">3,200 sq ft</p>
                    </div>
                  </div>

                  <div className="absolute bottom-1/4 right-1/3 group cursor-pointer">
                    <div className="w-8 h-8 bg-[#16A34A] rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <p className="text-sm font-medium text-[#0F172A]">SN-2023-4523</p>
                      <p className="text-xs text-[#64748B]">1,800 sq ft</p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                    <p className="text-xs font-medium text-[#0F172A] mb-2">Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#0F766E] rounded-full"></div>
                        <span className="text-xs text-[#64748B]">Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#38BDF8] rounded-full"></div>
                        <span className="text-xs text-[#64748B]">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#16A34A] rounded-full"></div>
                        <span className="text-xs text-[#64748B]">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Search Results</CardTitle>
                <CardDescription className="text-[#64748B]">{properties.length} properties found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property, index) => (
                    <div key={index} className="border border-[#E2E8F0] rounded-lg p-4 hover:border-[#0F766E] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-[#0F172A]">{property.id}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                            property.status === 'Verified'
                              ? 'bg-[#16A34A]/10 text-[#16A34A]'
                              : 'bg-[#38BDF8]/10 text-[#38BDF8]'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                        <Link to="/property/details">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-0.5" />
                          <p className="text-[#64748B]">{property.location}</p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Area:</span>
                          <span className="text-[#0F172A] font-medium">{property.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Owner:</span>
                          <span className="text-[#0F172A] font-mono text-xs">{property.owner}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Coordinates:</span>
                          <span className="text-[#0F172A] text-xs">{property.lat}, {property.lon}</span>
                        </div>
                      </div>

                      <Link to="/property/details">
                        <Button variant="outline" className="w-full mt-4 border-[#E2E8F0]">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
