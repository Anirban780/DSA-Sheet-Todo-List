// src/Home.tsx
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
  const [groupedProblems, setGroupedProblems] = useState<{ [key: string]: Problem[] }>({});
  const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});

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
  };

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Love Babbar DSA Sheet
      </h1>

      {Object.entries(groupedProblems).map(([topic, problems]) => (
        <div key={topic} className="mb-6 border rounded-lg shadow-sm dark:border-gray-700">
          <button
            onClick={() => toggleTopic(topic)}
            className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-lg bg-gray-100 dark:bg-gray-800 dark:text-gray-100"
          >
            {topic}
            <span>{expandedTopics[topic] ? "▲" : "▼"}</span>
          </button>

          {expandedTopics[topic] && (
            <ul className="divide-y dark:divide-gray-700">
              {problems.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900"
                >
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-blue-600 hover:underline flex-1 ${
                      p.practiced
                        ? "line-through text-gray-400"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {p.question}
                  </a>
                  <input
                    type="checkbox"
                    checked={p.practiced}
                    onChange={() => togglePracticed(p.id, p.practiced)}
                    className="w-5 h-5 cursor-pointer accent-green-600"
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
