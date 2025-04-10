"use client";
import { SaveChanges } from "@/lib/actions/updateAccount";
import { getSession, useSession } from "next-auth/react";
import { useActionState, useCallback, useEffect, useReducer } from "react";

// Define the initial state
const initialState = {
  errors: {},
  changes: {} as Record<string, string>,
  formData: {
    name: "",
    email: "",
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  } as Record<string, string>,
};

// Reducer to handle state updates
function formReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "UPDATE_FIELD":
      const { field, value } = action.payload;
      const changes = { ...state.changes };
      if (value !== initialState.formData[field]) {
        changes[field] = value;
      } else {
        delete changes[field];
      }
      return {
        ...state,
        formData: { ...state.formData, [field]: value },
        changes,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function AccountDetailsForm() {
  const [state, formAction, pending] = useActionState(
    SaveChanges,
    initialState
  );

  const { data: session, update: sessionUpdate } = useSession();
  const user = session?.user as
    | { name: string; email: string; username: string; id: string }
    | undefined;
  // Initialize form data with user data

  initialState.formData = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    username: user?.username ?? "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [formState, dispatch] = useReducer(formReducer, initialState);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    dispatch({ type: "UPDATE_FIELD", payload: { field, value } });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return Object.keys(formState.changes).length > 0;
  }, [formState.changes]);

  const handleSubmit = async (formData: FormData) => {
    formAction(formData);
  };

  useEffect(() => {
    if (state?.success) {
      (async () => {
        await sessionUpdate(await getSession());

        dispatch({ type: "RESET" });
      })();
    }
  }, [state?.success]);
  return (
    <div className="col-lg-9">
      <div className="page-content my-account__edit">
        <div className="my-account__edit-form">
          <form name="account_edit_form" action={handleSubmit} className="">
            {/* Hidden input to store changes as JSON */}
            <input
              type="hidden"
              name="changes"
              value={JSON.stringify(formState.changes)}
            />
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating my-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    value={formState.formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <span className="text-red d-block mb-3">
                  {state?.errors?.name?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    name="username"
                    value={formState.formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                  />
                  <label htmlFor="Username">Username</label>
                </div>
                <span className="text-red d-block mb-3">
                  {state?.errors?.username?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    name="email"
                    value={formState.formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  <label htmlFor="account_email">Email Address</label>
                </div>
                <span className="text-red d-block mb-3">
                  {state?.errors?.email?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
              <div className="col-md-12">
                <div className="my-3">
                  <h5 className="text-uppercase mb-0">Password Change</h5>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    id="old_password"
                    name="old_password"
                    placeholder="Old password"
                    value={formState.formData.oldPassword}
                    onChange={(e) =>
                      handleChange("oldPassword", e.target.value)
                    }
                  />
                  <label htmlFor="old_password">Old password</label>
                </div>
                <span className="text-red d-block mb-3">
                  {state?.errors?.oldPassword?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    id="new_password"
                    name="new_password"
                    placeholder="New password"
                    value={formState.formData.newPassword}
                    onChange={(e) =>
                      handleChange("newPassword", e.target.value)
                    }
                  />
                  <label htmlFor="account_new_password">New password</label>
                </div>
                <span className="text-red d-block mb-3">
                  {state?.errors?.newPassword?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
              <div className="col-md-12">
                <div className="form-floating my-3">
                  <input
                    type="password"
                    className="form-control"
                    data-cf-pwd="#new_password"
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    placeholder="Confirm new password"
                    value={formState.formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                  />
                  <label htmlFor="new_password_confirmation">
                    Confirm new password
                  </label>
                  <div className="invalid-feedback">
                    Passwords did not match!
                  </div>
                </div>
                <span className="text-red d-block mb-3">
                  {state?.errors?.confirmPassword?.map((err) => (
                    <span className="d-block" key={err}>
                      {err}
                    </span>
                  ))}
                </span>
              </div>
              <div className="col-md-12">
                {state?.error && (
                  <div className="alert alert-danger">{state?.msg}</div>
                )}

                {state?.success && (
                  <div className="alert alert-success">{state?.msg}</div>
                )}

                <div className="my-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!hasChanges() || pending}
                  >
                    {pending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
