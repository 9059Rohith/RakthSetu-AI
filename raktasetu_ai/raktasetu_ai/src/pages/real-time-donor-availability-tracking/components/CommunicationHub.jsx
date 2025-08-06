import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CommunicationHub = ({ activeChats, onSendMessage, onStartChat, onTranslate }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState('en');

  const mockChats = [
    {
      id: 1,
      type: 'donor',
      name: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastMessage: 'I am 5 minutes away from the hospital',
      timestamp: new Date(Date.now() - 300000),
      unreadCount: 2,
      language: 'ta',
      messages: [
        {
          id: 1,
          sender: 'donor',
          content: 'நான் மருத்துவமனைக்கு வந்து கொண்டிருக்கிறேன்',
          translation: 'I am coming to the hospital',
          timestamp: new Date(Date.now() - 600000),
          type: 'text'
        },
        {
          id: 2,
          sender: 'caregiver',
          content: 'Thank you! Please proceed to Ward 3 when you arrive.',
          timestamp: new Date(Date.now() - 450000),
          type: 'text'
        },
        {
          id: 3,
          sender: 'donor',
          content: 'நான் 5 நிமிடத்தில் மருத்துவமனையை அடைவேன்',
          translation: 'I am 5 minutes away from the hospital',
          timestamp: new Date(Date.now() - 300000),
          type: 'text'
        }
      ]
    },
    {
      id: 2,
      type: 'hospital',
      name: 'Dr. Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastMessage: 'Room 312 is prepared for transfusion',
      timestamp: new Date(Date.now() - 900000),
      unreadCount: 0,
      language: 'en',
      messages: [
        {
          id: 1,
          sender: 'hospital',
          content: 'Patient preparation is complete. We are ready for the donor.',
          timestamp: new Date(Date.now() - 1200000),
          type: 'text'
        },
        {
          id: 2,
          sender: 'caregiver',
          content: 'Great! Donor is en route, ETA 15 minutes.',
          timestamp: new Date(Date.now() - 1000000),
          type: 'text'
        },
        {
          id: 3,
          sender: 'hospital',
          content: 'Room 312 is prepared for transfusion',
          timestamp: new Date(Date.now() - 900000),
          type: 'text'
        }
      ]
    },
    {
      id: 3,
      type: 'backup_donor',
      name: 'Arjun Patel',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'away',
      lastMessage: 'Standing by if needed',
      timestamp: new Date(Date.now() - 1800000),
      unreadCount: 0,
      language: 'en',
      messages: [
        {
          id: 1,
          sender: 'backup_donor',
          content: 'I am available as backup donor if needed.',
          timestamp: new Date(Date.now() - 2400000),
          type: 'text'
        },
        {
          id: 2,
          sender: 'caregiver',
          content: 'Thank you for being on standby. Will update you if needed.',
          timestamp: new Date(Date.now() - 2100000),
          type: 'text'
        },
        {
          id: 3,
          sender: 'backup_donor',
          content: 'Standing by if needed',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'away':
        return 'bg-warning';
      case 'offline':
        return 'bg-muted-foreground';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getChatTypeIcon = (type) => {
    switch (type) {
      case 'donor':
        return 'User';
      case 'hospital':
        return 'Building2';
      case 'backup_donor':
        return 'Users';
      default:
        return 'MessageCircle';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return timestamp?.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!messageInput?.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'caregiver',
      content: messageInput,
      timestamp: new Date(),
      type: 'text'
    };

    onSendMessage(selectedChat?.id, newMessage);
    setMessageInput('');
  };

  const handleTranslateMessage = async (messageId) => {
    setIsTranslating(true);
    // Simulate translation API call
    setTimeout(() => {
      setIsTranslating(false);
    }, 1000);
  };

  const selectedChatData = mockChats?.find(chat => chat?.id === selectedChat?.id);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden h-96 lg:h-[500px]">
      <div className="flex h-full">
        {/* Chat List */}
        <div className="w-full lg:w-1/3 border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-card-foreground">Communications</h3>
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e?.target?.value)}
                  className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded border border-border"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ்</option>
                </select>
                <button className="p-1 hover:bg-muted rounded">
                  <Icon name="Settings" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-1">
              <button
                onClick={() => onStartChat('emergency')}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-error/10 text-error text-xs rounded hover:bg-error/20 transition-colors"
              >
                <Icon name="AlertTriangle" size={12} />
                <span>Emergency</span>
              </button>
              <button
                onClick={() => onStartChat('broadcast')}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded hover:bg-primary/20 transition-colors"
              >
                <Icon name="Users" size={12} />
                <span>Broadcast</span>
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {mockChats?.map((chat) => (
              <div
                key={chat?.id}
                className={`p-3 border-b border-border cursor-pointer transition-colors ${
                  selectedChat?.id === chat?.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={chat?.avatar}
                      alt={chat?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(chat?.status)}`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-card-foreground truncate">{chat?.name}</span>
                        <Icon name={getChatTypeIcon(chat?.type)} size={12} className="text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(chat?.timestamp)}
                        </span>
                        {chat?.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {chat?.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat?.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex-col ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
          {selectedChatData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="lg:hidden p-1 hover:bg-muted rounded"
                    >
                      <Icon name="ArrowLeft" size={16} />
                    </button>
                    <img
                      src={selectedChatData?.avatar}
                      alt={selectedChatData?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-card-foreground">{selectedChatData?.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{selectedChatData?.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded">
                      <Icon name="Phone" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded">
                      <Icon name="Video" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded">
                      <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChatData?.messages?.map((message) => (
                  <div
                    key={message?.id}
                    className={`flex ${message?.sender === 'caregiver' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message?.sender === 'caregiver' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
                    } rounded-lg p-3`}>
                      <p className="text-sm">{message?.content}</p>
                      {message?.translation && (
                        <div className="mt-2 pt-2 border-t border-current/20">
                          <p className="text-xs opacity-80">{message?.translation}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {formatTimestamp(message?.timestamp)}
                        </span>
                        {message?.sender !== 'caregiver' && selectedChatData?.language !== 'en' && (
                          <button
                            onClick={() => handleTranslateMessage(message?.id)}
                            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                          >
                            <Icon name="Languages" size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-muted rounded">
                    <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e?.target?.value)}
                    onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-muted text-foreground rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput?.trim()}
                    className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon name="Send" size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;