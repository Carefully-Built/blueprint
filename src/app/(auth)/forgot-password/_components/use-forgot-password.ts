import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth';
import { sendPasswordResetEmail } from '../../actions';

interface UseForgotPasswordResult {
  form: ReturnType<typeof useForm<ForgotPasswordFormData>>;
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  loading: boolean;
  sent: boolean;
  error: string | undefined;
  email: string;
}

export function useForgotPassword(): UseForgotPasswordResult {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState('');

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setEmail(data.email);

    try {
      const result = await sendPasswordResetEmail(data.email);

      if (result.success) {
        setSent(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    sent,
    error,
    email,
  };
}
