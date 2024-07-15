import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await dbConnect();

    const talent = await User.findById(id);

    if (!talent) {
      return res.status(404).json({ message: 'Talent not found' });
    }

    res.status(200).json(talent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}


