
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Sun, CloudSun, Cloud, CloudRain, Snowflake, Wind, CloudLightning } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWeatherData, getWeatherIcon } from '@/utils/weatherUtils';
import { WeatherData, WeatherDay } from '@/types/weatherTypes';
import DayDetails from './DayDetails';

const WeatherCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  useEffect(() => {
    const fetchMonthData = async () => {
      setLoading(true);
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      
      const data = await fetchWeatherData('London', start, end);
      setWeatherData(data);
      setLoading(false);
    };
    
    fetchMonthData();
  }, [currentDate]);
  
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const handleSelectDate = (date: Date) => {
    // If same date is clicked again, toggle details
    if (isSameDay(date, selectedDate)) {
      setIsDetailsOpen(!isDetailsOpen);
    } else {
      // Different date, select it and show details
      setSelectedDate(date);
      setIsDetailsOpen(true);
    }
  };
  
  const getWeatherForDay = (date: Date): WeatherDay | undefined => {
    if (!weatherData?.days) return undefined;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return weatherData.days.find(day => day.datetime === dateStr);
  };
  
  const renderWeatherIcon = (weatherIcon: string, size = 16) => {
    const iconName = getWeatherIcon(weatherIcon);
    
    switch (iconName) {
      case 'sun':
        return <Sun size={size} className="text-[hsl(var(--sunny))]" />;
      case 'cloud-sun':
        return <CloudSun size={size} className="text-[hsl(var(--cloudy))]" />;
      case 'cloud':
        return <Cloud size={size} className="text-[hsl(var(--cloudy))]" />;
      case 'cloud-rain':
        return <CloudRain size={size} className="text-[hsl(var(--rainy))]" />;
      case 'snowflake':
        return <Snowflake size={size} className="text-[hsl(var(--snowy))]" />;
      case 'wind':
        return <Wind size={size} className="text-muted-foreground" />;
      case 'cloud-lightning':
        return <CloudLightning size={size} className="text-amber-500" />;
      default:
        return <Sun size={size} className="text-[hsl(var(--sunny))]" />;
    }
  };
  
  const renderCalendarDays = () => {
    if (!currentDate) return null;
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Adjust the start date to be the first day of the week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Adjust the end date to be the last day of the week
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center py-2 font-semibold text-sm">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayWeather = getWeatherForDay(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "p-2 rounded-md cursor-pointer transition-all duration-150 hover:bg-accent/50",
                isToday && "bg-accent/40 font-bold",
                isSelected && "bg-primary/10 border border-primary/30",
                !isCurrentMonth && "opacity-40",
                "flex flex-col items-center"
              )}
              onClick={() => handleSelectDate(day)}
            >
              <div className="text-sm font-medium mb-1">
                {format(day, 'd')}
              </div>
              
              {loading ? (
                <Skeleton className="w-6 h-6 rounded-full" />
              ) : dayWeather ? (
                <>
                  <div className="mb-1">
                    {renderWeatherIcon(dayWeather.icon)}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{Math.round(dayWeather.tempmax)}°</span>
                    <span className="text-muted-foreground">/{Math.round(dayWeather.tempmin)}°</span>
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Weather Calendar</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-xl font-semibold min-w-24 text-center">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {renderCalendarDays()}
        </CardContent>
      </Card>
      
      <DayDetails 
        date={selectedDate} 
        weatherDay={getWeatherForDay(selectedDate)} 
        loading={loading}
        isOpen={isDetailsOpen}
        onToggle={() => setIsDetailsOpen(!isDetailsOpen)}
      />
    </div>
  );
};

export default WeatherCalendar;
