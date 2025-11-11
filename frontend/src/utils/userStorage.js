export function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem('user');
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('user:updated'));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
}

