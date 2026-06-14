"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { createEvent } from "@/lib/serverAction";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  classId: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const EventForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: { classes: { id: number; name: string }[] };
}) => {
  const { register, handleSubmit } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const router = useRouter();
  const [state, formAction] = useFormState(createEvent, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("startTime", data.startTime.toISOString());
    formData.append("endTime", data.endTime.toISOString());
    if (data.classId) formData.append("classId", data.classId);
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Event has been created!");
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen]);

  // FORMULAIRE COMPACT POUR ÉVITER QUE LE BOUTON NE DISPARAISSE
  return (
    <form className="flex flex-col gap-3 p-2" onSubmit={onSubmit}>
      <h1 className="text-lg font-semibold">Create a new Event</h1>
      <input {...register("title")} placeholder="Title" className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm" />
      <textarea {...register("description")} placeholder="Description" className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm h-20" />
      <div className="flex gap-2">
        <input type="datetime-local" {...register("startTime")} className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm w-1/2" />
        <input type="datetime-local" {...register("endTime")} className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm w-1/2" />
      </div>
      <select {...register("classId")} className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm">
        <option value="">Global Event</option>
        {relatedData?.classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button type="submit" className="bg-lamaPurple text-white p-2 rounded-md text-sm hover:bg-purple-700 transition">
        Create Event
      </button>
    </form>
  );
};

export default EventForm;