import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { CourseFlowchart } from '@site/src/components/Fluxograma/CourseFlowchart';
import { Course } from '@site/src/components/Fluxograma/types';
import './styles.css';

// Função utilitária para ler e processar o CSV
function parseCSVToCourse(csvText: string): Course {
  // Normaliza nomes de colunas
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error('CSV inválido: sem dados.');
  const header = lines[0].split(',').map(h => h.trim());
  // Índices conforme o novo esquema do CSV
  const periodIdx = header.findIndex(h => h.toLowerCase().startsWith('período'));
  const nameIdx = header.findIndex(h => h.toLowerCase().includes('disciplinas'));
  const creditsIdx = header.findIndex(h => h.toLowerCase().includes('créditos'));
  const prereqIdxs = [
    header.findIndex(h => h.toLowerCase().includes('pré-requisito 1')),
    header.findIndex(h => h.toLowerCase().includes('pré-requisito 2')),
    header.findIndex(h => h.toLowerCase().includes('pré-requisito 3')),
  ];

  if (periodIdx < 0 || nameIdx < 0 || creditsIdx < 0) {
    throw new Error('CSV inválido: colunas essenciais ausentes.');
  }

  // Agrupa disciplinas por período
  const periodMap = new Map<string, { number: number; disciplines: any[] }>();
  for (let i = 1; i < lines.length; i++) {
    // Suporte a nomes de disciplinas com vírgula: split limitado ao número de colunas
    const row = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g);
    if (row.length < header.length) continue;
    const periodRaw = row[periodIdx]?.trim();
    const isOptativa = /optativa/i.test(periodRaw);
    const periodNumber = isOptativa ? 0 : (/^p(\d+)$/i.test(periodRaw) ? Number(periodRaw.replace(/\D/g, '')) : 0);
    const name = row[nameIdx]?.trim();
    const credits = Number(row[creditsIdx]?.trim() || '0');
    // Não há código no novo CSV
    const code = undefined;
    // Gera id único: nome + período para evitar duplicidade
    const id = `${name}__${periodRaw}`;
    // Pré-requisitos: coleta das três colunas
    const prereqs = prereqIdxs
      .map(idx => (idx >= 0 ? row[idx]?.trim() : ''))
      .filter(Boolean);
    const periodKey = isOptativa ? 'Optativa' : (periodRaw || '0');
    if (!periodMap.has(periodKey)) {
      periodMap.set(periodKey, { number: periodNumber, disciplines: [] });
    }
    periodMap.get(periodKey)!.disciplines.push({ id, code, name, credits, prerequisites: prereqs });
  }
  // Ordena períodos numericamente, optativas no final
  const periods = Array.from(periodMap.entries())
    .sort(([a], [b]) => {
      if (a === 'Optativa') return 1;
      if (b === 'Optativa') return -1;
      return Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, ''));
    })
    .map(([, value]) => value);
  return {
    id: 'grade-csv',
    name: 'Grade Curricular',
    periods,
  };
}

function useCourseFromCSV(csvPath: string): Course | null {
  const [course, setCourse] = useState<Course | null>(null);
  useEffect(() => {
    fetch(csvPath)
      .then(res => res.text())
      .then(text => setCourse(parseCSVToCourse(text)));
  }, [csvPath]);
  return course;
}

export default function FluxogramaPage() {
  const course = useCourseFromCSV('/data/grade_curricular_completa.csv');
  return (
    <Layout title="Fluxograma" description="Fluxograma do curso">
      <div className="container margin-vert--md">
        {course ? <CourseFlowchart course={course} /> : <p>Carregando grade curricular...</p>}
      </div>
    </Layout>
  );
}
