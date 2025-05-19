import React, { useMemo } from 'react';
import { Period, Discipline } from './types';
import { DisciplineCard } from './DisciplineCard';

interface PeriodColumnProps {
  period: Period;
  selectedDisciplineId: string | null;
  dependencyChain: string[];
  onDisciplineClick: (id: string) => void;
  hasDependencies: boolean;
  disciplineMap: Map<string, Discipline>;
}

export function PeriodColumn({
  period,
  selectedDisciplineId,
  dependencyChain,
  onDisciplineClick,
  hasDependencies,
  disciplineMap,
}: PeriodColumnProps) {
  const columnClassName = hasDependencies 
    ? 'period-column period-highlighted'
    : 'period-column';

  const dependencyInfo = useMemo(() => {
    if (!selectedDisciplineId) return {};
    const info: Record<string, { isPrerequisite: boolean; isDependent: boolean }> = {};
    dependencyChain.forEach((id) => {
      if (id === selectedDisciplineId) return;
      info[id] = {
        isPrerequisite: isDisciplinePrerequisiteOf(id, selectedDisciplineId, disciplineMap),
        isDependent: isDisciplineDependentOf(id, selectedDisciplineId, disciplineMap),
      };
    });
    return info;
  }, [selectedDisciplineId, dependencyChain, disciplineMap]);

  // Exibe 'Optativas' se o período for optativo
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
          const depInfo = dependencyInfo[discipline.id] || { isPrerequisite: false, isDependent: false };
          return (
            <div 
              key={discipline.id}
              className="discipline-container"
            >
              <DisciplineCard
                discipline={discipline}
                isSelected={isSelected}
                isPrerequisite={depInfo.isPrerequisite}
                isDependent={depInfo.isDependent}
                onClick={onDisciplineClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isDisciplinePrerequisiteOf(prereqId: string, targetId: string, disciplineMap: Map<string, Discipline>, visited: Set<string> = new Set()): boolean {
  if (visited.has(targetId)) return false;
  visited.add(targetId);
  const target = disciplineMap.get(targetId);
  if (!target) return false;
  if (target.prerequisites.includes(prereqId)) return true;
  return target.prerequisites.some(pid => isDisciplinePrerequisiteOf(prereqId, pid, disciplineMap, visited));
}

function isDisciplineDependentOf(depId: string, selectedId: string, disciplineMap: Map<string, Discipline>, visited: Set<string> = new Set()): boolean {
  if (visited.has(depId)) return false;
  visited.add(depId);
  const discipline = disciplineMap.get(depId);
  if (!discipline) return false;
  if (discipline.prerequisites.includes(selectedId)) return true;
  return discipline.prerequisites.some(pid => isDisciplineDependentOf(pid, selectedId, disciplineMap, visited));
}
