import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMagazineById } from "../../apiServices";
import { connect } from "react-redux";
import magazine from ".";
import Button from "../../components/button";
import { IdentificationIcon } from "@heroicons/react/solid";
import IdeaItem from "../../components/IdeaItem";
import { roles } from "../../constants/role";
const MagazineDatailPage = ({ getNewTokenRequest, authenticateReducer }) => {
  const [magazineDetail, setMagazineDetail] = useState({});
  const { token, user } = authenticateReducer;
  const { id } = useParams();
  const navigate = useNavigate();
  const getMegazineDetail = useCallback(async () => {
    if (id) {
      const { data, status } = await getMagazineById(token, id);
      if (status === 200) {
        setMagazineDetail(data);
      }
    }
  }, [id, token, user._id]);
  useEffect(() => {
    getMegazineDetail();
  }, [getMegazineDetail]);
  return (
    magazineDetail && (
      <>
        <div className="container max-w-xl md:max-w-screen-lg mx-auto bg-white border shadow-sm px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold my-2 text-2xl">{magazineDetail.name}</h3>
            {user?.role === roles.STUDENT && (
              <Button
                icon={IdentificationIcon}
                type="primary"
                title="Assign"
                onClick={(e) =>
                  navigate(`/contribute?magazineId=${magazineDetail._id}`)
                }
              />
            )}
          </div>
          <div>
            <div className="text-gray-500 text-xs ">
              {magazineDetail.department?.name} - {magazineDetail.academy?.name}
            </div>
          </div>
          <div className="text-gray-500 text-xs flex">
            <span className="inline-block">
              {new Date(magazineDetail.startDate).toLocaleDateString("en-US")} -{" "}
              {new Date(magazineDetail.endDate).toLocaleDateString("en-US")}
            </span>
          </div>
          <p className="text-gray-800 text-sm my-2 leading-normal md:leading-relaxed">
            {magazineDetail.description}
          </p>
        </div>
        <div className="container max-w-xl md:max-w-screen-lg mx-auto bg-white border shadow-sm rounded-lg ">
          <div className="w-full px-2 max-h-96 overflow-y-auto">
            <ul className="px-5 py-2">
              {magazineDetail.ideas &&
                magazineDetail.ideas.map((idea) => (
                  <IdeaItem
                    title={idea.title}
                    description={idea.description}
                    key={idea._id}
                    id={idea._id}
                    date={idea.createdAt}
                    commentCount={idea.comments.length}
                    like={idea.reactions.length}
                    view={idea?.viewCount | 0}
                    academyId={idea.academy}
                    authenticateReducer={authenticateReducer}
                    getNewTokenRequest={getNewTokenRequest}
                  />
                ))}
            </ul>
          </div>
        </div>
      </>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(MagazineDatailPage);
