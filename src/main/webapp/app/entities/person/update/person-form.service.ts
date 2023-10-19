import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPerson, NewPerson } from '../person.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPerson for edit and NewPersonFormGroupInput for create.
 */
type PersonFormGroupInput = IPerson | PartialWithRequiredKeyOf<NewPerson>;

type PersonFormDefaults = Pick<NewPerson, 'id'>;

type PersonFormGroupContent = {
  id: FormControl<IPerson['id'] | NewPerson['id']>;
  name: FormControl<IPerson['name']>;
  motherName: FormControl<IPerson['motherName']>;
  birthdate: FormControl<IPerson['birthdate']>;
  email: FormControl<IPerson['email']>;
  user: FormControl<IPerson['user']>;
  attendancesAsProfessional: FormControl<IPerson['attendancesAsProfessional']>;
  attendancesAsPatient: FormControl<IPerson['attendancesAsPatient']>;
};

export type PersonFormGroup = FormGroup<PersonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonFormService {
  createPersonFormGroup(person: PersonFormGroupInput = { id: null }): PersonFormGroup {
    const personRawValue = {
      ...this.getFormDefaults(),
      ...person,
    };
    return new FormGroup<PersonFormGroupContent>({
      id: new FormControl(
        { value: personRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(personRawValue.name, {
        validators: [Validators.required],
      }),
      motherName: new FormControl(personRawValue.motherName, {
        validators: [Validators.required],
      }),
      birthdate: new FormControl(personRawValue.birthdate, {
        validators: [Validators.required],
      }),
      email: new FormControl(personRawValue.email),
      user: new FormControl(personRawValue.user),
      attendancesAsProfessional: new FormControl(personRawValue.attendancesAsProfessional),
      attendancesAsPatient: new FormControl(personRawValue.attendancesAsPatient),
    });
  }

  getPerson(form: PersonFormGroup): IPerson | NewPerson {
    return form.getRawValue() as IPerson | NewPerson;
  }

  resetForm(form: PersonFormGroup, person: PersonFormGroupInput): void {
    const personRawValue = { ...this.getFormDefaults(), ...person };
    form.reset(
      {
        ...personRawValue,
        id: { value: personRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PersonFormDefaults {
    return {
      id: null,
    };
  }
}
