import React from "react";
import type { Problem } from "../types";

interface RandomProblemProps {
  problem: Problem;
  isPracticed: boolean;
  onTogglePracticed: (problem: Problem) => void;
  onClose: () => void;
}

const RandomProblem: React.FC<RandomProblemProps> = ({
  problem,
  isPracticed,
  onTogglePracticed,
  onClose,
}) => {
  return (
    <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 max-w-xl mx-auto">
      <a
        href={problem.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-lg font-medium text-gray-900 dark:text-white hover:underline hover:text-blue-600 text-center"
      >
        {problem.question}
      </a>
      <div className="mt-3 flex justify-evenly items-center">
        <p className="text-gray-700 dark:text-gray-300 font-medium">Topic: {problem.topic}</p>
        <label className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Practiced</span>
          <input
            type="checkbox"
            checked={isPracticed}
            onChange={() => onTogglePracticed(problem)}
            className="w-5 h-5 accent-green-600 cursor-pointer"
          />
        </label>
      </div>
      <button
        onClick={onClose}
        className="mt-3 w-full bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md font-semibold shadow-md"
      >
        Close
      </button>
    </div>
  );
};

export default RandomProblem;