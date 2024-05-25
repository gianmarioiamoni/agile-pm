import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bcryptjs from 'bcryptjs';

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/project.js";
import roleRoutes from "./routes/role.js";
import rolesMapRoutes from "./routes/rolesMap.js";
import assignmentsRoutes from "./routes/assignment.js";
import sprintsRoutes from "./routes/sprint.js";
import taskRoutes from "./routes/task.js";
import backlogRoutes from "./routes/backlog-item.js";

import Role from './models/role.js';
import User from './models/user.js';

import { initDB } from "./Authorizations.js";

import cors from 'cors';

import bodyParser from 'body-parser';



dotenv.config();

const app = express();

// allows the application to receive JSON files
app.use(express.json());

// user to parse the cookie from req.cookies
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

// cors
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));  // Use cors middleware

const initUser = async () => {
    try {
        const hashedPassword = bcryptjs.hashSync(process.env.DEFAULT_ADMIN_PWD, 10);

        const adminRole = await Role.findOne({ roleKey: 0 });
        const users = await User.find({}).populate('role');
        const adminUser = users.find((u) => u.role && u.role.roleKey == 0);

        if (!adminUser) {
            const adminUserData = {
                username: "admin",
                email: "agileprojectmanagerinfo@gmail.com",
                password: hashedPassword,
                role: adminRole._id
            };
            await User.create(adminUserData);
            console.log("Default Admin user created");
        }
    } catch (error) {
        console.error("Error in initializing default admin user:", error);
    }
};

// DB Initialization
async function initializeDatabase() {
    try {

        await initDB();
        await initUser();

        console.log("Database successfully initialized.");
    } catch (error) {
        console.error("Error during database initialization:", error);
    }
}

try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("CONNECTED TO DATABASE");

    initializeDatabase();
    
} catch (error) {
    console.log(error)
}
app.listen(3000, () => {
    console.log("SERVER LISTENING ON PORT 3000");
});

app.use("/server/user", userRoutes);
app.use("/server/auth", authRoutes);
app.use("/server/projects", projectsRoutes);
app.use("/server/roles", roleRoutes);
app.use("/server/roles-map", rolesMapRoutes);
app.use("/server/assignments", assignmentsRoutes);
app.use("/server/sprints", sprintsRoutes);
app.use("/server/tasks", taskRoutes);
app.use("/server/backlog-items", backlogRoutes);

// middleware to manage errors
app.use((err, req, res, next) => {
    // 500 is internal server error
    const statusCode = err.statusCode || 500;
    const errMessage = err.message || "Internal server error";

    return res.status(statusCode).json({
        success: false,
        message: errMessage,
        statusCode,
      });
});




