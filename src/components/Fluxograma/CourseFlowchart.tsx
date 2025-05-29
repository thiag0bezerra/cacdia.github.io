"use client";

import React, { useMemo, useEffect, useState } from 'react';
import type { Course } from './types';
import { PeriodColumn } from './PeriodColumn';
import { useDisciplineSelection } from './useDisciplineSelection';
import styles from './fluxograma.module.css';

interface CourseFlowchartProps {
  readonly course: Course;
}

/**
 * Renderiza o fluxograma do curso, exibindo períodos e disciplinas.
 * Pronto para produção: chaves únicas, memoização correta, acessibilidade e comentários.
 * O disciplineMap é criado no hook e repassado para todos os componentes que precisam.
 *
 * @param props - Propriedades do componente
 * @returns React.JSX.Element do fluxograma completo
 */
export function CourseFlowchart({ course }: CourseFlowchartProps): React.JSX.Element {
  // Estado para controlar a classe 'loaded' e exibir o fluxograma
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Garante que a animação só ocorre após o mount
    setLoaded(true);
  }, []);

  // Hook customizado centraliza seleção e mapa de disciplinas
  const {
    selectedDisciplineId,
    dependencyChain,
    prerequisiteIds,
    dependentIds,
    handleDisciplineClick,
    disciplineMap, // disciplineMap agora vem do hook
  } = useDisciplineSelection(course);

  // Identifica períodos que contêm disciplinas na cadeia de dependências
  const periodsWithDependencies = useMemo(() => {
    if (!selectedDisciplineId) return new Map<number, boolean>();
    const map = new Map<number, boolean>();
    course.periods.forEach((period) => {
      const hasDep = period.disciplines.some((d) => dependencyChain.includes(d.id));
      map.set(period.number, hasDep);
    });
    return map;
  }, [selectedDisciplineId, dependencyChain, course.periods]);

  const containerClassName = [
    styles.flowchartContainer,
    loaded ? 'loaded' : '',
    selectedDisciplineId ? styles.hasSelection : '',
  ].filter(Boolean).join(' ');

  const periodElements = useMemo(() => {
    return course.periods.map((period) => (
      <div key={period.number}>
        <PeriodColumn
          period={period}
          selectedDisciplineId={selectedDisciplineId}
          dependencyChain={dependencyChain}
          prerequisiteIds={prerequisiteIds}
          dependentIds={dependentIds}
          onDisciplineClick={handleDisciplineClick}
          hasDependencies={!!periodsWithDependencies.get(period.number)}
          disciplineMap={disciplineMap}
        />
      </div>
    ));
  }, [
    course.periods,
    selectedDisciplineId,
    dependencyChain,
    prerequisiteIds,
    dependentIds,
    handleDisciplineClick,
    periodsWithDependencies,
    disciplineMap,
  ]);

  return (
    <div
      className={containerClassName}
      aria-label="Fluxograma do curso"
      role="region"
    >
      <div className={styles.flowchartScrollArea}>
        <div className={styles.periodsContainer}>
          {periodElements}
        </div>
      </div>
    </div>
  );
}
