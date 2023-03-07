export const allowedContext = {
  subject: {
    id: 1234,
  },
  doc: {
    createdBy: 1234,
  },
};

export const deniedContext = {
  subject: {
    groups: ["group5"],
  },
};

export enum Actions {
  create = "create",
  read = "read",
  createDocument = "documents:createDocument",
  readDocument = "documents:readDocument",
  signDocuments = "sign:documents",
}
