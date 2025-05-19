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

  // Função recursiva para pegar todos os pré-requisitos (diretos e indiretos)
  const getAllPrerequisites = useCallback((id: string, visited = new Set<string>()): string[] => {
    if (visited.has(id)) return [];
    visited.add(id);
    const disc = disciplineMap.get(id);
    if (!disc) return [];
    let result: string[] = [];
    for (const prereqId of disc.prerequisites) {
      result.push(prereqId);
      result = result.concat(getAllPrerequisites(prereqId, visited));
    }
    return result;
  }, [disciplineMap]);

  // Função recursiva para pegar todos os dependentes (diretos e indiretos)
  const getAllDependents = useCallback((id: string, visited = new Set<string>()): string[] => {
    if (visited.has(id)) return [];
    visited.add(id);
    let result: string[] = [];
    disciplineMap.forEach((disc, discId) => {
      if (disc.prerequisites.includes(id)) {
        result.push(discId);
        result = result.concat(getAllDependents(discId, visited));
      }
    });
    return result;
  }, [disciplineMap]);

  const selectedDiscipline = useMemo(() => {
    if (!selectedDisciplineId) return null;
    return disciplineMap.get(selectedDisciplineId) || null;
  }, [selectedDisciplineId, disciplineMap]);

  // Calcula a cadeia de dependências (selecionada + todos os pré-requisitos + todos os dependentes)
  const dependencyChain = useMemo(() => {
    if (!selectedDisciplineId) return [];
    const chain = new Set<string>([selectedDisciplineId]);
    getAllPrerequisites(selectedDisciplineId).forEach(id => chain.add(id));
    getAllDependents(selectedDisciplineId).forEach(id => chain.add(id));
    return Array.from(chain);
  }, [selectedDisciplineId, getAllPrerequisites, getAllDependents]);

  // Arrays separados para destaque visual
  const prerequisiteIds = useMemo(() => {
    if (!selectedDisciplineId) return [];
    // Remove o próprio id selecionado do array de pré-requisitos
    return getAllPrerequisites(selectedDisciplineId).filter(id => id !== selectedDisciplineId);
  }, [selectedDisciplineId, getAllPrerequisites]);

  const dependentIds = useMemo(() => {
    if (!selectedDisciplineId) return [];
    // Remove o próprio id selecionado do array de dependentes
    return getAllDependents(selectedDisciplineId).filter(id => id !== selectedDisciplineId);
  }, [selectedDisciplineId, getAllDependents]);

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
    prerequisiteIds,
    dependentIds,
    handleDisciplineClick,
    clearSelection,
    disciplineMap, // agora exposto para uso externo
  };
}
