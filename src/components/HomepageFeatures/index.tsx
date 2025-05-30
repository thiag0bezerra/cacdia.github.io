import type { ReactNode, ComponentType, ComponentProps } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  /** pode ser componente SVG ou string com URL/path da imagem */
  Icon: ComponentType<ComponentProps<'svg'>> | string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Comunidade Colaborativa',
    Icon: require('@site/static/img/juntos.png').default,
    description: (
      <>
        Conectamos alunos, veteranos e professores do curso de CDIA,
        promovendo troca de conhecimentos e experiências para fortalecer
        a jornada acadêmica de toda a comunidade.
      </>
    ),
  },
  {
    title: 'Manual do Aluno',
    Icon: require('@site/static/img/avante.png').default,
    description: (
      <>
        Guia completo com FAQ, processos administrativos, orientações
        práticas e tudo que você precisa para navegar pela vida acadêmica
        no Centro de Informática da UFPB.
      </>
    ),
  },
  {
    title: 'Recursos Interativos',
    Icon: require('@site/static/img/graficos.png').default,
    description: (
      <>
        Fluxograma interativo da grade curricular, mapa navegável do CI
        e visualizações que facilitam o planejamento acadêmico e a
        localização no campus.
      </>
    ),
  },
];

function Feature({ title, Icon, description }: FeatureItem) {
  const isSvgComponent = typeof Icon !== 'string';

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {isSvgComponent ? (
          <Icon className={styles.featureSvg} role="img" />
        ) : (
          <img
            src={Icon}
            className={styles.featureSvg}
            role="img"
            alt={title}
          />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
