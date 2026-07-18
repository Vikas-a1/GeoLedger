import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Map, MapPin, User, FileText, Clock, CheckCircle2, QrCode, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';

export function PropertyDetails() {
  const transactionHistory = [
    { type: 'Registration', date: 'March 15, 2023', hash: '0x7a3f9b2c...4e5f6a7b', status: 'Verified' },
    { type: 'Document Update', date: 'April 20, 2023', hash: '0x8b4c1a3d...5f6g7h8i', status: 'Verified' },
    { type: 'Ownership Transfer', date: 'June 10, 2023', hash: '0x9c5d2b4e...6g7h8i9j', status: 'Pending' },
  ];

  const documents = [
    { name: 'Registration Certificate', hash: 'QmX4z...7y8w', status: 'Verified', date: 'Mar 15, 2023' },
    { name: 'Mutation Certificate', hash: 'QmY5a...8z9x', status: 'Verified', date: 'Mar 15, 2023' },
    { name: 'NOC Document', hash: 'QmZ6b...9a0y', status: 'Verified', date: 'Apr 20, 2023' },
  ];

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-[#0F172A]">Property Details</h1>
              <Badge className="bg-[#16A34A] hover:bg-[#16A34A]/90">Verified</Badge>
            </div>
            <p className="text-[#64748B]">SN-2023-4521 • PROP-2023-00152</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-[#E2E8F0]">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-[#E2E8F0]">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map View */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">GIS Location</CardTitle>
                <CardDescription className="text-[#64748B]">Geospatial view of the property parcel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-[#0F766E]/20 to-[#38BDF8]/20 rounded-xl relative overflow-hidden">
                  <Map className="w-32 h-32 text-[#0F766E]/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                  {/* Property Marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-[#0F766E] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Property Boundary */}
                  <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border-2 border-dashed border-[#0F766E] rounded-lg bg-[#0F766E]/5"></div>

                  {/* Coordinates */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                    <p className="text-xs text-[#64748B]">Coordinates</p>
                    <p className="text-sm font-medium text-[#0F172A]">28.7041° N, 77.1025° E</p>
                  </div>

                  {/* Area Info */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
                    <p className="text-xs text-[#64748B]">Total Area</p>
                    <p className="text-sm font-medium text-[#0F172A]">2,500 sq ft</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Survey Number</p>
                    <p className="font-medium text-[#0F172A]">SN-2023-4521</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Property ID</p>
                    <p className="font-medium text-[#0F172A]">PROP-2023-00152</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">District</p>
                    <p className="font-medium text-[#0F172A]">North District</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Block</p>
                    <p className="font-medium text-[#0F172A]">Block A</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Total Area</p>
                    <p className="font-medium text-[#0F172A]">2,500 sq ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Registration Date</p>
                    <p className="font-medium text-[#0F172A]">March 15, 2023</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-[#64748B] mb-1">Full Address</p>
                    <p className="font-medium text-[#0F172A]">Block A, Survey 123, North District, State</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ownership Information */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Current Ownership</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#0F766E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-[#0F766E]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#0F172A] mb-1">John Doe</p>
                    <p className="text-sm text-[#64748B] mb-2">Primary Owner</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-[#0F172A]">0x7a3f9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a</p>
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Contact</p>
                    <p className="text-sm text-[#0F172A]">+91 98765 43210</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Email</p>
                    <p className="text-sm text-[#0F172A]">john.doe@example.com</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                  <Link to="/transfer">
                    <Button className="bg-[#0F766E] hover:bg-[#0F766E]/90">
                      Initiate Transfer
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Blockchain Transaction History</CardTitle>
                <CardDescription className="text-[#64748B]">Immutable record of all property events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionHistory.map((tx, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-[#0F766E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#0F766E]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-[#0F172A]">{tx.type}</p>
                          <Badge
                            variant="outline"
                            className={tx.status === 'Verified' ? 'border-[#16A34A] text-[#16A34A]' : 'border-[#38BDF8] text-[#38BDF8]'}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#64748B]">
                          <Clock className="w-3 h-3" />
                          <span>{tx.date}</span>
                        </div>
                        <p className="font-mono text-xs text-[#64748B] mt-2">TX: {tx.hash}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Verified Documents</CardTitle>
                <CardDescription className="text-[#64748B]">Cryptographically verified property documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#16A34A]/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#16A34A]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{doc.name}</p>
                          <p className="text-xs text-[#64748B]">Hash: {doc.hash} • {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Quick Verify</CardTitle>
                <CardDescription className="text-[#64748B]">Scan to verify property authenticity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border-2 border-[#E2E8F0] rounded-xl p-6 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-[#0F172A]" />
                </div>
                <p className="text-center text-xs text-[#64748B] mt-4">
                  Scan this QR code to instantly verify property records on the blockchain
                </p>
              </CardContent>
            </Card>

            {/* Property Status */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Property Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Verification</span>
                  <Badge className="bg-[#16A34A] hover:bg-[#16A34A]/90">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Blockchain</span>
                  <Badge className="bg-[#16A34A] hover:bg-[#16A34A]/90">Confirmed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Documents</span>
                  <Badge className="bg-[#16A34A] hover:bg-[#16A34A]/90">Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Ownership</span>
                  <Badge className="bg-[#16A34A] hover:bg-[#16A34A]/90">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/transfer">
                  <Button variant="outline" className="w-full border-[#E2E8F0]">
                    Transfer Ownership
                  </Button>
                </Link>
                <Button variant="outline" className="w-full border-[#E2E8F0]">
                  Update Documents
                </Button>
                <Button variant="outline" className="w-full border-[#E2E8F0]">
                  Generate Report
                </Button>
                <Link to="/verify">
                  <Button variant="outline" className="w-full border-[#E2E8F0]">
                    Verify Documents
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
