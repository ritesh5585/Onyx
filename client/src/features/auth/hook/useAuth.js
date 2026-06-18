import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../state/auth.state";
import { authApi, parseError } from "../services/auth.api";

/**
 * Custom hook for authentication.
 * Provides user state and methods to interact with the auth API.
 */
export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const updateUser = (data) => {
        dispatch(setUser(data?.user || null))
    };

    const run = async (apiCall, onSuccess) => {
        if (loading) return;

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = await apiCall();

            if (onSuccess) {
                onSuccess(data);
            }

            return data;
        } catch (err) {
            dispatch(setError(parseError(err)));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = (creds) =>
        run(() => authApi.login(creds), updateUser);

    const handleRegister = (creds) =>
        run(() => authApi.register(creds), updateUser);

    const handleGetMe = () =>
        run(() => authApi.me(), () => updateUser)

    const handleLogout = () =>
        run(() => authApi.logout(), () => updateUser(null));

    const checkAuth = () =>
        run(authApi.me, updateUser);

    return {
        user,
        loading,
        error,
        handleGetMe,
        handleLogin,
        handleRegister,
        handleLogout,
        checkAuth,
    };
};