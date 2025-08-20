let numeroSecreto = 0;
let tentativas = 0;

function reiniciarJogo() {
    numeroSecreto = Math.floor(Math.random()*100)+1;
    tentativas = 0;
    document.getElementById('status').textContent = 'Tente adivinhar o número entre 1 e 100!';
    document.getElementById('palpite').value = '';
}

function mostrarComemoracao(msg, tentativas) {
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
            <div style='font-size:1.3em;margin-bottom:20px;' id='tentativas-comemoracao'></div>
            <button onclick='document.getElementById("comemoracao-modal").remove();reiniciarJogo();' style='padding:12px 32px;font-size:1.1em;background:#ffb300;color:#fff;border:none;border-radius:8px;cursor:pointer;'>Jogar Novamente</button>
        </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('msg-comemoracao').textContent = msg;
    document.getElementById('tentativas-comemoracao').textContent = `Tentativas: ${tentativas}`;
}

function enviarPalpite() {
    const palpite = parseInt(document.getElementById('palpite').value);
    if (isNaN(palpite)) return;
    tentativas++;
    if (palpite === numeroSecreto) {
        document.getElementById('status').textContent = `Parabéns! Você acertou em ${tentativas} tentativas.`;
        mostrarComemoracao('Parabéns! Você acertou!', tentativas);
    } else if (palpite < numeroSecreto) {
        document.getElementById('status').textContent = 'Tente um número maior!';
    } else {
        document.getElementById('status').textContent = 'Tente um número menor!';
    }
    document.getElementById('palpite').value = '';
}

window.onload = reiniciarJogo;