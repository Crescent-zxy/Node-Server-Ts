import * as http from "http";

const server = http.createServer();

server.on(
  "request",
  (request: http.IncomingMessage, response: http.ServerResponse) => {
    const array = [];
    request.on("data", (chunk) => {
      array.push(chunk);
    });
    request.on("end", () => {
      const body = Buffer.concat(array).toString();
      console.log("body");
      console.log(body);
      response.end("hi");
    });
  }
);

server.listen(8888);
