import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import Project from "../../models/Project";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connect();
    const projects = await Project.find();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(503).json({ error: { message: 'Error fetching projects', code: 503 } });
  }
}