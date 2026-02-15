# Diretiva: Build Workflow

## Objetivo
Processo padrão para construir e atualizar o site.

## Entradas
- `directives/product_landing_page.md`
- Assets em `assets/` (imagens, ícones)

## Passos de Execução
1.  **Setup**: Garantir estrutura de pastas correta.
2.  **Estilos**: Atualizar `css/main.css` com base nos tokens definidos na diretiva de produto.
3.  **Estrutura**: Atualizar `index.html` com a estrutura semântica.
4.  **Scripting**: Atualizar `js/app.js` para interatividade.
5.  **Verificação**:
    - Rodar `python execution/check_links.py` para validar links.
    - Abrir `index.html` localmente para revisão visual.

## Regras
- **Não** usar frameworks CSS pesados (Bootstrap, Tailwind via CDN) a menos que estritamente necessário. Preferir CSS puro leve.
- **Sempre** validar a responsividade.
- **Manter** código limpo e comentado.
