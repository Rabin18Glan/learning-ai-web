"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LearningPath {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
}

export default function EditLearningPath() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState<LearningPath>({
    _id: "",
    title: "",
    description: "",
    tags: [],
    isPublic: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await fetch(`/api/learning-paths/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch learning path");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching learning path:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load learning path. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLearningPath();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/learning-paths/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          isPublic: formData.isPublic,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update learning path");
      }
      toast({
        title: "Success",
        description: "Learning path updated successfully",
      });
      router.push("/learnings");
    } catch (error) {
      console.error("Error updating learning path:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update learning path. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-12">
      <Card className="bg-white border border-gray-200 shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Edit Learning Path</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="text-gray-700">Title</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-gray-700">Description</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="tags" className="text-gray-700">Tags (comma-separated)</label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="isPublic" className="text-gray-700">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                />
                Public
              </label>
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-900 hover:bg-gray-300"
                onClick={() => router.push("/learnings")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}