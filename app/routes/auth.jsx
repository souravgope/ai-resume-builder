import { usePuterStore } from "../lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
]);
const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.isAuthenticated || auth.isGuest)
            navigate(next || "/");
    }, [auth.isAuthenticated, auth.isGuest, next]);
    return (<main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>
                    <div>
                        {isLoading ? (<button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>) : (<>
                                {auth.isAuthenticated ? (<button className="auth-button" onClick={auth.signOut}>
                                        <p>Log Out</p>
                                    </button>) : (<button className="auth-button" onClick={auth.signIn}>
                                        <p>Log In</p>
                                    </button>)}
                            </>)}
                    </div>
                    <div>
                        <div className="flex w-full justify-center items-center gap-3 px-6 ">
                        <div className="border-b-2 border-dashed w-full h-0.5 border-dark-200"></div>
                        <h3>or</h3>
                        <div className="border-b-2 border-dashed w-full h-0.5 border-dark-200"></div>
                    </div>
                     <div className="flex justify-center items-center">
                        <p onClick={() => {auth.guestLogin();
                            navigate(next || "/");
                        }} className="text-xl text-dark-200 py-3 cursor-pointer">Continue as guest</p>
                     </div>
                    </div>
                </section>
            </div>
        </main>);
};
export default Auth;
