let cartas = [];
let viradas = [];
let pareadas = [];
let vez = 1;
let pontos = [0,0];
const simbolos = ['🍎','🍌','🍇','🍉','🍒','🍋','🍓','🍍','🥝','🥥','🥑','🍊'];

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function reiniciarJogo() {
    cartas = [];
    viradas = [];
    pareadas = [];
    vez = 1;
    pontos = [0,0];
    let baralho = simbolos.concat(simbolos);
    embaralhar(baralho);
    for (let i=0;i<24;i++) {
        cartas.push({simbolo:baralho[i], virada:false, pareada:false});
    }
    desenharTabuleiro();
    atualizarStatus();
}

function desenharTabuleiro() {
    const tab = document.getElementById('tabuleiro');
    tab.innerHTML = '';
    cartas.forEach((carta, idx) => {
        const div = document.createElement('div');
        div.className = 'carta';
        if (carta.virada) div.classList.add('virada');
        if (carta.pareada) div.classList.add('pareada');
        div.textContent = carta.virada || carta.pareada ? carta.simbolo : '';
        div.onclick = () => virarCarta(idx);
        tab.appendChild(div);
    });
}

function virarCarta(idx) {
    if (cartas[idx].virada || cartas[idx].pareada || viradas.length === 2) return;
    cartas[idx].virada = true;
    viradas.push(idx);
    desenharTabuleiro();
    if (viradas.length === 2) {
        setTimeout(checarPar, 800);
    }
}

function mostrarComemoracao(msg) {
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
    document.getElementById('pontos-comemoracao').textContent = `Placar final: Jogador 1 = ${pontos[0]} | Jogador 2 = ${pontos[1]}`;
}

function checarPar() {
    const [a, b] = viradas;
    if (cartas[a].simbolo === cartas[b].simbolo) {
        cartas[a].pareada = true;
        cartas[b].pareada = true;
        pontos[vez-1]++;
    } else {
        cartas[a].virada = false;
        cartas[b].virada = false;
        vez = vez === 1 ? 2 : 1;
    }
    viradas = [];
    desenharTabuleiro();
    atualizarStatus();
    if (cartas.every(c=>c.pareada)) {
        let msg = pontos[0] > pontos[1] ? 'Jogador 1 venceu!' : pontos[1] > pontos[0] ? 'Jogador 2 venceu!' : 'Empate!';
        mostrarComemoracao(msg);
    }
}

function atualizarStatus() {
    document.getElementById('status').textContent = `Vez do Jogador ${vez} | Pontos: J1=${pontos[0]} J2=${pontos[1]}`;
}

window.onload = reiniciarJogo;