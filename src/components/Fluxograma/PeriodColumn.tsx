import React, { useMemo } from 'react';
import { Period, Discipline } from './types';
import { DisciplineCard } from './DisciplineCard';

interface PeriodColumnProps {
  period: Period;
  selectedDisciplineId: string | null;
  dependencyChain: string[];
  prerequisiteIds: string[];
  dependentIds: string[];
  onDisciplineClick: (id: string) => void;
  hasDependencies: boolean;
  disciplineMap: Map<string, Discipline>;
}

export function PeriodColumn({
  period,
  selectedDisciplineId,
  dependencyChain,
  prerequisiteIds,
  dependentIds,
  onDisciplineClick,
  hasDependencies,
  disciplineMap,
}: PeriodColumnProps) {
  const columnClassName = hasDependencies 
    ? 'period-column period-highlighted'
    : 'period-column';

  const periodTitle = period.number === 0 ? 'Optativas' : `Período ${period.number}`;

  return (
    <div 
      className={columnClassName}
      data-highlighted={hasDependencies ? "true" : "false"}
      aria-label={periodTitle}
      aria-labelledby={`period-title-${period.number}`}
      role="region"
    >
      <div className="period-header">
        <h2 id={`period-title-${period.number}`}>{periodTitle}</h2>
      </div>
      <div className="period-disciplines">
        {period.disciplines.map((discipline) => {
          const isSelected = selectedDisciplineId === discipline.id;
          const isPrerequisite = !isSelected && prerequisiteIds.includes(discipline.id);
          const isDependent = !isSelected && dependentIds.includes(discipline.id);
          return (
            <div 
              key={discipline.id}
              className="discipline-container"
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
        })}
      </div>
    </div>
  );
}
