import neo4j, { Driver } from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

let driver: Driver;

export const getDriver = (): Driver => {
    if (!driver) {
        driver = neo4j.driver(
            process.env.NEO4J_URI!,
            neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
        );
    }
    return driver;
};

export const closeDriver = async () => {
    if (driver) await driver.close();
}