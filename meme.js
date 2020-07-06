var fs = global.nodemodule["fs"];
var path = global.nodemodule["path"];
var wait = global.nodemodule["wait-for-stuff"];
var streamBuffers = global.nodemodule["stream-buffers"];
var fetch = global.nodemodule["node-fetch"];
var merge = global.nodemodule["merge-images"];
var waiton =global.nodemodule["wait-on"];
var Jimp = global.nodemodule["jimp"];
var { Canvas, Image } = global.nodemodule["canvas"];

function onLoad(data) {

var onLoadText = "Loaded \"Memer\" by Kaysil";

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

var rootpath = path.resolve(__dirname, "..", "Memer-data");
ensureExists(rootpath);
ensureExists(path.join(rootpath, "sounds"));
ensureExists(path.join(rootpath, "images"));
ensureExists(path.join(rootpath, "temp"));

var nameMapping = {
	"khabanh_oibanoi": path.join(rootpath, "sounds", "khabanh_oibanoi.mp3"),
	"huanrose_colamthimoicoan": path.join(rootpath, "sounds", "huanrose_colamthimoicoan.mp3"),
	"duckbatman_trietlycuocsong": path.join(rootpath, "sounds", "duckbatman_trietlycuocsong.mp3"),
	"duckbatman_oibanoi": path.join(rootpath, "sounds", "duckbatman_oibanoi.mp3"),
	"slap_template": path.join(rootpath, "images", "slap_template.jpg")
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

var langMap = {
	"vi_VN": {
		"wrongCommand": "Sai cú pháp, sử dụng: {0}pls sound || neko [hug/kiss] || meme || slap <@mention>",
		"nsfw": "Từ từ nào, đó là bài viết NSFW",
		"meme": "{0}\n\n {1} tại r/{2}"
	},
	"en_US": {
		"wrongCommand": "Wrong command, using: {0}pls sound || neko [hug/kiss] || meme || slap <@mention>",
		"nsfw": "Hold up! That is a NSFW post",
		"meme": "{0}\n\n {1} at r/{2}" 
	}
};

var langAPI = global.plugins.langapi

langAPI.createNewLang("memerLang.json", langMap);

var meme = async function(type, data) {
var args = data.args;
    args.shift();
		if (!args[0]) return { 
			handler: 'internal', 
			data: langAPI
			.getLang("memerLang.json", `FB-${data.msgdata.senderID}`, "wrongCommand", "en_US")
			.replace("{0}", global.config.commandPrefix)
		};

	switch (args[0].toLowerCase()) {
		default:
		return { 
			handler: 'internal', 
			data: langAPI
			.getLang("memerLang.json", `FB-${data.msgdata.senderID}`, "wrongCommand", "en_US")
			.replace("{0}", global.config.commandPrefix)
		};
			break;
		case 'sounds':
		case 'sound':
		case 's':
			try {
		var randomItem = config.sounds[Math.floor(Math.random() * config.sounds.length)];
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
			try {
			var fetchjson = await fetch("http://meme-api.herokuapp.com/gimme");
			var json = await fetchjson.json();
			
			if (json.nsfw === false) {
			var fetchimage = await fetch(json.url);
			var buffer = await fetchimage.buffer();
					var imagesx = new streamBuffers.ReadableStreamBuffer({
							frequency: 10,
							chunkSize: 1024
						});
						imagesx.path = "image.png";
						imagesx.put(buffer);
						imagesx.stop();

						return {
							handler: "internal-raw",
							data: {
								body: langAPI
				.getLang("memerLang.json", `FB-${data.msgdata.senderID}`, "meme", "en_US")
				.replace("{0}", json.title)
				.replace("{1}", json.postLink)
				.replace("{2}", json.subreddit),
								attachment: ([imagesx])
							},
							noDelay: true
						};
			} else {
				return {
					handler: "internal",
					data: langAPI
			.getLang("memerLang.json", `FB-${data.msgdata.senderID}`, "nsfw", "en_US")
			}
		}
			} catch (err) {
			data.log(err)
		}
		break;
			case "neko":
			case "n":
				var nekoType = "";
				args.shift();
				if (!args[0]) nekoType = "neko|neko"; 
				else if (args[0] === "hug") nekoType = "hug|url"; 
				else if (args[0] === "kiss") nekoType = "kiss|url";
				else nekoType = "neko|neko";
				try {
					var fetchjson = await fetch("http://nekos.life/api/" + nekoType.split("|")[0]);
					var json = await fetchjson.json();

					var fetchimage = await fetch(json[nekoType.split("|")[1]]);
					var buffer = await fetchimage.buffer();
							var imagesx = new streamBuffers.ReadableStreamBuffer({
									frequency: 10,
									chunkSize: 1024
								});
								imagesx.path = "image.png";
								imagesx.put(buffer);
								imagesx.stop();
		
								return {
									handler: "internal-raw",
									data: {
										body: ``,
										attachment: ([imagesx])
									},
									noDelay: true
								}
					} catch (err) {
					data.log(err)
				}
		break;
			case "slap":
				slap(type, data)
		break;
	}
}

function sO(object) {
    return Object.keys(object).length;
}

var slap = function (type, datas) {

    var sender = datas.msgdata.senderID;
    var mentions = datas.mentions;
	var UserAvatar = "UserAvatar_" + Date.now() + ".jpg";
	var UserAvatar1 = "UserAvatar1_" + Date.now() + ".jpg";
	var succ = "Success_" + Date.now() + ".jpg";
	
    if (sO(mentions) == 1) {
        Jimp.read("https://graph.facebook.com/" + sender + "/picture?height=720&width=720").then(img => {
            img.resize(180, 180);
            img.write(path.join(rootpath, "temp", UserAvatar));
        }).catch(err => {
            datas.log(err);
        });
        Jimp.read("https://graph.facebook.com/" + Object.keys(mentions)[0].slice(3) + "/picture?height=720&width=720").then(img => {
            img.resize(180, 180);
            img.write(path.join(rootpath, "temp", UserAvatar1));
        }).catch(err => {
            datas.log(err);
        });
        waiton({
            resources: [
				path.join(rootpath, "temp", UserAvatar),
				path.join(rootpath, "temp", UserAvatar1)
						],
            timeout: 5000
        }).then(function () {
            merge(
				[
				{
					src: path.join(rootpath, "images", "slap_template.jpg")
				},
                {
                    src: path.join(rootpath, "temp", UserAvatar),
                    x: 370,
                    y: 60
                },
                {
                    src: path.join(rootpath, "temp", UserAvatar1),
                    x: 145,
                    y: 145
                }
				], {
                Canvas: Canvas,
                Image: Image
				   }
				).then(function (res) {
					
                fs.writeFile(
					path.join(rootpath, "temp", succ), 
					res.replace(/^data:image\/png;base64,/, ""), 
					'base64', 
					function (err) {
						
                    if (err) datas.log(err);
					
                        var img = fs.createReadStream(path.join(rootpath, "temp", succ));
						
                        datas.return({
                            handler: "internal-raw",
                            data: {
                                body: "",
                                attachment: ([img])
                            }
                        });
						img.on("close", () => {
						try {
                        fs.unlinkSync(path.join(rootpath, "temp", UserAvatar));
                        fs.unlinkSync(path.join(rootpath, "temp", UserAvatar1));
                        fs.unlinkSync(path.join(rootpath, "temp", succ));
						} catch (err) {}
						})
                });
            }).catch(err => {
                datas.log(err);
            });
        }).catch(err => {
                datas.log(err);
            });
    } else {
        return {
            handler: 'internal',
            data: 'Sử dụng: /slap <mention>'
        }
    }
}

module.exports = {
    memeFunc: meme,
    onLoad
};
