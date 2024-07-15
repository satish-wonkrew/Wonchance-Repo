// pages/api/companies/[id].js
import dbConnect from '../../../lib/dbConnect';
import Company from '../../../models/Company';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
