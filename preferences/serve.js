const path = require('path');
const os = require('os');

SERVER_CONFIG = {
    videoDir: path.join(os.homedir(), "Videos/agnessMediaWarehouse/video/")
}

FRONTEND_CONFIG = {
    headName: "Agness"
}

module.exports = {
    SERVER_CONFIG, FRONTEND_CONFIG
}