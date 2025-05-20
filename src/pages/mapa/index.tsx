import React, { useState } from 'react';
import Layout from '@theme/Layout';
import './styles.css';
import subsolo from '@site/static/data/mapa/subsolo.json';
import terreo from '@site/static/data/mapa/terreo.json';
import primeiro from '@site/static/data/mapa/primeiro.json';
import segundo from '@site/static/data/mapa/segundo.json';
import terceiro from '@site/static/data/mapa/terceiro.json';
import saci from '@site/static/data/saci/saci.json';
import Modal from '@site/src/components/Mapa/Modal';
import {
  IconeSalaDeAula,
  IconeSalaProfessor,
  IconeBanheiroMasculino,
  IconeBanheiroFeminino,
  IconeBiblioteca,
  IconeAuditorio,
  IconeLaboratorio,
  IconeLaboratorioDePesquisa,
  IconeGenerico
} from '@site/src/components/Mapa/Icone';

function calculateTransform(
  cx: number,
  cy: number,
  svgW: number,
  svgH: number,
  scale: number
): string {
  const sw = svgW * scale;
  const sh = svgH * scale;
  return `translate(${cx - sw / 2}, ${cy - sh / 2}) scale(${scale})`;
}

function parseSvgPath(d: string): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  try {
    const commands: string[] = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let x = 0, y = 0;

    commands.forEach(cmd => {
      const type: string = cmd[0];
      const args = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);
      switch (type) {
        case 'M': x = args[0]; y = args[1]; break;
        case 'm': x += args[0]; y += args[1]; break;
        case 'L': x = args[0]; y = args[1]; break;
        case 'l': x += args[0]; y += args[1]; break;
        case 'H': x = args[0]; break;
        case 'h': x += args[0]; break;
        case 'V': y = args[0]; break;
        case 'v': y += args[0]; break;
        default:
          for (let i = 0; i < args.length; i += 2) {
            if (i + 1 < args.length) {
              const nx = type === type.toLowerCase() ? x + args[i] : args[i];
              const ny = type === type.toLowerCase() ? y + args[i + 1] : args[i + 1];
              minX = Math.min(minX, nx);
              maxX = Math.max(maxX, nx);
              minY = Math.min(minY, ny);
              maxY = Math.max(maxY, ny);
              if (i === args.length - 2) { x = nx; y = ny; }
            }
          }
      }
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    if (minX === Infinity) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    return { minX, maxX, minY, maxY };
  } catch {
    return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
  }
}

function getSaciRoomInfo(roomTitle: string) {
  if (!saci?.solution?.solution) return null;
  const norm = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const roomNorm = norm(roomTitle);
  for (const sala of saci.solution.solution) {
    if (
      norm(sala.nome) === roomNorm ||
      norm('CI-' + sala.nome) === roomNorm ||
      norm('CI ' + sala.nome) === roomNorm
    ) {
      // Garante que todas as propriedades relevantes estejam presentes
      return {
        ...sala,
        bloco: sala.bloco,
        preferencias: sala.preferencias,
        classes: (sala.classes || []).map((c: any) => ({
          ...c,
          pcd: !!c.pcd,
        })),
      };
    }
  }
  return null;
}

type IconType =
  | 'sala-de-aula'
  | 'sala-de-professor'
  | 'banheiro-masculino'
  | 'banheiro-feminino'
  | 'biblioteca'
  | 'auditorio'
  | 'laboratorio'
  | 'laboratorio-de-pesquisa'
  | 'generico'
  | 'none';

interface PathProps {
  id?: string;
  d: string;
  fill?: string;
  fillRule?: 'nonzero' | 'evenodd';
  stroke?: string;
  strokeWidth?: string;
  strokeLinecap?: 'butt' | 'round';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  type?: IconType;
  title?: string;
  description?: string;
  colorOnHover?: string;
}

const ICON_SIZE = 200;
// nunca passe de 25% do ícone original
const MAX_ICON_SCALE = 0.25;

