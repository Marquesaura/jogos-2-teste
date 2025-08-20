const pecasUnicode = {
    'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟',
    'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙','':'',
};
const inicial = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];
let tabuleiro = [];
let selecionada = null;
let turno = 'w'; // 'w' = brancas, 'b' = pretas
let movimentosValidos = [];
let ws = null;
let conectado = false;
let minhaCor = null;
let aguardandoAdversario = true;
let placar = {w: 0, b: 0};

function desenharTabuleiro() {
    const div = document.getElementById('tabuleiro');
    div.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const casa = document.createElement('div');
            casa.className = 'casa ' + ((i+j)%2===0 ? 'clara' : 'escura');
            casa.dataset.i = i;
            casa.dataset.j = j;
            if (selecionada && selecionada[0] === i && selecionada[1] === j) {
                casa.classList.add('selecionada');
            }
            if (movimentosValidos.some(m => m[0] === i && m[1] === j)) {
                casa.classList.add('movimento');
            }
            casa.innerHTML = pecasUnicode[tabuleiro[i][j]];
            casa.onclick = () => clicarCasa(i, j);
            div.appendChild(casa);
        }
        div.appendChild(document.createElement('br'));
    }
}

function reiniciarJogo() {
    tabuleiro = inicial.map(linha => linha.slice());
    selecionada = null;
    turno = 'w';
    movimentosValidos = [];
    atualizarStatus();
    desenharTabuleiro();
}

function atualizarStatus() {
    document.getElementById('status').textContent =
        turno === 'w' ? 'Vez das brancas' : 'Vez das pretas';
}

function corPeca(peca) {
    if (!peca) return '';
    return peca === peca.toUpperCase() ? 'w' : 'b';
}

function dentro(i, j) {
    return i >= 0 && i < 8 && j >= 0 && j < 8;
}

function movimentosPeca(i, j) {
    const peca = tabuleiro[i][j];
    const cor = corPeca(peca);
    let moves = [];
    if (!peca) return moves;
    if (peca.toLowerCase() === 'p') {
        // Peão
        let dir = cor === 'w' ? -1 : 1;
        let startRow = cor === 'w' ? 6 : 1;
        // Avanço simples
        if (dentro(i+dir, j) && tabuleiro[i+dir][j] === '') {
            moves.push([i+dir, j]);
            // Avanço duplo
            if (i === startRow && tabuleiro[i+2*dir][j] === '') {
                moves.push([i+2*dir, j]);
            }
        }
        // Captura diagonal
        for (let dj of [-1,1]) {
            if (dentro(i+dir, j+dj) && tabuleiro[i+dir][j+dj] !== '' && corPeca(tabuleiro[i+dir][j+dj]) !== cor) {
                moves.push([i+dir, j+dj]);
            }
        }
    } else if (peca.toLowerCase() === 'n') {
        // Cavalo
        const deltas = [
            [-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]
        ];
        for (const [di, dj] of deltas) {
            const ni = i+di, nj = j+dj;
            if (dentro(ni, nj) && (tabuleiro[ni][nj] === '' || corPeca(tabuleiro[ni][nj]) !== cor)) {
                moves.push([ni, nj]);
            }
        }
    } else if (peca.toLowerCase() === 'b') {
        // Bispo
        for (const [di, dj] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
            for (let k = 1; k < 8; k++) {
                const ni = i+di*k, nj = j+dj*k;
                if (!dentro(ni, nj)) break;
                if (tabuleiro[ni][nj] === '') {
                    moves.push([ni, nj]);
                } else {
                    if (corPeca(tabuleiro[ni][nj]) !== cor) moves.push([ni, nj]);
                    break;
                }
            }
        }
    } else if (peca.toLowerCase() === 'r') {
        // Torre
        for (const [di, dj] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            for (let k = 1; k < 8; k++) {
                const ni = i+di*k, nj = j+dj*k;
                if (!dentro(ni, nj)) break;
                if (tabuleiro[ni][nj] === '') {
                    moves.push([ni, nj]);
                } else {
                    if (corPeca(tabuleiro[ni][nj]) !== cor) moves.push([ni, nj]);
                    break;
                }
            }
        }
    } else if (peca.toLowerCase() === 'q') {
        // Dama
        for (const [di, dj] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) {
            for (let k = 1; k < 8; k++) {
                const ni = i+di*k, nj = j+dj*k;
                if (!dentro(ni, nj)) break;
                if (tabuleiro[ni][nj] === '') {
                    moves.push([ni, nj]);
                } else {
                    if (corPeca(tabuleiro[ni][nj]) !== cor) moves.push([ni, nj]);
                    break;
                }
            }
        }
    } else if (peca.toLowerCase() === 'k') {
        // Rei
        for (const [di, dj] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) {
            const ni = i+di, nj = j+dj;
            if (dentro(ni, nj) && (tabuleiro[ni][nj] === '' || corPeca(tabuleiro[ni][nj]) !== cor)) {
                moves.push([ni, nj]);
            }
        }
    }
    return moves;
}

