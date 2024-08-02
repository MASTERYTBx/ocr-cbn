const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const API_KEY = '558C5743-AEAF-4CE1-9880-6C9BB2471A7B';  // Replace with your actual API key

app.use(bodyParser.json());

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, 'image.png');
    form.append('apikey', API_KEY);

    const response = await axios.post('https://api.onlineocr.net/api/ocr', form, {
      headers: form.getHeaders(),
    });

    const extractedText = response.data.ParsedResults[0]?.ParsedText || 'No text found';
    res.status(200).send(extractedText);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the image');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
