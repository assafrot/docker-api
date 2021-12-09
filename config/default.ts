import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DB_HOST) {
    process.exit(1);
}

export default {
    port: 1337,
    dbUri: process.env.DB_HOST as string,
    publicKey: process.env.JWT_PUBLIC_KEY,
    privateKey: process.env.JWT_PRIVATE_KEY,
    accessTokenTtl: "15m",
    refreshTokenTtl: "1y",
};
