"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ScholarshipDetail() {
  const params = useParams();
  const id = params.id;

  const [scholarship, setScholarship] = useState<any>(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("DETAIL ERROR:", error);
      } else {
        console.log("DETAIL DATA:", data);
        setScholarship(data);
      }
    };

    if (id) {
      fetchScholarship();
    }
  }, [id]);

  if (!scholarship) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          ← Kembali ke Daftar
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {scholarship.name || scholarship.title}
              </h1>

              <p className="mt-2 text-lg text-gray-600">
                {scholarship.provider || "-"}
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
              {scholarship.funding_type || "-"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-5">
              <h2 className="mb-4 text-xl font-bold">
                Basic Information
              </h2>

              <p>
                <strong>Country:</strong>{" "}
                {scholarship.country || "-"}
              </p>

              <p>
                <strong>Region:</strong>{" "}
                {scholarship.region || "-"}
              </p>

              <p>
                <strong>Level:</strong>{" "}
                {scholarship.level || "-"}
              </p>

              <p>
                <strong>Deadline:</strong>{" "}
                {scholarship.deadline || "-"}
              </p>

              <p>
                <strong>Intake:</strong>{" "}
                {scholarship.intake || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <h2 className="mb-4 text-xl font-bold">
                Eligibility
              </h2>

              <p>
                <strong>Minimum GPA:</strong>{" "}
                {scholarship.minimum_gpa || "-"}
              </p>

              <p>
                <strong>Maximum Age:</strong>{" "}
                {scholarship.maximum_age || "-"}
              </p>

              <p>
                <strong>Eligible Nationalities:</strong>{" "}
                {scholarship.eligible_nationalities || "-"}
              </p>

              <p>
                <strong>Field of Study:</strong>{" "}
                {scholarship.field_of_study || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <h2 className="mb-4 text-xl font-bold">
                English Requirements
              </h2>

              <p>
                <strong>IELTS:</strong>{" "}
                {scholarship.ielts_requirement || "-"}
              </p>

              <p>
                <strong>TOEFL:</strong>{" "}
                {scholarship.toefl_requirement || "-"}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {scholarship.english_requirement_notes || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <h2 className="mb-4 text-xl font-bold">
                Funding & Documents
              </h2>

              <p>
                <strong>Coverage:</strong>{" "}
                {scholarship.coverage_details || "-"}
              </p>

              <p>
                <strong>Required Documents:</strong>{" "}
                {scholarship.required_documents || "-"}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                {scholarship.amount
                  ? `Rp ${Number(
                      scholarship.amount
                    ).toLocaleString()}`
                  : "-"}
              </p>

              <p>
                <strong>Application Fee:</strong>{" "}
                {scholarship.application_fee || 0}
              </p>
            </div>
          </div>

          {scholarship.official_link && (
            <a
              href={scholarship.official_link}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Official Website →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}