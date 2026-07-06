import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../state/auth.state";
import { authApi, parseError } from "../services/auth.api";
import { useCallback } from "react";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const handleLogin = useCallback(async (creds) => {
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
    }, [dispatch]);

    const handleRegister = useCallback(async (creds) => {
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
    }, [dispatch]);

    const checkAuth = useCallback(async () => {
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
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
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
    }, [dispatch]);

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