var fs = global.nodemodule["fs"];
var path = global.nodemodule["path"];
var wait = global.nodemodule["wait-for-stuff"];
var streamBuffers = global.nodemodule["stream-buffers"];
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
var memer = function(type, data){
var args = data.args;
    args.shift();
	if (!args[0]) return{ handler: 'internal', data: '?' }
	switch (args[0].toLowerCase()) {
		case 'sounds':
		case 's':
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
			default:
			return { handler: 'internal', data: 'Ôi bạn ơi bạn chơi đồ nhiều vậy?' }
			break;
			
	}
}
module.exports = {
    memer
};
