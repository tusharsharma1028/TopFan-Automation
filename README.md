# TopFan-Automation

A modern React.js application for TopFan automation platform, built with industry best practices and production-ready architecture.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)

You can verify your installation by running:
```bash
node --version
npm --version
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TopFan-Automation
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.development
```

Edit `.env.development` with your local configuration values.

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run test:coverage`
Runs tests and generates a coverage report.

### `npm run lint`
Runs ESLint to check code quality and identify issues.

### `npm run lint:fix`
Runs ESLint and automatically fixes fixable issues.

### `npm run format`
Runs Prettier to format all code files according to the project's style guide.

## Project Structure

```
TopFan-Automation/
├── public/                 # Static files
│   ├── index.html         # HTML entry point
│   ├── manifest.json      # PWA configuration
│   ├── robots.txt         # SEO configuration
│   └── favicon.ico        # App icon
├── src/
│   ├── assets/            # Images, fonts, icons
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── components/        # React components
│   │   ├── common/        # Reusable components (Button, Input, Loader)
│   │   └── layout/        # Layout components (Header, Footer, Sidebar)
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── routes/            # Routing configuration
│   ├── services/          # API services
│   ├── store/             # Redux store and slices
│   ├── styles/            # Global styles and variables
│   ├── utils/             # Utility functions
│   ├── App.js             # Root component
│   ├── App.css            # Root component styles
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .gitignore             # Git ignore rules
├── jsconfig.json          # JavaScript configuration and path aliases
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Environment Configuration

The application uses environment variables for configuration. All environment variables must be prefixed with `REACT_APP_` to be accessible in the React application.

### Environment Files
- `.env.example` - Template with all available variables
- `.env.development` - Development environment configuration
- `.env.production` - Production environment configuration

**Important**: Never commit `.env` files containing sensitive data to version control.

## Path Aliases

The project uses path aliases for cleaner imports:

```javascript
import Button from '@components/common/Button/Button';
import { login } from '@services/authService';
import { formatDate } from '@utils/helpers';
```

Available aliases:
- `@components` → `src/components`
- `@pages` → `src/pages`
- `@services` → `src/services`
- `@utils` → `src/utils`
- `@hooks` → `src/hooks`
- `@assets` → `src/assets`
- `@styles` → `src/styles`
- `@store` → `src/store`
- `@routes` → `src/routes`
- `@context` → `src/context`

## State Management

The application uses Redux Toolkit for state management:
- **Store**: Configured in `src/store/store.js`
- **Slices**: Located in `src/store/slices/`
- **Persistence**: Redux Persist is configured for selected state

## API Integration

API calls are centralized in the `src/services/` directory:
- `apiClient.js` - Axios instance with interceptors
- `authService.js` - Authentication endpoints
- `userService.js` - User management endpoints

All API requests include:
- Automatic authentication token injection
- Centralized error handling
- Request/response logging (development only)

## Coding Standards

### JavaScript
- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use functional components and hooks
- Prefer named exports for utilities, default exports for components

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes for type checking

### Styling
- Use CSS Modules for component-scoped styles
- Use SCSS variables for colors, spacing, and breakpoints
- Follow mobile-first responsive design
- Maintain consistent naming conventions (BEM or similar)

### Testing
- Write unit tests for utilities and hooks
- Write component tests for UI components
- Aim for >80% code coverage
- Use React Testing Library best practices

## Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and tests: `npm run lint && npm test`
4. Commit with descriptive messages
5. Push and create a pull request

### Pre-commit Hooks

Husky is configured to run the following checks before each commit:
- ESLint on staged JavaScript files
- Prettier formatting on staged files

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Deployment

### Production Build
```bash
npm run build
```

The optimized production build will be created in the `build/` directory.

### Server Configuration

For proper routing with React Router, configure your server to redirect all routes to `index.html`.

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
npx kill-port 3000
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### ESLint errors
```bash
# Auto-fix common issues
npm run lint:fix
```

## Contributing

1. Follow the coding standards outlined above
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR
5. Keep pull requests focused and small

## License

Private - All rights reserved

## Support

For questions or issues, please contact the development team.
