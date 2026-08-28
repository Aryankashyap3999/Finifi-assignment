import skuMasterRepository from '../repositories/skuMasterRepository.js';

export const findSkuMaster = async (itemCode) => {
  if (!itemCode) return null;

  const byErpCode = await skuMasterRepository.getByErpCode(itemCode);
  if (byErpCode) return byErpCode;

  const byEanCode = await skuMasterRepository.getByEanCode(itemCode);
  if (byEanCode) return byEanCode;

  return null;
};

export const resolveSkuMaster = async (itemCode) => {
  const sku = await findSkuMaster(itemCode);
  return sku ? sku._id : null;
};
