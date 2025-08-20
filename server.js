const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

// Estrutura: { codigoSala: [ws1, ws2] }
const salas = {};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      ws.send(JSON.stringify({ tipo: 'erro', msg: 'Mensagem inválida' }));
      return;
    }
    if (data.tipo === 'entrar') {
      // data.codigoSala
      if (!salas[data.codigoSala]) salas[data.codigoSala] = [];
      if (salas[data.codigoSala].length >= 2) {
        ws.send(JSON.stringify({ tipo: 'erro', msg: 'Sala cheia' }));
        return;
      }
      salas[data.codigoSala].push(ws);
      ws.codigoSala = data.codigoSala;
      ws.send(JSON.stringify({ tipo: 'ok', msg: 'Entrou na sala ' + data.codigoSala }));
      // Notifica se ambos conectados
      if (salas[data.codigoSala].length === 2) {
        salas[data.codigoSala].forEach(w => w.send(JSON.stringify({ tipo: 'pronto' })));
      }
    } else if (data.tipo === 'jogada') {
      // data.jogada
      const sala = salas[ws.codigoSala];
      if (sala) {
        sala.forEach(w => {
          if (w !== ws) w.send(JSON.stringify({ tipo: 'jogada', jogada: data.jogada }));
        });
      }
    }
  });
  ws.on('close', function() {
    if (ws.codigoSala && salas[ws.codigoSala]) {
      salas[ws.codigoSala] = salas[ws.codigoSala].filter(w => w !== ws);
      if (salas[ws.codigoSala].length === 0) delete salas[ws.codigoSala];
    }
  });
});

console.log('Servidor WebSocket rodando na porta 3000');