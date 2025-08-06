import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const MedicalEligibilitySection = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [eligibilityScore, setEligibilityScore] = useState(0);

  const medicalQuestions = [
    {
      id: 'recentIllness',
      question: 'Have you been ill in the past 2 weeks?',
      description: 'Including fever, cold, flu, or any infection',
      impact: -10,
      category: 'recent'
    },
    {
      id: 'medications',
      question: 'Are you currently taking any medications?',
      description: 'Excluding vitamins and birth control',
      impact: -5,
      category: 'medication'
    },
    {
      id: 'chronicConditions',
      question: 'Do you have any chronic medical conditions?',
      description: 'Diabetes, heart disease, kidney problems, etc.',
      impact: -15,
      category: 'chronic'
    },
    {
      id: 'recentSurgery',
      question: 'Have you had surgery in the past 6 months?',
      description: 'Including dental procedures',
      impact: -10,
      category: 'surgery'
    },
    {
      id: 'bloodTransfusion',
      question: 'Have you received blood transfusion in the past year?',
      description: 'Any blood products or plasma',
      impact: -20,
      category: 'transfusion'
    },
    {
      id: 'pregnancy',
      question: 'Are you currently pregnant or breastfeeding?',
      description: 'For female donors only',
      impact: -25,
      category: 'pregnancy'
    },
    {
      id: 'travel',
      question: 'Have you traveled outside India in the past 3 months?',
      description: 'International travel may require deferral',
      impact: -5,
      category: 'travel'
    },
    {
      id: 'tattoo',
      question: 'Have you gotten a tattoo or piercing in the past 6 months?',
      description: 'Risk of bloodborne infections',
      impact: -10,
      category: 'tattoo'
    }
  ];

  const lifestyleQuestions = [
    {
      id: 'smoking',
      question: 'Do you smoke regularly?',
      description: 'More than 5 cigarettes per day',
      impact: -5,
      category: 'lifestyle'
    },
    {
      id: 'alcohol',
      question: 'Do you consume alcohol frequently?',
      description: 'More than 3 drinks per day',
      impact: -5,
      category: 'lifestyle'
    },
    {
      id: 'exercise',
      question: 'Do you exercise regularly?',
      description: 'At least 3 times per week',
      impact: +5,
      category: 'lifestyle'
    },
    {
      id: 'sleep',
      question: 'Do you get adequate sleep?',
      description: '7-8 hours per night',
      impact: +5,
      category: 'lifestyle'
    }
  ];

  const allQuestions = [...medicalQuestions, ...lifestyleQuestions];

  const handleAnswerChange = (questionId, answer) => {
    const updatedAnswers = {
      ...formData?.medicalAnswers,
      [questionId]: answer
    };
    
    onUpdate({ medicalAnswers: updatedAnswers });
    calculateEligibilityScore(updatedAnswers);
  };

  const calculateEligibilityScore = (answers) => {
    let score = 100; // Start with perfect score
    
    allQuestions?.forEach(question => {
      if (answers?.[question?.id] === true) {
        score += question?.impact;
      }
    });
    
    setEligibilityScore(Math.max(0, score));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent - Eligible to donate';
    if (score >= 60) return 'Good - May require medical review';
    return 'Needs Review - Please consult with medical staff';
  };

  const getRestrictionExplanation = (questionId) => {
    const explanations = {
      recentIllness: 'Recent illness may affect blood quality and donor health',
      medications: 'Some medications may pass through blood and affect recipients',
      chronicConditions: 'Chronic conditions may make donation unsafe for donor',
      recentSurgery: 'Recent surgery requires healing time before donation',
      bloodTransfusion: 'Risk of transmitting infections through blood',
      pregnancy: 'Pregnancy and breastfeeding require additional iron reserves',
      travel: 'International travel may expose to region-specific diseases',
      tattoo: 'Recent tattoos/piercings carry infection risk'
    };
    return explanations?.[questionId] || '';
  };

  const isFormValid = () => {
    return Object.keys(formData?.medicalAnswers || {})?.length >= medicalQuestions?.length;
  };

  React.useEffect(() => {
    if (formData?.medicalAnswers) {
      calculateEligibilityScore(formData?.medicalAnswers);
    }
  }, [formData?.medicalAnswers]);

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Heart" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Medical Eligibility</h2>
          <p className="text-sm text-text-secondary">Help us ensure safe donation for everyone</p>
        </div>
      </div>
      {/* Eligibility Score Display */}
      {eligibilityScore > 0 && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Eligibility Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(eligibilityScore)}`}>
              {eligibilityScore}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                eligibilityScore >= 80 ? 'bg-success' : 
                eligibilityScore >= 60 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${eligibilityScore}%` }}
            ></div>
          </div>
          <p className={`text-sm font-medium ${getScoreColor(eligibilityScore)}`}>
            {getScoreStatus(eligibilityScore)}
          </p>
        </div>
      )}
      {/* Medical Questions */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Medical History</h3>
          <div className="space-y-4">
            {medicalQuestions?.map((question) => (
              <div key={question?.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-text-primary block mb-1">
                      {question?.question}
                    </label>
                    <p className="text-xs text-text-secondary mb-3">
                      {question?.description}
                    </p>
                    
                    <div className="flex gap-4">
                      <Checkbox
                        label="Yes"
                        checked={formData?.medicalAnswers?.[question?.id] === true}
                        onChange={(e) => handleAnswerChange(question?.id, e?.target?.checked ? true : false)}
                      />
                      <Checkbox
                        label="No"
                        checked={formData?.medicalAnswers?.[question?.id] === false}
                        onChange={(e) => handleAnswerChange(question?.id, e?.target?.checked ? false : true)}
                      />
                    </div>

                    {formData?.medicalAnswers?.[question?.id] === true && (
                      <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-warning">
                              This may affect your eligibility
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              {getRestrictionExplanation(question?.id)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Questions */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Lifestyle Assessment</h3>
          <div className="space-y-4">
            {lifestyleQuestions?.map((question) => (
              <div key={question?.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-text-primary block mb-1">
                      {question?.question}
                    </label>
                    <p className="text-xs text-text-secondary mb-3">
                      {question?.description}
                    </p>
                    
                    <div className="flex gap-4">
                      <Checkbox
                        label="Yes"
                        checked={formData?.medicalAnswers?.[question?.id] === true}
                        onChange={(e) => handleAnswerChange(question?.id, e?.target?.checked ? true : false)}
                      />
                      <Checkbox
                        label="No"
                        checked={formData?.medicalAnswers?.[question?.id] === false}
                        onChange={(e) => handleAnswerChange(question?.id, e?.target?.checked ? false : true)}
                      />
                    </div>

                    {formData?.medicalAnswers?.[question?.id] === true && question?.impact > 0 && (
                      <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                          <p className="text-sm text-success">
                            Great! This improves your donation readiness
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Step 2 of 5</span>
          </div>
          <Button 
            onClick={onNext}
            disabled={!isFormValid() || eligibilityScore < 60}
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

export default MedicalEligibilitySection;