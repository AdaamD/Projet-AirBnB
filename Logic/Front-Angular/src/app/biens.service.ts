import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiensService {
  private apiUrl = 'http://localhost:8888/biens';

  constructor(private http: HttpClient) { }

  getBiens(): Observable<any> {
    let biens:Observable<any> = this.http.get(this.apiUrl);
    biens.subscribe(data =>{
      console.log("DATA getBiens");
      console.log(data);
    });

    return biens

  
    

  }
}
