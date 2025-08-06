import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CountdownTimer = ({ nextTransfusionDate, urgencyLevel = 'normal' }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const target = new Date(nextTransfusionDate);
      const difference = target?.getTime() - now?.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [nextTransfusionDate]);

  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case 'critical':
        return 'bg-error text-error-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  const getUrgencyIcon = () => {
    switch (urgencyLevel) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'Clock';
      default:
        return 'Heart';
    }
  };

  return (
    <div className={`rounded-xl p-6 ${getUrgencyColor()} shadow-medium`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name={getUrgencyIcon()} size={24} />
          <h2 className="text-lg font-semibold">Next Transfusion</h2>
        </div>
        <div className="text-sm opacity-90">
          {urgencyLevel === 'critical' ? 'Urgent' : urgencyLevel === 'warning' ? 'Soon' : 'Scheduled'}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeRemaining?.days}</div>
          <div className="text-sm opacity-90">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeRemaining?.hours}</div>
          <div className="text-sm opacity-90">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeRemaining?.minutes}</div>
          <div className="text-sm opacity-90">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeRemaining?.seconds}</div>
          <div className="text-sm opacity-90">Seconds</div>
        </div>
      </div>
      <div className="text-center text-sm opacity-90">
        Predicted for {new Date(nextTransfusionDate)?.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
};

export default CountdownTimer;