function conectarSala() {
    if (ws) ws.close();
    const codigo = document.getElementById('codigoSala').value.trim();
    if (!codigo) {
        document.getElementById('conexaoStatus').textContent = 'Informe o código da sala';
        return;
    }
    ws = new WebSocket('ws://'+window.location.hostname+':3000');
    ws.onopen = () => {
        ws.send(JSON.stringify({ tipo: 'entrar', codigoSala: codigo }));
        document.getElementById('conexaoStatus').textContent = 'Conectando...';
    };
    ws.onmessage = (msg) => {
        let data;
        try { data = JSON.parse(msg.data); } catch { return; }
        if (data.tipo === 'ok') {
            document.getElementById('conexaoStatus').textContent = 'Aguardando adversário...';
            aguardandoAdversario = true;
        } else if (data.tipo === 'pronto') {
            document.getElementById('conexaoStatus').textContent = 'Conectado!';
            aguardandoAdversario = false;
            // Decide cor: primeiro a entrar é branco
            if (minhaCor === null) {
                minhaCor = turno;
            }
        } else if (data.tipo === 'jogada') {
            aplicarJogadaRemota(data.jogada);
        } else if (data.tipo === 'erro') {
            document.getElementById('conexaoStatus').textContent = data.msg;
        }
    };
    ws.onclose = () => {
        document.getElementById('conexaoStatus').textContent = 'Desconectado';
        aguardandoAdversario = true;
        minhaCor = null;
    };
}

function enviarJogada(jogada) {
    if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ tipo: 'jogada', jogada }));
    }
}

function aplicarJogadaRemota(jogada) {
    // jogada: {de:[i,j], para:[i2,j2]}
    const pecaMovida = tabuleiro[jogada.de[0]][jogada.de[1]];
    tabuleiro[jogada.de[0]][jogada.de[1]] = '';
    tabuleiro[jogada.para[0]][jogada.para[1]] = pecaMovida;
    turno = turno === 'w' ? 'b' : 'w';
    selecionada = null;
    movimentosValidos = [];
    atualizarStatus();
    desenharTabuleiro();
}

function clicarCasa(i, j) {
    if (aguardandoAdversario) return;
    if (minhaCor && ((minhaCor === 'w' && turno !== 'w') || (minhaCor === 'b' && turno !== 'b'))) return;
    const peca = tabuleiro[i][j];
    if (selecionada) {
        // Movimento válido
        if (movimentosValidos.some(m => m[0] === i && m[1] === j)) {
            const pecaMovida = tabuleiro[selecionada[0]][selecionada[1]];
            tabuleiro[selecionada[0]][selecionada[1]] = '';
            tabuleiro[i][j] = pecaMovida;
            enviarJogada({ de: [selecionada[0], selecionada[1]], para: [i, j] });
            turno = turno === 'w' ? 'b' : 'w';
            selecionada = null;
            movimentosValidos = [];
            atualizarStatus();
            desenharTabuleiro();
            return;
        }
        // Clicou em outra peça do próprio time: troca seleção
        if ((turno === 'w' && peca === peca.toUpperCase() && peca !== '') || (turno === 'b' && peca === peca.toLowerCase() && peca !== '')) {
            selecionada = [i, j];
            movimentosValidos = movimentosPeca(i, j);
            desenharTabuleiro();
            return;
        }
        // Clicou na mesma peça: desseleciona
        if (selecionada[0] === i && selecionada[1] === j) {
            selecionada = null;
            movimentosValidos = [];
            desenharTabuleiro();
            return;
        }
    } else {
        // Seleciona peça do turno
        if ((turno === 'w' && peca === peca.toUpperCase() && peca !== '') || (turno === 'b' && peca === peca.toLowerCase() && peca !== '')) {
            selecionada = [i, j];
            movimentosValidos = movimentosPeca(i, j);
            desenharTabuleiro();
        }
    }
}

function mostrarComemoracao(msg, vencedor) {
    let modal = document.getElementById('comemoracao-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'comemoracao-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `<div style="background:#fffbe9;padding:40px 60px;border-radius:20px;box-shadow:0 0 30px #ffeb3b;text-align:center;">
            <h1 style='color:#43a047;font-size:2.5em;margin-bottom:20px;' id='msg-comemoracao'></h1>
            <div style='font-size:1.3em;margin-bottom:20px;' id='placar-comemoracao'></div>
            <button onclick='document.getElementById("comemoracao-modal").remove();reiniciarJogo();' style='padding:12px 32px;font-size:1.1em;background:#ffb300;color:#fff;border:none;border-radius:8px;cursor:pointer;'>Jogar Novamente</button>
        </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('msg-comemoracao').textContent = msg;
    document.getElementById('placar-comemoracao').textContent = `Vitórias - Brancas: ${placar.w} | Pretas: ${placar.b}`;
}

// Função de exemplo para finalizar o jogo (chame quando detectar xeque-mate ou empate)
function finalizarJogo(vencedor) {
    if (vencedor === 'w') {
        placar.w++;
        mostrarComemoracao('Brancas venceram!', vencedor);
    } else if (vencedor === 'b') {
        placar.b++;
        mostrarComemoracao('Pretas venceram!', vencedor);
    } else {
        mostrarComemoracao('Empate!', null);
    }
}

window.onload = reiniciarJogo;