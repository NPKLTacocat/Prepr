"use server";

import z from "zod";
import { jobInfoSchema } from "./schema";
import { getCurrentUser } from "@/services/lib/getCurrentUser";
import { redirect } from "next/navigation";
import {
  getJobInfo,
  insertJobInfo,
  updateJobInfo as updateJobInfoDb,
} from "./db";

export async function createJobInfo(unsafeData: z.infer<typeof jobInfoSchema>) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to do this action.",
    };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Invalid job data",
    };
  }

  const jobInfo = await insertJobInfo({ ...data, userId });

  redirect(`/app/job-infos/${jobInfo.id}`);
}

export async function updateJobInfo(
  id: string,
  unsafeData: z.infer<typeof jobInfoSchema>,
) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to do this action.",
    };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Invalid job data",
    };
  }

  const jobInfo = await getJobInfo(id, userId);

  if (jobInfo == null) {
    return {
      error: true,
      message: "You don't have permission to do this action.",
    };
  }

  const updatedJobInfo = await updateJobInfoDb(id, data);

  redirect(`/app/job-infos/${updatedJobInfo.id}`);
}
