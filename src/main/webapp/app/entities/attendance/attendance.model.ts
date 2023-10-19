import dayjs from 'dayjs/esm';
import { Place } from 'app/entities/enumerations/place.model';
import { HowMany } from 'app/entities/enumerations/how-many.model';

export interface IAttendance {
  id: number;
  dateTime?: dayjs.Dayjs | null;
  place?: keyof typeof Place | null;
  howMany?: keyof typeof HowMany | null;
}

export type NewAttendance = Omit<IAttendance, 'id'> & { id: null };
