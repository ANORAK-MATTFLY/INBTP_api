require("dotenv").config();
const envConfigs = require('./env_config');
const mongoose = require('mongoose');
const { ApolloServer } = require("apollo-server");
const { buildSubgraphSchema } = require('@apollo/federation');
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require("express-openid-connect");
const jwt = require('express-jwt');
const guid = require("guid");
const app = express();
const cors = require('cors');

app.use(bodyParser.json(),cors({ origin: ['http://localhost:3000'] }));

const JWT_SECRET = process.env.JWT_SECRET;

const refreshTokens = {};

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: JWT_SECRET,
    baseURL: 'http://localhost:4001/gql',
    clientID: 'VdhscGiDNlBixXMKHXfFsQt8FZlwqOvI',
    issuerBaseURL: 'https://dev-ij43pgax.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


const server = new ApolloServer({
    formatResponse: (response, requestContext) => {
        if (response.errors && !requestContext.request.variables?.password) {
            if (requestContext.response?.http) {
                requestContext.response.http.status = 401;
            }
        } else if (response.data?.authenticate || response.data?.refresh) {
            const tokenExpireDate = new Date();
            tokenExpireDate.setDate(
                tokenExpireDate.getDate() + 60 * 60 * 24 * 7 // 7 days
            );
            const refreshTokenGuid = guid.raw();

            const token = jwt.verify(
                response.data?.authenticate || response.data?.refresh,
                JWT_SECRET
            );

            refreshTokens[refreshTokenGuid] = token.data;
            const refreshToken = jwt.sign({ data: refreshTokenGuid }, JWT_SECRET, {
                expiresIn: "7 days",
            });


            requestContext.response?.http?.headers.append(
                "Set-Cookie",
                `refreshToken=${refreshToken}; expires=${tokenExpireDate};`,
            );
        }
        return response;
    },

    context: ((expressContext, request) => {

        const context = {
            name: null,
            refreshToken: null,
        };

        if (expressContext.req.headers?.cookie != undefined && expressContext.req.headers?.cookie != "") {
            const cookies = (expressContext.req.headers?.cookie)
                .split(";")
                .reduce((obj, c) => {
                    const [name, value] = c.split("=");
                    obj[name.trim()] = value.trim();
                    return obj;
                }, {});
            context.refreshToken = cookies?.refreshToken;
        }
        try {
            if (expressContext.req.headers["x-access-token"]) {
                const token = jwt.verify(
                    expressContext.req.headers["x-access-token"],
                    JWT_SECRET
                );
                context.name = token.data;

            }
        } catch (e) { }

        return { context, request };
    }),

    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});


const ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};


mongoose.connect("mongodb+srv://gastonlok:-Z8Da9-Lb6G8Ccs@cluster0.h4c1nvk.mongodb.net/?retryWrites=true&w=majority", ConnectionOptions).then(() =>
    server.listen(39000).then(({ url }) => {
        console.log(`${url}`);
    })

).catch(error => {
    throw new Error(error);
});


