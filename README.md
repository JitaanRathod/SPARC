# SPARC 

Welcome to **SPARC**! This project is a full-stack web application built to make complex pathfinding algorithms easy to understand and use. 

Ever wonder how GPS apps find the shortest route between two cities, or how data travels across the internet? They use pathfinding algorithms! SPARC brings three of the most famous routing algorithms to life by connecting a heavy-duty Java backend with a smooth, interactive web interface.

##  What Does It Do?

SPARC acts as a bridge between complex math and a simple user experience. The project is split into three main parts:
* **The Interface (`sparc-frontend`):** A clean web page where you can interact with the app.
* **The Middleman (`sparc-backend`):** A server that takes your web requests and passes them to the algorithms.
* **The Brains (Java Core):** The heavy lifters that actually calculate the shortest paths.

### The Algorithms Under the Hood:
1. **Dijkstra's Algorithm:** The classic, lightning-fast method for finding the shortest path when all route costs are positive.
2. **Bellman-Ford Algorithm:** A slightly slower but smarter method that can handle tricky networks where some paths might have negative weights (costs).
3. **Floyd-Warshall Algorithm:** The "big picture" method that calculates the shortest distance between *every single pair* of points on the map all at once.

##  Tech Stack

* **Frontend:** JavaScript, HTML, CSS
* **Backend:** JavaScript (Node.js)
* **Core Logic:** Java

## Project Structure

```text
SPARC/
├── sparc-frontend/       # The web user interface (HTML/CSS/JS)
├── sparc-backend/        # The server that handles communication
├── BellmanFord.java      # Logic for Bellman-Ford algorithm
├── Dijkstra.java         # Logic for Dijkstra's algorithm
├── FloydWarshall.java    # Logic for Floyd-Warshall algorithm
├── Main.java             # The main Java execution file
└── README.md             # The documentation file you are reading right now!
````

##  How to Run It (Getting Started)

### What You'll Need

Make sure you have the following installed on your computer:

  * **Java Development Kit (JDK):** To run the algorithm files.
  * **Node.js & npm:** To run the backend and frontend servers.

### Steps to Run

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/JitaanRathod/SPARC.git](https://github.com/JitaanRathod/SPARC.git)
    cd SPARC
    ```

2.  **Compile the Java Core:**

    ```bash
    javac Main.java Dijkstra.java BellmanFord.java FloydWarshall.java
    ```

3.  **Start the Backend:**
    Open a new terminal, navigate to the backend folder, install dependencies, and start the server:

    ```bash
    cd sparc-backend
    npm install
    npm start
    ```

4.  **Start the Frontend:**
    Open another terminal, navigate to the frontend folder, and launch the web app:

    ```bash
    cd sparc-frontend
    npm install
    npm start
    ```


