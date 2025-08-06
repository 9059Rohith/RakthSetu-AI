import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';

const GamificationSection = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [selectedGoals, setSelectedGoals] = useState(formData?.donationGoals || []);
  const [sharePreferences, setSharePreferences] = useState(formData?.sharePreferences || {});

  const achievements = [
    { id: 'first_donation', name: 'First Drop', description: 'Complete your first donation', icon: 'Droplets', earned: false, progress: 0 },
    { id: 'monthly_donor', name: 'Monthly Hero', description: 'Donate every month for 3 months', icon: 'Calendar', earned: false, progress: 0 },
    { id: 'life_saver', name: 'Life Saver', description: 'Save 3 lives through donations', icon: 'Heart', earned: false, progress: 0 },
    { id: 'community_champion', name: 'Community Champion', description: 'Refer 5 friends to donate', icon: 'Users', earned: false, progress: 0 },
    { id: 'emergency_responder', name: 'Emergency Responder', description: 'Respond to 2 emergency requests', icon: 'AlertTriangle', earned: false, progress: 0 },
    { id: 'streak_master', name: 'Streak Master', description: 'Maintain 6-month donation streak', icon: 'Zap', earned: false, progress: 0 }
  ];

  const donationGoals = [
    { value: 'save_lives', label: 'Save Lives', description: 'Help patients in critical need', icon: 'Heart' },
    { value: 'community_service', label: 'Community Service', description: 'Give back to society', icon: 'Users' },
    { value: 'health_benefits', label: 'Health Benefits', description: 'Regular health checkups', icon: 'Activity' },
    { value: 'social_impact', label: 'Social Impact', description: 'Make a difference', icon: 'Globe' },
    { value: 'personal_challenge', label: 'Personal Challenge', description: 'Set and achieve goals', icon: 'Target' },
    { value: 'family_tradition', label: 'Family Tradition', description: 'Continue family legacy', icon: 'Home' }
  ];

  const leaderboardData = [
    { rank: 1, name: 'Priya Sharma', donations: 24, streak: 12, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { rank: 2, name: 'Rahul Kumar', donations: 22, streak: 8, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { rank: 3, name: 'Anita Patel', donations: 20, streak: 15, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { rank: 4, name: 'You', donations: 0, streak: 0, avatar: 'https://randomuser.me/api/portraits/men/4.jpg', isUser: true },
    { rank: 5, name: 'Vikram Singh', donations: 18, streak: 6, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' }
  ];

  const challenges = [
    {
      id: 'new_year_challenge',
      title: 'New Year Blood Drive',
      description: 'Donate blood in January 2025',
      participants: 156,
      deadline: '2025-01-31',
      reward: '500 points + Special Badge',
      progress: 0
    },
    {
      id: 'college_challenge',
      title: 'College Champions',
      description: 'Students vs Professionals donation challenge',
      participants: 89,
      deadline: '2025-02-15',
      reward: 'Team Trophy + Recognition',
      progress: 0
    },
    {
      id: 'emergency_response',
      title: 'Emergency Response Team',
      description: 'Be available for emergency calls',
      participants: 234,
      deadline: 'Ongoing',
      reward: 'Emergency Hero Badge',
      progress: 0
    }
  ];

  const handleGoalToggle = (goalValue) => {
    const updated = selectedGoals?.includes(goalValue)
      ? selectedGoals?.filter(g => g !== goalValue)
      : [...selectedGoals, goalValue];
    setSelectedGoals(updated);
    onUpdate({ donationGoals: updated });
  };

  const handleSharePreferenceChange = (platform, enabled) => {
    const updated = { ...sharePreferences, [platform]: enabled };
    setSharePreferences(updated);
    onUpdate({ sharePreferences: updated });
  };

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const joinChallenge = (challengeId) => {
    const currentChallenges = formData?.joinedChallenges || [];
    if (!currentChallenges?.includes(challengeId)) {
      onUpdate({ joinedChallenges: [...currentChallenges, challengeId] });
    }
  };

  const isFormValid = () => {
    return selectedGoals?.length > 0;
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Trophy" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Community & Motivation</h2>
          <p className="text-sm text-text-secondary">Join our donor community and track your impact</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Donation Goals */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">What motivates you to donate?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationGoals?.map((goal) => (
              <button
                key={goal?.value}
                onClick={() => handleGoalToggle(goal?.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedGoals?.includes(goal?.value)
                    ? 'border-primary bg-primary/5 text-primary' :'border-border bg-surface text-text-primary hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon 
                    name={goal?.icon} 
                    size={20} 
                    className={selectedGoals?.includes(goal?.value) ? 'text-primary' : 'text-text-secondary'}
                  />
                  <div>
                    <div className="text-sm font-medium">{goal?.label}</div>
                    <div className="text-xs opacity-70 mt-1">{goal?.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Badges */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Achievement Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements?.map((achievement) => (
              <div
                key={achievement?.id}
                className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                  achievement?.earned
                    ? 'border-success bg-success/5 text-success' :'border-border bg-muted text-text-secondary'
                }`}
              >
                <Icon 
                  name={achievement?.icon} 
                  size={24} 
                  className={`mx-auto mb-2 ${achievement?.earned ? 'text-success' : 'text-text-secondary'}`}
                />
                <div className="text-xs font-medium">{achievement?.name}</div>
                <div className="text-xs opacity-70 mt-1">{achievement?.description}</div>
                {!achievement?.earned && (
                  <div className="mt-2">
                    <div className="w-full bg-border rounded-full h-1">
                      <div 
                        className="h-1 bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${achievement?.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Community Leaderboard</h3>
          <div className="bg-muted rounded-lg p-4">
            <div className="space-y-3">
              {leaderboardData?.map((user) => (
                <div
                  key={user?.rank}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                    user?.isUser 
                      ? 'bg-primary/10 border border-primary/20' :'bg-surface hover:bg-surface/80'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    user?.rank <= 3 ? 'bg-warning text-white' : 'bg-text-secondary text-white'
                  }`}>
                    {user?.rank}
                  </div>
                  <Image 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">
                      {user?.name} {user?.isUser && '(You)'}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {user?.donations} donations • {user?.streak} month streak
                    </div>
                  </div>
                  {user?.rank <= 3 && (
                    <Icon name="Award" size={20} className="text-warning" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View Full Leaderboard
              </Button>
            </div>
          </div>
        </div>

        {/* Community Challenges */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Active Challenges</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {challenges?.map((challenge) => (
              <div key={challenge?.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{challenge?.title}</h4>
                    <p className="text-xs text-text-secondary mt-1">{challenge?.description}</p>
                  </div>
                  <Button
                    variant={formData?.joinedChallenges?.includes(challenge?.id) ? "success" : "outline"}
                    size="xs"
                    onClick={() => joinChallenge(challenge?.id)}
                    disabled={formData?.joinedChallenges?.includes(challenge?.id)}
                  >
                    {formData?.joinedChallenges?.includes(challenge?.id) ? 'Joined' : 'Join'}
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Icon name="Users" size={12} />
                    <span>{challenge?.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Icon name="Calendar" size={12} />
                    <span>Ends: {new Date(challenge.deadline)?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Icon name="Gift" size={12} />
                    <span>{challenge?.reward}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Sharing Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Social Sharing</h3>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm text-text-secondary mb-4">
              Share your donation milestones and inspire others to donate
            </p>
            <div className="space-y-3">
              {[
                { platform: 'facebook', label: 'Facebook', icon: 'Facebook' },
                { platform: 'instagram', label: 'Instagram', icon: 'Instagram' },
                { platform: 'twitter', label: 'Twitter', icon: 'Twitter' },
                { platform: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' }
              ]?.map((social) => (
                <Checkbox
                  key={social?.platform}
                  label={`Share on ${social?.label}`}
                  checked={sharePreferences?.[social?.platform] || false}
                  onChange={(e) => handleSharePreferenceChange(social?.platform, e?.target?.checked)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Personal Story */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Your Donation Story (Optional)</h3>
          <div className="space-y-4">
            <Input
              label="Personal Motivation"
              type="text"
              placeholder="What inspired you to become a blood donor?"
              value={formData?.personalStory || ''}
              onChange={(e) => handleInputChange('personalStory', e?.target?.value)}
              description="Share your story to inspire others"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                label="Share my story publicly"
                checked={formData?.shareStoryPublicly || false}
                onChange={(e) => handleInputChange('shareStoryPublicly', e?.target?.checked)}
              />
              <Checkbox
                label="Allow story in newsletters"
                checked={formData?.allowStoryInNewsletter || false}
                onChange={(e) => handleInputChange('allowStoryInNewsletter', e?.target?.checked)}
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Community Notifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Achievement notifications"
              description="Get notified when you earn badges"
              checked={formData?.achievementNotifications || false}
              onChange={(e) => handleInputChange('achievementNotifications', e?.target?.checked)}
            />
            <Checkbox
              label="Challenge updates"
              description="Updates on community challenges"
              checked={formData?.challengeNotifications || false}
              onChange={(e) => handleInputChange('challengeNotifications', e?.target?.checked)}
            />
            <Checkbox
              label="Leaderboard updates"
              description="Weekly leaderboard positions"
              checked={formData?.leaderboardNotifications || false}
              onChange={(e) => handleInputChange('leaderboardNotifications', e?.target?.checked)}
            />
            <Checkbox
              label="Friend activity"
              description="When friends donate or achieve milestones"
              checked={formData?.friendActivityNotifications || false}
              onChange={(e) => handleInputChange('friendActivityNotifications', e?.target?.checked)}
            />
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
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Step 5 of 5</span>
          </div>
          <Button 
            onClick={onNext}
            disabled={!isFormValid()}
            className="min-w-[120px]"
          >
            Complete Registration
            <Icon name="Check" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GamificationSection;