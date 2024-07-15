
// pages/api/upload.js
import multer from 'multer';

const upload = multer({ dest: 'public/uploads/' }); // Configure multer with the destination directory

export const config = {
    api: {
        bodyParser: false, // Disabling body parsing because multer will handle the data
    },
};

export default async (req, res) => {
    if (req.method === 'POST') {
        const multerSingle = upload.single('file');
        multerSingle(req, res, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (req.file) {
              const fileUrl = `/uploads/${req.file.filename}`;  // This is the URL accessible from the browser
              res.status(200).json({ url: fileUrl });
            } else {
              res.status(400).json({ error: 'No file uploaded.' });
            }
            // File is available at req.file
            // Do whatever you want with the uploaded file information
            res.status(200).json({
                message: 'File uploaded successfully',
                file: req.file,
            });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
