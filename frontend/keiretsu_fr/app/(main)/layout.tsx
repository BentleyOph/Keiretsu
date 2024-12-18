import Navbar from "@/components/Navbar";
import FlickeringGrid from "@/components/ui/flickering-grid";

const mainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 -z-10">
                <FlickeringGrid
                    squareSize={4}
                    gridGap={6}
                    flickerChance={0.3}
                    color="rgb(163, 136, 238)"
                    maxOpacity={0.1}
                />
            </div>
            <div className="relative z-10">
                <Navbar />
                {children}
            </div>
        </div>
    );
};

export default mainLayout;