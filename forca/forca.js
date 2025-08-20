const teclado = [
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "a", "s", "d", "f", "g", "h", "j", "k", "l", "ç",
    "z", "x", "c", "v", "b", "n", "m"
];
let palavraAtual = "";
let dicaAtual = "";
let erros = 0;
let letrasUsadas = [];
let maxErros = 6;

function montarTeclado() {
    const tecladoCaixa = document.querySelector(".container-alafabeto");
    tecladoCaixa.innerHTML = '';
    teclado.forEach(letra => {
        const p = document.createElement("button");
        p.textContent = letra;
        p.className = 'tecla';
        p.disabled = letrasUsadas.includes(letra);
        p.onclick = () => verificarLetra(letra);
        tecladoCaixa.appendChild(p);
    });
}

function selDificuldade(dificuldade) {
    const palavrasFaceis = [
        { palavra: "casa", dica: "Lugar" },
        { palavra: "bola", dica: "Brinquedo" },
        { palavra: "gato", dica: "Animal doméstico" },
        { palavra: "amor", dica: "Sentimento" },
        { palavra: "sol", dica: "Astro" },
        { palavra: "paz", dica: "Sensação" },
        { palavra: "rio", dica: "Água" },
        { palavra: "livro", dica: "Objeto" },
        { palavra: "foco", dica: "Estado mental" },
        { palavra: "mesa", dica: "Móvel" }
    ];
    const palavrasMedias = [
        { palavra: "abacaxi", dica: "Fruta tropical" },
        { palavra: "computador", dica: "Usado para navegar na internet" },
        { palavra: "girassol", dica: "Flor" },
        { palavra: "oceano", dica: "Corpo de água" },
        { palavra: "telefone", dica: "Eletrônico" }
    ];
    const palavrasDificeis = [
        "quimera", "subterfúgio", "efêmero", "solilóquio", "idiossincrasia"
    ];
    switch (dificuldade) {
        case "facil":
            return palavrasFaceis;
        case "medio":
            return palavrasMedias;
        case "dificil":
            return palavrasDificeis.map(p => ({ palavra: p, dica: "(sem dica)" }));
        default:
            alert("Dificuldade inválida");
            return [];
    }
}

function sortearPalavra() {
    const dificuldade = document.getElementById("dificuldade").value;
    const lista = selDificuldade(dificuldade);
    const sorteada = lista[Math.floor(Math.random() * lista.length)];
    return sorteada;
}

function mostrarImagemForca() {
    const imagens = document.querySelectorAll('.img-forca');
    imagens.forEach((img, idx) => {
        img.style.display = (idx === erros) ? 'block' : 'none';
    });
}

function adivinharPalavras() {
    const contentGuessWord = document.querySelector(".adivinhar");
    const contentClue = document.querySelector(".dica");
    const resultado = document.getElementById("resultado");
    erros = 0;
    letrasUsadas = [];
    mostrarImagemForca();
    montarTeclado();
    contentGuessWord.innerHTML = "";
    const sorteada = sortearPalavra();
    palavraAtual = sorteada.palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    dicaAtual = sorteada.dica;
    resultado.textContent = '';
    contentClue.textContent = `Dica: ${dicaAtual}`;
    Array.from(palavraAtual).forEach(letra => {
        const span = document.createElement("span");
        span.textContent = "_";
        span.setAttribute("data-letra", letra);
        contentGuessWord.appendChild(span);
    });
}

function verificarLetra(letra) {
    if (letrasUsadas.includes(letra)) return;
    letrasUsadas.push(letra);
    montarTeclado();
    const spans = document.querySelectorAll(".adivinhar span");
    let acerto = false;
    spans.forEach(span => {
        if (span.getAttribute("data-letra") === letra) {
            span.textContent = letra.toUpperCase();
            acerto = true;
        }
    });
    if (!acerto) {
        erros++;
        mostrarImagemForca();
        if (erros >= maxErros) {
            fimDeJogo(false);
        }
    } else {
        const todasLetrasAdivinhadas = Array.from(spans).every(span => span.textContent !== "_");
        if (todasLetrasAdivinhadas) {
            fimDeJogo(true);
        }
    }
}

function fimDeJogo(venceu) {
    const resultado = document.getElementById("resultado");
    if (venceu) {
        resultado.textContent = "Parabéns! Você acertou a palavra: " + palavraAtual.toUpperCase();
        mostrarComemoracao('Parabéns! Você venceu!', palavraAtual.toUpperCase());
    } else {
        resultado.textContent = "Você perdeu! A palavra era: " + palavraAtual.toUpperCase();
        mostrarComemoracao('Que pena! Você perdeu!', palavraAtual.toUpperCase());
    }
    // Bloqueia teclado
    document.querySelectorAll('.tecla').forEach(btn => btn.disabled = true);
}

function mostrarComemoracao(msg, palavra) {
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
            <div style='font-size:1.3em;margin-bottom:20px;' id='palavra-comemoracao'></div>
            <button onclick='document.getElementById("comemoracao-modal").remove();adivinharPalavras();' style='padding:12px 32px;font-size:1.1em;background:#ffb300;color:#fff;border:none;border-radius:8px;cursor:pointer;'>Jogar Novamente</button>
        </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('msg-comemoracao').textContent = msg;
    document.getElementById('palavra-comemoracao').textContent = `Palavra: ${palavra}`;
}

window.onload = () => {
    adivinharPalavras();
};
