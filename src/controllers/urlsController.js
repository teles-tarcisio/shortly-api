import { connection } from '../database.js';

export async function createShortURL(req, res) {
  const userId = res.locals.user.id;
  const { url } = req.body;

  try {
    const newRandom = await connection.query(`SELECT MD5(random()::text)`);

    const newUrlPromise = await connection.query(`
      INSERT INTO "createdUrls" ("userId", "url", "shortUrl")
      VALUES ($1, $2, $3);
    `, [userId, url, newRandom.rows[0].md5]);

    return res.status(201).send({ shortUrl: newRandom.rows[0].md5 });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function searchUrlId(req, res) {
  const targetUrlId = req?.params.id;

  try {
    const { rows: foundUrl } = await connection.query(`
      SELECT * FROM "createdUrls" WHERE id=$1
    `, [targetUrlId]);

    if (!foundUrl[0]) {
      return res.sendStatus(404);
    }

    return res.status(200).send({ id: foundUrl[0].id, shortUrl: foundUrl[0].shortUrl, url: foundUrl[0].url });


  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function deleteUrl(req, res) {
  const userId = res.locals.user.id;
  const targetUrlId = req?.params.id;

  try {
    const { rows: foundUrl } = await connection.query(`
      SELECT * FROM "createdUrls" WHERE "id"=$1
    `, [targetUrlId]);
    
    if (!foundUrl[0]) {
      return res.sendStatus(404);
    }

    if (foundUrl[0].userId === userId) {
      await connection.query(`
        DELETE FROM "createdUrls" WHERE "id"=$1
    `, [targetUrlId]);

      return res.status(204).send(foundUrl);
    }

    return res.status(401).send('url nao foi cadastrada por este usuario');

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}