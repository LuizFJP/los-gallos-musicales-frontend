import Home from '../pages/home/home';

import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider,
} from 'react-router-dom';
import {CreateRoom} from "../pages/create-room/create-room";
import Room from "../pages/room/room";

const router = createBrowserRouter(

  createRoutesFromElements(
    <Route >
      <Route index path="/" element={<Home />} />
      <Route path="/room" element={<Room />} />
      <Route path="/room-settings" element={<CreateRoom />}/>
    </Route>
  )
)

function Router() {
  return (
    <RouterProvider router={router} />
  )
}

export default Router;