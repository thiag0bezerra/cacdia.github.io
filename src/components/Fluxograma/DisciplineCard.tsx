import React from 'react';
import { Discipline } from './types';

interface DisciplineCardProps {
  discipline: Discipline;
  isSelected: boolean;
  isPrerequisite: boolean;
  isDependent: boolean;
  onClick: (id: string) => void;
}

export function DisciplineCard({
  discipline,
  isSelected,
  isPrerequisite,
  isDependent,
  onClick,
}: DisciplineCardProps) {
  const { id, code, name, credits, prerequisites } = discipline;

  let cardClassName = 'discipline-card';
  if (isSelected) {
    cardClassName += ' discipline-selected';
  } else if (isPrerequisite) {
    cardClassName += ' discipline-prerequisite';
  } else if (isDependent) {
    cardClassName += ' discipline-dependent';
  }

  if (prerequisites.length === 0) {
    cardClassName += ' discipline-no-prerequisites';
  }

  // Acessibilidade: aria-pressed e evitar clique redundante
  return (
    <div
      className={cardClassName}
      onClick={() => { if (!isSelected) onClick(id); }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isSelected) {
          e.preventDefault();
          onClick(id);
        }
      }}
    >
      <div className="discipline-header">
        {code && <span className="discipline-code">{code}</span>}
        <span className="discipline-credits">{credits}</span>
      </div>
      <h3 className="discipline-title">{name}</h3>

      {prerequisites.length > 0 ? (
        <div className="discipline-prerequisites">
          {prerequisites.length === 1 ? (
            <span className="prereq-count">1 pré-req.</span>
          ) : (
            <span className="prereq-count">{prerequisites.length} pré-req.</span>
          )}
        </div>
      ) : null}
    </div>
  );
}
