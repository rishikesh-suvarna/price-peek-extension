import { Toaster } from 'sonner';
import Tabs from './components/Tabs/Tabs';
import 'react-loading-skeleton/dist/skeleton.css'

const App: React.FC = () => {
  return (
    <main>
      <Toaster
        position='bottom-center'
        toastOptions={{
          style: {
            padding: '.8rem',
          }
        }}
      />
      <div className="bg-[#eee4fc]">
        <img
          src="/assets/pp-logo-horizontal.png"
          className='p-2 h-10 mx-auto'
        />
      </div>
      <Tabs />
    </main>
  );
};

export default App;
