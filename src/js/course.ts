// Progression som alias
export type Progression = "A" | "B" | "C";

// Interface för kursinformation
interface CourseInterface {
  code: string;
  name: string;
  progression: Progression;
  syllabus: string;
}

export class Course implements CourseInterface {
  code: string;
  name: string;
  progression: Progression;
  syllabus: string;

  // Konstruktor för kursobjekt
  constructor(c: string, n: string, p: Progression, s: string) {
    this.code = c;
    this.name = n;
    this.progression = p;
    this.syllabus = s;
  }

  // Metod för att hämta kurskod
  getCourse(): string {
    return this.code;
  }

  // Metod för att hämta kursnamn
  getName(): string {
    return this.name;
  }

  // Metod för att hämta kursporgression
  getProgression(): Progression {
    return this.progression;
  }

  // Metod för att hämta url med kursplan
  getSyllabus(): string {
    return this.syllabus;
  }

}