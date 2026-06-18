import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../state/auth.state";
import { authApi, parseError } from "../services/auth.api";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const run = async (apiFn, onSuccess) => {
        if (loading) return;

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = await apiFn();
            onSuccess?.(data);
            return data;
        } catch (err) {
            dispatch(setError(parseError(err)));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = (creds) =>
        run(() => authApi.login(creds), (data) =>
            dispatch(setUser(data.user))
        );

    const handleRegister = (creds) =>
        run(() => authApi.register(creds), (data) =>
            dispatch(setUser(data.user))
        );

    const handleLogout = () =>
        run(() => authApi.logout(), () =>
            dispatch(setUser(null))
        );

    const checkAuth = () =>
        run(() => authApi.me(), (data) =>
            dispatch(setUser(data.user))
        );

    return {
        user,
        loading,
        error,
        handleLogin,
        handleRegister,
        handleLogout,
        checkAuth,
    };
};