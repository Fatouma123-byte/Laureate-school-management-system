# 🎓 School Management System – Full-Stack Web Application

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white" alt="Next.js" height="30"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" height="30"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" height="30"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" height="30"/>
  <img src="https://img.shields.io/badge/Prisma-0C344B?logo=prisma&logoColor=white" alt="Prisma" height="30"/>
</p>

---

A modern, robust full-stack **School Management System** designed for academic administration. The platform enables efficient management of students, teachers, parents, and administrative tasks through a centralized, role-based dashboard.

## 🚀 Key Features

- 🔐 **Role-based Dashboards**: Tailored interfaces for Admin, Teacher, Student, and Parent.
- 📅 **Interactive Calendar**: Full-featured scheduling for academic events and lessons.
- 📊 **Dynamic Analytics**: Visual insights through interactive charts (Recharts).
- 🎨 **User Interface**: Modern, responsive design with Light/Dark theme support.
- 📝 **CRUD Operations**: Comprehensive management of school data (Students, Teachers, Classes, Exams, Results).
- 🛠️ **Form Management**: Validation-based entry system for academic records.

---

## 🛠️ Tech Stack

**Frontend**:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts (Data Visualization)

**Backend & Database**:
- Prisma ORM
- PostgreSQL
- Server Actions

---

## 📂 Project Structure

```text
prisma/               # Database schema and migrations
src/
├── app/              # Next.js App Router (Dashboards & Auth)
├── components/       # UI Components (Charts, Tables, Forms)
├── lib/              # Utility functions and Database client
└── middleware.ts     # Authentication and route protection
tailwind.config.ts    # Tailwind CSS configuration
tsconfig.json         # TypeScript configuration