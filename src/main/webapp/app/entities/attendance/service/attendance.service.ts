import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttendance, NewAttendance } from '../attendance.model';

export type PartialUpdateAttendance = Partial<IAttendance> & Pick<IAttendance, 'id'>;

type RestOf<T extends IAttendance | NewAttendance> = Omit<T, 'dateTime'> & {
  dateTime?: string | null;
};

export type RestAttendance = RestOf<IAttendance>;

export type NewRestAttendance = RestOf<NewAttendance>;

export type PartialUpdateRestAttendance = RestOf<PartialUpdateAttendance>;

export type EntityResponseType = HttpResponse<IAttendance>;
export type EntityArrayResponseType = HttpResponse<IAttendance[]>;

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attendances');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(attendance: NewAttendance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attendance);
    return this.http
      .post<RestAttendance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(attendance: IAttendance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attendance);
    return this.http
      .put<RestAttendance>(`${this.resourceUrl}/${this.getAttendanceIdentifier(attendance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(attendance: PartialUpdateAttendance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attendance);
    return this.http
      .patch<RestAttendance>(`${this.resourceUrl}/${this.getAttendanceIdentifier(attendance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAttendance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAttendance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAttendanceIdentifier(attendance: Pick<IAttendance, 'id'>): number {
    return attendance.id;
  }

  compareAttendance(o1: Pick<IAttendance, 'id'> | null, o2: Pick<IAttendance, 'id'> | null): boolean {
    return o1 && o2 ? this.getAttendanceIdentifier(o1) === this.getAttendanceIdentifier(o2) : o1 === o2;
  }

  addAttendanceToCollectionIfMissing<Type extends Pick<IAttendance, 'id'>>(
    attendanceCollection: Type[],
    ...attendancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const attendances: Type[] = attendancesToCheck.filter(isPresent);
    if (attendances.length > 0) {
      const attendanceCollectionIdentifiers = attendanceCollection.map(attendanceItem => this.getAttendanceIdentifier(attendanceItem)!);
      const attendancesToAdd = attendances.filter(attendanceItem => {
        const attendanceIdentifier = this.getAttendanceIdentifier(attendanceItem);
        if (attendanceCollectionIdentifiers.includes(attendanceIdentifier)) {
          return false;
        }
        attendanceCollectionIdentifiers.push(attendanceIdentifier);
        return true;
      });
      return [...attendancesToAdd, ...attendanceCollection];
    }
    return attendanceCollection;
  }

  protected convertDateFromClient<T extends IAttendance | NewAttendance | PartialUpdateAttendance>(attendance: T): RestOf<T> {
    return {
      ...attendance,
      dateTime: attendance.dateTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAttendance: RestAttendance): IAttendance {
    return {
      ...restAttendance,
      dateTime: restAttendance.dateTime ? dayjs(restAttendance.dateTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAttendance>): HttpResponse<IAttendance> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAttendance[]>): HttpResponse<IAttendance[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
