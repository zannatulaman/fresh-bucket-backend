const http = require("http");
const app = require("./app/app");

const server = http.createServer(app);

const PORT = 5000;

server.listen(PORT, ()=> {
    console.log(`Server is listening at ${PORT}`);
})

