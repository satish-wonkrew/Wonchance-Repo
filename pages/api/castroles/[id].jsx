// pages/api/companies/[id].js
import dbConnect from '../../../lib/dbConnect';
import Role from '../../../models/Role';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
