// A raw document's own item may have been resolved retroactively — the match
// engine re-resolves live and doesn't write back to storage (see
// backend/src/services/matchEngine.js). So per-document views key their raw
// items the same way the match engine does, to look up the authoritative
// resolved skuMaster/reasons from the already-fetched match result instead of
// trusting the raw document's own (possibly stale) skuMaster field.
export const keyForDocumentItem = (item) =>
  item.skuMaster ? String(item.skuMaster._id ?? item.skuMaster) : `raw:${item.itemCode.trim().toLowerCase()}`;

export const buildMatchItemLookup = (matchItems) => {
  const map = new Map();
  for (const item of matchItems) {
    map.set(item.key, item);
  }
  return map;
};
