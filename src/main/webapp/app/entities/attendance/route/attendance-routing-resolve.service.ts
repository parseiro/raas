import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttendance } from '../attendance.model';
import { AttendanceService } from '../service/attendance.service';

export const attendanceResolve = (route: ActivatedRouteSnapshot): Observable<null | IAttendance> => {
  const id = route.params['id'];
  if (id) {
    return inject(AttendanceService)
      .find(id)
      .pipe(
        mergeMap((attendance: HttpResponse<IAttendance>) => {
          if (attendance.body) {
            return of(attendance.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default attendanceResolve;
