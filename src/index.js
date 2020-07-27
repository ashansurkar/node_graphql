import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
import Subscription from './resolvers/Subscription';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    context : {
        db,
        pubsub
    },
    resolvers  : {
        Query,
        Mutation,
        Post,
        User,
        Comment,
        Subscription
    }
});
server.start(()=>{
    console.log("graphql us up")
});