// Simple toast hook implementation
import { useCallback } from 'react'

type ToastType = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = useCallback((props: ToastType) => {
    console.log('Toast:', props)
    // In a real implementation, this would show a toast notification
    // For now, we'll just log to console
  }, [])

  return { toast }
} 