import { betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/client';


export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET, 
  basePath: '/api/auth',                 

  database: drizzleAdapter(db, {
    provider: 'mysql',
   
  }),


  emailAndPassword: {
    enabled: true
  }
});
