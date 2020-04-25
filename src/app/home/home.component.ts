import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { ThrowStmt } from "@angular/compiler";

// Smart Component - knows about the service layer,knows where the data comes from,how to prepare the dervied observables that the view layer needs inorder to obtain necessary data.

//Presentation component will be given the responsibility how to show the data, thats why we passed the observable to the presentational component "courses-card-list". This presentational component inturn doesnot have any information of service layer and how data is prepared using derived observables.

//Thats why home component has very little information of html how the data is displayed and shown to the user.

//so as a pattern, before implementing something just think of roles of smart and presentational components.

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  //A component written in an reactive state, there will not be mutuable data report variables holding data. So we change all to observables which are reactive.

  // beginnerCourses: Course[];
  // advancedCourses: Course[];

  //so data is not available as a mutable state,instead we only have observable.
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  //likewise since we are using async pipes we can avoid potential memory leaks caused due to
  //manual subscription and unsubscription.

  constructor(
    //private http: HttpClient,
    private coursesService: CoursesService // , // private dialog: MatDialog
  ) {}

  ngOnInit() {
    // this.http.get("/api/courses").subscribe((res) => {
    //   const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

    //   this.beginnerCourses = courses.filter(
    //     (course) => course.category == "BEGINNER"
    //   );

    //   this.advancedCourses = courses.filter(
    //     (course) => course.category == "ADVANCED"
    //   );
    // });

    //we no longer have potential call back hell included within subscribe method.
    const courses$ = this.coursesService
      .loadAllCourses()
      .pipe(map((courses) => courses.sort(sortCoursesBySeqNo)));

    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }

  // editCourse(course: Course) {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = "400px";

  //   dialogConfig.data = course;

  //   const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  // }
}
