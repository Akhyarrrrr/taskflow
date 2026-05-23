import { toast } from 'sonner'

export const notify = {
  success(title: string, description?: string) {
    toast.success(title, { description, duration: 4000 })
  },
  error(title: string, description?: string) {
    toast.error(title, { description, duration: 5000 })
  },
  info(title: string, description?: string) {
    toast.info(title, { description, duration: 4000 })
  },
  warning(title: string, description?: string) {
    toast.warning(title, { description, duration: 4500 })
  },
  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) {
    return toast.promise(promise, messages)
  },
}
