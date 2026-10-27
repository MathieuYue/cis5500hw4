const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { eq, desc, sum } = require('drizzle-orm');
const config = require('./config.json');
const { albums, songs } = require('./schema');

// Same database connection as routes.js, wrapped by Drizzle (https://orm.drizzle.team).
// An ORM (Object-Relational Mapper) lets you build queries with JavaScript functions instead of SQL strings.
// The logger prints every SQL query Drizzle generates to the server terminal, which you will need for TASK 29.
// Do not edit.
const pool = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle({
  client: pool,
  logger: {
    logQuery: (query, params) => console.log('[drizzle]', query, params),
  },
});

/**************
 * ORM ROUTES *
 **************/

// Route 11: GET /orm/top_albums
const orm_top_albums = async function(req, res) {
  const page = req.query.page;
  const pageSize = Number(req.query.page_size ?? 10);

  // TODO (TASK 28): re-implement Route 8 (GET /top_albums), including optional pagination, using Drizzle
  // The response must be identical to Route 8.
  // Here is a complete example of a Drizzle query, for the song with a given song_id:
  //   const rows = await db.select().from(songs).where(eq(songs.song_id, req.params.song_id));
  // Like connection.query, db queries return a Promise, so use await inside try/catch.
  // The tables available to you are defined in schema.js.
  // Hints:
  //  - pass an object to db.select({ ... }) to choose (and name) the columns you return
  //  - see .innerJoin(), .groupBy(), .orderBy(), .limit() and .offset() in https://orm.drizzle.team/docs/select
  //  - sum() and desc() have already been imported for you
  //  - check the type of plays in your response! (hint: look up .mapWith() in the Drizzle docs)

  try {
    const totalPlays = sum(songs.plays).mapWith(Number);

    query = db.select({album_id: albums.album_id, title: albums.title, plays: totalPlays})
    .from(albums)
    .innerJoin(songs, eq(albums.album_id, songs.album_id))
    .groupBy(albums.album_id)
    .orderBy(desc(totalPlays));

    rows = !page ? await query : await query.limit(pageSize).offset((Number(page)-1) * pageSize);
    res.json(rows)
  } catch (err) {
    console.log(err)
    res.json([]);
  }
}

/**
 * TODO (TASK 29, written): Start the server and visit /orm/top_albums?page=2.
 * The SQL Drizzle generates for the request is printed in the server terminal. Compare it to your SQL query
 * for Route 8 and answer the following questions in your submission:
 * 1. Which values does Drizzle send as parameters ($1, $2) in the generated SQL? Does your Route 8 query
 *    parameterize the same values, and why does parameterizing them matter?
 * 2. Why is .mapWith(Number) (or something equivalent) needed for plays in Route 11?
 * 3. Name one other difference between the generated SQL and your own query.
 */

module.exports = {
  orm_top_albums,
}
