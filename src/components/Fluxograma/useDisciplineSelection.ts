import { useState, useCallback, useMemo } from 'react';
import type { Course, Discipline } from './types';

/**
 * Interface para o retorno do hook de seleção de disciplinas.
 */
interface UseDisciplineSelectionReturn {
  readonly selectedDisciplineId: string | null;
  readonly selectedDiscipline: Discipline | null;
  readonly dependencyChain: readonly string[];
  readonly prerequisiteIds: readonly string[];
  readonly dependentIds: readonly string[];
  readonly disciplineMap: ReadonlyMap<string, Discipline>;
  readonly handleDisciplineClick: (id: string) => void;
  readonly clearSelection: () => void;
}

/**
 * Hook customizado para gerenciar a seleção de disciplinas e suas dependências.
 * Centraliza a lógica de seleção, cálculo de pré-requisitos e dependentes.
 *
 * @param course - O curso com todas as disciplinas e períodos
 * @returns Objeto com estado e funções para gerenciar seleção de disciplinas
 */
export function useDisciplineSelection(course: Course): UseDisciplineSelectionReturn {
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
    const result: string[] = [];
    for (const prereqId of disc.prerequisites) {
      result.push(prereqId);
      result.push(...getAllPrerequisites(prereqId, visited));
    }
    return result;
  }, [disciplineMap]);

  // Função recursiva para pegar todos os dependentes (diretos e indiretos)
  const getAllDependents = useCallback((id: string, visited = new Set<string>()): string[] => {
    if (visited.has(id)) return [];
    visited.add(id);
    const result: string[] = [];
    disciplineMap.forEach((disc: Discipline, discId: string) => {
      if (disc.prerequisites.includes(id)) {
        result.push(discId);
        result.push(...getAllDependents(discId, visited));
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
    getAllPrerequisites(selectedDisciplineId).forEach((id: string) => chain.add(id));
    getAllDependents(selectedDisciplineId).forEach((id: string) => chain.add(id));
    return Array.from(chain);
  }, [selectedDisciplineId, getAllPrerequisites, getAllDependents]);

  // Arrays separados para destaque visual
  const prerequisiteIds = useMemo(() => {
    if (!selectedDisciplineId) return [];
    // Remove o próprio id selecionado do array de pré-requisitos
    return getAllPrerequisites(selectedDisciplineId).filter((id: string) => id !== selectedDisciplineId);
  }, [selectedDisciplineId, getAllPrerequisites]);

  const dependentIds = useMemo(() => {
    if (!selectedDisciplineId) return [];
    // Remove o próprio id selecionado do array de dependentes
    return getAllDependents(selectedDisciplineId).filter((id: string) => id !== selectedDisciplineId);
  }, [selectedDisciplineId, getAllDependents]);

  const handleDisciplineClick = useCallback((id: string) => {
    setSelectedDisciplineId((prev: string | null) => (prev === id ? null : id));
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
