import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Upon render, check if there are any jokes. If not, load jokes.
   * Dependencies: jokes and numJokesToGet
   */
  useEffect(
    function () {
      async function getJokes() {
        try {
          let j = [];
          let seenJokes = new Set();

          while (j.length < numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" },
            });
            let { ...jData } = res.data;
            if (!seenJokes.has(jData.id)) {
              seenJokes.add(jData.id);
              j.push({ ...jData, votes: 0 });
            } else {
              console.log("duplicate found!");
            }
          }
          setJokes(j);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      if (jokes.length === 0) getJokes();
    },
    [numJokesToGet, jokes]
  );

  /* empty joke list, set to loading state */
  function generateNewJokes() {
    // emptying the joke list will cause rerender from useEffect
    setJokes([]);
    setIsLoading(true);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes((allJokes) =>
      allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  /**
   * Render loading spinner if loading
   */
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }
  /**
   * Render list of sorted jokes if not loading
   */
  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;
