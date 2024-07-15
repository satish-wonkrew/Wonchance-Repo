import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import Company from "../../models/Company";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (error) {
    return res.status(503).json({ error: { message: 'Error fetching companies', code: 503 } });
  }
}