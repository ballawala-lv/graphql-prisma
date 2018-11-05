import {GraphQLServer, PubSub} from 'graphql-yoga';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import db from './db';
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
// import Post from './resolvers/Post'
// import User from './resolvers/User'
import Subscription from './resolvers/Subscription'
import prisma from './prisma';


const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: {
		Query,
		Mutation,
		// Post,
		// User,
		Subscription
	},
	context: {
		db,
		pubsub,
		prisma
	}
});

server.start(() => {
	console.log('the server is up')
});