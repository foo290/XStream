const cfg = require("./configs");
const fs = require("fs")
const path = require('path');
const os = require('os');

class MakeFiles
{

    makeFilesInPath(filePath){
        if (filePath.endsWith(".log")){
            if (!fs.existsSync(filePath)){
                let folderpath = filePath.split(path.sep).slice(0, -1).join(path.sep)
                fs.mkdirSync(folderpath, {recursive: true})
                fs.closeSync(fs.openSync(filePath, 'w'));
                return true;   
            }
        }
        return false;
    }

    writeLogs(filePath, data){
        this.makeFilesInPath(filePath);
        fs.appendFileSync(filePath, `${data}\n`);
    }
}

class Logger
{
    constructor(filename) {
        this.filename = filename;
        this.printer = console.log
        this.date = new Date();

        this.makeSeparateFiles = cfg.FILE_CONFIGS.makeSeparateLogFiles;
        this.makeCombinedFiles = cfg.FILE_CONFIGS.makeCombinedLogFiles;
        this.combinedFilePath = path.join(cfg.FILE_CONFIGS.path, cfg.FILE_CONFIGS.folder, cfg.FILE_CONFIGS.fileName);
        this.separateFilePath = path.join(cfg.FILE_CONFIGS.path, cfg.FILE_CONFIGS.folder, `${filename}.log`);

        this.fileManager = new MakeFiles()
    };

    __printMsg(msg, by, clr){
        let printable = `${clr}[${by}] [${this.date}] [${this.filename}] - ${msg} ${cfg.LOG_CLR.reset}`;
        if (this.makeSeparateFiles){
            this.fileManager.writeLogs(this.separateFilePath, printable)
        }
        if (this.makeCombinedFiles){
            this.fileManager.writeLogs(this.combinedFilePath, printable)
        }
        this.printer(printable);
    }

    debug(msg){
        this.__printMsg(msg, "DEBUG", cfg.LOG_CLR.debug)
    }

    info(msg){
        this.__printMsg(msg, "INFO", cfg.LOG_CLR.info);
    }

    error(msg){
        this.__printMsg(msg, "ERROR", cfg.LOG_CLR.error);
    }

    critical(msg){
        this.__printMsg(msg, "CRITICAL", cfg.LOG_CLR.critical);
    }

    warning(msg){
        this.__printMsg(msg, "WARNING", cfg.LOG_CLR.warning);
    }
}


module.exports = {
    Logger
}
