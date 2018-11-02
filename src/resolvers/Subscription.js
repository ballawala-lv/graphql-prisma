export default {
	count: {
		subscribe(parent, args, ctx, info) {
			const pubsub = ctx.pubsub;
			let count = 0;
			setInterval(() => {
				count++;
				pubsub.publish('count', {
					count
				})
			}, 1000);
			return pubsub.asyncIterator('count') //channel name
		}
	},

	post: {
		subscribe(parent, {author}, {db, pubsub}, info) {
			const user = db.users.find((user) => user.id ===author);
			if(!user) {
				throw new Error('User not found');
			}
			return pubsub.asyncIterator(`post ${author}`);
		}
	}
}