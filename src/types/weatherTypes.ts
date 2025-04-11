
export interface WeatherData {
  address: string;
  days: WeatherDay[];
  timezone: string;
  description: string;
}

export interface WeatherDay {
  datetime: string;
  temp: number;
  tempmax: number;
  tempmin: number;
  conditions: string;
  icon: string;
  humidity: number;
  precip: number;
  precipprob: number;
  windspeed: number;
  winddir: number;
  cloudcover: number;
  uvindex: number;
  sunrise: string;
  sunset: string;
  moonphase: number;
  description: string;
}

export interface ActivitySuggestion {
  title: string;
  description: string;
  icon: string;
}
