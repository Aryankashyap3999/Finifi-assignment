import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description, isLoading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p className="text-sm text-slate-600">{description}</p>
    <div className="mt-5 flex justify-end gap-2">
      <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button type="button" variant="danger" onClick={onConfirm} isLoading={isLoading}>
        Delete
      </Button>
    </div>
  </Modal>
);
