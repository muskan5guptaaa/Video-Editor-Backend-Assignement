require('dotenv').config();
const app = require('./app');
const db = require('./models');

const PORT = process.env.DB_PORT || 5000;

db.sequelize.sync().then(() => {
  console.log('Database connected & synced');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
