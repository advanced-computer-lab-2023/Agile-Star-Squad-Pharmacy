const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB =
  'mongodb+srv://ahmedlasheen2412:Newlife2023@cluster0.lq7synw.mongodb.net/';
mongoose.connect(DB).then(() => console.log('DB connected successfully!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
