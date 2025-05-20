import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AuthDialog from "./components/AuthDialog";
import RandomProblem from "./components/RandomProblem";
import ProblemList from "./components/ProblemList";
import type { Problem, PracticedProblem } from "./types";
import { fetchAllProblems, fetchUserPracticed, togglePracticedStatus } from "./utils/firebaseUtils";
import { getRandomUnpracticedQuestion } from "./utils/randomQuestion";
import { useAuth } from "./context/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [practicedMap, setPracticedMap] = useState<Record<string, PracticedProblem>>({});
  const [randomProblem, setRandomProblem] = useState<Problem | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);


  // Fetch all problems on mount
  useEffect(() => {
    fetchAllProblems().then(setProblems);
  }, []);

  // Fetch user practiced problems when user or problems change
  useEffect(() => {
    if (user && problems.length > 0) {
      fetchUserPracticed(user.uid).then(setPracticedMap);
      setRandomProblem(null);
    } else {
      setPracticedMap({});
      setRandomProblem(null);
    }
  }, [user, problems]);

  // Toggle practiced status of a problem
  const handleTogglePracticed = async (problem: Problem) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    const currentlyPracticed = Boolean(practicedMap[problem.id]);
    await togglePracticedStatus(user.uid, problem, currentlyPracticed);
    setPracticedMap((prev) => {
      const copy = { ...prev };
      if (currentlyPracticed) {
        delete copy[problem.id];
      } else {
        copy[problem.id] = { id: problem.id, question: problem.question, timestamp: new Date() };
      }
      return copy;
    });
  };

  // Get a random unpracticed question
  const handleGetRandomQuestion = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    const question = getRandomUnpracticedQuestion(problems, practicedMap);
    if (!question) {
      alert("All questions have been practiced!");
      setRandomProblem(null);
    } else {
      setRandomProblem(question);
    }
  };

  return (
    <>
      <Navbar />
      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      
	  <div className="max-w-5xl mx-auto p-6 pt-24">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
          DSA Sheet Todo List
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8">
          Track your DSA progress with the Love Babbar Sheet
        </h2>

        <div className="mb-6 flex justify-center">
          <button
            onClick={handleGetRandomQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-md font-semibold shadow-md"
          >
            Get Random Question
          </button>
        </div>

        {randomProblem && (
          <RandomProblem
            problem={randomProblem}
            isPracticed={Boolean(practicedMap[randomProblem.id])}
            onTogglePracticed={handleTogglePracticed}
            onClose={() => setRandomProblem(null)}
          />
        )}

        <ProblemList
          problems={problems}
          practicedMap={practicedMap}
          onTogglePracticed={handleTogglePracticed}
        />
      </div>
    </>
  );
};

export default Home;