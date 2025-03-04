import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export abstract class BaseMediaService<T = number> {  
    abstract upload(blob:Blob):Observable<T[]>;
  }