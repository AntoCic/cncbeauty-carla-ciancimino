import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAppDispatch } from './store';
import { fetchAppConfig } from './db/appConfig/appConfigSlice';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAppConfig());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
