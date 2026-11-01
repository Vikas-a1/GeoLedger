import { useNavigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { User, Wallet, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { shortenAddress } from '../../../services/wallet';

export function Profile() {
  const navigate = useNavigate();
  const { address, chainName, balanceEth, isLocalNetwork, isConnected, disconnect, switchToLocal } = useWallet();
  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Profile Settings</h1>
          <p className="text-[#64748B]">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Personal Information</CardTitle>
                <CardDescription className="text-[#64748B]">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-[#0F766E]/10 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-[#0F766E]" />
                  </div>
                  <div>
                    <Button variant="outline" className="border-[#E2E8F0]">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-[#64748B] mt-2">JPG, PNG or GIF (max 2MB)</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="John" className="mt-2 border-[#E2E8F0]" />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Doe" className="mt-2 border-[#E2E8F0]" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <Input id="email" type="email" defaultValue="john.doe@example.com" className="pl-10 border-[#E2E8F0]" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <Input id="phone" type="tel" defaultValue="+91 98765 43210" className="pl-10 border-[#E2E8F0]" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Residential Address</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-[#64748B]" />
                    <Input id="address" defaultValue="123 Main Street, District North" className="pl-10 border-[#E2E8F0]" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-[#0F766E] hover:bg-[#0F766E]/90">
                    Save Changes
                  </Button>
                  <Button variant="outline" className="border-[#E2E8F0]">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Wallet Information</CardTitle>
                <CardDescription className="text-[#64748B]">Your connected Web3 wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#F8FAFC] rounded-lg p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0F766E] rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#64748B] mb-1">Connected Wallet</p>
                    <p className="font-mono text-sm text-[#0F172A] break-all">{address || 'Not connected'}</p>
                    {address && (
                      <p className="text-xs text-[#64748B] mt-1">{shortenAddress(address)}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#E2E8F0]"
                    onClick={async () => {
                      await disconnect();
                      navigate('/');
                    }}
                  >
                    Disconnect
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <p className="text-sm text-[#64748B] mb-1">Network</p>
                    <p className="font-medium text-[#0F172A]">{chainName}</p>
                    {!isLocalNetwork && isConnected && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-[#E2E8F0]"
                        onClick={() => void switchToLocal()}
                      >
                        Switch to Hardhat
                      </Button>
                    )}
                  </div>
                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <p className="text-sm text-[#64748B] mb-1">Balance</p>
                    <p className="font-medium text-[#0F172A]">{balanceEth != null ? `${balanceEth} ETH` : '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#16A34A]" />
                    <span className="text-sm text-[#64748B]">Verification</span>
                  </div>
                  <span className="text-sm font-medium text-[#16A34A]">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0F766E]" />
                    <span className="text-sm text-[#64748B]">Account Type</span>
                  </div>
                  <span className="text-sm font-medium text-[#0F172A]">Individual</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#0F766E]" />
                    <span className="text-sm text-[#64748B]">Wallet Status</span>
                  </div>
                  <span className={`text-sm font-medium ${isConnected ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Your Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-3xl font-semibold text-[#0F172A] mb-1">12</p>
                  <p className="text-sm text-[#64748B]">Total Registered Properties</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-[#E2E8F0]">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full border-[#E2E8F0]">
                  Enable 2FA
                </Button>
                <Button variant="outline" className="w-full border-[#E2E8F0] text-[#DC2626]">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
