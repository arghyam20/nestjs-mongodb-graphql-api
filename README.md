<div align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <h1>NestJS MongoDB GraphQL API Boilerplate</h1>
  <p>A progressive Node.js backend boilerplate built with NestJS, designed for scalability, performance, and rapid development, featuring both REST (Swagger) and GraphQL endpoints.</p>

  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

---

This starter kit comes pre-configured with MongoDB, JWT Authentication, GraphQL (Apollo Server), Swagger for REST API documentation, and a plethora of ready-to-use modules, giving you a solid foundation for your next great backend project.

## 🚀 Features

- **Framework**: Built on top of [NestJS](https://nestjs.com/) and Express.
- **Database**: [MongoDB](https://www.mongodb.com/) integration using [Mongoose](https://mongoosejs.com/).
- **API Documentation & Endpoints**: 
  - GraphQL API with Apollo Server integration (Playground enabled at `/graphql`).
  - Auto-generated REST OpenAPI (Swagger) documentation available at `/apidoc`.
- **Authentication & Authorization**:
  - JWT (JSON Web Token) based authentication.
  - Access Tokens & Refresh Tokens.
  - Role-Based Access Control (RBAC).
- **Security**:
  - [Helmet](https://helmetjs.github.io/) for setting secure HTTP headers.
  - Cross-Origin Resource Sharing (CORS) enabled.
  - Global API validation using `class-validator` and `class-transformer`.
  - Rate limiting / Throttling.
- **Email Services**: Integrated with [Nodemailer](https://nodemailer.com/) and `email-templates` for transactional emails.
- **Job Queues**: Background task processing using [Bull](https://docs.nestjs.com/techniques/queues) and Redis.
- **Document Generation**: Pre-configured tools for generating:
  - PDFs (`pdf-lib`)
  - Excel Spreadsheets (`exceljs`)
  - Word Documents (`docx`)
- **Ready-to-use Modules**:
  - `auth` - User and Admin authentication.
  - `user` & `role` - User management and permissions.
  - `admin`, `admin-reply`
  - `cms` - Content Management System APIs.
  - `category`, `contact-us`, `media`, `notification`, `setting`, and more.

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
* **Node.js** (v20+ recommended)
* **MongoDB** (running locally or via MongoDB Atlas)
* **Redis** (required for Bull job queues)

## 🛠️ Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy the example environment file and configure your local variables.
   ```bash
   cp env.example .env
   ```

3. **Start the application:**
   ```bash
   # development
   npm run start

   # watch mode (hot-reload)
   npm run start:dev

   # production mode
   npm run build
   npm run start:prod
   ```

## ⚙️ Environment Variables

The `.env` file contains several configuration options. Here's a breakdown of the key variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API Server Port | `3000` |
| `APP_ENV` | Application environment | `development`, `production` |
| `JWT_SECRET` | Secret key for signing Access Tokens | `super-secret-key` |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `604800` (in seconds) |
| `MONGO_URI` | MongoDB Connection String | `mongodb://...` |
| `MAIL_USERNAME` | SMTP User (e.g., Gmail) | `you@gmail.com` |
| `MAIL_PASSWORD` | SMTP Password or App Password | `app-password` |
| `PROJECT_NAME` | Name of your project | `My Project` |
| `BACKEND_URL` | Base URL of the backend | `http://localhost:3000` |
| `SALT_ROUND` | Bcrypt salt rounds for hashing | `10` |

## 📖 API Documentation (Swagger)

Once the application is running, you can access the Swagger UI to view and interact with the API endpoints.

- **REST (Swagger):** `http://localhost:<PORT>/apidoc` (e.g., [http://localhost:3000/apidoc](http://localhost:3000/apidoc))
- **GraphQL Playground:** `http://localhost:<PORT>/graphql` (e.g., [http://localhost:3000/graphql](http://localhost:3000/graphql))

## 📂 Project Structure

```text
src/
├── auth/           # Authentication logic (Strategies, Guards, Services)
├── common/         # Global Pipes, Filters, Interceptors, and utility functions
├── config/         # Application configurations
├── helpers/        # Helper and utility classes
├── modules/        # Feature modules (User, Admin, CMS, Media, etc.)
├── app.module.ts   # Root module
└── main.ts         # Application entry point
```

## 📜 Scripts

- `npm run seed`: Run the database seeder to populate default roles and the initial admin user.
- `npm run build`: Compile the application to the `dist` directory.
- `npm run format`: Format source code using Prettier.
- `npm run lint`: Lint source code using ESLint.
- `npm run test`: Run unit tests using Jest.
- `npm run test:e2e`: Run End-to-End tests.
- `npm run test:cov`: Generate test coverage reports.

## 🚀 Deployment

When deploying to production:
1. Ensure `APP_ENV=production` in your `.env` file.
2. Build the application using `npm run build`.
3. Start the application using `npm run start:prod` (or a process manager like [PM2](https://pm2.keymetrics.io/)).

## 📄 License

This project is [MIT licensed](https://opensource.org/licenses/MIT).
