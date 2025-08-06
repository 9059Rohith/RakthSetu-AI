import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters, 
  isOpen, 
  onToggle,
  emergencyMode = false 
}) => {
  const distanceOptions = [
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '25', label: '25 km' },
    { value: '50', label: '50 km' },
    { value: '100', label: '100 km' },
    { value: 'unlimited', label: 'Unlimited' }
  ];

  const availabilityOptions = [
    { value: 'now', label: 'Available Now' },
    { value: '1hour', label: 'Within 1 Hour' },
    { value: '6hours', label: 'Within 6 Hours' },
    { value: '24hours', label: 'Within 24 Hours' },
    { value: 'week', label: 'This Week' }
  ];

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const rareAntigens = [
    'Kell (K)', 'Duffy (Fya)', 'Kidd (Jka)', 'Diego (Dia)', 'Lewis (Lea)',
    'MNS (M)', 'P1PK (P1)', 'Lutheran (Lua)', 'Colton (Coa)', 'Dombrock (Doa)'
  ];

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full"
          iconName="Filter"
          iconPosition="left"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      {/* Filter Panel */}
      <div className={`${
        isOpen ? 'block' : 'hidden lg:block'
      } bg-surface border border-border rounded-lg p-4 ${
        emergencyMode ? 'border-error/30 bg-error/5' : ''
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Icon name="Filter" size={18} />
            Advanced Filters
          </h3>
          {emergencyMode && (
            <span className="px-2 py-1 bg-error/10 text-error text-xs rounded font-medium">
              Emergency Mode
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* Distance Filter */}
          <div>
            <Select
              label="Maximum Distance"
              options={distanceOptions}
              value={filters?.maxDistance}
              onChange={(value) => onFilterChange('maxDistance', value)}
              placeholder="Select distance"
            />
          </div>

          {/* Availability Filter */}
          <div>
            <Select
              label="Availability Window"
              options={availabilityOptions}
              value={filters?.availability}
              onChange={(value) => onFilterChange('availability', value)}
              placeholder="Select availability"
            />
          </div>

          {/* Blood Type Filter */}
          <div>
            <Select
              label="Preferred Blood Types"
              options={bloodTypeOptions}
              value={filters?.bloodTypes}
              onChange={(value) => onFilterChange('bloodTypes', value)}
              multiple
              placeholder="Select blood types"
            />
          </div>

          {/* Minimum Compatibility Score */}
          <div>
            <Input
              label="Minimum Compatibility Score (%)"
              type="number"
              min="0"
              max="100"
              value={filters?.minCompatibility}
              onChange={(e) => onFilterChange('minCompatibility', e?.target?.value)}
              placeholder="70"
            />
          </div>

          {/* Minimum Reliability Score */}
          <div>
            <Input
              label="Minimum Reliability Score (%)"
              type="number"
              min="0"
              max="100"
              value={filters?.minReliability}
              onChange={(e) => onFilterChange('minReliability', e?.target?.value)}
              placeholder="80"
            />
          </div>

          {/* Rare Antigens */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Required Rare Antigens
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {rareAntigens?.map((antigen) => (
                <Checkbox
                  key={antigen}
                  label={antigen}
                  checked={filters?.rareAntigens?.includes(antigen) || false}
                  onChange={(e) => {
                    const current = filters?.rareAntigens || [];
                    const updated = e?.target?.checked
                      ? [...current, antigen]
                      : current?.filter(a => a !== antigen);
                    onFilterChange('rareAntigens', updated);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Priority Donors Only */}
          <div>
            <Checkbox
              label="Priority Donors Only"
              description="Show only verified high-reliability donors"
              checked={filters?.priorityOnly || false}
              onChange={(e) => onFilterChange('priorityOnly', e?.target?.checked)}
            />
          </div>

          {/* Previous Donors */}
          <div>
            <Checkbox
              label="Include Previous Donors"
              description="Show donors who have donated to this patient before"
              checked={filters?.includePrevious || false}
              onChange={(e) => onFilterChange('includePrevious', e?.target?.checked)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              variant={emergencyMode ? "destructive" : "default"}
              onClick={onApplyFilters}
              className="flex-1"
              iconName="Search"
              iconPosition="left"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={onResetFilters}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
          </div>

          {/* Results Summary */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Users" size={14} className="text-text-secondary" />
              <span className="font-medium text-text-primary">Filter Results</span>
            </div>
            <p className="text-text-secondary">
              Current filters will show donors within {filters?.maxDistance || '25'} km 
              with {filters?.minCompatibility || '70'}%+ compatibility
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;