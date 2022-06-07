import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";

const cacheAge = 31536000;
const publicDir = path.resolve(__dirname, "public");
const server = http.createServer();

server.on(
  "request",
  (request: http.IncomingMessage, response: http.ServerResponse) => {
    const { method, url: requestUrl, headers } = request;
    if (method.toLocaleLowerCase() !== "get") {
      response.statusCode = 405;
      response.end();
      return;
    }
    const { pathname, query } = url.parse(requestUrl);
    const filename = pathname.substring(1) || "index.html";
    fs.readFile(path.resolve(publicDir, filename), (error, data) => {
      if (error) {
        response.setHeader("Content-Type", "text/text; charset=utf-8");
        if ((error.errno = -4058)) {
          response.statusCode = 404;
          response.end("文件不存在");
        } else if ((error.errno = -4068)) {
          response.statusCode = 403;
          response.end("无法查看目录内容");
        } else {
          response.statusCode = 500;
          response.end("服务器繁忙");
        }
      } else {
        response.setHeader("Cache-Control", `public, max-age = ${cacheAge}`);
        response.end(data);
      }
    });
  }
);

server.listen(8888);
