import { signOut, onAuthStateChanged, type User } from "firebase/auth";
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { auth } from "../firebase";

interface AuthContextType {
	user: User | null;
	loading: boolean;
    logout: () => Promise<void>;
}

interface Props {
	children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context)
        throw new Error("useAuth must be used within AuthProvider");
    return context
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const logout = async () => {
		await signOut(auth);
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
