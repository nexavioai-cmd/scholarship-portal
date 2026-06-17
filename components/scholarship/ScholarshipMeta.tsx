import { MapPin, GraduationCap, Calendar, Award } from "lucide-react";

interface ScholarshipMetaType {
  country: string;
  level: string;
  deadline: string;
  minimum_gpa?: string;
}

export default function ScholarshipMeta({
  scholarship,
}: {
  scholarship: ScholarshipMetaType;
}) {
  // Mendefinisikan item untuk mapping agar kode lebih bersih
  const items = [
    { icon: MapPin, label: "Negara", value: scholarship.country, color: "bg-blue-50" },
    { icon: GraduationCap, label: "Level", value: scholarship.level, color: "bg-purple-50" },
    { icon: Calendar, label: "Deadline", value: scholarship.deadline, color: "bg-orange-50" },
  ];

  // Menambahkan GPA jika tersedia
  if (scholarship.minimum_gpa) {
    items.push({ 
      icon: Award, 
      label: "Min GPA", 
      value: scholarship.minimum_gpa, 
      color: "bg-green-50" 
    });
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className={`rounded-xl ${item.color} p-4 flex items-center gap-3 border`}>
          <item.icon size={20} className="text-gray-700" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
            <p className="font-bold text-gray-900">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}