import Home from '../pages/home/home';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { CreateRoom } from "../pages/create-room/create-room";
import Room from "../pages/room/room";
import { RoomProvider } from '../context/room-context';
import { JoinRoom } from '../pages/join-room/join-room';

const router = createBrowserRouter(

  createRoutesFromElements(

    <Route >
      <Route index path="/" element={<Home />} />
      <Route path="/room" element={<Room />} />
      <Route path="/room-settings" element={<CreateRoom />} />
      <Route path="/share/:shortId" element={<JoinRoom />} />
    </Route>

  )
)

function Router() {
  return (
    <RoomProvider>
      <RouterProvider router={router} />
    </RoomProvider>
  )
}

export default Router;