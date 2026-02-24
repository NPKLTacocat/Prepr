import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatters";
import { getCurrentUser } from "@/services/lib/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { ArrowRightIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin"></Loader2Icon>
        </div>
      }
    >
      <JobInfos />
    </Suspense>
  );
}

async function JobInfos() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const jobInfos = await getJobInfos(userId);

  if (jobInfos.length === 0) {
    return <NoJobInfos />;
  }

  return (
    <div className="container my-4">
      <div className="flex gap-2 justify-between mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4"> Your Jobs</h1>
        <Button asChild>
          <Link href={"/app/job-infos/new"}>
            <PlusIcon />
            Create New Jobs
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 hover:*:not-hover:opacity-70">
        {jobInfos.map((jobInfo) => (
          <Link
            className="hover:scale-102 transition-[transform_opacity]"
            key={jobInfo.id}
            href={`/app/job-infos/${jobInfo.id}`}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-4 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{jobInfo.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground line-clamp-3">
                    {jobInfo.description}
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Badge>
                      {formatExperienceLevel(jobInfo.experienceLevel)}
                    </Badge>
                    {jobInfo.title && <Badge>{jobInfo.title}</Badge>}
                  </CardFooter>
                </div>

                <CardContent>
                  <ArrowRightIcon className="size-6"></ArrowRightIcon>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}

        <Link className="transition-opacity" href={"/app/job-infos/new"}>
          <Card className="flex items-center justify-center h-full border-3 border-dashed bg-transparent hover:bg-primary/50 transition-colors shadow-none">
            <CardContent className="flex items-center justify-center gap-4 text-center">
              <PlusIcon className="size-6" />
              <p className="text-lg"> Create New Job</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function NoJobInfos() {
  return (
    <div className="container my-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
        Welcome to Prepr!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        To get started, enter information about the job you&apos;re applying
        for. This can be specific details from the job listing, your resume, or
        any other relevant information. Prepr will use this information to help
        you prepare for your interview by generating potential questions and
        answers, providing feedback on your responses, and offering tips to
        improve your performance. The more detailed the information you provide,
        the better Prepr can assist you in your interview preparation!
      </p>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}

async function getJobInfos(userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(userId));
  return db.query.JobInfoTable.findMany({
    where: eq(JobInfoTable.userId, userId),
    orderBy: desc(JobInfoTable.updatedAt),
  });
}
