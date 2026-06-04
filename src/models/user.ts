import { getDriver } from '../db/neo4j';
import bcrypt from 'bcryptjs';

export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: string;
}

export const createUser = async (name: string, email: string, password: string): Promise<User> => {
    const driver = getDriver();
    const session = driver.session({ database: process.env.NEO4J_DATABASE });  // ← added
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const result = await session.run(
            `CREATE (u:User {
                id: randomUUID(),
                name: $name,
                email: $email,
                password: $hashedPassword,
                createdAt: datetime()
            }) RETURN u`,
            { name, email, hashedPassword }
        );
        return result.records[0].get('u').properties;
    } finally {
        await session.close();
    }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const driver = getDriver();
    const session = driver.session({ database: process.env.NEO4J_DATABASE });  // ← added

    try {
        const result = await session.run(
            'MATCH (u:User {email: $email}) RETURN u',
            { email }
        );
        if (result.records.length === 0) return null;
        return result.records[0].get('u').properties;
    } finally {
        await session.close();
    }
};