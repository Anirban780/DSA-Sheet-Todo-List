import {
	signInWithPopup,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const AuthDialog: React.FC<Props> = ({ isOpen, onClose }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleEmailAuth = async () => {
		try {
			setError("");
			if (isLogin) {
				await signInWithEmailAndPassword(auth, email, password);
			} else {
				await createUserWithEmailAndPassword(auth, email, password);
			}

			onClose(); // close modal after success
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
		}
	};

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity flex justify-center items-center z-50">
			<div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md">
				<h2 className="text-xl font-semibold text-center mb-4">
					{isLogin ? "Login" : "Sign Up"}
				</h2>

				{error && (
					<p className="text-red-500 text-sm text-center mb-3">
						{error}
					</p>
				)}

				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full mb-3 px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
				/>

				<input
					type="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full mb-3 px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
				/>

				<button
					onClick={handleEmailAuth}
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					{isLogin ? "Login" : "Sign Up"}
				</button>

				<div className="text-center my-4 text-sm text-gray-500">OR</div>

				<button
					onClick={handleGoogleLogin}
					className="w-full border flex items-center justify-center gap-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
				>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
					Sign in with Google
				</button>

				<p className="text-sm text-center mt-4">
					{isLogin
						? "Don't have an account?"
						: "Already have an account?"}
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="text-blue-600 ml-1 hover:underline"
					>
						{isLogin ? "Sign Up" : "Login"}
					</button>
				</p>

				<button
					onClick={onClose}
					className="absolute top-4 right-6 text-gray-400 hover:text-red-600 text-4xl"
				>
					&times;
				</button>
			</div>
		</div>
	);
};

export default AuthDialog;
