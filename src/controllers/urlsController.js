import { connection } from '../database.js';

export async function createShortURL(req, res) {
  const userId = res.locals.user.id;
  const { url } = req.body;

  try {
    const newRandom = await connection.query(`SELECT MD5(random()::text)`);
    
    const newUrlPromise = await connection.query(`
      INSERT INTO "createdUrls" ("userId", "longUrl", "shortUrl")
      VALUES ($1, $2, $3);
    `, [ userId, url, newRandom.rows[0].md5 ]);
    
    res.status(201).send({ shortUrl: newRandom.rows[0].md5 });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}