import {AfterContentChecked, Component, OnInit} from '@angular/core';

import web3 from '../web3';
import insurance from '../Insurance';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentChecked{
  messageFromContractToAngular = 'insurance-angular';

  constructor(private formBuilder: FormBuilder) {  }

  async ngAfterContentChecked() {
// contentChild is updated after the content has been checked
    const messageInit = await insurance.methods.mark().call();
    this.messageFromContractToAngular = messageInit;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      'newmessage': this.newmessage
    });
  }

  message = '';
  state = '';
  registerForm: FormGroup;
  newmessage = new FormControl('', Validators.required);
  submitted = false;


  async onSubmit() {
    this.submitted = true;
// stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const m = this.registerForm.controls.newmessage.value;
    const accounts = await web3.eth.getAccounts();
    this.state = 'Waiting on transaction success...';
    await insurance.methods.setMark("aaaaaaaa").send({ from: accounts[0]});
    this.message = await insurance.methods.mark().call();
    this.state = 'Your message is modified';
    this.registerForm.setValue({newmessage: ''});
  }

  
}
