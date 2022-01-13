import { WebSocketServer } from 'ws';

// const wss = new WebSocketServer({ port: 3001 });
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

wss1.on('connection', function connection(ws: any) {
  ws.on('message', function message(data: any) {
    console.log('received: %s', data);
  });
  setInterval(() => {
    prepareAndSendPackets(ws);
  }, 1000);
});

wss2.on('connection', function connection(ws: any) {
  ws.on('message', function message(data: any) {
    console.log('received: %s', data);
  });
  setInterval(() => {
    prepareAndSendPackets(ws);
  }, 1000);
});
console.log('Socket is setup - Waiting from connection from client');

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
