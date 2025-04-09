"use client";

import CsrfToken from "@/components/csrf";
import { contactFormAction } from "@/lib/actions/contact";
import { useActionState, useEffect, useState } from "react";
import { z } from "zod";

// Define the Zod schema for the form data
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  comment: z.string().min(1, "Message is required"),
});

const initialState = {
  errors: {} as Record<string, string[]>,
  success: undefined,
  msg: undefined,
};

export default function Contact() {
  const [state, formAction, pending] = useActionState(
    contactFormAction,
    initialState
  );
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [VErrors, setErrors] = useState<Record<string, string[]>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactAction = async (formData: FormData) => {
    // Convert FormData to a plain object
    const formValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      comment: formData.get("comment") as string,
    };

    // Validate the form data using Zod
    const result = contactFormSchema.safeParse(formValues);

    if (!result.success) {
      // If validation fails, set the errors in the state
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});

    // If validation passes, proceed with the form action
    return formAction(formData);
  };

  useEffect(() => {
    if (state.errors) {
      setErrors(state.errors);
    }
  }, [state.errors]);
  useEffect(() => {
    if (state.success) {
      setFormValues({
        name: "",
        email: "",
        comment: "",
      });
    }
  }, [state.success]);

  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <section className="contact-us container">
        <div className="mw-930">
          <div className="contact-us__form">
            <form name="contact-us-form" action={handleContactAction}>
              <CsrfToken />
              <h3 className="mb-5">Get In Touch</h3>

              {(state.error || state.success) && (
                <div
                  className={`alert py-3 mb-3 ${state.error && "alert-danger"} 
              ${state.success && "alert-success"}`}
                >
                  {state.msg}
                </div>
              )}
              <div className="form-floating my-4">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Name *"
                  value={formValues.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="contact_us_name">Name *</label>
                {VErrors?.name?.map((error) => (
                  <span className="text-red" key={error}>
                    {error}
                  </span>
                ))}
              </div>
              <div className="form-floating my-4">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email address *"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
                <label htmlFor="contact_us_name">Email address *</label>
                {VErrors?.email?.map((error) => (
                  <span className="text-red" key={error}>
                    {error}
                  </span>
                ))}
              </div>
              <div className="my-4">
                <textarea
                  className="form-control form-control_gray"
                  name="comment"
                  placeholder="Your Message"
                  cols={30}
                  rows={8}
                  value={formValues.comment}
                  onChange={handleInputChange}
                ></textarea>
                {VErrors?.comment?.map((error) => (
                  <span className="text-red" key={error}>
                    {error}
                  </span>
                ))}
              </div>
              <div className="my-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pending}
                >
                  {pending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
