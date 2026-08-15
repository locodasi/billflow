// components/ProjectSync.tsx
"use client";

import { useEffect, useRef } from "react";
import { useProjectsStore } from "@/stores/projectStore";
import { setProjectCookieAction } from "@/lib/project-cookies";

function ProjectSync() {
  const currentProjectId = useProjectsStore((s) => s.project?.id);
  const lastSynced = useRef<string | null>(null);

  useEffect(() => {
    if (currentProjectId && currentProjectId !== lastSynced.current) {
      lastSynced.current = currentProjectId;
      setProjectCookieAction(currentProjectId);
    }
  }, [currentProjectId]);

  return null;
}

export default ProjectSync;