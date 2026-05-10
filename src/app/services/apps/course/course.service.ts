import { Injectable, signal } from '@angular/core';
import {courseList} from "src/app/pages/apps/template/courses/courseData";
import {course} from "src/app/pages/apps/template/courses/course";

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  public course = signal<course[]>(courseList);

  public getCourse(): course[] {
    return this.course();
  }
}
