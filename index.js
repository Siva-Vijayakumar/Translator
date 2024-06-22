const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { translatedText: '', error: '', sourceText: '', sourceLang: 'en', targetLang: 'es' });
});

app.post('/translate', async (req, res) => {
  const text = req.body.text;
  const sourceLanguage = req.body.sourceLanguage;
  const targetLanguage = req.body.targetLanguage;

  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: `${sourceLanguage}|${targetLanguage}`
      }
    });

    if (response.data.responseStatus === 200) {
      const translation = response.data.responseData.translatedText;
      res.render('index', { translatedText: translation, error: '', sourceText: text, sourceLang: sourceLanguage, targetLang: targetLanguage });
    } else {
      throw new Error('Translation API error');
    }
  } catch (error) {
    console.error(error);
    res.render('index', { translatedText: '', error: 'Error translating text. Please try again.', sourceText: text, sourceLang: sourceLanguage, targetLang: targetLanguage });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
