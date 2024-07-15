import castConnect from '../../../utils/castConnect';
import Casting from '../../../models/Casting';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await castConnect();

    const castings = await Casting.findById(id);

    if (!castings) {
      return res.status(404).json({ message: 'Casting not found' });
    }

    res.status(200).json(castings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}


