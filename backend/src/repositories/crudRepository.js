import mongoose from 'mongoose';

export default function crudRepository(model) {
    return {
      create: async function (data) {
        const newDoc = await model.create(data);
        return newDoc;
      },
      getAll: async function (filter = {}) {
        const allDocs = await model.find(filter);
        return allDocs;
      },
      getById: async function (id) {
        if (!mongoose.isValidObjectId(id)) return null;
        const doc = await model.findById(id);
        return doc;
      },
      delete: async function (id) {
        if (!mongoose.isValidObjectId(id)) return null;
        const response = await model.findByIdAndDelete(id);
        return response;
      },
      update: async function (id, data) {
        if (!mongoose.isValidObjectId(id)) return null;
        const updatedDoc = await model.findByIdAndUpdate(id, data, {
          returnDocument: 'after'
        });
        return updatedDoc;
      },
      deleteMany: async function (modelIds) {
        const response = await model.deleteMany({
          _id: {
            $in: modelIds
          }
        });
        return response;
      }
    };
  }