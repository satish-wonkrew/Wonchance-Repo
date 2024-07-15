// pages/api/updateProfileViewers.js
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User'; // Assuming you have a Talent model

export default async (req, res) => {
  await dbConnect();

  const { talentId, viewerId } = req.body;

  try {
    const talent = await User.findById(talentId);
    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' });
    }

    if (!talent.profileViewers.includes(viewerId)) {
      talent.profileViewers.push(viewerId);
      await talent.save();
    }

    res.status(200).json({ message: 'Profile viewers updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};
