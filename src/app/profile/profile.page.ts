import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  constructor(private auth: Auth) { }

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      console.log('User is logged in:', user);
    } else {
      console.log('User is not logged in');
    }
  }


}