import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import apiOlissyMongoDB from '../../api'

@Injectable({
  providedIn: 'root',
})

export class SearchInputService {

  constructor(private http: HttpClient){}

  private url = apiOlissyMongoDB

  public searchProductsByRegex(search: string) {
    return this.http.get<any>(this.url + '/regex/?text=' + search);
  }

  public searchProductsByDeepSearch(search: string) {
    return this.http.get<any>(this.url + '/text/?text=' + search);
  }
}
