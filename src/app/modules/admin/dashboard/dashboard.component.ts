import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subject } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialog } from './delete-dialog/delete-dialog.component';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = [
        'username',
        'name',
        'email',
        'birthDate',
        'basicSalary',
        'status',
        'group',
        'description',
        'action',
    ];

    dataSource: any;
    searchQuery: string;

    /**
     * Constructor
     */
    constructor(
        private dashboardService: DashboardService,
        private changeDetectorRef: ChangeDetectorRef,
        private matDialog: MatDialog,
        private toastr: ToastrService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.dashboardService.getSearch$.subscribe((query) => {
            this.searchQuery = query
            if (!query) {
                this.dashboardService.getEmployeeData().subscribe();
            } else {
                this.initialFilter(this.searchQuery);
            }
        });

        this.dashboardService.getEmployeeData$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.changeDetectorRef.markForCheck();
            });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onAdd() {
        this.router.navigate(['dashboard/add']);
    }

    edit(username: string, mode: string = 'edit') {
        this.router.navigate(['dashboard/edit'], {
            queryParams: { username: username, mode: mode },
        });
    }

    detail(username: string, mode: string = 'detail') {
        this.router.navigate(['dashboard/edit'], {
            queryParams: { username: username, mode: mode },
        });
    }

    delete(username: string) {
        const dialogRef = this.matDialog.open(DeleteDialog, {
            data: {
                username: username,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.dashboardService
                    .deleteEmployeeData(username)
                    .subscribe((res) => {
                        if (res) {
                            this.toastr.error('Success delete ' + username);
                        } else {
                            this.toastr.error('Deletion failed');
                        }
                    });
            }
        });
    }

    applyFilter(event) {
        const value = event.target.value;
        this.searchQuery = value;
        this.dashboardService.setSearch = this.searchQuery;
        this.dashboardService.filterEmployeeData(value).subscribe();
    }

    initialFilter(query) {
        this.dashboardService.filterEmployeeData(query).subscribe();
    }
}
