const express = require('express')
const path = require('path')
const server = express();

server.use("/", express.static(path.join(__dirname, "public")))
server.use(express.urlencoded({ extended: true }));
const hostname = 'localhost'
const port = 8000

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
    console.log(`dirname: ${__dirname}`)
})