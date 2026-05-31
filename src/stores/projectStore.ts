// src/stores/projectsStore.ts
import { create } from "zustand";
import { registerStoreReset } from "./storeResetter";
import { Project } from "@/types/project";

interface ProjectsStore {
    projects: Project[];
    project: Project | null;
    setProjects: (projects: Project[]) => void;
    setProject: (project: Project) => void;
    addProject: (project: Project) => void;
    updateProject: (projectId: string, data: Partial<Project>) => void;
    reset: () => void;
}

const INITIAL_STATE = {
    projects: [],
    project: null,
};

export const useProjectsStore = create<ProjectsStore>()((set) => {
    const reset = () => set(INITIAL_STATE);
    registerStoreReset(reset);

    return {
        ...INITIAL_STATE,
        reset,
        setProjects: (projects) => set({ projects, project: projects[0] || null }),
        setProject: (project) => set({ project }),
        addProject: (project) => set((state) => ({
            projects: [...state.projects, project],
        })),
        updateProject: (projectId, data) => set((state) => ({
            projects: state.projects.map(p =>
                p.id === projectId ? { ...p, ...data } : p
            ),
            project: state.project && state.project.id === projectId ? { ...state.project, ...data } : state.project,
        })),
    };
});