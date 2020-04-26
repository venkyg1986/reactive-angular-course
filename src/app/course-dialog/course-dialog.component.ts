import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    public loadingService: LoadingService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
    //this.loadingService.loadingOn();
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;
    // this.coursesService.saveCourse(this.course.id, changes).subscribe((val) => {
    //   this.dialogRef.close(val);
    // });
    const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes);
    const savedCourse$ = this.loadingService.showLoaderUntilCompleted(
      saveCourse$
    );
    savedCourse$.subscribe((val) => {
      this.dialogRef.close(val);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
