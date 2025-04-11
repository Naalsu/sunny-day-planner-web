
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Sun, Moon, Droplets, Wind, Thermometer, Clock, Umbrella 
} from 'lucide-react';
import { WeatherDay } from '@/types/weatherTypes';
import ActivitySuggestions from './ActivitySuggestions';

interface DayDetailsProps {
  date: Date;
  weatherDay?: WeatherDay;
  loading: boolean;
}

const DayDetails: React.FC<DayDetailsProps> = ({ date, weatherDay, loading }) => {
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
          <CardTitle>{format(date, 'EEEE, MMMM d, yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No weather data available for this date.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
          <span className="text-lg font-normal">
            {Math.round(weatherDay.tempmax)}°C / {Math.round(weatherDay.tempmin)}°C
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
    </Card>
  );
};

export default DayDetails;
