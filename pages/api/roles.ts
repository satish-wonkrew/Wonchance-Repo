import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import Role from "../../models/Role";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(503).json({ error: { message: 'Error fetching roles', code: 503 } });
  }
}