/* Moment 1, DT208G TypeScript, Åsa Lindskog sali1502@student.miun.se */

import { Course, Progression } from "./course";
import { storeManager } from "./StoreManager";

class Main {
  private courseArr: Course[] = [];
  private code: HTMLInputElement;
  private name: HTMLInputElement;
  private progression: HTMLInputElement;
  private syllabus: HTMLInputElement;
  private resetButton: HTMLButtonElement;
  private errorMessage: HTMLElement;
  private editingIndex: number | null = null;

  constructor() {
    this.courseArr = storeManager.loadCourses();
    this.displayCourses();
  }

  setupEventListeners(): void {
    const form = document.querySelector("#addCourseForm");

    // Felmeddelande för ej unik kurskod
    this.errorMessage = document.createElement("p");
    this.errorMessage.id = "errorMessage";
    this.errorMessage.style.color = "white";

    form?.addEventListener("submit", (event) => {
      event.preventDefault();

      this.code = document.getElementById("code") as HTMLInputElement;
      this.name = document.getElementById("name") as HTMLInputElement;
      this.progression = document.getElementById("level") as HTMLInputElement;
      this.syllabus = document.getElementById("syllabus") as HTMLInputElement;

      const code = this.code.value;
      const name = this.name.value;
      const progression = this.progression.value as Progression;
      const syllabus = this.syllabus.value;

      // Rensa gamla errormeddelanden
      this.errorMessage.textContent = "";

      // Kontrollera progression
      if (!this.checkLevel(progression)) {
        return;
      }

      // Kontrollera om kurskoden är unik för nya kurser
      if (this.editingIndex === null && !this.isCodeUnique(code)) {
        this.errorMessage.textContent = `Kurskod "${code}" används redan. Ange en unik kurskod.`;
        // Visa felmeddelande
        form.appendChild(this.errorMessage);
        return;
      }
      if (this.editingIndex !== null) {
        this.updateCourse(code, name, progression, syllabus);
      } else {
        this.createCourse(code, name, progression, syllabus);
      }

      // Visa kurser och återställ formulär
      this.displayCourses();
      this.resetForm();
    });

    // Återställ formulär vid klick på Ångra-knapp
    this.resetButton = document.querySelector("#resetButton") as HTMLButtonElement;
    this.resetButton.addEventListener("click", () => {
      this.resetForm();
    });
  }

  // Töm formulär
  resetForm(): void {
    this.code.value = "";
    this.name.value = "";
    this.progression.value = "";
    this.syllabus.value = "";
    this.editingIndex = null;
  }

  // Koll om progression är A, B eller C 
  checkLevel(progression: Progression): boolean {
    const existingError = document.querySelector("#progressionError");
    if (existingError) {
      existingError.remove();
    }

    // Felmeddelande för felaktig input för progression
    if (progression !== "A" && progression !== "B" && progression !== "C") {
      const errorMessage = document.createElement("p");
      errorMessage.id = "progressionError";
      errorMessage.textContent = "Progression måste vara A, B eller C";
      document.body.appendChild(errorMessage);
      return false;
    } else {
      return true;
    }
  }

  // Koll om kurskod är unik
  isCodeUnique(code: string): boolean {
    return !this.courseArr.some(course => course.code === code);
  }

  // Lägg till kurs i array och spara i localstorage
  addCourse(course: Course): void {
    this.courseArr.push(course);
    storeManager.saveCourses(this.courseArr);
  }

  // Skapa ny kurs
  createCourse(code: string, name: string, progression: Progression, syllabus: string): void {
    this.addCourse(new Course(code, name, progression, syllabus));
  }

  // Uppdatera kurs och lägg till i array samt spara i localstorage
  updateCourse(code: string, name: string, progression: Progression, syllabus: string): void {
    if (this.editingIndex !== null) {
      this.courseArr[this.editingIndex] = new Course(code, name, progression, syllabus);
      storeManager.saveCourses(this.courseArr);
      this.editingIndex = null;
      this.resetForm();
    }
  }

  // Skriv ut kurser i tabell till skärmen med DOM
  displayCourses(): void {
    const tbody = document.getElementById("displayCourseTable") as HTMLTableSectionElement;
    tbody.innerHTML = "";

    this.courseArr.forEach((course, index) => {
      const row = document.createElement("tr");

      const courseCode = document.createElement("td");
      courseCode.textContent = course.code;
      row.appendChild(courseCode);

      const courseName = document.createElement("td");
      courseName.textContent = course.name;
      row.appendChild(courseName);

      const progression = document.createElement("td");
      progression.textContent = course.progression;
      row.appendChild(progression);

      const syllabus = document.createElement("td");

      // Skapa länk till kursplan 
      if (course.syllabus.startsWith("http")) {

        const syllabusLink = document.createElement("a");
        syllabusLink.href = course.syllabus;
        syllabusLink.textContent = "Kursplan";
        syllabusLink.target = "_blank";
        syllabus.appendChild(syllabusLink);
      } else {
        syllabus.textContent = course.syllabus;
      }

      row.appendChild(syllabus);

      // Knappar för att ändra och radera kurser
      const actions = document.createElement("td");

      // Knapp för att radera kurs
      const removeButton = document.createElement("button");
      removeButton.textContent = "Radera";
      removeButton.addEventListener("click", () => {
        this.courseArr.splice(index, 1);
        storeManager.saveCourses(this.courseArr);
        this.displayCourses();
      });

      // Knapp för att ändra kurs
      const editButton = document.createElement("button");
      editButton.textContent = "Ändra";
      editButton.addEventListener("click", () => {
        this.editingIndex = index;
        this.code.value = course.code;
        this.name.value = course.name;
        this.progression.value = course.progression;
        this.syllabus.value = course.syllabus;
      });

      actions.appendChild(removeButton);
      actions.appendChild(editButton);
      row.appendChild(actions);

      tbody.appendChild(row);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const main = new Main();
  main.setupEventListeners();
});