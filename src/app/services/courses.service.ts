import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map } from "rxjs/operators";

@Injectable({
  //one instance of service available to the whole application.
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http
      .get<Course[]>("/api/courses")
      .pipe(map((response) => response["payload"]));
  }
}
