# Task Board Application

This is a responsive, single-page task management application built with React, TypeScript, and Vite. It provides a complete solution for managing projects through boards, columns, and tasks, with all data persisted in the browser's local storage.


# Task Board Application

**[Live Demo](https://task-board-application-eight.vercel.app/)**

---

This is a responsive, single-page task management application...
---

## Key Features for Evaluation

To help with the evaluation of this project, here are the core functionalities to test:

* **Full CRUD Operations**: The application supports creating, reading, updating, and deleting boards, columns, and tasks.
* **Drag & Drop**: Tasks can be seamlessly reordered within the same column or moved to different columns.
* **State Management**: A centralized React Context (`BoardContext`) manages the application's entire state.
* **Data Persistence**: All data is saved to `localStorage`, ensuring that your work is not lost between browser sessions.
* **Dynamic Filtering & Sorting**: Tasks within a board can be filtered by a search query, priority, or due date, and sorted by priority or due date.
* **Component-Based Architecture**: The codebase is organized into logical, reusable components for maintainability.

---

##  How to Run the Application Locally

Follow these instructions to get the project set up and running on your local machine for development and testing.

### **Step 1: Prerequisites**

Ensure you have the following installed on your system:
* **Node.js** (v16.x or higher)
* **npm** (Node Package Manager)

### **Step 2: Clone the Repository**

Open your terminal or command prompt and clone the project repository to your local machine.

```sh
git clone [https://github.com/your-username/your-project-repo.git](https://github.com/your-username/your-project-repo.git)
```

### **Step 3: Navigate to the Project Directory**

Change your current directory to the newly cloned project folder.

```sh
cd your-project-repo
```

### **Step 4: Install Dependencies**

Install all the necessary project dependencies defined in `package.json`.

```sh
npm install
```

### **Step 5: Start the Development Server**

Run the following command to start the Vite development server.

```sh
npm run dev
```

The application should now be running. Your terminal will display the local URL, which is typically **`http://localhost:5173`**. Open this URL in your web browser to view the application.

---

##  Available Scripts

This project comes with the following scripts pre-configured:

* **`npm run dev`**: Starts the development server with Hot Module Replacement (HMR) enabled.
* **`npm run build`**: Compiles and bundles the application for production into the `dist/` directory.
* **`npm run preview`**: Serves the production build locally to test it before deployment.

---

##  Tech Stack

* **Framework**: React 18
* **Language**: TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS
* **Routing**: React Router v6
* **Drag & Drop**: @hello-pangea/dnd
* **Icons**: Lucide React
* **Unique IDs**: UUID
