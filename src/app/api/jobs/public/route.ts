import { NextResponse } from 'next/server';
import { JobTypes } from '@/domain/enums/JobTypes';
import { JobRepository } from '@/infrastructure/supabase/repositories/JobRepository';
import { ListAllJobs } from '@/use-case/jobs/ListAllJobs';

const jobRepository = new JobRepository();
const listAllJobsUseCase = new ListAllJobs(jobRepository);

// GET handler to fetch all jobs with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType') as JobTypes | null;
    
    const jobs = await listAllJobsUseCase.execute({ location, jobType });
    
    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 