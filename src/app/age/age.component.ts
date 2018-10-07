import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { createRequestQRCode, removeRequestQRCode, RequestData, Action } from '@bloomprotocol/share-kit';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';

export interface Member {
  token: string;
  age: number;
  email: string;
  id: string;
}

@Component({
  selector: 'app-age',
  templateUrl: './age.component.html',
  styleUrls: ['./age.component.scss']
})
export class AgeComponent implements OnInit {
  isLoading: boolean;
  showqr = true;
  showbutton = true;
  showresults = false;
  ageLimit: number;
  approved = false;
  membersCollection: AngularFirestoreCollection<Member>;
  newMemberTemplate: Member = {
    token: '',
    age: 0,
    email: '',
    id: ''
  };

  constructor(private db: AngularFirestore) {
    this.membersCollection = db.collection('bloomed');
  }

  ngOnInit() {
    this.initAgeLimit();
  }
  initAgeLimit() {
    const localAge = localStorage.getItem('ageLimit');
    if (localAge) {
      try {
        this.ageLimit = Number.parseInt(localAge, 10);
      } catch {
        this.ageLimit = 50;
      }
    } else {
      this.ageLimit = 50;
    }
  }
  generateQRCode() {
    this.initAgeLimit();
    this.showbutton = false;
    this.showresults = false;
    const that = this;
    const newMember = Object.assign({}, this.newMemberTemplate);
    this.membersCollection.add(newMember).then(function(addedMember: DocumentReference) {
      const token = addedMember.id;
      const requestData: RequestData = {
        action: Action.attestation,
        token: token,
        url: 'https://us-central1-stemid-2c13b.cloudfunctions.net/bloomcallback',
        org_logo_url: 'https://stemid-2c13b.firebaseapp.com/assets/stemid-logo.png',
        org_name: 'StemId',
        org_usage_policy_url: 'https://bloom.co/legal/terms',
        org_privacy_policy_url: 'https://bloom.co/legal/privacy',
        types: ['email']
      };
      const options = {
        size: 200
      };
      console.log('token ' + token);
      const requestQRCodeId = createRequestQRCode(requestData, document.getElementById('QR-Container'), options);
      setTimeout(() => {
        that.showbutton = true;
        that.showresults = true;
        const dummy = document.createElement('div');
        document.getElementById('QR-Container').innerHTML = dummy.innerHTML;
        if (that.ageLimit < 41) {
          // hard coded to get around bloom api issue
          that.approved = true;
        } else {
          that.approved = false;
        }
      }, 30000);
    });
  }
}
