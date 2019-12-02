const path = require('path')

exports.maps = {
	zeus: {
		seed: "",
		size: 3200,
		url: "http://map.minecraft-galaxy.ru/layer/28/127/0/"
	}
}

exports.originalMaps = path.join(__dirname, 'maps', 'original')
exports.slimeMaps    = path.join(__dirname, 'maps', 'slime')
