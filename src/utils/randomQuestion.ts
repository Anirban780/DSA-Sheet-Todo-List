import type { Problem } from "../types";

export const getRandomUnpracticedQuestion = (
	allProblems: Problem[],
	practicedMap: Record<string, unknown>
): Problem | null => {

	const unpracticed = allProblems.filter((p) => !practicedMap[p.id]);
	if (unpracticed.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * unpracticed.length);
	return unpracticed[randomIndex];
};
