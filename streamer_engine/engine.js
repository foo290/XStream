const fs = require("fs");
const os = require("os");
const path = require("path");
const logging = require('../logging/logger')
const ffmpeg = require("ffmpeg")
const fluent_ffmpeg = require("fluent-ffmpeg")
const http = require("https");
const preferences = require("../preferences/serve")

const serverConfigs = preferences.SERVER_CONFIG;

logger = new logging.Logger('Engine.js', 'ALL')

function thumbnailer(vid, atinterval, savefoler) {
    try{
        let previousvid = path.basename(vid)
        let previousT = path.join(savefoler, `thumb_${previousvid}.png`)
        if (!fs.existsSync(`./${previousT}`)){
            logger.debug(`Making thumbnail for video : "${vid}"`)
            fluent_ffmpeg(vid).screenshots({
            count: 1,
            timeMarks: [atinterval],
            filename: "thumb_%f.png",
            size: '1280x720',
            folder: savefoler
            })
            logger.info(`Thumbnail created and saved successfully for video : "${vid}"`)
        }
        else{
            logger.info("Thumbnail for this vid already exsist!")
        }
    }
    catch(e){
        logger.error(`Some Error in making thumbnail for video : "${vid}"`)
    }

}

class Streamer
{
    constructor() {
        this.videoDir = serverConfigs.videoDir;
        this.availableVids = [];
        this.thumbnailDir = 'public/thumbnails/'

        this.loadVideosFromStorage()
        this.makeThumbnails()
    }

    makeThumbnails(){
        if (this.availableVids){
            this.availableVids.forEach(vid =>{
                let fullPath = path.join(this.videoDir, vid)
                thumbnailer(fullPath, '100', this.thumbnailDir);
            })
        }
    }

    loadVideosFromStorage(){
        if (fs.existsSync(this.videoDir)){
            this.availableVids = fs.readdirSync(this.videoDir)
        }
        else{
            logger.error("Video directory path does not exists")
        }
    }

    getVideoToStream(){
        if (this.availableVids.length){
            let vts = this.availableVids[4]
            console.log(this.availableVids)
            return vts;
        }
        else{
            logger.error("cannot find any video to stream")
        }
    }

    streamer(req, resp){
        const range = req.headers.range;
        if (!range){
            logger.error("Range not defined in request header")
            resp.status(400).send("Requiress range header")
        }

        const vts = this.getVideoToStream()
        if (!vts){
            logger.error("Aborting stream...")
            return
        }

        const vtsFullPath = path.join(this.videoDir, vts)

        const videoSize = fs.statSync(vtsFullPath).size
        const chunkSize = 10 ** 6;

        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + chunkSize, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Range": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mkv",
        };
        resp.writeHead(206, headers);
    
        const videoStream = fs.createReadStream(vtsFullPath, { start, end });
         videoStream.pipe(resp);
    }

}

module.exports = {
    Streamer, thumbnailer
}

