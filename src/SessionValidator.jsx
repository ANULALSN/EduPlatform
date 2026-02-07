import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './config';

/**
 * SessionValidator Component
 * Validates the user's session on app load.
 * If the session is invalid (e.g., user logged in elsewhere), 
 * it logs them out and redirects to login.
 */
const SessionValidator = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        validateSession();

        // Also validate on window focus (when user switches back to this tab)
        const handleFocus = () => validateSession();
        window.addEventListener('focus', handleFocus);

        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const validateSession = async () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) return; // Not logged in, nothing to validate

        const user = JSON.parse(userInfo);
        if (!user.token) return;

        try {
            const response = await fetch(`${API_URL}/auth/validate-session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!data.valid) {
                // Session is invalid - force logout
                localStorage.removeItem('userInfo');
                alert(data.message || 'Your session has expired. Please login again.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Session validation error:', error);
            // Don't force logout on network errors - user might just be offline
        }
    };

    return children;
};

export default SessionValidator;
