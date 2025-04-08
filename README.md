# Climbers Backend

## Description
Climbers Backend is the server-side application for managing climbing-related data and services. It provides APIs to support the frontend application and handles data storage, authentication, and business logic.

## Features
- User authentication and authorization
- CRUD operations for climbing routes
- Data storage and retrieval
- API documentation with OpenAPI/Swagger
- Role-based access control
- Logging and error handling
- Scalable architecture for future enhancements

## Installation
1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/climbers-backend.git
  ```
2. Navigate to the project directory:
  ```bash
  cd climbers-backend
  ```
3. Install dependencies:
  ```bash
  npm install
  ```

## Usage
1. Start the development server:
  ```bash
  npm run dev
  ```
2. Access the API at `http://localhost:3000`.

## Configuration
1. Create a `.env` file in the root directory and configure the following environment variables:
   ```env
   PORT=3000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

2. Replace `your_database_url` and `your_jwt_secret` with appropriate values.

## Testing
Run the test suite:
```bash
npm test
```

## API Documentation
The API documentation is available at `http://localhost:3000/api-docs` when the server is running. It is generated using OpenAPI/Swagger.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request. Make sure to follow the contribution guidelines in the `CONTRIBUTING.md` file.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements
- Thanks to the open-source community for providing tools and libraries used in this project.
- Special thanks to contributors who help improve this project.