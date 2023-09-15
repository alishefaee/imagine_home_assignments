import httpContext from "express-http-context";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import { logger } from "../utils/logger.util";
import router from "../routes";
import path from "path";
import { Code } from "../utils/consts.utils";
import { response, setCodeResponse } from "../utils/functions";
import mongoose from "mongoose"

const app = express();

console.log(process.env.MONGODB_URL)


mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URL!)
  .then((conn) => {
    logger.info('DB Connected:' + conn.connection.host)
  })
  .catch((err) => {
    logger.error('DB is not connected: ')
    throw new Error(err)
  })

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.use(compression());

// Use any third party middleware that does not need access to the context here, e.g.
app.use(httpContext.middleware);
// all code from here on has access to the same context for each request

app.use("/v1", router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  setCodeResponse(Code.SERVER_ERROR,true)
  logger.error({ message: err.message || err, meta: err.stack });
  return response(res, {});
});

export { app }