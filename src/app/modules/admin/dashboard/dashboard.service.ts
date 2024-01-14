import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {EMPLOYEE_DATA} from '../../../mock-api/employee-data/data'
import { EmployeeData } from 'app/mock-api/employee-data/types';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private employeeData$: BehaviorSubject<EmployeeData[]> = new BehaviorSubject([]);
    private search$: BehaviorSubject<string> = new BehaviorSubject('');
    /**
     * Constructor
     */
    constructor() {}

    get getEmployeeData$(): Observable<EmployeeData[]> {
        return this.employeeData$.asObservable();
    }

    set setEmployeeData(data: EmployeeData[]) {
        this.employeeData$.next(data);
    }

    get getSearch$(): Observable<string>{
        return this.search$.asObservable();
    }

    set setSearch(data: string) {
        this.search$.next(data);
    }

    getEmployeeData(): Observable<EmployeeData[]> {
        this.employeeData$.next(EMPLOYEE_DATA);
        return of(EMPLOYEE_DATA);
    }

    filterEmployeeData(searchKey:string): Observable<EmployeeData[]> {
        const filtered = EMPLOYEE_DATA.filter(emp => emp.username.includes(searchKey))
        this.employeeData$.next(filtered);
        return of(filtered);
    }

    deleteEmployeeData(username: string): Observable<boolean> {
        let deletedArr:EmployeeData[] = EMPLOYEE_DATA;
        const index = EMPLOYEE_DATA.findIndex(filtered => filtered.username === username)
        if (index !== -1) {
            deletedArr.splice(index, 1);
            this.employeeData$.next(deletedArr);
            return of(true)
        }
        return of(false)
    }
}
