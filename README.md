# Car Dealership Inventory System

A production-quality full-stack Car Dealership Inventory System built with a Spring Boot REST backend, a PostgreSQL database, and a responsive React Single Page Application (SPA). The project is built following Clean Architecture, SOLID design principles, and Test-Driven Development (TDD).

---

## 🛠️ Tech Stack & Requirements

### Backend REST API
* **Language:** Java 21 (LTS)
* **Framework:** Spring Boot 3.5.16
* **Security:** Spring Security & JWT (Stateless Session)
* **Persistence:** Spring Data JPA & PostgreSQL (Hibernate)
* **Object Mapping:** MapStruct (compile-time mapping)
* **Utilities:** Lombok & Bean Validation
* **Testing:** JUnit 5, Mockito & MockMvc
* **Documentation:** OpenAPI / Swagger UI

### Frontend SPA
* **Library:** React (Vite environment)
* **Styling:** Bootstrap & CSS Custom Variables
* **State Management:** Context API
* **Routing:** React Router (Protected and Admin routes)
* **HTTP Client:** Axios (interceptor enabled)

### Database
* **Database:** PostgreSQL (No H2 or in-memory database used)

---

## 📂 Folder Structure

The repository organizes backend source files and frontend assets separately:

```
CarDealership/
│
├── backend/                # Spring Boot backend project
│   ├── pom.xml             # Maven build configurations
│   ├── src/main/java/com/incubyte/cardealership/   # Spring Boot Source Code
│   │   ├── config/         # Spring Security, JPA Auditing, Swagger & Seeder configurations
│   │   ├── controller/     # AuthController & VehicleController REST routes
│   │   ├── dto/            # Request & Response schemas (RegisterRequest, VehicleCreateRequest, etc.)
│   │   ├── entity/         # JPA database entities (User, Vehicle, Auditing base class)
│   │   ├── exception/      # Custom exceptions and GlobalExceptionHandler
│   │   ├── mapper/         # MapStruct interfaces for compile-time conversions
│   │   ├── repository/     # Spring Data JPA Repository classes
│   │   ├── security/       # JWT Token providers, filters, and authorization managers
│   │   ├── service/        # Core business service contracts & implementations
│   │   └── specification/  # JPA dynamic query filtering criteria Specifications
│   ├── src/main/resources/
│   │   ├── application.yml # Database credentials, log profiles and security settings
│   │   └── schema.sql      # SQL table, index, and relational constraint schema mappings
│   └── src/test/java/      # Unit and integration test suites
│
├── frontend/               # React SPA Source Code (Vite setup)
│   ├── src/
│   │   ├── api/            # Axios client, request headers injection & 401 interceptor
│   │   ├── components/     # ProtectedRoute, AdminRoute, Navbar, Footer, Spinner, VehicleCard, Dialogs
│   │   ├── context/        # AuthContext managing user sessions and roles
│   │   ├── pages/          # Login, Register, Dashboard, VehicleDetails, AdminDashboard, NotFound (404)
│   │   ├── App.jsx         # Router configs, layouts and wrappers
│   │   ├── main.jsx        # Bootstrap framework integrations & application mounts
│   │   └── index.css       # Premium stylesheets (Inter & Outfit fonts, smooth transitions)
│   ├── package.json        # Node configurations and dependencies
│   └── vite.config.js      # Vite compilation assets and proxy configurations
│
├── CarDealership.postman_collection.json  # Preconfigured Postman endpoints collection
└── README.md               # Project documentation
```

---

## 💾 Local Database Setup & Configuration

This project requires a running PostgreSQL database.

1. Connect to your PostgreSQL server and create a database named `cardealership`:
   ```sql
   CREATE DATABASE cardealership;
   ```
2. Open `backend/src/main/resources/application.yml` and adjust the PostgreSQL credentials to match your local setup:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/cardealership
       username: your_postgresql_username
       password: your_postgresql_password
   ```

At application startup, Spring Boot automatically loads and executes the database schema from [schema.sql](backend/src/main/resources/schema.sql) and seeds mock data using the [DatabaseSeeder](backend/src/main/java/com/incubyte/cardealership/config/DatabaseSeeder.java):
* **Admin User:** `admin@dealership.com` (Password: `AdminPassword123!`, Role: `ROLE_ADMIN`)
* **Normal User:** `user@dealership.com` (Password: `UserPassword123!`, Role: `ROLE_USER`)
* **10 Seed Vehicles:** Set up across multiple body categories (`SUV`, `Sedan`, `Truck`, `Hatchback`, `Luxury`, `Electric`).

---

## 🚀 Local Run Instructions

### 1. Starting the Spring Boot Backend Server
1. Open a terminal in the project root and move into the backend folder:
   ```bash
   cd backend
   mvn clean test
   ```
2. Start the Spring Boot REST server:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start running on port `8081` (`http://localhost:8081`).

### 2. Starting the React Vite Frontend Server
1. Open a new terminal and navigate to the frontend directory from the project root:
   ```bash
   cd frontend
   ```
