var fs = global.nodemodule["fs"];
var path = global.nodemodule["path"];
var wait = global.nodemodule["wait-for-stuff"];
var streamBuffers = global.nodemodule["stream-buffers"];
var request = global.nodemodule['request'];
var jimp = global.nodemodule['jimp'];
var { Canvas, Image } = global.nodemodule['canvas'];
var mergeImg = global.nodemodule['merge-images'];

function sizeObject(object) {
  return Object.keys(object).length;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
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
var memer = function(type, data){
var args = data.args;
    args.shift();
	if (!args[0]) return{ handler: 'internal', data: '?' }
	switch (args[0].toLowerCase()) {
		case 'sounds', 's':
		var soundOnes = fs.createReadStream(path.join(rootpath, "sounds", "khabanh_oibanoi.mp3"));
		var soundTwos = fs.createReadStream(path.join(rootpath, "sounds", "duckbatman_oibanoi.mp3"));
		var soundThrees = fs.createReadStream(path.join(rootpath, "sounds", "huanrose_colamthimoicoan.mp3"));
		var soundFours = fs.createReadStream(path.join(rootpath, "sounds", "duckbatman_trietlycuocsong.mp3"));
		var randomSounds = getRandomInt(5);
		if (randomSounds == '0') {
			return {
				handler: 'internal-raw',
				data: {
					attachment: [soundTwos],
					body: ""
				}
			}
		}
		if (randomSounds == '1') {
			return {
				handler: 'internal-raw',
				data: {
					attachment: [soundOnes],
					body: ""
				}
			}
		}
		if (randomSounds == '2') {
			return {
				handler: 'internal-raw',
				data: {
					attachment: [soundThrees],
					body: ""
				}
			}
		}
		if (randomSounds == '3') {
			return {
				handler: 'internal-raw',
				data: {
					attachment: [soundFours],
					body: ""
				}
			}
		}
			break;
			case 'slap':
			if (sizeObject(data.mentions) > 0) {
				if (sizeObject(data.mentions) > 2) {
					return { handler: 'internal', data: 'Bạn chỉ có thể tát một người' };
				} else {
				for(var y in data.mentions) {
					var slapTarget = y.slice(3);
					var slapAuthor = data.msgdata.senderID;
				request("https://graph.facebook.com/" + slapTarget + "/picture?height=720&width=720").pipe(fs.createWriteStream(path.join(rootpath, "avatars", "avatar_" + slapTarget) + ".png"));
				request("https://graph.facebook.com/" + slapAuthor + "/picture?height=720&width=720").pipe(fs.createWriteStream(path.join(rootpath, "avatars", "avatar_" + slapAuthor) + ".png"));
				data.log(`[GET AVATAR FOR ${slapAuthor}_${slapTarget} SUCCESSFULLY]`);
				var slapTargetAvatar = path.join(rootpath, "avatars", "avatar_" + slapTarget + ".png");
				var slapAuthorAvatar = path.join(rootpath, "avatars", "avatar_" + slapAuthor + ".png");
				var batmanSlapImg  = path.join(rootpath, "images", "temple_slap.png");
				var savePath  = path.join(rootpath, "images", slapAuthor + "_slapped_"+ slapTarget + ".png");
				
			    mergeImg([
				{ src: batmanSlapImg },
				{ src: slapAuthorAvatar, x: 50, y: 50 },
				{ src: slapTargetAvatar, x: 100, y: 100 }
				], {
					Canvas: Canvas,
					Image: Image
				})
				.then(batmanSlap => {
				batmanSlap.write(savePath); // save
				})
		.catch(err => {
		data.log(err);
		});
				}
			  }
			} else { return { handler: 'internal', data: 'Bạn chưa mention/tag ai để tát cả' } };
			break;
			default:
			return { handler: 'internal', data: 'Ôi bạn ơi bạn chơi đồ nhiều vậy?' }
			break;
			
	}
}
module.exports = {
    memer
};
