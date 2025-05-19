export interface Discipline {
  id: string;
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
}

export interface Period {
  number: number;
  disciplines: Discipline[];
}

export interface Course {
  id: string;
  name: string;
  periods: Period[];
}
