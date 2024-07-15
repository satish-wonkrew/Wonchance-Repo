// pages/api/register.js
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { whatsappNumber, otp } = req.body;
        await dbConnect();

        try {
            let user = await User.findOne({ whatsappNumber });
            if (user) {
                console.log('User already exists, updating OTP:', otp);
                user.otp = otp; // Assuming you update OTP here
                await user.save();
            } else {
                console.log('Creating new user with provided WhatsApp Number and OTP');
                user = new User({ whatsappNumber, otp });
                await user.save();
            }
            res.status(200).json({ message: 'User registered/updated successfully' });
        } catch (error) {
            console.error('Error in user registration:', error);
            res.status(500).json({ message: 'Failed to register user' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
