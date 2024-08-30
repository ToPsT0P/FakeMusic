import {createBrowserRouter} from "react-router-dom";
import MainPage from "../pages/mainPage/MainPage.tsx";
import ErrorPage from "../pages/errorPage/ErrorPage.tsx";
import SingerPage from "../pages/SongPage/SingerPage.tsx";


export const router = createBrowserRouter(
    [
        {
        path: "/",
        element: <MainPage/>,
        errorElement: <ErrorPage/>
        },
        {
            path: "/singer/:id",
            element: <SingerPage/>
        }
    ]
)