import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CACDIA",
  description: "Centro Acadêmico de Ciência de Dados e Inteligência Artificial",
  lang: 'pt-BR',
  lastUpdated: true,
  cleanUrls: true,
  base: '/', // Configuração para GitHub Pages (use '/repositorio/' se não for usar domínio personalizado)
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Manual do Aluno', link: '/manual-do-aluno/' },
      { text: 'Guias', link: '/guias/' }
    ],

    sidebar: {
      '/manual-do-aluno/': [
        {
          text: 'Manual do Aluno',
          items: [
            { text: 'Visão Geral', link: '/manual-do-aluno/' },
            { text: 'Ingresso', link: '/manual-do-aluno/ingresso' },
            { text: 'Calendário Acadêmico', link: '/manual-do-aluno/calendario' },
            { text: 'Auxílios Estudantis', link: '/manual-do-aluno/auxilios-estudantis' },
            { text: 'Centro de Informática', link: '/manual-do-aluno/centro-informatica' },
            { text: 'Opções de Alimentação', link: '/manual-do-aluno/opcoes-alimentacao' },
            { text: 'Transporte entre Unidades', link: '/manual-do-aluno/transporte' },
          ]
        },
        {
          text: 'Perguntas Frequentes',
          items: [
            { text: 'Professores e Disciplinas', link: '/manual-do-aluno/faq/professores-disciplinas' },
            { text: 'Processos Administrativos', link: '/manual-do-aluno/faq/processos-administrativos' },
            { text: 'Grupos de Disciplinas', link: '/manual-do-aluno/faq/grupos-disciplinas' },
            { text: 'Horários e Locais', link: '/manual-do-aluno/faq/horarios-locais' },
            { text: 'Avaliações e Provas', link: '/manual-do-aluno/faq/avaliacoes-provas' },
            { text: 'Requisitos Acadêmicos', link: '/manual-do-aluno/faq/requisitos-academicos' },
            { text: 'Estágio e TCC', link: '/manual-do-aluno/faq/estagio-tcc' },
            { text: 'Infraestrutura e Serviços', link: '/manual-do-aluno/faq/infraestrutura-servicos' },
            { text: 'Gestão Acadêmica', link: '/manual-do-aluno/faq/gestao-academica' },
            { text: 'Documentação', link: '/manual-do-aluno/faq/documentacao' },
          ]
        }
      ],
      '/guias/': [
        {
          text: 'Guias de Programação',
          items: [
            { text: 'Introdução', link: '/guias/' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cacdia' }
    ],
    
    footer: {
      message: 'Desenvolvido com VitePress',
      copyright: `Copyright © ${new Date().getFullYear()} CACDIA - Centro Acadêmico de Ciência de Dados e Inteligência Artificial`
    },
    
    outline: {
      level: 'deep',
      label: 'Nesta página'
    },
    
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Pesquisar',
                buttonAriaLabel: 'Pesquisar documentação'
              },
              modal: {
                noResultsText: 'Nenhum resultado encontrado',
                resetButtonTitle: 'Limpar pesquisa',
                footer: {
                  selectText: 'selecionar',
                  navigateText: 'navegar',
                  closeText: 'fechar'
                }
              }
            }
          }
        }
      }
    },
    
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página'
    }
  }
})
