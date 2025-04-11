
import React from 'react';
import WeatherCalendar from '@/components/WeatherCalendar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Weather Calendar</h1>
      <WeatherCalendar />
    </div>
  );
};

export default Index;
