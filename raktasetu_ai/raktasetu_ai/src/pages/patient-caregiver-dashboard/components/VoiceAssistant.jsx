import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceAssistant = ({ onVoiceCommand, isListening, language = 'tamil' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentCommands, setRecentCommands] = useState([
    { id: 1, command: "Next transfusion date", response: "Your next transfusion is scheduled in 5 days", timestamp: new Date(Date.now() - 300000) },
    { id: 2, command: "Find nearby donors", response: "Found 3 compatible donors within 10km", timestamp: new Date(Date.now() - 600000) },
    { id: 3, command: "Emergency contact", response: "Emergency services have been notified", timestamp: new Date(Date.now() - 900000) }
  ]);

  const quickCommands = [
    { id: 'next-transfusion', label: 'Next Transfusion', command: 'When is my next transfusion?' },
    { id: 'find-donors', label: 'Find Donors', command: 'Find nearby blood donors' },
    { id: 'emergency', label: 'Emergency', command: 'I need emergency blood' },
    { id: 'appointment', label: 'Appointment', command: 'Schedule an appointment' }
  ];

  const handleVoiceToggle = () => {
    if (onVoiceCommand) {
      onVoiceCommand(!isListening);
    }
  };

  const handleQuickCommand = (command) => {
    if (onVoiceCommand) {
      onVoiceCommand(command);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isListening ? 'bg-primary animate-pulse' : 'bg-muted'
            }`}>
              <Icon 
                name="Mic" 
                size={20} 
                className={isListening ? 'text-primary-foreground' : 'text-muted-foreground'}
              />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Voice Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {language === 'tamil' ? 'தமிழில் பேசுங்கள்' : 'Speak in English'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Voice Control */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className="flex-1"
            iconName={isListening ? "MicOff" : "Mic"}
            iconPosition="left"
            onClick={handleVoiceToggle}
          >
            {isListening ? 'Stop Listening' : 'Start Voice Command'}
          </Button>
        </div>

        {isListening && (
          <div className="bg-primary/10 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Listening...</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'tamil' ?'உங்கள் கேள்வியை தமிழில் கேளுங்கள்' :'Ask your question in English or Tamil'
              }
            </p>
          </div>
        )}

        {/* Quick Commands */}
        {isExpanded && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-3">Quick Commands</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickCommands?.map((cmd) => (
                  <button
                    key={cmd?.id}
                    className="p-2 text-xs bg-muted hover:bg-muted/80 rounded-lg text-left transition-colors"
                    onClick={() => handleQuickCommand(cmd?.command)}
                  >
                    {cmd?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Commands */}
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-3">Recent Commands</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {recentCommands?.map((cmd) => (
                  <div key={cmd?.id} className="bg-muted rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-medium text-card-foreground">
                        "{cmd?.command}"
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(cmd?.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cmd?.response}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Status Indicator */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${
            isListening ? 'bg-success animate-pulse' : 'bg-muted-foreground'
          }`}></div>
          <span>
            {isListening ? 'Voice assistant active' : 'Voice assistant ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;