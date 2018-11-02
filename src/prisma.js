import {Prisma} from 'prisma-binding';

export default new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466'
});

// prisma.query prisma.mutation prisma.subscription prisma.exists
//
// prisma.query.users(null, '{id name email posts {id title} }').then((data)=>{
// 	console.log('d ata', JSON.stringify(data, null, 2));
// })