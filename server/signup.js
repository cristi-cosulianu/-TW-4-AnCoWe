
	/*
	*	EUGEN FILE 
 	*/

module.exports = {
	processRequest: function(params) {
		if(params['username'] === undefined || params['password'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
        }

		return { code: 200, message: 'ok' };
	}
};