var fs = global.nodemodule["fs"];
var path = global.nodemodule["path"];
var wait = global.nodemodule["wait-for-stuff"];
var streamBuffers = global.nodemodule["stream-buffers"];
var request = global.nodemodule['request'];
var jimp = global.nodemodule['jimp'];

function sizeObject(object) {
  return Object.keys(object).length;
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

var rootpath = path.resolve(__dirname, "..", "Memer-files");
ensureExists(rootpath);
ensureExists(path.join(rootpath, "images"));
ensureExists(path.join(rootpath, "sounds"));
ensureExists(path.join(rootpath, "avatars"));

var nameMapping = {
	"khabanh_oibanoi": path.join(rootpath, "sounds", "khabanh_oibanoi.mp3"),
	"huanrose_colamthimoicoan": path.join(rootpath, "sounds", "huanrose_colamthimoicoan.mp3"),
	"duckbatman_trietlycuocsong": path.join(rootpath, "sounds", "duckbatman_trietlycuocsong.mp3"),
	"duckbatman_oibanoi": path.join(rootpath, "sounds", "duckbatman_oibanoi.mp3"),
	"temple_slap": path.join(rootpath, "images", "temple_slap.png")
}

for (var n in nameMapping) {
	if (!fs.existsSync(nameMapping[n])) {
		fs.writeFileSync(nameMapping[n], global.fileMap[n]);
	}
}

var defaultConfig = {
     "sounds": {
          "khabanh_oibanoi": {
               "filepath": "khabanh_oibanoi.mp3",
               "message": "Sức đề kháng yếu à? Nghe lời tư vấn của bác sĩ Bảnh"
          },
          "huanrose_colamthimoicoan": {
               "filepath": "huanrose_colamthimoicoan.mp3",
               "message": ""
          },
          "duckbatman_oibanoi": {
               "filepath": "duckbatman_oibanoi.mp3",
               "message": ""
          },
          "duckbatman_trietlycuocsong": {
               "filepath": "duckbatman_trietlycuocsong.mp3",
               "message": ""
          }
     },
     "message": {
          "noSubCommand": "Ôi bạn ơi bạn chơi nhiều đồ vậy",
          "wrongSubCommand": "Ôi bạn ơi bạn chơi nhiều đồ vậy"
     },
     "help": {
          "1": "Config like 'name': [filepath: 'path.mp3', message: 'lmao'] you can leave blank for no message"
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

var memer = function(type, data) {
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
		data.log(random);
		return data.return({
			handler: `internal-raw`,
			data: {
				body: random.message,
				attachment: randomSounds
			}
		})
			break;
			
	}
}
module.exports = {
    memer
};
