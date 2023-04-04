export const natsWrapper = {
  client: {
    publish: (subject: string, data: string, callback: () => void) => {
      callback();
    },
  },

  connect: (clusterId: string, clientId: string, url: string) => {},
};
