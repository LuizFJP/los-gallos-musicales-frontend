import React from "react";
import Home from '../presentation/pages/Home';

import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider,
} from 'react-router-dom';
import Websocket from "../presentation/pages/Room";

const router = createBrowserRouter(
  
  createRoutesFromElements(
    <Route >
      <Route index path="/" element={<Home />} />
      <Route path="/room/:name" element={<Websocket />} />
    </Route>
  )
)

function Router() {
  return (
    <RouterProvider router={router} />
  )
}

export default Router;