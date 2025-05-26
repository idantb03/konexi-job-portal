import { JobRepository } from '@/infrastructure/supabase/repositories/JobRepository';
import { GetJobById } from '@/use-case/jobs/GetJobById';
import { NextResponse } from 'next/server';

const jobRepository = new JobRepository();
const getJobByIdUseCase = new GetJobById(jobRepository);

// GET handler to fetch a job by id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    const job = await getJobByIdUseCase.execute(id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ job });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch job' },
      { status: 500 }
    );
  }
}
