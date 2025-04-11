
import { WeatherDay, ActivitySuggestion } from '@/types/weatherTypes';
import { toast } from '@/hooks/use-toast';

const API_KEY = "YOUR_API_KEY"; // Replace with your Visual Crossing API key

export const fetchWeatherData = async (location: string = "London", startDate: string, endDate: string) => {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startDate}/${endDate}?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const getWeatherIcon = (icon: string) => {
  switch (icon) {
    case 'clear-day':
    case 'clear-night':
      return 'sun';
    case 'partly-cloudy-day':
    case 'partly-cloudy-night':
      return 'cloud-sun';
    case 'cloudy':
      return 'cloud';
    case 'rain':
      return 'cloud-rain';
    case 'snow':
      return 'snowflake';
    case 'sleet':
    case 'fog':
    case 'wind':
      return 'wind';
    case 'thunderstorm':
      return 'cloud-lightning';
    default:
      return 'sun';
  }
};

export const getActivitySuggestions = (weather: WeatherDay): ActivitySuggestion[] => {
  const { temp, icon, windspeed, precipprob } = weather;
  const suggestions: ActivitySuggestion[] = [];
  
  // Sunny day suggestions
  if (icon.includes('clear') && temp > 20 && precipprob < 20) {
    suggestions.push({
      title: 'Outdoor Adventure',
      description: 'Perfect day for hiking, biking, or a picnic in the park!',
      icon: 'mountain'
    });
    suggestions.push({
      title: 'Beach Day',
      description: 'Great weather for swimming or relaxing by the water.',
      icon: 'umbrella-beach'
    });
  }
  
  // Rainy day suggestions
  if (icon.includes('rain') || precipprob > 50) {
    suggestions.push({
      title: 'Indoor Creativity',
      description: 'Stay dry with art projects, baking, or catching up on reading.',
      icon: 'book-open'
    });
    suggestions.push({
      title: 'Movie Marathon',
      description: 'Perfect day to watch that series you've been meaning to see.',
      icon: 'film'
    });
  }
  
  // Cold day suggestions
  if (temp < 10) {
    suggestions.push({
      title: 'Cozy Day In',
      description: 'Enjoy hot drinks, comfort food, and warm blankets.',
      icon: 'coffee'
    });
  }
  
  // Moderate temperature suggestions
  if (temp >= 10 && temp <= 20 && precipprob < 30) {
    suggestions.push({
      title: 'Urban Exploration',
      description: 'Great day for visiting museums, galleries, or exploring a new neighborhood.',
      icon: 'map'
    });
  }
  
  // Windy day suggestions
  if (windspeed > 20) {
    suggestions.push({
      title: 'Kite Flying',
      description: 'Take advantage of the wind with kite flying or sailing.',
      icon: 'wind'
    });
  }
  
  // Default suggestions if none match
  if (suggestions.length === 0) {
    suggestions.push({
      title: 'Self-Care Day',
      description: 'A perfect day to focus on yourself - exercise, meditation, or a new hobby.',
      icon: 'heart'
    });
  }
  
  return suggestions;
};
