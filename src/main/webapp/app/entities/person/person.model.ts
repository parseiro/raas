import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IAttendance } from 'app/entities/attendance/attendance.model';

export interface IPerson {
  id: number;
  name?: string | null;
  motherName?: string | null;
  birthdate?: dayjs.Dayjs | null;
  email?: string | null;
  user?: Pick<IUser, 'id'> | null;
  attendancesAsProfessional?: Pick<IAttendance, 'id'> | null;
  attendancesAsPatient?: Pick<IAttendance, 'id'> | null;
}

export type NewPerson = Omit<IPerson, 'id'> & { id: null };
