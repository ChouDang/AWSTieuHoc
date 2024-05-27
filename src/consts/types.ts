import { type Schema } from '../../amplify/data/resource';

//========= SchoolYear
export type SchoolYear = Schema['SchoolYear']['type'];
export type SchoolYearUpdate = Omit<SchoolYear, 'createdAt' | 'updatedAt' | "Classes">;
export enum SchoolYearStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

//========= Class
export type Class = Schema['Class']['type'];
export type ClassUpdate = Omit<Class, 'createdAt' | 'updatedAt' | "SchoolYear" >;
export enum EGrades {
  Khoi_1 = "Khoi_1",
  Khoi_2 = "Khoi_2",
  Khoi_3 = "Khoi_3",
  Khoi_4 = "Khoi_4",
  Khoi_5 = "Khoi_5",
}