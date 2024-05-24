import { type Schema } from '../../amplify/data/resource';
 
//========= SchoolYear
export type SchoolYear = Schema['SchoolYear']['type'];
export type SchoolYearUpdate = Omit<SchoolYear, 'createdAt' | 'updatedAt'>;
export enum SchoolYearStatus {
    Active = 'Active',
    Inactive = 'Inactive',
  }
  