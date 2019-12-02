const { PNG }   = require('pngjs')
const request   = require('request')
const fs        = require('fs')
const minimist  = require('minimist')
const path      = require('path')
const { spawn } = require('child_process')
const config    = require('./config')

const CHUNK_SIZE = 400

const ARGS = minimist(process.argv.slice(2))
const map  = ARGS.map

if (!config.maps[map]) {
	throw new Error(`Карты ${ map } не найдено!`)
}


/*
	скачивание карты
*/
function downloadMap() {
	return new Promise((resolve, reject) => {
		const _map = config.maps[map]
		const {
			size,
			url
		} = _map

		const minMapValue = -size
		const maxMapValue =  size

		const maxMapSize = size * 2 + CHUNK_SIZE
		const iterations = Math.pow(maxMapSize / CHUNK_SIZE, 2)

		const destPath = path.join( config.originalMaps, `${ map }.png` )
		const dest = new PNG({
			width:  maxMapSize,
			height: maxMapSize
		})

		let iter = 0

		function getCoords(x, y) {
			y += CHUNK_SIZE

			if (y > maxMapValue) {
				y  = minMapValue
				x -= CHUNK_SIZE
			}

			return { x, y }
		}

		function build(i = maxMapValue, j = minMapValue) {
			console.info(`${ iter + 1 } / ${ iterations }`)

			request(`${ url }${ j }/${ i }/map.png`)
				.pipe(new PNG())
				.on('parsed', function(){
					const xOffset = Math.abs(i - size)
					const yOffset = Math.abs(j + size)

					this.bitblt(dest, 0, 0, CHUNK_SIZE, CHUNK_SIZE, xOffset, yOffset)

					iter = iter + 1

					if (iter < iterations) {
						const { x, y } = getCoords(i, j)
						
						setTimeout(() => build(x, y), 500)
					}

					else {
						const ws = fs.createWriteStream(destPath)
						ws.on('close', resolve)

						dest
							.pack()
							.pipe(ws)
					}
				})
		}

		build()
	})
}

/*
	вычисление чанков
*/
function buildChunks() {
	function execCommand(command, args) {
		return new Promise((resolve, reject) => {
			let handle = spawn(command, args)
			let result = ''
			let error  = ''

			handle.on('error', reject)
			handle.on('close', () => {
				if (error) {
					reject(error)
				}

				resolve(result)
			})

			handle.stdout.on('data', data => result += data)
			handle.stderr.on('data', data => error  += data)
		})
	}

	return new Promise((resolve, reject) => {
		const _map = config.maps[map]
		const {
			seed,
			size
		} = _map

		if (!seed) {
			throw new Error('seed не задан')
		}

		const mapSize = size * 2 + CHUNK_SIZE - 16
		const srcPath = path.join( config.originalMaps, `${ map }.png` )

		fs.createReadStream(srcPath)
			.pipe(new PNG({ filterType: 4 }))
			.on('parsed', async function(){
				const self = this
				let startTime = Date.now()

				console.info('Вычисление чанков')
				const json = await execCommand('java', [
					'GetRandom',
					seed,
					mapSize,
					mapSize
				])
				console.info(`Вычисление чанков завершено: ${ (Date.now() - startTime) / 1000 } секунд`)

				startTime = Date.now()
				console.info('Парсинг чанков')
				const data = JSON.parse(json)
				console.info(`Парсинг чанков завершено: ${ (Date.now() - startTime) / 1000 } секунд`)

				startTime = Date.now()
				console.info('Отрисока чанков на карте')

				let i = 8
				let j = 8

				data.forEach((item, index) => {
					item.forEach((_item, _index) => {
						if (_index == 0) {
							return
						}

						if (_item === true) {
							for (let x = i; x < i + 15; x++) {
								for (let y = j; y < j + 15; y++) {
									let idx = (self.width * x + y) << 2

									self.data[idx]     = 0
									self.data[idx + 1] = 255
									self.data[idx + 2] = 0
									self.data[idx + 3] = self.data[idx + 3]
								}
							}
						}

						j = j + 16
					})

					i = i + 16
					j = 8
				})

				console.info(`Отрисока чанков на карте завершено: ${ (Date.now() - startTime) / 1000 } секунд`)
				
				const destPath = path.join( config.slimeMaps, `${ map }.png` )
				const ws = fs.createWriteStream( destPath )

				ws.on('close', () => {
					console.info(`Сборка карты завершено: ${ (Date.now() - startTime) / 1000 } секунд`)
					resolve()
				})

				startTime = Date.now()
				console.info(`Сборка карты`)
				self
					.pack()
					.pipe(ws)
			})
	})
}


;(async () => {
	let startTime = Date.now()

	console.info('Скачивание карты')
	// await downloadMap()
	console.info(`Скачивание карты завершено: ${ (Date.now() - startTime) / 1000 } секунд`)

	await buildChunks()
})()