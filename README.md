# CACDIA - Centro Acadêmico de Ciência de Dados e Inteligência Artificial

Site oficial do Centro Acadêmico de Ciência de Dados e Inteligência Artificial da UFPB, construído com [Docusaurus](https://docusaurus.io/).

## 🚀 Funcionalidades

- **Manual do Aluno**: Guia completo com informações essenciais para estudantes
- **Tutoriais**: Conteúdo educativo e guias práticos
- **Blog**: Notícias e atualizações do centro acadêmico
- **Fluxograma Interativo**: Visualização da grade curricular do curso
- **Mapa do CI**: Navegação interativa pelos andares do Centro de Informática
- **Sistema SACI**: Integração com dados acadêmicos

## 🛠️ Tecnologias

- [Docusaurus 3.7.0](https://docusaurus.io/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MDX](https://mdxjs.com/)

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18.0 ou superior
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/cacdia/cacdia.github.io.git
cd cacdia.github.io
```

2. Instale as dependências:
```bash
npm install
```

## 🏃‍♂️ Execução

### Desenvolvimento
```bash
npm run start
```
O site estará disponível em `http://localhost:3000`

### Build de produção
```bash
npm run build
```

### Servir build local
```bash
npm run serve
```

### Deploy
```bash
npm run deploy
```

## 📁 Estrutura do Projeto

```
cacdia.github.io/
├── docs/                     # Documentação em Markdown
│   ├── manual-do-aluno/      # Manual do estudante
│   └── tutoriais/            # Tutoriais diversos
├── src/
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── Fluxograma/       # Componentes do fluxograma interativo
│   │   ├── HomepageFeatures/ # Features da página inicial
│   │   └── Mapa/             # Componentes do mapa do CI
│   ├── css/                  # Estilos customizados
│   └── pages/                # Páginas React
│       ├── fluxograma/       # Página do fluxograma
│       └── mapa/             # Página do mapa do CI
├── static/
│   ├── data/                 # Dados estáticos (JSON, CSV)
│   └── img/                  # Imagens e assets
├── blog/                     # Posts do blog
└── docusaurus.config.ts      # Configuração do Docusaurus
```

## 📝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Adicionando conteúdo

#### Manual do Aluno
Adicione arquivos `.md` em [`docs/manual-do-aluno/`](docs/manual-do-aluno/)

#### Tutoriais
Adicione arquivos `.md` em [`docs/tutoriais/`](docs/tutoriais/)

#### Posts do Blog
Adicione arquivos `.md` em [`blog/`](blog/) seguindo o padrão de nomenclatura com data

## 🗂️ Dados

- **Grade Curricular**: [`static/data/grade_curricular_completa.csv`](static/data/grade_curricular_completa.csv)
- **Mapas do CI**: [`static/data/mapa/`](static/data/mapa/)
- **Dados SACI**: [`static/data/saci/`](static/data/saci/)

## 🔗 Links Úteis

- [Site do Centro de Informática](http://ci.ufpb.br/)
- [Instagram @ciufpb](https://www.instagram.com/ciufpb/)
- [GitHub da Organização](https://github.com/cacdia)

## 📄 Licença

Este projeto é mantido pelo CACDIA - Centro Acadêmico de Ciência de Dados e Inteligência Artificial da UFPB.

## 🤝 Suporte

Para dúvidas ou sugestões, entre em contato através dos canais oficiais do CACDIA.