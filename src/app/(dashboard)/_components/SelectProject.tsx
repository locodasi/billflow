import styled from "styled-components";

import { useProjectsStore } from "@/stores/projectStore";

import { ClickTooltip } from "@/components/Tooltip";
import Icon from "@/components/icons/Icon";

const SelectProject = () => {
    const project = useProjectsStore(state => state.project);

    return (
        <div style={{ width: "100%" }}>
            <ClickTooltip content={close => <Projects close={close} />} theme="transparent" position="right">
                <ProjectWrapper>
                    <ProjectTitle>{project ? project.name : "No project selected"}</ProjectTitle>

                    <Icon icon="nav-arrow-down" size={16} iconColor="var(--Icons-icon-700)" />
                </ProjectWrapper>
            </ClickTooltip>
        </div>
    )
}

export default SelectProject;

const ProjectWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.5rem;
    width: calc(100% - 1rem);
    cursor: pointer;

    &:hover {
        background-color: var(--Background-Colors-bg-primary);
    }
`;

const ProjectTitle = styled.h2`
    color: var(--Text-text-primary);
    font-size: 0.875rem;
    padding: 0.5rem;
    border-radius: 0.5rem;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Projects = ({ close }: { close: () => void }) => {
    const projects = useProjectsStore(state => state.projects);
    const project = useProjectsStore(state => state.project);
    const setProject = useProjectsStore(state => state.setProject);

    const handleClose = (projectId: string) => {
        setProject(projects.find(p => p.id === projectId)!);
        close();
    }

    return (
        <ProjectsWrapper>
            {projects.filter(p => p.id !== project?.id).map(p => (
                <ProjectWrapperElement key={p.id}>
                    <ProjectTitle onClick={() => handleClose(p.id)}>
                        {p.name}
                    </ProjectTitle>
                </ProjectWrapperElement>
            ))}
        </ProjectsWrapper>
    )
}

const ProjectsWrapper = styled.div`
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background-color: var(--Background-Colors-bg-primary);
    border: 1px solid var(--Border-Colors-border-secondary);
    border-radius: 0.5rem;
`;

const ProjectWrapperElement = styled.div`
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
        background-color: var(--Background-Colors-bg-secondary);
    }
`;