import { BackLink } from "@/components/BackLink";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { cacheTag } from "next/cache";
import { getJobInfoIdTag } from "../dbCache";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { JobInfoTable } from "@/drizzle/schema";

export function JobInfoBackLink({
  jobInfoId,
  className,
}: {
  jobInfoId: string;
  className?: string;
}) {
  return (
    <BackLink
      href={`/app/job-infos/${jobInfoId}`}
      className={cn("mb-4", className)}
    >
      <Suspense fallback="Job Description">
        <JobName jobInfoId={jobInfoId} />
      </Suspense>
    </BackLink>
  );
}

async function JobName({ jobInfoId }: { jobInfoId: string }) {
  const jobInfo = await getJobInfo(jobInfoId);

  return jobInfo?.name ?? "Job Description";
}

async function getJobInfo(jobInfoId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(jobInfoId));

  return db.query.JobInfoTable.findFirst({
    where: eq(JobInfoTable.id, jobInfoId),
  });
}
