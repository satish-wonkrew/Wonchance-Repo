import dbConnect from '../../../lib/dbConnect';
import Casting from '../../../models/Casting'; // Assuming you have a Casting model

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req;

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        const { appliedTalentsId } = req.body;
        const updatedCasting = await Casting.findByIdAndUpdate(
          id,
          { appliedTalentsId },
          { new: true, runValidators: true }
        );
        if (!updatedCasting) {
          return res.status(404).json({ success: false, message: 'Casting not found' });
        }
        res.status(200).json({ success: true, data: updatedCasting });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: `Method ${method} not allowed` });
      break;
  }
}



