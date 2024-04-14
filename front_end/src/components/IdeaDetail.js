import { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getSingleIdea,
  reactToIdea,
  commentToIdea,
  increateView,
  getAllAcademic,
  tokenRequestInterceptor,
} from "../apiServices";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  PaperAirplaneIcon,
  DownloadIcon,
} from "@heroicons/react/outline";
import {
  DocumentAddIcon,
  SwitchHorizontalIcon,
  DocumentIcon,
  XIcon,
} from "@heroicons/react/solid";
import { getNewToken } from "../store/actions/authenticateAction";

import TextAria from "../components/text-area";
import Button from "../components/button";
import CommentItem from "../components/commentItem";
import { date } from "yup/lib/locale";
import { roles } from "../constants/role";

const reactionType = {
  LIKE: "Like",
  DISLIKE: "Dislike",
};

const IdeaDetail = ({ authenticateReducer, getNewTokenRequest }) => {
  const [ideaDetail, setIdeaDetail] = useState({});
  const [comments, setComments] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [yourReaction, setYourReaction] = useState(null);
  const { token, user } = authenticateReducer;
  const [disableLike, setDisableLike] = useState(false);
  const [disableCmt, setDisableCmt] = useState(false);

  const { id } = useParams();

  const refreshReactionsAndCommentsList = useCallback(async () => {
    const { data, status } = await getSingleIdea(id, token);
    if (status === 200) {
      setReactions(data.data.reactions);
      setComments(data.data.comments);
      const filter = data.data.reactions?.filter(
        (item) => item.user.id === user.id
      );
      setYourReaction(filter[0]);
    }
  }, [id, token, user.id]);

  const inscreaseViewOfIdea = async () => {
    await increateView(id, token);
  };

  const reaction = async (reactionType) => {
    const bodyData = {
      userId: user.id,
      reactionType: reactionType,
    };
    const { status } = await reactToIdea(id, bodyData, token);
    if (status === 201) {
      refreshReactionsAndCommentsList();
    }
  };

  const comment = async () => {
    const bodyData = {
      userId: user.id,
      content: commentContent,
      isAnonymous,
    };
    const { status } = await commentToIdea(id, bodyData, token);
    if (status === 201) {
      setCommentContent("");
      refreshReactionsAndCommentsList();
    }
  };
  const toggleAnonymous = () => {
    setIsAnonymous((prev) => !prev);
  };

  const getIdeaDetail = useCallback(async () => {
    const { data, status } = await getSingleIdea(id, token);
    if (status === 200) {
      setIdeaDetail(data.data);
      setComments(data.data.comments);
      setReactions(data.data.reactions);
      const filter = data.data.reactions?.filter(
        (item) => item.user.id === user.id
      );
      setYourReaction(filter[0]);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [id, token, user.id]);

  useEffect(() => {
    inscreaseViewOfIdea();
  }, []);

  useEffect(() => {
    getIdeaDetail();

    const interval = setInterval(() => {
      refreshReactionsAndCommentsList();
    }, 10000);

    return () => clearInterval(interval);
  }, [getIdeaDetail, refreshReactionsAndCommentsList]);

  return (
    <>
      <div className="container max-w-xl md:max-w-screen-lg mx-auto bg-white border shadow-sm px-4 py-3 rounded-lg">
        <div className="flex items-center">
          {ideaDetail?.isAnonymous ? (
            <div className="w-12 h-12 flex items-center justify-center rounded-[100%] bg-gray-500">
              <span className="font-medium text-[8px] text-white">
                Anonymous
              </span>
            </div>
          ) : ideaDetail?.user?.avatar ? (
            <img
              className="h-12 w-12 rounded-full"
              src={ideaDetail?.user?.avatar}
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-[100%] bg-gray-500">
              <span className="font-medium text-xl text-white">
                {ideaDetail?.user?.fullname.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="ml-2 flex-1">
           
            <div className="text-gray-500 text-xs ">
              {ideaDetail?.user?.role} - {ideaDetail.user?.department}
            </div>
            <div className="text-gray-500 text-xs flex">
              <span className="inline-block">
                {new Date(ideaDetail.createdAt).toLocaleDateString("en-US")}
              </span>
              <svg
                className="inline-block ml-1 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                data-supported-dps="16x16"
                fill="currentColor"
                width="16"
                height="16"
                focusable="false"
              >
                <path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z"></path>
              </svg>
            </div>
          </div>
          <div>
            {user?.role === roles.STUDENT &&
              user?.id === ideaDetail?.user?.id && (
                <Link to={`/ideas/update/${id}`}>
                  <Button
                    type={`primary`}
                    //onClick={handleSwitch}
                    title={"Editor"}
                    icon={SwitchHorizontalIcon}
                  />
                </Link>
              )}
          </div>
        </div>
        <h3 className="font-bold my-2 text-2xl">{ideaDetail.title}</h3>
        {ideaDetail.academy && (
          <p className="text-gray-800 text-sm my-2 leading-normal md:leading-relaxed">
            Academy: {ideaDetail.academy.name}
          </p>
        )}
        {ideaDetail.magazine && (
          <p className="text-gray-800 text-sm my-2 leading-normal md:leading-relaxed">
            Magazine: {ideaDetail.magazine.name}
          </p>
        )}
        <p className="text-gray-800 text-sm my-2 leading-normal md:leading-relaxed">
          {ideaDetail.description}
        </p>
        {ideaDetail?.documentLink && (
          <a
            className="bg-blue-400 w-fit px-3 py-2 rounded-md my-2 text-white"
            href={ideaDetail.documentLink}
          >
            {" "}
            Download
          </a>
        )}
        {!disableLike ? (
          <div className="flex gap-3 items-center mt-3"></div>
        ) : (
          <h2 className="text-red-800 mt-5 ">
            Thumbs Up or Thumbs Down Is Close
          </h2>
        )}
      </div>
      <div className="container max-w-xl md:max-w-screen-lg mx-auto bg-white border shadow-sm rounded-lg mt-4">
        {!disableCmt ? (
          user?.role === roles.MARKETING_COORDINATOR && (
            <div className="w-full border flex px-2 py-4 items-center gap-2">
              <div className="flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user?.avatar} />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center rounded-[100%] bg-gray-500">
                    <span className="font-medium text-xl text-white">
                      {user.fullname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="block w-full">
                <TextAria
                  rows={3}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Leave your comment"
                />
                
              </div>
              <Button
                role="button"
                type="primary"
                title="Send"
                onClick={comment}
                icon={PaperAirplaneIcon}
                disabled={!commentContent}
              />
            </div>
          )
        ) : (
          <div className="d-flex justify-center">
            <h2 className="text-red-800 mt-5 text-center">Comment Is Close</h2>
          </div>
        )}
        <div className="w-full px-2 max-h-96 overflow-y-auto">
          {comments &&
            comments?.map((comment, index) => (
              <CommentItem
                key={index}
                time={comment.createdAt}
                user={comment?.user}
                content={comment?.content}
               
              />
            ))}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IdeaDetail);
