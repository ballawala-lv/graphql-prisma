import getUserId from '../utils/getUserId';

export default {
	async me(parent, args, {db, prisma, request}, info) {
		const userId = getUserId(request);
		const user = await prisma.query.user({
			where: {
				id: userId
			}
		}, info);
		if(!user) {
			throw new Error('User Not Found');
		}
		return user;

	},
	users(parent, args, {db, prisma}, info) {
		const opArgs = {
			first: args.first,
			skip: args.skip,
			after: args.after,
			orderBy: args.orderBy
		};
		if(args.query) {
			opArgs.where = {
				OR: [
					{name_contains: args.query},
					{email_contains: args.query}
				]
			}
		}
		return prisma.query.users(opArgs, info)
		// return db.users;
	},
	async post(parent, args, {prisma, request}, info) {
		const userId = getUserId(request, false);

		const posts = await prisma.query.posts({
			where: {
				first: args.first,
				skip: args.skip,
				after: args.after,
				id: args.id,
				OR: [{
					published: true
				}, {
					author: {
						id: userId
					}
				}]
			}
		}, info)

		if(posts.length === 0) {
			throw new Error('Post not found');
		}

		return posts[0];
	},
	posts(parent, args, {db, prisma}, info) {
		const opArgs = {
			where: {
				published: true
			}
		};
		if(args.query) {
			opArgs.where.OR = [
					{title_contains: args.query},
					{body_contains: args.query}
				]
		}
		return prisma.query.posts(opArgs, info)
		// return db.users;
	},
	async myPosts(parent, args, {prisma, request}, info) {
		const userId = getUserId(request);
		const opArgs = {
			first: args.first,
			skip: args.skip,
			after: args.after,
			where: {
				author: {
					id: userId
				}
			}
		}
		if(args.query) {
			opArgs.where.OR = [
				{title_contains: args.query},
				{body_contains: args.query}
			]
		}
		return prisma.query.posts(opArgs, info)

	},
	comments(parent, args, {prisma}, info) {
		return prisma.query.comments({
			first: args.first,
			skip: args.skip,
			after: args.after,
			text_contains: args.query
		}, info)
	},
	add(parents, args, ctx, info) {
		var numbers = args.numbers || [];
		console.log('numbers', args, numbers);
		var results = 0;

		return numbers.reduce((accumulator, currentValuee) => {
			return accumulator + currentValuee
		})
	},
	greeting(parent, args, ctx, info) {
		return `hello ${args.name}`
	},
	grades(parent, args, ctx, info) {
		return [89, 342, 2]
	}
};
