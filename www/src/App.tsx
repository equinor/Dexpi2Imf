import './App.css'
import Diagram from "./components/Diagram.tsx";
import { useState} from "react";
import { SideBar} from "@equinor/eds-core-react";
import {build_wrench, brush, format_color_fill} from '@equinor/eds-icons';

export enum Action {
    InsideBoundary,
    Boundary,
}

function App() {
    // Completion packages should be contained here
    // Maybe as a state? List of all IDs in a completion package?
    //const [completionPackageIri, setCompletionPackageIri] = useState<string>('asset:Package1');
    const [completionPackage, setCompletionPackage] = useState<string[]>([]);
    const [action, setAction] = useState<Action>(Action.Boundary);

    return (
        <>
            <SideBar>
                <SideBar.Content>
                    <SideBar.Link label={'New Commissioning Package'} icon={build_wrench} active={false} onClick={() => {}} />
                    <SideBar.Link label={'Select Boundary'} icon={brush} active={action === Action.Boundary} onClick={() => {setAction(Action.Boundary)}} />
                    <SideBar.Link label={'Select Inside Boundary'} icon={format_color_fill} active={action === Action.InsideBoundary} onClick={() => {setAction(Action.InsideBoundary)}} />
                </SideBar.Content>
            </SideBar>
            <Diagram completionPackage={completionPackage} setCompletionPackage={setCompletionPackage} action={action}/>
        </>
    )
}

export default App
