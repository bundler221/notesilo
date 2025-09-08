import { Link } from "react-router-dom"
export default function Home() {
    function login() {

    }
    return (
        <>
            <h1>Welcome to NoteSilo,</h1>
            <p>Your personal, secure, and smart note-taking companion</p>
            <p>NoteSilo is a modern note-taking web app that lets you create, edit, and organize your notes anytime, anywhere. With secure authentication (email/password & Google login), your notes stay private while being easily accessible. You can manage your account, update your profile, and even delete your data whenever you want.</p>
            {/* <button onClick={login}>Login</button>
            <button onClick={SignIn}>Sign</button> */}
            {<Link
                className="text-blue-600 hover:underline font-medium"
                to="/login"
            >Signin</Link>}
            {<Link
                className="text-blue-600 hover:underline font-medium"
                to="/Register"
            >Sign Up?</Link>}

        </>
    )
}