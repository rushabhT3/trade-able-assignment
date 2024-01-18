// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/#1-Install

//server.js
const app = require("./app");
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
