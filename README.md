# Jax UI - Options Analysis Dashboard

A React-based dashboard for analyzing options data, featuring Delta Exposure (DEX) and Gamma Exposure (GEX) visualizations.

## Prerequisites

### Installing Node.js and npm
1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
1a. Install npm via brew: `brew install npm`
2. npm (Node Package Manager) comes bundled with Node.js
3. Verify installation: 

## Project Setup
1. Clone the repository: `git clone https://github.com/your-repo/options-analysis-dashboard.git`
2. Navigate to the project directory: `cd options-analysis-dashboard`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

The application will be available at `http://localhost:3000`.

## Project Structure
```
jax-ui/
├── public/ # Static files
│ ├── index.html # Main HTML file
│ └── favicon.ico # Website icon
├── src/ # Source code
│ ├── components/ # React components
│ │ ├── charts/ # Chart components
│ │ │ ├── PriceChart.js # Stock price chart
│ │ │ ├── DexChart.js # Delta exposure chart
│ │ │ └── GexChart.js # Gamma exposure chart
│ │ ├── layout/ # Layout components
│ │ │ ├── Header.js # Top navigation/header
│ │ │ └── Sidebar.js # Side navigation
│ │ └── common/ # Shared components
│ │ └── ChartContainer.js # Wrapper for charts
│ ├── styles/ # CSS styles
│ │ └── main.css # Global styles
│ ├── App.js # Main application component
│ └── index.js # Application entry point
└── package.json # Project dependencies and scripts
```

## Directory Details

### `/public`
Contains static files that are served directly. The `index.html` file is the template that React uses to render the application.

### `/src/components`
Contains all React components organized by function:

#### `/src/components/charts`
Chart components for different types of analysis:
- `PriceChart.js`: Displays stock price movements
- `DexChart.js`: Shows Delta exposure analysis with multiple expiration dates
- `GexChart.js`: Shows Gamma exposure analysis with multiple expiration dates

#### `/src/components/layout`
Components that define the application's structure:
- `Header.js`: Top navigation bar and search functionality
- `Sidebar.js`: Side navigation menu with different analysis options

#### `/src/components/common`
Reusable components used throughout the application:
- `ChartContainer.js`: Wrapper component providing consistent styling for charts

### `/src/styles`
Contains global CSS styles and theme definitions:
- `main.css`: Global styles applied across the application

## Key Features

- Interactive charts using Nivo charts library
- Multiple expiration date visualization
- Hover tooltips showing detailed information
- Responsive layout
- Consistent styling across components

## Dependencies

Major dependencies include:
- React 18.2.0
- React DOM 18.2.0
- @nivo/core, @nivo/line, @nivo/bar for charting
- styled-components for styling

## Development

To add new features or modify existing ones:

1. Charts: Add or modify files in `/src/components/charts`
2. Layout: Update components in `/src/components/layout`
3. Styles: Modify global styles in `/src/styles/main.css`
4. Common Components: Add shared components in `/src/components/common`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Notes

- The application uses React 18 for improved performance and features
- Charts are built using the Nivo library for smooth animations and interactivity
- Styling is handled through styled-components for component-level CSS
```