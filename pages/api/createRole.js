import castConnect from '../../utils/castConnect';
import Role from '../../models/Role';

export default async function handler(req, res) {
  await castConnect();

  if (req.method === 'POST') {
    try {
      const {roleName, roleDescription,projectName ,projectNameId , ageMin, ageMax, roleGender, roleSkinType, roleBodyType, noOfOpenings, openingsClosed,roleCreaterId } = req.body;
      const newRole = new Role({
        roleName,
        roleDescription,
        projectName,
        projectNameId,
        ageMin,
        ageMax,
        roleGender,
        roleSkinType,
        roleBodyType,
        noOfOpenings,
        openingsClosed,
        roleCreaterId,
      });
      const savedRole = await newRole.save();
      res.status(201).json(savedRole);
    } catch (error) {
      res.status(400).json({ error: 'Error creating Role' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
