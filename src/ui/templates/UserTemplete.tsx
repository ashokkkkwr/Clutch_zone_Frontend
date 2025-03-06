import { Outlet } from "react-router-dom";
import UserNavbar from "../Components/user/component/UserNavbar";
import UserFooter from "../Components/user/component/UserFooter";

const UserTemplete = () => {
  
    return (
        <>
        <UserNavbar />

            <Outlet />
            <UserFooter />
        </>
    )
}
export default UserTemplete