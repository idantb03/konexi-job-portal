import { NextResponse } from 'next/server';
import { JobTypes } from '@/domain/enums/JobTypes';
import { JobRepository } from '@/infrastructure/supabase/repositories/JobRepository';
import { ListJobs } from '@/use-case/jobs/ListJobs';
import { CreateJob } from '@/use-case/jobs/CreateJob';
import { AuthService } from '@/infrastructure/supabase/auth/AuthService';

const jobRepository = new JobRepository();
const listJobsUseCase = new ListJobs(jobRepository);
const createJobUseCase = new CreateJob(jobRepository);
const authService = new AuthService();

// GET handler to list jobs for the authenticated user
export async function GET(request: Request) {
  try {
    // Get current user from auth header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const userResponse = await authService.getUserFromToken(token);
    
    if (!userResponse.data) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = userResponse.data.id;
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType') as JobTypes | null;
    
    const jobs = await listJobsUseCase.execute(userId);
    
    // Apply filters manually here if ListJobs doesn't support filtering
    // In a more complete implementation, we might update the ListJobs use case
    // to include filtering as well
    let filteredJobs = jobs;
    
    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (jobType) {
      filteredJobs = filteredJobs.filter(job => 
        job.jobType === jobType
      );
    }
    
    return NextResponse.json({ jobs: filteredJobs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST handler to create a job
export async function POST(request: Request) {
  try {
    // Get current user from auth header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const userResponse = await authService.getUserFromToken(token);
    
    if (!userResponse.data) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = userResponse.data.id;
    const jobData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'description', 'location', 'jobType'];
    const missingFields = requiredFields.filter(field => !jobData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create job with user ID
    const job = await createJobUseCase.execute({
      ...jobData,
      userId
    });
    
    return NextResponse.json({ job }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
}
