import bcryptjs from 'bcryptjs';
import sgMail from '@sendgrid/mail';

import { errorHandler } from "../utils/error.js"
import User from '../models/user.js';


export const getUsers = async (req, res, next) => {
    try {
        //// check if the user is trying to get users list is an Admin
        // if (req.user.role !== 0) {
        //     return next(errorHandler(401, "Only Admin can get users list"));
        // }
        
        const usersList = await User.find({});

        // remove the password from the response to be send to the client
        const restList = usersList.map((u) => {
            const { password, ...rest } = u._doc;
            return rest;
        });

        // send back the users list to the client, without the password
        res.status(200).json(restList);
    } catch (error) {
        next(error);
    }
};


// next() allows to use the middleware to handle errors
export const updateUser = async (req, res, next) => {
    // check if the user is trying to updated his own account
    // or if is an Admin
    // req.user comes from validateUser middleware
    const currentUser = await User.findById(req.user.id);
    if (req.user.id !== req.params.id && currentUser.role !== 0) {
        return next(errorHandler(401, "You can update your account only or you must be an Admin"));
    }

    // the user is the owner of the profile or is an Admin
    try {
        // if there is a new password, we want encrypt it
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // update the user
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
                role: req.body.role
            },
            { new: true } // we get back the updated user
        );

        // remove the password from the response to be send to the client
        const { password, ...rest } = updatedUser._doc;

        // send back the updated user to the client, without the password
        res.status(200).json({ ...rest, success: true });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    // check if the user is trying to delete his own account or if is an Admin
    // req.user comes from validateUser middleware
    const userArray = await User.find({ _id: req.user.id }).exec();
    const role = userArray[0].role;
    console.log("deleteUser() - role: ", role)

    if (role !== 0 && req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can delete your account only"));
    }

    // the user is authorized to delete his own account
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been successfully deleted")

    } catch (error) {
        next(error);
    }
};

export const addUser = async (req, res, next) => {
    // check if the user is trying to add his own account or if it is an Admin
    // req.user comes from validateUser middleware
    console.log("+++ addUser() - req.user.id: ", req.user.id)
    const userArray = await User.find({ _id: req.user.id }).exec();
    const role = userArray[0].role;
    console.log("+++ addUser() - role: ", role)

    if (role !== 0 && req.user.id !== req.params.id) {
        return next(errorHandler(401, "You must be an Admin to do that"));
    }

    // the user is the owner of the profile
    try {
        // if there is a new password, we want encrypt it
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        console.log("+++ addUser() - req.body: ", req.body)

        // add the user the user
        const newUser = new User(
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }
        );
        console.log("+++ addUser() - newUser: ", newUser)

        await newUser.save();

        // remove the password from the response to be send to the client
        const { password, ...rest } = newUser._doc;

        // send back the updated user to the client, without the password
        res.status(200).json({ ...rest, success: true });
    } catch (error) {
        next(error);
    }
}

export const sendEmail = async (req, res) => {
    // setup SendGrid API KEY
    console.log("sendEmail() - process.env.SENDGRID_API_KEY: ", process.env.SENDGRID_API_KEY)
    console.log("sendEmail() - process.env.SENDGRID_EMAIL: ", process.env.SENDGRID_EMAIL)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { to, subject, body } = req.body;

    const msg = {
        to: to,
        from: process.env.SENDGRID_EMAIL, // email address configured on SendGrid
        subject: subject,
        text: body
    };

    sgMail.send(msg)
        .then(() => {
            res.status(200).send('Email sent successfully');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Failed to send email');
        });
};