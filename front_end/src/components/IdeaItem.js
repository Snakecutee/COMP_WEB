import {
  ChevronLeftIcon,
  ChatAltIcon,
} from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { roles } from "../constants/role";
import { useEffect, useState } from "react";

const IdeaItem = ({
  index,
  title,
  description,
  commentCount,
  category,
  like,
  id,
  date,
  view,
  role
}) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    navigate(`/post/${id}`)
  }


  return (
    <li key={index} className="mb-5 w-full">
      <div
        onClick={
          role === roles.STAFF || role === roles.QA_COORDINATOR
            ? handleNavigate
            : null
        }
        className="cursor-pointer flex justify-between items-center bg-gray-200 py-6 px-4 rounded-xl"
      >
        <div className="flex gap-3 items-center">
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
            </div>
            <div className="flex text-gray-600 gap-3 md:gap-10">
              <div className="flex items-center gap-1">
                <ChatAltIcon className="w-5 h-5" />
                <span className="font-bold">{commentCount}</span>
              </div>
              <span className="font-medium text-sm">{category}</span>
              <span className="hidden md:inline-block font-medium underline cursor-pointer">
                {moment(new Date(date), "YYYYMMDD").fromNow()}
              </span>
              <span className="font-medium text-sm cursor-pointer">
                {view} Views
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-700 py-3 px-2 rounded border-[1px] border-gray-500">
          <ChevronLeftIcon className="w-5 h-5 md:w-10 md:h-10 rotate-90" />
          <span className="font-bold">{numberWithCommas(like)}</span>
          <ChevronLeftIcon className="w-5 h-5 md:w-10 md:h-10 -rotate-90" />
        </div>
      </div>
    </li>
  );
};

export default IdeaItem;
