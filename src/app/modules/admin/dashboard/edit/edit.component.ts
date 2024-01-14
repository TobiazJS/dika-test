import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../dashboard.service';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { GROUP } from 'app/mock-api/employee-data/data';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeData } from 'app/mock-api/employee-data/types';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditComponent implements OnInit {
    addEmployeeForm: FormGroup;
    status: string[] = ['Active', 'Inactive'];
    group: string[] = GROUP;
    filteredOptions: Observable<string[]>;
    mode: string;
    salary: string;
    username: string;
    /**
     * Constructor
     */
    constructor(
        private dashboardService: DashboardService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((res) => {
            this.mode = res.mode;
            this.username = res.username;

            this.dashboardService.getEmployeeData().subscribe((employee) => {
                const employeeDetail = employee.filter(
                    (data) => data.username === this.username
                )[0];
                this.salary = employeeDetail.basicSalary.toString();
                this.addEmployeeForm = this.formBuilder.group({
                    username: [employeeDetail.username, [Validators.required]],
                    firstName: [
                        employeeDetail.firstName,
                        [Validators.required],
                    ],
                    lastName: [employeeDetail.lastName, [Validators.required]],
                    email: [
                        employeeDetail.email,
                        [Validators.required, Validators.email],
                    ],
                    birthDate: [
                        employeeDetail.birthDate,
                        [Validators.required],
                    ],
                    basicSalary: [
                        employeeDetail.basicSalary,
                        [Validators.required],
                    ],
                    status: [employeeDetail.status, [Validators.required]],
                    group: [employeeDetail.group, [Validators.required]],
                    description: [
                        employeeDetail.description,
                        [Validators.required],
                    ],
                });
                if (this.mode === 'detail') {
                    this.addEmployeeForm.disable();
                }
            });
        });
        this.filteredOptions = this.addEmployeeForm
            .get('group')
            .valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.group.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    onCancel() {
        this.router.navigate(['dashboard']);
    }

    onSubmit() {
        if (this.addEmployeeForm.invalid) {
            return;
        }
        let newArr: EmployeeData[];
        this.dashboardService.getEmployeeData().subscribe((res) => {
            newArr = res;
            const findIndex = newArr.findIndex(
                (idx) => (idx.username = this.username)
            );
            newArr[findIndex] = {
                ...this.addEmployeeForm.value,
                birthDate: moment(this.addEmployeeForm.value.birthDate).format(
                    'YYYY-MM-DD'
                ),
                description: moment(
                    this.addEmployeeForm.value.description
                ).format('YYYY-MM-DD'),
            };
        });
        this.dashboardService.setEmployeeData = newArr;
        this.toastr.warning('Success');
        this.router.navigate(['/dashboard']);
    }
}
