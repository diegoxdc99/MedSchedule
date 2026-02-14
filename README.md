# MedSchedule Pro 💊

A modern, production-ready web application for generating, tracking, and exporting medication schedules.

## ✨ Features

- **Schedule Generation**: Calculate doses by days or by fixed quantity
- **Dose Tracking**: Mark doses as taken with interactive checkboxes
- **PDF Export**: Export schedules in 1 or 2-column layouts
- **Calendar Integration**: Export to Google Calendar, Outlook, or .ics files
- **Dark/Light Theme**: Full dark mode support with system preference detection
- **Internationalization**: English and Spanish support
- **12h/24h Time Format**: Toggle between time display formats
- **Modern UI**: Glassmorphism design, animations, and responsive layout

## 🚀 Getting Started

### Prerequisites

- Node.js 24.x
- pnpm 10.x

### Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## 🐳 Docker

```bash
# Build the image
docker build -t medschedule .

# Run the container
docker run -p 3000:80 medschedule

# Or using docker-compose
docker compose up -d
```

Access the app at `http://localhost:3000`

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 7 |
| Styling | TailwindCSS 4 |
| State | Zustand 5 |
| i18n | i18next |
| Dates | date-fns 4 |
| PDF | jsPDF + jspdf-autotable |
| Testing | Vitest + React Testing Library |
| Container | Docker + Nginx |

## 📁 Project Structure

```
src/
├── components/         # React UI components
├── store/              # Zustand state management
├── utils/              # Business logic & utilities
├── i18n/               # Translations (en/es)
├── __tests__/          # Unit & component tests
└── test/               # Test setup
```

## 📄 License

MIT
