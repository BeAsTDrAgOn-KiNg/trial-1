# People for Animals (PFA) Portal

A comprehensive portal for managing animal rescues, clinical cases, wildlife, inventory, and donations for People for Animals (PFA).

## 🚀 Features

- **Rescue Management**: Track cases from reporting to clinical recovery.
- **Wildlife Portal**: Specialized tracking for avian and exotic rescues.
- **Inventory & Medical**: Real-time stock tracking for medicines and housekeeping supplies.
- **ABC (Animal Birth Control)**: Manage sterilization programs and records.
- **Donation Tracking**: Secure logging of financial support.
- **Reports & Analytics**: Dashboard for census and trends.
- **Secure Auth**: Role-based access control for Admins, Doctors, and Data Entry.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js (Express), Prisma ORM, PostgreSQL.
- **AI**: Gemini API integration for automated rescue tips and history processing.
- **Testing**: Jest, Supertest, React Testing Library.

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Gemini API Key (set in `.env`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your DATABASE_URL and GEMINI_API_KEY
   ```
4. Initialize the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Development

Run the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🧪 Testing

The project uses a dual-project Jest configuration for both backend and frontend tests.

### Running All Tests
```bash
npm test
```

### Backend Tests (Server)
Located in `server/tests/`. Built with `supertest` and mocked Prisma.
```bash
# Run only server tests
npx jest --selectProjects server
```

### Frontend Tests (Client)
Located in `src/` (e.g., `App.test.tsx`). Built with React Testing Library and JSDOM.
```bash
# Run only client tests
npx jest --selectProjects client
```

## 📂 Project Structure

- `server/`: Express backend modules and API routes.
- `src/`: React frontend source code.
- `prisma/`: Database schema and migrations.
- `metadata.json`: Application metadata and permissions.

## 🔒 Security

- **Data Sanitization**: Core utility used to strip relational/immutable fields before DB writes.
- **Mocking**: All tests use mocked database and APIs to ensure isolation.
- **RBAC**: UI and API routes are restricted based on user roles (Admin, Doctor, Data Entry).
