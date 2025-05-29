---
mode: 'agent'
description: 'Sincronizar o repositório remoto com o upstream'
---
Siga rigorosamente as seguintes etapas para manter seu fork ou clone sempre alinhado ao repositório original (upstream):

1. **Confirmar remotos configurados**
   Verifique quais remotes você já tem e seus URLs: `git remote -v`

— Você deve ver algo como `origin` (seu fork) e, opcionalmente, `upstream` (o repositório original).

2. **Adicionar o upstream (se ainda não existir)**
   Se não houver um remote chamado `upstream`, adicione-o apontando para o repositório original: `git remote add upstream <URL-do-repositório-original>`

   *Exemplo:*

   `git remote add upstream https://github.com/organização/projeto.git`

3. **Buscar todas as referências do upstream**
   Traga as últimas alterações do upstream (sem mesclar ainda):

   `git fetch upstream`

   — Isso atualizará todos os branches remotos do upstream no seu clone local.

4. **Inspecionar diferenças entre sua branch e o upstream**
   Compare o que mudou no upstream em relação à sua branch local

   `git checkout <branch>`
   `git diff <branch> upstream/<branch>`

   — Assim você vê arquivos acrescentados, modificados ou excluídos antes de aplicar qualquer atualização.

5. **Atualizar a branch principal local**
   Escolha entre **merge** ou **rebase** para incorporar as mudanças do upstream:

   * *Merge* (registra um commit extra de merge):
     `git merge upstream/<branch>`

6. **Enviar atualizações para o seu fork (origin)**
   Empurre as alterações da branch local para o seu repositório remoto:

   ```bash
   git push origin <branch>
   ```
