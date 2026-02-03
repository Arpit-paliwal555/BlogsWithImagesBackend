const { PrismaClient } = require('./prisma/generated/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || '';
const pgPool = new pg.Pool({ connectionString });
const prismaAdaptor = new PrismaPg(pgPool);

const prisma = new PrismaClient({
  adapter: prismaAdaptor,
});

async function main() {
  try {
    // Create a default user if it doesn't exist
    let defaultUser = await prisma.user.findUnique({
      where: { email: 'default@local' },
    });

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'default@local',
          username: 'default_user',
          password: 'hashed_default_password', // In production, use actual hashed password
        },
      });
      console.log('Created default user:', defaultUser);
    } else {
      console.log('Default user already exists:', defaultUser);
    }

    // Backfill BlogPost rows
    const blogPostsUpdated = await prisma.blogPost.updateMany({
      where: { userId: null },
      data: { userId: defaultUser.id },
    });
    console.log(`Updated ${blogPostsUpdated.count} BlogPost rows`);

    // Backfill ImagePost rows
    const imagePostsUpdated = await prisma.imagePost.updateMany({
      where: { userId: null },
      data: { userId: defaultUser.id },
    });
    console.log(`Updated ${imagePostsUpdated.count} ImagePost rows`);

    // Backfill Comment rows
    const commentsUpdated = await prisma.comment.updateMany({
      where: { userId: null },
      data: { userId: defaultUser.id },
    });
    console.log(`Updated ${commentsUpdated.count} Comment rows`);

    console.log('Backfill complete!');
  } catch (error) {
    console.error('Error during backfill:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
