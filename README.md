# Football Career Mode Backend

Backend API for a football career mode simulator, built with NestJS, TypeScript, and Prisma.

## Features

- **Career Management:** Create and manage football careers and their seasons.
- **Team Management:** Manage clubs, managers, stadiums, and team information.
- **Player Management:** Manage player profiles, positions, attributes, and team associations.
- **Competition Management:** Configure competitions, editions, participants, and competition formats.
- **Fixture Management:** Generate league fixtures, group-stage fixtures, and knockout matches.
- **Match Management:** Manage scheduled matches, results, match statistics, and match outcomes.
- **Knockout System:** Manage knockout rounds, pairings, one-legged and two-legged ties, and round progression.
- **Statistics:** Track player and team performance across seasons and individual matches.
- **Transfers:** Manage player transfers, loans, free-agent signings, and youth promotions.

## Tech Stack

| Technology      | Purpose                  |
| --------------- | ------------------------ |
| Node.js         | Runtime environment      |
| TypeScript      | Programming language     |
| NestJS 11       | Backend framework        |
| Prisma 7        | ORM and database toolkit |
| MySQL           | Relational database      |
| MariaDB Adapter | Prisma database driver   |
| Swagger         | API documentation        |
| Jest            | Testing framework        |
| pnpm            | Package manager          |

## Architecture

The project follows a modular architecture based on NestJS, separating responsibilities into:

- **Modules:** Organize the application by domain.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain business logic and coordinate application operations.
- **Repositories:** Handle database access through Prisma.

Prisma access is restricted to the repository layer, keeping database operations separate from business logic.

## Database

The database is relational and managed through Prisma.

The main domain entities include:

- **Career and Season:** Represent a career save and its seasons.
- **Team and Player:** Store club, manager, player, and squad information.
- **Competition and CompetitionEdition:** Represent competitions and their editions within a season.
- **CompetitionParticipant:** Tracks team participation and competition standings.
- **Match:** Stores fixtures, results, and match information.
- **Tie and KnockoutRound:** Handle knockout pairings, legs, and round progression.
- **Transfer and PlayerTeam:** Track player movements and team associations.
- **Statistics:** Store player and team statistics at season and match level.

Supported competition formats include:

- League
- Knockout
- Groups and Knockout
- Super Cup

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [MySQL](https://www.mysql.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create a `.env` file based on `.env.example`:

   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
   PORT=3000
   ```

   Replace the connection details with your MySQL credentials and database information.

5. Generate the Prisma Client:

   ```bash
   pnpm exec prisma generate
   ```

6. Apply database migrations:

   ```bash
   pnpm exec prisma migrate dev
   ```

7. Populate the database:

   ```bash
   pnpm seed
   ```

## Running the Application

Start the development server:

```bash
pnpm start:dev
```

Other available commands:

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm start`       | Start the application                        |
| `pnpm start:dev`   | Start in development mode with watch enabled |
| `pnpm start:debug` | Start in debug mode                          |
| `pnpm build`       | Build the application                        |
| `pnpm start:prod`  | Run the production build                     |

## Available Scripts

| Command                        | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| `pnpm install`                 | Install project dependencies                      |
| `pnpm seed`                    | Populate the database using the seed script       |
| `pnpm exec prisma generate`    | Generate the Prisma Client                        |
| `pnpm exec prisma migrate dev` | Create and apply development migrations           |
| `pnpm format`                  | Format source and test files with Prettier        |
| `pnpm lint`                    | Run ESLint and automatically fix supported issues |
| `pnpm test`                    | Run unit tests                                    |
| `pnpm test:watch`              | Run tests in watch mode                           |
| `pnpm test:cov`                | Run tests with coverage                           |
| `pnpm test:debug`              | Run tests in debug mode                           |
| `pnpm test:e2e`                | Run end-to-end tests                              |

## API Documentation

The API documentation is provided through Swagger.

Once the application is running, access the Swagger UI at:

`http://localhost:3000/api`

## Project Status

**Active Development — Nearing Completion**

The main backend functionality is implemented. Remaining work includes:

- National team management.
- National team competitions.
- Adapting existing helpers to support national team formats.
- Expanding response DTO coverage across endpoints.
- Completing API documentation and final validation.

## License

This project is currently marked as `UNLICENSED` and is not distributed under an open-source license.
