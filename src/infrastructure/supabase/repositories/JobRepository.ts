import { supabaseAdmin } from '../client';
import { IJobRepository, JobFilters, PaginationParams, PaginatedResult } from '../../ports/IJobRepository';
import { Job } from '../../../domain/entities/Job';

export class JobRepository implements IJobRepository {
  private readonly tableName = 'jobs';

  async create(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .insert({
        user_id: job.userId,
        title: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
        job_type: job.jobType,
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapToJob(data);
  }

  async findById(id: string): Promise<Job | null> {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select()
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return this.mapToJob(data);
  }

  async findByUserId(userId: string): Promise<Job[]> {
    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .select()
      .eq('user_id', userId);

    if (error) throw error;

    return data.map(this.mapToJob);
  }

  async findAll(filters?: JobFilters, pagination?: PaginationParams): Promise<PaginatedResult<Job>> {
    const pageSize = pagination?.pageSize || 10;
    const page = pagination?.page || 1;
    
    let query = supabaseAdmin
      .from(this.tableName)
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (filters?.keyword) {
      query = query.or(`title.ilike.%${filters.keyword}%,company.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`);
    }
    
    if (filters?.jobType) {
      query = query.eq('job_type', filters.jobType);
    }
    
    // Get total count first
    const countResult = await query;
    const totalCount = countResult.count || 0;
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize - 1;
    
    // Fetch the paginated data
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);
    
    if (error) throw error;
    
    const totalPages = Math.ceil(totalCount / pageSize);
    
    return {
      data: data.map(this.mapToJob),
      totalCount,
      page,
      pageSize,
      totalPages
    };
  }

  async update(id: string, job: Partial<Omit<Job, 'id' | 'createdAt'>>): Promise<Job> {
    const updateData: any = {};
    if (job.userId) updateData.user_id = job.userId;
    if (job.title) updateData.title = job.title;
    if (job.company) updateData.company = job.company;
    if (job.description) updateData.description = job.description;
    if (job.location) updateData.location = job.location;
    if (job.jobType) updateData.job_type = job.jobType;

    const { data, error } = await supabaseAdmin
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return this.mapToJob(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapToJob(data: any): Job {
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      company: data.company,
      description: data.description,
      location: data.location,
      jobType: data.job_type,
      createdAt: new Date(data.created_at),
    };
  }
}
