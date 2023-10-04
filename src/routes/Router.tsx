import React from "react";
import Home from '../presentation/pages/Home';

import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider,
} from 'react-router-dom';
import Websocket from "../presentation/pages/Room";
import {RoomSettings} from "../presentation/pages/RoomSettings";
import Room from "../presentation/pages/Room";

const router = createBrowserRouter(
  
  createRoutesFromElements(
    <Route >
      <Route index path="/" element={<Home />} />
      <Route path="/room/:name" element={<Room />} />
      <Route path="/room-settings" element={<RoomSettings />}/>
    </Route>
  )
)

function Router() {
  return (
    <RouterProvider router={router} />
  )
}

export default Router;