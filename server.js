const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const cors = require("cors");
const { error } = require('console');

const corsOptions = {
    origin: "https://www.codeweb4u.com/",
    Credential: true,
    optionSuccessStatus: 200,
    exposedHeaders: "**"
}

app.use(cors(corsOptions));

app.get('/download', async (req, res, next) => {
    console.log(req.query.url);
    try{
        const videoUrl = req.query.url;
        const videoInfo =  await ytdl.getInfo(videoUrl);
        const auudioFormats = ytdl.chooseFormat(videoInfo.formats, "videoandaudio" , { quality: 'highest' });
        // auudioFormats.map((item)=>{
            res.send(auudioFormats.url);
        // });
    } catch(error){
        next(error);;
    }
});

app.listen(3000, ()=>{
    console.log("server running on port 3000")
})