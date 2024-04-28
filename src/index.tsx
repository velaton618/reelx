import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App/App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Movie from './pages/Movie/Movie';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: "/movie/:id",
    element: <Movie />,
  }
]);
root.render(
  <RouterProvider router={router} />
);