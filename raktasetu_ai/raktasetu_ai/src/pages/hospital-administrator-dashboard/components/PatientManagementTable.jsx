import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PatientManagementTable = ({ patients, onPatientUpdate, onViewDetails, onScheduleAppointment }) => {
  const [sortField, setSortField] = useState('nextTransfusion');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');

  const bloodTypeOptions = [
    { value: '', label: 'All Blood Types' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const urgencyOptions = [
    { value: '', label: 'All Urgency Levels' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'overdue': return 'bg-error text-error-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedPatients = patients?.filter(patient => {
      const matchesSearch = patient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           patient?.patientId?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesBloodType = !filterBloodType || patient?.bloodType === filterBloodType;
      const matchesUrgency = !filterUrgency || patient?.urgency === filterUrgency;
      return matchesSearch && matchesBloodType && matchesUrgency;
    })?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'nextTransfusion') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header with Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Patient Management</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Input
              type="search"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={bloodTypeOptions}
              value={filterBloodType}
              onChange={setFilterBloodType}
              placeholder="Blood Type"
              className="w-full sm:w-40"
            />
            
            <Select
              options={urgencyOptions}
              value={filterUrgency}
              onChange={setFilterUrgency}
              placeholder="Urgency"
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Patient
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort('bloodType')}
                >
                  Blood Type
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                  onClick={() => handleSort('nextTransfusion')}
                >
                  Next Transfusion
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Assigned Donor</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Urgency</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPatients?.map((patient) => (
              <tr key={patient?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient?.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {patient?.patientId}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {patient?.bloodType}
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{patient?.nextTransfusion}</p>
                    <p className="text-sm text-muted-foreground">{patient?.timeRemaining}</p>
                  </div>
                </td>
                <td className="p-4">
                  {patient?.assignedDonor ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-success" />
                      </div>
                      <span className="text-sm text-foreground">{patient?.assignedDonor}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center">
                        <Icon name="Clock" size={12} className="text-warning" />
                      </div>
                      <span className="text-sm text-muted-foreground">Pending</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient?.status)}`}>
                    {patient?.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(patient?.urgency)}`}>
                    {patient?.urgency}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(patient?.id)}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onScheduleAppointment(patient?.id)}
                    >
                      <Icon name="Calendar" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPatientUpdate(patient?.id)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedPatients?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">No patients found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default PatientManagementTable;