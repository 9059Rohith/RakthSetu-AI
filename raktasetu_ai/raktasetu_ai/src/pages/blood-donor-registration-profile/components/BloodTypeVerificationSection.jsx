import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BloodTypeVerificationSection = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const bloodGroups = [
    { value: 'A+', label: 'A Positive (A+)' },
    { value: 'A-', label: 'A Negative (A-)' },
    { value: 'B+', label: 'B Positive (B+)' },
    { value: 'B-', label: 'B Negative (B-)' },
    { value: 'AB+', label: 'AB Positive (AB+)' },
    { value: 'AB-', label: 'AB Negative (AB-)' },
    { value: 'O+', label: 'O Positive (O+)' },
    { value: 'O-', label: 'O Negative (O-)' }
  ];

  const documentTypes = [
    { value: 'blood_test_report', label: 'Blood Test Report' },
    { value: 'medical_certificate', label: 'Medical Certificate' },
    { value: 'hospital_record', label: 'Hospital Record' },
    { value: 'lab_report', label: 'Laboratory Report' }
  ];

  const rareAntigens = [
    { value: 'rh_negative', label: 'Rh Negative' },
    { value: 'duffy_negative', label: 'Duffy Negative' },
    { value: 'diego_positive', label: 'Diego Positive' },
    { value: 'kidd_negative', label: 'Kidd Negative' },
    { value: 'lewis_negative', label: 'Lewis Negative' }
  ];

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleDocumentUpload = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      setUploadedDocument(file);
      setVerificationStatus('analyzing');
      
      // Mock AI analysis
      setTimeout(() => {
        const mockAnalysis = {
          detectedBloodType: formData?.bloodGroup || 'O+',
          confidence: 95,
          documentValid: true,
          issueDate: '2024-07-15',
          issuingLab: 'Apollo Diagnostics',
          rareAntigens: ['rh_negative']
        };
        
        setAiAnalysis(mockAnalysis);
        setVerificationStatus('verified');
        onUpdate({ 
          verificationDocument: file?.name,
          verificationStatus: 'verified',
          aiAnalysis: mockAnalysis
        });
      }, 3000);
    }
  };

  const handleManualVerification = () => {
    setVerificationStatus('manual_review');
    onUpdate({ 
      verificationStatus: 'manual_review',
      requiresManualReview: true
    });
  };

  const getVerificationStatusIcon = () => {
    switch (verificationStatus) {
      case 'analyzing':
        return <Icon name="Loader2" size={20} className="text-warning animate-spin" />;
      case 'verified':
        return <Icon name="CheckCircle" size={20} className="text-success" />;
      case 'manual_review':
        return <Icon name="Clock" size={20} className="text-warning" />;
      default:
        return <Icon name="Upload" size={20} className="text-text-secondary" />;
    }
  };

  const getVerificationStatusText = () => {
    switch (verificationStatus) {
      case 'analyzing':
        return 'AI is analyzing your document...';
      case 'verified':
        return 'Document verified successfully!';
      case 'manual_review':
        return 'Scheduled for manual review by medical staff';
      default:
        return 'Upload your blood type verification document';
    }
  };

  const isFormValid = () => {
    return formData?.bloodGroup && (verificationStatus === 'verified' || verificationStatus === 'manual_review');
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Droplets" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Blood Type Verification</h2>
          <p className="text-sm text-text-secondary">Confirm your blood type with official documentation</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Blood Type Selection */}
        <div className="space-y-6">
          <Select
            label="Confirmed Blood Group"
            options={bloodGroups}
            value={formData?.bloodGroup || ''}
            onChange={(value) => handleInputChange('bloodGroup', value)}
            placeholder="Select your blood group"
            description="Choose the blood group from your medical records"
            required
          />

          {/* Rare Antigens */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Rare Antigens (if known)
            </label>
            <div className="space-y-2">
              {rareAntigens?.map((antigen) => (
                <label key={antigen?.value} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    checked={formData?.rareAntigens?.includes(antigen?.value) || false}
                    onChange={(e) => {
                      const current = formData?.rareAntigens || [];
                      const updated = e?.target?.checked
                        ? [...current, antigen?.value]
                        : current?.filter(item => item !== antigen?.value);
                      handleInputChange('rareAntigens', updated);
                    }}
                  />
                  <div>
                    <span className="text-sm font-medium text-text-primary">{antigen?.label}</span>
                    <p className="text-xs text-text-secondary">Rare blood characteristic</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Last Blood Test Date */}
          <Input
            label="Last Blood Test Date"
            type="date"
            value={formData?.lastBloodTestDate || ''}
            onChange={(e) => handleInputChange('lastBloodTestDate', e?.target?.value)}
            description="When was your blood type last confirmed?"
          />
        </div>

        {/* Document Upload */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Upload Verification Document
            </label>
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {!uploadedDocument ? (
                <div>
                  <Icon name="Upload" size={48} className="mx-auto text-text-secondary mb-4" />
                  <p className="text-sm font-medium text-text-primary mb-2">
                    Upload blood test report or medical certificate
                  </p>
                  <p className="text-xs text-text-secondary mb-4">
                    PDF, JPG, PNG up to 5MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('document-upload')?.click()}>
                    Choose File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    {getVerificationStatusIcon()}
                    <span className="text-sm font-medium text-text-primary">
                      {uploadedDocument?.name}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {getVerificationStatusText()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Results */}
          {aiAnalysis && verificationStatus === 'verified' && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-success mb-2">Verification Complete</h4>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <p><strong>Detected Blood Type:</strong> {aiAnalysis?.detectedBloodType}</p>
                    <p><strong>Confidence:</strong> {aiAnalysis?.confidence}%</p>
                    <p><strong>Issuing Lab:</strong> {aiAnalysis?.issuingLab}</p>
                    <p><strong>Issue Date:</strong> {new Date(aiAnalysis.issueDate)?.toLocaleDateString()}</p>
                    {aiAnalysis?.rareAntigens?.length > 0 && (
                      <p><strong>Detected Rare Antigens:</strong> {aiAnalysis?.rareAntigens?.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Verification Option */}
          {!uploadedDocument && (
            <div className="p-4 border border-border rounded-lg">
              <h4 className="text-sm font-semibold text-text-primary mb-2">
                Don't have documentation?
              </h4>
              <p className="text-xs text-text-secondary mb-3">
                Our medical team can verify your blood type during your first donation appointment.
              </p>
              <Button variant="outline" size="sm" onClick={handleManualVerification}>
                Schedule Manual Verification
              </Button>
            </div>
          )}

          {/* Document Type Selection */}
          <Select
            label="Document Type"
            options={documentTypes}
            value={formData?.documentType || ''}
            onChange={(value) => handleInputChange('documentType', value)}
            placeholder="Select document type"
            description="What type of document are you uploading?"
          />
        </div>
      </div>
      {/* Blood Type Information */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-semibold text-text-primary mb-3">
          Why do we need blood type verification?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary">
          <div className="flex items-start gap-2">
            <Icon name="Shield" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="font-medium">Patient Safety</p>
              <p>Ensures accurate blood matching for recipients</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Target" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="font-medium">Optimal Matching</p>
              <p>AI can find the best donor-patient combinations</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Clock" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="font-medium">Faster Process</p>
              <p>Pre-verified donors can be matched immediately</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Award" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="font-medium">Quality Assurance</p>
              <p>Maintains high standards for blood donation</p>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onPrevious}>
            <Icon name="ChevronLeft" size={16} className="mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Step 3 of 5</span>
          </div>
          <Button 
            onClick={onNext}
            disabled={!isFormValid()}
            className="min-w-[120px]"
          >
            Next Step
            <Icon name="ChevronRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BloodTypeVerificationSection;