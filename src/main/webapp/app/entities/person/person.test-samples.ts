import dayjs from 'dayjs/esm';

import { IPerson, NewPerson } from './person.model';

export const sampleWithRequiredData: IPerson = {
  id: 2461,
  name: 'mayor knowledgeably needily',
  motherName: 'ick monumental',
  birthdate: dayjs('2023-10-19'),
};

export const sampleWithPartialData: IPerson = {
  id: 32325,
  name: 'stop common whereas',
  motherName: 'hm',
  birthdate: dayjs('2023-10-19'),
};

export const sampleWithFullData: IPerson = {
  id: 10494,
  name: 'loyally',
  motherName: 'yum',
  birthdate: dayjs('2023-10-19'),
  email: 'Wilfred_Satterfield20@yahoo.com',
};

export const sampleWithNewData: NewPerson = {
  name: 'backup tabletop till',
  motherName: 'miserly',
  birthdate: dayjs('2023-10-19'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
