const canvas = document.createElement('canvas');
canvas.width = 960;
canvas.height = 480;
document.body.appendChild(canvas);
canvas.tabIndex = 0;
const ctx = canvas.getContext('2d');

document.body.style.overflow = 'hidden';

let mario = { x: 40, y: 0, vy: 0, w: 32, h: 32, pulando: false };
let chao = canvas.height - 40;
// posiciona o Mario no chão ao iniciar
mario.y = chao - mario.h;
let obstaculos = [{x:300, y:chao-20, w:20, h:20, passou:false}];
let direita = false, esquerda = false;
let pontos = 0;
let melhor = 0;
let velocidadeObstaculos = 3;
let frame = 0;
let gameOver = false;
// cenário: nuvens e decorações
let nuvens = [];
let decoracoes = [];
const JUMP_VELOCITY = -18;

function gerarNuvem(xStart) {
	return {
		x: xStart ?? canvas.width + Math.random() * 200,
		y: 30 + Math.random() * 120,
		w: 60 + Math.random() * 80,
		h: 14 + Math.random() * 10,
		v: 0.4 + Math.random() * 0.6
	};
}

function gerarDecoracao(xStart) {
	const h = 15 + Math.random() * 18;
	const w = 30 + Math.random() * 40;
	return {
		type: 'bush',
		x: xStart ?? canvas.width + Math.random() * 220,
		y: chao - h,
		w,
		h,
		v: 1.2 + Math.random() * 0.6
	};
}

function inicializarCenario() {
	for (let i = 0; i < 4; i++) {
		nuvens.push(gerarNuvem(Math.random() * canvas.width));
	}
	for (let i = 0; i < 3; i++) {
		const x = Math.random() * canvas.width;
		decoracoes.push(gerarDecoracao(x));
	}
}

inicializarCenario();

function desenhar() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // céu (mais azul) com gradiente
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#64b5f6');
    grad.addColorStop(1, '#1976d2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // nuvens (parallax)
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    nuvens.forEach(n => desenharNuvem(n));
    // chão
    ctx.fillStyle = '#8bc34a';
    ctx.fillRect(0, chao, canvas.width, 40);
    // decorações (arbustos) acima do chão
    decoracoes.forEach(d => desenharDecoracao(d));
    // obstáculos
    ctx.fillStyle = '#795548';
    obstaculos.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));
    // mario
    ctx.fillStyle = '#f44336';
    ctx.fillRect(mario.x, mario.y, mario.w, mario.h);
    // pontos
    ctx.fillStyle = '#222';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Pontos: '+pontos, 10, 25);
    ctx.fillText('Melhor: '+melhor, 10, 45);
}

function atualizar() {
    if (gameOver) return;
    if (direita) mario.x += 3;
    if (esquerda) mario.x -= 3;
    // limites do canvas
    if (mario.x < 0) mario.x = 0;
    if (mario.x + mario.w > canvas.width) mario.x = canvas.width - mario.w;
    // gravidade
    mario.y += mario.vy;
    if (mario.y + mario.h < chao) {
        mario.vy += 1.2;
    } else {
        mario.y = chao - mario.h;
        mario.vy = 0;
        mario.pulando = false;
    }
    // movimenta obstáculos e remove os que saíram da tela
    obstaculos.forEach(o=>{ o.x -= velocidadeObstaculos; });
    obstaculos = obstaculos.filter(o => o.x + o.w > 0);
    // movimenta nuvens e gera novas
    nuvens.forEach(n => { n.x -= n.v; });
    nuvens = nuvens.filter(n => n.x + n.w > -50);
    // gera novos elementos de cenário periodicamente
    if (frame % 140 === 0) {
        nuvens.push(gerarNuvem());
    }
    // movimenta decorações e adiciona novas
    decoracoes.forEach(d => { d.x -= d.v; });
    decoracoes = decoracoes.filter(d => d.x + d.w > -40);
    if (frame % 200 === 0) {
        decoracoes.push(gerarDecoracao());
    }
    // gera novos obstáculos periodicamente
    frame++;
    if (frame % 90 === 0) {
        obstaculos.push({
            x: canvas.width + Math.floor(Math.random()*120),
            y: chao - 20,
            w: 20,
            h: 20,
            passou: false
        });
    }
    // colisão com obstáculos
    obstaculos.forEach(o=>{
        if (mario.x < o.x+o.w && mario.x+mario.w > o.x && mario.y < o.y+o.h && mario.y+mario.h > o.y) {
            if (pontos > melhor) melhor = pontos;
            mostrarComemoracao('Você bateu no obstáculo!', pontos);
            gameOver = true;
        }
    });
    // pontuação por passar obstáculo
    obstaculos.forEach(o=>{
        if (!o.passou && mario.x > o.x+o.w) {
            o.passou = true;
            pontos += 10;
        }
    });
}

