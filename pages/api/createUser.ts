// pages/api/createUser.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    const { whatsappNumber } = req.body;

    if (!whatsappNumber) {
      return res.status(400).send({ message: 'whatsappNumber is required' });
    }

    await dbConnect();

    let user = await User.findOne({ whatsappNumber });

    if (!user) {
      user = new User({ whatsappNumber });
      await user.save();
      return res.status(201).send('User created successfully');
    } else {
      return res.status(200).send('User already exists');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}
