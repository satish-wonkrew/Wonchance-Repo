import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import Casting from "../../models/Casting";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const castings = await Casting.find();
    return res.status(200).json(castings);
  } catch (error) {
    return res.status(503).json({ error: { message: 'Error fetching casting', code: 503 } });
  }
}