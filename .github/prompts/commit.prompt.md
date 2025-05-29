---
mode: 'agent'
description: 'Versionar o projeto usando Conventional Commits'
---

Siga rigorosamente as seguintes etapas!

1. **Verificar o status das alterações**
   Liste todos os arquivos modificados, inclusos não rastreados: `git status -uall`

2. **Inspecionar o diff detalhado**
   Veja o que mudou em cada arquivo desde o último commit: `git --no-pager diff`

3. **Garantir a prontidão das alterações**

   * Resolva quaisquer erros ou conflitos.
   * Execute testes e lint para confirmar que tudo está verde.
   * Ajuste formatação e padronização de código.

4. **Nomear e criar a branch**
   Antes de qualquer alteração, crie uma branch específica para o tipo de mudança que você vai fazer: `git checkout -b <tipo>/<escopo>-<descrição-curta>`

   * **tipo**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
   * **escopo**: opcional, em letras minúsculas (ex.: `auth`, `ui`)
   * **descrição-curta**: use hífen para separar palavras (ex.: `login-social`)

   *Exemplo:*

   `git checkout -b feat/auth-login-social`

5. **Escrever a mensagem de commit (Conventional Commits)**
   Para cada commit, adote o formato:

   <tipo>[escopo][!]: <descrição>

   * **tipo** (obrigatório): `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
   * **escopo** (opcional): entre parênteses, ex.: `(payment)`
   * **!** (opcional): indica *breaking change*
   * **descrição** (obrigatória): imperativa, curta e clara, ex.: `corrige cálculo de desconto`

6. **[Opcional] Adicionar corpo**
   Após uma linha em branco, detalhe o contexto, a motivação e quaisquer informações relevantes.

7. **[Opcional] Incluir footers**
   Após outra linha em branco, acrescente:

   * `BREAKING CHANGE: descrição completa da quebra de compatibilidade`
   * `<token>: valor` (por exemplo, `Refs: #123`, `Reviewed-by: Nome`)

8. **Executar o commit**
   Submeta suas alterações: `git commit -m "<mensagem-do-commit>"`

- Mantenha as mensagens uniformes e autoexplicativas: isso facilita a leitura do histórico e a geração automática de changelogs.
- Use sempre a branch recém-criada para isolar seu escopo de trabalho e, depois de revisar, faça o *merge* ou abra um *pull request*.
