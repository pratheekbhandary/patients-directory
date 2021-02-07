import Knex from "knex";
import { get } from "../utils/log";

const logger = get();

export const config = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
};

const instance: Knex = Knex(config);

logger.info(
  `Will connect to postgres://${config.connection.user}@${config.connection.host}/${config.connection.database}`
);
instance
  .raw("select 1")
  .then(() => {
    logger.info(`Connected to database - OK`);
  })
  .catch((err) => {
    logger.error(`Failed to connect to database: ${err}`);
    process.exit(1);
  });

export const db = () => instance;

// Returns a timestamp suitable for inserting into Postgres
export const timestamp = (): string => new Date().toUTCString();
