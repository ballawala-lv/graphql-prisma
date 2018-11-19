import jwt from 'jsonwebtoken'

export default (request, requireAuth = true) => {
	// when using subscriptions it uses websockets so have to get Authorization from connection.context
	const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization;
	if (header) {
		const token = header.replace('Bearer ', '');
		const decoded = jwt.verify(token, 'this is a secret');
		return decoded.userId;
	}
	if(requireAuth) {
		throw new Error('Authorization Required');
	}
	return null;
};