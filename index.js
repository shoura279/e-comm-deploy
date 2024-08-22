// import modules
import express from "express";
import { connectDB } from "./db/connection.js";
import dotenv from 'dotenv'
import path from 'path'
import { webhook } from "./src/utils/webhook.js";
import { bootStrap } from "./src/initApp.js";
// create server
dotenv.config({ path: path.resolve('./config/.env') })
const app = express();
const port = process.env.PORT || 3000;
// connect to db
connectDB();
// parse req
bootStrap(app, express)
app.post('/webhook',
  express.raw({ type: 'application/json' }),
  webhook
);
// listen server
app.listen(port, () => {
  console.log("server is running on port", port);
});
