# 🚀 Full-Stack Task Management Application
**Comprehensive Project Documentation & Technical Guide**

---

## 📖 1. Project Overview
This project is a modern, high-performance, full-stack task management web application inspired by the minimalist design of Notion. It is designed to help users track their daily productivity securely and efficiently.

**Key Features:**
* 🔐 **Secure User Authentication:** Users can sign up, log in, and manage their profiles securely using Firebase Authentication.
* 📝 **Advanced Task Management:** Create, read, update, and delete (CRUD) tasks instantly.
* 📅 **Metadata Tracking:** Tasks support priority levels (High, Medium, Low) and specific Due Dates.
* 🎨 **Notion-Style Aesthetics:** A meticulously crafted, minimalist user interface built with custom CSS, featuring inline editing capabilities.
* 🌗 **Dynamic Theming:** Seamless transition between Light and Dark modes, with preferences saved locally.
* 🔍 **Real-time Filtering:** Users can filter their dashboard view by "All", "Pending", or "Completed" tasks.

---

## 💻 2. Technology Stack & Rationale
The application leverages a robust tech stack chosen for scalability, security, and developer experience.

### Frontend (Client-Side)
* **React.js (Vite):** Chosen for its component-based architecture, allowing for reusable UI elements. Vite is used as the build tool for blazing-fast hot-module replacement during development.
* **React Router DOM:** Manages navigation without reloading the page, creating a smooth Single Page Application (SPA) experience.
* **Firebase Auth:** Outsourcing authentication to Firebase ensures enterprise-grade security for user passwords and sessions.
* **Vanilla CSS & React Bootstrap:** A blend of Bootstrap for rapid form styling and raw CSS for creating the bespoke, Notion-like dashboard.

### Backend (Server-Side)
* **Node.js & Express.js:** A lightweight, non-blocking JavaScript runtime perfect for building fast REST APIs.
* **MySQL (XAMPP):** A highly reliable relational database. Chosen over NoSQL (like MongoDB) because tasks have a highly structured, predictable schema.
* **CORS & Dotenv:** Middleware for handling cross-origin security and managing sensitive environment variables.

---

## 🏗️ 3. System Architecture & Data Flow
The system operates on a decoupled **Client-Server Architecture**.

1. **User Interaction:** The user interacts with the React frontend on `http://localhost:5173`.
2. **HTTP Request:** When the user performs an action (e.g., clicking "Add Task"), React packages the data into a JSON payload and sends an asynchronous `fetch()` POST request to the backend.
3. **API Processing:** The Express.js backend listens on `http://localhost:5000`. It receives the request, parses the JSON, and prepares an SQL query.
4. **Database Execution:** The backend executes the query against the MySQL database running on port `3307`.
5. **Response:** The database confirms the insertion. The backend sends an HTTP `200 OK` or `201 Created` status back to the frontend.
6. **UI Update:** React detects the successful response and updates the DOM, rendering the new task instantly without a page refresh.

---

## ⚛️ 4. In-Depth Frontend Breakdown (React)

### `App.jsx` (The Router)
This is the root of the application. It acts as the traffic controller. It wraps the app in an `<AuthProvider>` to provide global state. It uses a `<PrivateRoute>` wrapper to protect routes like `/` (Dashboard)—if a user isn't logged in, they are immediately redirected to `/login`.

### `AuthContext.jsx` (Global State)
Uses React's `useContext` API. Instead of passing user data down through 10 different components ("prop drilling"), the Context API creates a global "bubble" of data. Any component can tap into this bubble to check `currentUser.email` or call the `logout()` function.

### `Dashboard.jsx` (The Orchestrator)
The heaviest component in the app. 
* **State:** It maintains the `tasks` array, `activeFilter`, and `darkMode` state.
* **Effect Hook:** Uses `useEffect` to trigger a `fetchTasks()` function the moment the component loads.
* **Prop Passing:** It renders `<Sidebar />`, `<TaskForm />`, and multiple `<TaskItem />` components, passing down both data (props) and functions (callbacks) so the child components can trigger updates.

### `TaskItem.jsx` (The Interactive Component)
A complex component utilizing conditional rendering. 
* It holds local state `isEditing`. 
* If `isEditing` is false, it renders normal text, priority badges, and a calendar icon.
* If `isEditing` is true, it swaps the text for `<input>` and `<select>` fields, allowing the user to make changes and hit "Save", triggering the `onSave` prop passed down from the Dashboard.

---

## ⚙️ 5. In-Depth Backend Breakdown (Node.js)

### `server.js` (The REST API)
The backbone of the application. 

* **Security Middleware:** `app.use(cors())` is crucial. Browsers block cross-origin requests by default. This tells the browser that requests from the React frontend are safe to process.
* **Auto-Migrations:** On startup, the server runs a `CREATE TABLE IF NOT EXISTS` query. It also runs `ALTER TABLE` queries for `due_date` and `priority`. This guarantees the database schema is always correct, even if deployed on a brand new machine.
* **Parameterized Queries:** When inserting data, the backend uses `db.query(sql, [title, description])` instead of injecting strings directly. This strictly prevents **SQL Injection** attacks.

