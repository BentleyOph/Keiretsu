import FlickeringGrid from "@/components/ui/flickering-grid";
import TransitionText from "@/components/TransitionText";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
		<>
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
			
            <div className="flex h-screen items-center justify-center relative z-10">
				<div className="mr-10">
			<TransitionText />
			</div>
                {children}
            </div>
        </div>
		</>
    );
};

export default AuthLayout;