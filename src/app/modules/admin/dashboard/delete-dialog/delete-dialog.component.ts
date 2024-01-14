import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'delete-dialog',
    templateUrl: './delete-dialog.component.html',
})
export class DeleteDialog implements OnInit {
    uname: string
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<DeleteDialog>
    ) {}

    ngOnInit(): void {
        this.uname = this.data.username
    }

    close(status: boolean) {
        this.matDialogRef.close(status);
    }
}
