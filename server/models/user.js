import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    profilePicture: {
        type: String,
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
    },
    // role: {
    //     type: String,
    //     enum: ['Product Owner', 'Scrum Master', 'Team Scrum Member'],
    //     default: 'Team Scrum Member' // Ruolo di default per gli utenti registrati
    // }
    role: {
        type: Number,
        min: 1,
        default: 3 
    }
}, { timestamps: true });  // each user will have time of creation and time of edit associated
    
const User = mongoose.model("User", userSchema);

export default User;