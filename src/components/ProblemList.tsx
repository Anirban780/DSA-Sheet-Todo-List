import React, { useState } from "react";
import type { Problem, PracticedProblem } from "../types";

interface ProblemListProps {
  problems: Problem[];
  practicedMap: Record<string, PracticedProblem>;
  onTogglePracticed: (problem: Problem) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems, practicedMap, onTogglePracticed }) => {
  // State to track which topics are expanded
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Group problems by topic
  const groupedProblems = problems.reduce((groups: Record<string, Problem[]>, p) => {
    (groups[p.topic] = groups[p.topic] || []).push(p);
    return groups;
  }, {});

  // Toggle the expanded state for a topic
  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  return (
    <div>
      {Object.entries(groupedProblems).map(([topic, problems]) => (
        <section
          key={topic}
          className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
        >
          <h3
            className="px-5 py-4 bg-gray-100 dark:bg-gray-800 dark:text-white font-semibold text-lg flex justify-between items-center cursor-pointer"
            onClick={() => toggleTopic(topic)}
          >
            <span>{topic}</span>
            <span className="text-gray-600 dark:text-gray-300">
              {expandedTopics[topic] ? "➖" : "➕"}
            </span>
          </h3>
          {expandedTopics[topic] && (
            <ul className="divide-y dark:divide-gray-700 bg-white dark:bg-gray-900">
              {problems.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 text-sm font-medium ${
                      practicedMap[p.id] ? "line-through text-gray-400" : "text-gray-900 dark:text-white"
                    } hover:underline`}
                  >
                    {p.question}
                  </a>
                  <input
                    type="checkbox"
                    checked={Boolean(practicedMap[p.id])}
                    onChange={() => onTogglePracticed(p)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
};

export default ProblemList;