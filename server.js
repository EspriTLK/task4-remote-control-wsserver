import WebSocket, {WebSocketServer} from 'ws';
import { mouse, left, right, up, down } from '@nut-tree/nut-js';

const wss = new WebSocketServer({
	port: 8080
})

wss.on("connection", (connection) => {
	console.log(`connection ok`)

	connection.on('message', async (rawMessage) => {
		console.log(`received message: ${rawMessage}`)
		const [command, ...coord] = rawMessage.toString().split(' ')
		const [commandType, commandDst] = command.split('_')
		const fronMessage = rawMessage.toString()
		
		if(command !== 'mouse_position'){
			connection.send(fronMessage)
		}
		switch(commandType) {
			case 'prnt':
				console.log('send command prnt_scrn')
				break
			case 'mouse':
				switch(commandDst){
					case 'position':
						const currentMousePosition = await mouse.getPosition()
						console.log(`current mouse position ${currentMousePosition}`)
						connection.send(`mouse_position ${currentMousePosition.x},${currentMousePosition.y}`)
						break;
					case 'up':
						mouse.move(up(+coord))
						break
					case 'down':
						mouse.move(down(+coord))
						break
					case 'left':
						mouse.move(left(+coord))
						break
					case 'right':
						mouse.move(right(+coord))
						break
					case 'default':
						console.log(`send command mouse ${commandDst} ofset: ${coord}`)
						break
				}
				break
			case 'draw':
				switch(commandDst) {
					case 'square':
						console.log(`send command square with size ${coord}`)
						break
					case 'rectangle':
						console.log(`send command rectangle with size x: ${coord[0]} y: ${coord[1]}`)
						break
					case 'circle':
						console.log(`send command circle with radius ${coord}`)
				}
		}
	})

	connection.on('close', () => {
		console.log(`connection closed`)
	})
})

console.log('ws started')