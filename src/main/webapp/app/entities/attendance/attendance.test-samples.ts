import dayjs from 'dayjs/esm';

import { IAttendance, NewAttendance } from './attendance.model';

export const sampleWithRequiredData: IAttendance = {
  id: 19437,
};

export const sampleWithPartialData: IAttendance = {
  id: 16945,
};

export const sampleWithFullData: IAttendance = {
  id: 6696,
  dateTime: dayjs('2023-10-19T04:13'),
  place: 'TERRITORY',
  howMany: 'INDIVIDUAL',
};

export const sampleWithNewData: NewAttendance = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
