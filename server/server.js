import dotenv from "dotenv";
import app from "./app.js";
import {connectDB} from "./config/db.js";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Games API",
                version: "1.0.0",
                description: "API for managing games",
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT}`,
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
        apis: ["./routes/*.js"]
    }

    const spacs = swaggerjsdoc(options)
    app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spacs))
    console.log(`API documentation available at http://localhost:${process.env.PORT}/api-doc`);
};

startServer().catch(console.error);
