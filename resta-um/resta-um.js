const TAM = 7;
const tabuleiroPadrao = [
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0]
];
let tabuleiro = [];
let selecionada = null;
let possiveis = [];

function desenharTabuleiro() {
    const div = document.getElementById('tabuleiro');
    div.innerHTML = '';
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) {
            if (tabuleiro[i][j] === 0) {
                const cel = document.createElement('div');
                cel.className = 'celula vazia';
                if (possiveis.some(p => p[0] === i && p[1] === j)) {
                    cel.classList.add('possivel');
                    cel.onclick = () => moverPara(i, j);
                }
                div.appendChild(cel);
            } else if (tabuleiro[i][j] === 1) {
                const cel = document.createElement('div');
                cel.className = 'celula';
                cel.dataset.i = i;
                cel.dataset.j = j;
                if (selecionada && selecionada[0] === i && selecionada[1] === j) {
                    cel.classList.add('selecionada');
                }
                cel.onclick = () => selecionarPeca(i, j);
                div.appendChild(cel);
            }
        }
        div.appendChild(document.createElement('br'));
    }
}

function reiniciarJogo() {
    tabuleiro = tabuleiroPadrao.map(linha => linha.slice());
    selecionada = null;
    possiveis = [];
    desenharTabuleiro();
    mostrarMensagem('');
}

function mostrarMensagem(msg) {
    let m = document.getElementById('mensagem');
    if (!m) {
        m = document.createElement('div');
        m.id = 'mensagem';
        m.style.margin = '20px';
        m.style.fontWeight = 'bold';
        document.body.insertBefore(m, document.getElementById('tabuleiro').nextSibling);
    }
    m.textContent = msg;
}

function mostrarComemoracao(msg, pontos) {
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
            <div style='font-size:1.3em;margin-bottom:20px;' id='pontos-comemoracao'></div>
            <button onclick='document.getElementById("comemoracao-modal").remove();reiniciarJogo();' style='padding:12px 32px;font-size:1.1em;background:#ffb300;color:#fff;border:none;border-radius:8px;cursor:pointer;'>Jogar Novamente</button>
        </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('msg-comemoracao').textContent = msg;
    document.getElementById('pontos-comemoracao').textContent = `Peças restantes: ${pontos}`;
}

function movimentosPossiveis(i, j) {
    const dirs = [
        [-2,0], [2,0], [0,-2], [0,2]
    ];
    let moves = [];
    for (const [di, dj] of dirs) {
        const ni = i + di, nj = j + dj;
        const mi = i + di/2, mj = j + dj/2;
        if (
            ni >= 0 && ni < TAM && nj >= 0 && nj < TAM &&
            tabuleiro[ni][nj] === 0 &&
            tabuleiro[mi][mj] === 1
        ) {
            moves.push([ni, nj]);
        }
    }
    return moves;
}

function selecionarPeca(i, j) {
    if (selecionada && selecionada[0] === i && selecionada[1] === j) {
        // Desseleciona se clicar na mesma peça
        selecionada = null;
        possiveis = [];
    } else {
        selecionada = [i, j];
        possiveis = movimentosPossiveis(i, j);
    }
    desenharTabuleiro();
}

function moverPara(i, j) {
    if (!selecionada) return;
    const [si, sj] = selecionada;
    // Só permite se for um destino possível
    if (!possiveis.some(p => p[0] === i && p[1] === j)) return;
    const mi = (si + i) / 2;
    const mj = (sj + j) / 2;
    tabuleiro[si][sj] = 0;
    tabuleiro[mi][mj] = 0;
    tabuleiro[i][j] = 1;
    selecionada = null;
    possiveis = [];
    desenharTabuleiro();
    checarFimDeJogo();
}

function checarFimDeJogo() {
    let movimentos = 0;
    let pecas = 0;
    for (let i = 0; i < TAM; i++) {
        for (let j = 0; j < TAM; j++) {
            if (tabuleiro[i][j] === 1) {
                pecas++;
                movimentos += movimentosPossiveis(i, j).length;
            }
        }
    }
    if (pecas === 1) {
        mostrarComemoracao('Parabéns! Você venceu!', pecas);
    } else if (movimentos === 0) {
        mostrarComemoracao('Fim de jogo! Não há mais movimentos possíveis.', pecas);
    }
}

window.onload = reiniciarJogo;