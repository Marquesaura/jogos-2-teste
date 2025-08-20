// botao novo user
const novoBtn = document.getElementById("novo-btn");
const novoPainel = document.getElementById("painel-novo");


if (novoBtn && novoPainel) {
    const closenovoBtn = novoPainel.querySelector(".fechar");
    
    novoBtn.addEventListener("click", () => {
        novoPainel.style.display = "block";
        if (userPainel) userPainel.style.display = "none";
    });

    if (closenovoBtn) {
        closenovoBtn.addEventListener("click", () => {
            novoPainel.style.display = "none";
        });
    }
}




