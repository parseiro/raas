import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../attendance.test-samples';

import { AttendanceFormService } from './attendance-form.service';

describe('Attendance Form Service', () => {
  let service: AttendanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceFormService);
  });

  describe('Service methods', () => {
    describe('createAttendanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAttendanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateTime: expect.any(Object),
            place: expect.any(Object),
            howMany: expect.any(Object),
          }),
        );
      });

      it('passing IAttendance should create a new form with FormGroup', () => {
        const formGroup = service.createAttendanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateTime: expect.any(Object),
            place: expect.any(Object),
            howMany: expect.any(Object),
          }),
        );
      });
    });

    describe('getAttendance', () => {
      it('should return NewAttendance for default Attendance initial value', () => {
        const formGroup = service.createAttendanceFormGroup(sampleWithNewData);

        const attendance = service.getAttendance(formGroup) as any;

        expect(attendance).toMatchObject(sampleWithNewData);
      });

      it('should return NewAttendance for empty Attendance initial value', () => {
        const formGroup = service.createAttendanceFormGroup();

        const attendance = service.getAttendance(formGroup) as any;

        expect(attendance).toMatchObject({});
      });

      it('should return IAttendance', () => {
        const formGroup = service.createAttendanceFormGroup(sampleWithRequiredData);

        const attendance = service.getAttendance(formGroup) as any;

        expect(attendance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAttendance should not enable id FormControl', () => {
        const formGroup = service.createAttendanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAttendance should disable id FormControl', () => {
        const formGroup = service.createAttendanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
