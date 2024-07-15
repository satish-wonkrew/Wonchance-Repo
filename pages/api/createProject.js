import castConnect from '../../utils/castConnect';
import Project from '../../models/Project';

export default async function handler(req, res) {
  await castConnect();

  if (req.method === 'POST') {
    try {
      const { projectName, projectImage, companyType, companyTypeId, description, category, genre, startDate, endDate, selectUser , selectUserID ,projectCreaterId } = req.body;
      const newProject = new Project({
        projectName,
        projectImage,
        companyType,
        companyTypeId,
        description,
        category,
        genre,
        startDate,
        endDate,
        selectUser,
        selectUserID,
        projectCreaterId,
      });
      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      res.status(400).json({ error: 'Error creating Project' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
