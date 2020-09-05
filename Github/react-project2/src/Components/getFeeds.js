import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(url) {
  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios({
      method: "GET",
      url: url,
      headers: { Authorization: `Bearer ${localStorage.getItem("tokens")}` },
    })
      .then((response) => {
        const feeds = response.data.response.sort(function (a, b) {
          return new Date(b.postedTime) - new Date(a.postedTime);
        });
        setFeeds(feeds);
        setHasMore(response.data.response.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return { loading, feeds, hasMore };
}