// Função utilitária para mapear nome de sala para dados do SACI
function getSaciClassesForRoom(roomTitle: string): any[] {
  if (!saci?.solution?.solution) return [];
  // Normaliza nomes: CI-101, CI 101, 101, etc.
  const norm = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const roomNorm = norm(roomTitle);
  for (const sala of saci.solution.solution) {
    if (norm(sala.nome) === roomNorm || norm('CI-' + sala.nome) === roomNorm || norm('CI ' + sala.nome) === roomNorm) {
      // Enriquece os dados das classes com informações da sala
      const classes = sala.classes || [];
      return classes.map(c => ({
        ...c,
        salaNome: sala.nome,
        salaCapacidade: sala.capacidade,
        salaAcessivel: sala.acessivel,
        salaTipo: sala.tipo
      }));
    }
  }
  return [];
}

const Path: React.FC<PathProps & { onRoomClick?: (room: any) => void }> = props => {
  const { id, d, fill, fillRule } = props;
  const type = props.type || 'none';

  if (type === 'none') {
    return (
      <path
        id={id}
        d={d}
        fill={fill}
        fillRule={fillRule}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        strokeLinecap={props.strokeLinecap}
        strokeLinejoin={props.strokeLinejoin}
      />
    );
  }

  // bounding‐box do polígono
  const { minX, maxX, minY, maxY } = parseSvgPath(d);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const width = maxX - minX;
  const height = maxY - minY;

  // escala do ícone (<= MAX_ICON_SCALE)
  const scaleX = width / ICON_SIZE;
  const scaleY = height / ICON_SIZE;
  const iconScale = Math.min(scaleX, scaleY, MAX_ICON_SCALE);

  const iconHeight = ICON_SIZE * iconScale;
  // gap reduzido para aproximar o texto
  const gap = iconHeight * 0.05;
  // gap ainda menor apenas para o título
  const titleGap = 0;

  // Verifica se a sala é acessível
  // Primeiro tenta diretamente pelo SACI
  let roomIsAccessible = false;
  if (type === 'sala-de-aula' && props.title) {
    const saciInfo = getSaciClassesForRoom(props.title);
    if (saciInfo.length > 0) {
      roomIsAccessible = !!saciInfo[0].salaAcessivel;
    }
  }

  let icone: React.ReactNode;
  switch (type) {
    case 'sala-de-aula': icone = <IconeSalaDeAula width={ICON_SIZE} height={ICON_SIZE} acessivel={roomIsAccessible} />; break;
    case 'sala-de-professor': icone = <IconeSalaProfessor width={ICON_SIZE} height={ICON_SIZE} />; break;
    case 'banheiro-masculino': icone = <IconeBanheiroMasculino width={ICON_SIZE} height={ICON_SIZE} />; break;
    case 'banheiro-feminino': icone = <IconeBanheiroFeminino width={ICON_SIZE} height={ICON_SIZE} />; break;
    case 'biblioteca': icone = <IconeBiblioteca width={ICON_SIZE} height={ICON_SIZE} />; break;
    case 'auditorio': icone = <IconeAuditorio width={ICON_SIZE} height={ICON_SIZE} />; break;
    case 'laboratorio': icone = <IconeLaboratorio width={ICON_SIZE} height={ICON_SIZE} />; break;
    case 'laboratorio-de-pesquisa': icone = <IconeLaboratorioDePesquisa width={ICON_SIZE} height={ICON_SIZE} />; break;
    default: icone = <IconeGenerico width={ICON_SIZE} height={ICON_SIZE} />; break;
  }

  // Adiciona informações do SACI se for sala de aula CI-xxx ou SBxx
  let saciClasses: any[] = [];
  if (props.type === 'sala-de-aula' && props.title) {
    saciClasses = getSaciClassesForRoom(props.title);
  }

  const calcFontSize = (base: number, text = ''): number => {
    const MIN = 8;
    if (!text) return base;
    const maxW = text.length * base * 0.8;
    const size = maxW > width ? width / (text.length * 0.8) : base;
    return Math.max(size, MIN);
  };

  return (
    <g>
      <path
        id={id}
        d={d}
        fill={fill}
        fillRule={fillRule}
        className={`mapa-sala ${roomIsAccessible ? 'mapa-sala-acessivel' : ''}`}
        data-type={type}
        onClick={() => {
          if (props.onRoomClick && props.title) {
            const roomInfo = getSaciRoomInfo(props.title);
            if (roomInfo && roomInfo.classes) {
              props.onRoomClick(roomInfo);
            }
          }
        }}
        style={{ cursor: (props.title && getSaciRoomInfo(props.title)?.classes?.length > 0) ? 'pointer' : undefined }}
      />
      <g transform={calculateTransform(cx, cy, ICON_SIZE, ICON_SIZE, iconScale)}>
        {icone}
      </g>
      {/* TITULO: aproximado ainda mais, usando titleGap */}
      {props.title && (() => {
        const lines = props.title.toUpperCase().split(/\s+/);
        const baseSize = 16;
        let fontSize = calcFontSize(baseSize, props.title);
        const lineHeight = fontSize * 1.2;
        const textHeight = lines.length * lineHeight;
        // base da última linha encosta em cy - iconHeight/2 - titleGap
        const startY = cy - iconHeight / 2 - titleGap - textHeight;
        return (
          <text
            x={cx}
            y={startY.toString()}
            fontFamily="Arial"
            fontSize={fontSize.toString()}
            fill="black"
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {lines.map((line, i) => (
              <tspan key={i} x={cx} dy={i === 0 ? 0 : lineHeight}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })()}
      {/* DESCRIPTION: permanece colado logo abaixo do ícone */}
      {props.description && (() => {
        const lines = props.description.toUpperCase().split(/\s+/);
        const baseSize = 12;
        let fontSize = calcFontSize(baseSize, props.description);
        const lineHeight = fontSize * 1.2;
        const startY = cy + iconHeight / 2 + gap;
        return (
          <text
            x={cx}
            y={startY.toString()}
            fontFamily="Arial"
            fontSize={fontSize.toString()}
            fill="black"
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {lines.map((line, i) => (
              <tspan key={i} x={cx} dy={i === 0 ? 0 : lineHeight}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })()}
    </g>
  );
};

//////////////////////////
// COMPONENTE DE PISO   //
//////////////////////////

interface SalaJSON {
  id: string;
  d: string;
  fill?: string;
  fillRule?: 'evenodd' | 'nonzero';
  type?: IconType;
  title?: string;
  description?: string;
  colorOnHover?: string;
}

interface FloorProps {
  svgId: string;
  data: SalaJSON[];
  onRoomClick?: (room: any) => void;
}

const Floor: React.FC<FloorProps> = ({ svgId, data, onRoomClick }) => {
  const validData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter(item => item && typeof item === 'object' && item.d)
      .map((item, idx) => ({
        ...item,
        id: item.id || `sala-${idx}`
      }));
  }, [data]);

  const customHoverStyles = validData
    .filter(c => c.colorOnHover && c.id)
    .map(
      c => `#${svgId} path#${c.id}:hover {
        fill: ${c.colorOnHover};
        stroke: red;
        stroke-width: 3px;
        transition: fill 0.3s;
      }`
    )
    .join('\n');

  return (
    <>
      <style>{customHoverStyles}</style>
      <svg
        id={svgId}
        viewBox="0 0 960 540"
        fill="none"
        stroke="none"
        strokeLinecap="square"
        strokeMiterlimit={10}
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby={`${svgId}-title`}
        role="img"
      >
        <title id={`${svgId}-title`}>Mapa do {svgId}</title>
        <desc>Mapa detalhado do {svgId} do Centro de Informática</desc>
        {validData.map((sala, idx) => (
          <Path key={`${svgId}-${idx}`} {...sala} onRoomClick={onRoomClick} />
        ))}
      </svg>
    </>
  );
};

export const Subsolo = (props: { onRoomClick?: (room: any) => void }) => {
  try {
    return <Floor svgId="subsolo" data={(subsolo || []) as SalaJSON[]} onRoomClick={props.onRoomClick} />;
  } catch (error) {
    console.error("Erro ao renderizar Subsolo:", error);
    return <div role="alert">Erro ao carregar o mapa do subsolo</div>;
  }
};

export const Terreo = (props: { onRoomClick?: (room: any) => void }) => {
  try {
    return <Floor svgId="terreo" data={(terreo || []) as SalaJSON[]} onRoomClick={props.onRoomClick} />;
  } catch (error) {
    console.error("Erro ao renderizar Terreo:", error);
    return <div role="alert">Erro ao carregar o mapa do térreo</div>;
  }
};

export const PrimeiroAndar = (props: { onRoomClick?: (room: any) => void }) => {
  try {
    return <Floor svgId="primeiro-andar" data={(primeiro || []) as unknown as SalaJSON[]} onRoomClick={props.onRoomClick} />;
  } catch (error) {
    console.error("Erro ao renderizar PrimeiroAndar:", error);
    return <div role="alert">Erro ao carregar o mapa do primeiro andar</div>;
  }
};

export const SegundoAndar = (props: { onRoomClick?: (room: any) => void }) => {
  try {
    return <Floor svgId="segundo-andar" data={(segundo || []) as SalaJSON[]} onRoomClick={props.onRoomClick} />;
  } catch (error) {
    console.error("Erro ao renderizar SegundoAndar:", error);
    return <div role="alert">Erro ao carregar o mapa do segundo andar</div>;
  }
};

export const TerceiroAndar = (props: { onRoomClick?: (room: any) => void }) => {
  try {
    return <Floor svgId="terceiro-andar" data={(terceiro || []) as SalaJSON[]} onRoomClick={props.onRoomClick} />;
  } catch (error) {
    console.error("Erro ao renderizar TerceiroAndar:", error);
    return <div role="alert">Erro ao carregar o mapa do terceiro andar</div>;
  }
};

export default function MapaPage() {
  const [andar, setAndar] = useState<'subsolo' | 'terreo' | 'primeiro' | 'segundo' | 'terceiro'>('terreo');
  const [modalRoom, setModalRoom] = useState<any | null>(null);

  const buttonRefs = {
    subsolo: React.useRef<HTMLButtonElement>(null),
    terreo: React.useRef<HTMLButtonElement>(null),
    primeiro: React.useRef<HTMLButtonElement>(null),
    segundo: React.useRef<HTMLButtonElement>(null),
    terceiro: React.useRef<HTMLButtonElement>(null)
  };

  const handleKeyDown = (event: React.KeyboardEvent, floor: typeof andar) => {
    const floors = ['subsolo', 'terreo', 'primeiro', 'segundo', 'terceiro'] as const;
    const idx = floors.indexOf(floor);
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setAndar(floor);
    } else if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const next = floors[(idx + 1) % floors.length];
      buttonRefs[next].current?.focus();
    } else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      const prev = floors[(idx - 1 + floors.length) % floors.length];
      buttonRefs[prev].current?.focus();
    }
  };

  let FloorComponent;
  switch (andar) {
    case 'subsolo': FloorComponent = <Subsolo onRoomClick={setModalRoom} />; break;
    case 'terreo': FloorComponent = <Terreo onRoomClick={setModalRoom} />; break;
    case 'primeiro': FloorComponent = <PrimeiroAndar onRoomClick={setModalRoom} />; break;
    case 'segundo': FloorComponent = <SegundoAndar onRoomClick={setModalRoom} />; break;
    case 'terceiro': FloorComponent = <TerceiroAndar onRoomClick={setModalRoom} />; break;
    default: FloorComponent = <Terreo onRoomClick={setModalRoom} />;
  }

  return (
    <Layout title="Mapa" description="Mapas do Centro de Informática">
      <div className="container margin-vert--md">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <nav aria-label="Seleção de andar" className="mapa-andar-nav" role="group">
            {(['subsolo', 'terreo', 'primeiro', 'segundo', 'terceiro'] as const).map(f => (
              <button
                key={f}
                ref={buttonRefs[f]}
                type="button"
                className={`mapa-andar-btn ${andar === f ? 'selected' : ''}`}
                onClick={() => setAndar(f)}
                onKeyDown={e => handleKeyDown(e, f)}
                aria-pressed={andar === f}
                aria-label={`Selecionar ${f === 'terreo' ? 'térreo' : f}`}
                tabIndex={0}
              >
                {f === 'primeiro' ? '1º Andar'
                  : f === 'segundo' ? '2º Andar'
                    : f === 'terceiro' ? '3º Andar'
                      : f === 'terreo' ? 'Térreo'
                        : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        {FloorComponent}
        <Modal room={modalRoom} onClose={() => setModalRoom(null)} />
      </div>
    </Layout>
  );
}
