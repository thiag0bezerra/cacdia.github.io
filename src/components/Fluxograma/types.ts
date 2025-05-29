/**
 * Representa uma disciplina do curso.
 * @interface Discipline
 */
export interface Discipline {
  readonly id: string;
  readonly code?: string;
  readonly name: string;
  readonly credits: number;
  readonly prerequisites: readonly string[];
}

/**
 * Representa um período do curso.
 * @interface Period
 */
export interface Period {
  readonly number: number;
  readonly disciplines: readonly Discipline[];
}

/**
 * Representa um curso completo com todos os períodos.
 * @interface Course
 */
export interface Course {
  readonly id: string;
  readonly name: string;
  readonly periods: readonly Period[];
}
