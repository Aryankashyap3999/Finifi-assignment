'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCreateSkuMaster } from '@/hooks/useCreateSkuMaster';
import { useUpdateSkuMaster } from '@/hooks/useUpdateSkuMaster';

const EMPTY_FORM = {
  skuErpCode: '',
  name: '',
  eanCode: '',
  hsnCode: '',
  uom: '',
  agreedRate: '',
  mrp: '',
  priceTolerance: ''
};

const toFormValues = (skuMaster) =>
  skuMaster
    ? {
        skuErpCode: skuMaster.skuErpCode ?? '',
        name: skuMaster.name ?? '',
        eanCode: skuMaster.eanCode ?? '',
        hsnCode: skuMaster.hsnCode ?? '',
        uom: skuMaster.uom ?? '',
        agreedRate: skuMaster.agreedRate ?? '',
        mrp: skuMaster.mrp ?? '',
        priceTolerance: skuMaster.priceTolerance ?? ''
      }
    : EMPTY_FORM;

const toPayload = (form) => {
  const payload = { skuErpCode: form.skuErpCode.trim(), name: form.name.trim() };
  if (form.eanCode.trim()) payload.eanCode = form.eanCode.trim();
  if (form.hsnCode.trim()) payload.hsnCode = form.hsnCode.trim();
  if (form.uom.trim()) payload.uom = form.uom.trim();
  if (form.agreedRate !== '') payload.agreedRate = Number(form.agreedRate);
  if (form.mrp !== '') payload.mrp = Number(form.mrp);
  if (form.priceTolerance !== '') payload.priceTolerance = Number(form.priceTolerance);
  return payload;
};

export const SkuMasterFormModal = ({ isOpen, onClose, skuMaster }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEditing = Boolean(skuMaster);
  const createMutation = useCreateSkuMaster();
  const updateMutation = useUpdateSkuMaster();
  const mutation = isEditing ? updateMutation : createMutation;

  useEffect(() => {
    if (isOpen) setForm(toFormValues(skuMaster));
  }, [isOpen, skuMaster]);

  const handleClose = () => {
    mutation.reset();
    onClose();
  };

  const handleChange = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = toPayload(form);
    if (isEditing) {
      updateMutation.mutate({ id: skuMaster._id, data: payload }, { onSuccess: handleClose });
    } else {
      createMutation.mutate(payload, { onSuccess: handleClose });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Edit SKU Master' : 'New SKU Master'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ERP Code" htmlFor="skuErpCode">
            <Input id="skuErpCode" value={form.skuErpCode} onChange={handleChange('skuErpCode')} required />
          </Field>
          <Field label="Name" htmlFor="name">
            <Input id="name" value={form.name} onChange={handleChange('name')} required />
          </Field>
          <Field label="EAN Code" htmlFor="eanCode">
            <Input id="eanCode" value={form.eanCode} onChange={handleChange('eanCode')} />
          </Field>
          <Field label="HSN Code" htmlFor="hsnCode">
            <Input id="hsnCode" value={form.hsnCode} onChange={handleChange('hsnCode')} />
          </Field>
          <Field label="UOM" htmlFor="uom">
            <Input id="uom" value={form.uom} onChange={handleChange('uom')} />
          </Field>
          <Field label="Agreed Rate" htmlFor="agreedRate">
            <Input
              id="agreedRate"
              type="number"
              step="0.01"
              min="0"
              value={form.agreedRate}
              onChange={handleChange('agreedRate')}
            />
          </Field>
          <Field label="MRP" htmlFor="mrp">
            <Input id="mrp" type="number" step="0.01" min="0" value={form.mrp} onChange={handleChange('mrp')} />
          </Field>
          <Field label="Price Tolerance" htmlFor="priceTolerance">
            <Input
              id="priceTolerance"
              type="number"
              step="0.01"
              min="0"
              max="1"
              placeholder="0.05"
              value={form.priceTolerance}
              onChange={handleChange('priceTolerance')}
            />
          </Field>
        </div>

        {mutation.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {mutation.error.message}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEditing ? 'Save changes' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
