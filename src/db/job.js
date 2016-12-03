const Job = {
  createId: ({ name }) => name.replace(/\W+/g, '-'),
  migrations: [
    function(doc) {
      if (doc.createdAt) {
        return;
      }

      doc.createdAt = doc.updatedAt || new Date().toISOString();
      return [doc];
    }
  ]
};

export default Job;
