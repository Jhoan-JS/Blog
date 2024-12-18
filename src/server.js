require('dotenv').config({ path: `${__dirname}/../.env` });

require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 4000;
console.log(PORT);
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('ERROR: ', err.name, err.message);
  console.log('unhandled Rejection Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('ERROR: ', err.name, err.message);
  console.log('uncaught   Exception Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
