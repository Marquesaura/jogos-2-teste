import random

def jogar():
    imprime_mensagem_abertura()
    palavra_secreta = carrega_palavra_secreta()
    letras_acertadas = inicializa_letras_acertadas(palavra_secreta)
    chutes = []

    erros = 0
    enforcou = False
    acertou = False

    while not enforcou and not acertou:
        chute = pede_chute()

        if chute in chutes:
            print(f"Você já tentou a letra '{chute}'. Tente outra.")
            continue

        chutes.append(chute)

        if chute in palavra_secreta:
            marca_chute_correto(chute, letras_acertadas, palavra_secreta)
        else:
            erros += 1
            desenha_forca(erros)

        enforcou = erros == 7
        acertou = "_" not in letras_acertadas
        print(letras_acertadas)

    if acertou:
        imprime_mensagem_vencedor()
    else:
        imprime_mensagem_perdedor(palavra_secreta)

def imprime_mensagem_abertura():
    print("*********************************")
    print("*** Bem-vindo ao jogo da Forca! ***")
    print("*********************************")

def carrega_palavra_secreta():
    try:
        with open("palavras.txt", "r") as arquivo:
            palavras = [linha.strip().upper() for linha in arquivo if linha.strip()]
        return random.choice(palavras)
    except FileNotFoundError:
        print("Arquivo 'palavras.txt' não encontrado. Usando palavra padrão.")
        return "PYTHON"

def inicializa_letras_acertadas(palavra):
    return ["_" for _ in palavra]

def pede_chute():
    chute = input("Qual letra? ").strip().upper()
    return chute

def marca_chute_correto(chute, letras_acertadas, palavra_secreta):
    for index, letra in enumerate(palavra_secreta):
        if chute == letra:
            letras_acertadas[index] = letra

def desenha_forca(erros):
    partes = [
        "  _______     ",
        " |/      |    ",
        f" |      {'(_)' if erros >= 1 else ''}   ",
        f" |      {'\\' if erros == 2 else '\\|' if erros == 3 else '\\|/' if erros >= 4 else ''}   ",
        f" |       {'|' if erros >= 5 else ''}    ",
        f" |      {'/' if erros == 6 else '/ \\' if erros >= 7 else ''}   ",
        " |            ",
        "_|___         ",
        ""
    ]
    print("\n".join(partes))

def imprime_mensagem_vencedor():
    print("Parabéns, você ganhou!")
    print("       ___________      ")
    print("      '._==_==_=_.'     ")
    print("      .-\\:      /-.    ")
    print("     | (|:.     |) |    ")
    print("      '-|:.     |-'     ")
    print("        \\::.    /      ")
    print("         '::. .'        ")
    print("           ) (          ")
    print("         _.' '._        ")
    print("        '-------'       ")

def imprime_mensagem_perdedor(palavra_secreta):
    print("Puxa, você foi enforcado!")
    print(f"A palavra era {palavra_secreta}")
    print("    _______________         ")
    print("   /               \       ")
    print("  /                 \      ")
    print("//                   \/\  ")
    print("\|   XXXX     XXXX   | /   ")
    print(" |   XXXX     XXXX   |/    ")
    print(" |   XXX       XXX   |     ")
    print(" |                   |     ")
    print(" \__      XXX      __/    ")
    print("   |\     XXX     /|      ")
    print("   | |           | |      ")
    print("   | I I I I I I I |      ")
    print("   |  I I I I I I  |      ")
    print("   \_             _/      ")
    print("     \_         _/        ")
    print("       \_______/          ")

if __name__ == "__main__":
    jogar()