function desenharNuvem(n) {
	ctx.beginPath();
	ctx.arc(n.x, n.y, n.h, 0, Math.PI * 2);
	ctx.arc(n.x + n.w * 0.25, n.y - n.h * 0.6, n.h * 0.9, 0, Math.PI * 2);
	ctx.arc(n.x + n.w * 0.5, n.y, n.h * 1.1, 0, Math.PI * 2);
	ctx.arc(n.x + n.w * 0.8, n.y - n.h * 0.5, n.h * 0.85, 0, Math.PI * 2);
	ctx.fill();
}

function desenharDecoracao(d) {
	if (d.type === 'bush') {
		ctx.fillStyle = '#2e7d32';
		// base do arbusto
		ctx.beginPath();
		ctx.arc(d.x + d.w * 0.25, d.y + d.h, d.h * 0.9, 0, Math.PI * 2);
		ctx.arc(d.x + d.w * 0.55, d.y + d.h * 0.8, d.h, 0, Math.PI * 2);
		ctx.arc(d.x + d.w * 0.85, d.y + d.h, d.h * 0.85, 0, Math.PI * 2);
		ctx.fill();
	}
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
            <button onclick='reiniciarJogo();' style='padding:12px 32px;font-size:1.1em;background:#ffb300;color:#fff;border:none;border-radius:8px;cursor:pointer;'>Jogar Novamente</button>
        </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('msg-comemoracao').textContent = msg;
    document.getElementById('pontos-comemoracao').textContent = `Pontuação: ${pontos}`;
}

function reiniciarJogo() {
    const modal = document.getElementById('comemoracao-modal');
    if (modal) modal.remove();
    mario.x = 40;
    mario.y = chao - mario.h;
    mario.vy = 0;
    mario.pulando = false;
    pontos = 0;
    obstaculos = [{x: canvas.width + 100, y: chao - 20, w: 20, h: 20, passou:false}];
    frame = 0;
    gameOver = false;
}
window.reiniciarJogo = reiniciarJogo;

function isRightKey(e) {
    const k = e.key;
    const c = e.code;
    return k === 'ArrowRight' || k === 'Right' || c === 'ArrowRight' || k === 'd' || k === 'D';
}

function isLeftKey(e) {
    const k = e.key;
    const c = e.code;
    return k === 'ArrowLeft' || k === 'Left' || c === 'ArrowLeft' || k === 'a' || k === 'A';
}

function isJumpKey(e) {
    const k = e.key;
    const c = e.code;
    return k === ' ' || k === 'Spacebar' || c === 'Space' || k === 'ArrowUp' || k === 'Up' || c === 'ArrowUp' || k === 'w' || k === 'W';
}

function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
    if (isRightKey(e)) { direita = true; e.preventDefault(); }
    if (isLeftKey(e)) { esquerda = true; e.preventDefault(); }
    if (isJumpKey(e) && !mario.pulando && !gameOver) {
        mario.vy = JUMP_VELOCITY;
        mario.pulando = true;
        e.preventDefault();
    }
});
document.addEventListener('keyup', e => {
    if (isRightKey(e)) { direita = false; e.preventDefault(); }
    if (isLeftKey(e)) { esquerda = false; e.preventDefault(); }
});

window.onload = loop;

window.addEventListener('load', () => {
    try {
        window.focus();
        if (!document.body.hasAttribute('tabindex')) {
            document.body.setAttribute('tabindex', '-1');
        }
        document.body.focus({ preventScroll: true });
        canvas.focus();
    } catch (_) {}
});

// Controles por toque/click (fallback)
function handlePointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zone = x / canvas.width;
    if (!mario.pulando && !gameOver) {
        mario.vy = JUMP_VELOCITY; 
        mario.pulando = true;
    }
    if (zone < 0.33) {
        esquerda = true; 
        direita = false;
    } else if (zone > 0.66) {
        direita = true; 
        esquerda = false;
    } else {
        direita = false; 
        esquerda = false;
    }
    e.preventDefault();
}
function handlePointerUp() {
    direita = false; esquerda = false;
}
canvas.addEventListener('pointerdown', handlePointerDown);
canvas.addEventListener('pointerup', handlePointerUp);
canvas.addEventListener('pointercancel', handlePointerUp);
canvas.addEventListener('pointerleave', handlePointerUp);

// Foco no canvas no primeiro clique
document.addEventListener('click', () => { try { canvas.focus(); } catch(_){} }, { once: true });
