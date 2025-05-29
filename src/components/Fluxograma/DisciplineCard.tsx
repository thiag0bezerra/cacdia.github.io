"use client";

import React from 'react';
import type { Discipline } from './types';
import styles from './fluxograma.module.css';

interface DisciplineCardProps {
  readonly discipline: Discipline;
  readonly isSelected: boolean;
  readonly isPrerequisite: boolean;
  readonly isDependent: boolean;
  readonly onClick: (id: string) => void;
}

/**
 * Componente que renderiza o cartão de uma disciplina no fluxograma.
 * Gerencia o estado visual da disciplina (selecionada, pré-requisito, dependente).
 *
 * @param props - Propriedades do componente
 * @returns React.JSX.Element do cartão da disciplina
 */
export function DisciplineCard({
  discipline,
  isSelected,
  isPrerequisite,
  isDependent,
  onClick,
}: DisciplineCardProps): React.JSX.Element {
  const { id, code, name, credits, prerequisites } = discipline;

  const cardClassName = [
    styles.disciplineCard,
    isSelected ? styles.disciplineSelected : '',
    isPrerequisite ? styles.disciplinePrerequisite : '',
    isDependent ? styles.disciplineDependent : '',
    prerequisites.length === 0 ? styles.disciplineNoPrerequisites : '',
  ].filter(Boolean).join(' ');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  };

  // Acessibilidade: aria-pressed e evitar clique redundante
  return (
    <div
      className={cardClassName}
      onClick={() => onClick(id)}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.disciplineHeader}>
        {code && <span className={styles.disciplineCode}>{code}</span>}
        <span className={styles.disciplineCredits}>{credits}</span>
      </div>
      <h3 className={styles.disciplineTitle}>{name}</h3>

      {prerequisites.length > 0 && (
        <div className={styles.disciplinePrerequisites}>
          <span className={styles.prereqCount}>
            {prerequisites.length === 1 ? '1 pré-req.' : `${prerequisites.length} pré-req.`}
          </span>
        </div>
      )}
    </div>
  );
}
