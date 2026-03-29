"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiCheckLikedBatch } from "@/lib/services/component.service";
import type { ComponentData } from "@/lib/services/component.service";
import ComponentCard from "@/components/component/ComponentCard";

interface Props {
  components: ComponentData[];
}

export default function ComponentGrid({ components }: Props) {
  const { user } = useAuth();
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || components.length === 0) return;
    const slugs = components.map((c) => c.slug);
    apiCheckLikedBatch(slugs)
      .then((res) => setLikedSlugs(new Set(res.likedSlugs)))
      .catch(() => {});
  }, [user, components]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {components.map((component) => (
        <ComponentCard
          key={component.id}
          component={component}
          initialLiked={likedSlugs.has(component.slug)}
        />
      ))}
    </div>
  );
}
