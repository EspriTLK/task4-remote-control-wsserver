import WebSocket, { WebSocketServer, createWebSocketStream } from 'ws';

const wss = new WebSocketServer({
	port: 8080
})
const ws = new WebSocket('ws://localhost:8080');

const duplex = createWebSocketStream(ws, { encoding: 'utf8' });
duplex.onmessage = ({data}) => console.log(data)
duplex.write('ololo')
duplex.pipe(process.stdout)
process.stdin.pipe(duplex);

console.log('start ws stream')