# How to Run the SPARC Application

Welcome to the SPARC (Shortest Path Algorithm Research & Comparison) project!

This application requires two things terminal windows to run:
1. The **Java Server** (handles the pathfinding logic)
2. The **React UI** (handles the visual website)

---

## Requirements to Run
Before starting, ensure this computer has:
- **Java 17+** (Type `java -version` in terminal to check)
- **Node.js** (Type `node -v` in terminal to check)

---

## 🟢 Step 1: Start the Java Backend
Open a terminal (Command Prompt, PowerShell, or Mac/Linux Terminal) and follow these exact commands to boot up the Java server:

1. Navigate perfectly into the `backend` folder:
   ```bash
   cd SPARC/backend
   ```
2. Compile and run the pure Java server:
   ```bash
   javac *.java
   java Main
   ```
*(You will see a message saying "Native Java HTTP Backend Running on port 8080..." This terminal must stay open!)*

---

## 🔵 Step 2: Start the Web Frontend
Open a **second, completely new terminal window** and run these commands to start the React website:

1. Navigate into the frontend folder:
   ```bash
   cd SPARC/sparc-frontend
   ```
2. Install all the necessary website packages (you only ever have to do this once):
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```

---

## 🎉 Step 3: Open the App!
Both of your servers are now running.
Simply open your favorite web browser (Chrome, Edge, Safari) and go to:
**http://localhost:3000**
