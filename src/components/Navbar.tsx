import React, { useEffect, useRef, useState } from "react";
import AuthDialog from "./AuthDialog";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
	const { user, logout } = useAuth();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			setDropdownOpen(false);
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	return (
		<>
			<div className="fixed w-full left-0 top-0 z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
				<h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
					DSA Sheet Todo List
				</h1>

				<div className="relative" ref={dropdownRef}>
					<div
						onClick={() => {setDropdownOpen((prev) => !prev);}}
						className="cursor-pointer"
					>
						{user?.photoURL ? (
							<img
								src={user?.photoURL || ""}
								alt="User"
								className="w-10 h-10 rounded-full object-cover"
								referrerPolicy="no-referrer"
							/>
						) : (
							<FaUserCircle className="w-10 h-10 text-gray-600 dark:text-gray-200" />
						)}
					</div>

					{dropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2">
							{user ? (
								<>
									<button
										className="block w-full text-left px-4 py-2 text-[16px] hover:rounded-lg text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
										onClick={() => {
											/* Handle Profile click here */
										}}
									>
										Profile
									</button>
									<button
										className="block w-full text-left px-4 py-2 text-[16px] hover:rounded-lg text-gray-700 dark:text-gray-100 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
										onClick={handleLogout}
									>
										Logout
									</button>
								</>
							) : (
								<>
									<button
										className="block w-full text-left px-4 py-2 text-[16px] hover:rounded-lg text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
										onClick={() => {
											setDropdownOpen(false);
											setShowAuthModal(true);
										}}
									>
										Login
									</button>
									<button
										className="block w-full text-left px-4 py-2 text-[16px] hover:rounded-lg text-gray-700 dark:text-gray-100 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
										onClick={() => {
											setDropdownOpen(false);
											setShowAuthModal(true);
										}}
									>
										Sign up
									</button>
								</>
							)}
						</div>
					)}
				</div>
			</div>

			<AuthDialog
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
			/>
		</>
	);
};

export default Navbar;
