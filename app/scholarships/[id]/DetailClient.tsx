"use client";

interface Scholarship {
  id: number;
  name: string;
  provider: string;
  country: string;
  region?: string;
  level: string;
  funding_type: string;
  deadline: string;

  description?: string;

  minimum_gpa?: number | string;
  maximum_age?: number;

  ielts_requirement?: number;
  toefl_requirement?: number;

  work_experience_required?: boolean;
  allows_part_time?: boolean;

  official_link?: string;

  intake?: string;

  coverage_details?: string;
  eligible_nationalities?: string;
  field_of_study?: string;

  english_requirement_notes?: string;

  application_fee?: number;

  interview_required?: boolean;

  recommendation_letters_required?: number;

  required_documents?: string;

  scholarship_type?: string;

  image_url?: string;
}

export default function DetailClient({
  initialData,
  children,
}: {
  initialData: Scholarship;
  children: React.ReactNode;
}) {
  const displayDescription =
    initialData.description?.trim() ||
    `${initialData.name} adalah ${initialData.funding_type} scholarship di ${initialData.country}.`;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white rounded-3xl shadow-sm border p-8">
          <h1 className="text-4xl font-bold">
            {initialData.name}
          </h1>

          <p className="mt-3 text-gray-600">
            Diselenggarakan oleh{" "}
            <span className="font-semibold">
              {initialData.provider}
            </span>
          </p>

          {initialData.official_link && (
            <a
              href={initialData.official_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 px-5 py-3 rounded-xl bg-blue-600 text-white"
            >
              Official Website
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-500 uppercase">
              Country
            </p>
            <p className="font-bold">
              {initialData.country}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-500 uppercase">
              Level
            </p>
            <p className="font-bold">
              {initialData.level}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-500 uppercase">
              Funding
            </p>
            <p className="font-bold">
              {initialData.funding_type}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border">
            <p className="text-xs text-gray-500 uppercase">
              Deadline
            </p>
            <p className="font-bold">
              {initialData.deadline}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Tentang Beasiswa
          </h2>

          <p className="whitespace-pre-line text-gray-700">
            {displayDescription}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Persyaratan
          </h2>

          <div className="space-y-2">
            <p>
              <strong>Minimum GPA:</strong>{" "}
              {initialData.minimum_gpa ?? "-"}
            </p>

            <p>
              <strong>IELTS:</strong>{" "}
              {initialData.ielts_requirement ?? "-"}
            </p>

            <p>
              <strong>TOEFL:</strong>{" "}
              {initialData.toefl_requirement ?? "-"}
            </p>

            <p>
              <strong>Work Experience:</strong>{" "}
              {initialData.work_experience_required
                ? "Required"
                : "No"}
            </p>

            <p>
              <strong>Maximum Age:</strong>{" "}
              {initialData.maximum_age ?? "-"}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-4">
            English Requirement
          </h2>

          <p>
            {initialData.english_requirement_notes ||
              "Not specified"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Coverage
          </h2>

          <p>
            {initialData.coverage_details || "-"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Required Documents
          </h2>

          <p>
            {initialData.required_documents || "-"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Eligibility
          </h2>

          <div className="space-y-2">
            <p>
              <strong>Field of Study:</strong>{" "}
              {initialData.field_of_study || "-"}
            </p>

            <p>
              <strong>Eligible Nationalities:</strong>{" "}
              {initialData.eligible_nationalities || "-"}
            </p>

            <p>
              <strong>Interview:</strong>{" "}
              {initialData.interview_required
                ? "Required"
                : "No"}
            </p>

            <p>
              <strong>Recommendation Letters:</strong>{" "}
              {initialData.recommendation_letters_required ?? 0}
            </p>

            <p>
              <strong>Application Fee:</strong>{" "}
              {initialData.application_fee ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {children}
        </div>
      </div>
    </main>
  );
}