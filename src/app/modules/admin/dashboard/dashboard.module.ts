import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteDialog } from './delete-dialog/delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddComponent } from './add/add.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { EditComponent } from './edit/edit.component';

const dashboardRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'add',
        component: AddComponent
    },
    {
        path: 'edit',
        component: EditComponent
    },
];

@NgModule({
    declarations: [DashboardComponent, DeleteDialog, AddComponent, EditComponent],
    imports: [
        RouterModule.forChild(dashboardRoutes),
        CommonModule,
        SharedModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatMenuModule,
        MatDialogModule,
        FormsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatSelectModule,
    ],
})
export class DashboardModule {}
