import getUserId from '../utils/getUserId'

export default {
	//
	email: {
		fragment: 'fragment userId on User { id }', //use the fragment to make sure that fields needed for the resolver exist incase they weren't part of the users query as that gets filtered by the info object
		resolve(parent, args, {request}, info) {
			const userId = getUserId(request, false);
			// parent is the user object
			if (userId && userId === parent.id) {
				return parent.email;
			} else {
				return null;
			}

		}
	},
	posts: {
		fragment: 'fragment userId on User { id } ', //use the fragment to make sure that fields needed for the resolver exist incase they weren't part of the users query as that gets filtered by the info object
		resolve(parent, args, {prisma}, info) {
			return prisma.query.posts({
				where: {
					published: true,
					author: {
						id: parent.id
					}
				}
			});
		}
	}
}