"use client";

import { useFormState } from "react-dom";
import { createLesson, updateLesson } from "@/lib/serverAction";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LessonForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const [state, formAction] = useFormState(type === "create" ? createLesson : updateLesson, {
    success: false,
    error: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  return (
    <form action={formAction} className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new Lesson" : "Update Lesson"}</h1>
      
      {/* Champ caché pour l'ID en mode update */}
      {type === "update" && <input type="hidden" name="id" defaultValue={data?.id} />}
      
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Lesson Name</label>
        <input name="name" defaultValue={data?.name} className="p-2 border rounded-md" required />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Day</label>
        <select name="day" defaultValue={data?.day} className="p-2 border rounded-md" required>
          <option value="">Select a Day</option>
          <option value="MONDAY">MONDAY</option>
          <option value="TUESDAY">TUESDAY</option>
          <option value="WEDNESDAY">WEDNESDAY</option>
          <option value="THURSDAY">THURSDAY</option>
          <option value="FRIDAY">FRIDAY</option>
        </select>
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Start Time</label>
          <input name="startTime" type="time" defaultValue={data?.startTime?.substring(11, 16)} className="p-2 border rounded-md" required />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">End Time</label>
          <input name="endTime" type="time" defaultValue={data?.endTime?.substring(11, 16)} className="p-2 border rounded-md" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Subject</label>
        <select name="subjectId" defaultValue={data?.subjectId} className="p-2 border rounded-md" required>
          <option value="">Select a Subject</option>
          {relatedData?.subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Class</label>
        <select name="classId" defaultValue={data?.classId} className="p-2 border rounded-md" required>
          <option value="">Select a Class</option>
          {relatedData?.classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Teacher</label>
        <select name="teacherId" defaultValue={data?.teacherId} className="p-2 border rounded-md" required>
          <option value="">Select a Teacher</option>
          {relatedData?.teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name} {t.surname}</option>)}
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        {type === "create" ? "Create Lesson" : "Update Lesson"}
      </button>
    </form>
  );
};

export default LessonForm;