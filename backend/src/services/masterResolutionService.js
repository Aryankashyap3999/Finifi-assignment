import skuMasterRepository from '../repositories/skuMasterRepository.js';

export const resolveSkuMaster = async (itemCode) => {
  if (!itemCode) return null;

  const byErpCode = await skuMasterRepository.getByErpCode(itemCode);
  if (byErpCode) return byErpCode._id;

  const byEanCode = await skuMasterRepository.getByEanCode(itemCode);
  if (byEanCode) return byEanCode._id;

  return null;
};
