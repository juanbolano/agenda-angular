import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService, AlertService } from '../_services';

import { contacts } from '../contacts';

@Component({ templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: any;
    users = [];
    users2 = [];
    contacts = contacts;
    contactsForm: FormGroup;

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
            age: ['', Validators.required],
            email: ['', [Validators.required]]
        });
        this.loadAllUsers();
        this.loadAllUsers2();
    }

    // convenience getter for easy access to form fields
    get f() { return this.contactsForm.controls; }

    onSubmit() {

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.contactsForm.invalid) {
            return;
        }

        // Process checkout data here
        this.contacts.push(this.contactsForm.value)        

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

    private loadAllUsers2() {
        this.userService.getAll2()
            .pipe(first())
            .subscribe(users2 => this.users2 = users2);
    }
}