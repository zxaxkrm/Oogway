"use client";
import React, { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createIdea } from "@/lib/actions";

const StartUpForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");

  const router = useRouter();

  type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  _id?: string;
};

  const handleFormSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const results = await createIdea(prevState, formData, pitch);

      if (results.status == "SUCCESS") {
        toast.success("Your startup pitch has been created successfully");
        router.push(`/startup/${results._id}`);
      }

      return results;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast.error("Please check your inputs and try again!");

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("An unexpected error has occurred");

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div className="">
        <label htmlFor="title" className="startup-form-label">
          Title
        </label>

        <Input
          id="title"
          name="title"
          className="startup-form-input"
          required
          placeholder="Startup Title"
        />
        {errors.title && <p className="startup-form-error">{errors.title}</p>}
      </div>

      <div className="">
        <label htmlFor="description" className="startup-form-label">
          Description
        </label>

        <Textarea
          id="description"
          name="description"
          className="startup-form-textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="startup-form-error">{errors.description}</p>
        )}
      </div>

      <div className="">
        <label htmlFor="Category " className="startup-form-label">
          Category
        </label>

        <Input
          id="category"
          name="category"
          className="startup-form-input"
          required
          placeholder="Startup Category(e.g Tech, Health, Education)"
        />
        {errors.category && (
          <p className="startup-form-error">{errors.category}</p>
        )}
      </div>

      <div className="">
        <label htmlFor="link" className="startup-form-label">
          Image URL
        </label>

        <Input
          id="link"
          name="link"
          className="startup-form-input"
          required
          placeholder="Startup Image URL"
        />
        {errors.link && <p className="startup-form-error">{errors.link}</p>}
      </div>

      <div className="" data-color-mode="light">
        <label htmlFor="pitch" className="startup-form-label">
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form-error">{errors.pitch}</p>}
      </div>

      <Button type="submit" className="startup-form-btn" variant="pink" disabled={isPending}>
        {isPending ? "Submitting...." : "Submit Your Startup"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartUpForm;
