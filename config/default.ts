import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DB_HOST) {
    process.exit(1);
}

export default {
    port: 1337,
    dbUri: process.env.DB_HOST as string,
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
    accessTokenTtl: "60m",
    machineId: process.env.MACHINE_ID
};
