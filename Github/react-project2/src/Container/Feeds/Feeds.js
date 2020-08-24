import React, { Fragment, useEffect, useState } from "react";
import { InstaPost, Spinner } from "../../Components";
import axios from "axios";

const Feeds = (props) => {
  const [postimage, setImage] = useState([]);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    setSpinner(true);
    axios
      .get("http://localhost:9000/post/feeds", {
        headers: { Authorization: `Bearer ${localStorage.getItem("tokens")}` },
      })
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          const feeds = response.data.message.sort(function (a, b) {
            return new Date(b.postedTime) - new Date(a.postedTime);
          });
          setImage(feeds);
          setSpinner(false);
        }, 1000);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
  }, []);
  function getPostedTime(postedTime) {
    return Math.round((new Date() - new Date(postedTime)) / 1000 / 60);
  }
  const goProfile = (user) => {
    const myData = {
      user: user,
      userType: "unknown",
    };

    props.history.push("/post", myData);
  };
  return (
    <Fragment>
      {postimage.length > 0 ? (
        postimage.map((image) => (
          <InstaPost
            profileSrc={
              image.user.photo
                ? `http://localhost:9000/${image.user.photo}`
                : "Image/logoAvatar.jpg"
            }
            profileName={image.user.firstName}
            postedTime={
              getPostedTime(image.postedTime) < 3
                ? "just now"
                : getPostedTime(image.postedTime) > 59 &&
                  getPostedTime(image.postedTime) < 120
                ? Math.round(getPostedTime(image.postedTime) / 60) + " hour ago"
                : getPostedTime(image.postedTime) < 120
                ? getPostedTime(image.postedTime) + " minutes ago"
                : getPostedTime(image.postedTime) > 1139
                ? "yesterday"
                : getPostedTime(image.postedTime) > 119 &&
                  getPostedTime(image.postedTime) < 1140
                ? Math.round(getPostedTime(image.postedTime) / 60) +
                  " hours ago"
                : image.postedTime
            }
            imgSrc={`http://localhost:9000/${image.image}`}
            caption={image.caption}
            onClick={() => goProfile(image.user._id)}
            key={image.image}
          />
        ))
      ) : (
        <Fragment>
          <span className="nodata">
            <Spinner />
          </span>
          {!spinner && (
            <h3 className="nodata">There is no post available..!</h3>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
export default Feeds;
