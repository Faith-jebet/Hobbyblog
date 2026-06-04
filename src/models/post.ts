import { getDriver } from '../db/neo4j';

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export const createPost = async (
  userId: string, title: string, content: string, category: string
): Promise<Post> => {
  const driver = getDriver();
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})
       CREATE (p:Post {
         id: randomUUID(),
         title: $title,
         content: $content,
         category: $category,
         createdAt: datetime()
       })
       CREATE (u)-[:WROTE]->(p)
       RETURN p`,
      { userId, title, content, category }
    );
    return result.records[0].get('p').properties;
  } finally {
    await session.close();
  }
};

export const getPostsByUser = async (userId: string): Promise<Post[]> => {
  const driver = getDriver();
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:WROTE]->(p:Post)
       RETURN p ORDER BY p.createdAt DESC`,
      { userId }
    );
    return result.records.map(r => r.get('p').properties);
  } finally {
    await session.close();
  }
};

export const deletePost = async (postId: string, userId: string): Promise<boolean> => {
  const driver = getDriver();
  const session = driver.session({ database: process.env.NEO4J_DATABASE });

  try {
    await session.run(
      `MATCH (u:User {id: $userId})-[:WROTE]->(p:Post {id: $postId})
       DETACH DELETE p`,
      { postId, userId }
    );
    return true;
  } finally {
    await session.close();
  }
};