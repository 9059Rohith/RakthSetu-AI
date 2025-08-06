import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceEmergencyReporter = ({ onVoiceReport, isActive, onToggle }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);

  const startListening = () => {
    if (!voiceSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results?.length; i++) {
        const transcript = event.results?.[i]?.[0]?.transcript;
        const confidence = event.results?.[i]?.[0]?.confidence;

        if (event.results?.[i]?.isFinal) {
          finalTranscript += transcript;
          setConfidence(confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      // Auto-detect emergency keywords
      const emergencyKeywords = [
        'emergency', 'urgent', 'critical', 'blood needed', 'help',
        'hospital', 'ambulance', 'patient', 'transfusion'
      ];

      const detectedKeywords = emergencyKeywords?.filter(keyword =>
        (finalTranscript || interimTranscript)?.toLowerCase()?.includes(keyword)
      );

      if (detectedKeywords?.length > 0 && finalTranscript) {
        processVoiceReport(finalTranscript, detectedKeywords);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition?.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const processVoiceReport = (transcript, keywords) => {
    const reportData = {
      transcript,
      keywords,
      confidence,
      timestamp: new Date(),
      processed: extractEmergencyInfo(transcript)
    };

    onVoiceReport(reportData);
  };

  const extractEmergencyInfo = (text) => {
    const lowerText = text?.toLowerCase();
    const extracted = {
      urgency: 'medium',
      bloodType: null,
      location: null,
      patientInfo: null
    };

    // Extract urgency level
    if (lowerText?.includes('critical') || lowerText?.includes('dying')) {
      extracted.urgency = 'critical';
    } else if (lowerText?.includes('urgent') || lowerText?.includes('emergency')) {
      extracted.urgency = 'urgent';
    }

    // Extract blood type
    const bloodTypeMatch = text?.match(/\b([ABO]|AB)[+-]?\b/i);
    if (bloodTypeMatch) {
      extracted.bloodType = bloodTypeMatch?.[0]?.toUpperCase();
    }

    // Extract location keywords
    const locationKeywords = ['hospital', 'home', 'clinic', 'ambulance'];
    locationKeywords?.forEach(keyword => {
      if (lowerText?.includes(keyword)) {
        extracted.location = keyword;
      }
    });

    return extracted;
  };

  const quickVoiceCommands = [
    {
      command: "Emergency blood needed",
      description: "Activate critical blood request",
      icon: "AlertTriangle"
    },
    {
      command: "Find nearest hospital",
      description: "Locate nearby medical facilities",
      icon: "MapPin"
    },
    {
      command: "Call ambulance",
      description: "Request emergency transport",
      icon: "Truck"
    },
    {
      command: "Contact family",
      description: "Notify emergency contacts",
      icon: "Users"
    }
  ];

  if (!voiceSupported) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <Icon name="MicOff" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Not Supported</h3>
          <p className="text-gray-600">Your browser doesn't support voice recognition.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <Icon name="Mic" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Voice Emergency Reporter</h2>
          <p className="text-sm text-gray-600">Hands-free emergency reporting</p>
        </div>
      </div>
      {/* Voice Control Interface */}
      <div className="text-center mb-6">
        <div className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${
          isListening 
            ? 'border-red-500 bg-red-50 animate-pulse' :'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } transition-all duration-300 cursor-pointer`}
          onClick={isListening ? stopListening : startListening}
        >
          <Icon 
            name={isListening ? "MicOff" : "Mic"} 
            size={48} 
            className={isListening ? "text-red-600" : "text-gray-600"}
          />
          
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            className="px-8"
          >
            {isListening ? "Stop Listening" : "Start Voice Report"}
          </Button>
        </div>

        {isListening && (
          <p className="text-sm text-red-600 mt-2 animate-pulse">
            🔴 Listening... Speak clearly about your emergency
          </p>
        )}
      </div>
      {/* Live Transcript */}
      {transcript && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MessageSquare" size={16} className="text-blue-600" />
            <span className="font-medium text-gray-900">Live Transcript</span>
            {confidence > 0 && (
              <span className="text-xs text-gray-500">
                Confidence: {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
          <p className="text-gray-800 italic">"{transcript}"</p>
        </div>
      )}
      {/* Quick Voice Commands */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Voice Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickVoiceCommands?.map((command, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setTranscript(command?.command)}
            >
              <Icon name={command?.icon} size={16} className="text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 text-sm">"{command?.command}"</p>
                <p className="text-xs text-gray-600">{command?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Voice Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Info" size={16} className="text-blue-600" />
          <span className="font-medium text-blue-900">Voice Instructions</span>
        </div>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Speak clearly and mention "emergency" or "urgent"</li>
          <li>• Include blood type if known (e.g., "B positive", "O negative")</li>
          <li>• Mention location (hospital, home, clinic)</li>
          <li>• State number of units needed if known</li>
          <li>• The system will automatically detect emergency keywords</li>
        </ul>
      </div>
      {/* Emergency Phrases */}
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="font-medium text-red-900 mb-2">Emergency Phrases Examples:</h4>
        <div className="text-sm text-red-800 space-y-1">
          <p>• "Critical emergency, need B positive blood immediately"</p>
          <p>• "Patient at Apollo Hospital needs urgent transfusion"</p>
          <p>• "Emergency blood request for thalassemia patient"</p>
          <p>• "Need 2 units O negative blood, critical situation"</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceEmergencyReporter;