"use server";

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

// ==========================================
// SUBJECT ACTIONS
// ==========================================

export const createSubject = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: { connect: data.teachers ? data.teachers.map((id: string) => ({ id })) : [] },
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateSubject = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: { set: data.teachers ? data.teachers.map((id: string) => ({ id })) : [] },
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.subject.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// CLASS ACTIONS
// ==========================================

export const createClass = async (currentState: CurrentState, data: any) => {
  try { await prisma.class.create({ data }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateClass = async (currentState: CurrentState, data: any) => {
  try { await prisma.class.update({ where: { id: data.id }, data }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteClass = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.class.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// TEACHER ACTIONS
// ==========================================

export const createTeacher = async (currentState: CurrentState, data: any) => {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username, password: data.password, firstName: data.name, lastName: data.surname,
    });
    await prisma.teacher.create({
      data: {
        id: user.id, username: data.username, name: data.name, surname: data.surname, email: data.email,
        phone: data.phone, address: data.address, img: data.img, bloodType: data.bloodType, sex: data.sex,
        birthday: new Date(data.birthday),
        subjects: { connect: data.subjects ? data.subjects.map((id: string) => ({ id: parseInt(id) })) : [] },
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateTeacher = async (currentState: CurrentState, data: any) => {
  try {
    const { id, subjects, ...personalData } = data;
    await prisma.teacher.update({
      where: { id },
      data: {
        ...personalData,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
        subjects: { set: subjects ? subjects.map((id: string) => ({ id: parseInt(id) })) : [] },
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.teacher.delete({ where: { id: data.get("id") as string } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// STUDENT ACTIONS
// ==========================================

export const createStudent = async (currentState: CurrentState, data: any) => {
  try {
    const classItem = await prisma.class.findUnique({ where: { id: data.classId } });
    if (!classItem) return { success: false, error: true };
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username, password: data.password, firstName: data.name, lastName: data.surname,
    });
    await prisma.student.create({
      data: {
        id: user.id, username: data.username, name: data.name, surname: data.surname, email: data.email,
        phone: data.phone, address: data.address, img: data.img, bloodType: data.bloodType, sex: data.sex,
        birthday: new Date(data.birthday), classId: data.classId, gradeId: classItem.gradeId, parentId: data.parentId,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateStudent = async (currentState: CurrentState, data: any) => {
  try {
    const { id, ...studentData } = data;
    let extraData: { gradeId?: number } = {};
    if (studentData.classId) {
      const classItem = await prisma.class.findUnique({ where: { id: studentData.classId } });
      if (classItem) extraData.gradeId = classItem.gradeId;
    }
    await prisma.student.update({ where: { id }, data: { ...studentData, birthday: studentData.birthday ? new Date(studentData.birthday) : undefined, ...extraData } });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.student.delete({ where: { id: data.get("id") as string } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// LESSON ACTIONS
// ==========================================

export const createLesson = async (currentState: CurrentState, formData: FormData) => {
  try {
    await prisma.lesson.create({
      data: {
        name: formData.get("name") as string,
        day: formData.get("day") as any,
        startTime: new Date(`1970-01-01T${formData.get("startTime")}:00Z`),
        endTime: new Date(`1970-01-01T${formData.get("endTime")}:00Z`),
        subjectId: parseInt(formData.get("subjectId") as string),
        classId: parseInt(formData.get("classId") as string),
        teacherId: formData.get("teacherId") as string,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateLesson = async (currentState: CurrentState, formData: FormData) => {
  try {
    await prisma.lesson.update({
      where: { id: parseInt(formData.get("id") as string) },
      data: {
        name: formData.get("name") as string,
        day: formData.get("day") as any,
        startTime: new Date(`1970-01-01T${formData.get("startTime")}:00Z`),
        endTime: new Date(`1970-01-01T${formData.get("endTime")}:00Z`),
        subjectId: parseInt(formData.get("subjectId") as string),
        classId: parseInt(formData.get("classId") as string),
        teacherId: formData.get("teacherId") as string,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteLesson = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.lesson.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// EXAM ACTIONS
// ==========================================

export const createExam = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        lessonId: parseInt(data.lessonId),
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateExam = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.exam.update({
      where: { id: parseInt(data.id) },
      data: {
        title: data.title,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        lessonId: data.lessonId ? parseInt(data.lessonId) : undefined,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteExam = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.exam.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// ASSIGNMENT ACTIONS
// ==========================================

export const createAssignment = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        lessonId: parseInt(data.lessonId),
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateAssignment = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.assignment.update({
      where: { id: parseInt(data.id) },
      data: {
        title: data.title,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        lessonId: data.lessonId ? parseInt(data.lessonId) : undefined,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteAssignment = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.assignment.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// RESULT ACTIONS
// ==========================================

export const createResult = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        studentId: data.studentId,
        ...(data.examId ? { examId: parseInt(data.examId) } : {}),
        ...(data.assignmentId ? { assignmentId: parseInt(data.assignmentId) } : {}),
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const updateResult = async (currentState: CurrentState, data: any) => {
  try {
    await prisma.result.update({
      where: { id: parseInt(data.id) },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId ? parseInt(data.examId) : null,
        assignmentId: data.assignmentId ? parseInt(data.assignmentId) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteResult = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.result.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// EVENT ACTIONS
// ==========================================

export const createEvent = async (currentState: CurrentState, formData: FormData) => {
  try {
    await prisma.event.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        startTime: new Date(formData.get("startTime") as string),
        endTime: new Date(formData.get("endTime") as string),
        classId: formData.get("classId") ? parseInt(formData.get("classId") as string) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteEvent = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.event.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};

// ==========================================
// ANNOUNCEMENT ACTIONS
// ==========================================

export const createAnnouncement = async (currentState: CurrentState, formData: FormData) => {
  try {
    await prisma.announcement.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        date: new Date(formData.get("date") as string),
        classId: formData.get("classId") ? parseInt(formData.get("classId") as string) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) { console.log(err); return { success: false, error: true }; }
};

export const deleteAnnouncement = async (currentState: CurrentState, data: FormData) => {
  try { await prisma.announcement.delete({ where: { id: parseInt(data.get("id") as string) } }); return { success: true, error: false }; }
  catch (err) { console.log(err); return { success: false, error: true }; }
};