### API Routes
* `GET /tasks/:email` -> Uses `SELECT * FROM tasks WHERE user_email = ?`
* `POST /add-task` -> Uses `INSERT INTO tasks (title, description...) VALUES (?, ?...)`
* `PUT /edit-task/:id` -> Updates specific fields for a specific task ID.
* `PUT /toggle-task/:id` -> Uses a clever SQL `CASE` statement to flip the status between 'pending' and 'completed'.
* `DELETE /delete-task/:id` -> Removes a row permanently.

---

## 🗄️ 6. Database Schema (MySQL)

| Column Name | Data Type | Constraint | Description |
|-------------|-----------|------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the database. |
| `title` | VARCHAR(255)| NOT NULL | The task heading. |
| `description`| TEXT | | Extended task details. |
| `user_email`| VARCHAR(255)| NOT NULL | Links the task to the specific Firebase user. |
| `status` | VARCHAR(50) | DEFAULT 'pending' | Current state of the task. |
| `due_date` | DATE | DEFAULT NULL | Target deadline. |
| `priority` | VARCHAR(20) | DEFAULT 'none' | Importance (high, medium, low). |
| `created_at`| TIMESTAMP | DEFAULT CURRENT_TIMESTAMP| Exact time of creation. |

---
---

# 🎁 BONUS: Interview / Viva Q&A
*If you are presenting this project to an interviewer, professor, or technical lead, they will likely ask these questions to test your understanding of the code.*

### Q1: Why did you use React Context (`AuthContext.jsx`) instead of Redux?
**Answer:** "Redux is a powerful state management tool, but it requires a lot of boilerplate code. For this project, the only truly global state I needed to manage was the user's authentication status and Firebase functions. React's built-in Context API is lightweight, native, and perfectly suited for passing the `currentUser` data across the app without prop-drilling."

### Q2: What is CORS and why did you need it in `server.js`?
**Answer:** "CORS stands for Cross-Origin Resource Sharing. Browsers have a strict security policy that prevents a website on one port (like my React app on port 5173) from requesting data from a server on a different port (like my Node app on port 5000). I added the `cors` middleware to my Express server to explicitly tell the browser that the frontend is authorized to make requests to it."

### Q3: How do you protect against SQL Injection in your backend?
**Answer:** "Instead of directly pasting user inputs into my SQL strings, I use parameterized queries (prepared statements). When I write `db.query('INSERT INTO tasks (title) VALUES (?)', [title])`, the `mysql` library automatically escapes the input. This ensures that if a malicious user types SQL commands into the task title, it is treated strictly as plain text, not executable code."

### Q4: Why are you using Firebase for authentication instead of building your own with MySQL?
**Answer:** "Building a custom authentication system requires securely hashing passwords (with tools like bcrypt), managing session tokens (JWTs), and handling password resets. Firebase provides an enterprise-grade, highly secure authentication layer out of the box, allowing me to focus my development time on the core business logic of the task manager."

### Q5: Explain the `useEffect` hook in your `Dashboard.jsx`.
**Answer:** "The `useEffect` hook tells React to do something *after* the component renders. In my Dashboard, I use it to call `fetchTasks()`. I pass `[currentUser]` into the dependency array at the end of the hook. This means: 'Run this fetch function exactly once when the page loads, and run it again ONLY if the logged-in user changes.'"

### Q6: How does the "Dark Mode" toggle work?
**Answer:** "The dark mode state is stored in a React `useState` boolean. I define two JavaScript objects (`LIGHT` and `DARK`) that contain color codes. Based on the boolean, I pass the chosen color object (which I call `t` for theme) down to all my components as a prop. To ensure the user's preference is remembered, I also use a `useEffect` hook to save the boolean to the browser's `localStorage`."

### Q7: If I type a new task title and hit submit, exactly what happens step-by-step?
**Answer:** 
1. The `onSubmit` event triggers `handleSubmit` in `TaskForm.jsx`.
2. It prevents the default page reload using `e.preventDefault()`.
3. It passes the title and description up to `Dashboard.jsx` using the `onAdd` prop.
4. `Dashboard.jsx` converts the data to JSON and uses `fetch()` to make a POST request to the backend.
5. `server.js` receives the JSON, connects to MySQL, and inserts the row.
6. `server.js` sends back a `200 OK` response.
7. `Dashboard.jsx` sees the success response and triggers `fetchTasks()` again to pull the fresh list of tasks from the database and update the screen.

### Q8: What does `express.json()` do in your server file?
**Answer:** "It is a built-in middleware function in Express. When React sends data to the server, it sends it as a raw JSON string. `express.json()` automatically intercepts the incoming request, parses that JSON string, and converts it into a usable JavaScript object attached to `req.body` so I can easily extract my task variables."
