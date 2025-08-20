function typeWriter(elemento) {
    const tituloArray = elemento.innerHTML.split('');
    elemento.innerHTML = '';
    tituloArray.forEach((letra, i) => {
        setTimeout(() => {
            elemento.innerHTML += letra;
        }, 80 * i);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const tituloJogos = document.querySelector("#tit-jogos");
    const tituloPrincipal = document.querySelector("#titulo");

    if (tituloJogos) {
        typeWriter(tituloJogos);
    }
    if (tituloPrincipal) {
        typeWriter(tituloPrincipal);
    }
});

