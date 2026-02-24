import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { getJobInfoIdTag, revalidateJobInfoCache } from "./dbCache";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

export async function insertJobInfo(jobInfo: typeof JobInfoTable.$inferInsert) {
  const [newJobInfo] = await db.insert(JobInfoTable).values(jobInfo).returning({
    userId: JobInfoTable.userId,
    id: JobInfoTable.id,
  });

  revalidateJobInfoCache(newJobInfo);

  return newJobInfo;
}

export async function updateJobInfo(
  id: string,
  jobInfo: Partial<typeof JobInfoTable.$inferInsert>,
) {
  const [updatedJobInfo] = await db
    .update(JobInfoTable)
    .set(jobInfo)
    .where(eq(JobInfoTable.id, id))
    .returning({
      userId: JobInfoTable.userId,
      id: JobInfoTable.id,
    });

  revalidateJobInfoCache(updatedJobInfo);

  return updatedJobInfo;
}

export async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
