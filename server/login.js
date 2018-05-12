
module.exports = {
	processRequest: function(params) {
		if(params['username'] === undefined || params['password'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
        }
        
        console.log("Login parameter: ");
        console.log(params);
		
		return { code: 200, message: 'ok' };
	}
};