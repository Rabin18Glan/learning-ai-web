import { Crown, Shield } from "lucide-react";
import { JSX } from "react";

interface PlanBadgeProps {
    plan: string;
}



export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
    const getPlanColor = (plan: string): string => {
        switch (plan) {
            case "free": return "bg-gray-100 text-gray-800 border-gray-200";
            case "pro": return "bg-blue-100 text-blue-800 border-blue-200";
            case "premium": return "bg-purple-100 text-purple-800 border-purple-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getPlanIcon = (plan: string): JSX.Element | null => {
        switch (plan) {
            case "premium": return <Crown className="w-3 h-3 mr-1" />;
            case "pro": return <Shield className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border capitalize ${getPlanColor(plan)}`}>
            {getPlanIcon(plan)}
            {plan}
        </span>
    );
};