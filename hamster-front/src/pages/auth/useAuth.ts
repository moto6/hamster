import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {authService} from "@/core/authService.ts";

export function useAuth() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await authService.login(email,password);
            authService.setToken(data);
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
    };

    return {login, logout, isLoading};
}