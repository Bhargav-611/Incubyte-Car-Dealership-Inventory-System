# Frontend - Car Dealership Inventory System

A modern, responsive React Single Page Application (SPA) built with React 19, Vite, Bootstrap 5, and React Router DOM v7. It communicates with the Spring Boot REST backend to allow vehicle browsing, search filtering, purchase orders, and complete administrative inventory management.

---

## 🛠️ Tech Stack & Libraries
* **Framework:** React 19 & Vite
* **Routing:** React Router DOM v7
* **CSS/Styling:** Bootstrap 5 & CSS variables
* **Icons:** Lucide React
* **HTTP Client:** Axios with dynamic JWT Interceptors
* **State Management:** Context API
* **Unit Testing:** Vitest & React Testing Library (RTL)

---

## 📁 Folder Structure

We organize directories under `src/` to separate concerns:
* **`api/`**: Instantiates the Axios client with global JWT request headers injection and 401 token expiry error interceptors.
* **`services/`**: Separates network query operations (`authService`, `vehicleService`) from view rendering components.
* **`context/`**: Contains React Context providers (`AuthContext`) managing the logged-in session state.
* **`hooks/`**: Exposes custom hooks (`useAuth`) to safely access AuthContext.
* **`routes/`**: Compiles routing paths, `<Routes>`, `<Route>` guards (`ProtectedRoute`, `AdminRoute`), and page layout mappings.
* **`layouts/`**: Reusable structural frames (e.g. `MainLayout` wrapping header/footer grids).
* **`components/`**: Houses independent UI widgets (grids, cards, tables, pagination, loading spinner, error alert boxes, empty search panels, confirm modals, toast popups).
* **`pages/`**: Primary templates loaded by routes (Login, Register, Dashboard, Details, Admin dashboards, 404).
* **`utils/`**: General JavaScript formatting helpers (e.g., price formatting to currency).
* **`constants/`**: Stores hardcoded configurations (e.g. `CATEGORIES` body categories).
* **`styles/`**: Custom styling rules and global typography parameters.

---

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env` file at the frontend root folder (already generated at setup):
```env
VITE_API_URL=http://localhost:8080/api
```

### 2. Install Packages
Run the package installation command inside the `frontend` folder:
```bash
npm install
```

### 3. Run Dev Server
Launch Vite's local hot-reload web server:
```bash
npm run dev
```
The application will start running on port `5173`. Open your web browser and navigate to:
```
http://localhost:5173
```

---

## 🧪 Unit & Integration Testing

The frontend is covered by Vitest unit tests asserting context states, component rendering, routing redirection, and axios mock postings.

### Run Tests
Execute the test runner:
```bash
npm run test
```

### Test Files Implemented
* **`AuthContext.test.jsx`**: Verifies login/logout storage caching and user role checking.
* **`ProtectedRoute.test.jsx`**: Mocks hook values to verify redirects when anonymous.
* **`VehicleCard.test.jsx`**: Asserts details display and checks that the purchase button is disabled when quantity is zero.
* **`authService.test.js`**: Confirms axios mocks return expected credentials payload.
