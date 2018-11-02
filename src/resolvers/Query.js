export default {
	me() {
		return {
			id: '123',
			name: 'B',
			email: 'b@b.com'
		}
	},
	users(parent, args, {db, prisma}, info) {
		const opArgs = {};
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
	posts(parent, args, {db, prisma}, info) {
		const opArgs = {};
		if(args.query) {
			opArgs.where = {
				OR: [
					{title_contains: args.query},
					{body_contains: args.query}
				]
			}
		}
		return prisma.query.posts(opArgs, info)
		// return db.users;
	},
	comments(parent, args, {prisma}, info) {
		return prisma.query.comments({
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
