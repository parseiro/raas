import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AttendanceComponent } from './list/attendance.component';
import { AttendanceDetailComponent } from './detail/attendance-detail.component';
import { AttendanceUpdateComponent } from './update/attendance-update.component';
import AttendanceResolve from './route/attendance-routing-resolve.service';

const attendanceRoute: Routes = [
  {
    path: '',
    component: AttendanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AttendanceDetailComponent,
    resolve: {
      attendance: AttendanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AttendanceUpdateComponent,
    resolve: {
      attendance: AttendanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AttendanceUpdateComponent,
    resolve: {
      attendance: AttendanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default attendanceRoute;
