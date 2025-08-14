/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';
//import baserUrl from '../helper';

@Injectable({
  providedIn: 'root'
})
export class QrPersonalService {
  private endpoint = `${baserUrl}/generar-qr-jwt-para-usuario`;

  constructor(private http: HttpClient) {}

 getQrPersonal(): Observable<Blob> {
  return this.http.get(this.endpoint, {
    responseType: 'blob',
    withCredentials: true // 👈 Esto envía la cookie de sesión (JSESSIONID)
  });
}

}
*/


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import baserUrl from './helper';
//import baserUrl from '../helper';

@Injectable({
  providedIn: 'root'
})
export class QrPersonalService {
 //private endpoint = `${baserUrl}/generar-qr-jwt-para-usuario`;
 
 private endpoint = `${baserUrl}/qr/generar-qr-jwt-para-usuario`;



  constructor(private http: HttpClient) {}

  /*getQrPersonal(): Observable<Blob> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // ✅ necesario si usás JWT
    });

    return this.http.get(this.endpoint, {
      headers,
      responseType: 'blob'
    });
  }*/

    getQrPersonal(): Observable<Blob> {
  return this.http.get(this.endpoint, {
    responseType: 'blob' // 🔁 Muy importante
  });
}


}
