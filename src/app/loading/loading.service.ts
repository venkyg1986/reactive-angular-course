import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, of } from "rxjs";
import { tap, concatMap, finalize } from "rxjs/operators";

@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    //the benefit of this pattern is
    //for sure return of(null) will be called from UI component
    //with courses$ |async, which means subscription
    //so the loading on and off are mainly relied on observable subscription and unsubscription
    //which is not in previous call where we manually wrote this.loadingService.on() inside
    //reloadCourses() method in home component. how sweet is this implementation?
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
