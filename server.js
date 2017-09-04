const http = require("http");
const server = new http.Server();
const contentType = require('content-type');
const debug = require('debug')('analysis');
const createErrer = require('http-errors');
const querystring = require('querystring');
const fs = require('fs');
const zlib = require('zlib');
let gzip = zlib.createGzip();

server.on("request", function(req, res) {
    if (req.url == '/jquery.1.8.3.min.js') {
        // console.log(req.pipe.toString());
        console.log(gzip);
        // console.log(req);
        fs.createReadStream(__dirname + '/jquery.1.8.3.min.js').pipe(res);
    }
    if (req.url !== '/favicon.ico' && req.method == "POST") {
        let chunkBuffer = '';
        let chunkString = '';
        // console.log(req);
        // console.log(createErrer(401, '请登录浏览这个页面。'))
        // console.log(req.headers['content-type'].split('; ')[1].replace('boundary=', ''));
        req.setEncoding('binary');
        let boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
        debug(contentType.parse(req))
        req.on('data', function(data) {
            console.log(data);
            chunkString += data;
        })
        req.on('end', function(data) {
            console.log(chunkString);
            let file = querystring.parse(chunkString, '\r\n', ':');
            let contentType = file['Content-Type'].substring(1);
            // console.log(chunkString.indexOf(contentType) + contentType.length);
            let shorterData = chunkString.substring(chunkString.indexOf(contentType) + contentType.length).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            // console.log(shorterData);
            let binaryData = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '').substring(0, shorterData.indexOf('--' + boundary + '--'));
            // console.log(contentType);
            fs.writeFile(boundary + '.png', binaryData, 'binary', function(err) {
                res.end('图片上传完成');
            });
            // console.log(file);
            // console.log(file['Content-Disposition'].split('; '));
            // let chunkStringArr = chunkString.split('\r\n\r\n');
            // console.log(chunkStringArr[2]);
        })
    }
    // res.writeHead(200, {
    //     "content-type": "text/html"
    // });
    if (req.url == '/') {
        fs.createReadStream(__dirname + '/index.html').pipe(res)

    }
});
server.listen(3000);