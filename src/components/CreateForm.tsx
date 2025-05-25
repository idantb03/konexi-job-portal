import { useState } from 'react';
import { CreateJobRequest } from '@/features/jobs/types';
import { JobTypes } from '@/domain/enums/JobTypes';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';

interface CreateFormProps {
  onSubmit: (data: CreateJobRequest) => Promise<void>;
  onCancel: () => void;
}

export function CreateForm({ onSubmit, onCancel }: CreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: JobTypes.FULL_TIME
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        jobType: JobTypes.FULL_TIME
      });
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-5 bg-gray-50 sm:px-6">
      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <Input
            label="Job Title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
          />

          <Input
            label="Company"
            name="company"
            required
            value={formData.company}
            onChange={handleInputChange}
          />

          <Input
            label="Location"
            name="location"
            required
            value={formData.location}
            onChange={handleInputChange}
          />

          <Select
            label="Job Type"
            name="jobType"
            required
            value={formData.jobType}
            onChange={handleInputChange}
            options={Object.values(JobTypes).map(type => ({
              value: type,
              label: type.replace('_', ' ')
            }))}
          />

          <Textarea
            label="Description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="ml-3"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
