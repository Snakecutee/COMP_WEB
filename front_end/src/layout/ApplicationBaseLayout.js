import NavBar from '../components/navbar'
import Footer from '../components/footer'

const ApplicationBaseLayout = ({children}) => {
    return (
      <>
        <NavBar />
        <main className='mt-[2rem] mb-[2rem] h-max min-h-screen'>{children}</main>
        <Footer />
      </>
    );
}
export default ApplicationBaseLayout;