/* Moment 1, DT208G TypeScript, Åsa Lindskog sali1502@student.miun.se */

// Lagra och hämta kurser från localstorage
import { Course } from "./course";

export class storeManager {
    // Spara kurs i array i localstorage
    static saveCourses(courses: Course[]) {
        localStorage.setItem("courses", JSON.stringify(courses))
    }
    // Hämta kurser i array från localstorage
    static loadCourses(): Course[] {
        const coursesStr = localStorage.getItem("courses");
        if (coursesStr) {
            return JSON.parse(coursesStr);
        }
        else {
            return [];
        }
    }
}