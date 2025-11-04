import app from "./app.js";
import { sequelize } from "./models/index.js";

const startServer = async() => {
  try {
  await sequelize.authenticate();
  console.log('Database connected succesfully');
  await sequelize.sync()
  console.log('Tables synced with database');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
} catch (error) {
    console.error('Database connection failed:', error);
}
};

startServer();