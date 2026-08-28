import { TextField, Box, Stack } from "@mui/material";
import Logo from "../../../../assets/CarniSoftLogo.png"

const Inicio = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                bgcolor: "background.default",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    maxWidth: "800px",
                    width: "100%",
                    p: 2,
                    animation: "slideDown 0.4s ease",
                    "@keyframes slideDown": {
                        from: {
                            opacity: 0,
                            transform: "translateY(-40px)"
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    }
                }}
            >
                <Stack>
                    <Box>
                        
                    </Box>
                    <Box
                        component="img"
                        src={Logo}
                        alt="TERESAI Logo"
                        sx={{
                            height: "400px",
                            width: "auto",
                        }}
                    />
                </Stack>
            </Box>
        </Box>
    )
};

export default Inicio;