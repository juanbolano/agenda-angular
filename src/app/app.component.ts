import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, AlertService } from './_services';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        // reset alerts on logout
        this.alertService.clear();
        this.router.navigate(['/login']);
    }
}