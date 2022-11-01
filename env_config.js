require("dotenv").config();

const envConfigs = Object.freeze({
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT,
    developmentEndPoint: "mongodb + srv://gastonlok:-Z8Da9-Lb6G8Ccs@cluster0.ojnan.mongodb.net/students?retryWrites=true&w=majority",
    productionEndPoint: `mongodb+srv://${process.env.PROD_DB_USERNAME}:${process.env.PROD_DB_PASSWORD}@cluster0.ojnan.mongodb.net/?retryWrites=true&w=majority`
});


module.export = envConfigs;
