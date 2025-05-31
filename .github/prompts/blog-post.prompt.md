---
mode: 'agent'
description: 'Gerenciar um Post no Blog'
---
# Gerenciar um Post no Blog

## Visão Geral

1. Criar arquivo `.md` ou `.mdx` em [`blog`](./blog) com nome formado por `blog/YYYY-MM-DD-titulo/index.md`.
2. Preencher front matter (título, descrição, slug, autores, tags, imagem, etc.).
3. Escrever conteúdo em Markdown, usando `<!-- truncate -->` para resumo.
4. (Em `.mdx`) usar `{/* truncate */}` e importar componentes React se necessário.

## Detalhes do Processo


1. **Criar o arquivo Markdown do post**

   * Dentro da pasta `blog`, crie um diretório usando o formato de nome que contenha a data e o título do post e dentro dela um arquivo 'index' com format `.md` (ou `.mdx`). O padrão recomendado é:


     blog/YYYY-MM-DD-meu-primeiro-post/index.md

   * O Docusaurus extrai automaticamente a data do próprio nome do diretório, gerando a data de publicação.

2. **Adicionar o front matter essencial**

   * No início do seu arquivo Markdown, inclua um bloco de front matter delimitado por três traços (`---`).
   * Os campos mais comuns são:

     ---
     title: "Título do Meu Post"
     description: "Uma breve descrição (opcional, mas recomendado para SEO)"
     slug: "meu-primeiro-post"          # opcional; se omitido, é derivado do nome do arquivo
     authors:
       - name: "Seu Nome"
         title: "Cargo ou Função"       # opcional
         url: "https://seu-perfil.com"  # opcional
         image_url: "https://..."       # opcional; avatar ou imagem do autor
         socials:
           github: seu-usuario           # opcional
           x: seu-usuario               # opcional (antes Twitter)
     tags: ["exemplo", "docusaurus"]    # lista de categorias ou etiquetas (opcional)
     image: "https://i.imgur.com/exemplo.png"  # URL de uma imagem de destaque (opcional)
     hide_table_of_contents: false     # exibe (false) ou oculta (true) o sumário do post
     ---

   * Se você omitir campos como `slug`, Docusaurus gerará valores padrão (por exemplo, extraindo o slug do nome do diretório).

3. **Escrever o conteúdo do post em Markdown (ou MDX)**

   * Após o front matter, escreva seu texto em Markdown normalmente.
   * Para exibir uma prévia (“resumo”) na lista de posts, utilize o marcador `<!-- truncate -->`. Tudo que estiver acima dele será mostrado como introdução na página `/blog`. Exemplo:


     ---
     title: "Exemplo de Truncamento em Markdown"
     ---

     Estas linhas aparecerão na listagem de posts como resumo.

     <!-- truncate -->

     A partir daqui, fica fora do resumo e só aparece quando o usuário clica no post.

   * Caso seu arquivo seja `.mdx` (para permitir JSX/Componentes React), use a sintaxe equivalente de comentário MDX:


     ---
     title: "Exemplo de Truncamento em MDX"
     ---

     Estas linhas aparecerão na listagem de posts como resumo.

     {/* truncate */}

     A partir daqui, fica fora do resumo e só aparece quando o usuário clica no post.

   * Certifique-se de que o trecho acima do truncate seja um Markdown renderizável sozinho (sem referências a seções que só existem depois).

4. **Selecionar o tipo de arquivo: .md ou .mdx**

   * **`.md`**: use quando seu blog for puramente em Markdown estático.
   * **`.mdx`**: use quando quiser inserir componentes React diretamente no conteúdo (por exemplo, `<YouTube videoId="..." />`, gráficos personalizados, etc.).
   * Atenção ao formato de truncate:

     * Em `.md`, use `<!-- truncate -->`.
     * Em `.mdx`, use `{/* truncate */}`.

5. **Definir a data e slug através do nome do arquivo (padrões de extração de data)**

   * Para que o Docusaurus reconheça automaticamente a data de publicação, o nome do arquivo deve seguir um dos formatos abaixo:

     * `YYYY-MM-DD-meu-post/index.md`

6. **Publicar tags, autores e imagem de destaque (opcional, mas recomendado)**

   * **Tags**: ajudam na categorização e navegação dentro do blog. No front matter, defina algo como:

     tags:
       - “javascript”
       - “docusaurus”

   * **Autores**: para atribuir crédito e exibir perfil dos autores, use a seção `authors` no front matter, listando um ou mais nomes, URLs e outras informações (como ilustrado no passo 3).
   * **Imagem de destaque**: especifique a propriedade `image` apontando para uma URL pública ou caminho relativo dentro de `static/`. Essa imagem será exibida como capa em visualizações sociais (Open Graph) e, dependendo do tema, como thumbnail na listagem de posts.

7. **Sintaxe avançada e componentes MDX (quando aplicável)**

   * Caso utilize um arquivo `.mdx`, você pode inserir componentes React diretamente. Por exemplo, para adicionar um vídeo do YouTube:


     import YouTube from '@site/src/components/YouTube';

     ---
     title: "Integrando Vídeo em MDX"
     ---

     Este é um parágrafo introdutório.

     {/* truncate */}

     <YouTube videoId="dQw4w9WgXcQ" />

     Mais conteúdo em Markdown e MDX...

   * Lembre-se de que, ao usar MDX, a sintaxe de truncamento é `{/* truncate */}` e você pode importar componentes usando caminhos relativos a partir de `src/`.
