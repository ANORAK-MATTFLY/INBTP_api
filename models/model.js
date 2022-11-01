const { Schema, model, mongoose } = require("mongoose");


const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },

    sex: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    userProfilePicture: {
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    authorizationLevel: {
        type: Number,
        required: true,
    },


});

module.exports = mongoose.model("User", UserSchema);

