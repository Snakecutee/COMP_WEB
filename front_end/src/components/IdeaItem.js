import { ChevronLeftIcon, ChatAltIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { roles } from "../constants/role";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  getAllIdeaWithFilter,
  tokenRequestInterceptor,
  getAllAcademic,
  updateIdea,
} from "../apiServices/index";
import { getNewToken } from "../store/actions/authenticateAction";

const IdeaItem = ({
  index,
  title,
  description,
  commentCount,
  like,
  id,
  date,
  view,
  role,
  isApprove,
  academyId,
  magazine,
  token,
  user,
  onItemClick,
}) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    navigate(`/post/${id}`);
  };
  const handleClickApprove = async (e) => {
    e.preventDefault();
    const ideaSubmitBody = { isApprove: true };
    if (user.role === roles.MARKETING_COORDINATOR) {
      setIsLoading(true);
      const uploadApproveIdea = await updateIdea(ideaSubmitBody, id, token);
      if (uploadApproveIdea.status === 201) {
        toast.success("Approve Success!!!");
        setIsLoading(false);
        onItemClick();
      }
    } else {
      alert("Only users with role MARKETING COORDINATOR rights are approved");
    }
  };

  return (
    <li key={index} className="mb-5 w-full">
      <div className="cursor-pointer flex justify-between items-center bg-gray-200 py-6 px-4 rounded-xl">
        <div className="flex gap-3 items-center" onClick={handleNavigate}>
          <div
            className={`bg-violet-700 rounded-md w-20 h-20 flex items-center justify-center`}
          >
            <span className="text-white font-black text-xl md:text-3xl">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <h4 className="font-bold text-md md:text-xl">{title}</h4>
              <p className="hidden md:inline-block max-w-md w-full truncate">
                {description}
              </p>
              {academyId && (
                <p className="text-gray-800 text-sm  leading-normal md:leading-relaxed">
                  Academy: {academyId}
                </p>
              )}
              {magazine && (
                <p className="text-gray-800 text-sm leading-normal md:leading-relaxed">
                  Magazine: {magazine}
                </p>
              )}
            </div>
            <div className="flex text-gray-600 gap-3 md:gap-10">
              <div className="flex items-center gap-1">
                <ChatAltIcon className="w-5 h-5" />
                <span className="font-bold">{commentCount}</span>
              </div>
              <span className="hidden md:inline-block font-medium underline cursor-pointer">
                {moment(new Date(date), "YYYYMMDD").fromNow()}
              </span>
              {/* <span className="font-medium text-sm cursor-pointer">
                Status: Spending
              </span> */}
            </div>
          </div>
        </div>
        <div className="flex-1 h-[160px] " onClick={handleNavigate}></div>
        {!isApprove && user?.role === roles.MARKETING_COORDINATOR && (
          <button
            className="bg-blue-400 hover:bg-blue-600 cursor-pointer flex gap-1 sm:gap-2 items-center h-fit text-white rounded-md font-semibold px-[10px] py-[7px] sm:px-4 sm:py-3 w-fit"
            onClick={handleClickApprove}
          >
            <label className="cursor-pointer hidden sm:inline-block">
              Approve
            </label>
          </button>
        )}
        {/* <div className="flex flex-col items-center justify-center text-gray-700 py-3 px-2 rounded border-[1px] border-gray-500">
          <ChevronLeftIcon className="w-5 h-5 md:w-10 md:h-10 rotate-90" />
          <span className="font-bold">{numberWithCommas(like)}</span>
          <ChevronLeftIcon className="w-5 h-5 md:w-10 md:h-10 -rotate-90" />
        </div> */}
      </div>
    </li>
  );
};

export default IdeaItem;
