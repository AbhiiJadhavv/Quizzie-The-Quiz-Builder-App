import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer } from 'react-toastify';
import { UserProvider, useUser } from './UserContext';
import NotFound from './pages/NotFound';
import Form from './pages/Form';
import HomePage from './pages/HomePage';
import SharedQuiz from './pages/SharedQuiz';

function AppRouter() {
  const { user, setUser } = useUser();

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <HomePage user={user} />,
    },
    {
      path: '/form',
      element: <Form setUser={setUser} />,
    },
    {
      path: '/sharedquiz/:quizId',
      element: <SharedQuiz />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <RouterProvider
      router={appRouter}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      }}
    />
  );
}

function App() {
  return (
    <UserProvider>
      {/* <ToastContainer /> */}
      <AppRouter />
    </UserProvider>
  );
}

export default App;
