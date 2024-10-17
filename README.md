# **Project : Rule Engine**

A simple rule engine that utilizes an Abstract Syntax Tree (AST) to evaluate conditional rules for determining user eligibility based on attributes like age, department, income, and spend.

## Technologies Used
    Frontend: HTML, CSS, JavaScript
    Backend: Node.js, Express
    AST Parsing: jsep library
    Database: MongoDB (for storing and managing rules)

## Setup Instructions
    Prerequisites
    Ensure you have the following installed:

    Node.js (v14.x or above)
    MongoDB (v4.x or above)


## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/rule-engine.git
    cd rule-engine
    ```

2. **Navigate to the project directory:**
   ```bash
   cd zeotap
   ```

3. **Install the dependencies for the server:**
   ```bash
   cd backend 
   npm install
   ```

4. **Set Up Environment Variables in server:** 

    Create a .env file in the backend directory and add the following variables:
    ```bash
    MONGO_URI= your_mongodb_uri
    ```

5. **To run the application in the backend directory, use the following command:**
   ```bash
   nodemon app.js
   ```

# Usage
    1. Open your web browser and navigate to http://localhost:3000.
    2. Enter your rules in the provided input field.
    3. Click on "Generate AST" to view the AST representation of the rule.
    4. Add multiple rules, and click "Combine Rules" to view the combined rule.
    5. Use the "View AST" button to visualize the AST for each rule.
        After combining rules, the application will evaluate user eligibility based on the combined AST against  the input user data .
