import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const maxConecPtg = await database.query("SHOW max_connections;");
  const maxConecPtgValue = maxConecPtg.rows[0].max_connections;

  const actConecPtg = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'salame_db';",
  );
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
