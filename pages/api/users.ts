import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import User from "../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(503).json({ error: { message: 'Error fetching users', code: 503 } });
  }
}