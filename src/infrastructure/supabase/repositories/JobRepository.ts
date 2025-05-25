import { supabaseAdmin } from '../client';
import { IJobRepository, JobFilters } from '../../ports/IJobRepository';
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

  async findAll(filters?: JobFilters): Promise<Job[]> {
    let query = supabaseAdmin
      .from(this.tableName)
      .select();
    
    // Apply filters if provided
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters?.jobType) {
      query = query.eq('job_type', filters.jobType);
    }
    
    // Order by newest first
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data.map(this.mapToJob);
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
