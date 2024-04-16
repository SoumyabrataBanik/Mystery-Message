"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButtonComponent() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                Signed In as {session.user.email}
                <br />
                <button
                    className="bg-red-200 rounded-md py-2 px-3"
                    onClick={() => signOut()}
                >
                    Sign Out
                </button>
            </>
        );
    }

    return (
        <>
            Not Signed In <br />
            <button
                className="bg-green-500 rounded-md py-2 px-3"
                onClick={() => signIn()}
            >
                Sign In
            </button>
        </>
    );
}
