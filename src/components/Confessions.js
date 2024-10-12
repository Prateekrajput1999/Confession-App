import { useEffect, useState } from "react";
import { Spinner } from "./UI/Spinner";
import { FETCH_CONFESSIONS_API } from "../constants";
import { useInView } from "react-cool-inview";
import timeAgo from "../utils/timeUtils";

const Confessions = ({ confessions, highlighedID, setConfessions }) => {
  const [fetchingConfessions, setFechingConfessions] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [cursor, setCursor] = useState(undefined);

  const fetchConfessions = async (cursor) => {
    try {
      if (!cursor) {
        setFechingConfessions(true);
      }
      let data = await fetch(FETCH_CONFESSIONS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          LastEvaluatedKey: cursor,
          limit: 10,
        }),
      });

      data = await data.json();

      const body = JSON.parse(data?.body);
      const Items = body?.Items ?? [];

      Items.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp));

      setConfessions([...confessions, ...Items]);
      setCursor(body?.LastEvaluatedKey);
    } catch (e) {
      console.log("Error: ", e);
    } finally {
      if (!cursor) {
        setFechingConfessions(false);
      }
    }
  };

  const { observe } = useInView({
    onEnter: async () => {
      try {
        if (isFetchingMore) return;

        setIsFetchingMore(true);
        await fetchConfessions(cursor);
      } catch (e) {
        console.log("Error: ", e);
      } finally {
        setIsFetchingMore(false);
      }
    },
  });

  useEffect(() => {
    fetchConfessions();
  }, []);

  if (fetchingConfessions) {
    return (
      <div className="flex justify-center items-center w-full">
        <span className="text-white mr-2">Loading confessions</span> <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {confessions.map((conf) => (
          <div
            key={conf.id}
            className={`${
              conf?.id === highlighedID
                ? "animate-pulse shadow-md shadow-blue-700"
                : ""
            } bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-700`}
          >
            <div className="flex justify-between bg-gray-700 p-4 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-white">{conf.title}</h2>
              <span className="text-gray-400">{timeAgo(conf?.timestamp)}</span>
            </div>
            <div className="p-4">
              <p className="text-gray-300">{conf.confession}</p>
            </div>
          </div>
        ))}
        {cursor && (
          <div ref={observe} className="w-full flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default Confessions;
