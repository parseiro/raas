import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AttendanceDetailComponent } from './attendance-detail.component';

describe('Attendance Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AttendanceDetailComponent,
              resolve: { attendance: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AttendanceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load attendance on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AttendanceDetailComponent);

      // THEN
      expect(instance.attendance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
