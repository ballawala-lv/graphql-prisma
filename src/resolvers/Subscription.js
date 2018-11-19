import getUserId  from '../utils/getUserId'
export default {
	count: {
		subscribe(parent, args, ctx, info) {
			// const pubsub = ctx.pubsub;
			// let count = 0;
			// setInterval(() => {
			// 	count++;
			// 	pubsub.publish('count', {
			// 		count
			// 	})
			// }, 1000);
			// return pubsub.asyncIterator('count') //channel name
		}
	},
	comment: {
		subscribe(parent, { postId }, {prisma}, info) {
			console.log('return prisma.subscription.comment', prisma.subscription.comment);
			return prisma.subscription.comment({
				where: {
					node: {
						post: {
							id: postId
						}
					}
				}
			}, info)
		}
	},
	post: {
		subscribe(parent, {author}, {db, pubsub, prisma}, info) {

			return prisma.subscription.post({
				where: {
					node: {
						published: true
					}
				}
			}, info);

			// const user = db.users.find((user) => user.id === author);
			// if (!user) {
			// 	throw new Error('User not found');
			// }
			// return pubsub.asyncIterator(`post ${author}`);
		}
	},
	myPost: {
		subscribe(parent,args, {prisma, request}, info) {
			const userId = getUserId(request);
			return prisma.subscription.post({
				where: {
					node: {
						author: {
							id: userId
						}
					}
				}
			}, info);
		}
	}
}