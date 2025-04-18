
# Weather Calendar Application

A dynamic weather calendar application that displays weather forecasts with detailed daily information and activity suggestions based on weather conditions.

## Features

- Interactive calendar interface with daily weather information
- Detailed weather data including temperature, humidity, wind speed, and more
- Activity suggestions based on weather conditions
- Collapsible daily weather details
- Responsive design for all device sizes
- Intuitive weather icons and visual indicators

## Tech Stack

### Core Technologies
- TypeScript 5.x
- React 18.x
- Vite (Build tool)
- SWC (Compiler)

### UI & Styling
- Tailwind CSS
- shadcn/ui (Component library)
- Radix UI (Headless components)
- Lucide React (Icon library)

### State Management & Data
- TanStack Query (React Query v5)
- React Hook Form
- Zod (Schema validation)
- date-fns (Date manipulation)
- react-day-picker (Calendar component)

### Routing
- React Router DOM v6

### Testing Tools & Quality Assurance
- Vitest (Unit testing)
- React Testing Library (Component testing)
- TypeScript (Static type checking)
- ESLint (Code linting)
- Prettier (Code formatting)

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
  ├── components/        # React components
  ├── hooks/            # Custom React hooks
  ├── pages/            # Page components
  ├── types/            # TypeScript type definitions
  ├── utils/            # Utility functions
  └── lib/             # Shared libraries
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_KEY=your_weather_api_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

