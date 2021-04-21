const streamerEngine = require("./streamer_engine/engine")
const express = require("express");
const path = require("path");
const logging = require('./logging/logger')
const fs = require("fs")
const os = require("os")

const feConfigs = require("./preferences/serve").FRONTEND_CONFIG

const videoEngine = new streamerEngine.Streamer();

function showList(dirPath) {
    let thumbnails = []
    let realPath = path.join('public', dirPath)
    let jsonResp = {}

    fs.readdirSync(realPath).forEach(file =>{
        let tpath = path.join(realPath, file);
        if (
            fs.lstatSync(tpath).isFile()
             && file.endsWith('.png')
        ){
            let expressCompatiblePath = path.join(dirPath, file)
            let title = file.split('_').slice(-1)[0].split('.')[0]
            // console.log(title)
            // jsonResp.thumbnail = expressCompatiblePath;
            // jsonResp.title

            thumbnails.push([expressCompatiblePath, title])
        }
    })
    return thumbnails;
    
}

logger = new logging.Logger('Index.js', 'ALL')

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, resp){
    resp.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, resp)=>{videoEngine.streamer(req, resp)});

app.get('/fe/configs', (req, resp)=>{
    resp.setHeader("Content-Type", 'application/json');
    resp.end(JSON.stringify({'feConfigs': feConfigs}))
})

app.get('/playlist', (req, resp)=>{
    let list = showList(`thumbnails`)
    resp.setHeader('Content-Type', 'application/json');
    resp.end(JSON.stringify({ 'list': list }));
})

app.listen(8000, function(){
    logger.info('Listening to port 8000')
});
