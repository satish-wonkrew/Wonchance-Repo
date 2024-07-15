import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';


export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const { 
          whatsappNumber,
          email,
          firstName,
          lastName,
          gender,
          dateOfBirth,
          age,
          profile,
          speakingLanguages,
          profilePictureUrl,
          gallery,
          videoGallery,

         } = req.body;

        const errors = {};

        // Check if whatsappNumber already exists
        const existingWhatsappNumber = await User.findOne({ whatsappNumber });
        if (existingWhatsappNumber) {
          errors.phoneNumber = 'WhatsApp number already exists';
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          errors.email = 'Email already exists';
        }

        // If there are any errors, return them
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ success: false, errors });
        }

        // Create user
        const user = await User.create({ 
          whatsappNumber,
          email,
          firstName,
          lastName,
          gender,
          dateOfBirth,
          age,
          profile,
          speakingLanguages,
          profilePictureUrl,
          gallery,
          videoGallery,
         });
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

