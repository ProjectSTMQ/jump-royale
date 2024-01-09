const assert = require('assert');
const io = require('socket.io-client');
const port = 5000;

describe('Server', () => {
  it('test 5 simultaneous connections', (done) => {
    const clients = Array(5).fill().map(() => io(`http://localhost:${port}`));

    let connectedCount = 0;
    clients.forEach(client => {
      client.on('connect', () => {
        connectedCount++;
        if (connectedCount === clients.length) {
          clients.forEach(client => client.disconnect());
          done();
        }
      });
    });
  });
});