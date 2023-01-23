import WebSocket, {WebSocketServer} from 'ws';
import { mouse, left, right, up, down, screen } from '@nut-tree/nut-js';

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({
	port: PORT
})

wss.on("connection", (connection) => {
	console.log(`connection ok`)

	connection.on('message', async (rawMessage) => {
		const fronMessage = rawMessage.toString()
		console.log(`received message: ${rawMessage}`)
		const [command, ...coord] = rawMessage.toString().split(' ')
		const [commandType, commandDst] = command.split('_')
		
		if(command !== 'mouse_position' && coord.length !== 0){
			connection.send(`${command}_${coord}`)
		}
		switch(commandType) {
			case 'prnt':
				connection.send(`${command}`)
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
						console.log(`send command ${commandType} ${commandDst} with size ${coord}`)
						break
					case 'rectangle':
						console.log(`send command ${commandType} ${commandDst} with size x: ${coord[0]} y: ${coord[1]}`)
						break
					case 'circle':
						console.log(`send command ${commandType} ${commandDst} with radius ${coord}`)
				}
		}
	})

	connection.on('close', () => {
		console.log(`connection closed`)
	})

	process.on('SIGINT', () => {
		connection.close(1000, 'user close connection')
		console.log(`connection closed normally`)
		process.exit(0)
	})
})

console.log(`WebSocket server started on port ${PORT}`)