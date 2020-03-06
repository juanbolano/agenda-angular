import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../_services';

@Component({ selector: 'alert', templateUrl: 'alert.component.html', host: {'class': 'col-sm-10 col-sm-offset-1'} })
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }


    closeAlert() {
        this.alertService.clear();
    }

    ngOnInit() {
        this.subscription = this.alertService.getAlert()
            .subscribe(message => {
                switch (message && message.type) {
                    case 'success':
                        message.cssClass = 'alert alert-success alert-dismissible fade show';
                        break;
                    case 'error':
                        message.cssClass = 'alert alert-danger alert-dismissible fade show';
                        break;
                }

                this.message = message;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}