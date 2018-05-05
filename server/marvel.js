const request = require('sync-request');

module.exports = {
	processRequest: function(params) {
		if(params['action'] === undefined || params['heroname'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
		}
		
		switch(params['action']) {
			case 'get-icon':
				return getIcon(params['heroname']);
				break;
		}
		
		return { code: 200, message: 'ok' };
	}
};

getIcon = function(heroname) {
  
  var url = "https://gateway.marvel.com/v1/public/characters?apikey=15b0df9dd78ed4c3d58e10b0c3d36a57&hash=758e48b905e396fca02324d24f1f7b06&ts=432&name=" + heroname;
  
  var res = request('GET', url);
  
  var thumbnail = JSON.parse(res.getBody()).data.results[0].thumbnail;
  var imgUrl = thumbnail.path + '/portrait_xlarge.' + thumbnail.extension;

	return { code: 200, message: imgUrl };
};