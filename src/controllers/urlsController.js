import { connection } from '../database.js';

export async function createShortURL(req, res) {
  const url = req.body;

  console.log('reached createURL: ', url);

  res.sendStatus(501);  
}