import { BackLink } from "@/components/BackLink";
import { Skeleton } from "@/components/Skeleton";
import { SuspendedItem } from "@/components/SuspendedItem";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getJobInfo } from "@/features/jobInfos/db";
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatters";
import { getCurrentUser } from "@/services/lib/getCurrentUser";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const options = [
  {
    label: "Answer Technical Questions",
    description:
      "Challenge yourself with practice questions tailored to your job description",
    href: "questions",
  },
  {
    label: "Practice Interviewing",
    description:
      "Simulate real interview scenarios with AI-powered mock interviews based on your job description",
    href: "interview",
  },
  {
    label: "Refine your resume",
    description:
      "Get a tailored resume review and improvement suggestions based on your job description",
    href: "resume",
  },
  {
    label: "Update Job Description",
    description: "This should only be use for minor updates",
    href: "edit",
  },
];

export default async function JobInfoPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;

  const jobInfo = getCurrentUser().then(
    async ({ userId, redirectToSignIn }) => {
      if (userId == null) return redirectToSignIn();

      const jobInfo = await getJobInfo(jobInfoId, userId);
      if (jobInfo == null) {
        return notFound();
      }

      return jobInfo;
    },
  );

  return (
    <div className="container my-4 space-y-4">
      <BackLink href={"/app"}>Dashboard</BackLink>

      <div className="space-y-6">
        <header className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl">
              <SuspendedItem
                item={jobInfo}
                fallback={<Skeleton className="w-48" />}
                result={(jobInfo) => jobInfo.name}
              ></SuspendedItem>
            </h1>
            <div className="flex gap-2">
              <Badge variant="secondary">
                <SuspendedItem
                  item={jobInfo}
                  fallback={<Skeleton className="w-32" />}
                  result={(jobInfo) =>
                    formatExperienceLevel(jobInfo.experienceLevel)
                  }
                ></SuspendedItem>
              </Badge>
              <SuspendedItem
                item={jobInfo}
                fallback={null}
                result={(jobInfo) => {
                  return (
                    jobInfo.title && (
                      <Badge variant="secondary">{jobInfo.title}</Badge>
                    )
                  );
                }}
              ></SuspendedItem>
            </div>
          </div>
          <p className="text-muted-foreground line-clamp-3">
            <SuspendedItem
              item={jobInfo}
              fallback={<Skeleton className="w-96" />}
              result={(jobInfo) => jobInfo.description}
            ></SuspendedItem>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 hover:*:not-hover:opacity-70">
          {options.map((option) => (
            <Link
              className="hover:scale-102 transition-[transform_opacity]"
              key={option.href}
              href={`/app/job-infos/${jobInfoId}/${option.href}`}
            >
              <Card className="h-full flex items-start justify-between flex-row">
                <CardHeader className="grow">
                  <CardTitle className="text-lg">{option.label}</CardTitle>
                  <CardDescription>{option.description} </CardDescription>
                </CardHeader>

                <CardContent>
                  <ArrowRightIcon className="size-6"></ArrowRightIcon>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
