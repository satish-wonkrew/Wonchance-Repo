import castConnect from '../../utils/castConnect';
import Casting from '../../models/Casting';

export default async function handler(req, res) {
  await castConnect();

  if (req.method === 'POST') {
    try {
      const { castingTitle, roleTypes, roleTypesId, shootDate, lastDate,castingCreaterId } = req.body;
      const newCasting = new Casting({
        castingTitle,
        roleTypes,
        roleTypesId,
        shootDate,
        lastDate,
        castingCreaterId,
       
      });
      const savedCasting = await newCasting.save();
      res.status(201).json(savedCasting);
    } catch (error) {
      res.status(400).json({ error: 'Error creating casting call' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
