const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: "https://www.codeweb4u.com/",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: "**"
}

app.use(cors(corsOptions));

app.get('/download', async (req, res, next) => {
    console.log(req.query.url);
    try {
        const videoUrl = req.query.url;
        if (!videoUrl || !ytdl.validateURL(videoUrl)) {
            return res.status(400).send({ error: 'Invalid URL' });
        }

        const videoInfo = await ytdl.getInfo(videoUrl);

        // Get video details
        const title = videoInfo.videoDetails.title;
        const thumbnailUrl = videoInfo.videoDetails.thumbnails[4].url;

        // Function to find format URL
        const getFormatUrl = (itag) => {
            const format = videoInfo.formats.find(f => f.itag === itag);
            return format ? format.url : null;
        };

        // itags for common resolutions
        const itags = {
            '1080p': 137, // video-only
            '720p': 136, // video-only
            '480p': 135, // video-only
            '360p': 18   // video and audio
        };

        const videoUrls = {
            '1080p': getFormatUrl(itags['1080p']),
            '720p': getFormatUrl(itags['720p']),
            '480p': getFormatUrl(itags['480p']),
            '360p': getFormatUrl(itags['360p'])
        };

        // Find the highest quality video format
        let highestQualityUrl = null;
        let highestQuality = 0;
        videoInfo.formats.forEach(format => {
            if (format.qualityLabel && format.hasVideo && format.hasAudio) {
                const quality = parseInt(format.qualityLabel.replace('p', ''), 10);
                if (quality > highestQuality) {
                    highestQuality = quality;
                    highestQualityUrl = format.url;
                }
            }
        });

        // Audio format (common itag for audio)
        const audioUrl = getFormatUrl(140); // itag for m4a audio

        const response = {
            title: title,
            thumbnailUrl: thumbnailUrl,
            videoUrls: videoUrls,
            highestQualityUrl: highestQualityUrl,
            audioUrl: audioUrl
        };

        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to retrieve video info' });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
