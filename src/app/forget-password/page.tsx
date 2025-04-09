"use client";

import CsrfToken from "@/components/csrf";
import { SendResetPassword } from "@/lib/actions/auth";
import { useActionState, useEffect } from "react";
const initialstate = {
  errors: {},
  error: undefined,
  success: undefined,
  msg: undefined,
};
export default function ForgetPassword() {
  const [state, formAction, pending] = useActionState(
    SendResetPassword,
    initialstate
  );

  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <section className="login-register container">
        <h2>Find Your Account</h2>
        <div className="tab-content pt-2" id="login_register_tab_content">
          <div
            className="tab-pane fade show active"
            id="tab-item-login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <div className="login-form">
              <form
                action={formAction}
                name="login-form"
                className="needs-validation"
                noValidate
              >
                {state.msg && (
                  <div
                    className={`alert ${state.success && "alert-success"} 
                    ${state.error && "alert-danger"} `}
                    role="alert"
                  >
                    <span className="block sm:inline">{state.msg}</span>
                  </div>
                )}

                <CsrfToken />
                <p>
                  Please enter your email address or mobile number to Send an
                  reset password email.
                </p>
                <div className="form-floating mb-3">
                  <input
                    className="form-control form-control_gray "
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                  <label htmlFor="email">Email address *</label>
                </div>
                <div>
                  {state.errors?.email?.map((err) => (
                    <span className="text-danger">{err}</span>
                  ))}
                </div>

                <div className="pb-3"></div>

                <input
                  type="submit"
                  value={pending ? "Sending..." : "Send"}
                  name="signin"
                  disabled={pending}
                  className="btn btn-primary w-100 text-uppercase"
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
