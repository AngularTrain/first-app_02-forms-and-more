import {Component, inject, ChangeDetectorRef} from '@angular/core'; // SW: added ChangeDetectorRef import
import {ActivatedRoute} from '@angular/router';
import {HousingService} from '../housing';
import {HousingLocationInfo} from '../housinglocation';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { SubmittedApplication } from '../submitted-application';
import { signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-details', // SW: undo previous selector change as it was messing things up.
  imports: [ReactiveFormsModule],
  template: `
    <article>
      @if (housingLocation) {
      <img
        class="listing-photo"
        [src]="housingLocation.photo"
        alt="Exterior photo of {{ housingLocation.name }}"
        crossorigin
      />
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation.name }}</h2>
        <p class="listing-location">{{ housingLocation.city }}, {{ housingLocation.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation.availableUnits }}</li>
          <li>Does this location have wifi: {{ housingLocation.wifi }}</li>
          <li>Does this location have laundry: {{ housingLocation.laundry }}</li>
        </ul>
      </section>
      <section class="listing-apply">
        @if (!submitted()) {
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (ngSubmit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName" />
          @if (applyForm.get('firstName')?.invalid && (applyForm.get('firstName')?.touched || applyForm.get('firstName')?.dirty)) {
            @if (applyForm.get('firstName')?.errors?.['required']) {
            <div class="error-message"> 
              First Name is required.
            </div>
          }
            @if (applyForm.get('firstName')?.errors?.['minlength']) {
            <div class="error-message">
              First Name must be at least 2 characters long.
            </div>
          }
        }
          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName" />
          @if (applyForm.get('lastName')?.invalid && (applyForm.get('lastName')?.touched || applyForm.get('lastName')?.dirty || submitAttempted())) {
            @if (applyForm.get('lastName')?.errors?.['required']) {
            <div class="error-message">
              Last Name is required.
            </div>
            }
            @if (applyForm.get('lastName')?.errors?.['minlength']) {
            <div class="error-message">
              Last Name must be at least 2 characters long.
            </div>
            }
          }
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          @if (applyForm.get('email')?.invalid && (applyForm.get('email')?.touched || applyForm.get('email')?.dirty || submitAttempted())) {
            <div class="error-message">
              A valid Email is required.
            </div>
          }
          <label for="phone">Phone Number</label>
          <input id="phone" type="tel" formControlName="phone" />
          @if (applyForm.get('phone')?.invalid && (applyForm.get('phone')?.touched || applyForm.get('phone')?.dirty || submitAttempted())) {
            @if (applyForm.get('phone')?.errors?.['required']) {
            <div class="error-message">
              Phone Number is required.
            </div>
            }
            @if (applyForm.get('phone')?.errors?.['pattern']) {
            <div class="error-message">
              Phone Number must be valid.
            </div>
            }
          }
          <button type="submit" class="primary" [disabled]="applyForm.invalid">Apply now</button>
        </form>
        } @else {
          <div class="success">
          <h2 class="section-heading">Application submitted</h2>
          <p>{{ successLine() }}</p>
          <br/>
          <br/>
          <button type="button" class="primary" (click)="startAnotherApplication()">
            Apply again
          </button>
        </div>
        }
      </section>
      } @else {
      <p>Listing not found.</p>
      }
    </article>
  `,
  styleUrls: ['./details.css'],
})


export class Details {
  
  submitted = signal(false);
  submitAttempted = signal(false);
  submittedData = signal <SubmittedApplication | null>(null);
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation?: HousingLocationInfo;

  successLine = computed(() => {
    const data = this.submittedData();
    if (!data) return '';
    return `Thanks, ${data.firstName} ${data.lastName}. A confirmation email will be sent to ${data.email}.`;
  });


  applyForm = new FormGroup({
  firstName: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)]
  }),
  lastName: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)]
  }),
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  }),
  phone: new FormControl('', {
  nonNullable: true,
  validators: [
    Validators.required,
    Validators.pattern(/^[\d\s()+-]{7,}$/)
  ]
  }),
});

  constructor(private changeDetectorRef: ChangeDetectorRef) { // SW: added ChangeDetectorRef injection
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
      this.changeDetectorRef.markForCheck();
    });

    effect(() => {
    if (this.submitted()) {
      console.log('Application submitted:', this.submittedData());
    }
    
  });

  }
  submitApplication() {
  this.submitAttempted.set(true);

  if (this.applyForm.invalid) {
    this.applyForm.markAllAsTouched();
    return;
  }

  this.submittedData.set(this.applyForm.getRawValue());
  this.submitted.set(true);
  this.housingService.submitApplication(this.submittedData() as SubmittedApplication);
  this.applyForm.reset();
}


  startAnotherApplication() {
  this.submitted.set(false);
  this.submittedData.set(null);
  this.submitAttempted.set(false);
}
}