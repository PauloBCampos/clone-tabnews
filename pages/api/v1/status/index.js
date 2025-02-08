import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const maxConecPtg = await database.query("SHOW max_connections;");
  const maxConecPtgValue = maxConecPtg.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const actConecPtg = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });
  const actConecPtgValue = actConecPtg.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connection: parseInt(maxConecPtgValue),
        curently_connection: actConecPtgValue,
      },
    },
  });
}

export default status;
