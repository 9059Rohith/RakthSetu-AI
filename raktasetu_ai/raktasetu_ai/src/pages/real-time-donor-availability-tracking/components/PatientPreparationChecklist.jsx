import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PatientPreparationChecklist = ({ patient, onUpdateChecklist, onContactHospital }) => {
  const [checkedItems, setCheckedItems] = useState({
    medical_history: true,
    blood_type_verified: true,
    consent_forms: false,
    pre_medication: false,
    iv_access: false,
    vitals_checked: false,
    room_prepared: true,
    staff_notified: true
  });

  const checklistItems = [
    {
      id: 'medical_history',
      category: 'Documentation',
      title: 'Medical History Reviewed',
      description: 'Patient medical records and transfusion history verified',
      priority: 'high',
      estimatedTime: '5 mins',
      responsible: 'Hematologist'
    },
    {
      id: 'blood_type_verified',
      category: 'Documentation',
      title: 'Blood Type Verification',
      description: 'Cross-matching completed and compatibility confirmed',
      priority: 'high',
      estimatedTime: '10 mins',
      responsible: 'Lab Technician'
    },
    {
      id: 'consent_forms',
      category: 'Documentation',
      title: 'Consent Forms Signed',
      description: 'Patient/guardian consent for transfusion obtained',
      priority: 'high',
      estimatedTime: '5 mins',
      responsible: 'Nurse'
    },
    {
      id: 'pre_medication',
      category: 'Medical Preparation',
      title: 'Pre-medication Administered',
      description: 'Antihistamines and fever reducers given if required',
      priority: 'medium',
      estimatedTime: '15 mins',
      responsible: 'Nurse'
    },
    {
      id: 'iv_access',
      category: 'Medical Preparation',
      title: 'IV Access Established',
      description: 'Intravenous line secured and functioning properly',
      priority: 'high',
      estimatedTime: '10 mins',
      responsible: 'Nurse'
    },
    {
      id: 'vitals_checked',
      category: 'Medical Preparation',
      title: 'Baseline Vitals Recorded',
      description: 'Temperature, BP, pulse, and oxygen saturation documented',
      priority: 'high',
      estimatedTime: '5 mins',
      responsible: 'Nurse'
    },
    {
      id: 'room_prepared',
      category: 'Environment',
      title: 'Transfusion Room Ready',
      description: 'Equipment checked and emergency supplies available',
      priority: 'medium',
      estimatedTime: '10 mins',
      responsible: 'Support Staff'
    },
    {
      id: 'staff_notified',
      category: 'Environment',
      title: 'Medical Team Notified',
      description: 'All relevant staff informed of scheduled transfusion',
      priority: 'medium',
      estimatedTime: '2 mins',
      responsible: 'Coordinator'
    }
  ];

  const handleItemToggle = (itemId) => {
    const newCheckedItems = {
      ...checkedItems,
      [itemId]: !checkedItems?.[itemId]
    };
    setCheckedItems(newCheckedItems);
    onUpdateChecklist(newCheckedItems);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Documentation':
        return 'FileText';
      case 'Medical Preparation':
        return 'Activity';
      case 'Environment':
        return 'Building2';
      default:
        return 'CheckSquare';
    }
  };

  const groupedItems = checklistItems?.reduce((groups, item) => {
    const category = item?.category;
    if (!groups?.[category]) {
      groups[category] = [];
    }
    groups?.[category]?.push(item);
    return groups;
  }, {});

  const completedCount = Object.values(checkedItems)?.filter(Boolean)?.length;
  const totalCount = checklistItems?.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const pendingHighPriority = checklistItems?.filter(
    item => item?.priority === 'high' && !checkedItems?.[item?.id]
  )?.length;

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Patient Preparation</h3>
            <p className="text-sm text-muted-foreground">
              Patient: {patient?.name || 'Arun Kumar'} • Blood Type: {patient?.bloodType || 'B+'} • Age: {patient?.age || '12 years'}
            </p>
          </div>
          <button
            onClick={onContactHospital}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Icon name="Phone" size={16} />
            <span className="hidden sm:inline">Contact Hospital</span>
          </button>
        </div>

        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground">
              Completion Progress
            </span>
            <span className="text-sm font-medium text-card-foreground">
              {completedCount}/{totalCount} ({completionPercentage}%)
            </span>
          </div>
          
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Alert for pending high priority items */}
          {pendingHighPriority > 0 && (
            <div className="flex items-center gap-2 p-2 bg-error/10 text-error rounded-md">
              <Icon name="AlertTriangle" size={16} />
              <span className="text-sm font-medium">
                {pendingHighPriority} high priority item{pendingHighPriority !== 1 ? 's' : ''} pending
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Checklist Items */}
      <div className="p-4 space-y-6">
        {Object.entries(groupedItems)?.map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name={getCategoryIcon(category)} size={18} className="text-primary" />
              <h4 className="font-medium text-card-foreground">{category}</h4>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div className="space-y-3">
              {items?.map((item) => (
                <div
                  key={item?.id}
                  className={`p-3 rounded-lg border transition-all ${
                    checkedItems?.[item?.id]
                      ? 'border-success/30 bg-success/5' :'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleItemToggle(item?.id)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        checkedItems?.[item?.id]
                          ? 'border-success bg-success text-success-foreground'
                          : 'border-muted-foreground hover:border-primary'
                      }`}
                    >
                      {checkedItems?.[item?.id] && <Icon name="Check" size={12} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className={`font-medium ${
                          checkedItems?.[item?.id] 
                            ? 'text-muted-foreground line-through' 
                            : 'text-card-foreground'
                        }`}>
                          {item?.title}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${getPriorityColor(item?.priority)}`}>
                            {item?.priority?.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item?.estimatedTime}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${
                        checkedItems?.[item?.id] 
                          ? 'text-muted-foreground' 
                          : 'text-card-foreground'
                      }`}>
                        {item?.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          Responsible: {item?.responsible}
                        </span>
                        {!checkedItems?.[item?.id] && item?.priority === 'high' && (
                          <span className="px-2 py-1 bg-error/10 text-error text-xs rounded">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-success text-success-foreground rounded-md hover:bg-success/90 transition-colors">
            <Icon name="CheckCircle" size={16} />
            <span>Mark All Complete</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-warning text-warning-foreground rounded-md hover:bg-warning/90 transition-colors">
            <Icon name="Clock" size={16} />
            <span>Request Extension</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
            <Icon name="FileText" size={16} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientPreparationChecklist;