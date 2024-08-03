import HomePage from "./Homepage"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-900 to-sky-950 p-6">
      <h1 className="text-5xl font-black text-white w-full text-center border-b border-white/50 pb-6 max-w-[500px] mx-auto">See Label</h1>
        <HomePage />
            <ToastContainer
                position='top-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
    </div>
  )
}

export default App
