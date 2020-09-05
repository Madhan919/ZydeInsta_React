import React, { Fragment, useState, useRef, useCallback } from "react";
import { InstaPost, useBookSearch } from "../../Components";
import moment from "moment";

const Feeds = (props) => {
  const [spinner, setSpinner] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const { loading, feeds, hasMore } = useBookSearch(
    "http://localhost:9000/post/feeds"
  );
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSpinner(true);
          setTimeout(() => {
            setCurrentPage((prevPageNumber) => prevPageNumber + 1);
            setSpinner(false);
          }, 3000);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
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
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = feeds.slice(0, indexOfLastPost);
  return (
    <Fragment>
      {currentPosts.length > 0 &&
        currentPosts.map((image) => {
          return (
            <div ref={lastBookElementRef} key={image._id}>
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
    </Fragment>
  );
};

export default Feeds;
