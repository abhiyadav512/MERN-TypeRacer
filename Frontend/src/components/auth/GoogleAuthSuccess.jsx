import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../store/Slice/authSlice";

const GoogleAuthSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");

        if (token) {
            dispatch(loginWithGoogle(token));
            navigate("/");
        } else {
            navigate("/login"); // fallback
        }
    }, [dispatch, navigate]);

    return <p>Logging you in...</p>;
};

export default GoogleAuthSuccess;
