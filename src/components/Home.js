import { useState } from "react";
import Confessions from "./Confessions";
import { Spinner } from "./UI/Spinner";
import { GITHUB_URL, POST_CONFESSIONS_API } from "../constants";

const Home = () => {
  const [title, setTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [confession, setConfession] = useState("");
  const [confessions, setConfessions] = useState([]);
  const [highlighedID, setHighlightedID] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (title && confession) {
        setIsPosting(true);

        let data = await fetch(POST_CONFESSIONS_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            confession,
          }),
        });

        data = await data.json();

        const body = JSON.parse(data?.body);
        setHighlightedID(body?.id);
        setTimeout(() => setHighlightedID(null), 3000);
        setConfessions([body, ...confessions]);
        setTitle("");
        setConfession("");
      }
    } catch (e) {
      console.log("Error: ", e);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-700">
          <div className="relative flex justify-between sm:justify-center items-center bg-indigo-800 p-4">
            <h1 className="text-2xl font-bold text-center text-white">
              Spill the tea!
            </h1>
            <div
              onClick={() => window.open(GITHUB_URL, "_blank")}
              className="flex items-center space-x-1 right-2 sm:right-2 absolute cursor-pointer"
            >
              <img alt="github_logo" src="github.svg" />
              <div className="text-xs sm:text-base text-white">Github</div>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  maxLength={50}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your confession"
                  required
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 placeholder-gray-400"
                />
              </div>
              <div>
                <label
                  htmlFor="confession"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confession
                </label>
                <textarea
                  id="confession"
                  value={confession}
                  onChange={(e) => setConfession(e.target.value)}
                  placeholder="Write your confession here"
                  required
                  rows="4"
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="flex justify-center items-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Share Confession
                {isPosting && (
                  <Spinner variant="lens" size="sm" className="ml-2" />
                )}
              </button>
            </form>
          </div>
        </div>
        <Confessions
          confessions={confessions}
          setConfessions={setConfessions}
          highlighedID={highlighedID}
        />
      </div>
    </div>
  );
};

export default Home;
