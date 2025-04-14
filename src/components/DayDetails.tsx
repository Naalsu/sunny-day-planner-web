
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sun, Moon, Droplets, Wind, Thermometer, Umbrella, ChevronDown, ChevronUp
} from 'lucide-react';
import { WeatherDay } from '@/types/weatherTypes';
import ActivitySuggestions from './ActivitySuggestions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DayDetailsProps {
  date: Date;
  weatherDay?: WeatherDay;
  loading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({ 
  date, 
  weatherDay, 
  loading, 
  isOpen, 
  onToggle 
}) => {
  if (loading) {
    return (
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherDay) {
    return (
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
            <button 
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={isOpen ? "Collapse details" : "Expand details"}
            >
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No weather data available for this date.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="mt-6">
      <Card className="shadow-lg border-t-4 border-t-primary transition-all duration-300">
        <CardHeader className="pb-2">
          <CollapsibleTrigger asChild>
            <CardTitle className="flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity">
              <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-normal">
                  {Math.round(weatherDay.tempmax)}°C / {Math.round(weatherDay.tempmin)}°C
                </span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weather Details</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <span className="text-sm">Feels like: {Math.round(weatherDay.temp)}°C</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Humidity: {weatherDay.humidity}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Precipitation: {weatherDay.precipprob}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Wind: {weatherDay.windspeed} km/h</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Sunrise: {weatherDay.sunrise.slice(0, 5)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-indigo-300" />
                    <span className="text-sm">Sunset: {weatherDay.sunset.slice(0, 5)}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium">Conditions</h4>
                  <p className="mt-1">{weatherDay.description || weatherDay.conditions}</p>
                </div>
              </div>
              
              <div>
                <ActivitySuggestions weatherDay={weatherDay} />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default DayDetails;
