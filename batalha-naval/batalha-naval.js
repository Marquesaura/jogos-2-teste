let ws = null;
let minhaVez = false;
let tabuleiroJogador = [];
let tabuleiroAdversario = [];
let navios = [5,4,3,3,2];
let tirosRecebidos = [];
let tirosDados = [];
let pronto = false;
let aguardandoAdversario = true;
let pontos = [0,0];

function criarTabuleiroVazio() {
    return Array.from({length:10},()=>Array(10).fill(''));
}

function posicionarNavios(tab) {
    for (let tam of navios) {
        let colocado = false;
        while (!colocado) {
            let dir = Math.random()<0.5 ? 'h' : 'v';
            let i = Math.floor(Math.random()*(dir==='h'?10:10-tam+1));
            let j = Math.floor(Math.random()*(dir==='v'?10:10-tam+1));
            let livre = true;
            for (let k=0;k<tam;k++) {
                let ni = dir==='h'?i:i+k;
                let nj = dir==='h'?j+k:j;
                if (tab[ni][nj] !== '') livre = false;
            }
            if (livre) {
                for (let k=0;k<tam;k++) {
                    let ni = dir==='h'?i:i+k;
                    let nj = dir==='h'?j+k:j;
                    tab[ni][nj] = 'N';
                }
                colocado = true;
            }
        }
    }
}

function desenharTabuleiros() {
    const tJ = document.getElementById('tabuleiro-jogador');
    const tA = document.getElementById('tabuleiro-adversario');
    tJ.innerHTML = '';
    tA.innerHTML = '';
    for (let i=0;i<10;i++) {
        for (let j=0;j<10;j++) {
            // Jogador
            const celJ = document.createElement('div');
            celJ.className = 'celula';
            if (tabuleiroJogador[i][j] === 'N') celJ.classList.add('navio');
            if (tirosRecebidos.some(t=>t[0]===i&&t[1]===j)) {
                celJ.classList.add(tabuleiroJogador[i][j]==='N'?'acerto':'tiro');
            }
            tJ.appendChild(celJ);
            // Adversário
            const celA = document.createElement('div');
            celA.className = 'celula';
            if (tirosDados.some(t=>t[0]===i&&t[1]===j)) {
                celA.classList.add('tiro');
            }
            celA.onclick = ()=>{
                if (!pronto || aguardandoAdversario || !minhaVez || tirosDados.some(t=>t[0]===i&&t[1]===j)) return;
                ws.send(JSON.stringify({tipo:'jogada', jogada:{tiro:[i,j]}}));
                minhaVez = false;
                atualizarStatus();
            };
            tA.appendChild(celA);
        }
    }
}

function atualizarStatus() {
    if (aguardandoAdversario) {
        document.getElementById('status').textContent = 'Aguardando adversário...';
    } else {
        document.getElementById('status').textContent = minhaVez ? 'Sua vez de atirar!' : 'Aguardando adversário...';
    }
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
            iniciarJogo();
        } else if (data.tipo === 'jogada') {
            receberJogada(data.jogada);
        } else if (data.tipo === 'erro') {
            document.getElementById('conexaoStatus').textContent = data.msg;
            if (data.msg && data.msg.includes('Sala cheia')) {
                setTimeout(()=>{ window.location.href = '../inicio.html'; }, 2000);
            }
        }
    };
    ws.onclose = () => {
        document.getElementById('conexaoStatus').textContent = 'Desconectado';
        aguardandoAdversario = true;
    };
}

function iniciarJogo() {
    tabuleiroJogador = criarTabuleiroVazio();
    tabuleiroAdversario = criarTabuleiroVazio();
    tirosRecebidos = [];
    tirosDados = [];
    pronto = true;
    minhaVez = Math.random()<0.5; // Sorteia quem começa
    posicionarNavios(tabuleiroJogador);
    desenharTabuleiros();
    atualizarStatus();
}

function receberJogada(jogada) {
    if (jogada.tiro) {
        tirosRecebidos.push(jogada.tiro);
        minhaVez = true;
        desenharTabuleiros();
        atualizarStatus();
    }
}

function reiniciarJogo() {
    if (ws) ws.close();
    document.getElementById('conexaoStatus').textContent = '';
    tabuleiroJogador = criarTabuleiroVazio();
    tabuleiroAdversario = criarTabuleiroVazio();
    tirosRecebidos = [];
    tirosDados = [];
    pronto = false;
    desenharTabuleiros();
    atualizarStatus();
}

function mostrarComemoracao(msg, placarFinal) {
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
    document.getElementById('placar-comemoracao').textContent = placarFinal;
}

function checarVitoria() {
    let acertos1 = tirosRecebidos.filter(([i,j])=>tabuleiroAdversario[i][j]==='N').length;
    let acertos2 = tirosDados.filter(([i,j])=>tabuleiroJogador[i][j]==='N').length;
    if (acertos1 === navios.reduce((a,b)=>a+b)) {
        mostrarComemoracao('Jogador 1 venceu!', `Acertos: J1=${acertos1} | J2=${acertos2}`);
    } else if (acertos2 === navios.reduce((a,b)=>a+b)) {
        mostrarComemoracao('Jogador 2 venceu!', `Acertos: J1=${acertos1} | J2=${acertos2}`);
    }
}

window.onload = ()=>{
    tabuleiroJogador = criarTabuleiroVazio();
    tabuleiroAdversario = criarTabuleiroVazio();
    desenharTabuleiros();
    atualizarStatus();
};