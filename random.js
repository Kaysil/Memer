var fs = global.nodemodule["fs"];
var path = global.nodemodule["path"];
var wait = global.nodemodule["wait-for-stuff"];
var streamBuffers = global.nodemodule["stream-buffers"];
var request = global.nodemodule["request"];
var fetch = global.nodemodule["node-fetch"];

function onLoad(data) {

var onLoadText = "";
onLoadText += "██████╗░░█████╗░███╗░░██╗██████╗░░█████╗░███╗░░░███╗\n\n\n";
onLoadText += "██╔══██╗██╔══██╗████╗░██║██╔══██╗██╔══██╗████╗░████║\n";
onLoadText += "██████╔╝███████║██╔██╗██║██║░░██║██║░░██║██╔████╔██║\n";
onLoadText += "██╔══██╗██╔══██║██║╚████║██║░░██║██║░░██║██║╚██╔╝██║\n";
onLoadText += "██║░░██║██║░░██║██║░╚███║██████╔╝╚█████╔╝██║░╚═╝░██║\n";
onLoadText += "╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░░╚════╝░╚═╝░░░░░╚═╝\n\n";
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
     "sounds": [
          {
               "filepath": "khabanh_oibanoi",
               "message": "Sức đề kháng yếu à? Nghe lời tư vấn của bác sĩ Bảnh"
          },
          {
               "filepath": "huanrose_colamthimoicoan",
               "message": ""
          },
          {
               "filepath": "duckbatman_oibanoi",
               "message": ""
          },
          {
               "filepath": "duckbatman_trietlycuocsong",
               "message": ""
		  }
		]
};

if (!fs.existsSync(path.join(rootpath, "config.json"))) {
	fs.writeFileSync(path.join(rootpath, "config.json"), JSON.stringify(defaultConfig, null, 5));
	var config = defaultConfig;
} else {
	var config = JSON.parse(fs.readFileSync(path.join(rootpath, "config.json"), {
		encoding: "utf8"
	}));
}

var randomFunc = async function(type, data) {
var args = data.args;
    args.shift();
		if (!args[0]) return { handler: 'internal', data: config.message.noSubCommand };

	switch (args[0].toLowerCase()) {
		//default:
		//return { handler: 'internal', data: config.message.wrongSubCommand };
		//	break;
		case 'sounds':
		case 'sound':
		case 's':
			try {
		var randomItem = config.sounds[Math.floor(Math.random() * items.length)];
		var randomSounds = fs.createReadStream(path.join(rootpath, "sounds", randomItem.filepath+".mp3"));
		return data.return({
			handler: `internal-raw`,
			data: {
				body: randomItem.message,
				attachment: randomSounds
			}
		})
	} catch (err) {
		data.log(err)
	}
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
						body: `- Title: ${json.title}\nLink: ${json.postLink}\nSubreddit: https://reddit.com/r/${json.subreddit}`,
						attachment: ([stream])
					};
				return {
					handler: "internal-raw",
					data: obj
				}
			})
		}
	}
}
module.exports = {
    random: randomFunc,
    onLoad
};
