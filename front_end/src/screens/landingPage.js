import backdrop from "../assets/backdrop.jpeg";
import Footer from "../components/footer";
import IdeasList from "../components/ideasList2";
import Navbar from "../components/navbar";
import { connect } from "react-redux";
import { getNewToken } from "../store/actions/authenticateAction";
import { roles } from "../constants/role";
import PrivateRouter from "../router/customRouters/privateRouter";
import ChartIdea from "./chart-idea";
const LandingPage = ({ authenticateReducer }) => {
  const { token, user } = authenticateReducer;

  return !user.role || (user.role && user.role === roles.STUDENT) ? (
    <>
      <Navbar />
      <main className="mt-[2rem] mb-[2rem] h-max min-h-screen">
        <IdeasList />
      </main>
      <Footer />
    </>
  ) : user.role === roles.MARKETING_MANAGER ? (
    <PrivateRouter>
      <div className="w-full h-full p-8">
        <ChartIdea />
      </div>
    </PrivateRouter>
  ) : (
    <PrivateRouter>
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/5 flex  flex-col lg:flex-row justify-center items-center mx-auto ">
          <h1 className="text-xl lg:text-4xl text-center font-bold max-w-2xl text-violet-700">
           KAIJO
          </h1>
          <img className="w-4/5" src={backdrop} alt="backdrop" />
        </div>
      </div>
    </PrivateRouter>
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

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
