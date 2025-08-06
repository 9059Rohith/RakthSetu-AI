import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const LiveMapView = ({ donors, selectedDonor, onDonorSelect, hospitalLocation }) => {
  const [mapView, setMapView] = useState('satellite');
  const [showTraffic, setShowTraffic] = useState(true);

  const activeDonors = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      bloodType: 'B+',
      status: 'traveling',
      location: { lat: 11.0168, lng: 76.9558 },
      eta: '15 mins',
      distance: '2.3 km',
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      bloodType: 'B+',
      status: 'confirmed',
      location: { lat: 11.0268, lng: 76.9658 },
      eta: '25 mins',
      distance: '4.1 km',
      phone: '+91 98765 43211'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'traveling':
        return 'bg-primary border-primary text-primary-foreground';
      case 'confirmed':
        return 'bg-success border-success text-success-foreground';
      case 'arrived':
        return 'bg-warning border-warning text-warning-foreground';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'traveling':
        return 'En Route';
      case 'confirmed':
        return 'Confirmed';
      case 'arrived':
        return 'Arrived';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-card-foreground">Live Donor Tracking</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                showTraffic 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Traffic
            </button>
            <select
              value={mapView}
              onChange={(e) => setMapView(e?.target?.value)}
              className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-md border border-border"
            >
              <option value="roadmap">Road</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Active Donors Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>{activeDonors?.filter(d => d?.status === 'traveling')?.length} En Route</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>{activeDonors?.filter(d => d?.status === 'confirmed')?.length} Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="MapPin" size={14} />
            <span>Hospital: Coimbatore Medical Center</span>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-80 lg:h-96">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Donor Tracking Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${hospitalLocation?.lat},${hospitalLocation?.lng}&z=14&output=embed`}
          className="border-0"
        />

        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-card border border-border rounded-md flex items-center justify-center hover:bg-muted transition-colors">
            <Icon name="Plus" size={16} />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-md flex items-center justify-center hover:bg-muted transition-colors">
            <Icon name="Minus" size={16} />
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-md flex items-center justify-center hover:bg-muted transition-colors">
            <Icon name="Locate" size={16} />
          </button>
        </div>

        {/* Traffic Alert */}
        {showTraffic && (
          <div className="absolute bottom-4 left-4 bg-warning/90 text-warning-foreground px-3 py-2 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <Icon name="AlertTriangle" size={14} />
              <span>Heavy traffic on Anna Salai - +10 min delay</span>
            </div>
          </div>
        )}
      </div>
      {/* Donor List */}
      <div className="p-4 border-t border-border">
        <h4 className="font-medium text-card-foreground mb-3">Active Donors</h4>
        <div className="space-y-3">
          {activeDonors?.map((donor) => (
            <div
              key={donor?.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedDonor?.id === donor?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground/30'
              }`}
              onClick={() => onDonorSelect(donor)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(donor?.status)?.split(' ')?.[0]}`}></div>
                  <div>
                    <p className="font-medium text-card-foreground">{donor?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {donor?.bloodType} • {getStatusLabel(donor?.status)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-card-foreground">{donor?.eta}</p>
                  <p className="text-xs text-muted-foreground">{donor?.distance}</p>
                </div>
              </div>

              {/* Donor Actions */}
              <div className="flex items-center gap-2 mt-2">
                <button className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs hover:bg-primary/20 transition-colors">
                  <Icon name="Phone" size={12} />
                  <span>Call</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded text-xs hover:bg-secondary/20 transition-colors">
                  <Icon name="MessageCircle" size={12} />
                  <span>Message</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded text-xs hover:bg-muted/80 transition-colors">
                  <Icon name="Navigation" size={12} />
                  <span>Route</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMapView;