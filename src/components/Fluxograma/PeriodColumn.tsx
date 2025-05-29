"use client";

import React, { useMemo } from 'react';
import type { Period, Discipline } from './types';
import { DisciplineCard } from './DisciplineCard';
import styles from './fluxograma.module.css';

interface PeriodColumnProps {
  readonly period: Period;
  readonly selectedDisciplineId: string | null;
  readonly dependencyChain: readonly string[];
  readonly prerequisiteIds: readonly string[];
  readonly dependentIds: readonly string[];
  readonly onDisciplineClick: (id: string) => void;
  readonly hasDependencies: boolean;
  readonly disciplineMap: ReadonlyMap<string, Discipline>;
}

/**
 * Componente que renderiza uma coluna de período no fluxograma.
 * Contém todas as disciplinas de um período específico.
 *
 * @param props - Propriedades do componente
 * @returns React.JSX.Element da coluna do período
 */
export function PeriodColumn({
  period,
  selectedDisciplineId,
  dependencyChain,
  prerequisiteIds,
  dependentIds,
  onDisciplineClick,
  hasDependencies,
  disciplineMap,
}: PeriodColumnProps): React.JSX.Element {
  const columnClassName = [
    styles.periodColumn,
    hasDependencies ? styles.periodHighlighted : '',
  ].filter(Boolean).join(' ');

  const periodTitle = period.number === 0 ? 'Optativas' : `Período ${period.number}`;

  const disciplineElements = useMemo(() => {
    return period.disciplines.map((discipline) => {
      const isSelected = selectedDisciplineId === discipline.id;
      const isPrerequisite = !isSelected && prerequisiteIds.includes(discipline.id);
      const isDependent = !isSelected && dependentIds.includes(discipline.id);

      return (
        <div
          key={discipline.id}
          className={styles.disciplineContainer}
        >
          <DisciplineCard
            discipline={discipline}
            isSelected={isSelected}
            isPrerequisite={isPrerequisite}
            isDependent={isDependent}
            onClick={onDisciplineClick}
          />
        </div>
      );
    });
  }, [period.disciplines, selectedDisciplineId, prerequisiteIds, dependentIds, onDisciplineClick]);

  return (
    <div
      className={columnClassName}
      data-highlighted={hasDependencies ? "true" : "false"}
      aria-label={periodTitle}
      aria-labelledby={`period-title-${period.number}`}
      role="region"
    >
      <div className={styles.periodHeader}>
        <h2 id={`period-title-${period.number}`} className={styles.periodHeaderTitle}>{periodTitle}</h2>
      </div>
      <div className={styles.periodDisciplines}>
        {disciplineElements}
      </div>
    </div>
  );
}
