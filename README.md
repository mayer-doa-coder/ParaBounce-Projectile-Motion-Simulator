# ParaBounce Projectile Motion Simulator

An interactive, physics-based projectile motion simulator built with Next.js and TypeScript. Experience real-time visualization of projectile trajectories with customizable parameters and a unique squid-themed interface.

## How It Works

ParaBounce simulates projectile motion using physics principles and provides an engaging way to visualize and understand the concepts of:
- Projectile trajectories
- Initial velocity and angle
- Gravitational effects
- Air resistance
- Bounce mechanics

### Key Components:

1. **Interactive Canvas**: 
   - Real-time visualization of projectile motion
   - Dynamic trajectory plotting
   - Smooth animations with requestAnimationFrame
   - Custom squid-themed graphics

2. **Control Panel**:
   - Initial velocity adjustment (0-100 m/s)
   - Launch angle selection (0-90 degrees)
   - Gravity customization
   - Air resistance toggle
   - Bounce coefficient adjustment

3. **Data Visualization**:
   - Real-time position graphs (X vs Y)
   - Velocity tracking
   - Time-based measurements
   - Maximum height indicators

4. **Preset Configurations**:
   - Earth gravity (9.81 m/s²)
   - Moon gravity (1.62 m/s²)
   - Mars gravity (3.72 m/s²)
   - Custom gravity options

## Features

- Real-time physics simulation
- Interactive parameter controls
- Customizable canvas size
- Preset physics configurations
- Advanced data visualization
- Custom squid-themed design
- Responsive layout for all devices
- Educational tooltips and guides

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (Latest LTS version recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mayer-doa-coder/ParaBounce-Projectile-Motion-Simulator.git
cd ParaBounce-Projectile-Motion-Simulator
```

2. Install dependencies:
```bash
npm install
```

## Getting Started

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Experiment with the simulator:
   - Adjust the launch angle using the slider
   - Set the initial velocity
   - Choose a preset gravity configuration
   - Toggle air resistance
   - Click "Launch" to see the projectile in action!

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── public/                  # Static assets
│   ├── fonts/              # Custom fonts
│   └── images/             # Images and icons
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   │   ├── controls/     # Simulation control components
│   │   ├── data/        # Data visualization components
│   │   ├── intro/       # Introduction page components
│   │   ├── layout/      # Layout components
│   │   └── simulation/  # Simulation canvas and core
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript type definitions
```

## Tech Stack

- **Framework:** Next.js 15.4.4
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** React Hooks
- **Development Tools:**
  - ESLint
  - Turbopack (for faster development)

## Dependencies

### Core Dependencies
- next: 15.4.4
- react: 19.1.0
- react-dom: 19.1.0
- react-icons: 5.5.0
- tailwind: 2.3.1

### Development Dependencies
- typescript: ^5
- eslint: ^9
- eslint-config-next: 15.4.4
- tailwindcss: ^4
- @types/react: ^19
- @types/react-dom: ^19
- @types/node: ^20

## Important Notes

1. This project uses Turbopack for development (`next dev --turbopack`) for improved performance
2. TypeScript is configured with strict mode enabled
3. The project follows the Next.js App Router pattern
4. Custom color theme is defined in `tailwind.config.js`
5. Project uses modern ES2017 features (configured in tsconfig.json)

## Browser Support

The simulator supports modern browsers with ES2017 feature compatibility:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is MIT licensed. See the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Known Issues

- Some dependencies might show deprecation warnings which can be safely ignored as they're being handled through the package.json overrides
- Turbopack is in beta, but provides significant performance improvements

For any issues or suggestions, please open an issue on the GitHub repository.