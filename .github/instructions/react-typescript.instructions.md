---
applyTo: "**/*.{ts,tsx}"
---

# Convenções de Desenvolvimento do Projeto: TypeScript 5 + React 19 (2025)

## 1. Segurança de Tipos
- **Strict Mode**
  - Ative `strict: true` no `tsconfig.json`.
  - Prefira tipos explícitos (`Props`, `State`, genéricos) em vez de `any` ou `// @ts-ignore`.
- **Modelagem de Domínios**
  - Use `interface` para contratos públicos (props, context, API).
  - Use `type` para uniões, interseções e utilitários (`Partial`, `Record`, `Omit`).
  - Mantenha cada tipo coeso e com responsabilidade única.

## 2. Imutabilidade
- Declare dados imutáveis com `const` e campos `readonly`.
- Nunca mutacione props ou state diretamente; use imersão (`immer`) ou padrões funcionais (`map`, `filter`, `spread`).

## 3. Estrutura de Componentes
- **Componentes Funcionais**
  - Apenas funções: `function MeuComponente(props: Props) { … }`.
  - Todo comportamento assíncrono deve usar hooks (ex.: `useEffect`, `useTransition`, `useSyncExternalStore`).
- **Server & Client Components**
  - Separe arquivos com sufixos:
    - `.server.tsx` → lógica sem estado de interface (SSR, data fetching via Suspense).
    - `.client.tsx` → interatividade (eventos, effects).
  - No topo de cada arquivo client, adicione `"use client"`.

## 4. Hooks Personalizados
- Comece nomes com `use*`, ex.: `useAuth`, `useFetchPosts`.
- Responsabilidade única: cada hook faz apenas uma coisa (separação de concerns).
- Declare dependências explicitamente em arrays de deps.

## 5. Estado & Dados
- **State Local**: `useState` ou `useReducer` para lógica complexa.
- **State Global**: Context API tipada ou bibliotecas compatíveis (Recoil, Zustand, Redux Toolkit) com `useSyncExternalStore`.
- **Data Fetching**:
  - Utilize Suspense + React 19 “use” hook para promessas.
  - Co-locar lógica de dados em hooks customizados.

## 6. Sintaxe Moderna
- Optional chaining (`obj?.prop`) e nullish coalescing (`valor ?? padrão`).
- Imports dinâmicos (`import(…)`) para code-splitting.
- Fragmento abreviado (`<>…</>`), shorthand para props booleanas (`<Botao disabled />`).

## 7. Estilos
- **Recomendado**:
  - CSS Modules (tipados via `*.module.css`).
- **Evitar**: estilos inline extensos ou classes “mágicas” sem validação de tipo.

## 8. Organização de Imports
- Use aliases no `tsconfig.json` (`@/components`, `@/hooks`).
- Prefira imports absolutos; evite `../../../`.
- Barrels (`index.ts`) só quando simplificam a navegação, sem esconder dependências.

## 9. Documentação & Exemplos
- JSDoc em APIs públicas e hooks:
  ```ts
  /**
   * Busca lista de posts paginados.
   * @param page número da página
   * @returns {Promise<Post[]>}
   */
  async function fetchPosts(page: number): Promise<Post[]> { … }
  ```
