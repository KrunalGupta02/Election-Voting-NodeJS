import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json()) // req.body

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listeing on port ${PORT}`);
})