const express = require('express');

class App {
  constructor() {
    
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.start();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.get('/', (req, res) => {
      res.send('Hello, World!');
    });
  }

  start() {
    this.app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  }
}

new App() ;