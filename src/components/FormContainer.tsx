import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { getRole as role } from "@/lib/role";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { role: userRole, currentUserId } = await role();

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;

      case "exam":
      case "assignment":
        const lessons = await prisma.lesson.findMany({
          where: {
            ...(userRole === "teacher" 
              ? { 
                  teacher: {
                    id: currentUserId!,
                  }
                } 
              : {}),
          },
          select: { 
            id: true, 
            name: true,
            subject: {
              select: {
                name: true
              }
            }
          },
        });
        relatedData = { lessons: lessons };
        break;

      case "result":
        const students = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
          orderBy: { name: "asc" }
        });

        const exams = await prisma.exam.findMany({
          where: {
            ...(userRole === "teacher" ? { lesson: { teacherId: currentUserId! } } : {})
          },
          select: { id: true, title: true }
        });

        const assignments = await prisma.assignment.findMany({
          where: {
            ...(userRole === "teacher" ? { lesson: { teacherId: currentUserId! } } : {})
          },
          select: { id: true, title: true }
        });

        relatedData = { students, exams, assignments };
        break;

      // ✅ AJOUT : Chargement des classes pour les événements et annonces
      case "event":
      case "announcement":
        const classes = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: classes };
        break;

      default:
        break;
    }
  }

  return (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      relatedData={relatedData}
    />
  );
};

export default FormContainer;