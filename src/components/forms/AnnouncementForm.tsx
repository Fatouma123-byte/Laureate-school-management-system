"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { createAnnouncement } from "@/lib/serverAction";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
  classId: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const AnnouncementForm = ({
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
  const [state, formAction] = useFormState(createAnnouncement, { success: false, error: false });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date.toISOString());
    if (data.classId) formData.append("classId", data.classId);
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Announcement has been created!");
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen]);

  // VERSION COMPACTE POUR AFFICHER LE BOUTON
  return (
    <form className="flex flex-col gap-3 p-2" onSubmit={onSubmit}>
      <h1 className="text-lg font-semibold">Create a new Announcement</h1>
      <input 
        {...register("title")} 
        placeholder="Title" 
        className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm w-full" 
      />
      <textarea 
        {...register("description")} 
        placeholder="Description" 
        className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm w-full h-24" 
      />
      <input 
        type="date" 
        {...register("date")} 
        className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm w-full" 
      />
      <select 
        {...register("classId")} 
        className="ring-[1px] ring-gray-300 p-1.5 rounded-md text-sm w-full"
      >
        <option value="">Global Announcement</option>
        {relatedData?.classes.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button 
        type="submit" 
        className="bg-lamaSky text-white p-2 rounded-md text-sm hover:bg-sky-600 transition"
      >
        Create Announcement
      </button>
    </form>
  );
};

export default AnnouncementForm;