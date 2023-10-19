import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAttendance } from '../attendance.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../attendance.test-samples';

import { AttendanceService, RestAttendance } from './attendance.service';

const requireRestSample: RestAttendance = {
  ...sampleWithRequiredData,
  dateTime: sampleWithRequiredData.dateTime?.toJSON(),
};

describe('Attendance Service', () => {
  let service: AttendanceService;
  let httpMock: HttpTestingController;
  let expectedResult: IAttendance | IAttendance[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AttendanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Attendance', () => {
      const attendance = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(attendance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Attendance', () => {
      const attendance = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(attendance).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Attendance', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Attendance', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Attendance', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAttendanceToCollectionIfMissing', () => {
      it('should add a Attendance to an empty array', () => {
        const attendance: IAttendance = sampleWithRequiredData;
        expectedResult = service.addAttendanceToCollectionIfMissing([], attendance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attendance);
      });

      it('should not add a Attendance to an array that contains it', () => {
        const attendance: IAttendance = sampleWithRequiredData;
        const attendanceCollection: IAttendance[] = [
          {
            ...attendance,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAttendanceToCollectionIfMissing(attendanceCollection, attendance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Attendance to an array that doesn't contain it", () => {
        const attendance: IAttendance = sampleWithRequiredData;
        const attendanceCollection: IAttendance[] = [sampleWithPartialData];
        expectedResult = service.addAttendanceToCollectionIfMissing(attendanceCollection, attendance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attendance);
      });

      it('should add only unique Attendance to an array', () => {
        const attendanceArray: IAttendance[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const attendanceCollection: IAttendance[] = [sampleWithRequiredData];
        expectedResult = service.addAttendanceToCollectionIfMissing(attendanceCollection, ...attendanceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attendance: IAttendance = sampleWithRequiredData;
        const attendance2: IAttendance = sampleWithPartialData;
        expectedResult = service.addAttendanceToCollectionIfMissing([], attendance, attendance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attendance);
        expect(expectedResult).toContain(attendance2);
      });

      it('should accept null and undefined values', () => {
        const attendance: IAttendance = sampleWithRequiredData;
        expectedResult = service.addAttendanceToCollectionIfMissing([], null, attendance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attendance);
      });

      it('should return initial array if no Attendance is added', () => {
        const attendanceCollection: IAttendance[] = [sampleWithRequiredData];
        expectedResult = service.addAttendanceToCollectionIfMissing(attendanceCollection, undefined, null);
        expect(expectedResult).toEqual(attendanceCollection);
      });
    });

    describe('compareAttendance', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAttendance(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAttendance(entity1, entity2);
        const compareResult2 = service.compareAttendance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAttendance(entity1, entity2);
        const compareResult2 = service.compareAttendance(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAttendance(entity1, entity2);
        const compareResult2 = service.compareAttendance(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
