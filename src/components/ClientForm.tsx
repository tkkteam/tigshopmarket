'use client';

import { toast } from 'react-hot-toast';

interface ClientFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'action'> {
  action: (formData: FormData) => Promise<unknown>;
  successMessage?: string;
  errorMessage?: string;
}

export default function ClientForm({ action, successMessage = 'สำเร็จ!', errorMessage = 'เกิดข้อผิดพลาด', children, ...props }: ClientFormProps) {
  const handleSubmit = async (formData: FormData) => {
    const loadingToast = toast.loading('กำลังดำเนินการ...');
    try {
      await action(formData);
      toast.success(successMessage, { id: loadingToast });
    } catch (error: unknown) {
      // Next.js redirect throws an error with message 'NEXT_REDIRECT'
      const err = error as Error;
      if (err?.message === 'NEXT_REDIRECT') {
        toast.success(successMessage, { id: loadingToast });
        throw error; // Rethrow so Next.js can handle the redirect
      } else {
        toast.error(err?.message || errorMessage, { id: loadingToast });
      }
    }
  };

  return (
    <form action={handleSubmit} {...props}>
      {children}
    </form>
  );
}
