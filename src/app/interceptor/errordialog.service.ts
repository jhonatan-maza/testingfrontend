import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogComponent } from './errordialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorDialogService {

    constructor(public dialog: MatDialog) { }

    getClientErrorMessage(error: Error): string {
      return error.message ?
             error.message :
             error.toString();
    }

    getServerErrorMessage(error: HttpErrorResponse): string {
      return navigator.onLine ?
             error.message :
             'No Internet Connection';
    }
    
    openDialog(data): void {
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: '50%',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            let mensaje;
            mensaje = result;
        });
    }


}
