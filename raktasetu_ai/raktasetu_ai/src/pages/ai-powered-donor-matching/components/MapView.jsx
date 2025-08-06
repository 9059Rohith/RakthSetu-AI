import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ donors, patientLocation, isVisible, onToggle, emergencyMode = false }) => {
  if (!isVisible) return null;

  return (
    <div className={`bg-surface border rounded-lg overflow-hidden ${
      emergencyMode ? 'border-error/30' : 'border-border'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Map" size={18} className="text-text-primary" />
          <h3 className="font-semibold text-text-primary">Donor Locations</h3>
          {emergencyMode && (
            <span className="px-2 py-1 bg-error/10 text-error text-xs rounded font-medium">
              Emergency
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      <div className="relative h-96">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Donor Locations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${patientLocation?.lat},${patientLocation?.lng}&z=12&output=embed`}
          className="w-full h-full"
        />

        {/* Map Overlay Controls */}
        <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3 shadow-medium">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-xs text-text-primary">Patient Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-xs text-text-primary">Available Donors ({donors?.filter(d => d?.availabilityStatus === 'available')?.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-xs text-text-primary">Busy Donors ({donors?.filter(d => d?.availabilityStatus === 'busy')?.length})</span>
            </div>
            {emergencyMode && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
                <span className="text-xs text-error font-medium">Emergency Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Travel Time Info */}
        <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3 shadow-medium">
          <div className="text-xs text-text-secondary mb-1">Optimal Route</div>
          <div className="flex items-center gap-2">
            <Icon name="Navigation" size={14} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {donors?.length > 0 ? `${Math.min(...donors?.map(d => d?.travelTime))} min` : 'N/A'}
            </span>
          </div>
          <div className="text-xs text-text-secondary mt-1">to nearest donor</div>
        </div>
      </div>
      {/* Donor List Below Map */}
      <div className="p-4 border-t border-border max-h-48 overflow-y-auto">
        <h4 className="text-sm font-medium text-text-primary mb-3">Nearby Donors</h4>
        <div className="space-y-2">
          {donors?.slice(0, 5)?.map((donor) => (
            <div key={donor?.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  donor?.availabilityStatus === 'available' ? 'bg-success' :
                  donor?.availabilityStatus === 'busy' ? 'bg-warning' : 'bg-error'
                }`}></div>
                <span className="text-sm font-medium text-text-primary">{donor?.name}</span>
                <span className="text-xs text-text-secondary">({donor?.bloodType})</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">{donor?.distance} km</div>
                <div className="text-xs text-text-secondary">{donor?.travelTime} min</div>
              </div>
            </div>
          ))}
          
          {donors?.length > 5 && (
            <div className="text-center pt-2">
              <span className="text-xs text-text-secondary">
                +{donors?.length - 5} more donors available
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;