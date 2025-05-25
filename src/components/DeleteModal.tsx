import { Button } from '@/components/Button';

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this job? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="!bg-red-600 hover:!bg-red-700 focus:!ring-red-500"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
