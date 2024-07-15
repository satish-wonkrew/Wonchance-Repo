// pages/api/checkUser.ts
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { whatsappNumber } = req.query;

  await dbConnect();

  let user = await User.findOne({ whatsappNumber });

  if (user) {
    res.status(200).json('User exists');
  } else {
    res.status(200).json('User does not exist');
  }
}