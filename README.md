# ParaBounce Projectile Motion Simulator

A dynamic web-based projectile motion simulator built with Next.js and TypeScript, featuring interactive controls and real-time visualizations.

## Features

- Real-time projectile motion simulation
- Interactive parameter controls
- Canvas size customization
- Preset configurations
- Data visualization with graphs
- Custom squid-themed design system
- Responsive layout

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mayer-doa-coder/ParaBounce-Projectile-Motion-Simulator.git
cd ParaBounce-Projectile-Motion-Simulator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Development

To run the development server with Turbopack:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
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