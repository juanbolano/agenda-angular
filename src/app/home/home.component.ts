import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService, AlertService } from '../_services';

@Component({ templateUrl: 'home.component.html', host: {'class': 'col-sm-10 col-sm-offset-1'}})
export class HomeComponent implements OnInit {
    currentUser: any;
    users = [];
    contacts = [];
    contactsForm: FormGroup;
    submitted = false;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
    ) {
        this.currentUser = this.authenticationService.currentUserValue;      
    }

    ngOnInit() {
        this.contactsForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            age: ['', [Validators.min(0), Validators.max(150)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required]
        });
        this.loadAllUsers();
        this.loadAllContacts();
    }

    // convenience getter for easy access to form fields
    get f() { return this.contactsForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.contactsForm.invalid) {
            return;
        }
        this.submitted = false;    

        this.userService.createUser(this.contactsForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Creation successful', true);
                },
                error => {
                    this.alertService.error(error);
                });

        this.contactsForm.reset();
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    private loadAllContacts() {
        this.userService.getAllContacts()
            .pipe(first())
            .subscribe(contacts => this.contacts = contacts);
    }
}