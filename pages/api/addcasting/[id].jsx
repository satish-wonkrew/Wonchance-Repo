import dbConnect from '../../../lib/dbConnect';
import Casting from '../../../models/Casting';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        const { appliedTalentsId } = req.body;
        if (!Array.isArray(appliedTalentsId)) {
          return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        const casting = await Casting.findById(id);

        if (!casting) {
          return res.status(404).json({ success: false, message: 'Casting not found' });
        }

        // Update the appliedTalentsId array
        casting.appliedTalentsId = [...new Set([...casting.appliedTalentsId, ...appliedTalentsId])];

        await casting.save();

        res.status(200).json({ success: true, data: casting });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Method not supported' });
      break;
  }
}
