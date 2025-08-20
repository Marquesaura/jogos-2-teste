const tabuleiro = document.getElementById("tabuleiro");
const vencedorDiv = document.getElementById("vencedor");
let jogadorAtual = "X";
let estadoTabuleiro = Array(9).fill("");

tabuleiro.addEventListener("click", (evento) => {
    const celula = evento.target;
    const index = celula.dataset.index;

    if (!estadoTabuleiro[index] && index !== undefined) {
        estadoTabuleiro[index] = jogadorAtual;
        celula.textContent = jogadorAtual;

        if (verificaVencedor()) {
            vencedorDiv.textContent = `Jogador ${jogadorAtual} venceu!`;
            tabuleiro.style.pointerEvents = "none";
        } else {
            jogadorAtual = jogadorAtual === "X" ? "O" : "X";
        }
    }
});

function verificaVencedor() {
    const combinacoesVencedoras = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combinacao of combinacoesVencedoras) {
        const [a, b, c] = combinacao;
        if (estadoTabuleiro[a] && estadoTabuleiro[a] === estadoTabuleiro[b] && estadoTabuleiro[a] === estadoTabuleiro[c]) {
            return true;
        }
    }
    return false;
}