import SkuMaster from '../schemas/skuMaster.js';
import { escapeRegExp } from '../utils/commons/regexUtil.js';
import crudRepository from './crudRepository.js';

const exactCaseInsensitive = (value) => new RegExp(`^${escapeRegExp(value.trim())}$`, 'i');

const skuMasterRepository = {
  ...crudRepository(SkuMaster),
  getByErpCode: (code) => SkuMaster.findOne({ skuErpCode: exactCaseInsensitive(code) }),
  getByEanCode: (code) => SkuMaster.findOne({ eanCode: exactCaseInsensitive(code) })
};

export default skuMasterRepository;
