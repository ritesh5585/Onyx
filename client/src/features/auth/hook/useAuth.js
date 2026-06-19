import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../state/auth.state";
import { authApi, parseError } from "../services/auth.api";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const handleLogin = async (creds) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = await authApi.login(creds);
            dispatch(setUser(data?.user));
            return data;
        } catch (err) {
            dispatch(setError(parseError(err)));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleRegister = async (creds) => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = await authApi.register(creds);
            dispatch(setUser(data?.user));
            return data;
        } catch (err) {
            dispatch(setError(parseError(err)));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const checkAuth = async () => {
        dispatch(setLoading(true));

        try {
            const data = await authApi.me();
            dispatch(setUser(data?.user));
            return data;
        } catch (err) {
            dispatch(setUser(null));
            dispatch(setError(parseError(err)));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogout = async () => {
        dispatch(setLoading(true));

        try {
            await authApi.logout();
            dispatch(setUser(null));
        } catch (err) {
            dispatch(setError(parseError(err)));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

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