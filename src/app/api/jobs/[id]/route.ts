import { AuthService } from '@/infrastructure/supabase/auth/AuthService';
import { JobRepository } from '@/infrastructure/supabase/repositories/JobRepository';
import { DeleteJob } from '@/use-case/jobs/DeleteJob';
import { GetJobById } from '@/use-case/jobs/GetJobById';
import { NextResponse } from 'next/server';

const jobRepository = new JobRepository();
const getJobByIdUseCase = new GetJobById(jobRepository);
const deleteJobUseCase = new DeleteJob(jobRepository);
const authService = new AuthService();

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

// PUT handler to update a job
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    
    // Check if job exists and belongs to the user
    const existingJob = await getJobByIdUseCase.execute(id);
    
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    if (existingJob.userId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to update this job' },
        { status: 403 }
      );
    }
    
    // Update job
    const updateData = await request.json();
    const updatedJob = await jobRepository.update(id, updateData);
    
    return NextResponse.json({ job: updatedJob });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a job
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    
    // Check if job exists and belongs to the user
    const existingJob = await getJobByIdUseCase.execute(id);
    
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    if (existingJob.userId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this job' },
        { status: 403 }
      );
    }
    
    // Delete job
    await deleteJobUseCase.execute(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete job' },
      { status: 500 }
    );
  }
}
