import express, { Router } from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import cors from 'cors';

import { logger } from "./logging/logger";
import { setAuthRoutes } from "./routers/authRouter";
import passport from "passport";
import { setPatientRoutes } from "./routers/patientRouter";
require("./auth/setup")(passport);


const port = process.env.PORT ?? 5001
const app = express()

// Not the best secret management but I lack the time for it :)
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.qptih.mongodb.net/blueCallDb?retryWrites=true&w=majority";
mongoose.connect(uri);
mongoose.connection.on('connected', () => {
  logger.info("connected to mongodb");
});
mongoose.connection.on('error', () => {
  logger.error("Cannot connect to mongodb");
})

app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());

const authRouter = Router();
setAuthRoutes(authRouter);
app.use('/auth', authRouter);

const patientRouter = Router();
setPatientRoutes(patientRouter);
app.use('/patient', patientRouter);

app.listen(port, () => console.log(
  `Example app listening on port ${port}!`
));
