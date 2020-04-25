import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  //one instance of service available to the whole application.
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  //stateless observable service method.
  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      //will trigger only one single request even though we have multiple subscriptions.
      //this will be applicable only to httpClient service calls but not all.
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }
}
