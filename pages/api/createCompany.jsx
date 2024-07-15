import castConnect from '../../utils/castConnect';
import Company from '../../models/Company';

export default async function handler(req, res) {
  await castConnect();

  if (req.method === 'POST') {
    try {
      const {companyName, companyImage, companyType, categories, ownerFirstName, ownerLastName,
         ownerPhoneNumber,ownerEmailId ,selectCompanyUser ,
         selectCompanyUserID,
        createrId, } = req.body;
      const newCompany = new Company({
         companyName,
         companyImage,
         companyType,
         categories,
         ownerFirstName,
         ownerLastName,
         ownerPhoneNumber,
         ownerEmailId,
         selectCompanyUser,
         selectCompanyUserID,
         createrId,
      });
      const savedCompany = await newCompany.save();
      res.status(201).json(savedCompany);
    } catch (error) {
      res.status(400).json({ error: 'Error creating Company' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
