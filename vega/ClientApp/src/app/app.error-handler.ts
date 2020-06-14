import { ErrorHandler, Inject, NgZone, Injector } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Response } from "@angular/http";
import { HttpErrorResponse } from "@angular/common/http";

export class AppErrorHandler implements ErrorHandler{

    constructor(@Inject(NgZone) private ngZone: NgZone, @Inject(Injector) private injector: Injector) { }

    private get toastr(): ToastrService {
        return this.injector.get(ToastrService);
    }

    public handleError(error: any): void {
        this.ngZone.run(() => {
            if (error instanceof HttpErrorResponse) {
                //Backend returns unsuccessful response codes such as 404, 500 etc.				  
                this.toastr.error(error.message, String(error.status))         	  
            } else {
                //A client-side or network error occurred.	          
                this.toastr.error(error.message, "Error");          
            }   
        });

    }   
}