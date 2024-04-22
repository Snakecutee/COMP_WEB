import moment from "moment";
const CommentItem = ({ user, content, time }) => {
  return (
    <div
      key={user._id}
      className="w-full border flex px-2 py-4 items-center gap-2 my-5"
    >
      <div className="flex items-center justify-center ">
        {user?.avatar ? (
          <img src={user?.avatar} />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center rounded-[100%] bg-gray-500">
            
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <span>
           
          </span>
          <span className="text-gray-500 text-sm">
            {moment(new Date(time), "YYYYMMDD").fromNow()}
          </span>
        </div>
        <span className="font-light text-gray-500 text-ellipsis ">
          {content}
        </span>
      </div>
    </div>
  );
};

export default CommentItem;