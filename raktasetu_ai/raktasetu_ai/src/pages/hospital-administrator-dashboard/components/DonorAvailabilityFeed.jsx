import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DonorAvailabilityFeed = ({ donors, onContactDonor, onBulkNotify, onMatchDonor }) => {
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [filterBloodType, setFilterBloodType] = useState('all');

  const bloodTypes = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success text-success-foreground';
      case 'busy': return 'bg-warning text-warning-foreground';
      case 'unavailable': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCompatibilityScore = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const handleDonorSelect = (donorId) => {
    setSelectedDonors(prev => 
      prev?.includes(donorId) 
        ? prev?.filter(id => id !== donorId)
        : [...prev, donorId]
    );
  };

  const handleSelectAll = () => {
    const availableDonors = filteredDonors?.filter(d => d?.availability === 'available')?.map(d => d?.id);
    setSelectedDonors(prev => 
      prev?.length === availableDonors?.length ? [] : availableDonors
    );
  };

  const filteredDonors = donors?.filter(donor => 
    filterBloodType === 'all' || donor?.bloodType === filterBloodType
  );

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Real-time Donor Feed</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Blood Type Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {bloodTypes?.map(type => (
            <button
              key={type}
              onClick={() => setFilterBloodType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterBloodType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            <Icon name="CheckSquare" size={16} className="mr-2" />
            Select Available
          </Button>
          
          {selectedDonors?.length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onBulkNotify(selectedDonors)}
            >
              <Icon name="Send" size={16} className="mr-2" />
              Notify ({selectedDonors?.length})
            </Button>
          )}
        </div>
      </div>
      {/* Donor List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDonors?.map((donor) => (
          <div
            key={donor?.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
              selectedDonors?.includes(donor?.id) 
                ? 'border-primary bg-primary/5' :'border-border bg-background'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedDonors?.includes(donor?.id)}
                onChange={() => handleDonorSelect(donor?.id)}
                disabled={donor?.availability !== 'available'}
                className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />

              {/* Donor Avatar */}
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Icon name="User" size={16} className="text-primary" />
              </div>

              {/* Donor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">{donor?.name}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(donor?.availability)}`}>
                    {donor?.availability}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Icon name="Droplets" size={14} />
                    {donor?.bloodType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="MapPin" size={14} />
                    {donor?.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    {donor?.lastDonation}
                  </span>
                </div>

                {/* Compatibility Score */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Compatibility:</span>
                    <span className={`text-sm font-medium ${getCompatibilityScore(donor?.compatibilityScore)}`}>
                      {donor?.compatibilityScore}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        className={i < donor?.rating ? 'text-warning fill-current' : 'text-muted-foreground/30'}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({donor?.totalDonations})</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onContactDonor(donor?.id)}
                    disabled={donor?.availability === 'unavailable'}
                  >
                    <Icon name="Phone" size={14} className="mr-1" />
                    Contact
                  </Button>
                  
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => onMatchDonor(donor?.id)}
                    disabled={donor?.availability !== 'available'}
                  >
                    <Icon name="UserCheck" size={14} className="mr-1" />
                    Match
                  </Button>

                  {donor?.availability === 'available' && (
                    <div className="flex items-center gap-1 text-success text-xs ml-auto">
                      <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                      Available now
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDonors?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No donors available for selected blood type</p>
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-success">
              {filteredDonors?.filter(d => d?.availability === 'available')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-warning">
              {filteredDonors?.filter(d => d?.availability === 'busy')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Busy</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-error">
              {filteredDonors?.filter(d => d?.availability === 'unavailable')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Unavailable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorAvailabilityFeed;