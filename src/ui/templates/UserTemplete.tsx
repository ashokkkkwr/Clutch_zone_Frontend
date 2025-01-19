import { Outlet } from "react-router-dom";
import UserNavbar from "../Components/user/UserNavbar";

const UserTemplete = () => {
  
    return (
        <>
        <UserNavbar />

            <Outlet />
        </>
    )
}
export default UserTemplete