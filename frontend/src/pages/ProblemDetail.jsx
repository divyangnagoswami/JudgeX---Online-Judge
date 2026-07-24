import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../app/layouts/DashboardLayout";

import Card from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import DifficultyBadge from "../components/ui/DifficultyBadge";

import MonacoEditor from "../components/editor/MonacoEditor";
import EditorToolbar from "../components/editor/EditorToolbar";

import {
  getProblemById,
  getProblemStats,
} from "../services/problemService";

import { createSubmission } from "../services/submissionService";

const starterCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}`,

  c: `#include <stdio.h>

int main() {

    return 0;
}`,

  java: `public class Main {

    public static void main(String[] args) {

    }
}`,

  python: `def solve():
    pass

solve()`,

  javascript: `const input = require("fs").readFileSync(0, "utf8");

function solve() {

}

solve();`,
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterCode.cpp);
  const [submitting, setSubmitting] = useState(false);

  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => getProblemById(id),
  });

  const { data: stats } = useQuery({
    queryKey: ["problemStats", id],
    queryFn: () => getProblemStats(id),
  });

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      await createSubmission({ problemId: id, code, language });

      toast.success("Solution submitted");

      // Codeforces-style: land on the submissions list, where the verdict
      // updates live as the judge processes it.
      navigate("/submissions");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-2">

        {/* LEFT — problem statement */}
        <Card className="lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-3xl font-bold text-ink">
              {problem.title}
            </h1>

            <DifficultyBadge difficulty={problem.difficulty} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {problem.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded border border-line px-2.5 py-1 text-xs text-ink-dim"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <p className="whitespace-pre-wrap leading-7 text-ink-dim">
              {problem.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-md border border-line bg-raise p-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Acceptance
              </p>
              <h3 className="mt-2 text-2xl font-bold tabular-nums text-amber">
                {stats?.acceptanceRate || 0}%
              </h3>
            </div>

            <div className="rounded-md border border-line bg-raise p-5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Submissions
              </p>
              <h3 className="mt-2 text-2xl font-bold tabular-nums text-ink">
                {stats?.totalSubmissions || 0}
              </h3>
            </div>
          </div>
        </Card>

        {/* RIGHT — editor */}
        <Card className="overflow-hidden p-0">
          <EditorToolbar
            language={language}
            setLanguage={(newLang) => {
              setLanguage(newLang);
              setCode(starterCode[newLang]);
            }}
            onSubmit={handleSubmit}
            submitting={submitting}
          />

          <MonacoEditor
            language={language}
            code={code}
            setCode={setCode}
          />
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default ProblemDetail;
