import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ArrowRight, CheckCircle2, Clock, FileCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { api } from '../../../services/api';

export function PropertyTransfer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<any>({
    surveyNumber: searchParams.get('survey') || 'SN-2023-4521',
    propertyId: 'PROP-2023-00152',
    location: 'Block A, Survey 123, District North',
    area: '2,500 sq ft',
    registrationDate: 'March 15, 2023',
    ownerName: 'John Doe',
    ownerWallet: '0x7a3f...9b2c',
  });

  const [newOwnerName, setNewOwnerName] = useState('Alice Smith');
  const [newWallet, setNewWallet] = useState('0x8b4c1a3d5e7f9a2b4c6d8e0f1a3b5c7d9e1f3a5b');
  const [saleValue, setSaleValue] = useState('1500000');
  const [transferReason, setTransferReason] = useState('Sale of Property');

  useEffect(() => {
    const survey = searchParams.get('survey');
    if (survey) {
      api.properties.getBySurvey(survey).then((p) => {
        if (p) {
          setProperty({
            surveyNumber: p.survey_number || survey,
            propertyId: p.property_id || `PROP-${survey}`,
            location: `${p.village || 'Block A'}, ${p.taluk || 'Taluk'}, ${p.district || 'Mysuru'}`,
            area: `${p.area || 2500} sq ft`,
            registrationDate: 'March 15, 2023',
            ownerName: 'Current Legal Owner',
            ownerWallet: p.owner_wallet || '0x7a3f...9b2c',
          });
        }
      }).catch(() => {});
    }
  }, [searchParams]);

  const handleExecuteTransfer = async () => {
    try {
      setLoading(true);
      const res = await api.ownership.transfer({
        survey_number: property.surveyNumber,
        new_owner_wallet: newWallet,
        new_owner_name: newOwnerName,
        consideration_amount: Number(saleValue) || 0,
        reason: transferReason,
      });
      setShowConfirmation(false);
      const appId = res?.application_id || res?._id;
      if (appId) {
        navigate(`/applications/${appId}`);
      } else {
        navigate('/transactions');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const verificationSteps = [
    { id: 1, title: 'Owner Verification', status: 'completed', time: 'Completed' },
    { id: 2, title: 'Document Check', status: 'completed', time: 'Completed' },
    { id: 3, title: 'Blockchain Validation', status: 'in-progress', time: 'In Progress' },
    { id: 4, title: 'Transfer Execution', status: 'pending', time: 'Pending' },
  ];

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Ownership Transfer</h1>
          <p className="text-[#64748B]">Securely transfer property ownership to a new owner</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="border-[#E2E8F0] mb-6">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Property Information</CardTitle>
                <CardDescription className="text-[#64748B]">Current ownership details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#F8FAFC] rounded-lg p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Survey Number</p>
                      <p className="font-medium text-[#0F172A]">{property.surveyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Property ID</p>
                      <p className="font-medium text-[#0F172A]">{property.propertyId}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#64748B] mb-1">Location</p>
                    <p className="font-medium text-[#0F172A]">{property.location}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Total Area</p>
                      <p className="font-medium text-[#0F172A]">{property.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Registration Date</p>
                      <p className="font-medium text-[#0F172A]">{property.registrationDate}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <p className="text-sm text-[#64748B] mb-1">Current Owner</p>
                    <p className="font-medium text-[#0F172A]">{property.ownerName}</p>
                    <p className="font-mono text-sm text-[#64748B] mt-1 break-all">{property.ownerWallet}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">New Owner Details</CardTitle>
                <CardDescription className="text-[#64748B]">Enter the information of the new property owner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="new-owner-name">New Owner Name *</Label>
                    <Input
                      id="new-owner-name"
                      placeholder="Enter full legal name"
                      className="mt-2 border-[#E2E8F0]"
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-wallet">New Owner Wallet Address *</Label>
                    <Input
                      id="new-wallet"
                      placeholder="0x..."
                      className="mt-2 border-[#E2E8F0] font-mono text-sm"
                      value={newWallet}
                      onChange={(e) => setNewWallet(e.target.value)}
                    />
                    <p className="text-xs text-[#64748B] mt-2">
                      The new owner must provide their wallet address to receive ownership
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="transfer-date">Transfer Date *</Label>
                      <Input id="transfer-date" type="date" defaultValue="2026-10-15" className="mt-2 border-[#E2E8F0]" />
                    </div>
                    <div>
                      <Label htmlFor="sale-value">Sale Value (Optional)</Label>
                      <Input
                        id="sale-value"
                        type="number"
                        placeholder="₹ 0.00"
                        className="mt-2 border-[#E2E8F0]"
                        value={saleValue}
                        onChange={(e) => setSaleValue(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="transfer-reason">Reason for Transfer *</Label>
                    <Input
                      id="transfer-reason"
                      placeholder="e.g., Sale, Inheritance, Gift"
                      className="mt-2 border-[#E2E8F0]"
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                    />
                  </div>

                  <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-lg p-4 flex gap-3">
                    <FileCheck className="w-5 h-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Verification Required</p>
                      <p className="text-xs text-[#64748B] mt-1">
                        Both parties will need to verify this transfer using their wallets. The transaction will be recorded on the blockchain.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="outline" className="border-[#E2E8F0]">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setShowConfirmation(true)}
                      className="bg-[#0F766E] hover:bg-[#0F766E]/90 sm:ml-auto"
                    >
                      Initiate Transfer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Timeline */}
          <div>
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Verification Progress</CardTitle>
                <CardDescription className="text-[#64748B]">Transfer verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {verificationSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      {index < verificationSteps.length - 1 && (
                        <div className={`absolute left-5 top-12 w-0.5 h-12 ${
                          step.status === 'completed' ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
                        }`}></div>
                      )}
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === 'completed'
                            ? 'bg-[#16A34A] text-white'
                            : step.status === 'in-progress'
                            ? 'bg-[#38BDF8] text-white'
                            : 'bg-[#E2E8F0] text-[#64748B]'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : step.status === 'in-progress' ? (
                            <Clock className="w-5 h-5 animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 bg-[#64748B] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-medium text-[#0F172A]">{step.title}</p>
                          <p className="text-sm text-[#64748B] mt-1">{step.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] mt-6">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-[#0F172A] mb-1">Blockchain Record</p>
                  <p className="text-[#64748B]">All transfers are permanently recorded and cannot be reversed</p>
                </div>
                <div>
                  <p className="font-medium text-[#0F172A] mb-1">Gas Fees</p>
                  <p className="text-[#64748B]">Transaction fees will be charged to the initiating wallet</p>
                </div>
                <div>
                  <p className="font-medium text-[#0F172A] mb-1">Verification</p>
                  <p className="text-[#64748B]">Both parties must approve the transfer using their wallets</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0F172A]">Confirm Transfer</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              Please review the transfer details before confirming
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Property / Survey:</span>
                <span className="font-medium text-[#0F172A]">{property.surveyNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">From:</span>
                <span className="font-mono text-xs text-[#0F172A] truncate max-w-[200px]">{property.ownerWallet}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">To:</span>
                <span className="font-mono text-xs text-[#0F172A] truncate max-w-[200px]">{newWallet}</span>
              </div>
            </div>

            <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg p-3 flex gap-2">
              <FileCheck className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#64748B]">
                This action will create a blockchain transaction and cannot be undone
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border-[#E2E8F0]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExecuteTransfer}
                disabled={loading}
                className="flex-1 bg-[#0F766E] hover:bg-[#0F766E]/90"
              >
                {loading ? 'Submitting Transfer...' : 'Confirm Transfer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
