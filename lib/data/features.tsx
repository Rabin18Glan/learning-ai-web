import {
    BarChart3,
    Brain,
    FileText,
    MessageSquare,
    Sparkles,
    Zap,
} from "lucide-react";
import { Feature } from "../../types/feature";

export const features: Feature[] = [
    {
        icon: <FileText className="h-6 w-6 text-primary" />,
        title: "Document Analysis",
        description:
            "Upload PDFs, DOCs, and images. Our AI extracts key concepts and creates a knowledge base from your materials.",
        keyFeature: [
            "Multiple file format support",
            "Automatic text extraction",
            "Content organization",
        ],
    },
    {
        icon: <MessageSquare className="h-6 w-6 text-primary" />,
        title: "AI Tutoring",
        description:
            " Chat with an AI tutor that understands your documents and helps you learn through conversation.",
        keyFeature: [
            "Contextual answers",
            "Personalized explanations",
            "24/7 learning assistance",
        ],
    },
    {
        icon: <Brain className="h-6 w-6 text-primary" />,
        title: "Knowledge Visualization",
        description:
            "Visualize complex topics with interactive mind maps and knowledge graphs to enhance understanding.",
        keyFeature: [
            "Interactive mind maps",
            "Concept relationships",
            "Visual learning aids",
        ],
    },
    {
        icon: <Zap className="h-6 w-6 text-primary" />,
        title: "Voice Interaction",
        description:
            "Speak naturally with your AI tutor using advanced voice recognition and text-to-speech technology.",
        keyFeature: [
            "Natural conversations",
            "Hands-free learning",
            "Accessibility support",
        ],
    },
    {
        icon: <Sparkles className="h-6 w-6 text-primary" />,
        title: "Personalized Learning",
        description:
            "Get customized learning paths and recommendations based on your progress and learning style.",
        keyFeature: [
            "Adaptive learning paths",
            " Progress tracking",
            "Smart recommendations",
        ],
    },
    {
        icon: <BarChart3 className="h-6 w-6 text-primary" />,
        title: "Learning Analytics",
        description:
            "Track your learning progress with detailed analytics and insights to optimize your study time.",
        keyFeature: [
            "Performance metrics",
            "Study time analysis",
            "Knowledge gap identification",
        ],
    },
];


export const keyFeatures:Feature[] = features.slice(0,3)