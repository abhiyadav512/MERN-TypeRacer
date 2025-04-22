import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../store/Slice/authSlice";

const GoogleLoginButton = ({ status }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle the Google login redirection
    const handleGoogle = () => {
        window.open("http://localhost:3000/api/auth/google", "_self");
    };

    // Capture the token from URL after redirect
    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (token) {
            // Dispatch the action with the received token
            dispatch(loginWithGoogle(token));

            // Redirect to home page after successful login
            navigate("/");
        }
    }, [dispatch, navigate]);

    return (
        <button
            type="button"
            onClick={handleGoogle}
            className="py-2 px-4 bg-darkBackground dark:bg-lightBackground hover:bg-lightBackground dark:hover:bg-darkBackground text-lightBackground dark:text-darkBackground hover:text-darkBackground dark:hover:text-lightBackground border-2 border-darkBackground dark:border-lightBackground font-semibold rounded-lg transition-colors duration-300 text-sm sm:text-base"
        >
            Login with Google
        </button>
    );
};

export default GoogleLoginButton;