2. Install Node packages (if not already completed):
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
4. The React application will start running on port `5173`. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📡 API Documentation & Endpoints

### Swagger UI Docs
You can browse, authorize, and test all REST backend endpoints using Swagger UI at:
* **Swagger URL:** [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)
* **V3 Docs JSON:** `http://localhost:8081/v3/api-docs`

### API Endpoint Security Access Matrix

| HTTP Method | URI Path | Required Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Permit All | Register a new user |
| **POST** | `/api/auth/login` | Permit All | Login and obtain Bearer JWT |
| **GET** | `/api/vehicles` | Authenticated | Retrieve paginated vehicle list |
| **GET** | `/api/vehicles/{id}` | Authenticated | Retrieve details of a single vehicle |
| **GET** | `/api/vehicles/search` | Authenticated | Query search (make, model, category, prices) |
| **POST** | `/api/vehicles/{id}/purchase`| Authenticated | Purchase a vehicle (decrements quantity) |
| **POST** | `/api/vehicles` | `ROLE_ADMIN` | Add a new vehicle to inventory |
| **PUT** | `/api/vehicles/{id}` | `ROLE_ADMIN` | Update vehicle properties |
| **DELETE** | `/api/vehicles/{id}` | `ROLE_ADMIN` | Delete a vehicle from database |
| **POST** | `/api/vehicles/{id}/restock` | `ROLE_ADMIN` | Restock vehicle inventory quantity |

---

## 🔒 Concurrency & Transaction Management
* **Inventory Race Conditions:** To prevent double-selling or negative inventory when multiple users order the last vehicle simultaneously, the backend utilizes database-level **Pessimistic Write Locking** (`LockModeType.PESSIMISTIC_WRITE`).
* When `purchaseVehicle(id, qty)` is invoked within a `@Transactional` boundary, it fires a `SELECT ... FOR UPDATE` query, blocking other threads from modifying the target row until the transaction commits or rolls back.

---

## 🧪 Testing Report

This system is built using strict Test-Driven Development (TDD). We mock service dependencies and controller endpoints to isolate tests and achieve high code coverage.

Run tests using:
```bash
mvn clean test
```

### Coverage Summary (31 Unit & Integration Tests Passed)
* [UserRepositoryTest](backend/src/test/java/com/incubyte/cardealership/repository/UserRepositoryTest.java) & [VehicleRepositoryTest](backend/src/test/java/com/incubyte/cardealership/repository/VehicleRepositoryTest.java): Confirms entity mapping, Auditing triggers, specs, and locking behaviors.
* [AuthServiceTest](backend/src/test/java/com/incubyte/cardealership/service/AuthServiceTest.java), [VehicleServiceTest](backend/src/test/java/com/incubyte/cardealership/service/VehicleServiceTest.java), [PurchaseServiceTest](backend/src/test/java/com/incubyte/cardealership/service/PurchaseServiceTest.java), and [SearchServiceTest](backend/src/test/java/com/incubyte/cardealership/service/SearchServiceTest.java): Validates password encoding, stock levels, locking and pagination search logic.
* [AuthControllerTest](backend/src/test/java/com/incubyte/cardealership/controller/AuthControllerTest.java) & [VehicleControllerTest](backend/src/test/java/com/incubyte/cardealership/controller/VehicleControllerTest.java): Validates MVC routes, request body validations, exception mapping responses, and authorization roles using MockMvc.

---

## 🤖 My AI Usage

### AI Tools Used
- ChatGPT
- Gemini 3.1 Pro
- Gemini 3.5 Flash

### How I Used AI
I used AI as a development assistant throughout this project rather than as a replacement for my own engineering judgment. It helped me brainstorm the overall architecture, generate initial Spring Boot and React boilerplate, and suggest DTO and entity structures for the backend. I also used it to clarify Spring Security and JWT concepts, draft unit test ideas, and troubleshoot compilation or runtime issues when I was stuck. In several cases, AI provided useful starting points for validation logic, API endpoint design, and README drafts. However, I reviewed every suggestion carefully, adapted it to the project’s needs, and tested and integrated the final implementation myself.

### My Reflection
Using AI increased my development speed and reduced repetitive coding work, especially during the early scaffolding and debugging phases. It also helped me compare alternative implementations before choosing a direction, which made the solution design more thoughtful. That said, the final design decisions, integration work, testing, and validation were completed by me. Understanding the generated code was essential before I could safely merge it into the project, and that process strengthened my confidence in the final result. In short, AI was a helpful assistant that accelerated the workflow without replacing the responsibility of building and verifying the application myself.

### AI Co-authorship
For commits where AI significantly contributed to the implementation, I added Git co-author trailers in line with the assignment requirements. Examples included:
- Co-authored-by: Gemini 3.1 Pro <gemini-pro@users.noreply.github.com>
- Co-authored-by: Gemini 3.5 Flash <gemini-flash@users.noreply.github.com>
- Co-authored-by: ChatGPT <chatgpt@users.noreply.github.com>

These trailers were added only when AI meaningfully assisted with code generation, debugging, or design support.
