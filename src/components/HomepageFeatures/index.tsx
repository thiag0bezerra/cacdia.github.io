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
    title: 'Easy to Use',
    Icon: require('@site/static/img/juntos.png').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Icon: require('@site/static/img/avante.png').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Charts Support',
    // agora suportando PNG também
    Icon: require('@site/static/img/graficos.png').default,
    description: (
      <>
        Exemplo de suporte a imagens PNG ou JPG, basta informar o path da
        imagem no require.
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
