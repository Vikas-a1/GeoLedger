import { Link, useNavigate } from 'react-router-dom';
import { Map, Wallet, Shield, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function Login() {
  const navigate = useNavigate();

  const handleConnect = () => {
    // Simulate wallet connection
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0F766E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Map className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">GeoLedger</h1>
          <p className="text-[#64748B]">Secure Land Registry</p>
        </div>

        {/* Login Card */}
        <Card className="border-[#E2E8F0] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0F172A]">Connect Your Wallet</CardTitle>
            <CardDescription className="text-[#64748B]">
              Connect your Web3 wallet to access the GeoLedger platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleConnect}
              className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 h-14"
            >
              <Wallet className="w-5 h-5 mr-3" />
              Connect with MetaMask
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#64748B]">or connect with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-14 border-[#E2E8F0]">
              <Wallet className="w-5 h-5 mr-3" />
              WalletConnect
            </Button>

            <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-lg p-4 flex gap-3">
              <Shield className="w-5 h-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Secure Authentication</p>
                <p className="text-xs text-[#64748B] mt-1">
                  Your wallet credentials are never stored. All transactions are secured by blockchain technology.
                </p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#64748B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#64748B]">
                  Don't have a wallet? <a href="#" className="text-[#0F766E] hover:underline">Learn how to set up MetaMask</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-[#64748B] hover:text-[#0F766E]">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
