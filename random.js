var fs = global.nodemodule["fs"];
var path = global.nodemodule["path"];
var wait = global.nodemodule["wait-for-stuff"];
var streamBuffers = global.nodemodule["stream-buffers"];

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

var rootpath = path.resolve(__dirname, "..", "Random");
ensureExists(rootpath);
ensureExists(path.join(rootpath, "images"));
ensureExists(path.join(rootpath, "sounds"));

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
               "filepath": "khabanh_oibanoi.mp3",
               "message": "Sức đề kháng yếu à? Nghe lời tư vấn của bác sĩ Bảnh"
          },
          "2": {
               "filepath": "huanrose_colamthimoicoan.mp3",
               "message": ""
          },
          "3": {
               "filepath": "duckbatman_oibanoi.mp3",
               "message": ""
          },
          "4": {
               "filepath": "duckbatman_trietlycuocsong.mp3",
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
          "noSubCommand": "Ôi bạn ơi bạn chơi nhiều đồ vậy",
          "wrongSubCommand": "Ôi bạn ơi bạn chơi nhiều đồ vậy"
     },
     "help": {
          "1": "Config like 'name': [filepath: 'path.mp3', message: 'lmao'] you can leave blank for no message",
		  "2": "you must put file to 'sounds' folder"
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
		case 's':
		var random = config.sounds[Object.keys(config.sounds)[Math.floor(Math.random()*Object.keys(config.sounds).length)]];
		var randomSounds = fs.createReadStream(path.join(rootpath, "sounds", random.filepath));
		return data.return({
			handler: `internal-raw`,
			data: {
				body: random.message,
				attachment: randomSounds
			}
		})
			break;
		case 'images':
		case 'i':
		var random = config.images[Object.keys(config.images)[Math.floor(Math.random()*Object.keys(config.images).length)]];
		var randomImages = fs.createReadStream(path.join(rootpath, "images", random.filepath));
		return data.return({
			handler: `internal-raw`,
			data: {
				body: random.message,
				attachment: randomImages
			}
		})
			break;
		case 'videos':
		case 'v':
		var random = config.videos[Object.keys(config.videos)[Math.floor(Math.random()*Object.keys(config.videos).length)]];
		var randomVideos = fs.createReadStream(path.join(rootpath, "videos", random.filepath));
		return data.return({
			handler: `internal-raw`,
			data: {
				body: random.message,
				attachment: randomVideos
			}
		})
			break;
			
	}
}
module.exports = {
    random: randomFunc
};
