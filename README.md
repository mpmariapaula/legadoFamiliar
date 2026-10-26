# Legado Familiar — Next.js

Projeto migrado para Next.js com App Router, React e TypeScript.

## Executar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Estrutura

- `app/`: layout, estilos globais e entrada de rotas do Next.js.
- `src/pages/`: componentes que representam as telas do produto.
- `src/pages/admin/`: tela administrativa e formulários.
- `src/components/`: componentes reutilizáveis.
- `src/types/`: tipos TypeScript compartilhados.
- `src/data/`: dados de demonstração.
- `src/utils/`: funções utilitárias.
- `src/App.tsx`: composição das telas e estado de demonstração.

Os dados ainda ficam em memória e são exemplos locais; não há banco de dados conectado nesta versão.
