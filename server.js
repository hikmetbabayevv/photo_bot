const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
const app = express();

const BOT_TOKEN = '8441020275:AAFbmi0gosxpm3Oo1uHa4tyoR7WkacUFhFw';
const CHAT_ID = '1227787506';

app.use(fileUpload());
app.use(express.static('public'));

// Şəkil yükləmə endpoint
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.photo) return res.status(400).send('Şəkil tapılmadı');

    const photo = req.files.photo;
    const path = './' + photo.name;

    photo.mv(path, async err => {
        if (err) return res.status(500).send(err);

        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', fs.createReadStream(path));

        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
            fs.unlinkSync(path); // Şəkli sil
            res.send('Şəkil Telegrama göndərildi!');
        } catch (error) {
            res.status(500).send('Telegrama göndərmək mümkün olmadı: ' + error);
        }
    });
});

app.listen(3000, () => console.log('Server 3000 portunda işləyir'));