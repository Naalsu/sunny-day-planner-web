
import { WeatherDay, ActivitySuggestion, WeatherData } from '@/types/weatherTypes';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

// OpenWeatherMap API key
const API_KEY = "7bd943fa58373bc02c5baaf8ee3d0477";

export const fetchWeatherData = async (location: string = "London", startDate: string, endDate: string): Promise<WeatherData | null> => {
  try {
    // OpenWeatherMap 5-day forecast API (free tier limitation)
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`;
    
    console.log("Fetching weather data from:", url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Weather API error:", response.status, errorText);
      throw new Error(`Failed to fetch weather data: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Weather data fetched successfully");
    
    // Transform OpenWeatherMap data to match our application's expected format
    const transformedData = transformOpenWeatherMapData(data, location);
    return transformedData;
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

// Transform OpenWeatherMap data to match our application's expected format
const transformOpenWeatherMapData = (data: any, location: string): WeatherData => {
  const days: Record<string, WeatherDay> = {};
  
  // Process the forecast list and group by day
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0]; // Extract date part
    
    if (!days[date]) {
      days[date] = {
        datetime: date,
        temp: item.main.temp,
        tempmax: item.main.temp_max,
        tempmin: item.main.temp_min,
        conditions: item.weather[0].main,
        icon: mapOpenWeatherIconToOurs(item.weather[0].main),
        humidity: item.main.humidity,
        precip: item.rain ? (item.rain['3h'] || 0) : 0,
        precipprob: item.pop ? Math.round(item.pop * 100) : 0,
        windspeed: item.wind.speed,
        winddir: item.wind.deg,
        cloudcover: item.clouds.all,
        uvindex: 0, // OpenWeatherMap free tier doesn't provide UV index
        sunrise: new Date(data.city.sunrise * 1000).toTimeString().substring(0, 5),
        sunset: new Date(data.city.sunset * 1000).toTimeString().substring(0, 5),
        moonphase: 0, // OpenWeatherMap free tier doesn't provide moon phase
        description: item.weather[0].description
      };
    } else {
      // Update min/max temps if needed
      days[date].tempmax = Math.max(days[date].tempmax, item.main.temp_max);
      days[date].tempmin = Math.min(days[date].tempmin, item.main.temp_min);
      
      // Update precipitation probability if higher
      if (item.pop) {
        days[date].precipprob = Math.max(days[date].precipprob, Math.round(item.pop * 100));
      }
    }
  });
  
  return {
    address: location,
    days: Object.values(days),
    timezone: data.city.timezone,
    description: `Weather forecast for ${location}`
  };
};

// Map OpenWeatherMap icons to our application's icon set
const mapOpenWeatherIconToOurs = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('clear')) return 'clear-day';
  if (conditionLower.includes('cloud') && conditionLower.includes('scattered')) return 'partly-cloudy-day';
  if (conditionLower.includes('cloud')) return 'cloudy';
  if (conditionLower.includes('rain')) return 'rain';
  if (conditionLower.includes('snow')) return 'snow';
  if (conditionLower.includes('thunder')) return 'thunderstorm';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'fog';
  
  return 'clear-day'; // Default
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
  const { temp, conditions, windspeed, precipprob } = weather;
  const suggestions: ActivitySuggestion[] = [];
  
  const conditionLower = conditions.toLowerCase();
  
  // Sunny day suggestions
  if ((conditionLower.includes('clear') || conditionLower.includes('sun')) && temp > 15) {
    suggestions.push({
      title: 'Outdoor Adventure',
      description: 'Perfect day for hiking, biking, or a picnic in the park!',
      icon: 'mountain'
    });
    
    if (temp > 20) {
      suggestions.push({
        title: 'Beach Day',
        description: 'Great weather for swimming or relaxing by the water.',
        icon: 'umbrella'
      });
    }
  }
  
  // Rainy day suggestions
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || precipprob > 40) {
    suggestions.push({
      title: 'Indoor Creativity',
      description: 'Stay dry with art projects, baking, or catching up on reading.',
      icon: 'book-open'
    });
    suggestions.push({
      title: 'Movie Marathon',
      description: 'Perfect day to watch that series you\'ve been meaning to see.',
      icon: 'film'
    });
  }
  
  // Cloudy day suggestions
  if (conditionLower.includes('cloud') && !conditionLower.includes('rain') && precipprob < 30) {
    suggestions.push({
      title: 'Urban Exploration',
      description: 'Great day for visiting museums, galleries, or exploring a new neighborhood.',
      icon: 'map'
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
      title: 'Outdoor Workout',
      description: 'Comfortable temperature for running, cycling, or outdoor yoga.',
      icon: 'heart'
    });
  }
  
  // Windy day suggestions
  if (windspeed > 15) {
    suggestions.push({
      title: 'Kite Flying',
      description: 'Take advantage of the wind with kite flying or sailing.',
      icon: 'wind'
    });
  }
  
  // Snow day suggestions
  if (conditionLower.includes('snow')) {
    suggestions.push({
      title: 'Winter Fun',
      description: 'Build a snowman, go sledding, or enjoy a winter wonderland walk.',
      icon: 'snowflake'
    });
  }
  
  // Default suggestions if none match
  if (suggestions.length === 0) {
    suggestions.push({
      title: 'Self-Care Day',
      description: 'A perfect day to focus on yourself - exercise, meditation, or a new hobby.',
      icon: 'heart'
    });
    
    suggestions.push({
      title: 'Social Gathering',
      description: 'Meet friends for coffee, dinner, or a game night.',
      icon: 'users'
    });
  }
  
  // Limit to 3 suggestions maximum
  return suggestions.slice(0, 3);
};
