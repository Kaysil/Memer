var fs = global.nodemodule["fs"];
var path = global.nodemodule["path"];
var wait = global.nodemodule["wait-for-stuff"];
var streamBuffers = global.nodemodule["stream-buffers"];
var request = global.nodemodule["request"];
var fetch = global.nodemodule["node-fetch"];

function onLoad(data) {

var onLoadText = "\n\n";
onLoadText += "██████╗░░█████╗░███╗░░██╗██████╗░░█████╗░███╗░░░███╗\n";
onLoadText += "██╔══██╗██╔══██╗████╗░██║██╔══██╗██╔══██╗████╗░████║\n";
onLoadText += "██████╔╝███████║██╔██╗██║██║░░██║██║░░██║██╔████╔██║\n";
onLoadText += "██╔══██╗██╔══██║██║╚████║██║░░██║██║░░██║██║╚██╔╝██║\n";
onLoadText += "██║░░██║██║░░██║██║░╚███║██████╔╝╚█████╔╝██║░╚═╝░██║\n";
onLoadText += "╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░░╚════╝░╚═╝░░░░░╚═╝\n";
onLoadText += "\n";
onLoadText += "Enable Random by Kaysil\n"

data.log(onLoadText);

}

function ensureExists(path, mask) {
  if (typeof mask != 'number') {
    mask = 0o777;
  }
  try {
    fs.mkdirSync(path, {
      mode: mask,
      recursive: true
    });
    return undefined;
  } catch (ex) {
    return { err: ex };
  }
}

var rootpath = path.resolve(__dirname, "..", "Random-folder");
ensureExists(rootpath);
ensureExists(path.join(rootpath, "images"));
ensureExists(path.join(rootpath, "sounds"));
ensureExists(path.join(rootpath, "videos"));

var nameMapping = {
	"khabanh_oibanoi": path.join(rootpath, "sounds", "khabanh_oibanoi.mp3"),
	"huanrose_colamthimoicoan": path.join(rootpath, "sounds", "huanrose_colamthimoicoan.mp3"),
	"duckbatman_trietlycuocsong": path.join(rootpath, "sounds", "duckbatman_trietlycuocsong.mp3"),
	"duckbatman_oibanoi": path.join(rootpath, "sounds", "duckbatman_oibanoi.mp3")
}

for (var n in nameMapping) {
	if (!fs.existsSync(nameMapping[n])) {
		fs.writeFileSync(nameMapping[n], global.fileMap[n]);
	}
}

var defaultConfig = {
     "sounds": {
          "1": {
               "filepath": "khabanh_oibanoi",
               "message": "Sức đề kháng yếu à? Nghe lời tư vấn của bác sĩ Bảnh"
          },
          "2": {
               "filepath": "huanrose_colamthimoicoan",
               "message": ""
          },
          "3": {
               "filepath": "duckbatman_oibanoi",
               "message": ""
          },
          "4": {
               "filepath": "duckbatman_trietlycuocsong",
               "message": ""
          }
     },
	 "images": {
          "1": {
               "filepath": "",
               "message": ""
          }
	 },
	 "videos": {
          "1": {
               "filepath": "",
               "message": ""
          }
	 },
     "message": {
          "noSubCommand": "?",
          "wrongSubCommand": "Available subcommands: sounds(or s), videos(or v), images(or i)"
	 },
	 "help": {
		 "HELP1": [
			 "Image type must be .jpg",
			 "Sound type must be .mp3",
			 "Video type must be .mp4"
		 ]
	 }
};

if (!fs.existsSync(path.join(rootpath, "config.json"))) {
	fs.writeFileSync(path.join(rootpath, "config.json"), JSON.stringify(defaultConfig, null, 5));
	var config = defaultConfig;
} else {
	var config = JSON.parse(fs.readFileSync(path.join(rootpath, "config.json"), {
		encoding: "utf8"
	}));
}

var randomFunc = function(type, data) {
var args = data.args;
    args.shift();
		if (!args[0]) return{ handler: 'internal', data: config.message.noSubCommand };
	switch (args[0].toLowerCase()) {
		default:
		return { handler: 'internal', data: config.message.wrongSubCommand };
			break;
		case 'sounds':
		case 'sound':
		case 's':
		var random = config.sounds[Object.keys(config.sounds)[Math.floor(Math.random()*Object.keys(config.sounds).length)]];
		var randomSounds = fs.createReadStream(path.join(rootpath, "sounds", random.filepath+".mp3"));
		return data.return({
			handler: `internal-raw`,
			data: {
				body: random.message,
				attachment: randomSounds
			}
		})
			break;
		case 'images':
		case 'image':
		case 'i':
		var random = config.images[Object.keys(config.images)[Math.floor(Math.random()*Object.keys(config.images).length)]];
		var randomImages = fs.createReadStream(path.join(rootpath, "images", random.filepath+".jpg"));
		return data.return({
			handler: `internal-raw`,
			data: {
				body: random.message,
				attachment: randomImages
			}
		})
			break;
		case 'videos':
		case 'video':
		case 'v':
		var random = config.videos[Object.keys(config.videos)[Math.floor(Math.random()*Object.keys(config.videos).length)]];
		var randomVideos = fs.createReadStream(path.join(rootpath, "videos", random.filepath+".mp4"));
		return data.return({
			handler: `internal-raw`,
			data: {
				body: random.message,
				attachment: randomVideos
			}
		})
			break;
		case 'memes':
		case 'meme':
		case 'm':
			args.shift();
		if(!args[0]) {
			fetch("https://meme-api.herokuapp.com/gimme")
			.then(res => res.json())
			.then(json => {
				var img = global.nodemodule['sync-request']("GET", json.url).body;
					fs.writeFileSync(path.join(rootpath, data.msgdata.messageID + ".jpg"), img);
				var stream = fs.createReadStream(path.join(rootpath, data.msgdata.messageID + ".jpg"));
				data.log(json);
				var obj = {
						body: `Title: ${json.title}\nPostlink: ${json.postLink}\nSubreddit: https://reddit.com/r/${json.subreddit}`,
						attachment: ([stream])
					};
				return data.facebookapi.sendMessage(obj, data.msgdata.threadID, data.msgdata.messageID);
			})
		} /*else {
			fetch("https://meme-api.herokuapp.com/gimme/"+encodeURIComponent(args.join(" ")))
		.then(res => res.json())
		.then(json => {
			var img = global.nodemodule['sync-request']("GET", json.url).body;
			data.log(img);
				fs.writeFileSync(path.join(rootpath, data.msgdata.messageID + ".jpg"), img);
			var stream = fs.createReadStream(path.join(rootpath, data.msgdata.messageID + ".jpg"));
			data.log(json);
			var obj = {
				body: `Title: ${json.title}\nPostlink: ${json.postLink}\nSubreddit: https://reddit.com/r/${json.subreddit}`,
				attachment: ([stream])
			};
			return data.facebookapi.sendMessage(obj, data.msgdata.threadID, data.msgdata.messageID);
		})
		}*/
	}
}
module.exports = {
    random: randomFunc,
    onLoad
};
