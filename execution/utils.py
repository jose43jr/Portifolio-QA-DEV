import os

def load_directive(directive_name):
    """Lê o conteúdo de uma diretiva markdown."""
    path = os.path.join("directives", directive_name)
    if not os.path.exists(path):
        print(f"Erro: Diretiva {directive_name} não encontrada.")
        return None
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def log_step(step_name, status):
    """Log simples de passos de execução."""
    print(f"[{status.upper()}] {step_name}")

if __name__ == "__main__":
    print("Execution Utils Loaded.")
