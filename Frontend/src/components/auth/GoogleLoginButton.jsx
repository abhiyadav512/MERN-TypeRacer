const GoogleLoginButton = () => {
    const handleGoogle = () => {
        window.open("https://mern-typeracer.onrender.com/api/auth/google", "_self");
    };

    return (
        <button
            onClick={handleGoogle}
            className="mt-2 px-4 py-2 text-sm sm:text-base bg-lightBackground dark:bg-darkBackground text-darkBackground dark:text-lightBackground border border-gray-300 dark:border-gray-700 rounded-lg transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
            Login with Google
        </button>
    );
};

export default GoogleLoginButton;
