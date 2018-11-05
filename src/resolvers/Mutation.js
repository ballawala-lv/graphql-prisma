import uuidv4 from "uuid/v4";
import bcrypt from 'bcryptjs';



// const token = jwt.sign({ id: 46, 'mysecret' })
// creates new jwt token. two args. First obj is payload contains info for our specific purposes. Second is a secret which will only live on the nodejs server
// const decoded = jwt.decode(token) you dont need secret to decode
// jwt.verify(token, 'mysecret')  verifies token created by the secret

export default {
	async createUser(parent, args, {prisma }, info) {
		// const prisma = ctx.prisma;
		if(args.data.password.length < 8) {
			throw new Error('Password should be 8 characters or greater');
		}
		const password = await bcrypt.hash(args.data.password, 10); // second param is the salt
		const emailTaken = await prisma.exists.User({email: args.data.email});
		if (emailTaken) {
			throw new Error('Email Taken');
		}


		const user = await prisma.mutation.createUser({
			data: {
				...args.data,
				password
			}
		}, info);


		// console.log(args);
		// const emailTaken = ctx.db.users.some((user)=>{return user.email === args.data.email});
		// if (emailTaken) {
		// 	throw new Error('Email Taken');
		// }
		// const user = {
		// 	id: uuidv4(),
		// 	...args.data
		// };
		// ctx.db.users.push(user);
		return user;
	},
	async updateUser(parent, args, {prisma}, info) {
		return prisma.mutation.updateUser({
			where: {
				id: args.id
			},
			data: args.data
		}, info)
	},
	async deleteUser(parent, args, {db, prisma}, info) {
		const userExists = await prisma.exists.User({id: args.id});
		if (!userExists) {
			throw new Error('user does not exist')
		}
		const deletedUser = await prisma.mutation.deleteUser({
			where: {
				id: args.id
			}
		}, info);
		return deletedUser;


		// const userIndex = db.users.findIndex((user) => user.id === args.id);
		// if(userIndex === -1) {
		// 	throw new Error('user does not exist')
		// }
		//
		// const deletedUserRef = users.splice(userIndex, 1);
		// db.posts = posts.filter((post) => {
		// 	const match =  post.author === args.id
		// 	return !match;
		// })
		// return deletedUserRef[0];
	},
	async createPost(parent, args, ctx, info) {
		const prisma = ctx.prisma;
		return prisma.mutation.createPost({
			data: {
				title: args.data.title,
				body: args.data.body,
				published: args.data.published,
				author: {
					connect: {
						id: args.data.author
					}
				}
			}
		}, info)
		// const userExist = ctx.db.users.some(user =>  user.id === args.author);
		// if(!userExist) {
		// 	throw new Error('User Not Found', userExist.id);
		// }
		//
		// const post = {
		// 	id: uuidv4(),
		// 	...args
		// };
		//
		// ctx.db.posts.push(post)
		// ctx.pubsub.publish(`post ${args.author}`, {mutation: 'CREATED', data: post});
		// return post;
	},
	async updatePost(parent, args, {prisma}, info) {
		return prisma.mutation.updatePost({
			where: {
				id: args.id
			},
			data: {
				title: args.data.title,
				body: args.data.body,
				published: args.data.published,
				author: {
					connect: {
						id: args.data.author
					}
				}
			}
		})
	},
	async deletePost(parent, args, {prisma}, info) {
		return prisma.mutation.deletePost({
			where: {
				id: args.id
			}
		})
	},
	async createComment(parents, args, {prisma}, info) {
		return prisma.mutation.createComment({
			data: {
				text: args.data.text,
				author: {
					connect: {
						id: args.data.author
					}
				},
				post: {
					connect: {
						id: args.data.post
					}
				}
			}
		})
	},
	async updateComment(parents, args, {prisma}, info) {
		return prisma.mutation.updateComment({
				where: {
					id: args.id
				},
				data: args.data
			},
			info)
	},
	async deleteComment(parent, args, {prisma}, info) {
		return prisma.mutation.deleteComment({
			where: {
				id: args.id
			}
		},info)
	}

}