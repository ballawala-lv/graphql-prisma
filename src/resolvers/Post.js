export default {
	author(parent, args, ctx, info) {
		return ctx.db.users.find((user) => {
			return user.id === parent.author
		})
	}
}