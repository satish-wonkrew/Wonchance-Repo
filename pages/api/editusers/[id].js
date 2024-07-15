import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User'; // Assuming you have a User model

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req;

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        const { whatsappNumber, statusLevel, firstName, lastName, screenName,heart,bookMark } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { whatsappNumber, statusLevel, firstName, lastName, screenName,heart,bookMark },
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: updatedUser });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: `Method ${method} not allowed` });
      break;
  }
}



