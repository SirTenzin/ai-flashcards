import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { dbConnect } from '@/lib/db/dbConnect';
import { User as UserModel } from '@/lib/db/models/User';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const user = {
          id: '1',
          name: 'John',
          email: credentials?.email as string
        };
        if (user) {
          await dbConnect();

          // Check if the user already exists in the database
          const existingUser = await UserModel.findOne({ email: credentials?.email });
          if (!existingUser) {
            // If the user doesn't exist, create a new user document
            const newUser = new UserModel({
              name: user.name,
              email: user.email,
              isPro: false
            });

            // Save the new user to the database
            await newUser.save();
            console.log('New user created and saved to database');
          } else {
            console.log('User already exists in the database');
          }
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  pages: {
    signIn: '/authenticate' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
