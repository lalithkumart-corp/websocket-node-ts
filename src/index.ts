import { createServer } from 'http';
import { parse } from 'url';
import { WebSocketServer } from 'ws';

const server = createServer();
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

wss1.on('connection', function connection(ws) {
    ws.on('message', function message(data: any) {
        console.log('received1: %s', data);
    });
    setInterval(() => {
        prepareAndSendPackets(ws);
    }, 5000);
});

wss2.on('connection', function connection(ws) {
    ws.on('message', function message(data: any) {
        console.log('received2: %s', data);
    });
    setInterval(() => {
        prepareAndSendPackets(ws);
    }, 5000);
});

server.on('upgrade', function upgrade(request: any, socket, head) {
    const { pathname } = parse(request.url);
    if (pathname === '/rr') {
        wss1.handleUpgrade(request, socket, head, function done(ws) {
        wss1.emit('connection', ws, request);
        });
    } else if (pathname === '/fo') {
        wss2.handleUpgrade(request, socket, head, function done(ws) {
        wss2.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(3001);

const prepareAndSendPackets = (ws: any) => {
    let bucket = [];
    for(let i=0; i<1000; i++) {
      bucket.push({
        range: '1m',
        expDate: new Date().toDateString(),
        atm: 7.10,
        rr25: -0.2,
        rr10: -0.2,
        br25: -0.2,
        bf10: -0.2,
      });
    }
    ws.send(JSON.stringify(bucket));
}
