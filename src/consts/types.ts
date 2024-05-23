import { type Schema } from '../../amplify/data/resource';
 
//========= SchoolYear
export type SchoolYear = Schema['SchoolYear']['type'];
export enum SchoolYearStatus {
    Active = 'Active',
    Inactive = 'Inactive',
  }
  