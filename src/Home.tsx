import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

interface Problem {
	id: string;
	topic: string;
	question: string;
	link: string;
	practiced: boolean;
}

const Home: React.FC = () => {
	const [groupedProblems, setGroupedProblems] = useState<{
		[key: string]: Problem[];
	}>({});
	const [expandedTopics, setExpandedTopics] = useState<{
		[key: string]: boolean;
	}>({});
	const [randomProblem, setRandomProblem] = useState<Problem | null>(null);

	useEffect(() => {
		getDocs(collection(db, "love_babbar_sheet")).then((querySnapshot) => {
			const problems: Problem[] = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...(doc.data() as Omit<Problem, "id">),
			}));

			const grouped: { [key: string]: Problem[] } = {};
			problems.forEach((p) => {
				if (!grouped[p.topic]) grouped[p.topic] = [];
				grouped[p.topic].push(p);
			});

			setGroupedProblems(grouped);
		});
	}, []);

	const togglePracticed = (id: string, practiced: boolean) => {
		const problemRef = doc(db, "love_babbar_sheet", id);
		updateDoc(problemRef, { practiced: !practiced });

		setGroupedProblems((prev) => {
			const updated = { ...prev };
			for (const topic in updated) {
				updated[topic] = updated[topic].map((p) =>
					p.id === id ? { ...p, practiced: !practiced } : p
				);
			}
			return updated;
		});

		setRandomProblem((prev) => {
			if (prev?.id === id) {
				return { ...prev, practiced: !practiced };
			}
			return prev;
		});
	};

	const toggleTopic = (topic: string) => {
		setExpandedTopics((prev) => ({
			...prev,
			[topic]: !prev[topic],
		}));
	};

	const getRandomQuestion = () => {
		const allProblems = Object.values(groupedProblems).flat();
		const unpracticedProblems = allProblems.filter((p) => !p.practiced);

		if (unpracticedProblems.length === 0) {
			setRandomProblem(null);
			alert("All questions have been practiced!");
			return;
		}

		const randomIndex = Math.floor(
			Math.random() * unpracticedProblems.length
		);
		setRandomProblem(unpracticedProblems[randomIndex]);
	};

	const closeRandomProblem = () => {
		setRandomProblem(null);
	};

	return (
		<div className="max-w-5xl mx-auto p-6">
			<h1 className="text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
				DSA Sheet Todo List
			</h1>

			<h2 className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8">
				Track your DSA progress with the Love Babbar Sheet – mark
				questions as practiced and stay focused!
			</h2>

			{/* Random Question Button */}
			<div className="mb-6 flex justify-center gap-4">
				<button
					onClick={getRandomQuestion}
					className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white px-6 py-2 rounded-md font-semibold shadow-md"
				>
					Get Random Question
				</button>
				{randomProblem && (
					<button
						onClick={closeRandomProblem}
						className="bg-red-500 hover:bg-red-600 transition-all duration-200 text-white px-6 py-2 rounded-md font-semibold shadow-md"
					>
						Close
					</button>
				)}
			</div>

			{randomProblem && (
				<div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 max-w-xl mx-auto">
					<a
						href={randomProblem.link}
						target="_blank"
						rel="noopener noreferrer"
						className="block text-lg font-medium text-white hover:underline hover:text-blue-600 text-center"
					>
						{randomProblem.question}
					</a>
					<div className="mt-3 flex justify-evenly items-center">
						<p className="text-gray-700 dark:text-gray-300 font-medium">
							Topic: {randomProblem.topic}
						</p>
						<label className="flex items-center space-x-2">
							<span className="text-sm text-gray-300">
								Practiced
							</span>
							<input
								type="checkbox"
								checked={randomProblem.practiced}
								onChange={() =>
									togglePracticed(
										randomProblem.id,
										randomProblem.practiced
									)
								}
								className="w-5 h-5 accent-green-600 cursor-pointer"
							/>
						</label>
					</div>
				</div>
			)}

			{/* Topic-wise Problems */}
			{Object.entries(groupedProblems).map(([topic, problems]) => (
				<div
					key={topic}
					className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
				>
					<button
						onClick={() => toggleTopic(topic)}
						className="w-full flex justify-between items-center px-5 py-4 bg-gray-100 dark:bg-gray-800 dark:text-white font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
					>
						{topic}
						<span className="text-lg">
							{expandedTopics[topic] ? "▲" : "▼"}
						</span>
					</button>

					{expandedTopics[topic] && (
						<ul className="divide-y dark:divide-gray-700 bg-white dark:bg-gray-900">
							{problems.map((p) => (
								<li
									key={p.id}
									className="flex justify-between items-center px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
								>
									<a
										href={p.link}
										target="_blank"
										rel="noopener noreferrer"
										className={`flex-1 text-sm font-medium transition ${
											p.practiced
												? "line-through text-gray-400"
												: "text-gray-900 dark:text-white"
										} hover:underline`}
									>
										{p.question}
									</a>
									<input
										type="checkbox"
										checked={p.practiced}
										onChange={() =>
											togglePracticed(p.id, p.practiced)
										}
										className="w-5 h-5 accent-green-600 cursor-pointer"
									/>
								</li>
							))}
						</ul>
					)}
				</div>
			))}
		</div>
	);
};

export default Home;
