import React, { useEffect, useState } from "react";
import { CourseFlowchart } from "../../components/Fluxograma/CourseFlowchart";
import type {
  Course,
  Discipline,
  Period,
} from "@site/src/components/Fluxograma/types";
import Layout from "@theme/Layout";

/**
 * Interface para dados temporários de disciplinas durante o parsing do CSV.
 */
interface TempDisciplineData {
  readonly name: string;
  readonly periodRaw: string;
  readonly periodNumber: number;
  readonly credits: number;
  readonly prerequisites: readonly string[];
  readonly isOptativa: boolean;
}

/**
 * Interface para dados de período durante a construção do curso.
 */
interface PeriodData {
  readonly number: number;
  readonly disciplines: Discipline[];
}

/**
 * Função utilitária para ler e processar o CSV.
 * Converte dados CSV em estrutura de curso tipada.
 *
 * @param csvText - Conteúdo do arquivo CSV
 * @returns Course tipado com todas as disciplinas e períodos
 * @throws Error se o CSV for inválido
 */
function parseCSVToCourse(csvText: string): Course {
  // Normaliza nomes de colunas
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV inválido: sem dados.");
  const header = lines[0].split(",").map((h) => h.trim());
  // Índices conforme o novo esquema do CSV
  const periodIdx = header.findIndex((h) =>
    h.toLowerCase().startsWith("período")
  );
  const nameIdx = header.findIndex((h) =>
    h.toLowerCase().includes("disciplinas")
  );
  const creditsIdx = header.findIndex((h) =>
    h.toLowerCase().includes("créditos")
  );
  const prereqIdxs = [
    header.findIndex((h) => h.toLowerCase().includes("pré-requisito 1")),
    header.findIndex((h) => h.toLowerCase().includes("pré-requisito 2")),
    header.findIndex((h) => h.toLowerCase().includes("pré-requisito 3")),
  ];

  if (periodIdx < 0 || nameIdx < 0 || creditsIdx < 0) {
    throw new Error("CSV inválido: colunas essenciais ausentes.");
  }

  // Primeiro passo: coleta todas as disciplinas e seus períodos para criar o mapa nome -> id
  const nameToIdMap = new Map<string, string>();
  const tempDisciplines: TempDisciplineData[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Suporte a nomes de disciplinas com vírgula: split limitado ao número de colunas
    const row = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g);
    if (row.length < header.length) continue;

    const periodRaw = row[periodIdx]?.trim() ?? "";
    const isOptativa = /optativa/i.test(periodRaw);
    const periodNumber = isOptativa
      ? 0
      : /^p(\d+)$/i.test(periodRaw)
      ? Number(periodRaw.replace(/\D/g, ""))
      : 0;
    const name = row[nameIdx]?.trim() ?? "";
    const credits = Number(row[creditsIdx]?.trim() || "0");

    // Pré-requisitos: coleta das três colunas
    const prereqs = prereqIdxs
      .map((idx) => (idx >= 0 ? row[idx]?.trim() ?? "" : ""))
      .filter(Boolean);

    // Gera id único: nome + período para evitar duplicidade
    const id = `${name}__${periodRaw}`;
    // Armazena o mapeamento do nome para o ID
    nameToIdMap.set(name, id);
    // Armazena os dados da disciplina temporariamente
    tempDisciplines.push({
      name,
      periodRaw,
      periodNumber,
      credits,
      prerequisites: prereqs,
      isOptativa,
    });
  }

  // Segundo passo: cria as disciplinas com os pré-requisitos corretos usando os IDs
  const periodMap = new Map<string, PeriodData>();

  for (const disc of tempDisciplines) {
    const {
      name,
      periodRaw,
      periodNumber,
      credits,
      prerequisites,
      isOptativa,
    } = disc;
    // Gera id único: nome + período para evitar duplicidade
    const id = nameToIdMap.get(name);
    if (!id) continue;

    // Converte os nomes dos pré-requisitos para IDs
    const prereqIds = prerequisites
      .map((prereqName) => nameToIdMap.get(prereqName))
      .filter((prereqId): prereqId is string => Boolean(prereqId));

    const periodKey = isOptativa ? "Optativa" : periodRaw || "0";
    if (!periodMap.has(periodKey)) {
      periodMap.set(periodKey, { number: periodNumber, disciplines: [] });
    }

    const currentPeriod = periodMap.get(periodKey);
    if (currentPeriod) {
      currentPeriod.disciplines.push({
        id,
        code: undefined, // Não há código no novo CSV
        name,
        credits,
        prerequisites: prereqIds,
      });
    }
  }
  // Ordena períodos numericamente, optativas no final
  const periods: Period[] = Array.from(periodMap.entries())
    .sort(([a], [b]) => {
      if (a === "Optativa") return 1;
      if (b === "Optativa") return -1;
      return Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, ""));
    })
    .map(([, value]) => value as Period);

  return {
    id: "grade-csv",
    name: "Grade Curricular",
    periods,
  };
}

/**
 * Hook customizado para carregar curso a partir de arquivo CSV.
 *
 * @param csvPath - Caminho para o arquivo CSV
 * @returns Course ou null se ainda carregando
 */
function useCourseFromCSV(csvPath: string): Course | null {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetch(csvPath)
      .then((res) => res.text())
      .then((text) => setCourse(parseCSVToCourse(text)))
      .catch((error) => {
        console.error("Erro ao carregar grade curricular:", error);
        setCourse(null);
      });
  }, [csvPath]);

  return course;
}

/**
 * Página do fluxograma do curso.
 * Carrega dados do CSV e renderiza o fluxograma interativo.
 *
 * @returns React.JSX.Element da página
 */
export default function FluxogramaPage(): React.JSX.Element {
  const course = useCourseFromCSV("/data/grade_curricular_completa.csv");
  if (!course) {
    return <div>Carregando fluxograma...</div>;
  }
  return (
    <Layout>
      <CourseFlowchart course={course} />
    </Layout>
  );
}
