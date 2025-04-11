
import React from 'react';
import { WeatherDay } from '@/types/weatherTypes';
import { getActivitySuggestions } from '@/utils/weatherUtils';
import { 
  Mountain, UmbrellaBeach, BookOpen, Film, 
  Coffee, Map, Wind, Heart 
} from 'lucide-react';

interface ActivitySuggestionsProps {
  weatherDay: WeatherDay;
}

const ActivitySuggestions: React.FC<ActivitySuggestionsProps> = ({ weatherDay }) => {
  const suggestions = getActivitySuggestions(weatherDay);
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mountain':
        return <Mountain className="h-5 w-5 text-green-600" />;
      case 'umbrella-beach':
        return <UmbrellaBeach className="h-5 w-5 text-amber-500" />;
      case 'book-open':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'film':
        return <Film className="h-5 w-5 text-indigo-500" />;
      case 'coffee':
        return <Coffee className="h-5 w-5 text-brown-600" />;
      case 'map':
        return <Map className="h-5 w-5 text-teal-600" />;
      case 'wind':
        return <Wind className="h-5 w-5 text-blue-400" />;
      case 'heart':
      default:
        return <Heart className="h-5 w-5 text-red-500" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Activity Suggestions</h3>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-secondary/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {getIcon(suggestion.icon)}
              <h4 className="font-medium">{suggestion.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground mt-3">
        <p>Suggestions based on forecast conditions.</p>
      </div>
    </div>
  );
};

export default ActivitySuggestions;
