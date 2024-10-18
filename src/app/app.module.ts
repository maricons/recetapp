import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire/compat';
import { NewRecipeModalComponent } from './components/new-recipe-modal/new-recipe-modal.component'; // Importa tu componente
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { RecipeDetailModalComponent } from './components/recipe-detail-modal/recipe-detail-modal.component';
import { provideStorage, getStorage } from '@angular/fire/storage';  // Cambiado
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable,of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryService } from './services/category.service';
//not obsoleto


@NgModule({
  declarations: [AppComponent, NewRecipeModalComponent, RecipeDetailModalComponent],
  imports: [
    BrowserModule,
    //provideHttpClient()
    //HttpHeaders,
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({ 
    "projectId": "ionic-movil-grupo9", "appId": "1:39435686784:web:92314e82706aec62f62765", 
    "storageBucket": "ionic-movil-grupo9.appspot.com", "apiKey": "AIzaSyAURv0OnOrELBad898eWLEKi-sYBcxuYUE",
     "authDomain": "ionic-movil-grupo9.firebaseapp.com", "messagingSenderId": "39435686784", "measurementId": "G-KWK90N6ZJ0" })), 
     provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()), 
     provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()),
      provideHttpClient(), CategoryService],
  bootstrap: [AppComponent],
})
export class AppModule { }
