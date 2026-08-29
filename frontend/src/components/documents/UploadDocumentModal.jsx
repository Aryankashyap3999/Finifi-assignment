'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useUploadDocument } from '@/hooks/useUploadDocument';

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'po', label: 'Purchase Order' },
  { value: 'grn', label: 'GRN' },
  { value: 'invoice', label: 'Invoice' }
];

export const UploadDocumentModal = ({ isOpen, onClose }) => {
  const [documentType, setDocumentType] = useState('po');
  const [file, setFile] = useState(null);
  const uploadMutation = useUploadDocument();

  const handleClose = () => {
    uploadMutation.reset();
    setFile(null);
    setDocumentType('po');
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) return;
    uploadMutation.mutate({ documentType, file }, { onSuccess: handleClose });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload document">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Document type" htmlFor="documentType">
          <Select
            id="documentType"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
          >
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="File" htmlFor="file">
          <input
            id="file"
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            required
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
          />
        </Field>

        {uploadMutation.isPending && (
          <p className="text-sm text-slate-500">
            Parsing document with Gemini — this can take up to a minute for larger files…
          </p>
        )}

        {uploadMutation.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {uploadMutation.error.message}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={uploadMutation.isPending} disabled={!file}>
            Upload
          </Button>
        </div>
      </form>
    </Modal>
  );
};
