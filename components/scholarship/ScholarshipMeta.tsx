import { MapPin, GraduationCap, DollarSign, Calendar } from "lucide-react";

interface ScholarshipMetaProps {
  country: string;
  level: string;
  deadline: string;
}

export default function ScholarshipMeta({ scholarship }: { scholarship: ScholarshipMetaProps }) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-4">
      {[
        { icon: MapPin, label: "Negara", value: scholarship.country, color: "bg-blue-50" },
        { icon: GraduationCap, label: "Level", value: scholarship.level, color: "bg-purple-50" },
        { icon: Calendar, label: "Deadline", value: scholarship.deadline, color: "bg-orange-50" },
      ].map((item, i) => (
        <div key={i} className={`rounded-xl ${item.color} p-4 flex items-center gap-3`}>
          <item.icon size={20} />
          <div>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="font-bold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}