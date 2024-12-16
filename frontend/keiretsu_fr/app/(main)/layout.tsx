import Navbar from "@/components/Navbar";

const mainLayout = ({ children }:{children:React.ReactNode}) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default mainLayout; 