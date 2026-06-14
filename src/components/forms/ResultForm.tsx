"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { createResult } from "@/lib/serverAction"; // ✅ Import de l'action
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
  score: z.coerce.number().min(0, { message: "Score must be at least 0!" }).max(100, { message: "Score cannot exceed 100!" }),
  studentId: z.string().min(1, { message: "Student is required!" }),
  examId: z.string().optional(),
  assignmentId: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { 
    students: { id: string; name: string; surname: string }[]; 
    exams: { id: number; title: string }[]; 
    assignments: { id: number; title: string }[] 
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const router = useRouter();

  // ✅ Gestion de l'état du formulaire avec l'action serveur
  const [state, formAction] = useFormState(createResult, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((formData) => {
    // On déclenche l'action serveur avec les données validées
    formAction(formData);
  });

  // ✅ Effet pour intercepter la réussite de l'enregistrement
  useEffect(() => {
    if (state.success) {
      toast.success(`Result has been ${type === "create" ? "created" : "updated"} successfully! 🎯`);
      setOpen(false);
      router.refresh(); // Recharge les données du tableau à l'écran
    }
    if (state.error) {
      toast.error("Something went wrong! Please try again.");
    }
  }, [state, router, type, setOpen]);

  const students = relatedData?.students || [];
  const exams = relatedData?.exams || [];
  const assignments = relatedData?.assignments || [];

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result :)" : "Update the result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Champ Score */}
        <div className="flex flex-col gap-2 w-full md:w-[31%]">
          <label className="text-xs text-gray-400">Score</label>
          <input
            type="number"
            {...register("score")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky"
          />
          {errors.score?.message && (
            <p className="text-xs text-red-400">{errors.score.message.toString()}</p>
          )}
        </div>

        {/* Liste Sélection Étudiant */}
        <div className="flex flex-col gap-2 w-full md:w-[31%]">
          <label className="text-xs text-gray-400">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky"
            {...register("studentId")}
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option value={student.id} key={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">{errors.studentId.message.toString()}</p>
          )}
        </div>

        {/* Liste Sélection Examen (Optionnel) */}
        <div className="flex flex-col gap-2 w-full md:w-[31%]">
          <label className="text-xs text-gray-400">Exam (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky"
            {...register("examId")}
          >
            <option value="">Select an exam</option>
            {exams.map((exam) => (
              <option value={exam.id} key={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>

        {/* Liste Sélection Devoir (Optionnel) */}
        <div className="flex flex-col gap-2 w-full md:w-[31%]">
          <label className="text-xs text-gray-400">Assignment (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky"
            {...register("assignmentId")}
          >
            <option value="">Select an assignment</option>
            {assignments.map((assignment) => (
              <option value={assignment.id} key={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;