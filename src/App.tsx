import { Toaster } from 'sonner';
import Tabs from './components/Tabs/Tabs';

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
      <Tabs />
    </main>
  );
};

export default App;
