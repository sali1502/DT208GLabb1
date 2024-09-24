// Funktionalitet för att spara och hämta kurser från localstorage
import { Course } from "./course";

export class storeManager {
    // Sparar kurs i array i localstorage
    static saveCourses(courses: Course[]) {
        localStorage.setItem("courses", JSON.stringify(courses))
    }
    // Hämtar kurser i array från localstorage
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