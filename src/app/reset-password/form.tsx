"use client";

import CsrfToken from "@/components/csrf";
import { ResetUserPassword } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
const initialstate = {
  errors: {},
  error: undefined,
  success: undefined,
  msg: undefined,
};
export default function ResetPassworForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(
    ResetUserPassword,
    initialstate
  );
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.replace("/sign-in");
      }, 1000);
    }
  }, [state.success]);

  return (
    <main className="pt-90">
      <div className="mb-4 pb-4"></div>
      <div className="contianer">
        <div className="row mx-0 justify-center">
          <div className="col-md-6 col-lg-4">
            <form action={formAction}>
              <CsrfToken />
              <div className="col-md-12">
                <div className="my-3">
                  <h5 className="text-uppercase mb-0">Password Change</h5>
                </div>
              </div>

              {state.msg && (
                <div
                  className={`alert mb-3 ${state.success && "alert-success"} 
                    ${state.error && "alert-danger"} `}
                  role="alert"
                >
                  <span className="block sm:inline">{state.msg}</span>
                </div>
              )}

              <input type="hidden" name="userId" value={userId} />
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    id="old_password"
                    name="oldPassword"
                    placeholder="Old password"
                  />
                  <label htmlFor="old_password">Old password</label>
                </div>
                <div className="text-red d-block mb-3">
                  {state?.errors?.oldPassword?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    id="new_password"
                    name="newPassword"
                    placeholder="New password"
                  />
                  <label htmlFor="account_new_password">New password</label>
                </div>
                <div className="text-red d-block mb-3">
                  {state?.errors?.newPassword?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    data-cf-pwd="#new_password"
                    id="new_password_confirmation"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                  />
                  <label htmlFor="new_password_confirmation">
                    Confirm new password
                  </label>
                  <div className="invalid-feedback">
                    Passwords did not match!
                  </div>
                </div>
                <div className="text-red d-block mb-3">
                  {state?.errors?.confirmPassword?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-md-12 py-3">
                <div className="my-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={pending}
                  >
                    {pending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
