import {GraphQLServer, PubSub} from 'graphql-yoga';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import db from './db';
import prisma from './prisma';
import { fragmentReplacements, resolvers} from './resolvers';


const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	context(request) {
		return {
			db,
			pubsub,
			prisma,
			request
		}
	},
	resolvers,
	fragmentReplacements
	// context: {
	// 	db,
	// 	pubsub,
	// 	prisma
	// }
});

server.start(() => {
	console.log('the server is up')
});