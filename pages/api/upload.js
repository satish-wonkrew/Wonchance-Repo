
// pages/api/upload.js
import multer from 'multer';

const upload = multer({ dest: 'public/uploads/' }); // Configure multer with the destination directory

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing because multer will handle the data
  },
};

// Named function for clarity and maintainability
async function handleUpload(req, res) {
  if (req.method === 'POST') {
    try {
      const multerSingle = upload.single('file');
      multerSingle(req, res, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (req.file) {
          const fileUrl = `/uploads/${req.file.filename}`;
          res.status(200).json({ url: fileUrl });
        } else {
          res.status(400).json({ error: 'No file uploaded.' });
        }
      });
    } catch (error) {
      console.error('Error handling upload:', error);
      res.status(500).json({ error: 'An unexpected error occurred.' }); // More generic error message for security
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handleUpload;

