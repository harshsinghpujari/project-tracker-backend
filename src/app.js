import sequelize from "./config/dbConnection.js";

try {
  await sequelize.authenticate();
    console.log('Database connected succesfully');
} catch (error) {
    console.error('Database connection failed:', error);
}

