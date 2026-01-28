import { create } from "zustand";
const getPuter = () => typeof window !== "undefined" && window.puter ? window.puter : null;
export const usePuterStore = create((set, get) => {
    const setError = (msg) => {
        set({
            error: msg,
            isLoading: false,
            auth: {
                user: null,
                isAuthenticated: false,
                isGuest: false,
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                guestLogin: get().auth.guestLogin,
                getUser: get().auth.getUser,
            },
        });
    };

    const checkAuthStatus = async () => {
        if (get().auth.isGuest) {
            return true;
        }

        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return false;
        }
        set({ isLoading: true, error: null });
        try {
            const isSignedIn = await puter.auth.isSignedIn();

            if (get().auth.isGuest) {
                set({ isLoading: false });
                return true;
            }

            if (isSignedIn) {
                const user = await puter.auth.getUser();
                if (get().auth.isGuest) {
                    set({ isLoading: false });
                    return true;
                }

                set({
                    auth: {
                        user,
                        isAuthenticated: true,
                        isGuest: false,
                        signIn: get().auth.signIn,
                        signOut: get().auth.signOut,
                        refreshUser: get().auth.refreshUser,
                        checkAuthStatus: get().auth.checkAuthStatus,
                        guestLogin: get().auth.guestLogin,
                        getUser: () => user,
                    },
                    isLoading: false,
                });
                return true;
            } else {
                set({
                    auth: {
                        user: null,
                        isAuthenticated: false,
                        isGuest: false,
                        signIn: get().auth.signIn,
                        signOut: get().auth.signOut,
                        refreshUser: get().auth.refreshUser,
                        checkAuthStatus: get().auth.checkAuthStatus,
                        guestLogin: get().auth.guestLogin,
                        getUser: () => null,
                    },
                    isLoading: false,
                });
                return false;
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to check auth status";
            setError(msg);
            return false;
        }
    };

    const signIn = async () => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        set({ isLoading: true, error: null });
        try {
            await puter.auth.signIn();
            await checkAuthStatus();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Sign in failed";
            setError(msg);
        }
    };
    const signOut = async () => {
        localStorage.removeItem("guestMode");
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        set({ isLoading: true, error: null });
        try {
            await puter.auth.signOut();
            set({
                auth: {
                    user: null,
                    isAuthenticated: false,
                    isGuest: false,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    guestLogin: get().auth.guestLogin,
                    getUser: () => null,
                },
                isLoading: false,
            });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Sign out failed";
            setError(msg);
        }
    };
    const refreshUser = async () => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const user = await puter.auth.getUser();
            set({
                auth: {
                    user,
                    isAuthenticated: true,
                    isGuest: false,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    guestLogin: get().auth.guestLogin,
                    getUser: () => user,
                },
                isLoading: false,
            });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to refresh user";
            setError(msg);
        }
    };

    const guestLogin = () => {
    localStorage.setItem("guestMode", "true");
    set({
        auth: {
            user: { name: "Guest User", role: "guest" },
            isAuthenticated: true,
            isGuest: true,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            guestLogin: get().auth.guestLogin,
            getUser: () => ({ name: "Guest User", role: "guest" }),
        },
        isLoading: false,
    });
};

const init = () => {
        const puter = getPuter();
        // Check local storage first
        if (localStorage.getItem("guestMode") === "true") {
            guestLogin();
            set({ puterReady: true });
            return;
        }

        if (puter) {
            set({ puterReady: true });
            if (!get().auth.isGuest) {
                checkAuthStatus();
            }
            return;
        }

        const interval = setInterval(() => {
            if (getPuter()) {
                clearInterval(interval);
                set({ puterReady: true });
                if (!get().auth.isGuest) {
                    checkAuthStatus();
                }
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            if (!getPuter()) {
                setError("Puter.js failed to load within 10 seconds");
            }
        }, 10000);
    };

    const write = async (path, data) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.write(path, data);
    };
    const readDir = async (path) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.readdir(path);
    };
    const readFile = async (path) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.read(path);
    };
    const upload = async (files) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.upload(files);
    };
    const deleteFile = async (path) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.fs.delete(path);
    };
    const chat = async (prompt, imageURL, testMode, options) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        // return puter.ai.chat(prompt, imageURL, testMode, options);
        return puter.ai.chat(prompt, imageURL, testMode, options);
    };
    const feedback = async (path, message) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.ai.chat([
            {
                role: "user",
                content: [
                    {
                        type: "file",
                        puter_path: path,
                    },
                    {
                        type: "text",
                        text: message,
                    },
                ],
            },
        ], { model: "claude-3-haiku" });
    };
    const img2txt = async (image, testMode) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.ai.img2txt(image, testMode);
    };
    const getKV = async (key) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.get(key);
    };
    const setKV = async (key, value) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.set(key, value);
    };
    const deleteKV = async (key) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.delete(key);
    };
    const listKV = async (pattern, returnValues) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        if (returnValues === undefined) {
            returnValues = false;
        }
        return puter.kv.list(pattern, returnValues);
    };
    const flushKV = async () => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        return puter.kv.flush();
    };
    return {
        isLoading: true,
        error: null,
        puterReady: false,
        auth: {
            user: null,
            isAuthenticated: false,
            isGuest: false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            guestLogin,
            getUser: () => get().auth.user,
        },
        fs: {
            write: (path, data) => write(path, data),
            read: (path) => readFile(path),
            readDir: (path) => readDir(path),
            upload: (files) => upload(files),
            delete: (path) => deleteFile(path),
        },
        ai: {
            chat: (prompt, imageURL, testMode, options) => chat(prompt, imageURL, testMode, options),
            feedback: (path, message) => feedback(path, message),
            img2txt: (image, testMode) => img2txt(image, testMode),
        },
        kv: {
            get: (key) => getKV(key),
            set: (key, value) => setKV(key, value),
            delete: (key) => deleteKV(key),
            list: (pattern, returnValues) => listKV(pattern, returnValues),
            flush: () => flushKV(),
        },
        init,
        clearError: () => set({ error: null }),
    };
});
