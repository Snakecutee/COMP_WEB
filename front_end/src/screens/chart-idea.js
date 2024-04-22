import { connect } from "react-redux";
import { getNewToken } from "../store/actions/authenticateAction";
import {
  getIdeaStatistics,
  getUserStatistics,
  tokenRequestInterceptor,
} from "../apiServices";
import { useState, useCallback, useEffect, useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import SelectOption from "../components/SelectOption";
const ChartIdea = ({ getNewTokenRequest, token, updateRouter }) => {
  const [statisticIdea, setStatisticIdea] = useState([]);
  const [statisticUser, setStatisticUser] = useState([]);
  const [selectAcademy, setSelectAcademy] = useState("");

  const loadIdeaStatictis = useCallback(async () => {
    const load = async () => {
      const { data, status } = await getIdeaStatistics(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      load,
      getNewTokenRequest
    );
    if (status === 201) {
      setStatisticIdea(data);
    }
  }, [token, getNewTokenRequest]);

  const loadUserStatictis = useCallback(async () => {
    const load = async () => {
      const { data, status } = await getUserStatistics(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      load,
      getNewTokenRequest
    );
    if (status === 201) {
      setStatisticUser(data);
      setSelectAcademy(data[0].name);
    }
  }, [token, getNewTokenRequest]);

  useEffect(() => {
    loadIdeaStatictis();
    loadUserStatictis();
    document.title = "Dash board";
  }, [loadIdeaStatictis, loadUserStatictis]);

  const ideaSeriesData = useMemo(() => {
    const transformedData = [];
    for (let i = 0; i < statisticIdea[0]?.departmentArray?.length; i++) {
      const departmentData = {
        data: [],
        label: statisticIdea[0].departmentArray[i].name,
      };
      for (let j = 0; j < statisticIdea.length; j++) {
        departmentData.data.push(statisticIdea[j]?.departmentArray[i]?.count);
      }
      transformedData.push(departmentData);
    }

    return transformedData;
  }, [statisticIdea]);

  const userSeriesData = useMemo(() => {
    const transformedData = [];
    for (let i = 0; i < statisticUser[0]?.departmentArray?.length; i++) {
      const departmentData = {
        data: [],
        label: statisticUser[0].departmentArray[i].name,
      };
      for (let j = 0; j < statisticUser.length; j++) {
        departmentData.data.push(statisticUser[j]?.departmentArray[i]?.count);
      }
      transformedData.push(departmentData);
    }

    return transformedData;
  }, [statisticUser]);

  const onAcademyChange = (e) => {
    e.preventDefault();
    setSelectAcademy(e.target.value);
  };

  const ideaSeriesPercentData = useMemo(() => {
    const academy = statisticIdea.find((s) => s.name === selectAcademy);
    return academy?.departmentArray.map((department) => ({
      value: department?.count / academy.total,
      label: department?.name,
    }));
  }, [statisticIdea, selectAcademy]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-base">
            Idea of each Department in Academy
          </h1>
          {statisticIdea && ideaSeriesData && (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data:
                    statisticIdea &&
                    statisticIdea.map((academy) => academy.name),
                },
              ]}
              series={ideaSeriesData}
              width={500}
              height={500}
            />
          )}
        </div>
        <div>
          <h1 className="font-bold text-base">
            User have contribute of Department in Academy
          </h1>
          {statisticUser && userSeriesData && (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data:
                    statisticUser &&
                    statisticUser.map((academy) => academy.name),
                },
              ]}
              series={userSeriesData}
              width={500}
              height={500}
            />
          )}
        </div>
      </div>
      <div className="w-[30vw]">
        <SelectOption
          defaultValue={selectAcademy}
          listData={statisticIdea}
          onChange={onAcademyChange}
        />
        {ideaSeriesPercentData && (
          <PieChart
            series={[
              {
                data: ideaSeriesPercentData,
              },
            ]}
            width={500}
            height={200}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.authenticateReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
    updateRouter: () => dispatch(subRouterUpdate()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartIdea);
