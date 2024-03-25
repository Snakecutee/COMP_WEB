import backdrop from '../assets/backdrop.jpeg'

const LandingPage = () => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/5 flex  flex-col lg:flex-row justify-center items-center mx-auto ">
          <h1 className="text-xl lg:text-4xl text-center font-bold max-w-2xl text-violet-700">
            Trello
          </h1>
          <img className="w-4/5" src={backdrop} alt="backdrop" />
        </div>
      </div>
    );
}

export default LandingPage;