# Contribuindo para o Fluxo de Rede Social

Obrigado por querer contribuir com este projeto. Este guia descreve o fluxo recomendado para abrir contribuições com segurança e consistência.

## Pré-requisitos

- Node.js (versão LTS recomendada)
- npm

## Configuração local

1. Faça um fork e clone do repositório.
2. Entre na pasta do projeto:
   - `cd Fluxo-de-Rede-Social`
3. Instale as dependências:
   - `npm install --legacy-peer-deps`
4. Crie o arquivo `.env.local` com as variáveis descritas no `README.md`.
5. Rode o projeto localmente:
   - `npm run dev`

## Padrões de contribuição

- Faça mudanças pequenas e focadas em um único objetivo.
- Evite incluir alterações não relacionadas no mesmo PR.
- Mantenha nomes de arquivos e componentes consistentes com o padrão já existente no projeto.

## Validação antes de abrir PR

Execute, quando aplicável:

- `npm run lint`
- `npm run build`
- `npm run typecheck`

Se algum comando já falhar no estado atual da base, descreva isso no PR e garanta que sua mudança não adicionou novos erros.

## Commits e Pull Requests

- Use mensagens de commit claras e objetivas.
- Descreva no PR:
  - O que foi alterado
  - Por que a mudança foi necessária
  - Como validar a alteração localmente
- Se houver impacto visual, inclua imagens ou vídeos.
- Relacione issues (quando houver).

## Código de Conduta e Segurança

- Leia e siga o [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
- Para reportar vulnerabilidades, siga o [SECURITY.md](./SECURITY.md).
