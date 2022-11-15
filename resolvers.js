require("dotenv").config();
const User = require('./models/model');
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");


const resolvers = {
    Query: {
        async getUsersByType(_, { isAdmin }, ctx) {
            const users = await User.find({ isAdmin });
            if (users == null) {
                throw new Error("Can't get any user");
            }

            return users;
        },
        async getOneUser(_, { email }, ctx) {
            const user = await User.findOne({ email });
            if (user == null) {
                throw new Error("Can't get any user");
            }
            return user;
        },
        async getCurrentUser(_, args, { user }) {
            if (user) {
                return await User.findOne({
                    email: user.email
                })
            }
        }
    },



    Mutation: {
        async login(_, { email, password }, ctx) {
            const authUser = await User.findOne({
                email,
            });

            if (!authUser) {
                throw new Error("This user doesn't exist.");
            }

            const isValidUser = password == authUser.password;


            if (!isValidUser) {
                throw new Error('Your password is incorrect!');
            }

            const accessToken = jwt.sign({ data: email }, "sign_token", { expiresIn: "5s" });

            return accessToken;
        },
        async createUser(_, { id, email, userName, userProfilePicture, middleName, sex, password,isAdmin, authorizationLevel }, ctx) {
            const user = await User({
                id: await uuidv4(),
                email,
                userName,
                userProfilePicture,
                middleName,
                sex,
                isAdmin,
                authorizationLevel,
                password
            });
            await user.save().then(result => result).catch(error => { throw new Error(error); });
            try {
                if (user != null) {
                    return "A new user has been created!";
                }
            }
            catch (error) {
                throw new Error(error);
            }
        }
    }
};

module.exports = resolvers;
