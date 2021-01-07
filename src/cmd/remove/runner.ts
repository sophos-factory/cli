import { createCommandResult, handler } from '../handler';

type Arguments = {
  organizationId: string;
  runnerId: string;
};

export default handler<Arguments, any>(
  async (apiClient, { organizationId, runnerId }) => {
    const api = apiClient.runners;

    await api.deleteRunnerAgent(organizationId, runnerId);

    return createCommandResult('view', { _id: runnerId }, ['_id']);
  }
);
