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
import { Router } from '@angular/router';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddComponent implements OnInit {
    addEmployeeForm: FormGroup;
    status: string[] = ['Active', 'Inactive'];
    group: string[] = GROUP;
    filteredOptions: Observable<string[]>;
    /**
     * Constructor
     */
    constructor(
        private dashboardService: DashboardService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {
        this.addEmployeeForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            birthDate: ['', [Validators.required]],
            basicSalary: ['', [Validators.required]],
            status: ['', [Validators.required]],
            group: ['', [Validators.required]],
            description: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
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
            newArr.push({
                ...this.addEmployeeForm.value,
                birthDate: moment(this.addEmployeeForm.value.birthDate).format(
                    'YYYY-MM-DD'
                ),
                description: moment(
                    this.addEmployeeForm.value.description
                ).format('YYYY-MM-DD'),
            });
        });
        this.dashboardService.setEmployeeData = newArr;
        this.toastr.success('Success')
        this.router.navigate(['/dashboard']);
    }
}
