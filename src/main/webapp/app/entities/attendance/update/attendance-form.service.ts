import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAttendance, NewAttendance } from '../attendance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAttendance for edit and NewAttendanceFormGroupInput for create.
 */
type AttendanceFormGroupInput = IAttendance | PartialWithRequiredKeyOf<NewAttendance>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAttendance | NewAttendance> = Omit<T, 'dateTime'> & {
  dateTime?: string | null;
};

type AttendanceFormRawValue = FormValueOf<IAttendance>;

type NewAttendanceFormRawValue = FormValueOf<NewAttendance>;

type AttendanceFormDefaults = Pick<NewAttendance, 'id' | 'dateTime'>;

type AttendanceFormGroupContent = {
  id: FormControl<AttendanceFormRawValue['id'] | NewAttendance['id']>;
  dateTime: FormControl<AttendanceFormRawValue['dateTime']>;
  place: FormControl<AttendanceFormRawValue['place']>;
  howMany: FormControl<AttendanceFormRawValue['howMany']>;
};

export type AttendanceFormGroup = FormGroup<AttendanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AttendanceFormService {
  createAttendanceFormGroup(attendance: AttendanceFormGroupInput = { id: null }): AttendanceFormGroup {
    const attendanceRawValue = this.convertAttendanceToAttendanceRawValue({
      ...this.getFormDefaults(),
      ...attendance,
    });
    return new FormGroup<AttendanceFormGroupContent>({
      id: new FormControl(
        { value: attendanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dateTime: new FormControl(attendanceRawValue.dateTime),
      place: new FormControl(attendanceRawValue.place),
      howMany: new FormControl(attendanceRawValue.howMany),
    });
  }

  getAttendance(form: AttendanceFormGroup): IAttendance | NewAttendance {
    return this.convertAttendanceRawValueToAttendance(form.getRawValue() as AttendanceFormRawValue | NewAttendanceFormRawValue);
  }

  resetForm(form: AttendanceFormGroup, attendance: AttendanceFormGroupInput): void {
    const attendanceRawValue = this.convertAttendanceToAttendanceRawValue({ ...this.getFormDefaults(), ...attendance });
    form.reset(
      {
        ...attendanceRawValue,
        id: { value: attendanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AttendanceFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateTime: currentTime,
    };
  }

  private convertAttendanceRawValueToAttendance(
    rawAttendance: AttendanceFormRawValue | NewAttendanceFormRawValue,
  ): IAttendance | NewAttendance {
    return {
      ...rawAttendance,
      dateTime: dayjs(rawAttendance.dateTime, DATE_TIME_FORMAT),
    };
  }

  private convertAttendanceToAttendanceRawValue(
    attendance: IAttendance | (Partial<NewAttendance> & AttendanceFormDefaults),
  ): AttendanceFormRawValue | PartialWithRequiredKeyOf<NewAttendanceFormRawValue> {
    return {
      ...attendance,
      dateTime: attendance.dateTime ? attendance.dateTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
