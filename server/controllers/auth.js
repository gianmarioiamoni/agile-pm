import User from "../models/user.js";

// import { getCurrentRoles, getRoleId } from "../Authorizations.js";

import jwt from "jsonwebtoken";

import { errorHandler } from "../utils/error.js"

import bcryptjs from "bcryptjs"; // use bcryptjs and NOT bcrypt, as It gives probles in production
import Role from "../models/role.js";

const createCookie = (req, res, user) => {

    // the user is authenticated; create a token and put It inside the cookie of the browser
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // separates the password from the rest of the user data, so we don't send back password to the client
    // we need to destructure only the _doc part of the validUser information
    const { password: hashedPwd, ...rest } = user._doc;

    // cookie's expiring date sets at 10 days
    const expiringDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10);

    // sends the cookie to the client
    // httpOnly option prevents 3rd parties application to modify the cookie
    res
        .cookie("access_token", token, { httpOnly: true, expires: expiringDate })
        .status(200)
        // .json({ success: true, user: { ...rest } });
        .json({ ...rest, success: true });
};

// next() allows to use middleware
export const signup = async (req, res, next) => {
    const { username, email, password, role } = req.body;
    // get role id from roleKey
    // const roleId = await getRoleId(role);
    const roleId = role._id;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role: roleId });

    // the user is authenticated; create a token and put It inside the cookie of the browser
    createCookie(req, res, newUser);

    try {
        await newUser.save();
        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        // It uses error management middleware
        next(err);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email: email });

        if (!validUser) {
            return next(errorHandler(401, "Invalid credentials"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(401, "Invalid credentials"));
        }

        // the user is authenticated; create a token and put It inside the cookie of the browser
        createCookie(req, res, validUser);

    } catch (err) {
        next(err);
    }
};

export const google = async (req, res, next) => {
    const { name, email, photo, role } = req.body;
    try {
        const user = await User.findOne({ email }).populate(role);

        if (user) {
            // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            // the user is authenticated; create a token and put It inside the cookie of the browser
            createCookie(req, res, user);
            return;

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            // create a username from Google displayName that is unique
            const newUsername = name.split(" ").join("").toLowerCase() + (Math.floor(Math.random() * 10000)).toString();

            // const newUserRoleId = await getRoleId(role);
            const newUserRoleId = role._id;

            const newUser = new User({ username: newUsername, email, password: hashedPassword, role: newUserRoleId, profilePicture: photo })

            await newUser.save();

            createCookie(req, res, newUser);
            return;
        }
    } catch (error) {
        next(error);
    }
};

// // utility function to get roleId from roleKey
// const getRoleId = async (roleKey) => {
//     const rolesMap = await getCurrentRoles();
//     const roleId = rolesMap.find((r) => r.roleKey === roleKey)._id;

//     return roleId;
// }

export const signout = (req, res) => {
    res.clearCookie("access_token").status(200).json("Signout success");
};

