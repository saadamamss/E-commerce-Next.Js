"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CsrfToken from "../../components/csrf";
import { getSession, useSession } from "next-auth/react";
import { SignUpWithCreds } from "@/lib/actions/auth";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";

const signUpSchema = z
  .object({
    name: z
      .string({ required_error: "This field is required" })
      .min(4, "name must be more than 4 letters"),
    email: z
      .string()
      .min(1, "This field is required")
      .email("Invalid email format"),
    password: z.string().min(8, "password can not be less than 8"),
    confirmPassword: z.string().min(8, "password can not be less than 8"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });

const initialState = {
  errors: {},
  error: undefined,
  success: undefined,
  msg: undefined,
};

export default function Page() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  if (session) {
    router.replace("/");
    return null;
  }

  //
  const [state, formAction, pending] = useActionState(
    SignUpWithCreds,
    initialState
  );
  const [loginError, setLoginError] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") as string;

  // Add form state for email and password
  const [formState, setFormState] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  // handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  try to login
  async function TryLogin(formData: FormData) {
    const creds = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // validate creds
    const validate = signUpSchema.safeParse(creds);
    if (!validate.success) {
      setErrors(validate.error.flatten().fieldErrors);
      return;
    }
    // empty errors
    setErrors({});
    formAction(formData);
  }

  useEffect(() => {
    if (state?.success) {
      (async () => {
        await updateSession(await getSession());
      })();
      router.replace(redirectedFrom ?? "/dashboard");
    } else if (state?.error) {
      setLoginError(state.msg);
    } else if (state?.errors) {
      setErrors(state?.errors);
    }
  }, [state?.success, state?.error, state?.errors]);

  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <section className="login-register container">
        <h4 className="text-center text-2xl font-bold">Login</h4>
        <br />
        <br />
        <div className="tab-content pt-2" id="login_register_tab_content">
          <div
            className="tab-pane fade show active"
            id="tab-item-login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <div className="login-form">
              <form action={TryLogin} name="login-form">
                {loginError && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2 mb-4"
                    role="alert"
                  >
                    <span className="block sm:inline">{loginError}</span>
                  </div>
                )}
                <CsrfToken />
                <FormInput
                  type="text"
                  name="name"
                  label="Name *"
                  value={formState.name}
                  onChange={handleInputChange}
                  errors={errors.name}
                  autoComplete="name"
                  autoFocus
                />
                <div className="pb-4"></div>
                <FormInput
                  type="email"
                  name="email"
                  label="Email address *"
                  value={formState.email}
                  onChange={handleInputChange}
                  errors={errors.email}
                  autoComplete="email"
                />
                <div className="pb-4"></div>
                <FormInput
                  type="password"
                  name="password"
                  label="Password *"
                  value={formState.password}
                  onChange={handleInputChange}
                  errors={errors.password}
                  autoComplete="current-password"
                />

                <div className="pb-4"></div>
                <FormInput
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password *"
                  value={formState.confirmPassword}
                  onChange={handleInputChange}
                  errors={errors.confirmPassword}
                  autoComplete="current-password"
                />

                <br />
                <input
                  type="submit"
                  value={pending ? "Sign Up..." : "Sign Up"}
                  name="signup"
                  disabled={pending}
                  className="btn btn-primary w-100 text-uppercase"
                />
                <div className="customer-option mt-4 text-center">
                  <span className="text-secondary">Have an account?</span>{" "}
                  <Link href="/sign-in" className="btn-text">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface FormInputProps {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string[];
  autoComplete?: string;
  autoFocus?: boolean;
}

function FormInput({
  type,
  name,
  label,
  value,
  onChange,
  errors,
  autoComplete,
  autoFocus,
}: FormInputProps) {
  return (
    <div>
      <div className="form-floating mb-1">
        <input
          className={`form-control form-control_gray ${errors && "is-invalid"}`}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
        />
        <label htmlFor={name}>{label}</label>
      </div>
      <div>
        {errors?.map((error) => (
          <span key={error} className="text-red d-block">
            {error}
          </span>
        ))}
      </div>
    </div>
  );
}
