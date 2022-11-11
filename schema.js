const { gql } = require("apollo-server");

const typeDefs = gql`
    type User {
        id: String!
        email: String!
        userName: String!
        middleName: String!
        sex: String!
        isAdmin: Boolean!
        authorizationLevel: Int!
        userProfilePicture: String!
        password: String!
    }

    type Query {
        getUserById(id: String): User!
        getUsersByType(isAdmin: Boolean!): [User]
        getOneUser(email: String): User!
        getCurrentUser: User!
    }

    type Mutation {
        createUser(email: String!, userName: String!, userProfilePicture: String!, middleName: String!, sex: String!, password: String! ): String!
        login(email: String!, password: String!): String!
    }
`;

module.exports = typeDefs;
