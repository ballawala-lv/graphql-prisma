import uuidv4 from "uuid/v4";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId';

// const token = jwt.sign({ id: 46, 'mysecret' })
// creates new jwt token. two args. First obj is payload contains info for our specific purposes. Second is a secret which will only live on the nodejs server
// const decoded = jwt.decode(token) you dont need secret to decode
// jwt.verify(token, 'mysecret')  verifies token created by the secret

export default {
	async createUser(parent, args, {prisma }, info) {
		console.log('info is', info);
		// const prisma = ctx.prisma;
		if(args.data.password.length < 8) {
			throw new Error('Password should be 8 characters or greater');
		}
		const password = await bcrypt.hash(args.data.password, 10); // second param is the salt

		console.log("password is", password);
		const emailTaken = await prisma.exists.User({email: args.data.email});
		var user;
		if (emailTaken) {
			throw new Error('Email Taken');
		}


		try {
			const data = {
				...args.data,
				password
			};

			console.log(JSON.stringify(data));

			user = await prisma.mutation.createUser({
				data
			});
			console.log("uer is", user);


			return {token: jwt.sign({userId: user.id}, 'this is a secret', {
				expiresIn: "2 days"
				}), user};

		}
		catch(e) {
			console.error('error creating user', e);
		}


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

	},
	async login(parent, {email, password}, {prisma}, info) {
		const user = await prisma.query.user({
			where: {
				email: email
			}
		});
		if(!user) {
			throw new Error('unable to login');
		}
		const hashedPassword = user.password;
		const match = await bcrypt.compare(password, hashedPassword)
		if(!match) {
			throw new Error('unable to login');
		}
		return {token: jwt.sign({userId: user.id}, 'this is a secret'), user};
	},
	async updateUser(parent, args, {prisma, request}, info) {
		const userId = getUserId(request)
		return prisma.mutation.updateUser({
			where: {
				id: userId
			},
			data: args.data
		}, info)
	},
	async deleteUser(parent, args, {db, prisma, request}, info) {
		// const userExists = await prisma.exists.User({id: args.id});
		// if (!userExists) {
		// 	throw new Error('user does not exist')
		// }
		const userId = getUserId(request)
		const deletedUser = await prisma.mutation.deleteUser({
			where: {
				id: userId
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
		const request = ctx.request;
		const userId = getUserId(request)
		return prisma.mutation.createPost({
			data: {
				title: args.data.title,
				body: args.data.body,
				published: args.data.published,
				author: {
					connect: {
						id: userId
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
	async updatePost(parent, args, {prisma, request}, info) {
		const userId = getUserId(request)
		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})

		if(!postExists) {
			throw new Error('Unable to udpate post');
		}

		const isPublished = await prisma.exists.Post({id: args.id, published: true});


		if(isPublished && !args.data.published) {
			await prisma.mutation.deleteManyComments({
				where: {
					post: {id: args.id}
				}
			})
		}

		return prisma.mutation.updatePost({
			where: {
				id: args.id
			},
			data: {
				title: args.data.title,
				body: args.data.body,
				published: args.data.published,
			}
		})
	},
	async deletePost(parent, args, {prisma, request}, info) {
		const userId = getUserId(request)
		const postExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})

		if(!postExists) {
			throw new Error('Unable to delete post');
		}

		return prisma.mutation.deletePost({
			where: {
				id: args.id
			}
		})
	},
	async createComment(parents, args, {prisma, request}, info) {
		const userId = getUserId(request);
		const publishedPostExists = await prisma.exists.Post({
			id: args.data.post,
			published: true
		});
		if (!publishedPostExists) {
			throw new Error('Post Doesnot exist');
		}
		return prisma.mutation.createComment({
			data: {
				text: args.data.text,
				author: {
					connect: {
						id: userId
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
	async updateComment(parents, args, {prisma, request}, info) {
		const userId = getUserId(request)

		const commentExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})

		if(!commentExists) {
			throw new Error('unable to update comment');
		}
		return prisma.mutation.updateComment({
				where: {
					id: args.id
				},
				data: args.data
			},
			info)
	},
	async deleteComment(parent, args, {prisma, request}, info) {
		const userId = getUserId(request)
		const commentExists = await prisma.exists.Post({
			id: args.id,
			author: {
				id: userId
			}
		})

		if(!commentExists) {
			throw new Error('unable to delete comment');
		}
		return prisma.mutation.deleteComment({
			where: {
				id: args.id
			}
		},info)
	}

}