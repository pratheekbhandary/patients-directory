import express, { NextFunction, Request, Response } from "express";
import { configure } from "./utils/log";
import dotenv from "dotenv";
dotenv.config();
const logger = configure();

import { db } from "./db";
import { check, validationResult } from "express-validator";
import fileUpload from "express-fileupload";
import csv from "csv-parser";
import fs from "fs";
import { connectLogger } from "log4js";
import {
  PaginationMiddleware,
  PatientsInterface,
  PaginationMiddlewareRequest,
  PaginationMiddlewareResponse,
  RawPatientsInterface,
  Gender,
  PatientsInsertInterface,
} from "./types";
import Knex from "knex";
import { parseToInterger } from "./utils";

//TODO: remove
import cors from "cors";

const app = express();
const knex = db();

app.use(cors());
app.use(connectLogger(logger, { level: "info" }));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get(
  "/patients",
  check("page").isInt({ min: 0 }).trim().escape().optional(),
  check("limit").isInt({ min: 0 }).trim().escape().optional(),
  check("search").isString().trim().escape().isLength({ min: 3 }).optional(),
  sanatizer,
  paginationMiddleware(knex),
  (_, expRes) => {
    const res = expRes as PaginationMiddlewareResponse;
    res.json({ data: res.paginatedResults });
  }
);

app.get(
  "/patient/:id",
  check("id").isInt({ min: 0 }).trim().escape(),
  sanatizer,
  async (req, res) => {
    try {
      const id = parseToInterger(req.params?.id);
      if (id !== undefined) {
        const patient = await knex<PatientsInterface>("patients")
          .select()
          .where("id", id);
        res.json({ data: patient });
        return;
      }
      return res.status(400).json({ message: "Bad ID" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

app.post("/upload", async (req, res) => {
  //TODO: Try Using Busboy Options @ https://www.npmjs.com/package/express-fileupload
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const fileDetails = req.files.csv as fileUpload.UploadedFile;
  if (!fileDetails) {
    return res.status(400).send("No files were uploaded.");
  }
  logger.info("File uploaded, file mimetype:", fileDetails.mimetype);
  if (fileDetails.mimetype !== "text/csv") {
    return res.status(400).send({ message: "Unsupported file type" });
  }
  //read
  const filePath = fileDetails.tempFilePath;
  const rawPatients: RawPatientsInterface[] = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => rawPatients.push(data))
    .on("end", async () => {
      let patients;
      try {
        //format
        patients = rawPatients.map(
          (rp): PatientsInsertInterface => {
            const {
              first_name,
              last_name,
              address,
              city,
              dob,
              email,
              gender,
              phone_no,
              zipcode,
            } = rp;

            return {
              first_name,
              last_name: last_name !== "" ? last_name : null,
              address,
              city: city !== "" ? city : null,
              dob: new Date(dob),
              email,
              gender: getGenderEnum(gender),
              phone_no: phone_no !== null ? phone_no : null,
              zipcode: zipcode !== "" ? zipcode : null,
            };
          }
        );
      } catch (err) {
        return res.status(500).send({ message: "Could not read file" });
      }

      fs.unlink(filePath, () => {});

      //   save
      const dbres = await knex<PatientsInterface>("patients").insert(patients);
      logger.info("File saved", (dbres as any).rowCount);
      return res.json({
        message: `Uploaded and saved`,
        rowCount: (dbres as any).rowCount,
      });
    });
  return;
});

function paginationMiddleware(knex: Knex): PaginationMiddleware {
  return async (expReq, expRes, next) => {
    // TODO: use Declaration Merging
    // https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
    const req = expReq as PaginationMiddlewareRequest;
    const res = expRes as PaginationMiddlewareResponse;
    const page = parseToInterger(req.query.page) || 1;
    const limit = parseToInterger(req.query.limit) || 10;
    const searchName = req.query.search;

    try {
      res.paginatedResults = {
        results: [],
        totalCount: 0,
      };

      //get total count
      const countQuery = knex<PatientsInterface>("patients").count();
      if (searchName) {
        countQuery
          .where("first_name", "ilike", `%${searchName}%`)
          .orWhere("last_name", "ilike", `%${searchName}%`);
      }
      const totalCount = parseToInterger(
        String((await countQuery)[0]["count"])
      );
      if (!totalCount) {
        next();
        return;
      }

      //some records present
      let start = (page - 1) * limit;
      let end = page * limit;

      if (start > totalCount) {
        res
          .status(404)
          .json({ message: "Incorrect pagination values", totalCount });
      }

      res.paginatedResults.totalCount = totalCount;
      if (end < totalCount) {
        res.paginatedResults.next = {
          limit,
          page: page + 1,
        };
      }
      if (start > 0 && totalCount > (page - 1) * limit) {
        res.paginatedResults.previous = {
          limit,
          page: page - 1,
        };
      }
      const listQuery = knex<PatientsInterface>("patients")
        .select()
        .limit(limit)
        .offset(start);

      if (searchName) {
        listQuery
          .where("first_name", "ilike", `%${searchName}%`)
          .orWhere("last_name", "ilike", `%${searchName}%`);
      }

      res.paginatedResults.results = await listQuery;
      next();
      return;
    } catch (err) {
      res.status(500).json({ message: err.message });
      return;
    }
  };
}

function sanatizer(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: "Bad ID" });
  }
  next();
  return;
}

function getGenderEnum(str: string): Gender {
  switch (str.toLowerCase()) {
    case "female":
      return Gender.female;
    case "male":
      return Gender.male;
    case "notapplicable":
      return Gender.notApplicable;
    default:
      return Gender.notKnown;
  }
}

app.listen(process.env.SERVER_PORT, () => {
  logger.info(`server is on! listening at ${process.env.SERVER_PORT}`);
});
