import { toast } from 'react-hot-toast';

// Store active toast IDs to prevent duplicates
const activeToasts = new Set();

// Toast utility class to manage toasts and prevent duplicates
class ToastManager {
  static showSuccess(message, options = {}) {
    const toastId = `success-${message}`;
    
    // Dismiss existing toast with same message
    if (activeToasts.has(toastId)) {
      toast.dismiss(toastId);
    }
    
    // Show new toast
    const id = toast.success(message, {
      id: toastId,
      duration: 3000,
      ...options
    });
    
    activeToasts.add(toastId);
    
    // Remove from active toasts when dismissed
    setTimeout(() => {
      activeToasts.delete(toastId);
    }, 3000);
    
    return id;
  }

  static showError(message, options = {}) {
    const toastId = `error-${message}`;
    
    // Dismiss existing toast with same message
    if (activeToasts.has(toastId)) {
      toast.dismiss(toastId);
    }
    
    // Show new toast
    const id = toast.error(message, {
      id: toastId,
      duration: 5000,
      ...options
    });
    
    activeToasts.add(toastId);
    
    // Remove from active toasts when dismissed
    setTimeout(() => {
      activeToasts.delete(toastId);
    }, 5000);
    
    return id;
  }

  static showLoading(message, options = {}) {
    const toastId = `loading-${message}`;
    
    // Dismiss existing loading toast with same message
    if (activeToasts.has(toastId)) {
      toast.dismiss(toastId);
    }
    
    // Show new loading toast
    const id = toast.loading(message, {
      id: toastId,
      duration: Infinity,
      ...options
    });
    
    activeToasts.add(toastId);
    
    return id;
  }

  static dismissLoading(loadingToastId) {
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
      // Remove from active toasts
      activeToasts.forEach(id => {
        if (id === loadingToastId) {
          activeToasts.delete(id);
        }
      });
    }
  }

  static dismissAll() {
    toast.dismiss();
    activeToasts.clear();
  }

  static dismissById(toastId) {
    toast.dismiss(toastId);
    activeToasts.delete(toastId);
  }
}

export default ToastManager;
