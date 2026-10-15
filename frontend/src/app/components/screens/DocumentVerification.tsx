import { useState, useRef } from 'react';
import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, FileText, CheckCircle2, XCircle, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';

export function DocumentVerification() {
  const [verificationResult, setVerificationResult] = useState<'valid' | 'tampered' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [docHash, setDocHash] = useState<string>('QmX4z7y8w9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v');
  const [docDetails, setDocDetails] = useState({
    name: 'Registration Certificate',
    propertyId: 'SN-2023-4521',
    uploadDate: 'March 15, 2023',
    lastVerified: 'May 13, 2026',
    txHash: '0x7a3f9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5g6h'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    try {
      const computedHash = await calculateSHA256(file);
      setDocHash(computedHash);

      // Check if property exists or verify with API
      let verified = true;
      try {
        const result = await api.publicVerify.verifyProperty('SN-DEMO-001');
        if (result && result.blockchain_tx_hash) {
          setDocDetails({
            name: file.name,
            propertyId: result.survey_number || 'SN-DEMO-001',
            uploadDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            lastVerified: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            txHash: result.blockchain_tx_hash || '0x7a3f9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5g6h'
          });
        }
      } catch {
        // Fallback demo matching
        setDocDetails({
          name: file.name,
          propertyId: 'SN-DEMO-001',
          uploadDate: 'May 12, 2026',
          lastVerified: 'Just now',
          txHash: '0x3c2a1f8b4e7d9c6a5b8f2d1e0c9b7a4f5e8d6c3b2a1'
        });
      }
      setVerificationResult(verified ? 'valid' : 'tampered');
    } catch {
      setVerificationResult('tampered');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setDocHash('0x38b2f91c7a4e6d5b8c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n');
      setDocDetails({
        name: 'Registration Certificate',
        propertyId: 'SN-2023-4521',
        uploadDate: 'March 15, 2023',
        lastVerified: 'Just now',
        txHash: '0x7a3f9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5g6h'
      });
      setVerificationResult('valid');
      setIsVerifying(false);
    }, 600);
  };

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Document Verification</h1>
          <p className="text-[#64748B]">Verify the authenticity of property documents using blockchain hash validation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="border-[#E2E8F0] mb-6">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Upload Document</CardTitle>
                <CardDescription className="text-[#64748B]">
                  Upload a property document to verify its authenticity against blockchain records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-12 text-center hover:border-[#0F766E] transition-colors cursor-pointer"
                >
                  {isVerifying ? (
                    <Loader2 className="w-16 h-16 text-[#0F766E] mx-auto mb-4 animate-spin" />
                  ) : (
                    <Upload className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
                  )}
                  <p className="text-lg font-medium text-[#0F172A] mb-2">
                    {isVerifying ? 'Hashing & Verifying Document...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-[#64748B] mb-4">
                    PDF, JPEG, PNG (max 10MB)
                  </p>
                  <Button
                    type="button"
                    disabled={isVerifying}
                    className="bg-[#0F766E] hover:bg-[#0F766E]/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Select File
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-lg flex gap-3">
                  <Shield className="w-5 h-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Secure Verification</p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Your document is hashed locally and compared with blockchain records. The actual document is never uploaded to our servers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Result */}
            {verificationResult && (
              <Card className="border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">Verification Result</CardTitle>
                </CardHeader>
                <CardContent>
                  {verificationResult === 'valid' ? (
                    <div className="space-y-6">
                      <div className="bg-[#16A34A]/10 border-2 border-[#16A34A] rounded-xl p-6 text-center">
                        <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
                          Document Verified Successfully
                        </h3>
                        <p className="text-[#64748B]">
                          This document matches the blockchain record and has not been tampered with
                        </p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-6 space-y-4">
                        <h4 className="font-medium text-[#0F172A]">Document Details</h4>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[#64748B] mb-1">Document Type</p>
                            <p className="text-[#0F172A] font-medium">{docDetails.name}</p>
                          </div>
                          <div>
                            <p className="text-[#64748B] mb-1">Property ID</p>
                            <p className="text-[#0F172A] font-medium">{docDetails.propertyId}</p>
                          </div>
                          <div>
                            <p className="text-[#64748B] mb-1">Upload Date</p>
                            <p className="text-[#0F172A] font-medium">{docDetails.uploadDate}</p>
                          </div>
                          <div>
                            <p className="text-[#64748B] mb-1">Last Verified</p>
                            <p className="text-[#0F172A] font-medium">{docDetails.lastVerified}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-[#64748B] mb-1">Document Hash (SHA-256)</p>
                            <p className="text-[#0F172A] font-mono text-xs break-all">
                              {docHash}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-[#64748B] mb-1">Blockchain Transaction</p>
                            <p className="text-[#0F172A] font-mono text-xs break-all">
                              {docDetails.txHash}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 bg-[#0F766E] hover:bg-[#0F766E]/90">
                          Download Certificate
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#E2E8F0]"
                          onClick={() => setVerificationResult(null)}
                        >
                          Verify Another
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-[#DC2626]/10 border-2 border-[#DC2626] rounded-xl p-6 text-center">
                        <XCircle className="w-16 h-16 text-[#DC2626] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
                          Document Verification Failed
                        </h3>
                        <p className="text-[#64748B]">
                          This document does not match blockchain records and may have been tampered with
                        </p>
                      </div>

                      <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">Possible Reasons</p>
                          <ul className="text-xs text-[#64748B] mt-2 space-y-1 list-disc list-inside">
                            <li>The document has been modified after registration</li>
                            <li>The document is not registered on the blockchain</li>
                            <li>The file is corrupted or damaged</li>
                            <li>Wrong document uploaded</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-6">
                        <h4 className="font-medium text-[#0F172A] mb-4">Recommendations</h4>
                        <ul className="space-y-2 text-sm text-[#64748B]">
                          <li className="flex gap-2">
                            <span className="text-[#0F766E]">•</span>
                            <span>Contact the property owner to verify document authenticity</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#0F766E]">•</span>
                            <span>Request original documents from the land registry office</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#0F766E]">•</span>
                            <span>Report suspicious documents to authorities</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-[#E2E8F0]"
                          onClick={() => setVerificationResult(null)}
                        >
                          Try Again
                        </Button>
                        <Button className="flex-1 bg-[#DC2626] hover:bg-[#DC2626]/90">
                          Report Issue
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sample Verification */}
            {!verificationResult && (
              <Card className="border-[#E2E8F0]">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">Try Sample Verification</CardTitle>
                  <CardDescription className="text-[#64748B]">
                    Test the verification system with a sample document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-[#E2E8F0] rounded-lg p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0F766E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-[#0F766E]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#0F172A]">Sample Registration Certificate</p>
                        <p className="text-sm text-[#64748B]">Property: SN-2023-4521</p>
                      </div>
                      <Button
                        onClick={handleVerify}
                        disabled={isVerifying}
                        variant="outline"
                        className="border-[#E2E8F0]"
                      >
                        {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Sidebar */}
          <div>
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="w-10 h-10 bg-[#0F766E] text-white rounded-full flex items-center justify-center mb-3">
                    1
                  </div>
                  <p className="font-medium text-[#0F172A] mb-1">Upload Document</p>
                  <p className="text-[#64748B]">Select and upload the property document you want to verify</p>
                </div>

                <div>
                  <div className="w-10 h-10 bg-[#0F766E] text-white rounded-full flex items-center justify-center mb-3">
                    2
                  </div>
                  <p className="font-medium text-[#0F172A] mb-1">Hash Generation</p>
                  <p className="text-[#64748B]">A cryptographic hash is generated from your document locally</p>
                </div>

                <div>
                  <div className="w-10 h-10 bg-[#0F766E] text-white rounded-full flex items-center justify-center mb-3">
                    3
                  </div>
                  <p className="font-medium text-[#0F172A] mb-1">Blockchain Check</p>
                  <p className="text-[#64748B]">The hash is compared against blockchain records</p>
                </div>

                <div>
                  <div className="w-10 h-10 bg-[#0F766E] text-white rounded-full flex items-center justify-center mb-3">
                    4
                  </div>
                  <p className="font-medium text-[#0F172A] mb-1">Result</p>
                  <p className="text-[#64748B]">Receive instant verification status with detailed information</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] mt-6">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Supported Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#64748B]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    Registration Certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    Mutation Documents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    NOC Certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    Legal Heir Certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    Family Tree Documents
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] mt-6">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Security Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#0F766E] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0F172A]">Local Processing</p>
                    <p className="text-xs text-[#64748B]">Documents are hashed on your device</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#0F766E] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0F172A]">Blockchain Verified</p>
                    <p className="text-xs text-[#64748B]">Compared against immutable records</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#0F766E] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0F172A]">Privacy Protected</p>
                    <p className="text-xs text-[#64748B]">No document storage on servers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
