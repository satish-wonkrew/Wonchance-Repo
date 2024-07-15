// pages/api/checkEmail.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/dbConnect'; // Adjust the path as per your project structure
import User from '../../models/User'; // Adjust the path as per your project structure

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      await connectDB();
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      return res.status(200).json({ message: 'Email available' });
    } catch (error) {
      console.error('Error checking email:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
};

export default handler;
