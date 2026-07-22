import { useState } from 'react';
import { Layout } from '../Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export function PropertyRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Property Details', completed: false },
    { id: 2, title: 'Owner Information', completed: false },
    { id: 3, title: 'Document Upload', completed: false },
    { id: 4, title: 'Review & Submit', completed: false },
  ];

  const documents = [
    { name: 'Registration Document', required: true },
    { name: 'Legal Heir Certificate', required: false },
    { name: 'Family Tree', required: false },
    { name: 'Death Certificate', required: false },
    { name: 'Mutation Certificate', required: true },
    { name: 'NOC (No Objection Certificate)', required: false },
  ];

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Register New Property</h1>
          <p className="text-[#64748B]">Complete the form to register a new land parcel on the blockchain</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    currentStep === step.id
                      ? 'bg-[#0F766E] text-white'
                      : currentStep > step.id
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#E2E8F0] text-[#64748B]'
                  }`}>
                    {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="hidden sm:block flex-1">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-[#0F172A]' : 'text-[#64748B]'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block h-0.5 flex-1 mx-4 ${
                    currentStep > step.id ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">
                  {currentStep === 1 && 'Property Details'}
                  {currentStep === 2 && 'Owner Information'}
                  {currentStep === 3 && 'Document Upload'}
                  {currentStep === 4 && 'Review & Submit'}
                </CardTitle>
                <CardDescription className="text-[#64748B]">
                  {currentStep === 1 && 'Enter the basic details of the property'}
                  {currentStep === 2 && 'Provide owner and wallet information'}
                  {currentStep === 3 && 'Upload required legal documents'}
                  {currentStep === 4 && 'Review all information before submitting'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Step 1: Property Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="survey-number">Survey Number *</Label>
                        <Input id="survey-number" placeholder="e.g., SN-2023-4521" className="mt-2 border-[#E2E8F0]" />
                      </div>
                      <div>
                        <Label htmlFor="property-id">Property ID</Label>
                        <Input id="property-id" placeholder="Auto-generated" disabled className="mt-2 bg-[#F8FAFC]" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location / Address *</Label>
                      <Textarea id="location" placeholder="Enter full address with district and block details" className="mt-2 border-[#E2E8F0]" rows={3} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="area">Total Area (sq ft) *</Label>
                        <Input id="area" type="number" placeholder="e.g., 2500" className="mt-2 border-[#E2E8F0]" />
                      </div>
                      <div>
                        <Label htmlFor="district">District *</Label>
                        <Input id="district" placeholder="e.g., North District" className="mt-2 border-[#E2E8F0]" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input id="latitude" placeholder="e.g., 28.7041" className="mt-2 border-[#E2E8F0]" />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input id="longitude" placeholder="e.g., 77.1025" className="mt-2 border-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Owner Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="owner-name">Owner Full Name *</Label>
                      <Input id="owner-name" placeholder="Enter full legal name" className="mt-2 border-[#E2E8F0]" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="owner-id">Government ID *</Label>
                        <Input id="owner-id" placeholder="Aadhaar / Passport / License" className="mt-2 border-[#E2E8F0]" />
                      </div>
                      <div>
                        <Label htmlFor="owner-phone">Contact Number *</Label>
                        <Input id="owner-phone" type="tel" placeholder="+91 XXXXX XXXXX" className="mt-2 border-[#E2E8F0]" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="owner-email">Email Address *</Label>
                      <Input id="owner-email" type="email" placeholder="owner@example.com" className="mt-2 border-[#E2E8F0]" />
                    </div>

                    <div>
                      <Label htmlFor="wallet-address">Wallet Address *</Label>
                      <Input id="wallet-address" placeholder="0x..." className="mt-2 border-[#E2E8F0] font-mono text-sm" />
                      <p className="text-xs text-[#64748B] mt-2">This will be the blockchain address for property ownership</p>
                    </div>

                    <div>
                      <Label htmlFor="owner-address">Residential Address *</Label>
                      <Textarea id="owner-address" placeholder="Enter complete residential address" className="mt-2 border-[#E2E8F0]" rows={3} />
                    </div>
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {documents.map((doc, index) => (
                      <div key={index} className="border border-[#E2E8F0] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#0F766E]" />
                            <div>
                              <p className="font-medium text-[#0F172A]">{doc.name}</p>
                              {doc.required && (
                                <span className="text-xs text-[#DC2626]">Required</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-6 text-center hover:border-[#0F766E] transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
                          <p className="text-sm text-[#0F172A] mb-1">Click to upload or drag and drop</p>
                          <p className="text-xs text-[#64748B]">PDF, JPEG, PNG (max 10MB)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-6">
                      <h3 className="font-medium text-[#0F172A] mb-4">Property Information</h3>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-[#64748B]">Survey Number:</dt>
                          <dd className="text-[#0F172A] font-medium">SN-2023-4521</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-[#64748B]">Location:</dt>
                          <dd className="text-[#0F172A] font-medium">Block A, District North</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-[#64748B]">Area:</dt>
                          <dd className="text-[#0F172A] font-medium">2,500 sq ft</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-6">
                      <h3 className="font-medium text-[#0F172A] mb-4">Owner Information</h3>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-[#64748B]">Name:</dt>
                          <dd className="text-[#0F172A] font-medium">John Doe</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-[#64748B]">Wallet:</dt>
                          <dd className="text-[#0F172A] font-mono text-xs">0x7a3f...9b2c</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-[#64748B]">Contact:</dt>
                          <dd className="text-[#0F172A] font-medium">+91 98765 43210</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">Blockchain Transaction</p>
                        <p className="text-xs text-[#64748B] mt-1">
                          Submitting this form will create an immutable record on the blockchain. Please review all information carefully.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#E2E8F0]">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="border-[#E2E8F0]"
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-[#0F766E] hover:bg-[#0F766E]/90 sm:ml-auto"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button className="bg-[#0F766E] hover:bg-[#0F766E]/90 sm:ml-auto">
                      Submit Registration
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div>
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">Registration Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#0F172A] mb-2">Required Documents</h4>
                  <ul className="text-sm text-[#64748B] space-y-1">
                    <li>• Registration Document</li>
                    <li>• Mutation Certificate</li>
                    <li>• Owner ID Proof</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <h4 className="font-medium text-[#0F172A] mb-2">Processing Time</h4>
                  <p className="text-sm text-[#64748B]">Usually 24-48 hours for verification and blockchain confirmation</p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <h4 className="font-medium text-[#0F172A] mb-2">Need Help?</h4>
                  <p className="text-sm text-[#64748B] mb-3">Contact our support team for assistance</p>
                  <Button variant="outline" className="w-full border-[#E2E8F0]">
                    Support Center
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
