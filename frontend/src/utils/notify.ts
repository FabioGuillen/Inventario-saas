import toast from "react-hot-toast";

export const notify = {
  success: (message: string) => toast.success(message),

  error: (message: string) => toast.error(message),

  loading: (message: string) => toast.loading(message),

  dismiss: (id?: string) => toast.dismiss(id),

  promise: (
    promise: Promise<any>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => toast.promise(promise, messages),

  custom: (message: string) =>
    toast(message, {
      icon: "🚀",
    }),
};
