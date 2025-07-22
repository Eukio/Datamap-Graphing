import { Container } from "@mui/material";
import React, { useState } from "react";
import PreformanceChart from "./components/PreformanceChart";
import DatamapList from "./components/DatamapList";
import { Box } from "@mui/system";


export default function ThermostatAnalytics() {
    const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

    return (
        <>
        Thermostat Analytics
            <Container maxWidth={"xl"} sx={{display:"flex"}} >
                <Box sx = {{ display: "block", gap: "20px" }}>
                <PreformanceChart selectedValues={selectedValues}/>
                </Box>
                <Box sx = {{ display: "block", gap: "20px", width: "500px"}}>
                    <DatamapList selectedValues={selectedValues}setSelectedValues={setSelectedValues}/>
                </Box>
               
            </Container>
        </>
    );
}



