import express, { Response } from "express";
import { MongoClient, Db } from "mongodb";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import pino from "pino-http";
import { logger } from "./logger";
import { asyncHeadersScraping, validateUrl, type RExtended } from "./middlewares";
import type { URLScans } from "./mongo-collections";

dotenv.config();

const MONGO_URL = process.env["MONGO_URL"] ?? "mongodb://localhost:27017";
const DB_NAME = process.env["DB_NAME"] ?? "challenge";

async function main() {
  try {
    logger.info(`Running as app`);

    mongoose.connect(MONGO_URL);
    mongoose.connection.on("connected", () => {
      logger.info("Connected to mongodb");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(err, "Mongodb connection error");
      process.exit(1);
    });

    const mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    const db: Db = mongoClient.db(DB_NAME);
    const scansCollection = db.collection<URLScans>("scans");

    const app = express();

    app.use(
      express.json({
        limit: "1mb",
      })
    );

    app.use(express.urlencoded({ limit: "1mb", extended: false }));

    app.use(
      pino({
        logger,
      })
    );

    app.get("/health", (_req, res) => {
      res.status(200).json({ healthy: true });
    });

    app.post("/scan", [validateUrl, asyncHeadersScraping], async (req: RExtended, res: Response) => {
      let securityHeaders = req.secureHeaders ?? {};
      let { url } = req.body;
      const insertData: URLScans = { ...securityHeaders, createdAT: new Date(), url };
      const savedData = await scansCollection.insertOne(insertData);
      console.log({ savedData });
      if (savedData.acknowledged) {
        res.status(200).json({ ok: true, statusCode: 200, data: securityHeaders || null });
      } else {
        throw new Error("Error saving scan data");
      }
    });

    app.listen(process.env["PORT"], () => {
      logger.info(`Backend server listening on port ${process.env["PORT"]}`);
    });
  } catch (err) {
    logger.error(err, "Failed to start app");
  }
}

main();
