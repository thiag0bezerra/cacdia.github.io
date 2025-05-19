import { useState, useCallback, useMemo } from 'react';
import { Course, Discipline } from './types';

export function useDisciplineSelection(course: Course) {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);

  // Cria um mapa plano de todas as disciplinas para facilitar o acesso
  const disciplineMap = useMemo(() => {
    const map = new Map<string, Discipline>();
    course.periods.forEach(period => {
      period.disciplines.forEach(discipline => {
        map.set(discipline.id, discipline);
      });
    });
    return map;
  }, [course]);

  const selectedDiscipline = useMemo(() => {
    if (!selectedDisciplineId) return null;
    return disciplineMap.get(selectedDisciplineId) || null;
  }, [selectedDisciplineId, disciplineMap]);

  // Calcula a cadeia de dependências
  const dependencyChain = useMemo(() => {
    if (!selectedDisciplineId) return [];
    const chain = new Set<string>([selectedDisciplineId]);
    const visitedPrereq = new Set<string>();
    const visitedDep = new Set<string>();
    function addPrerequisites(discipline: Discipline) {
      if (visitedPrereq.has(discipline.id)) return;
      visitedPrereq.add(discipline.id);
      discipline.prerequisites.forEach(prereqId => {
        if (!chain.has(prereqId)) {
          chain.add(prereqId);
          const prereq = disciplineMap.get(prereqId);
          if (prereq) {
            addPrerequisites(prereq);
          }
        }
      });
    }
    function findDependents(disciplineId: string) {
      if (visitedDep.has(disciplineId)) return;
      visitedDep.add(disciplineId);
      disciplineMap.forEach((depDiscipline, id) => {
        if (depDiscipline.prerequisites.includes(disciplineId) && !chain.has(id)) {
          chain.add(id);
          findDependents(id);
        }
      });
    }
    const discipline = disciplineMap.get(selectedDisciplineId);
    if (discipline) {
      addPrerequisites(discipline);
      findDependents(selectedDisciplineId);
    }
    return Array.from(chain);
  }, [selectedDisciplineId, disciplineMap]);

  const handleDisciplineClick = useCallback((id: string) => {
    setSelectedDisciplineId(prev => (prev === id ? null : id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDisciplineId(null);
  }, []);

  return {
    selectedDisciplineId,
    selectedDiscipline,
    dependencyChain,
    handleDisciplineClick,
    clearSelection,
    disciplineMap, // agora exposto para uso externo
  };
}
