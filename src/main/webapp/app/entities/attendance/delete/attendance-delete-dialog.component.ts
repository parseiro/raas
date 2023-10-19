import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAttendance } from '../attendance.model';
import { AttendanceService } from '../service/attendance.service';

@Component({
  standalone: true,
  templateUrl: './attendance-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AttendanceDeleteDialogComponent {
  attendance?: IAttendance;

  constructor(
    protected attendanceService: AttendanceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.attendanceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
