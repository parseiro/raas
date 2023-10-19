import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Place } from 'app/entities/enumerations/place.model';
import { HowMany } from 'app/entities/enumerations/how-many.model';
import { IAttendance } from '../attendance.model';
import { AttendanceService } from '../service/attendance.service';
import { AttendanceFormService, AttendanceFormGroup } from './attendance-form.service';

@Component({
  standalone: true,
  selector: 'jhi-attendance-update',
  templateUrl: './attendance-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AttendanceUpdateComponent implements OnInit {
  isSaving = false;
  attendance: IAttendance | null = null;
  placeValues = Object.keys(Place);
  howManyValues = Object.keys(HowMany);

  editForm: AttendanceFormGroup = this.attendanceFormService.createAttendanceFormGroup();

  constructor(
    protected attendanceService: AttendanceService,
    protected attendanceFormService: AttendanceFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attendance }) => {
      this.attendance = attendance;
      if (attendance) {
        this.updateForm(attendance);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attendance = this.attendanceFormService.getAttendance(this.editForm);
    if (attendance.id !== null) {
      this.subscribeToSaveResponse(this.attendanceService.update(attendance));
    } else {
      this.subscribeToSaveResponse(this.attendanceService.create(attendance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttendance>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(attendance: IAttendance): void {
    this.attendance = attendance;
    this.attendanceFormService.resetForm(this.editForm, attendance);
  }
}
