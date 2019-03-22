import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  signupForm: FormGroup;
  genders = ['male', 'female'];
  forbiddenUsernames = ['Admin', 'Hacker'];

  ngOnInit() {

    /* Create the form (FormGroup with FormControls) object */
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]), /* see forbiddenNames(), don't forget to bind "this" !!! */
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails), /* note: if using this in async validation function bind "this too." */
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([]) /* see onAddHobby() */
    });

    /* Subscribe value changes */
    this.signupForm.valueChanges.subscribe(
      (value) => console.log(value)
    );

    /* Subscribe status changes */
    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );

    /* overwrite all form values with following values:
    this.signupForm.setValue({
      'userData': {
        'username': 'the best name!',
        'email': 'test@test.com'
      },
      'gender': 'male',
      'hobbies': []
    }); */

    /* just patch some values of the form. It doesn't overwrite unset values: */
    this.signupForm.patchValue({
      'userData': {
        'username': 'I just patched the name!'
      }
    });

  }

  onSubmit() {
    console.log(this.signupForm);
    /* Reset the form and after that set a value for the radio buttons! Otherwise no radio option is selected anymore. */
    this.signupForm.reset({
      'gender': 'male'
    });

  }

  /**
   * Add text fields to the form.
   */
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  /**
   * Custom validation function.
   * @param control
   */
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if(this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  /**
   *
   * @param control Custom async validation function.
   */
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
      const promise = new Promise<any>((resolve, reject) => {
        setTimeout(() => { /* Simulate calculating webservice*/
          if(control.value === 'test@test.com') {
            resolve({'emaiLIsForbidden': true});
          } else {
            resolve(null);
          }
        }, 1500); /* Simulate calculating webservice*/
      });
      return promise;
  }

}
