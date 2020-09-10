import React, { useState, useRef, useCallback, useEffect } from "react";
import { InstaPost } from "../../Components";
import moment from "moment";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";

const Feeds = (props) => {
  const [feeds, setFeeds] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);
  useEffect(() => {
    setSpinner(true);
    axios({
      method: "GET",
      url: "http://localhost:9000/post/feeds",
      headers: { Authorization: `Bearer ${localStorage.getItem("tokens")}` },
    })
      .then((response) => {
        const feeds = response.data.response.sort(function (a, b) {
          return new Date(b.postedTime) - new Date(a.postedTime);
        });
        setFeeds(feeds);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [props.location.state]);
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = feeds.slice(0, indexOfLastPost);
  const observer = useRef();
  const lastFeedsRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPosts) {
          if (currentPage <= Math.round(feeds.length / postsPerPage)) {
            setSpinner(true);
            setTimeout(() => {
              setCurrentPage((prevPageNumber) => prevPageNumber + 1);
              setSpinner(false);
            }, 2000);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [currentPosts]
  );

  function getPostedTime(postedTime) {
    const time = Math.round((new Date() - new Date(postedTime)) / 1000 / 60);
    if (time < 1) {
      return "Just now";
    } else if (time < 60) {
      return `${time} minutes ago`;
    } else if (time >= 60 && time < 120) {
      return `1 hour ago`;
    } else if (time >= 120 && time < 1140) {
      return `${Math.round(time / 60)} hours ago`;
    } else if (time >= 1140 && time < 2280) {
      return `Yesterday at ${moment(new Date(postedTime)).format("LT")}`;
    } else if (time >= 2280 && time < 1140 * 7) {
      return `${Math.round(time / 1140)} days ago`;
    } else {
      return `${moment(new Date(postedTime)).format("MMM DD")}`;
    }
  }
  const goProfile = (user) => {
    props.history.push(`/profile/${user}`);
  };
  return (
    <div style={{ marginTop: "15px" }}>
      {currentPosts.length > 0 &&
        currentPosts.map((image) => {
          return (
            <div ref={lastFeedsRef} key={image._id}>
              <InstaPost
                profileSrc={
                  image.user.photo
                    ? `http://localhost:9000/${image.user.photo}`
                    : "Image/logoAvatar.jpg"
                }
                profileName={image.user.firstName}
                postedTime={getPostedTime(image.postedTime)}
                imgSrc={`http://localhost:9000/${image.image}`}
                caption={image.caption}
                onClick={() => goProfile(image.user._id)}
              />
            </div>
          );
        })}
      {spinner && (
        <div
          style={{
            color: "gray",
            position: "relative",
            marginTop: "30px",
            marginBottom: "30px",
          }}
          className="spinner-border"
        />
      )}
      {!spinner && feeds.length < 1 && (
        <h3 className="nodata">There is no post available..!</h3>
      )}
    </div>
  );
};

export default Feeds;
