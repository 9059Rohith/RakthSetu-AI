import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CompatibilityExamples = ({ userBloodType }) => {
  const [selectedExample, setSelectedExample] = useState(0);

  const patientExamples = [
    {
      id: 1,
      name: 'Arjun Kumar',
      age: 8,
      condition: 'Thalassemia Major',
      bloodType: 'B+',
      urgency: 'high',
      location: 'Coimbatore Medical College',
      distance: '2.5 km',
      nextTransfusion: '2025-01-10',
      story: 'Arjun needs regular blood transfusions every 3 weeks. His family has been managing his condition for 6 years.',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      compatibility: 95,
      rareAntigens: ['Rh+'],
      transfusionHistory: 48
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 12,
      condition: 'Thalassemia Intermedia',
      bloodType: 'O+',
      urgency: 'medium',
      location: 'PSG Hospitals',
      distance: '4.2 km',
      nextTransfusion: '2025-01-15',
      story: 'Priya is a bright student who loves painting. Regular transfusions help her maintain her energy for school.',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      compatibility: 88,
      rareAntigens: ['Rh+', 'Kell-'],
      transfusionHistory: 32
    },
    {
      id: 3,
      name: 'Ravi Patel',
      age: 15,
      condition: 'Sickle Cell Disease',
      bloodType: 'A+',
      urgency: 'low',
      location: 'Kovai Medical Center',
      distance: '6.8 km',
      nextTransfusion: '2025-01-20',
      story: 'Ravi is passionate about cricket and dreams of playing professionally. Your donation helps him stay active.',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      compatibility: 92,
      rareAntigens: ['Rh+', 'Duffy+'],
      transfusionHistory: 28
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getUrgencyBg = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-error/10 border-error/20';
      case 'medium': return 'bg-warning/10 border-warning/20';
      case 'low': return 'bg-success/10 border-success/20';
      default: return 'bg-muted border-border';
    }
  };

  const isCompatible = (patientBloodType, donorBloodType) => {
    const compatibilityMatrix = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };
    
    return compatibilityMatrix?.[donorBloodType]?.includes(patientBloodType) || false;
  };

  const currentPatient = patientExamples?.[selectedExample];
  const compatible = isCompatible(currentPatient?.bloodType, userBloodType);

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Users" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Potential Patient Matches</h3>
          <p className="text-sm text-text-secondary">See how your donation could help patients in need</p>
        </div>
      </div>
      {/* Patient Selection */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {patientExamples?.map((patient, index) => (
          <button
            key={patient?.id}
            onClick={() => setSelectedExample(index)}
            className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedExample === index
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Image 
                src={patient?.avatar} 
                alt={patient?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">{patient?.name}</div>
                <div className="text-xs text-text-secondary">{patient?.bloodType}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Selected Patient Details */}
      <div className={`p-6 rounded-lg border ${getUrgencyBg(currentPatient?.urgency)}`}>
        <div className="flex items-start gap-4 mb-4">
          <Image 
            src={currentPatient?.avatar} 
            alt={currentPatient?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-text-primary">{currentPatient?.name}</h4>
              <span className="text-sm text-text-secondary">Age {currentPatient?.age}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                currentPatient?.urgency === 'high' ? 'bg-error text-error-foreground' :
                currentPatient?.urgency === 'medium' ? 'bg-warning text-warning-foreground' :
                'bg-success text-success-foreground'
              }`}>
                {currentPatient?.urgency?.toUpperCase()} PRIORITY
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-2">{currentPatient?.condition}</p>
            <p className="text-sm text-text-primary">{currentPatient?.story}</p>
          </div>
        </div>

        {/* Compatibility Status */}
        <div className={`p-4 rounded-lg border mb-4 ${
          compatible 
            ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
        }`}>
          <div className="flex items-center gap-3">
            <Icon 
              name={compatible ? "CheckCircle" : "XCircle"} 
              size={20} 
              className={compatible ? "text-success" : "text-error"}
            />
            <div>
              <div className={`text-sm font-semibold ${compatible ? "text-success" : "text-error"}`}>
                {compatible ? "Compatible Match!" : "Not Compatible"}
              </div>
              <div className="text-xs text-text-secondary">
                Your {userBloodType} blood {compatible ? "can help" : "cannot help"} {currentPatient?.name} ({currentPatient?.bloodType})
              </div>
            </div>
            {compatible && (
              <div className="ml-auto text-right">
                <div className="text-lg font-bold text-success">{currentPatient?.compatibility}%</div>
                <div className="text-xs text-text-secondary">Match Score</div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Icon name="Droplets" size={20} className="mx-auto mb-1 text-error" />
            <div className="text-sm font-semibold text-text-primary">{currentPatient?.bloodType}</div>
            <div className="text-xs text-text-secondary">Blood Type</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Icon name="MapPin" size={20} className="mx-auto mb-1 text-primary" />
            <div className="text-sm font-semibold text-text-primary">{currentPatient?.distance}</div>
            <div className="text-xs text-text-secondary">Distance</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Icon name="Calendar" size={20} className="mx-auto mb-1 text-warning" />
            <div className="text-sm font-semibold text-text-primary">
              {new Date(currentPatient.nextTransfusion)?.toLocaleDateString()}
            </div>
            <div className="text-xs text-text-secondary">Next Due</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Icon name="Activity" size={20} className="mx-auto mb-1 text-success" />
            <div className="text-sm font-semibold text-text-primary">{currentPatient?.transfusionHistory}</div>
            <div className="text-xs text-text-secondary">Total Units</div>
          </div>
        </div>

        {/* Hospital Information */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-muted rounded-lg">
          <Icon name="Building2" size={20} className="text-primary" />
          <div>
            <div className="text-sm font-medium text-text-primary">{currentPatient?.location}</div>
            <div className="text-xs text-text-secondary">Treatment Center</div>
          </div>
        </div>

        {/* Rare Antigens */}
        {currentPatient?.rareAntigens?.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-text-primary mb-2">Required Antigens:</div>
            <div className="flex flex-wrap gap-2">
              {currentPatient?.rareAntigens?.map((antigen) => (
                <span key={antigen} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {antigen}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {compatible && (
          <div className="flex gap-3">
            <Button variant="default" size="sm" className="flex-1">
              <Icon name="Heart" size={16} className="mr-2" />
              Express Interest
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="MessageCircle" size={16} className="mr-2" />
              Contact Family
            </Button>
          </div>
        )}
      </div>
      {/* Impact Statistics */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Your Potential Impact</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              {patientExamples?.filter(p => isCompatible(p?.bloodType, userBloodType))?.length}
            </div>
            <div className="text-xs text-text-secondary">Compatible Patients</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success">3-4</div>
            <div className="text-xs text-text-secondary">Lives per Donation</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">450ml</div>
            <div className="text-xs text-text-secondary">Standard Donation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityExamples;