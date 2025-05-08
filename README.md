# SpaceX Launch Explorer

A modern web application built with React and TypeScript that provides detailed information about SpaceX launches, rockets, and missions.

## Features

- **Launch Tracking**: Browse through all SpaceX launches with detailed mission information
- **Real-time Data**: Integration with the SpaceX API (v4) for up-to-date launch information
- **Search & Filter**: Easy-to-use search functionality and multiple sorting options
- **Responsive Design**: Built with Mantine UI for a seamless experience across all devices
- **Authentication System**: Secure login/register system to access launch details

## Tech Stack

- React 18
- TypeScript
- Vite
- Mantine UI Components
- React Query for data fetching
- React Router for navigation
- Zustand for state management
- SASS for styling
- Axios for API requests

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server address shown in your terminal

## Authentication Note

For testing purposes, you can use any username with the following password:

```
password
```

Example:

- Username: your_name
- Password: password

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── api/           # API integration
├── components/    # Reusable components
├── pages/         # Page components
│   ├── landing/   # Landing page
│   ├── launches/  # Launches list and detail pages
│   ├── login/     # Login page
│   └── register/  # Registration page
├── store/         # State management
├── styles/        # SASS styles
└── theme/         # Theme configuration
```

## Features in Detail

### Launches List

- View all SpaceX launches
- Search launches by name or details
- Sort by launch date, mission name, or flight number
- Filter launches by status (upcoming, successful, failed)
- Infinite scrolling for smooth data loading

### Launch Details

- Comprehensive mission information
- Mission patch images
- Launch status and date
- Rocket specifications
- External links (webcast, article, Wikipedia)

### User Interface

- Clean and modern design
- Responsive layout
- Dark/light theme support
- Loading states and error handling
- Interactive components and animations

## License

Private - All rights reserved
