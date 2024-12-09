// Create an upload route (handles single file upload)
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dc3ipkvle',   // Replace with your Cloudinary cloud name
  api_key: '911773911253873',        // Replace with your Cloudinary API key
  api_secret: '2i0REC71Bo9mcPjUqFBHSpeNjwo'   // Replace with your Cloudinary API secret
});

// module.exports = cloudinary;
export const fileUpload = async (req:any, res:any) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }
 
      // Path to the uploaded file on the server
      const filePath = req.file.path;
      console.log('filePath', filePath)
  
    //   // Upload file to Cloudinary
      cloudinary.uploader.upload(filePath, (error:any, result:any) => {
        if (error) {
          return res.status(500).send({ message: 'Error uploading file to Cloudinary', error });
        }
  
        // If successful, send back the Cloudinary URL
        res.status(200).send({
          message: 'File uploaded successfully to Cloudinary',
        //   cloudinaryUrl: result.secure_url, // The URL to access the file
        });
  
        // Optionally, delete the local file after uploading to Cloudinary
        fs.unlink(filePath, (err:any) => {
          if (err) console.log('Error deleting file:', err);
          else console.log('Local file deleted');
        });
      });
    } catch (err:any) {
      console.error(err);
      res.status(500).send({ message: 'Error uploading file', error: err.message });
    }
  };
  
  // Ensure the "uploads" directory exists
//   if (!fs.existsSync('./uploads')) {
//     fs.mkdirSync('./uploads');
//   }
  
  