const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const fs = require("fs");
const path = require("path");

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config = {};

if (ENV === "production") {
  // Parse the connection URL to get individual components
  const connectionString = process.env.DATABASE_URL;
  const matches = connectionString.match(
    /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
  );

  if (!matches) {
    throw new Error("Invalid DATABASE_URL format");
  }

  const [, user, password, host, port, database] = matches;

  config.user = user;
  config.password = password;
  config.host = host;
  config.port = port;
  config.database = database;
  config.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")).toString(),
  };
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

module.exports = new Pool(config);
