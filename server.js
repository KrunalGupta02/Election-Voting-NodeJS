import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";
import candidateRoutes from "./routes/candidate.route.js";
import connectToMongoDB from "./db.js";
import { jwtAuthMiddleware } from "./jwt.js";

const app = express();

app.use(bodyParser.json()); // req.body

const PORT = process.env.PORT || 3000;

connectToMongoDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        });

        app.on("error", (error) => {
            console.log("Error", error);
        });
    })
    .catch((e) => {
        console.error("MongoDB connection failed !!!", e);
    });

// Use the routers
app.use("/user", userRoutes);
app.use("/candidate", jwtAuthMiddleware, candidateRoutes);

app.listen(PORT, () => {
    console.log(`Listeing on port ${PORT}`);
});
