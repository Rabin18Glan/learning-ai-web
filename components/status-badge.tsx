interface StatusBadgeProps {
  status: string | boolean;
  type?: string;
}



export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "default" }) => {
  const getStatusColor = (status: string | boolean, type: string): string => {
    if (type === "subscription") {
      switch (status) {
        case "active": return "bg-green-100 text-green-800 border-green-200";
        case "trial": return "bg-blue-100 text-blue-800 border-blue-200";
        case "past_due": return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "canceled": return "bg-red-100 text-red-800 border-red-200";
        case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
        default: return "bg-gray-100 text-gray-800 border-gray-200";
      }
    } else {
      return typeof status === 'boolean' && status
        ? "bg-green-100 text-green-800 border-green-200"
        : "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(status, type)}`}>
      {type === "subscription" ? status : (typeof status === 'boolean' && status ? "Active" : "Inactive")}
    </span>
  );
};