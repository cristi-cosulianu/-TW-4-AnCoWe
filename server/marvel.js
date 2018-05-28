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
		    case 'get-anime-icon':
		        return getIconAnime(params['id']);
		        break;
		    case 'get-anime-characters':
		        return getAnimeCharacters();
		        break;
		}
		
		return { code: 200, message: 'ok' };
	}
};

getIconStory = function(heroname) {
  
  var url = "https://gateway.marvel.com/v1/public/characters?apikey=15b0df9dd78ed4c3d58e10b0c3d36a57&hash=758e48b905e396fca02324d24f1f7b06&ts=432&name=" + heroname;
  
  var res = request('GET', url);
  
  var thumbnail = JSON.parse(res.getBody()).data.results[0].thumbnail;
  var imgUrl = thumbnail.path + '/portrait_xlarge.' + thumbnail.extension;
  var story = JSON.parse(res.getBody()).data.results[0].description;
  var img_story = {};
  img_story['imgUrl'] = imgUrl;
  img_story['story'] = story;	



	return { code: 200, message: img_story };
};
// getStory = function(heroname) {
  
//   var url = "https://gateway.marvel.com/v1/public/characters?apikey=15b0df9dd78ed4c3d58e10b0c3d36a57&hash=758e48b905e396fca02324d24f1f7b06&ts=432&name=" + heroname;
  
//   var res = request('GET', url);
  
//   var story = JSON.parse(res.getBody()).data.results[0].description;
//   //var story = thumbnail.path + '/portrait_xlarge.' + thumbnail.extension;

// 	return { code: 200, message: story };
// };


getIconStoryAnime = function (id) {
    var url = "https://api.jikan.moe/character/" + id + "/pictures";
    var res = request('GET',url);
    var imgUrl = JSON.parse(res.getBody()).image_url;
    var story = JSON.parse(res.getBody()).about;
    //var img_story = imgUrl.merge(story);
    var img_story = {};
	img_story['imgUrl'] = imgUrl;
	img_story['story'] = story;
    return { code: 200, message: img_story };

}
// getStoryAnime = function (id) {
//     var url = "https://api.jikan.moe/character/" + id + "/pictures";
//     var res = request('GET',url);
//     var story = JSON.parse(res.getBody()).about;
//     return { code: 200, message: story };

// }
getAnimeCharacters = function () {
    var characters = "[\r\n  {\r\n    \"image_url\": \"https:\\\/\\\/myanimelist.cdn-dena.com\\\/r\\\/46x64\\\/images\\\/characters\\\/9\\\/69275.jpg?s=1e1ccda911e91eac0afa621fcffc2621\",\r\n    \"mal_id\": 145,\r\n    \"url\": \"https:\\\/\\\/myanimelist.net\\\/character\\\/145\\\/Sakura_Haruno\",\r\n    \"name\": \"Haruno, Sakura\"\r\n  },\r\n  {\r\n    \"image_url\": \"https:\\\/\\\/myanimelist.cdn-dena.com\\\/r\\\/46x64\\\/images\\\/characters\\\/9\\\/69275.jpg?s=1e1ccda911e91eac0afa621fcffc2621\",\r\n    \"mal_id\": 145,\r\n    \"url\": \"https:\\\/\\\/myanimelist.net\\\/character\\\/145\\\/Sakura_Haruno\",\r\n    \"name\": \"Haruno, Sakura\"\r\n  }\r\n]";

    return { code: 200, message: characters };
}


