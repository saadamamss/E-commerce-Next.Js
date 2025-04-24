"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CsrfToken from "../../components/csrf";
import { SignInWithCreds } from "@/lib/actions/auth";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { getSession, useSession } from "next-auth/react";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "This field is required")
    .email("Invalid email format"),
  password: z.string().min(1, "This field is required"),
});

const initialState = {
  errors: {},
  error: undefined,
  success: undefined,
  msg: undefined,
};

export default function Page() {
  const router = useRouter();

  //
  const [state, formAction, pending] = useActionState(
    SignInWithCreds,
    initialState
  );
  const [loginError, setLoginError] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") as string;

  // Add form state for email and password
  const [formState, setFormState] = useState({
    email: "",
    password: "",
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
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // validate creds
    const validate = signInSchema.safeParse(creds);
    if (!validate.success) {
      setErrors(validate.error.flatten().fieldErrors);
      return;
    }
    // empty errors
    setErrors({});
    formAction(formData);
    
  }
  const { update: updateSession } = useSession();
  useEffect(() => {
    if (state?.success) {
      (async () => {
        await updateSession(await getSession());
      })();
      router.replace("/dashboard");
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
                  type="email"
                  name="email"
                  label="Email address *"
                  value={formState.email}
                  onChange={handleInputChange}
                  errors={errors.email}
                  autoComplete="email"
                  autoFocus
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
                <br />
                <input
                  type="submit"
                  value={pending ? "Sign In..." : "Sign In"}
                  name="signin"
                  disabled={pending}
                  className="btn btn-primary w-100 text-uppercase"
                />
                <div className="customer-option mt-4 text-center">
                  <span className="text-secondary">No account yet?</span>{" "}
                  <Link href="/sign-up" className="btn-text">
                    Create Account
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
