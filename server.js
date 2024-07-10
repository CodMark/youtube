const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: "https://youtube-nine-dusky.vercel.app",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: "**"
}

app.use(cors(corsOptions));

app.get('/download', async (req, res, next) => {
    console.log(req.query.url);
    try {
        const videoUrl = req.query.url;
        const url = 'https://10downloader.com/download';
        const headers = {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://10downloader.com',
            'Referer': 'https://10downloader.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        };

        // URL-encoded data string
        const data = 'url=https%3A%2F%2Fyoutu.be%2FnkGONChkBAA%3Fsi%3DLNCyBlyO3gc0k5My&q_auto=0&ajax=1&token=64708fd20b972214191a41709ec2043a417acb528c9b6e181005fa6b8edd729e';

        axios.post(url, data, { headers })
            .then(response => {
                res.send(response.data);
            })
            .catch(error => {
                console.error(error);
                res.send(error);
            });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to retrieve video info' });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
